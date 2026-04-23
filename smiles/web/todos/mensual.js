import './mensual.css';
import $ from 'jquery';
import { db } from '../firebase.js';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Notificacion, abrirModal, cerrarModal, getls, savels, wiTip, wiSpin, wiAuth } from '../widev.js';

/* ══════════════════════════════════════════════════════════════
   MENSUAL v1.0 PRO — Calendario Mensual con Vista de Eventos
   ✨ Calendario interactivo · Vista mes · Mini previews
══════════════════════════════════════════════════════════════ */

const CACHE = 'wii_horario_v1', COL = 'horario';

const DIAS_SEMANA = ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

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
let _mes = new Date().getMonth();
let _anio = new Date().getFullYear();
let _selFecha = null;
let _edit = null;

/* ── Utils ── */
const hoy = () => new Date().toISOString().split('T')[0];
const fmtFecha = f => new Date(f+'T00:00:00').toLocaleDateString('es-PE',{weekday:'long',day:'numeric',month:'long'});
const esHoy = f => f === hoy();
const esPasado = f => f < hoy();
const mkId = tit => { const s=(tit||'hor').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'').slice(0,25); return `${s}_${Date.now()}`; };
const getDiasDelMes = (m, a) => new Date(a, m + 1, 0).getDate();
const getPrimerDiaSemana = (m, a) => { const d = new Date(a, m, 1).getDay(); return d === 0 ? 6 : d - 1; }; // 0=Lun
const formatoFecha = (d, m, a) => `${a}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;

/* ── Auth / Cache ── */
const getUser = () => getls('wiSmile')||null;
const isLogged = () => !!getUser()?.usuario;
const getAll = () => getls(CACHE)||[];
const setAll = l => savels(CACHE,l,48);
const getDelDia = f => getAll().filter(x => x.fecha === f);
const getDelMes = (m, a) => getAll().filter(x => {
  if (!x.fecha) return false;
  const [ea, em] = x.fecha.split('-').map(Number);
  return ea === a && em === m + 1;
});

/* ── Sync ── */
const _sync = s => { const $d=$('#mes_sync'); if(!$d.length) return; $d[0].className=`mes_sync_dot mes_sync_${s}`; };

/* ── Firestore ── */
const _cargar = async (force=false) => {
  if (!force && getAll().length) return _sync('ok');
  if (!isLogged()) return _sync('error');
  _sync('loading');
  try {
    const snap = await getDocs(query(collection(db,COL), where('usuario','==',getUser().usuario)));
    setAll(snap.docs.map(d=>({...d.data(),_fsId:d.id,id:d.id})));
    _sync('ok');
  } catch(e) { console.error('❌ mensual:',e); _sync('error'); }
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
<div class="mes_wrap">
  <div class="mes_toolbar">
    <div class="mes_tb_left">
      <div class="mes_logo"><i class="fas fa-calendar-alt"></i><span>Calendario</span></div>
      <span class="mes_sync_dot mes_sync_loading" id="mes_sync" ${wiTip('Estado de sincronización')}></span>
    </div>
    <div class="mes_tb_center">
      <div class="mes_nav">
        <button class="mes_nav_btn" id="mes_prev_y" ${wiTip('Año anterior')}><i class="fas fa-angles-left"></i></button>
        <button class="mes_nav_btn" id="mes_prev" ${wiTip('Mes anterior')}><i class="fas fa-chevron-left"></i></button>
        <div class="mes_nav_label" id="mes_label"></div>
        <button class="mes_nav_btn" id="mes_next" ${wiTip('Mes siguiente')}><i class="fas fa-chevron-right"></i></button>
        <button class="mes_nav_btn" id="mes_next_y" ${wiTip('Año siguiente')}><i class="fas fa-angles-right"></i></button>
      </div>
      <button class="mes_nav_hoy" id="mes_hoy" ${wiTip('Ir a hoy')}><i class="fas fa-calendar-check"></i> Hoy</button>
    </div>
    <div class="mes_tb_right">
      <div class="mes_resumen">
        <div class="mes_res_item" ${wiTip('Eventos del mes')}><i class="fas fa-calendar-days" style="color:var(--mco)"></i><strong id="mes_n_total">0</strong><span>Total</span></div>
        <div class="mes_res_sep"></div>
        <div class="mes_res_item" ${wiTip('Días con eventos')}><i class="fas fa-calendar-week" style="color:#7000FF"></i><strong id="mes_n_dias">0</strong><span>Días</span></div>
      </div>
      <button class="mes_btn_add" id="mes_add" ${wiTip('Agregar evento')}><i class="fas fa-plus"></i> Nuevo</button>
    </div>
  </div>

  <div class="mes_content">
    <div class="mes_calendar" id="mes_calendar">
      <div class="mes_weekdays">
        ${DIAS_SEMANA.map(d=>`<div class="mes_weekday">${d}</div>`).join('')}
      </div>
      <div class="mes_days" id="mes_days">
        <!-- Days render here -->
      </div>
    </div>
    
    <div class="mes_sidebar" id="mes_sidebar">
      <div class="mes_side_header">
        <span id="mes_side_fecha">Selecciona un día</span>
      </div>
      <div class="mes_side_body" id="mes_side_body">
        <div class="mes_empty"><i class="fas fa-hand-pointer"></i><span>Haz clic en un día para ver sus eventos</span></div>
      </div>
      <div class="mes_side_footer">
        <button class="mes_quick_add dpn" id="mes_quick_add"><i class="fas fa-plus"></i> Agregar evento</button>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_mensual">
  <div class="modalBody mes_modal">
    <button class="modalX" ${wiTip('Cerrar (Esc)')}><i class="fas fa-times"></i></button>
    <div class="mes_modal_hero" id="mes_m_hero">
      <div class="mes_deco1"></div>
      <div class="mes_deco2"></div>
      <div class="mes_modal_ico" id="mes_m_ico"><i class="fas fa-calendar-plus"></i></div>
      <div class="mes_modal_info">
        <h2 class="mes_modal_tit" id="mes_m_tit">Nuevo Evento</h2>
        <p class="mes_modal_sub" id="mes_m_sub">Planifica tu mes</p>
      </div>
    </div>
    <div class="mes_modal_body">
      <div class="mes_section">
        <div class="mes_section_tit"><i class="fas fa-heading"></i> Información</div>
        <div class="mes_field">
          <label class="mes_label">Título <span class="mes_req">*</span></label>
          <input type="text" class="mes_input" id="m_titulo" placeholder="Ej: Cita médica" maxlength="100" autocomplete="off"/>
        </div>
        <div class="mes_field">
          <label class="mes_label">Descripción</label>
          <textarea class="mes_textarea" id="m_desc" placeholder="Notas adicionales..." rows="2"></textarea>
        </div>
      </div>

      <div class="mes_section">
        <div class="mes_section_tit"><i class="fas fa-clock"></i> Fecha y Hora</div>
        <div class="mes_field_row">
          <div class="mes_field">
            <label class="mes_label"><i class="fas fa-calendar"></i> Fecha</label>
            <input type="date" class="mes_input" id="m_fecha"/>
          </div>
          <div class="mes_field">
            <label class="mes_label"><i class="fas fa-play"></i> Inicio</label>
            <input type="time" class="mes_input" id="m_inicio" value="09:00"/>
          </div>
          <div class="mes_field">
            <label class="mes_label"><i class="fas fa-stop"></i> Fin</label>
            <input type="time" class="mes_input" id="m_fin" value="10:00"/>
          </div>
        </div>
      </div>

      <div class="mes_section">
        <div class="mes_section_tit"><i class="fas fa-sliders"></i> Detalles</div>
        <div class="mes_field_row2">
          <div class="mes_field">
            <label class="mes_label"><i class="fas fa-tag"></i> Categoría</label>
            <select class="mes_select" id="m_tipo">
              ${Object.entries(TIPOS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
            </select>
          </div>
          <div class="mes_field">
            <label class="mes_label"><i class="fas fa-flag"></i> Prioridad</label>
            <select class="mes_select" id="m_prio">
              <option value="alta">🔴 Alta</option>
              <option value="media" selected>🟡 Media</option>
              <option value="baja">🟢 Baja</option>
            </select>
          </div>
        </div>
        <div class="mes_field">
          <label class="mes_label"><i class="fas fa-palette"></i> Color</label>
          <div class="mes_colores" id="m_colores">
            ${COLORES.map(c=>`<button type="button" class="mes_color_opt" data-color="${c}" style="--c:${c}" ${wiTip(c)}></button>`).join('')}
          </div>
        </div>
      </div>
    </div>
    <div class="mes_modal_footer">
      <button type="button" class="mes_btn_del dpn" id="m_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
      <div class="mes_modal_footer_r">
        <button type="button" class="mes_btn_cancel" id="m_cancelar">Cancelar</button>
        <button type="button" class="mes_btn_save" id="m_guardar"><i class="fas fa-check-circle"></i> Guardar</button>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_mes_confirm">
  <div class="modalBody mes_modal_confirm">
    <div class="mes_confirm_ico"><i class="fas fa-triangle-exclamation"></i></div>
    <h3>¿Eliminar evento?</h3>
    <p id="mes_confirm_nombre"></p>
    <div class="mes_confirm_btns">
      <button class="mes_btn_cancel" id="mes_conf_no">Cancelar</button>
      <button class="mes_btn_del_confirm" id="mes_conf_si"><i class="fas fa-trash"></i> Eliminar</button>
    </div>
  </div>
</div>`;

/* ── Render Calendar ── */
const _renderCalendar = () => {
  const diasMes = getDiasDelMes(_mes, _anio);
  const primerDia = getPrimerDiaSemana(_mes, _anio);
  const eventosDelMes = getDelMes(_mes, _anio);
  const $days = $('#mes_days').empty();
  
  // Días vacíos al inicio
  for (let i = 0; i < primerDia; i++) {
    $days.append(`<div class="mes_day mes_day_empty"></div>`);
  }
  
  // Días del mes
  for (let d = 1; d <= diasMes; d++) {
    const fecha = formatoFecha(d, _mes, _anio);
    const eventos = eventosDelMes.filter(e => e.fecha === fecha);
    const isHoy = esHoy(fecha);
    const isPast = esPasado(fecha);
    const isSel = fecha === _selFecha;
    
    let dotsHtml = '';
    if (eventos.length) {
      const colors = [...new Set(eventos.slice(0, 3).map(e => e.color || TIPOS[e.tipo]?.color || '#94A3B8'))];
      dotsHtml = `<div class="mes_day_dots">${colors.map(c=>`<span class="mes_dot" style="background:${c}"></span>`).join('')}${eventos.length > 3 ? `<span class="mes_dot_more">+${eventos.length-3}</span>` : ''}</div>`;
    }
    
    $days.append(`
      <div class="mes_day ${isHoy ? 'mes_day_hoy' : ''} ${isPast ? 'mes_day_past' : ''} ${isSel ? 'mes_day_sel' : ''}" data-fecha="${fecha}">
        <span class="mes_day_num">${d}</span>
        ${dotsHtml}
        ${eventos.length ? `<span class="mes_day_count">${eventos.length}</span>` : ''}
      </div>
    `);
  }
  
  // Actualizar label
  $('#mes_label').html(`<i class="fas fa-calendar"></i> ${MESES[_mes]} ${_anio}`);
  
  // Stats
  const uniqueDays = new Set(eventosDelMes.map(e => e.fecha)).size;
  $('#mes_n_total').text(eventosDelMes.length);
  $('#mes_n_dias').text(uniqueDays);
  
  // Actualizar sidebar si hay fecha seleccionada
  if (_selFecha) _renderSidebar(_selFecha);
};

const _renderSidebar = (fecha) => {
  _selFecha = fecha;
  const eventos = getDelDia(fecha).sort((a,b) => {
    const ha = a.horaInicio || '00:00';
    const hb = b.horaInicio || '00:00';
    return ha.localeCompare(hb);
  });
  
  $('#mes_side_fecha').html(`<i class="fas fa-calendar-day"></i> ${fmtFecha(fecha)}`);
  $('#mes_quick_add').removeClass('dpn');
  
  const $body = $('#mes_side_body');
  
  if (!eventos.length) {
    $body.html(`<div class="mes_empty"><i class="fas fa-calendar-xmark"></i><span>Sin eventos este día</span></div>`);
    return;
  }
  
  $body.html(eventos.map(ev => {
    const tipo = TIPOS[ev.tipo] || TIPOS.otro;
    const isDone = ev.estado === 'completado';
    return `
      <div class="mes_side_item ${isDone ? 'mes_side_done' : ''}" data-id="${ev._fsId}">
        <div class="mes_side_bar" style="background:${ev.color || tipo.color}"></div>
        <div class="mes_side_content">
          <div class="mes_side_time">${ev.horaInicio || '--:--'} - ${ev.horaFin || '--:--'}</div>
          <div class="mes_side_titulo">${ev.titulo}</div>
          <div class="mes_side_tipo"><i class="fas ${tipo.icon}"></i> ${tipo.label}</div>
        </div>
        <div class="mes_side_actions">
          <button class="mes_side_check" data-id="${ev._fsId}" ${wiTip(isDone?'Pendiente':'Completar')}><i class="fas ${isDone?'fa-undo':'fa-check'}"></i></button>
          <button class="mes_side_edit" data-id="${ev._fsId}" ${wiTip('Editar')}><i class="fas fa-pen"></i></button>
        </div>
      </div>
    `;
  }).join(''));
  
  // Highlight selected day in calendar
  $('.mes_day').removeClass('mes_day_sel');
  $(`.mes_day[data-fecha="${fecha}"]`).addClass('mes_day_sel');
};

/* ── Modal ── */
const _openModal = (item = null) => {
  _edit = item;
  const isNew = !item;
  
  $('#mes_m_tit').text(isNew ? 'Nuevo Evento' : 'Editar Evento');
  $('#mes_m_sub').text(isNew ? 'Planifica tu mes' : 'Modifica los detalles');
  $('#mes_m_ico i').attr('class', isNew ? 'fas fa-calendar-plus' : 'fas fa-calendar-pen');
  
  $('#m_titulo').val(item?.titulo || '');
  $('#m_desc').val(item?.descripcion || '');
  $('#m_fecha').val(item?.fecha || _selFecha || hoy());
  $('#m_inicio').val(item?.horaInicio || '09:00');
  $('#m_fin').val(item?.horaFin || '10:00');
  $('#m_tipo').val(item?.tipo || 'trabajo');
  $('#m_prio').val(item?.prioridad || 'media');
  
  $('.mes_color_opt').removeClass('active');
  const col = item?.color || TIPOS[item?.tipo || 'trabajo']?.color || COLORES[0];
  $(`.mes_color_opt[data-color="${col}"]`).addClass('active');
  
  $('#m_eliminar').toggleClass('dpn', isNew);
  
  abrirModal('modal_mensual');
  setTimeout(() => $('#m_titulo').trigger('focus'), 100);
};

const _saveEvento = () => {
  const titulo = $('#m_titulo').val().trim();
  if (!titulo) return Notificacion('El título es requerido', 'error');
  
  const fecha = $('#m_fecha').val();
  if (!fecha) return Notificacion('La fecha es requerida', 'error');
  
  const item = {
    ...(_edit || {}),
    titulo,
    descripcion: $('#m_desc').val().trim(),
    fecha,
    horaInicio: $('#m_inicio').val(),
    horaFin: $('#m_fin').val(),
    tipo: $('#m_tipo').val(),
    prioridad: $('#m_prio').val(),
    color: $('.mes_color_opt.active').data('color') || COLORES[0],
    estado: _edit?.estado || 'pendiente',
  };
  
  _upsert(item);
  cerrarModal('modal_mensual');
  _renderCalendar();
  if (_selFecha) _renderSidebar(_selFecha);
  Notificacion(_edit ? '✓ Evento actualizado' : '✓ Evento creado', 'success');
};

/* ── Bindings ── */
const _bind = () => {
  // Navigation
  $('#mes_prev').off('click.mes').on('click.mes', () => { _mes--; if (_mes < 0) { _mes = 11; _anio--; } _renderCalendar(); });
  $('#mes_next').off('click.mes').on('click.mes', () => { _mes++; if (_mes > 11) { _mes = 0; _anio++; } _renderCalendar(); });
  $('#mes_prev_y').off('click.mes').on('click.mes', () => { _anio--; _renderCalendar(); });
  $('#mes_next_y').off('click.mes').on('click.mes', () => { _anio++; _renderCalendar(); });
  $('#mes_hoy').off('click.mes').on('click.mes', () => { 
    const n = new Date();
    _mes = n.getMonth();
    _anio = n.getFullYear();
    _selFecha = hoy();
    _renderCalendar();
    _renderSidebar(_selFecha);
  });
  
  // Day click
  $(document).off('click.mes_day').on('click.mes_day', '.mes_day:not(.mes_day_empty)', function() {
    const fecha = $(this).data('fecha');
    _renderSidebar(fecha);
  });
  
  // Add
  $('#mes_add').off('click.mes').on('click.mes', () => _openModal());
  $('#mes_quick_add').off('click.mes').on('click.mes', () => _openModal());
  
  // Modal
  $('#m_guardar').off('click.mes').on('click.mes', _saveEvento);
  $('#m_cancelar').off('click.mes').on('click.mes', () => cerrarModal('modal_mensual'));
  
  // Colors
  $(document).off('click.mes_col').on('click.mes_col', '.mes_color_opt', function() {
    $('.mes_color_opt').removeClass('active');
    $(this).addClass('active');
  });
  
  // Sidebar actions
  $(document).off('click.mes_edit').on('click.mes_edit', '.mes_side_edit, .mes_side_item', function(e) {
    if ($(e.target).closest('.mes_side_check').length) return;
    const id = $(this).data('id') || $(this).closest('.mes_side_item').data('id');
    const item = getAll().find(x => x._fsId === id);
    if (item) _openModal(item);
  });
  
  $(document).off('click.mes_check').on('click.mes_check', '.mes_side_check', function(e) {
    e.stopPropagation();
    const id = $(this).data('id');
    const item = getAll().find(x => x._fsId === id);
    if (item) {
      item.estado = item.estado === 'completado' ? 'pendiente' : 'completado';
      _upsert(item);
      _renderCalendar();
      if (_selFecha) _renderSidebar(_selFecha);
      Notificacion(item.estado === 'completado' ? '✓ Completado' : '↺ Pendiente', 'success');
    }
  });
  
  // Delete
  $('#m_eliminar').off('click.mes').on('click.mes', () => {
    if (!_edit) return;
    $('#mes_confirm_nombre').text(_edit.titulo);
    abrirModal('modal_mes_confirm');
  });
  
  $('#mes_conf_si').off('click.mes').on('click.mes', () => {
    if (_edit) {
      _delete(_edit);
      cerrarModal('modal_mes_confirm');
      cerrarModal('modal_mensual');
      _renderCalendar();
      if (_selFecha) _renderSidebar(_selFecha);
      Notificacion('🗑 Evento eliminado', 'success');
    }
  });
  $('#mes_conf_no').off('click.mes').on('click.mes', () => cerrarModal('modal_mes_confirm'));
  
  // Keyboard
  $(document).off('keydown.mes').on('keydown.mes', e => {
    if ($('.wiModal.active').length) return;
    if (e.key === 'n' || e.key === 'N') { e.preventDefault(); _openModal(); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); _mes--; if (_mes < 0) { _mes = 11; _anio--; } _renderCalendar(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); _mes++; if (_mes > 11) { _mes = 0; _anio++; } _renderCalendar(); }
    if (e.key === 't' || e.key === 'T') { e.preventDefault(); const n = new Date(); _mes = n.getMonth(); _anio = n.getFullYear(); _renderCalendar(); }
  });
};

/* ── Init / Cleanup ── */
export const init = async () => {
  await _cargar();
  _renderCalendar();
  _bind();
};

export const cleanup = () => {
  $(document).off('.mes');
  $(document).off('.mes_day');
  $(document).off('.mes_col');
  $(document).off('.mes_edit');
  $(document).off('.mes_check');
};
