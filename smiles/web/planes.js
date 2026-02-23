import './planes.css';
import $ from 'jquery';
import { db } from '../smile/firebase.js';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Notificacion, abrirModal, cerrarModal, getls, savels, wiTip, wiSpin } from '../widev.js';

const CACHE = 'wii_planes_v1', COL = 'planes';

const CATEGORIAS = {
  personal:  { label:'Personal',   icon:'fa-user',          color:'#FFB800' },
  trabajo:   { label:'Trabajo',    icon:'fa-briefcase',     color:'#0EBEFF' },
  estudio:   { label:'Estudio',    icon:'fa-book',          color:'#7000FF' },
  salud:     { label:'Salud',      icon:'fa-heart-pulse',   color:'#FF5C69' },
  finanzas:  { label:'Finanzas',   icon:'fa-coins',         color:'#29C72E' },
  viaje:     { label:'Viaje',      icon:'fa-plane',         color:'#00C9B1' },
  proyecto:  { label:'Proyecto',   icon:'fa-diagram-project',color:'#A855F7' },
  otro:      { label:'Otro',       icon:'fa-circle',        color:'#94A3B8' },
};

const PRIORIDADES = {
  alta:   { label:'Alta',   color:'#FF5C69', icon:'fa-arrow-up'    },
  media:  { label:'Media',  color:'#FFB800', icon:'fa-minus'       },
  baja:   { label:'Baja',   color:'#29C72E', icon:'fa-arrow-down'  },
};

const ESTADOS = {
  activo:     { label:'Activo',      icon:'fa-circle-dot',   color:'#0EBEFF' },
  pausado:    { label:'Pausado',     icon:'fa-pause-circle', color:'#FFB800' },
  completado: { label:'Completado',  icon:'fa-circle-check', color:'#29C72E' },
  cancelado:  { label:'Cancelado',   icon:'fa-circle-xmark', color:'#94A3B8' },
};

const COLORES = ['#0EBEFF','#29C72E','#7000FF','#FF5C69','#FFB800','#00C9B1','#A855F7','#94A3B8'];

const hoy    = () => new Date().toISOString().split('T')[0];
const mkId   = tit => { const s=(tit||'plan').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'').slice(0,25); return `${s}_${Date.now()}`; };
const fmtF   = f => f ? new Date(f+'T00:00:00').toLocaleDateString('es-PE',{day:'numeric',month:'short',year:'numeric'}) : '—';
const diasR  = f => { if(!f) return ''; const d=Math.ceil((new Date(f+'T00:00:00')-new Date(hoy()+'T00:00:00'))/864e5); return d<0?`<span class="pln_vencido">${-d}d atrás</span>`:d===0?'<span class="pln_hoy">Hoy</span>':`<span class="pln_dias">${d}d</span>`; };
const pct    = p => { const t=p.pasos?.length||0, d=p.pasos?.filter(x=>x.done).length||0; return t?Math.round(d/t*100):p.estado==='completado'?100:0; };

const getUser  = () => getls('wiSmile')||null;
const isLogged = () => !!getUser()?.usuario;
const getAll   = () => getls(CACHE)||[];
const setAll   = l => savels(CACHE,l,48);

const _sync = s => { const $d=$('#pln_sync'); if(!$d.length) return; $d[0].className=`pln_sync_dot pln_sync_${s}`; };

const _cargar = async (force=false) => {
  if (!force&&getAll().length) return _sync('ok');
  if (!isLogged()) return _sync('error');
  _sync('loading');
  try {
    const snap=await getDocs(query(collection(db,COL),where('usuario','==',getUser().usuario)));
    setAll(snap.docs.map(d=>({...d.data(),_fsId:d.id,id:d.id})));
    _sync('ok');
  } catch(e) { console.error('❌ planes:',e); _sync('error'); }
};

const _upsert = p => {
  const list=getAll(), id=p._fsId||mkId(p.titulo), full={...p,_fsId:id,id};
  const idx=list.findIndex(x=>x._fsId===id);
  idx>=0?list.splice(idx,1,full):list.push(full);
  setAll(list);
  if (isLogged()) {
    _sync('saving');
    const u=getUser()||{}; const o={...full}; delete o._fsId;
    setDoc(doc(db,COL,id),{...o,usuario:u.usuario||'',email:u.email||'',actualizado:serverTimestamp()},{merge:true})
      .then(()=>_sync('ok')).catch(e=>{console.error('❌ upsert:',e);_sync('error');});
  }
  return full;
};

const _delete = p => {
  const id=p._fsId||p.id;
  setAll(getAll().filter(x=>x._fsId!==id));
  if (isLogged()) { _sync('saving'); deleteDoc(doc(db,COL,id)).then(()=>_sync('ok')).catch(e=>{console.error('❌ del:',e);_sync('error');}); }
};

let _filtro='todos', _busq='', _edit=null, _confirmCb=null, _vista='grid';

const _filtrados = () => {
  let list=getAll();
  if (_filtro!=='todos') list=list.filter(p=>p.estado===_filtro||p.categoria===_filtro);
  if (_busq) { const q=_busq.toLowerCase(); list=list.filter(p=>(p.titulo||'').toLowerCase().includes(q)||(p.descripcion||'').toLowerCase().includes(q)); }
  return list.sort((a,b)=>{ const pa={alta:0,media:1,baja:2}; return (pa[a.prioridad]||1)-(pa[b.prioridad]||1); });
};

export const render = () => `
<div class="pln_wrap">
  <div class="pln_toolbar">
    <div class="pln_tb_left">
      <div class="pln_logo"><i class="fas fa-rocket"></i><span>Mis Planes</span></div>
    </div>
    <div class="pln_tb_right">
      <div class="pln_resumen" id="pln_resumen">
        <div class="pln_res_item"><i class="fas fa-layer-group" style="color:var(--mco)"></i><strong id="pln_n_total">0</strong><span>Total</span></div>
        <div class="pln_res_sep"></div>
        <div class="pln_res_item"><i class="fas fa-circle-dot" style="color:#0EBEFF"></i><strong id="pln_n_activo">0</strong><span>Activos</span></div>
        <div class="pln_res_sep"></div>
        <div class="pln_res_item"><i class="fas fa-pause-circle" style="color:#FFB800"></i><strong id="pln_n_pausado">0</strong><span>Pausados</span></div>
        <div class="pln_res_sep"></div>
        <div class="pln_res_item"><i class="fas fa-circle-check" style="color:#29C72E"></i><strong id="pln_n_comp">0</strong><span>Hechos</span></div>
      </div>
    </div>
  </div>

  <div class="pln_actionbar">
    <div class="pln_ab_left">
      <span class="pln_sync_dot pln_sync_loading" id="pln_sync"></span>
      <button class="pln_ab_btn" id="pln_refresh" ${wiTip('Actualizar')}><i class="fas fa-rotate-right"></i></button>
      <button class="pln_ab_btn pln_ab_nuevo" id="pln_nuevo"><i class="fas fa-plus"></i> Nuevo plan</button>
    </div>
    <div class="pln_ab_right">
      <div class="pln_filtros" id="pln_filtros">
        <button class="pln_fil active" data-fil="todos">Todos</button>
        ${Object.entries(ESTADOS).map(([k,v])=>`<button class="pln_fil" data-fil="${k}" style="--fc:${v.color}"><i class="fas ${v.icon}"></i> ${v.label}</button>`).join('')}
      </div>
      <div class="pln_search_wrap">
        <i class="fas fa-search"></i>
        <input type="text" class="pln_search_input" id="pln_buscar" placeholder="Buscar…"/>
      </div>
      <div class="pln_vista_btns">
        <button class="pln_vista_btn active" data-vista="grid" ${wiTip('Cuadrícula')}><i class="fas fa-grid-2"></i></button>
        <button class="pln_vista_btn" data-vista="list" ${wiTip('Lista')}><i class="fas fa-list"></i></button>
      </div>
    </div>
  </div>

  <div class="pln_content" id="pln_content"></div>
</div>

<div class="wiModal" id="modal_plan">
  <div class="modalBody pln_modal">
    <button class="modalX"><i class="fas fa-times"></i></button>
    <div class="pln_modal_hero" id="pln_m_hero">
      <div class="pln_modal_ico" id="pln_m_ico"><i class="fas fa-rocket"></i></div>
      <div><h2 class="pln_modal_tit" id="pln_m_tit">Nuevo Plan</h2><p class="pln_modal_sub" id="pln_m_sub">Define tu objetivo</p></div>
    </div>
    <div class="pln_modal_body">
      <div class="pln_field">
        <label class="pln_label"><i class="fas fa-heading"></i> Título <span class="pln_req">*</span></label>
        <div class="pln_input_ico"><i class="fas fa-pen"></i><input type="text" class="pln_input" id="p_titulo" placeholder="Ej: Aprender inglés" maxlength="80"/></div>
      </div>
      <div class="pln_field">
        <label class="pln_label"><i class="fas fa-align-left"></i> Descripción</label>
        <textarea class="pln_textarea" id="p_desc" placeholder="¿En qué consiste tu plan?" maxlength="300" rows="2"></textarea>
      </div>
      <div class="pln_field">
        <label class="pln_label"><i class="fas fa-list-check"></i> Pasos</label>
        <div class="pln_pasos_list" id="p_pasos_list"></div>
        <button type="button" class="pln_btn_add_paso" id="p_add_paso"><i class="fas fa-plus"></i> Añadir paso</button>
      </div>
      <div class="pln_field_row pln_field_row3">
        <div class="pln_field">
          <label class="pln_label"><i class="fas fa-calendar"></i> Inicio</label>
          <input type="date" class="pln_input pln_input_plain" id="p_inicio"/>
        </div>
        <div class="pln_field">
          <label class="pln_label"><i class="fas fa-flag-checkered"></i> Meta</label>
          <input type="date" class="pln_input pln_input_plain" id="p_meta"/>
        </div>
        <div class="pln_field">
          <label class="pln_label"><i class="fas fa-signal"></i> Estado</label>
          <select class="pln_select" id="p_estado">
            ${Object.entries(ESTADOS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="pln_field_row pln_field_row3">
        <div class="pln_field">
          <label class="pln_label"><i class="fas fa-tag"></i> Categoría</label>
          <select class="pln_select" id="p_cat">
            ${Object.entries(CATEGORIAS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
          </select>
        </div>
        <div class="pln_field">
          <label class="pln_label"><i class="fas fa-flag"></i> Prioridad</label>
          <select class="pln_select" id="p_prio">
            ${Object.entries(PRIORIDADES).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
          </select>
        </div>
        <div class="pln_field">
          <label class="pln_label"><i class="fas fa-palette"></i> Color</label>
          <div class="pln_colores" id="p_colores">
            ${COLORES.map(c=>`<button type="button" class="pln_color_opt" data-color="${c}" style="--c:${c}"></button>`).join('')}
          </div>
        </div>
      </div>
      <div class="pln_modal_footer">
        <button type="button" class="pln_btn_del dpn" id="p_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
        <div class="pln_modal_footer_r">
          <button type="button" class="pln_btn_cancel" id="p_cancelar">Cancelar</button>
          <button type="button" class="pln_btn_save" id="p_guardar"><i class="fas fa-floppy-disk"></i> Guardar</button>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_pln_confirm">
  <div class="modalBody pln_modal_confirm">
    <div class="pln_confirm_ico"><i class="fas fa-triangle-exclamation"></i></div>
    <h3>¿Eliminar plan?</h3>
    <p id="pln_confirm_nombre"></p>
    <div class="pln_confirm_btns">
      <button class="pln_btn_cancel" id="pln_conf_no">Cancelar</button>
      <button class="pln_btn_del_confirm" id="pln_conf_si"><i class="fas fa-trash"></i> Eliminar</button>
    </div>
  </div>
</div>`;

const _renderContent = () => {
  const list=_filtrados(), all=getAll();
  const $c=$('#pln_content').empty().attr('class',`pln_content pln_${_vista}`);

  $('#pln_n_total').text(all.length);
  $('#pln_n_activo').text(all.filter(p=>p.estado==='activo').length);
  $('#pln_n_pausado').text(all.filter(p=>p.estado==='pausado').length);
  $('#pln_n_comp').text(all.filter(p=>p.estado==='completado').length);

  if (!list.length) {
    $c.html(`<div class="pln_empty"><i class="fas fa-rocket"></i><h3>Sin planes aún</h3><p>Crea tu primer plan y empieza a avanzar hacia tus metas</p><button class="pln_btn_save" id="pln_empty_nuevo"><i class="fas fa-plus"></i> Crear plan</button></div>`);
    return;
  }

  list.forEach(p => {
    const cat=CATEGORIAS[p.categoria]||CATEGORIAS.otro;
    const est=ESTADOS[p.estado]||ESTADOS.activo;
    const prio=PRIORIDADES[p.prioridad]||PRIORIDADES.media;
    const color=p.color||cat.color;
    const progreso=pct(p);
    const pasos=p.pasos||[], doneP=pasos.filter(x=>x.done).length;
    const completado=p.estado==='completado';

    $c.append(`
    <div class="pln_card${completado?' pln_card_done':''}" data-id="${p._fsId}" style="--pc:${color}">
      <div class="pln_card_header">
        <div class="pln_card_ico" style="background:${color}"><i class="fas ${cat.icon}"></i></div>
        <div class="pln_card_head_info">
          <div class="pln_card_titulo">${p.titulo}</div>
          <div class="pln_card_badges">
            <span class="pln_badge_est" style="--ec:${est.color}"><i class="fas ${est.icon}"></i>${est.label}</span>
            <span class="pln_badge_prio" style="--rc:${prio.color}"><i class="fas ${prio.icon}"></i>${prio.label}</span>
            <span class="pln_badge_cat" style="--cc:${cat.color}"><i class="fas ${cat.icon}"></i>${cat.label}</span>
          </div>
        </div>
        <button class="pln_card_opts" data-id="${p._fsId}" ${wiTip('Opciones')}><i class="fas fa-ellipsis-v"></i></button>
      </div>
      ${p.descripcion?`<p class="pln_card_desc">${p.descripcion}</p>`:''}
      <div class="pln_card_prog">
        <div class="pln_prog_header">
          <span class="pln_prog_label"><i class="fas fa-chart-line"></i> Progreso</span>
          <span class="pln_prog_pct">${progreso}%</span>
        </div>
        <div class="pln_prog_track"><div class="pln_prog_fill" style="width:${progreso}%;background:${color}"></div></div>
        ${pasos.length?`<div class="pln_pasos_mini">${pasos.map(s=>`<span class="pln_paso_dot${s.done?' pln_paso_done':''}" title="${s.txt}"></span>`).join('')}</div>`:''}
      </div>
      ${pasos.length?`<div class="pln_card_pasos_preview">${pasos.slice(0,3).map(s=>`<div class="pln_paso_item${s.done?' pln_paso_item_done':''}"><i class="fas ${s.done?'fa-circle-check':'fa-circle-dot'}"></i><span>${s.txt}</span></div>`).join('')}${pasos.length>3?`<div class="pln_paso_more">+${pasos.length-3} más</div>`:''}</div>`:''}
      <div class="pln_card_footer">
        <div class="pln_card_fechas">
          ${p.inicio?`<span><i class="fas fa-play"></i>${fmtF(p.inicio)}</span>`:''}
          ${p.meta?`<span class="pln_card_meta_fecha"><i class="fas fa-flag-checkered"></i>${fmtF(p.meta)} ${diasR(p.meta)}</span>`:''}
        </div>
        <div class="pln_card_actions">
          ${p.estado!=='completado'?`<button class="pln_action_btn pln_action_check" data-id="${p._fsId}" ${wiTip('Completar')}><i class="fas fa-check"></i></button>`:''}
          <button class="pln_action_btn pln_action_edit" data-id="${p._fsId}" ${wiTip('Editar')}><i class="fas fa-pen"></i></button>
        </div>
      </div>
    </div>`);
  });
};

const _renderPasos = (list=[]) => {
  const $c=$('#p_pasos_list').empty();
  const items=list.length?list:[{txt:'',done:false},{txt:'',done:false}];
  items.forEach((s,i)=>{
    const obj=typeof s==='string'?{txt:s,done:false}:s;
    $c.append(`<div class="pln_paso_row"><div class="pln_paso_check${obj.done?' pln_paso_checked':''}" data-pi="${i}"><i class="fas fa-check"></i></div><input type="text" class="pln_paso_input" placeholder="Paso ${i+1}…" value="${obj.txt||''}" maxlength="80"/><button type="button" class="pln_del_paso"><i class="fas fa-times"></i></button></div>`);
  });
};
const _getPasos = () => $('.pln_paso_row').map((_,el)=>{ const txt=$(el).find('.pln_paso_input').val().trim(); const done=$(el).find('.pln_paso_check').hasClass('pln_paso_checked'); return txt?{txt,done}:null; }).get().filter(Boolean);

const _selColor = c => { $('#p_colores .pln_color_opt').removeClass('active'); $(`#p_colores .pln_color_opt[data-color="${c}"]`).addClass('active'); };
const _getColor = () => $('#p_colores .pln_color_opt.active').data('color')||COLORES[0];
const _heroColor = (color,icon) => { $('#pln_m_hero').css('background',`linear-gradient(135deg,${color}dd,${color}88)`); $('#pln_m_ico').css('background',color).html(`<i class="fas ${icon}"></i>`); };

const _openModal = (d={}) => {
  _edit=d._fsId?d:null;
  const cat=d.categoria||'personal', color=d.color||CATEGORIAS[cat]?.color||COLORES[0];
  $('#p_titulo').val(d.titulo||'');
  $('#p_desc').val(d.descripcion||'');
  $('#p_inicio').val(d.inicio||hoy());
  $('#p_meta').val(d.meta||'');
  $('#p_estado').val(d.estado||'activo');
  $('#p_cat').val(cat);
  $('#p_prio').val(d.prioridad||'media');
  _renderPasos(d.pasos||[]);
  _selColor(color);
  _heroColor(color, CATEGORIAS[cat]?.icon||'fa-rocket');
  $('#pln_m_tit').text(_edit?'Editar Plan':'Nuevo Plan');
  $('#pln_m_sub').text(_edit?'Modifica tu plan':'Define tu objetivo');
  $('#p_eliminar').toggleClass('dpn',!_edit);
  abrirModal('modal_plan');
  setTimeout(()=>$('#p_titulo').focus(),30);
};

const _guardar = () => {
  const titulo=$('#p_titulo').val().trim();
  if (!titulo) return Notificacion('Título requerido','warning');
  wiSpin('#p_guardar',true,'Guardar');
  const cat=$('#p_cat').val();
  _upsert({ ...(_edit||{}), titulo, descripcion:$('#p_desc').val().trim(), inicio:$('#p_inicio').val()||hoy(), meta:$('#p_meta').val()||'', estado:$('#p_estado').val(), categoria:cat, prioridad:$('#p_prio').val(), color:_getColor(), pasos:_getPasos(), creado:_edit?.creado||new Date().toISOString() });
  cerrarModal('modal_plan');
  _renderContent();
  wiSpin('#p_guardar',false,'Guardar');
  Notificacion(_edit?'Plan actualizado ✓':'Plan creado ✓','success');
};

const _completar = id => {
  const p=getAll().find(x=>x._fsId===id); if(!p) return;
  const pasos=(p.pasos||[]).map(s=>({...s,done:true}));
  _upsert({...p,estado:'completado',pasos,completadoEn:new Date().toISOString()});
  _renderContent();
  Notificacion('🎉 ¡Plan completado!','success');
};

const _openConfirm = p => {
  $('#pln_confirm_nombre').text(p.titulo||'Sin título');
  _confirmCb=()=>{ _delete(p); cerrarModal('modal_pln_confirm'); _renderContent(); Notificacion('Plan eliminado ✓','success'); };
  abrirModal('modal_pln_confirm');
};

const _bind = () => {
  $(document).off('.pln');
  const $d=$(document);
  $d.on('click.pln','#pln_nuevo,#pln_empty_nuevo', ()=>_openModal())
    .on('click.pln','#pln_refresh', async ()=>{ wiSpin('#pln_refresh',true,''); localStorage.removeItem(CACHE); await _cargar(true); _renderContent(); wiSpin('#pln_refresh',false,''); Notificacion('Planes actualizados ✓','success'); })
    .on('click.pln','.pln_fil', function(){ _filtro=$(this).data('fil'); $('.pln_fil').removeClass('active'); $(this).addClass('active'); _renderContent(); })
    .on('input.pln','#pln_buscar', function(){ _busq=$(this).val(); _renderContent(); })
    .on('click.pln','.pln_vista_btn', function(){ _vista=$(this).data('vista'); $('.pln_vista_btn').removeClass('active'); $(this).addClass('active'); _renderContent(); })
    .on('click.pln','.pln_card', function(e){ if($(e.target).closest('.pln_card_opts,.pln_action_btn').length) return; const p=getAll().find(x=>x._fsId===$(this).data('id')); if(p) _openModal(p); })
    .on('click.pln','.pln_action_edit', function(e){ e.stopPropagation(); const p=getAll().find(x=>x._fsId===$(this).data('id')); if(p) _openModal(p); })
    .on('click.pln','.pln_action_check', function(e){ e.stopPropagation(); _completar($(this).data('id')); })
    .on('click.pln','.pln_card_opts', function(e){ e.stopPropagation(); const p=getAll().find(x=>x._fsId===$(this).data('id')); if(p) _openConfirm(p); })
    .on('change.pln','#p_cat', function(){ const cat=$(this).val(); _heroColor(_getColor(),CATEGORIAS[cat]?.icon||'fa-rocket'); })
    .on('click.pln','#p_colores .pln_color_opt', function(){ _selColor($(this).data('color')); _heroColor($(this).data('color'),CATEGORIAS[$('#p_cat').val()]?.icon||'fa-rocket'); })
    .on('click.pln','#p_add_paso', ()=>{ const n=$('#p_pasos_list .pln_paso_row').length+1; $('#p_pasos_list').append(`<div class="pln_paso_row"><div class="pln_paso_check" data-pi="${n-1}"><i class="fas fa-check"></i></div><input type="text" class="pln_paso_input" placeholder="Paso ${n}…" maxlength="80"/><button type="button" class="pln_del_paso"><i class="fas fa-times"></i></button></div>`); $('#p_pasos_list .pln_paso_row:last .pln_paso_input').focus(); })
    .on('click.pln','.pln_paso_check', function(){ $(this).toggleClass('pln_paso_checked'); })
    .on('click.pln','.pln_del_paso', function(){ $(this).closest('.pln_paso_row').remove(); })
    .on('click.pln','#p_cancelar', ()=>cerrarModal('modal_plan'))
    .on('click.pln','#p_guardar', _guardar)
    .on('click.pln','#p_eliminar', ()=>{ if(_edit){ cerrarModal('modal_plan'); _openConfirm(_edit); } })
    .on('keydown.pln','#p_titulo', e=>{ if(e.key==='Enter') _guardar(); })
    .on('click.pln','#pln_conf_no', ()=>cerrarModal('modal_pln_confirm'))
    .on('click.pln','#pln_conf_si', ()=>_confirmCb?.());
};

export const init = async () => {
  await _cargar();
  _renderContent();
  _bind();
  console.log('🚀 Planes v1.0 OK');
};

export const cleanup = () => {
  $(document).off('.pln');
  console.log('🧹 Planes limpiado');
};