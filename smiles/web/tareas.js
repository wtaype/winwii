import './tareas.css';
import $ from 'jquery';
import Sortable from 'sortablejs';
import { db } from '../smile/firebase.js';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Notificacion, abrirModal, cerrarModal, getls, savels, wiTip, wiSpin } from '../widev.js';

const CACHE = 'wii_tareas_v1', COL = 'tareas';
const ESTADOS  = { pendiente:'Pendiente', progreso:'En progreso', revision:'Revisión', hecho:'Hecho' };
const EST_ICO  = { pendiente:'fa-circle-dot', progreso:'fa-spinner', revision:'fa-eye', hecho:'fa-circle-check' };
const EST_CLR  = { pendiente:'#FFB800', progreso:'#0EBEFF', revision:'#7000FF', hecho:'#29C72E' };
const EST_NEXT = { pendiente:'progreso', progreso:'revision', revision:'hecho', hecho:'hecho' };
const EST_PREV = { pendiente:'pendiente', progreso:'pendiente', revision:'progreso', hecho:'revision' };
const TIPOS = {
  trabajo:  { label:'Trabajo',  icon:'fa-briefcase', color:'#29C72E' },
  estudio:  { label:'Estudio',  icon:'fa-book',      color:'#7000FF' },
  web:      { label:'Web',      icon:'fa-globe',     color:'#0EBEFF' },
  personal: { label:'Personal', icon:'fa-user',      color:'#FFB800' },
  otros:    { label:'Otros',    icon:'fa-circle',    color:'#94A3B8' },
};
const PRIOS     = { alta:'#FF5C69', media:'#FFB800', baja:'#29C72E' };
const PRIO_SORT = { alta:0, media:1, baja:2 };
const COLORES   = ['#29C72E','#0EBEFF','#7000FF','#FF5C69','#FFB800','#94A3B8'];

const hoy    = () => new Date().toISOString().split('T')[0];
const fmtF   = f => f ? new Date(f+'T00:00:00').toLocaleDateString('es-PE',{day:'numeric',month:'short'}) : '';
const diasR  = f => {
  if (!f) return '';
  const d = Math.ceil((new Date(f+'T00:00:00') - new Date(hoy()+'T00:00:00')) / 864e5);
  return d < 0 ? `<span class="tar_vencido">Vencido ${-d}d</span>` : d===0 ? '<span class="tar_hoy_tag">Hoy</span>' : `${d}d`;
};
const defFecha = () => { const d=new Date(); d.setDate(d.getDate()+7); return d.toISOString().split('T')[0]; };
const mkId = tit => {
  const s=(tit||'tarea').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'').slice(0,25);
  return `${s}_${Date.now()}`;
};

const getUser  = () => getls('wiSmile') || null;
const isLogged = () => !!getUser()?.usuario;
const getAll   = () => getls(CACHE) || [];
const setAll   = l => savels(CACHE, l, 48);

const _sync = s => {
  const $d = $('#tar_sync_dot'); if (!$d.length) return;
  $d[0].className = `tar_sync_dot tar_sync_${s}`;
  const tips = { loading:'Cargando…', ok:'Sincronizado', error:'Sin conexión', saving:'Guardando…' };
  $d.attr('data-witip', tips[s]||'');
};

const toFs = t => { const u=getUser()||{}; const o={...t}; delete o._fsId; return {...o, usuario:u.usuario||'', email:u.email||'', actualizado:serverTimestamp()}; };
const fromFs = (id, d) => ({ ...d, _fsId:id, id });

const _cargar = async (force=false) => {
  if (!force && getAll().length) return _sync('ok');
  if (!isLogged()) return _sync('error');
  _sync('loading');
  try {
    const snap = await getDocs(query(collection(db,COL), where('usuario','==',getUser().usuario)));
    setAll(snap.docs.map(d => fromFs(d.id, d.data())));
    _sync('ok');
  } catch(e) { console.error('❌ tareas:',e); _sync('error'); }
};

const _upsert = t => {
  const list=getAll(), id=t._fsId||mkId(t.titulo), full={...t,_fsId:id,id};
  const idx=list.findIndex(x=>x._fsId===id);
  idx>=0 ? list.splice(idx,1,full) : list.push(full);
  setAll(list);
  if (isLogged()) { _sync('saving'); setDoc(doc(db,COL,id),toFs(full),{merge:true}).then(()=>_sync('ok')).catch(e=>{console.error('❌ upsert:',e);_sync('error');}); }
  return full;
};

const _delete = t => {
  const id=t._fsId||t.id;
  setAll(getAll().filter(x=>x._fsId!==id));
  if (isLogged()) { _sync('saving'); deleteDoc(doc(db,COL,id)).then(()=>_sync('ok')).catch(e=>{console.error('❌ del:',e);_sync('error');}); }
};

const _forceSync = async () => {
  wiSpin('#tar_refresh',true,'');
  localStorage.removeItem(CACHE);
  await _cargar(true);
  _renderBoard();
  wiSpin('#tar_refresh',false,'');
  Notificacion('Tareas actualizadas ✓','success');
};

let _filtro='todos', _busq='', _edit=null, _confirmCb=null, _sortables=[];

const _filtradas = () => {
  let list=getAll();
  if (_filtro!=='todos') list=list.filter(t=>t.estado===_filtro);
  if (_busq) { const q=_busq.toLowerCase(); list=list.filter(t=>(t.titulo||'').toLowerCase().includes(q)); }
  return list;
};

const _quickAdd = () => {
  const titulo=$('#tar_quick_input').val().trim();
  if (!titulo) return Notificacion('Escribe un título','warning');
  const tipo=$('#tar_quick_tipo').val()||'trabajo';
  _upsert({ titulo, fecha:defFecha(), prio:'media', tipo, estado:'pendiente', color:TIPOS[tipo]?.color||COLORES[0], subtareas:[], historial:[], creado:new Date().toISOString() });
  _renderBoard();
  $('#tar_quick_input').val('').focus();
  Notificacion('Tarea creada ✓','success');
};

const _moverEstado = (id, dir) => {
  const t=getAll().find(x=>x._fsId===id); if (!t) return;
  const nuevo=dir==='next'?EST_NEXT[t.estado||'pendiente']:EST_PREV[t.estado||'pendiente'];
  if (nuevo===t.estado) return;
  const hist=t.historial||[];
  hist.push({de:t.estado,a:nuevo,fecha:new Date().toISOString()});
  _upsert({...t,estado:nuevo,historial:hist,completado:nuevo==='hecho'?new Date().toISOString():''});
  _renderBoard();
  const emoji={pendiente:'⏳',progreso:'🔄',revision:'👀',hecho:'✅'}[nuevo];
  Notificacion(`${emoji} ${t.titulo} → ${ESTADOS[nuevo]},'success'`);
};

export const render = () => `
<div class="tar_wrap">
  <div class="tar_toolbar">
    <div class="tar_tb_left">
      <div class="tar_logo"><i class="fas fa-folder-open"></i><span>Mis Tareas</span></div>
    </div>
    <div class="tar_tb_right">
      <div class="tar_resumen" id="tar_resumen">
        <div class="tar_res_item" ${wiTip('Total')}><i class="fas fa-layer-group"></i><strong id="tar_n_total">0</strong><span>Total</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item"><i class="fas fa-circle-dot" style="color:#FFB800"></i><strong id="tar_n_pend">0</strong><span>Pend.</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item"><i class="fas fa-spinner" style="color:#0EBEFF"></i><strong id="tar_n_prog">0</strong><span>Prog.</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item"><i class="fas fa-eye" style="color:#7000FF"></i><strong id="tar_n_rev">0</strong><span>Rev.</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item"><i class="fas fa-circle-check" style="color:#29C72E"></i><strong id="tar_n_done">0</strong><span>Hecho</span></div>
      </div>
    </div>
  </div>

  <div class="tar_actionbar">
    <div class="tar_ab_left">
      <span class="tar_sync_dot tar_sync_loading" id="tar_sync_dot"></span>
      <button class="tar_ab_btn" id="tar_refresh" ${wiTip('Actualizar')}><i class="fas fa-rotate-right"></i></button>
      <div class="tar_quick_wrap">
        <input type="text" class="tar_quick_input" id="tar_quick_input" placeholder="Nueva tarea… (Enter = crear)" maxlength="100"/>
        <select class="tar_quick_select" id="tar_quick_tipo">
          ${Object.entries(TIPOS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
        </select>
        <button class="tar_ab_btn tar_ab_details" id="tar_quick_details" ${wiTip('+ Detalles')}><i class="fas fa-sliders"></i></button>
      </div>
    </div>
    <div class="tar_ab_right">
      <div class="tar_filtros" id="tar_filtros">
        <button class="tar_fil active" data-fil="todos">Todos</button>
        ${Object.entries(ESTADOS).map(([k,v])=>`<button class="tar_fil" data-fil="${k}"><i class="fas ${EST_ICO[k]}" style="color:${EST_CLR[k]}"></i> ${v}</button>`).join('')}
      </div>
      <div class="tar_search_wrap">
        <i class="fas fa-search"></i>
        <input type="text" class="tar_search_input" id="tar_buscar" placeholder="Buscar…"/>
      </div>
    </div>
  </div>

  <div class="tar_board" id="tar_board">
    ${Object.entries(ESTADOS).map(([k,v])=>`
    <div class="tar_col" data-estado="${k}">
      <div class="tar_col_head" style="--ec:${EST_CLR[k]}">
        <div class="tar_col_tit"><i class="fas ${EST_ICO[k]}" style="color:${EST_CLR[k]}"></i><span>${v}</span><span class="tar_col_count" id="tar_count_${k}">0</span></div>
      </div>
      <div class="tar_col_body" id="tar_list_${k}"></div>
    </div>`).join('')}
  </div>
</div>

<div class="wiModal" id="modal_tarea">
  <div class="modalBody tar_modal">
    <button class="modalX"><i class="fas fa-times"></i></button>
    <div class="tar_modal_hero" id="tar_m_hero">
      <div class="tar_modal_ico" id="tar_m_ico"><i class="fas fa-plus-circle"></i></div>
      <div><h2 class="tar_modal_tit" id="tar_m_tit">Nueva Tarea</h2><p class="tar_modal_sub" id="tar_m_sub">Completa los datos</p></div>
    </div>
    <div class="tar_modal_body">
      <div class="tar_field">
        <label class="tar_label"><i class="fas fa-heading"></i> Título <span class="tar_req">*</span></label>
        <div class="tar_input_ico"><i class="fas fa-pen"></i><input type="text" class="tar_input" id="t_titulo" placeholder="Ej: Entregar informe" maxlength="100"/></div>
      </div>
      <div class="tar_field">
        <label class="tar_label"><i class="fas fa-tasks"></i> Subtareas</label>
        <div class="tar_subs_list" id="t_subs_list"></div>
        <button type="button" class="tar_btn_add_sub" id="t_add_sub"><i class="fas fa-plus"></i> Añadir paso</button>
      </div>
      <div class="tar_field_row tar_field_row3">
        <div class="tar_field">
          <label class="tar_label"><i class="fas fa-calendar-day"></i> Límite</label>
          <input type="date" class="tar_input tar_input_plain" id="t_fecha"/>
        </div>
        <div class="tar_field">
          <label class="tar_label"><i class="fas fa-flag"></i> Prioridad</label>
          <select class="tar_select" id="t_prio">
            <option value="alta">🔴 Alta</option>
            <option value="media" selected>🟡 Media</option>
            <option value="baja">🟢 Baja</option>
          </select>
        </div>
        <div class="tar_field">
          <label class="tar_label"><i class="fas fa-signal"></i> Estado</label>
          <select class="tar_select" id="t_estado">
            ${Object.entries(ESTADOS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="tar_field_row tar_field_row_tipo">
        <div class="tar_field">
          <label class="tar_label"><i class="fas fa-tag"></i> Tipo</label>
          <select class="tar_select" id="t_tipo">
            ${Object.entries(TIPOS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
          </select>
        </div>
        <div class="tar_field">
          <label class="tar_label"><i class="fas fa-palette"></i> Color</label>
          <div class="tar_colores" id="t_colores">
            ${COLORES.map(c=>`<button type="button" class="tar_color_opt" data-color="${c}" style="--c:${c}"></button>`).join('')}
          </div>
        </div>
      </div>
      <div class="tar_modal_footer">
        <button type="button" class="tar_btn_del dpn" id="t_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
        <div class="tar_modal_footer_r">
          <button type="button" class="tar_btn_cancel" id="t_cancelar">Cancelar</button>
          <button type="button" class="tar_btn_save" id="t_guardar"><i class="fas fa-floppy-disk"></i> Guardar</button>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_tar_confirm">
  <div class="modalBody tar_modal_confirm">
    <div class="tar_confirm_ico"><i class="fas fa-triangle-exclamation"></i></div>
    <h3>¿Eliminar tarea?</h3>
    <p id="tar_confirm_nombre"></p>
    <div class="tar_confirm_btns">
      <button class="tar_btn_cancel" id="tar_conf_no">Cancelar</button>
      <button class="tar_btn_del_confirm" id="tar_conf_si"><i class="fas fa-trash"></i> Eliminar</button>
    </div>
  </div>
</div>`;

const _renderBoard = () => {
  const list=_filtradas(), all=getAll();
  Object.keys(ESTADOS).forEach(est => {
    const $el=$(`#tar_list_${est}`).empty();
    const items=list.filter(t=>(t.estado||'pendiente')===est).sort((a,b)=>(PRIO_SORT[a.prio]||1)-(PRIO_SORT[b.prio]||1));
    $(`#tar_count_${est}`).text(items.length);
    if (!items.length) { $el.html('<div class="tar_empty"><i class="fas fa-inbox"></i><span>Sin tareas</span></div>'); return; }
    items.forEach(t => {
      const tipo=TIPOS[t.tipo]||TIPOS.trabajo, color=t.color||tipo.color;
      const subs=t.subtareas||[], done=subs.filter(s=>s.done).length;
      const pct=subs.length?Math.round(done/subs.length*100):(est==='hecho'?100:0);
      const canPrev=est!=='pendiente', canNext=est!=='hecho';
      $el.append(`
      <div class="tar_card" data-id="${t._fsId}" style="--tc:${color}">
        <div class="tar_card_top">
          <span class="tar_prio_dot" style="background:${PRIOS[t.prio]||'#FFB800'}"></span>
          <span class="tar_card_titulo">${t.titulo}</span>
          <span class="tar_card_tipo" style="--tag:${tipo.color}"><i class="fas ${tipo.icon}"></i>${tipo.label}</span>
          <button class="tar_card_menu" data-id="${t._fsId}" ${wiTip('Eliminar')}><i class="fas fa-ellipsis-v"></i></button>
        </div>
        ${subs.length?`<div class="tar_card_subs">${subs.map(s=>`<span class="tar_sub_pill${s.done?' tar_sub_done':''}"><i class="fas ${s.done?'fa-check-circle':'fa-circle-dot'}"></i>${s.txt}</span>`).join('')}</div>`:''}
        ${subs.length?`<div class="tar_card_prog"><div class="tar_prog_bar"><div class="tar_prog_fill" style="width:${pct}%;background:${color}"></div></div><span class="tar_prog_txt">${done}/${subs.length}</span></div>`:''}
        <div class="tar_card_bottom">
          <div class="tar_card_meta">${t.fecha?`<span class="tar_meta_fecha"><i class="fas fa-calendar"></i>${fmtF(t.fecha)} ${diasR(t.fecha)}</span>`:''}</div>
          <div class="tar_card_flow">
            <button class="tar_flow_btn ${canPrev?'':'tar_flow_off'}" data-id="${t._fsId}" data-dir="prev" ${wiTip(canPrev?ESTADOS[EST_PREV[est]]:'')}><i class="fas fa-chevron-left"></i></button>
            <span class="tar_flow_estado" style="color:${EST_CLR[est]}"><i class="fas ${EST_ICO[est]}"></i></span>
            <button class="tar_flow_btn ${canNext?'':'tar_flow_off'}" data-id="${t._fsId}" data-dir="next" ${wiTip(canNext?ESTADOS[EST_NEXT[est]]:'')}><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>`);
    });
  });
  $('#tar_n_total').text(all.length);
  $('#tar_n_pend').text(all.filter(t=>(t.estado||'pendiente')==='pendiente').length);
  $('#tar_n_prog').text(all.filter(t=>t.estado==='progreso').length);
  $('#tar_n_rev').text(all.filter(t=>t.estado==='revision').length);
  $('#tar_n_done').text(all.filter(t=>t.estado==='hecho').length);
  _initSortables();
};

const _initSortables = () => {
  _sortables.forEach(s => { try { s?.destroy?.(); } catch(_) {} });
  _sortables = [];
  Object.keys(ESTADOS).forEach(est => {
    const el=document.getElementById(`tar_list_${est}`);
    if (!el) return;
    _sortables.push(new Sortable(el, {
      group:'tareas', animation:150, ghostClass:'tar_ghost', dragClass:'tar_dragging',
      onEnd: evt => {
        const id=evt.item?.dataset?.id, nuevoEstado=evt.to?.id?.replace('tar_list_','');
        if (!id||!nuevoEstado) return;
        const t=getAll().find(x=>x._fsId===id);
        if (!t||t.estado===nuevoEstado) return;
        const hist=t.historial||[];
        hist.push({de:t.estado,a:nuevoEstado,fecha:new Date().toISOString()});
        _upsert({...t,estado:nuevoEstado,historial:hist,completado:nuevoEstado==='hecho'?new Date().toISOString():''});
        _renderBoard();
        const emoji={pendiente:'⏳',progreso:'🔄',revision:'👀',hecho:'✅'}[nuevoEstado];
        Notificacion(`${emoji} Movido a ${ESTADOS[nuevoEstado]}`,'success');
      }
    }));
  });
};

const _selColor = c => { $('#t_colores .tar_color_opt').removeClass('active'); $(`#t_colores .tar_color_opt[data-color="${c}"]`).addClass('active'); };
const _getColor = () => $('#t_colores .tar_color_opt.active').data('color')||COLORES[0];
const _heroColor = (color, icon) => { $('#tar_m_hero').css('background',`linear-gradient(135deg,${color}dd,${color}88)`); $('#tar_m_ico').css('background',color).html(`<i class="fas ${icon}"></i>`); };

const _renderSubs = (list=[]) => {
  const $c=$('#t_subs_list').empty();
  const items=list.length?list:[{txt:'',done:false},{txt:'',done:false},{txt:'',done:false}];
  items.forEach((s,i) => {
    const obj=typeof s==='string'?{txt:s,done:false}:s;
    $c.append(`<div class="tar_sub_row"><div class="tar_sub_check${obj.done?' tar_sub_checked':''}" data-si="${i}"><i class="fas fa-check"></i></div><input type="text" class="tar_sub_input" placeholder="Paso ${i+1}…" value="${obj.txt||''}" maxlength="80"/><button type="button" class="tar_del_sub"><i class="fas fa-times"></i></button></div>`);
  });
};
const _getSubs = () => $('.tar_sub_row').map((_,el)=>{ const txt=$(el).find('.tar_sub_input').val().trim(); const done=$(el).find('.tar_sub_check').hasClass('tar_sub_checked'); return txt?{txt,done}:null; }).get().filter(Boolean);

const _openModal = (d={}) => {
  _edit=d._fsId?d:null;
  const color=d.color||COLORES[0], tipo=d.tipo||'trabajo';
  $('#t_titulo').val(d.titulo||$('#tar_quick_input').val().trim()||'');
  $('#t_fecha').val(d.fecha||defFecha());
  $('#t_prio').val(d.prio||'media');
  $('#t_tipo').val(d.tipo||$('#tar_quick_tipo').val()||tipo);
  $('#t_estado').val(d.estado||'pendiente');
  _renderSubs(d.subtareas||[]);
  _selColor(color);
  _heroColor(color, TIPOS[tipo]?.icon||'fa-plus-circle');
  $('#tar_m_tit').text(_edit?'Editar Tarea':'Nueva Tarea');
  $('#tar_m_sub').text(_edit?'Modifica los datos':'Completa los datos');
  $('#t_eliminar').toggleClass('dpn',!_edit);
  abrirModal('modal_tarea');
  setTimeout(()=>$('#t_titulo').focus(),30);
};

const _guardar = () => {
  const titulo=$('#t_titulo').val().trim();
  if (!titulo) return Notificacion('Título requerido','warning');
  wiSpin('#t_guardar',true,'Guardar');
  _upsert({...(_edit||{}), titulo, fecha:$('#t_fecha').val()||defFecha(), prio:$('#t_prio').val(), tipo:$('#t_tipo').val(), estado:$('#t_estado').val(), color:_getColor(), subtareas:_getSubs(), historial:_edit?.historial||[], creado:_edit?.creado||new Date().toISOString() });
  cerrarModal('modal_tarea');
  _renderBoard();
  $('#tar_quick_input').val('');
  wiSpin('#t_guardar',false,'Guardar');
  Notificacion(_edit?'Tarea actualizada ✓':'Tarea creada ✓','success');
};

const _openConfirm = t => {
  $('#tar_confirm_nombre').text(t.titulo||'Sin título');
  _confirmCb = () => { _delete(t); cerrarModal('modal_tar_confirm'); _renderBoard(); Notificacion('Tarea eliminada ✓','success'); };
  abrirModal('modal_tar_confirm');
};

const _bind = () => {
  $(document).off('.tar');
  const $d=$(document);
  $d.on('keydown.tar','#tar_quick_input', e=>{ if(e.key==='Enter'){e.preventDefault();_quickAdd();} })
    .on('click.tar','#tar_quick_details', ()=>_openModal())
    .on('click.tar','#tar_refresh', _forceSync)
    .on('click.tar','.tar_fil', function(){ _filtro=$(this).data('fil'); $('.tar_fil').removeClass('active'); $(this).addClass('active'); _renderBoard(); })
    .on('input.tar','#tar_buscar', function(){ _busq=$(this).val(); _renderBoard(); })
    .on('click.tar','.tar_card', function(e){ if($(e.target).closest('.tar_card_menu,.tar_flow_btn').length) return; const t=getAll().find(x=>x._fsId===$(this).data('id')); if(t) _openModal(t); })
    .on('click.tar','.tar_card_menu', function(e){ e.stopPropagation(); const t=getAll().find(x=>x._fsId===$(this).data('id')); if(t) _openConfirm(t); })
    .on('click.tar','.tar_flow_btn:not(.tar_flow_off)', function(e){ e.stopPropagation(); _moverEstado($(this).data('id'),$(this).data('dir')); })
    .on('click.tar','#t_colores .tar_color_opt', function(){ _selColor($(this).data('color')); _heroColor($(this).data('color'),TIPOS[$('#t_tipo').val()]?.icon||'fa-plus-circle'); })
    .on('change.tar','#t_tipo', function(){ _heroColor(_getColor(),TIPOS[$(this).val()]?.icon||'fa-plus-circle'); })
    .on('click.tar','#t_add_sub', ()=>{ const n=$('#t_subs_list .tar_sub_row').length+1; $('#t_subs_list').append(`<div class="tar_sub_row"><div class="tar_sub_check" data-si="${n-1}"><i class="fas fa-check"></i></div><input type="text" class="tar_sub_input" placeholder="Paso ${n}…" maxlength="80"/><button type="button" class="tar_del_sub"><i class="fas fa-times"></i></button></div>`); $('#t_subs_list .tar_sub_row:last .tar_sub_input').focus(); })
    .on('click.tar','.tar_sub_check', function(){ $(this).toggleClass('tar_sub_checked'); })
    .on('click.tar','.tar_del_sub', function(){ $(this).closest('.tar_sub_row').remove(); })
    .on('click.tar','#t_cancelar', ()=>cerrarModal('modal_tarea'))
    .on('click.tar','#t_guardar', _guardar)
    .on('click.tar','#t_eliminar', ()=>{ if(_edit){ cerrarModal('modal_tarea'); _openConfirm(_edit); } })
    .on('keydown.tar','#t_titulo', e=>{ if(e.key==='Enter') _guardar(); })
    .on('click.tar','#tar_conf_no', ()=>cerrarModal('modal_tar_confirm'))
    .on('click.tar','#tar_conf_si', ()=>_confirmCb?.());
};

export const init = async () => {
  await _cargar();
  _renderBoard();
  _bind();
  console.log('📋 Tareas v5.0 OK');
};

export const cleanup = () => {
  _sortables.forEach(s=>{ try{ if(s?.el?.parentNode) s.destroy(); }catch(_){} });
  _sortables=[];
  $(document).off('.tar');
  console.log('🧹 Tareas limpiado');
};