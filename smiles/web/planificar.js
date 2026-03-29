import './planificar.css';
import $ from 'jquery';
import Sortable from 'sortablejs';
import { db } from '../smile/firebase.js';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Notificacion, abrirModal, cerrarModal, getls, savels, wiTip, wiSpin, wiAuth } from '../widev.js';

/* ══════════════════════════════════════════════════════════════
   TAREAS v6.0 PRO — Scrum Board con UX Profesional
   ✨ Atajos de teclado · Undo · Filtros avanzados · Confetti
══════════════════════════════════════════════════════════════ */

const CACHE = 'wii_tareas_v1', COL = 'tareas';
const ESTADOS  = { pendiente:'Pendiente', progreso:'En progreso', revision:'Revisión', hecho:'Hecho' };
const EST_ICO  = { pendiente:'fa-circle-dot', progreso:'fa-spinner fa-pulse', revision:'fa-eye', hecho:'fa-circle-check' };
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

// Utilidades de fecha
const hoy    = () => new Date().toISOString().split('T')[0];
const fmtF   = f => f ? new Date(f+'T00:00:00').toLocaleDateString('es-PE',{day:'numeric',month:'short'}) : '';
const diasR  = f => {
  if (!f) return '';
  const d = Math.ceil((new Date(f+'T00:00:00') - new Date(hoy()+'T00:00:00')) / 864e5);
  if (d < 0) return `<span class="tar_vencido"><i class="fas fa-exclamation-triangle"></i> ${-d}d</span>`;
  if (d === 0) return '<span class="tar_hoy_tag"><i class="fas fa-bolt"></i> Hoy</span>';
  if (d <= 3) return `<span class="tar_hoy_tag">${d}d</span>`;
  return `${d}d`;
};
const defFecha = () => { const d=new Date(); d.setDate(d.getDate()+7); return d.toISOString().split('T')[0]; };
const mkId = tit => {
  const s=(tit||'tarea').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'').slice(0,25);
  return `${s}_${Date.now()}`;
};

// Auth helpers
const getUser  = () => getls('wiSmile') || null;
const isLogged = () => !!getUser()?.usuario;
const getAll   = () => getls(CACHE) || [];
const setAll   = l => savels(CACHE, l, 48);

// Sync indicator
const _sync = s => {
  const $d = $('#tar_sync_dot'); if (!$d.length) return;
  $d[0].className = `tar_sync_dot tar_sync_${s}`;
  const tips = { loading:'Cargando…', ok:'Sincronizado ✓', error:'Sin conexión', saving:'Guardando…' };
  $d.attr('data-witip', tips[s]||'');
};

// Firebase helpers
const toFs = t => { const u=getUser()||{}; const o={...t}; delete o._fsId; return {...o, usuario:u.usuario||'', email:u.email||'', actualizado:serverTimestamp()}; };
const fromFs = (id, d) => ({ ...d, _fsId:id, id });

// Cargar tareas
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

// CRUD operations
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

// Force sync
const _forceSync = async () => {
  wiSpin('#tar_refresh',true,'');
  localStorage.removeItem(CACHE);
  await _cargar(true);
  _renderBoard();
  wiSpin('#tar_refresh',false,'');
  Notificacion('✓ Tareas actualizadas','success');
};

// State
let _filtro='todos', _filtroPrio='todos', _filtroTipo='todos', _busq='', _edit=null, _confirmCb=null, _sortables=[];
let _undoStack = [], _undoTimeout = null;

// Debounce for search
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

// Filtrar tareas
const _filtradas = () => {
  let list=getAll();
  if (_filtro!=='todos') list=list.filter(t=>(t.estado||'pendiente')===_filtro);
  if (_filtroPrio!=='todos') list=list.filter(t=>t.prio===_filtroPrio);
  if (_filtroTipo!=='todos') list=list.filter(t=>t.tipo===_filtroTipo);
  if (_busq) { const q=_busq.toLowerCase(); list=list.filter(t=>(t.titulo||'').toLowerCase().includes(q)||(t.tipo||'').toLowerCase().includes(q)); }
  return list;
};

// Quick add
const _quickAdd = () => {
  const titulo=$('#tar_quick_input').val().trim();
  if (!titulo) return Notificacion('Escribe un título','warning');
  const tipo=$('#tar_quick_tipo').val()||'trabajo';
  const tarea = _upsert({ titulo, fecha:defFecha(), prio:'media', tipo, estado:'pendiente', color:TIPOS[tipo]?.color||COLORES[0], subtareas:[], historial:[], creado:new Date().toISOString() });
  _renderBoard();
  $('#tar_quick_input').val('').focus();
  Notificacion('✓ Tarea creada','success');
  _showKbdHint();
};

// Mover estado con animación
const _moverEstado = (id, dir) => {
  const t=getAll().find(x=>x._fsId===id); if (!t) return;
  const nuevo=dir==='next'?EST_NEXT[t.estado||'pendiente']:EST_PREV[t.estado||'pendiente'];
  if (nuevo===t.estado) return;
  const hist=t.historial||[];
  hist.push({de:t.estado,a:nuevo,fecha:new Date().toISOString()});
  const wasCompleted = t.estado === 'hecho';
  const isCompleting = nuevo === 'hecho';
  _upsert({...t,estado:nuevo,historial:hist,completado:isCompleting?new Date().toISOString():''});
  _renderBoard();
  const emoji={pendiente:'⏳',progreso:'🔄',revision:'👀',hecho:'🎉'}[nuevo];
  Notificacion(`${emoji} ${t.titulo} → ${ESTADOS[nuevo]}`, 'success');
  
  // Confetti al completar
  if (isCompleting && !wasCompleted) _triggerConfetti();
};

// Confetti effect
const _triggerConfetti = () => {
  const $container = $('<div class="tar_confetti"></div>').appendTo('body');
  const colors = ['#29C72E','#0EBEFF','#7000FF','#FF5C69','#FFB800'];
  for (let i = 0; i < 30; i++) {
    const color = colors[Math.floor(Math.random()*colors.length)];
    const x = (Math.random() - 0.5) * 200;
    const delay = Math.random() * 0.3;
    $(`<div class="tar_confetti_piece" style="background:${color};left:${x}px;animation-delay:${delay}s"></div>`).appendTo($container);
  }
  setTimeout(() => $container.remove(), 1500);
};

// Undo system
const _showUndo = (tarea, action='eliminar') => {
  clearTimeout(_undoTimeout);
  _undoStack.push({tarea, action});
  
  let $toast = $('#tar_undo_toast');
  if (!$toast.length) {
    $toast = $(`<div class="tar_undo_toast" id="tar_undo_toast">
      <span><i class="fas fa-trash"></i> Tarea eliminada</span>
      <button class="tar_undo_btn" id="tar_undo_btn"><i class="fas fa-undo"></i> Deshacer</button>
    </div>`).appendTo('.tar_wrap');
  }
  
  requestAnimationFrame(() => $toast.addClass('show'));
  
  _undoTimeout = setTimeout(() => {
    $toast.removeClass('show');
    _undoStack = [];
  }, 5000);
};

const _undoDelete = () => {
  if (!_undoStack.length) return;
  const last = _undoStack.pop();
  if (last.action === 'eliminar') {
    _upsert(last.tarea);
    _renderBoard();
    Notificacion('✓ Tarea restaurada', 'success');
  }
  clearTimeout(_undoTimeout);
  $('#tar_undo_toast').removeClass('show');
};

// Keyboard hints
const _showKbdHint = () => {
  let $hint = $('.tar_kbd_hint');
  if (!$hint.length) {
    $hint = $(`<div class="tar_kbd_hint">
      <span class="tar_kbd">N</span> Nueva
      <span class="tar_kbd">/</span> Buscar
      <span class="tar_kbd">?</span> Ayuda
    </div>`).appendTo('.tar_wrap');
  }
  $hint.addClass('show');
  setTimeout(() => $hint.removeClass('show'), 3000);
};

export const render = () => `
<div class="tar_wrap">
  <div class="tar_toolbar">
    <div class="tar_tb_left">
      <div class="tar_logo"><i class="fas fa-folder-open"></i><span>Mis Tareas</span></div>
    </div>
    <div class="tar_tb_right">
      <div class="tar_resumen" id="tar_resumen">
        <div class="tar_res_item" ${wiTip('Total de tareas')}><i class="fas fa-layer-group"></i><strong id="tar_n_total">0</strong><span>Total</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item" ${wiTip('Tareas pendientes')}><i class="fas fa-circle-dot" style="color:#FFB800"></i><strong id="tar_n_pend">0</strong><span>Pend.</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item" ${wiTip('En progreso')}><i class="fas fa-spinner" style="color:#0EBEFF"></i><strong id="tar_n_prog">0</strong><span>Prog.</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item" ${wiTip('En revisión')}><i class="fas fa-eye" style="color:#7000FF"></i><strong id="tar_n_rev">0</strong><span>Rev.</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item" ${wiTip('Completadas')}><i class="fas fa-circle-check" style="color:#29C72E"></i><strong id="tar_n_done">0</strong><span>Hecho</span></div>
      </div>
    </div>
  </div>

  <div class="tar_actionbar">
    <div class="tar_ab_left">
      <span class="tar_sync_dot tar_sync_loading" id="tar_sync_dot" ${wiTip('Estado de sincronización')}></span>
      <button class="tar_ab_btn" id="tar_refresh" ${wiTip('Actualizar (Ctrl+R)')}><i class="fas fa-rotate-right"></i></button>
      <div class="tar_quick_wrap">
        <input type="text" class="tar_quick_input" id="tar_quick_input" placeholder="✨ Nueva tarea... (presiona Enter)" maxlength="100" autocomplete="off"/>
        <select class="tar_quick_select" id="tar_quick_tipo" ${wiTip('Tipo de tarea')}>
          ${Object.entries(TIPOS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
        </select>
        <button class="tar_ab_btn tar_ab_details" id="tar_quick_details" ${wiTip('Agregar con detalles (N)')}><i class="fas fa-sliders"></i></button>
      </div>
    </div>
    <div class="tar_ab_right">
      <div class="tar_filtros" id="tar_filtros">
        <button class="tar_fil active" data-fil="todos" ${wiTip('Ver todas')}>Todos</button>
        ${Object.entries(ESTADOS).map(([k,v])=>`<button class="tar_fil" data-fil="${k}" ${wiTip(v)}><i class="fas ${EST_ICO[k]}" style="color:${EST_CLR[k]}"></i> <span>${v}</span></button>`).join('')}
      </div>
      <div class="tar_search_wrap">
        <i class="fas fa-search"></i>
        <input type="text" class="tar_search_input" id="tar_buscar" placeholder="Buscar… (/)" autocomplete="off"/>
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
    <button class="modalX" ${wiTip('Cerrar (Esc)')}><i class="fas fa-times"></i></button>
    <div class="tar_modal_scroll">
      <div class="tar_modal_hero" id="tar_m_hero">
        <div class="tar_deco1"></div>
        <div class="tar_deco2"></div>
        <div class="tar_modal_ico" id="tar_m_ico"><i class="fas fa-plus-circle"></i></div>
        <div class="tar_modal_info">
          <h2 class="tar_modal_tit" id="tar_m_tit">Nueva Tarea</h2>
          <p class="tar_modal_sub" id="tar_m_sub">Completa los datos para organizar tu trabajo</p>
        </div>
      </div>
      <div class="tar_modal_body">
        <!-- Sección: Información básica -->
        <div class="tar_section">
          <div class="tar_section_tit"><i class="fas fa-info-circle"></i> Información</div>
          <div class="tar_field">
            <label class="tar_label"><i class="fas fa-heading"></i> Título <span class="tar_req">*</span></label>
            <div class="tar_input_ico"><i class="fas fa-pen"></i><input type="text" class="tar_input" id="t_titulo" placeholder="Ej: Entregar informe mensual" maxlength="100" autocomplete="off"/></div>
          </div>
        </div>

        <!-- Sección: Pasos / Subtareas -->
        <div class="tar_section">
          <div class="tar_section_tit"><i class="fas fa-list-check"></i> Pasos a seguir</div>
          <div class="tar_subs_list" id="t_subs_list"></div>
          <button type="button" class="tar_btn_add_sub" id="t_add_sub"><i class="fas fa-plus"></i> Añadir paso</button>
        </div>

        <!-- Sección: Detalles -->
        <div class="tar_section">
          <div class="tar_section_tit"><i class="fas fa-sliders"></i> Detalles</div>
          <div class="tar_field_row tar_field_row2">
            <div class="tar_field">
              <label class="tar_label"><i class="fas fa-calendar-day"></i> Fecha límite</label>
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
          </div>
          <div class="tar_field_row tar_field_row2" style="margin-top:.6vh">
            <div class="tar_field">
              <label class="tar_label"><i class="fas fa-signal"></i> Estado</label>
              <select class="tar_select" id="t_estado">
                ${Object.entries(ESTADOS).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}
              </select>
            </div>
            <div class="tar_field">
              <label class="tar_label"><i class="fas fa-tag"></i> Categoría</label>
              <select class="tar_select" id="t_tipo">
                ${Object.entries(TIPOS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Sección: Personalización -->
        <div class="tar_section">
          <div class="tar_section_tit"><i class="fas fa-palette"></i> Personalizar</div>
          <div class="tar_field">
            <label class="tar_label"><i class="fas fa-swatchbook"></i> Color de la tarea</label>
            <div class="tar_colores" id="t_colores">
              ${COLORES.map(c=>`<button type="button" class="tar_color_opt" data-color="${c}" style="--c:${c}" ${wiTip(c)}></button>`).join('')}
            </div>
          </div>
        </div>
      </div>
      <div class="tar_modal_footer">
        <button type="button" class="tar_btn_del dpn" id="t_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
        <div class="tar_modal_footer_r">
          <button type="button" class="tar_btn_cancel" id="t_cancelar">Cancelar</button>
          <button type="button" class="tar_btn_save" id="t_guardar"><i class="fas fa-check-circle"></i> Guardar</button>
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

// Render board with enhanced cards
const _renderBoard = () => {
  const list=_filtradas(), all=getAll();
  Object.keys(ESTADOS).forEach(est => {
    const $el=$(`#tar_list_${est}`).empty();
    const items=list.filter(t=>(t.estado||'pendiente')===est).sort((a,b)=>(PRIO_SORT[a.prio]||1)-(PRIO_SORT[b.prio]||1));
    $(`#tar_count_${est}`).text(items.length);
    if (!items.length) { 
      const emojis = {pendiente:'📋',progreso:'🚀',revision:'👁️',hecho:'🎉'};
      $el.html(`<div class="tar_empty"><i class="fas fa-inbox"></i><span>${emojis[est]} Sin tareas aquí</span></div>`); 
      return; 
    }
    items.forEach(t => {
      const tipo=TIPOS[t.tipo]||TIPOS.trabajo, color=t.color||tipo.color;
      const subs=t.subtareas||[], done=subs.filter(s=>s.done).length;
      const pct=subs.length?Math.round(done/subs.length*100):(est==='hecho'?100:0);
      const canPrev=est!=='pendiente', canNext=est!=='hecho';
      const prioClass = t.prio === 'alta' ? 'tar_prio_alta' : '';
      const doneClass = est === 'hecho' ? 'tar_card_done' : '';
      $el.append(`
      <div class="tar_card ${doneClass}" data-id="${t._fsId}" style="--tc:${color}" tabindex="0">
        <div class="tar_card_top">
          <span class="tar_prio_dot ${prioClass}" style="background:${PRIOS[t.prio]||'#FFB800'};color:${PRIOS[t.prio]||'#FFB800'}" ${wiTip(t.prio==='alta'?'¡Prioridad alta!':t.prio==='media'?'Prioridad media':'Prioridad baja')}></span>
          <span class="tar_card_titulo">${t.titulo}</span>
          <span class="tar_card_tipo" style="--tag:${tipo.color}"><i class="fas ${tipo.icon}"></i>${tipo.label}</span>
          <button class="tar_card_menu" data-id="${t._fsId}" ${wiTip('Eliminar')}><i class="fas fa-ellipsis-v"></i></button>
        </div>
        ${subs.length?`<div class="tar_card_subs">${subs.slice(0,4).map(s=>`<span class="tar_sub_pill${s.done?' tar_sub_done':''}"><i class="fas ${s.done?'fa-check-circle':'fa-circle-dot'}"></i>${s.txt}</span>`).join('')}${subs.length>4?`<span class="tar_sub_pill">+${subs.length-4}</span>`:''}</div>`:''}
        ${subs.length?`<div class="tar_card_prog"><div class="tar_prog_bar"><div class="tar_prog_fill" style="width:${pct}%;background:${color}"></div></div><span class="tar_prog_txt">${done}/${subs.length}</span></div>`:''}
        <div class="tar_card_bottom">
          <div class="tar_card_meta">${t.fecha?`<span class="tar_meta_fecha"><i class="fas fa-calendar"></i>${fmtF(t.fecha)} ${diasR(t.fecha)}</span>`:''}</div>
          <div class="tar_card_flow">
            <button class="tar_flow_btn ${canPrev?'':'tar_flow_off'}" data-id="${t._fsId}" data-dir="prev" ${wiTip(canPrev?`← ${ESTADOS[EST_PREV[est]]}`:'')}><i class="fas fa-chevron-left"></i></button>
            <span class="tar_flow_estado" style="color:${EST_CLR[est]}"><i class="fas ${EST_ICO[est]}"></i></span>
            <button class="tar_flow_btn ${canNext?'':'tar_flow_off'}" data-id="${t._fsId}" data-dir="next" ${wiTip(canNext?`${ESTADOS[EST_NEXT[est]]} →`:'')}><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>`);
    });
  });
  // Update stats
  $('#tar_n_total').text(all.length);
  $('#tar_n_pend').text(all.filter(t=>(t.estado||'pendiente')==='pendiente').length);
  $('#tar_n_prog').text(all.filter(t=>t.estado==='progreso').length);
  $('#tar_n_rev').text(all.filter(t=>t.estado==='revision').length);
  $('#tar_n_done').text(all.filter(t=>t.estado==='hecho').length);
  _initSortables();
};

// Initialize sortables for drag & drop
const _initSortables = () => {
  _sortables.forEach(s => { try { s?.destroy?.(); } catch(_) {} });
  _sortables = [];
  Object.keys(ESTADOS).forEach(est => {
    const el=document.getElementById(`tar_list_${est}`);
    if (!el) return;
    _sortables.push(new Sortable(el, {
      group:'tareas', animation:200, ghostClass:'tar_ghost', dragClass:'tar_dragging',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      onEnd: evt => {
        const id=evt.item?.dataset?.id, nuevoEstado=evt.to?.id?.replace('tar_list_','');
        if (!id||!nuevoEstado) return;
        const t=getAll().find(x=>x._fsId===id);
        if (!t||t.estado===nuevoEstado) return;
        const hist=t.historial||[];
        hist.push({de:t.estado,a:nuevoEstado,fecha:new Date().toISOString()});
        const isCompleting = nuevoEstado === 'hecho' && t.estado !== 'hecho';
        _upsert({...t,estado:nuevoEstado,historial:hist,completado:nuevoEstado==='hecho'?new Date().toISOString():''});
        _renderBoard();
        const emoji={pendiente:'⏳',progreso:'🔄',revision:'👀',hecho:'🎉'}[nuevoEstado];
        Notificacion(`${emoji} Movido a ${ESTADOS[nuevoEstado]}`,'success');
        if (isCompleting) _triggerConfetti();
      }
    }));
  });
};

// Color selection helpers
const _selColor = c => { $('#t_colores .tar_color_opt').removeClass('active'); $(`#t_colores .tar_color_opt[data-color="${c}"]`).addClass('active'); };
const _getColor = () => $('#t_colores .tar_color_opt.active').data('color')||COLORES[0];
const _heroColor = (color, icon) => { 
  $('#tar_m_hero').css('background',`linear-gradient(135deg,${color}ee,${color}99)`); 
  $('#tar_m_ico').css('background',color).html(`<i class="fas ${icon}"></i>`); 
};

// Subtasks rendering
const _renderSubs = (list=[]) => {
  const $c=$('#t_subs_list').empty();
  const items=list.length?list:[{txt:'',done:false},{txt:'',done:false},{txt:'',done:false}];
  items.forEach((s,i) => {
    const obj=typeof s==='string'?{txt:s,done:false}:s;
    $c.append(`<div class="tar_sub_row"><div class="tar_sub_check${obj.done?' tar_sub_checked':''}" data-si="${i}"><i class="fas fa-check"></i></div><input type="text" class="tar_sub_input" placeholder="Paso ${i+1}…" value="${obj.txt||''}" maxlength="80" autocomplete="off"/><button type="button" class="tar_del_sub" ${wiTip('Eliminar paso')}><i class="fas fa-times"></i></button></div>`);
  });
};
const _getSubs = () => $('.tar_sub_row').map((_,el)=>{ const txt=$(el).find('.tar_sub_input').val().trim(); const done=$(el).find('.tar_sub_check').hasClass('tar_sub_checked'); return txt?{txt,done}:null; }).get().filter(Boolean);

// Modal handlers
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
  $('#tar_m_sub').text(_edit?'Modifica los datos de tu tarea':'Completa los datos para crear tu tarea');
  $('#t_eliminar').toggleClass('dpn',!_edit);
  abrirModal('modal_tarea');
  setTimeout(()=>$('#t_titulo').focus(),50);
};

const _guardar = () => {
  const titulo=$('#t_titulo').val().trim();
  if (!titulo) return Notificacion('⚠️ El título es requerido','warning');
  wiSpin('#t_guardar',true,'Guardar');
  const nuevoEstado = $('#t_estado').val();
  const estadoAnterior = _edit?.estado;
  const isCompleting = nuevoEstado === 'hecho' && estadoAnterior !== 'hecho';
  
  _upsert({
    ...(_edit||{}), 
    titulo, 
    fecha:$('#t_fecha').val()||defFecha(), 
    prio:$('#t_prio').val(), 
    tipo:$('#t_tipo').val(), 
    estado:nuevoEstado, 
    color:_getColor(), 
    subtareas:_getSubs(), 
    historial:_edit?.historial||[], 
    creado:_edit?.creado||new Date().toISOString(),
    completado: nuevoEstado === 'hecho' ? (_edit?.completado || new Date().toISOString()) : ''
  });
  
  cerrarModal('modal_tarea');
  _renderBoard();
  $('#tar_quick_input').val('');
  wiSpin('#t_guardar',false,'Guardar');
  Notificacion(_edit?'✓ Tarea actualizada':'✓ Tarea creada','success');
  
  if (isCompleting) _triggerConfetti();
};

const _openConfirm = t => {
  $('#tar_confirm_nombre').text(`"${t.titulo||'Sin título'}"`);
  _confirmCb = () => { 
    _showUndo(t, 'eliminar');
    _delete(t); 
    cerrarModal('modal_tar_confirm'); 
    _renderBoard(); 
    Notificacion('🗑️ Tarea eliminada','info'); 
  };
  abrirModal('modal_tar_confirm');
};

// Keyboard shortcuts handler
const _handleKeyboard = e => {
  // Ignore if typing in input
  if (['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) {
    if (e.key === 'Escape') document.activeElement.blur();
    return;
  }
  
  switch(e.key.toLowerCase()) {
    case 'n': // Nueva tarea
      e.preventDefault();
      _openModal();
      break;
    case '/': // Focus búsqueda
      e.preventDefault();
      $('#tar_buscar').focus();
      break;
    case 'r': // Refresh (solo con Ctrl)
      if (e.ctrlKey) {
        e.preventDefault();
        _forceSync();
      }
      break;
    case 'escape': // Cerrar modales
      cerrarModal('modal_tarea');
      cerrarModal('modal_tar_confirm');
      break;
    case 'z': // Undo (Ctrl+Z)
      if (e.ctrlKey) {
        e.preventDefault();
        _undoDelete();
      }
      break;
    case '?': // Mostrar ayuda
      _showKbdHint();
      break;
  }
};

// Debounced search
const _debouncedSearch = debounce(() => _renderBoard(), 200);

// Event bindings
const _bind = () => {
  $(document).off('.tar');
  const $d=$(document);
  
  // Quick add
  $d.on('keydown.tar','#tar_quick_input', e=>{ if(e.key==='Enter'){e.preventDefault();_quickAdd();} })
    .on('click.tar','#tar_quick_details', ()=>_openModal())
    .on('click.tar','#tar_refresh', _forceSync)
    
    // Filters
    .on('click.tar','.tar_fil', function(){ 
      _filtro=$(this).data('fil'); 
      $('.tar_fil').removeClass('active'); 
      $(this).addClass('active'); 
      _renderBoard(); 
    })
    
    // Search with debounce
    .on('input.tar','#tar_buscar', function(){ _busq=$(this).val(); _debouncedSearch(); })
    
    // Card interactions
    .on('click.tar','.tar_card', function(e){ 
      if($(e.target).closest('.tar_card_menu,.tar_flow_btn').length) return; 
      const t=getAll().find(x=>x._fsId===$(this).data('id')); 
      if(t) _openModal(t); 
    })
    .on('keydown.tar','.tar_card', function(e){ 
      if(e.key==='Enter'||e.key===' ') { 
        e.preventDefault(); 
        const t=getAll().find(x=>x._fsId===$(this).data('id')); 
        if(t) _openModal(t); 
      }
    })
    .on('click.tar','.tar_card_menu', function(e){ e.stopPropagation(); const t=getAll().find(x=>x._fsId===$(this).data('id')); if(t) _openConfirm(t); })
    .on('click.tar','.tar_flow_btn:not(.tar_flow_off)', function(e){ e.stopPropagation(); _moverEstado($(this).data('id'),$(this).data('dir')); })
    
    // Modal - Colors
    .on('click.tar','#t_colores .tar_color_opt', function(){ _selColor($(this).data('color')); _heroColor($(this).data('color'),TIPOS[$('#t_tipo').val()]?.icon||'fa-plus-circle'); })
    .on('change.tar','#t_tipo', function(){ _heroColor(_getColor(),TIPOS[$(this).val()]?.icon||'fa-plus-circle'); })
    
    // Modal - Subtasks
    .on('click.tar','#t_add_sub', ()=>{ 
      const n=$('#t_subs_list .tar_sub_row').length+1; 
      $('#t_subs_list').append(`<div class="tar_sub_row"><div class="tar_sub_check" data-si="${n-1}"><i class="fas fa-check"></i></div><input type="text" class="tar_sub_input" placeholder="Paso ${n}…" maxlength="80" autocomplete="off"/><button type="button" class="tar_del_sub" ${wiTip('Eliminar paso')}><i class="fas fa-times"></i></button></div>`); 
      $('#t_subs_list .tar_sub_row:last .tar_sub_input').focus(); 
    })
    .on('click.tar','.tar_sub_check', function(){ $(this).toggleClass('tar_sub_checked'); })
    .on('click.tar','.tar_del_sub', function(){ 
      const $row = $(this).closest('.tar_sub_row');
      $row.css({opacity:0, transform:'translateX(10px)'});
      setTimeout(() => $row.remove(), 150);
    })
    .on('keydown.tar','.tar_sub_input', function(e){ 
      if(e.key==='Enter') { 
        e.preventDefault(); 
        $('#t_add_sub').click(); 
      }
    })
    
    // Modal - Actions
    .on('click.tar','#t_cancelar', ()=>cerrarModal('modal_tarea'))
    .on('click.tar','#t_guardar', _guardar)
    .on('click.tar','#t_eliminar', ()=>{ if(_edit){ cerrarModal('modal_tarea'); _openConfirm(_edit); } })
    .on('keydown.tar','#t_titulo', e=>{ if(e.key==='Enter' && e.ctrlKey) _guardar(); })
    
    // Confirm modal
    .on('click.tar','#tar_conf_no', ()=>cerrarModal('modal_tar_confirm'))
    .on('click.tar','#tar_conf_si', ()=>_confirmCb?.())
    
    // Undo
    .on('click.tar','#tar_undo_btn', _undoDelete)
    
    // Global keyboard shortcuts
    .on('keydown.tar', _handleKeyboard);
};

// Init
export const init = async () => {
  await _cargar();
  _renderBoard();
  _bind();
  wiAuth(_cargar, _renderBoard);
  
  // Show keyboard hint on first load
  setTimeout(_showKbdHint, 1500);
  
  console.log('📋 Tareas v6.0 PRO OK');
};

// Cleanup
export const cleanup = () => {
  _sortables.forEach(s=>{ try{ if(s?.el?.parentNode) s.destroy(); }catch(_){} });
  _sortables=[];
  _undoStack = [];
  clearTimeout(_undoTimeout);
  $(document).off('.tar');
  console.log('🧹 Tareas limpiado');
};