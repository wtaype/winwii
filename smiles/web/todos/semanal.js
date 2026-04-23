import './semanal.css';
import $ from 'jquery';
import { db } from '../firebase.js';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Notificacion, abrirModal, cerrarModal, getls, savels, wiTip, wiSpin, wiAuth } from '../widev.js';

/* ══════════════════════════════════════════════════════════════
   SEMANAL v2.0 PRO — Vista de Semana Integrada
   ✨ Usa colección unificada 'horario' · Compatible con diario/mensual
══════════════════════════════════════════════════════════════ */

const CACHE = 'wii_horario_v1', COL = 'horario';

const DIAS = ['Lunes','Martes','Miércoles','Jueves','Viernes','Sábado','Domingo'];

const TIPOS = {
  trabajo:   { label:'Trabajo',   icon:'fa-briefcase',      color:'#0EBEFF' },
  estudio:   { label:'Estudio',   icon:'fa-book',           color:'#7000FF' },
  personal:  { label:'Personal',  icon:'fa-user',           color:'#FFB800' },
  salud:     { label:'Salud',     icon:'fa-heart-pulse',    color:'#FF5C69' },
  proyecto:  { label:'Proyecto',  icon:'fa-diagram-project',color:'#A855F7' },
  reunion:   { label:'Reunión',   icon:'fa-users',          color:'#29C72E' },
  otro:      { label:'Otro',      icon:'fa-circle',         color:'#94A3B8' },
};

const PRIOS = {
  alta:   { label:'Alta',   color:'#FF5C69', icon:'fa-arrow-up'   },
  media:  { label:'Media',  color:'#FFB800', icon:'fa-minus'      },
  baja:   { label:'Baja',   color:'#29C72E', icon:'fa-arrow-down' },
};

const COLORES = ['#0EBEFF','#7000FF','#FFB800','#FF5C69','#29C72E','#A855F7','#00C9B1','#94A3B8'];

/* ── Utils ── */
const hoy       = () => new Date().toISOString().split('T')[0];
const getLunes  = (ref = new Date()) => { const d = new Date(ref); const day = d.getDay()||7; d.setDate(d.getDate()-day+1); return d.toISOString().split('T')[0]; };
const addDays   = (f, n) => { const d = new Date(f+'T12:00:00'); d.setDate(d.getDate()+n); return d.toISOString().split('T')[0]; };
const fmtFecha  = f => new Date(f+'T00:00:00').toLocaleDateString('es-PE',{day:'numeric',month:'short'});
const fmtLargo  = f => new Date(f+'T00:00:00').toLocaleDateString('es-PE',{weekday:'long',day:'numeric',month:'long'});
const mkId      = tit => { const s=(tit||'hor').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'').slice(0,25); return `${s}_${Date.now()}`; };
const esHoy     = f => f === hoy();
const esPasado  = f => f < hoy();
const pct       = items => { const t=items.length, d=items.filter(x=>x.estado==='completado').length; return t?Math.round(d/t*100):0; };

/* ── Auth / Cache ── */
const getUser  = () => getls('wiSmile')||null;
const isLogged = () => !!getUser()?.usuario;
const getAll   = () => getls(CACHE)||[];
const setAll   = l  => savels(CACHE,l,48);

/* ── Sync dot ── */
const _sync = s => { const $d=$('#sem_sync'); if(!$d.length) return; $d[0].className=`sem_sync_dot sem_sync_${s}`; };

/* ── Firestore ── */
const _cargar = async (force=false) => {
  if (!force&&getAll().length) return _sync('ok');
  if (!isLogged()) return _sync('error');
  _sync('loading');
  try {
    const snap = await getDocs(query(collection(db,COL), where('usuario','==',getUser().usuario)));
    setAll(snap.docs.map(d=>({...d.data(),_fsId:d.id,id:d.id})));
    _sync('ok');
  } catch(e) { console.error('❌ semanal:',e); _sync('error'); }
};

const _upsert = item => {
  const list=getAll(), id=item._fsId||mkId(item.titulo), full={...item,_fsId:id,id};
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

const _delete = item => {
  const id=item._fsId||item.id;
  setAll(getAll().filter(x=>x._fsId!==id));
  if (isLogged()) { _sync('saving'); deleteDoc(doc(db,COL,id)).then(()=>_sync('ok')).catch(e=>{console.error('❌ del:',e);_sync('error');}); }
};

/* ── State ── */
let _lunes     = getLunes();
let _edit      = null;
let _confirmCb = null;

/* ── Data helpers (usa fecha en lugar de semana+dia) ── */
const _semItems = () => {
  const fin = addDays(_lunes, 6);
  return getAll().filter(x => x.fecha >= _lunes && x.fecha <= fin);
};
const _diaItems = fecha => getAll().filter(x => x.fecha === fecha);

/* ══════════════════════════════════════════════════════════
   RENDER HTML
══════════════════════════════════════════════════════════ */
export const render = () => `
<div class="sem_wrap">

  <!-- TOOLBAR -->
  <div class="sem_toolbar">
    <div class="sem_tb_left">
      <div class="sem_logo"><i class="fas fa-table-cells"></i><span>Semana</span></div>
      <span class="sem_sync_dot sem_sync_loading" id="sem_sync" ${wiTip('Estado de sincronización')}></span>
    </div>
    <div class="sem_tb_center">
      <div class="sem_week_nav">
        <button class="sem_nav_btn" id="sem_prev" ${wiTip('Semana anterior')}><i class="fas fa-chevron-left"></i></button>
        <button class="sem_nav_hoy" id="sem_hoy"><i class="fas fa-crosshairs"></i> Hoy</button>
        <button class="sem_nav_btn" id="sem_next" ${wiTip('Semana siguiente')}><i class="fas fa-chevron-right"></i></button>
      </div>
      <div class="sem_week_label" id="sem_week_label">—</div>
    </div>
    <div class="sem_tb_right">
      <div class="sem_resumen" id="sem_resumen">
        <div class="sem_res_item"><i class="fas fa-layer-group" style="color:var(--mco)"></i><strong id="sem_n_total">0</strong><span>Actividades</span></div>
        <div class="sem_res_sep"></div>
        <div class="sem_res_item"><i class="fas fa-circle-check" style="color:#29C72E"></i><strong id="sem_n_done">0</strong><span>Hechas</span></div>
        <div class="sem_res_sep"></div>
        <div class="sem_res_item"><i class="fas fa-chart-line" style="color:#0EBEFF"></i><strong id="sem_n_pct">0%</strong><span>Avance</span></div>
      </div>
      <button class="sem_btn_add" id="sem_nuevo"><i class="fas fa-plus"></i> Nueva</button>
    </div>
  </div>

  <!-- BOARD SEMANAL -->
  <div class="sem_board" id="sem_board"></div>

</div>

<!-- MODAL ACTIVIDAD -->
<div class="wiModal" id="modal_semanal">
  <div class="modalBody sem_modal">
    <button class="modalX"><i class="fas fa-times"></i></button>
    
    <div class="sem_modal_hero" id="sem_m_hero">
      <div class="sem_deco1"></div>
      <div class="sem_deco2"></div>
      <div class="sem_modal_ico" id="sem_m_ico"><i class="fas fa-calendar-plus"></i></div>
      <div class="sem_modal_info">
        <h2 class="sem_modal_tit" id="sem_m_tit">Nueva Actividad</h2>
        <p class="sem_modal_sub" id="sem_m_sub">Organiza tu semana</p>
      </div>
    </div>
    
    <div class="sem_modal_body">
      <div class="sem_section">
        <div class="sem_section_tit"><i class="fas fa-info-circle"></i> Información</div>
        <div class="sem_field">
          <label class="sem_label"><i class="fas fa-heading"></i> Título <span class="sem_req">*</span></label>
          <input type="text" class="sem_input" id="s_titulo" placeholder="Ej: Estudiar matemáticas" maxlength="80"/>
        </div>
        <div class="sem_field">
          <label class="sem_label"><i class="fas fa-align-left"></i> Descripción</label>
          <textarea class="sem_textarea" id="s_nota" placeholder="Detalles opcionales…" maxlength="300" rows="2"></textarea>
        </div>
      </div>
      
      <div class="sem_section">
        <div class="sem_section_tit"><i class="fas fa-clock"></i> Horario</div>
        <div class="sem_field_row">
          <div class="sem_field">
            <label class="sem_label"><i class="fas fa-calendar-day"></i> Fecha</label>
            <input type="date" class="sem_input" id="s_fecha"/>
          </div>
          <div class="sem_field">
            <label class="sem_label"><i class="fas fa-clock"></i> Inicio</label>
            <input type="time" class="sem_input" id="s_hora_inicio"/>
          </div>
          <div class="sem_field">
            <label class="sem_label"><i class="fas fa-hourglass-end"></i> Fin</label>
            <input type="time" class="sem_input" id="s_hora_fin"/>
          </div>
        </div>
      </div>
      
      <div class="sem_section">
        <div class="sem_section_tit"><i class="fas fa-sliders"></i> Detalles</div>
        <div class="sem_field_row">
          <div class="sem_field">
            <label class="sem_label"><i class="fas fa-tag"></i> Tipo</label>
            <select class="sem_select" id="s_tipo">
              ${Object.entries(TIPOS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
            </select>
          </div>
          <div class="sem_field">
            <label class="sem_label"><i class="fas fa-flag"></i> Prioridad</label>
            <select class="sem_select" id="s_prio">
              ${Object.entries(PRIOS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
            </select>
          </div>
          <div class="sem_field">
            <label class="sem_label"><i class="fas fa-circle-half-stroke"></i> Estado</label>
            <select class="sem_select" id="s_estado">
              <option value="pendiente">Pendiente</option>
              <option value="progreso">En progreso</option>
              <option value="completado">Completado</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="sem_section">
        <div class="sem_section_tit"><i class="fas fa-palette"></i> Personalizar</div>
        <div class="sem_colores" id="s_colores">
          ${COLORES.map(c=>`<button type="button" class="sem_color_opt" data-color="${c}" style="--c:${c}"></button>`).join('')}
        </div>
      </div>
    </div>
    
    <div class="sem_modal_footer">
      <button type="button" class="sem_btn_del dpn" id="s_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
      <div class="sem_modal_footer_r">
        <button type="button" class="sem_btn_cancel" id="s_cancelar">Cancelar</button>
        <button type="button" class="sem_btn_save" id="s_guardar"><i class="fas fa-floppy-disk"></i> Guardar</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL CONFIRMAR -->
<div class="wiModal" id="modal_sem_confirm">
  <div class="modalBody sem_modal_confirm">
    <div class="sem_confirm_ico"><i class="fas fa-triangle-exclamation"></i></div>
    <h3>¿Eliminar actividad?</h3>
    <p id="sem_confirm_nombre"></p>
    <div class="sem_confirm_btns">
      <button class="sem_btn_cancel" id="sem_conf_no">Cancelar</button>
      <button class="sem_btn_del_confirm" id="sem_conf_si"><i class="fas fa-trash"></i> Eliminar</button>
    </div>
  </div>
</div>`;

/* ══════════════════════════════════════════════════════════
   RENDER BOARD
══════════════════════════════════════════════════════════ */
const _renderBoard = () => {
  const $b = $('#sem_board').empty();
  const all = _semItems();

  /* stats globales */
  const tots = all.length, done = all.filter(x=>x.estado==='completado').length, avance = pct(all);
  $('#sem_n_total').text(tots);
  $('#sem_n_done').text(done);
  $('#sem_n_pct').text(`${avance}%`);

  /* label semana */
  const fin = addDays(_lunes, 6);
  $('#sem_week_label').text(`${fmtFecha(_lunes)} — ${fmtFecha(fin)}`);

  DIAS.forEach((dNombre, i) => {
    const fecha  = addDays(_lunes, i);
    const items  = _diaItems(fecha);
    const isHoy  = esHoy(fecha);
    const isPast = esPasado(fecha);
    const dDone  = items.filter(x=>x.estado==='completado').length;
    const dPct   = pct(items);

    $b.append(`
    <div class="sem_col${isHoy?' sem_col_hoy':''}${isPast?' sem_col_past':''}" data-fecha="${fecha}">
      <div class="sem_col_head">
        <div class="sem_col_dia">
          <span class="sem_col_nombre">${dNombre}</span>
          <span class="sem_col_fecha${isHoy?' sem_col_hoy_badge':''}">${fmtFecha(fecha)}${isHoy?' · Hoy':''}</span>
        </div>
        <div class="sem_col_meta">
          ${items.length?`<span class="sem_col_count">${items.length}</span>`:''}
          ${!isPast?`<button class="sem_col_add" data-fecha="${fecha}" ${wiTip('Agregar')}><i class="fas fa-plus"></i></button>`:''}
        </div>
      </div>
      ${items.length?`
      <div class="sem_col_prog">
        <div class="sem_col_prog_bar"><div class="sem_col_prog_fill" style="width:${dPct}%"></div></div>
        <span class="sem_col_prog_txt">${dDone}/${items.length}</span>
      </div>`:''}
      <div class="sem_col_body" data-fecha="${fecha}">
        ${items.length===0?`<div class="sem_empty_dia"><i class="fas fa-moon"></i><span>${isPast?'Sin registros':'Vacío'}</span></div>`:''}
      </div>
    </div>`);

    /* cards del día */
    const $body = $b.find(`.sem_col_body[data-fecha="${fecha}"]`);
    items.sort((a,b)=>(a.horaInicio||'99:99').localeCompare(b.horaInicio||'99:99')).forEach(item => {
      const tipo = TIPOS[item.tipo]||TIPOS.otro;
      const prio = PRIOS[item.prioridad]||PRIOS.media;
      const color = item.color||tipo.color;
      const isDone = item.estado === 'completado';

      $body.append(`
      <div class="sem_item${isDone?' sem_item_done':''}" data-id="${item._fsId}" style="--ic:${color}">
        <div class="sem_item_left">
          <button class="sem_item_check${isDone?' sem_item_checked':''}" data-id="${item._fsId}" ${wiTip(isDone?'Marcar pendiente':'Completar')}>
            <i class="fas ${isDone?'fa-circle-check':'fa-circle-dot'}"></i>
          </button>
        </div>
        <div class="sem_item_body">
          <div class="sem_item_titulo">${item.titulo}</div>
          <div class="sem_item_meta">
            ${item.horaInicio?`<span class="sem_item_hora"><i class="fas fa-clock"></i> ${item.horaInicio}${item.horaFin?' - '+item.horaFin:''}</span>`:''}
            <span class="sem_item_tipo" style="--tc:${tipo.color}"><i class="fas ${tipo.icon}"></i> ${tipo.label}</span>
          </div>
          ${item.descripcion?`<p class="sem_item_nota">${item.descripcion}</p>`:''}
        </div>
        <div class="sem_item_actions">
          <button class="sem_item_edit" data-id="${item._fsId}" ${wiTip('Editar')}><i class="fas fa-pen"></i></button>
        </div>
      </div>`);
    });
  });
};

/* ══════════════════════════════════════════════════════════
   MODAL HELPERS
══════════════════════════════════════════════════════════ */
const _selColor   = c => { $('#s_colores .sem_color_opt').removeClass('active'); $(`#s_colores .sem_color_opt[data-color="${c}"]`).addClass('active'); };
const _getColor   = () => $('#s_colores .sem_color_opt.active').data('color')||COLORES[0];
const _heroColor  = (color, icon) => {
  $('#sem_m_hero').css('background',`linear-gradient(145deg,${color},${color}99)`);
  $('#sem_m_ico').css('background',`${color}33`).html(`<i class="fas ${icon}" style="color:${color}"></i>`);
};

const _openModal = (d={}, fechaPresel=null) => {
  _edit = d._fsId ? d : null;
  const tipo  = d.tipo||'trabajo';
  const color = d.color||TIPOS[tipo]?.color||COLORES[0];

  $('#s_titulo').val(d.titulo||'');
  $('#s_nota').val(d.descripcion||'');
  $('#s_fecha').val(d.fecha||(fechaPresel||hoy()));
  $('#s_hora_inicio').val(d.horaInicio||'');
  $('#s_hora_fin').val(d.horaFin||'');
  $('#s_tipo').val(tipo);
  $('#s_prio').val(d.prioridad||'media');
  $('#s_estado').val(d.estado||'pendiente');
  _selColor(color);
  _heroColor(color, TIPOS[tipo]?.icon||'fa-calendar-plus');
  $('#sem_m_tit').text(_edit?'Editar Actividad':'Nueva Actividad');
  $('#sem_m_sub').text(_edit?fmtLargo(d.fecha):'Organiza tu semana');
  $('#s_eliminar').toggleClass('dpn',!_edit);
  abrirModal('modal_semanal');
  setTimeout(()=>$('#s_titulo').focus(),30);
};

const _guardar = () => {
  const titulo = $('#s_titulo').val().trim();
  if (!titulo) return Notificacion('Título requerido','warning');
  
  const fecha = $('#s_fecha').val();
  if (!fecha) return Notificacion('Fecha requerida','warning');
  
  wiSpin('#s_guardar',true,'Guardar');
  const tipo = $('#s_tipo').val();
  
  _upsert({
    ...(_edit||{}),
    titulo,
    descripcion:  $('#s_nota').val().trim(),
    fecha,
    horaInicio:   $('#s_hora_inicio').val()||'',
    horaFin:      $('#s_hora_fin').val()||'',
    tipo,
    prioridad:    $('#s_prio').val(),
    estado:       $('#s_estado').val(),
    color:        _getColor(),
    creado:       _edit?.creado||new Date().toISOString(),
  });
  
  cerrarModal('modal_semanal');
  _renderBoard();
  wiSpin('#s_guardar',false,'Guardar');
  Notificacion(_edit?'✓ Actividad actualizada':'✓ Actividad creada','success');
};

const _toggleDone = id => {
  const item = getAll().find(x=>x._fsId===id); 
  if (!item) return;
  const nuevoEstado = item.estado === 'completado' ? 'pendiente' : 'completado';
  _upsert({...item, estado: nuevoEstado, completadoEn: nuevoEstado==='completado'?new Date().toISOString():''});
  _renderBoard();
  if (nuevoEstado==='completado') Notificacion('✅ ¡Completado!','success');
};

const _openConfirm = item => {
  $('#sem_confirm_nombre').text(item.titulo||'Sin título');
  _confirmCb = () => { _delete(item); cerrarModal('modal_sem_confirm'); _renderBoard(); Notificacion('Actividad eliminada ✓','success'); };
  abrirModal('modal_sem_confirm');
};

/* ══════════════════════════════════════════════════════════
   BIND
══════════════════════════════════════════════════════════ */
const _bind = () => {
  $(document).off('.sem');
  const $d = $(document);

  $d
    /* navegación semana */
    .on('click.sem','#sem_prev',   ()=>{ _lunes=addDays(_lunes,-7); _renderBoard(); })
    .on('click.sem','#sem_next',   ()=>{ _lunes=addDays(_lunes,7);  _renderBoard(); })
    .on('click.sem','#sem_hoy',    ()=>{ _lunes=getLunes(); _renderBoard(); })
    
    /* nueva actividad global */
    .on('click.sem','#sem_nuevo',   ()=>_openModal({},null))
    
    /* nueva actividad por día */
    .on('click.sem','.sem_col_add', function(e){ e.stopPropagation(); _openModal({},$(this).data('fecha')); })
    
    /* toggle done */
    .on('click.sem','.sem_item_check', function(e){ e.stopPropagation(); _toggleDone($(this).data('id')); })
    
    /* click card → edit */
    .on('click.sem','.sem_item', function(e){
      if ($(e.target).closest('.sem_item_check,.sem_item_edit').length) return;
      const item = getAll().find(x=>x._fsId===$(this).data('id'));
      if (item) _openModal(item);
    })
    
    /* edit btn */
    .on('click.sem','.sem_item_edit', function(e){
      e.stopPropagation();
      const item = getAll().find(x=>x._fsId===$(this).data('id'));
      if (item) _openModal(item);
    })
    
    /* modal form */
    .on('change.sem','#s_tipo', function(){
      const tipo = $(this).val();
      _heroColor(_getColor(), TIPOS[tipo]?.icon||'fa-calendar-plus');
    })
    .on('click.sem','#s_colores .sem_color_opt', function(){
      _selColor($(this).data('color'));
      _heroColor($(this).data('color'), TIPOS[$('#s_tipo').val()]?.icon||'fa-calendar-plus');
    })
    .on('click.sem','#s_cancelar',   ()=>cerrarModal('modal_semanal'))
    .on('click.sem','#s_guardar',    _guardar)
    .on('keydown.sem','#s_titulo',   e=>{ if(e.key==='Enter') _guardar(); })
    .on('click.sem','#s_eliminar',   ()=>{ if(_edit){ cerrarModal('modal_semanal'); _openConfirm(_edit); } })
    
    /* confirm */
    .on('click.sem','#sem_conf_no', ()=>cerrarModal('modal_sem_confirm'))
    .on('click.sem','#sem_conf_si', ()=>_confirmCb?.())
    
    /* keyboard shortcuts */
    .on('keydown.sem', e => {
      if ($('.wiModal.active').length) return;
      if (e.target.tagName==='INPUT'||e.target.tagName==='TEXTAREA') return;
      if (e.key==='n'||e.key==='N') { e.preventDefault(); _openModal({}); }
      if (e.key==='ArrowLeft') { e.preventDefault(); _lunes=addDays(_lunes,-7); _renderBoard(); }
      if (e.key==='ArrowRight') { e.preventDefault(); _lunes=addDays(_lunes,7); _renderBoard(); }
      if (e.key==='t'||e.key==='T') { e.preventDefault(); _lunes=getLunes(); _renderBoard(); }
    });
};

/* ══════════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════════ */
export const init = async () => {
  _lunes = getLunes();
  await _cargar();
  _renderBoard();
  _bind();
  wiAuth(_cargar, _renderBoard);
  console.log('📅 Semanal v2.0 PRO OK');
};

export const cleanup = () => {
  $(document).off('.sem');
  console.log('🧹 Semanal limpiado');
};