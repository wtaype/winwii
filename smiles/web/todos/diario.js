import './diario.css';
import $ from 'jquery';
import { db } from '../firebase.js';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Notificacion, abrirModal, cerrarModal, getls, savels, wiTip, wiSpin, wiAuth } from '../widev.js';

/* ══════════════════════════════════════════════════════════════
   DIARIO v1.0 PRO — Vista de Agenda Diaria con Timeline
   ✨ Timeline 24h · Drag & Drop · Eventos superpuestos
══════════════════════════════════════════════════════════════ */

const CACHE = 'wii_horario_v1', COL = 'horario';

const HORAS = Array.from({length:24}, (_,i) => i);
const TIPOS = {
  trabajo:  { label:'Trabajo',  icon:'fa-briefcase',       color:'#0EBEFF' },
  estudio:  { label:'Estudio',  icon:'fa-book',            color:'#7000FF' },
  personal: { label:'Personal', icon:'fa-user',            color:'#FFB800' },
  salud:    { label:'Salud',    icon:'fa-heart-pulse',     color:'#FF5C69' },
  proyecto: { label:'Proyecto', icon:'fa-diagram-project', color:'#A855F7' },
  reunion:  { label:'Reunión',  icon:'fa-users',           color:'#29C72E' },
  otro:     { label:'Otro',     icon:'fa-circle',          color:'#94A3B8' },
};
const PRIOS = { alta:'#FF5C69', media:'#FFB800', baja:'#29C72E' };
const COLORES = ['#0EBEFF','#7000FF','#FFB800','#FF5C69','#29C72E','#A855F7','#00C9B1','#94A3B8'];

// State
let _fecha = new Date().toISOString().split('T')[0];
let _edit = null;

/* ── Utils ── */
const hoy = () => new Date().toISOString().split('T')[0];
const fmtFecha = f => new Date(f+'T00:00:00').toLocaleDateString('es-PE',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
const fmtCorta = f => new Date(f+'T00:00:00').toLocaleDateString('es-PE',{weekday:'short',day:'numeric',month:'short'});
const addDays = (f, n) => { const d=new Date(f+'T12:00:00'); d.setDate(d.getDate()+n); return d.toISOString().split('T')[0]; };
const esHoy = f => f === hoy();
const esPasado = f => f < hoy();
const mkId = tit => { const s=(tit||'hor').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'').slice(0,25); return `${s}_${Date.now()}`; };
const minToY = min => (min / 60) * 6; // 6vh por hora
const horaToMin = h => { const [hh,mm]=h.split(':').map(Number); return hh*60+(mm||0); };
const minToHora = m => { const h=Math.floor(m/60), mm=m%60; return `${String(h).padStart(2,'0')}:${String(mm).padStart(2,'0')}`; };
const duracion = (ini,fin) => { const d=horaToMin(fin)-horaToMin(ini); return d>0?d:0; };
const horaActual = () => { const n=new Date(); return `${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`; };

/* ── Auth / Cache ── */
const getUser = () => getls('wiSmile')||null;
const isLogged = () => !!getUser()?.usuario;
const getAll = () => getls(CACHE)||[];
const setAll = l => savels(CACHE,l,48);
const getDelDia = f => getAll().filter(x => x.fecha === f);

/* ── Sync ── */
const _sync = s => { const $d=$('#dia_sync'); if(!$d.length) return; $d[0].className=`dia_sync_dot dia_sync_${s}`; };

/* ── Firestore ── */
const _cargar = async (force=false) => {
  if (!force && getAll().length) return _sync('ok');
  if (!isLogged()) return _sync('error');
  _sync('loading');
  try {
    const snap = await getDocs(query(collection(db,COL), where('usuario','==',getUser().usuario)));
    setAll(snap.docs.map(d=>({...d.data(),_fsId:d.id,id:d.id})));
    _sync('ok');
  } catch(e) { console.error('❌ diario:',e); _sync('error'); }
};

const _upsert = item => {
  const list=getAll(), id=item._fsId||mkId(item.titulo), full={...item,_fsId:id,id};
  const idx=list.findIndex(x=>x._fsId===id);
  idx>=0 ? list.splice(idx,1,full) : list.push(full);
  setAll(list);
  if (isLogged()) {
    _sync('saving');
    const u=getUser()||{}; const o={...full}; delete o._fsId;
    setDoc(doc(db,COL,id),{...o,usuario:u.usuario||'',email:u.email||'',actualizado:serverTimestamp()},{merge:true})
      .then(()=>_sync('ok')).catch(e=>{console.error('❌ upsert:',e);_sync('error');});
  }
  return full;
};

const _delete = item => {
  const id=item._fsId||item.id;
  setAll(getAll().filter(x=>x._fsId!==id));
  if (isLogged()) { _sync('saving'); deleteDoc(doc(db,COL,id)).then(()=>_sync('ok')).catch(e=>{console.error('❌ del:',e);_sync('error');}); }
};

/* ── Render ── */
export const render = () => `
<div class="dia_wrap">
  <div class="dia_toolbar">
    <div class="dia_tb_left">
      <div class="dia_logo"><i class="fas fa-calendar-day"></i><span>Mi Día</span></div>
      <span class="dia_sync_dot dia_sync_loading" id="dia_sync" ${wiTip('Estado de sincronización')}></span>
    </div>
    <div class="dia_tb_center">
      <div class="dia_nav">
        <button class="dia_nav_btn" id="dia_prev" ${wiTip('Día anterior')}><i class="fas fa-chevron-left"></i></button>
        <button class="dia_nav_hoy" id="dia_hoy" ${wiTip('Ir a hoy')}><i class="fas fa-calendar-check"></i> Hoy</button>
        <button class="dia_nav_btn" id="dia_next" ${wiTip('Día siguiente')}><i class="fas fa-chevron-right"></i></button>
      </div>
      <span class="dia_fecha_label" id="dia_fecha_label"></span>
    </div>
    <div class="dia_tb_right">
      <div class="dia_resumen">
        <div class="dia_res_item" ${wiTip('Total eventos')}><i class="fas fa-calendar-days" style="color:var(--mco)"></i><strong id="dia_n_total">0</strong><span>Total</span></div>
        <div class="dia_res_sep"></div>
        <div class="dia_res_item" ${wiTip('Pendientes')}><i class="fas fa-clock" style="color:#FFB800"></i><strong id="dia_n_pend">0</strong><span>Pend.</span></div>
        <div class="dia_res_sep"></div>
        <div class="dia_res_item" ${wiTip('Completados')}><i class="fas fa-check-circle" style="color:#29C72E"></i><strong id="dia_n_done">0</strong><span>Hecho</span></div>
      </div>
      <button class="dia_btn_add" id="dia_add" ${wiTip('Agregar evento (N)')}><i class="fas fa-plus"></i> Nuevo</button>
    </div>
  </div>

  <div class="dia_content">
    <div class="dia_timeline" id="dia_timeline">
      <div class="dia_time_col">
        ${HORAS.map(h=>`<div class="dia_time_slot" data-hora="${h}"><span>${String(h).padStart(2,'0')}:00</span></div>`).join('')}
      </div>
      <div class="dia_events_col" id="dia_events">
        <div class="dia_now_line" id="dia_now_line"></div>
        <!-- Events render here -->
      </div>
    </div>
    
    <div class="dia_sidebar">
      <div class="dia_side_header">
        <i class="fas fa-list-check"></i> Resumen del día
      </div>
      <div class="dia_side_body" id="dia_agenda">
        <!-- Quick agenda list -->
      </div>
      <div class="dia_side_footer">
        <button class="dia_quick_add" id="dia_quick_add"><i class="fas fa-plus"></i> Evento rápido</button>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_diario">
  <div class="modalBody dia_modal">
    <button class="modalX" ${wiTip('Cerrar (Esc)')}><i class="fas fa-times"></i></button>
    <div class="dia_modal_hero" id="dia_m_hero">
      <div class="dia_deco1"></div>
      <div class="dia_deco2"></div>
      <div class="dia_modal_ico" id="dia_m_ico"><i class="fas fa-calendar-plus"></i></div>
      <div class="dia_modal_info">
        <h2 class="dia_modal_tit" id="dia_m_tit">Nuevo Evento</h2>
        <p class="dia_modal_sub" id="dia_m_sub">Organiza tu día con precisión</p>
      </div>
    </div>
    <div class="dia_modal_body">
      <div class="dia_section">
        <div class="dia_section_tit"><i class="fas fa-heading"></i> Información</div>
        <div class="dia_field">
          <label class="dia_label">Título <span class="dia_req">*</span></label>
          <input type="text" class="dia_input" id="d_titulo" placeholder="Ej: Reunión de equipo" maxlength="100" autocomplete="off"/>
        </div>
        <div class="dia_field">
          <label class="dia_label">Descripción</label>
          <textarea class="dia_textarea" id="d_desc" placeholder="Notas adicionales..." rows="2"></textarea>
        </div>
      </div>

      <div class="dia_section">
        <div class="dia_section_tit"><i class="fas fa-clock"></i> Horario</div>
        <div class="dia_field_row">
          <div class="dia_field">
            <label class="dia_label"><i class="fas fa-play"></i> Inicio</label>
            <input type="time" class="dia_input dia_input_time" id="d_inicio" value="09:00"/>
          </div>
          <div class="dia_field">
            <label class="dia_label"><i class="fas fa-stop"></i> Fin</label>
            <input type="time" class="dia_input dia_input_time" id="d_fin" value="10:00"/>
          </div>
          <div class="dia_field">
            <label class="dia_label"><i class="fas fa-calendar"></i> Fecha</label>
            <input type="date" class="dia_input" id="d_fecha"/>
          </div>
        </div>
      </div>

      <div class="dia_section">
        <div class="dia_section_tit"><i class="fas fa-sliders"></i> Detalles</div>
        <div class="dia_field_row">
          <div class="dia_field">
            <label class="dia_label"><i class="fas fa-tag"></i> Categoría</label>
            <select class="dia_select" id="d_tipo">
              ${Object.entries(TIPOS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
            </select>
          </div>
          <div class="dia_field">
            <label class="dia_label"><i class="fas fa-flag"></i> Prioridad</label>
            <select class="dia_select" id="d_prio">
              <option value="alta">🔴 Alta</option>
              <option value="media" selected>🟡 Media</option>
              <option value="baja">🟢 Baja</option>
            </select>
          </div>
        </div>
        <div class="dia_field">
          <label class="dia_label"><i class="fas fa-palette"></i> Color</label>
          <div class="dia_colores" id="d_colores">
            ${COLORES.map(c=>`<button type="button" class="dia_color_opt" data-color="${c}" style="--c:${c}" ${wiTip(c)}></button>`).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="dia_modal_footer">
      <button type="button" class="dia_btn_del dpn" id="d_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
      <div class="dia_modal_footer_r">
        <button type="button" class="dia_btn_cancel" id="d_cancelar">Cancelar</button>
        <button type="button" class="dia_btn_save" id="d_guardar"><i class="fas fa-check-circle"></i> Guardar</button>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_dia_confirm">
  <div class="modalBody dia_modal_confirm">
    <div class="dia_confirm_ico"><i class="fas fa-triangle-exclamation"></i></div>
    <h3>¿Eliminar evento?</h3>
    <p id="dia_confirm_nombre"></p>
    <div class="dia_confirm_btns">
      <button class="dia_btn_cancel" id="dia_conf_no">Cancelar</button>
      <button class="dia_btn_del_confirm" id="dia_conf_si"><i class="fas fa-trash"></i> Eliminar</button>
    </div>
  </div>
</div>`;

/* ── Render Timeline ── */
const _renderTimeline = () => {
  const eventos = getDelDia(_fecha);
  const $events = $('#dia_events');
  
  // Clear events but keep now line
  $events.find('.dia_event').remove();
  
  // Render events
  eventos.forEach(ev => {
    const tipo = TIPOS[ev.tipo] || TIPOS.otro;
    const color = ev.color || tipo.color;
    const inicio = horaToMin(ev.horaInicio || '09:00');
    const fin = horaToMin(ev.horaFin || '10:00');
    const top = minToY(inicio);
    const height = Math.max(minToY(fin - inicio), 2.5); // min 2.5vh
    const isDone = ev.estado === 'completado';
    
    $events.append(`
      <div class="dia_event ${isDone ? 'dia_event_done' : ''}" data-id="${ev._fsId}" 
           style="--ec:${color}; top:${top}vh; height:${height}vh;">
        <div class="dia_event_bar"></div>
        <div class="dia_event_content">
          <div class="dia_event_time">${ev.horaInicio} - ${ev.horaFin}</div>
          <div class="dia_event_titulo">${ev.titulo}</div>
          ${ev.descripcion ? `<div class="dia_event_desc">${ev.descripcion}</div>` : ''}
          <div class="dia_event_meta">
            <span class="dia_event_tipo"><i class="fas ${tipo.icon}"></i> ${tipo.label}</span>
            <span class="dia_event_prio" style="color:${PRIOS[ev.prioridad]||PRIOS.media}"><i class="fas fa-flag"></i></span>
          </div>
        </div>
        <div class="dia_event_actions">
          <button class="dia_ev_check" data-id="${ev._fsId}" ${wiTip(isDone?'Marcar pendiente':'Completar')}><i class="fas ${isDone?'fa-undo':'fa-check'}"></i></button>
          <button class="dia_ev_edit" data-id="${ev._fsId}" ${wiTip('Editar')}><i class="fas fa-pen"></i></button>
        </div>
      </div>
    `);
  });
  
  // Update now line
  _updateNowLine();
  
  // Update sidebar
  _renderAgenda();
  
  // Update stats
  _updateStats();
  
  // Update date label
  $('#dia_fecha_label').html(`<i class="fas ${esHoy(_fecha)?'fa-bolt':esPasado(_fecha)?'fa-history':'fa-calendar'}"></i> ${fmtFecha(_fecha)}`);
  if (esHoy(_fecha)) $('#dia_fecha_label').addClass('dia_es_hoy');
  else $('#dia_fecha_label').removeClass('dia_es_hoy');
};

const _updateNowLine = () => {
  const $line = $('#dia_now_line');
  if (!esHoy(_fecha)) { $line.hide(); return; }
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes();
  $line.css('top', minToY(mins) + 'vh').show();
  $line.find('.dia_now_time').text(horaActual());
};

const _renderAgenda = () => {
  const eventos = getDelDia(_fecha).sort((a,b) => horaToMin(a.horaInicio||'00:00') - horaToMin(b.horaInicio||'00:00'));
  const $agenda = $('#dia_agenda');
  
  if (!eventos.length) {
    $agenda.html(`<div class="dia_empty"><i class="fas fa-calendar-xmark"></i><span>Sin eventos para este día</span></div>`);
    return;
  }
  
  $agenda.html(eventos.map(ev => {
    const tipo = TIPOS[ev.tipo] || TIPOS.otro;
    const isDone = ev.estado === 'completado';
    return `
      <div class="dia_agenda_item ${isDone ? 'dia_agenda_done' : ''}" data-id="${ev._fsId}">
        <div class="dia_agenda_time">${ev.horaInicio}</div>
        <div class="dia_agenda_bar" style="background:${ev.color||tipo.color}"></div>
        <div class="dia_agenda_info">
          <span class="dia_agenda_titulo">${ev.titulo}</span>
          <span class="dia_agenda_tipo"><i class="fas ${tipo.icon}"></i> ${tipo.label}</span>
        </div>
        <button class="dia_agenda_check" data-id="${ev._fsId}"><i class="fas ${isDone?'fa-check-circle':'fa-circle'}"></i></button>
      </div>
    `;
  }).join(''));
};

const _updateStats = () => {
  const eventos = getDelDia(_fecha);
  $('#dia_n_total').text(eventos.length);
  $('#dia_n_pend').text(eventos.filter(e => e.estado !== 'completado').length);
  $('#dia_n_done').text(eventos.filter(e => e.estado === 'completado').length);
};

/* ── Modal ── */
const _openModal = (item = null) => {
  _edit = item;
  const isNew = !item;
  
  $('#dia_m_tit').text(isNew ? 'Nuevo Evento' : 'Editar Evento');
  $('#dia_m_sub').text(isNew ? 'Organiza tu día con precisión' : 'Modifica los detalles del evento');
  $('#dia_m_ico i').attr('class', isNew ? 'fas fa-calendar-plus' : 'fas fa-calendar-pen');
  $('#dia_m_hero').css('background', isNew ? 'linear-gradient(145deg, var(--mco), var(--hv))' : `linear-gradient(145deg, ${item?.color||'var(--mco)'}, var(--hv))`);
  
  $('#d_titulo').val(item?.titulo || '');
  $('#d_desc').val(item?.descripcion || '');
  $('#d_inicio').val(item?.horaInicio || '09:00');
  $('#d_fin').val(item?.horaFin || '10:00');
  $('#d_fecha').val(item?.fecha || _fecha);
  $('#d_tipo').val(item?.tipo || 'trabajo');
  $('#d_prio').val(item?.prioridad || 'media');
  
  $('.dia_color_opt').removeClass('active');
  const col = item?.color || TIPOS[item?.tipo || 'trabajo']?.color || COLORES[0];
  $(`.dia_color_opt[data-color="${col}"]`).addClass('active');
  
  $('#d_eliminar').toggleClass('dpn', isNew);
  
  abrirModal('modal_diario');
  setTimeout(() => $('#d_titulo').trigger('focus'), 100);
};

const _saveEvento = () => {
  const titulo = $('#d_titulo').val().trim();
  if (!titulo) return Notificacion('El título es requerido', 'error');
  
  const inicio = $('#d_inicio').val();
  const fin = $('#d_fin').val();
  if (horaToMin(fin) <= horaToMin(inicio)) return Notificacion('La hora de fin debe ser posterior al inicio', 'error');
  
  const item = {
    ...(_edit || {}),
    titulo,
    descripcion: $('#d_desc').val().trim(),
    horaInicio: inicio,
    horaFin: fin,
    fecha: $('#d_fecha').val() || _fecha,
    tipo: $('#d_tipo').val(),
    prioridad: $('#d_prio').val(),
    color: $('.dia_color_opt.active').data('color') || COLORES[0],
    estado: _edit?.estado || 'pendiente',
  };
  
  _upsert(item);
  cerrarModal('modal_diario');
  _renderTimeline();
  Notificacion(_edit ? '✓ Evento actualizado' : '✓ Evento creado', 'success');
};

/* ── Bindings ── */
const _bind = () => {
  // Navigation
  $('#dia_prev').off('click.dia').on('click.dia', () => { _fecha = addDays(_fecha, -1); _renderTimeline(); });
  $('#dia_next').off('click.dia').on('click.dia', () => { _fecha = addDays(_fecha, 1); _renderTimeline(); });
  $('#dia_hoy').off('click.dia').on('click.dia', () => { _fecha = hoy(); _renderTimeline(); });
  
  // Add
  $('#dia_add, #dia_quick_add').off('click.dia').on('click.dia', () => _openModal());
  
  // Modal
  $('#d_guardar').off('click.dia').on('click.dia', _saveEvento);
  $('#d_cancelar').off('click.dia').on('click.dia', () => cerrarModal('modal_diario'));
  
  // Colors
  $(document).off('click.dia_col').on('click.dia_col', '.dia_color_opt', function() {
    $('.dia_color_opt').removeClass('active');
    $(this).addClass('active');
  });
  
  // Event actions
  $(document).off('click.dia_ev').on('click.dia_ev', '.dia_ev_edit, .dia_event', function(e) {
    if ($(e.target).closest('.dia_ev_check').length) return;
    const id = $(this).data('id') || $(this).closest('.dia_event').data('id');
    const item = getAll().find(x => x._fsId === id);
    if (item) _openModal(item);
  });
  
  $(document).off('click.dia_check').on('click.dia_check', '.dia_ev_check, .dia_agenda_check', function(e) {
    e.stopPropagation();
    const id = $(this).data('id');
    const item = getAll().find(x => x._fsId === id);
    if (item) {
      item.estado = item.estado === 'completado' ? 'pendiente' : 'completado';
      _upsert(item);
      _renderTimeline();
      Notificacion(item.estado === 'completado' ? '✓ Evento completado' : '↺ Evento pendiente', 'success');
    }
  });
  
  // Agenda item click
  $(document).off('click.dia_agenda').on('click.dia_agenda', '.dia_agenda_item', function(e) {
    if ($(e.target).closest('.dia_agenda_check').length) return;
    const id = $(this).data('id');
    const item = getAll().find(x => x._fsId === id);
    if (item) _openModal(item);
  });
  
  // Delete
  $('#d_eliminar').off('click.dia').on('click.dia', () => {
    if (!_edit) return;
    $('#dia_confirm_nombre').text(_edit.titulo);
    abrirModal('modal_dia_confirm');
  });
  
  $('#dia_conf_si').off('click.dia').on('click.dia', () => {
    if (_edit) {
      _delete(_edit);
      cerrarModal('modal_dia_confirm');
      cerrarModal('modal_diario');
      _renderTimeline();
      Notificacion('🗑 Evento eliminado', 'success');
    }
  });
  $('#dia_conf_no').off('click.dia').on('click.dia', () => cerrarModal('modal_dia_confirm'));
  
  // Keyboard
  $(document).off('keydown.dia').on('keydown.dia', e => {
    if ($('.wiModal.active').length) return;
    if (e.key === 'n' || e.key === 'N') { e.preventDefault(); _openModal(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); _fecha = addDays(_fecha, -1); _renderTimeline(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); _fecha = addDays(_fecha, 1); _renderTimeline(); }
    if (e.key === 't' || e.key === 'T') { e.preventDefault(); _fecha = hoy(); _renderTimeline(); }
  });
  
  // Update now line every minute
  setInterval(_updateNowLine, 60000);
};

/* ── Init / Cleanup ── */
export const init = async () => {
  await _cargar();
  _renderTimeline();
  _bind();
};

export const cleanup = () => {
  $(document).off('.dia');
  $(document).off('.dia_col');
  $(document).off('.dia_ev');
  $(document).off('.dia_check');
  $(document).off('.dia_agenda');
};
