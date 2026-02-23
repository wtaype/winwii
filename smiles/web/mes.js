import './mes.css';
import $ from 'jquery';
import { db } from '../smile/firebase.js';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Notificacion, abrirModal, cerrarModal, getls, savels, wiTip, wiSpin, wiAuth} from '../widev.js';

const CACHE = 'wii_mes_v1', COL = 'meses';

const CATEGORIAS = {
  trabajo:   { label:'Trabajo',   icon:'fa-briefcase',       color:'#0EBEFF' },
  personal:  { label:'Personal',  icon:'fa-user',            color:'#FFB800' },
  estudio:   { label:'Estudio',   icon:'fa-book',            color:'#7000FF' },
  salud:     { label:'Salud',     icon:'fa-heart-pulse',     color:'#FF5C69' },
  finanzas:  { label:'Finanzas',  icon:'fa-coins',           color:'#29C72E' },
  reunion:   { label:'Reunión',   icon:'fa-users',           color:'#A855F7' },
  proyecto:  { label:'Proyecto',  icon:'fa-diagram-project', color:'#00C9B1' },
  otro:      { label:'Otro',      icon:'fa-circle',          color:'#94A3B8' },
};

const PRIORIDADES = {
  alta:  { label:'Alta',  color:'#FF5C69', icon:'fa-arrow-up'   },
  media: { label:'Media', color:'#FFB800', icon:'fa-minus'      },
  baja:  { label:'Baja',  color:'#29C72E', icon:'fa-arrow-down' },
};

const COLORES = ['#0EBEFF','#FFB800','#7000FF','#FF5C69','#29C72E','#A855F7','#00C9B1','#94A3B8'];

const MESES_ES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const DIAS_ES  = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];

/* ── Utils ── */
const hoy        = () => new Date().toISOString().split('T')[0];
const addDias    = n  => { const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().split('T')[0]; };
const finDeMes   = (y,m) => new Date(y,m+1,0).toISOString().split('T')[0];
const mkId       = tit => { const s=(tit||'mes').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'').slice(0,25); return `${s}_${Date.now()}`; };
const esHoy      = f => f === hoy();
const esPasado   = f => f < hoy();
const primerDiaMes = (y,m) => new Date(y,m,1).getDay();
const diasEnMes    = (y,m) => new Date(y,m+1,0).getDate();
const fechaStr     = (y,m,d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const fmtCorto     = f => new Date(f+'T00:00:00').toLocaleDateString('es-PE',{day:'numeric',month:'short'});

/* ── Auth / Cache ── */
const getUser  = () => getls('wiSmile')||null;
const isLogged = () => !!getUser()?.usuario;
const getAll   = () => getls(CACHE)||[];
const setAll   = l  => savels(CACHE,l,48);

/* ── Sync dot ── */
const _sync = s => { const $d=$('#mes_sync'); if(!$d.length) return; $d[0].className=`mes_sync_dot mes_sync_${s}`; };

/* ── Firestore ── */
const _cargar = async (force=false) => {
  if (!force&&getAll().length) return _sync('ok');
  if (!isLogged()) return _sync('error');
  _sync('loading');
  try {
    const snap = await getDocs(query(collection(db,COL), where('usuario','==',getUser().usuario)));
    setAll(snap.docs.map(d=>({...d.data(),_fsId:d.id,id:d.id})));
    _sync('ok');
  } catch(e) { console.error('❌ mes:',e); _sync('error'); }
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
let _año       = new Date().getFullYear();
let _mes       = new Date().getMonth();
let _selFecha  = hoy();
let _edit      = null;
let _confirmCb = null;

const _diaItems = fecha => getAll().filter(x=>x.fecha===fecha);
const _mesItems = () => { const p=`${_año}-${String(_mes+1).padStart(2,'0')}`; return getAll().filter(x=>x.fecha?.startsWith(p)); };

/* ══════════════════════════════════════════════════════════
   SUGERENCIAS — relativas a la fecha base (seleccionada o hoy)
══════════════════════════════════════════════════════════ */
const _getSugerencias = (base) => {
  const d      = new Date(base+'T00:00:00');
  const addD   = n => { const x=new Date(d); x.setDate(x.getDate()+n); return x.toISOString().split('T')[0]; };
  const fMes   = new Date(d.getFullYear(), d.getMonth()+1, 0).toISOString().split('T')[0];
  const esBase = base === hoy();

  return [
    { label: esBase ? 'Hoy'    : 'Mismo día', fecha: base,       icon:'fa-circle-dot',      color:'#0EBEFF' },
    { label: 'Mañana',                         fecha: addD(1),    icon:'fa-sun',             color:'#FFB800' },
    { label: 'Pasado',                         fecha: addD(2),    icon:'fa-forward',         color:'#29C72E' },
    { label: '+1 semana',                      fecha: addD(7),    icon:'fa-calendar-week',   color:'#7000FF' },
    { label: 'Fin de mes',                     fecha: fMes,       icon:'fa-flag-checkered',  color:'#A855F7' },
  ];
};

/* ── Renderizar pills de sugerencias ── */
const _renderSugerencias = (base, fechaActual) => {
  const sugs = _getSugerencias(base);
  $('#mes_sugerencias').html(
    sugs.map(s => `
      <button type="button" class="mes_sug_btn${s.fecha===fechaActual?' active':''}"
        data-fecha="${s.fecha}" style="--sc:${s.color}" ${wiTip(fmtCorto(s.fecha))}>
        <i class="fas ${s.icon}"></i><span>${s.label}</span>
      </button>`).join('')
  );
};

/* ══════════════════════════════════════════════════════════
   RENDER HTML
══════════════════════════════════════════════════════════ */
export const render = () => `
<div class="mes_wrap">

  <!-- TOOLBAR -->
  <div class="mes_toolbar">
    <div class="mes_tb_left">
      <div class="mes_logo"><i class="fas fa-calendar-days"></i><span>Mes</span></div>
      <div class="mes_nav">
        <button class="mes_nav_btn" id="mes_prev" ${wiTip('Mes anterior')}><i class="fas fa-chevron-left"></i></button>
        <button class="mes_nav_hoy" id="mes_hoy"><i class="fas fa-crosshairs"></i> Hoy</button>
        <button class="mes_nav_btn" id="mes_next" ${wiTip('Mes siguiente')}><i class="fas fa-chevron-right"></i></button>
      </div>
      <div class="mes_titulo_mes" id="mes_titulo_mes">—</div>
    </div>
    <div class="mes_tb_right">
      <div class="mes_resumen" id="mes_resumen">
        <div class="mes_res_item"><i class="fas fa-layer-group" style="color:var(--mco)"></i><strong id="mes_n_total">0</strong><span>Eventos</span></div>
        <div class="mes_res_sep"></div>
        <div class="mes_res_item"><i class="fas fa-circle-check" style="color:#29C72E"></i><strong id="mes_n_done">0</strong><span>Hechos</span></div>
        <div class="mes_res_sep"></div>
        <div class="mes_res_item"><i class="fas fa-fire" style="color:#FF5C69"></i><strong id="mes_n_alta">0</strong><span>Urgentes</span></div>
      </div>
    </div>
  </div>

  <!-- ACTION BAR -->
  <div class="mes_actionbar">
    <div class="mes_ab_left">
      <span class="mes_sync_dot mes_sync_loading" id="mes_sync"></span>
      <button class="mes_ab_btn" id="mes_refresh" ${wiTip('Actualizar')}><i class="fas fa-rotate-right"></i></button>
      <button class="mes_ab_btn mes_ab_nuevo" id="mes_nuevo"><i class="fas fa-plus"></i> Nuevo evento</button>
    </div>
    <div class="mes_ab_right">
      <div class="mes_prog_wrap">
        <span class="mes_prog_label" id="mes_prog_label">0 / 0</span>
        <div class="mes_prog_track"><div class="mes_prog_fill" id="mes_prog_fill" style="width:0%"></div></div>
        <span class="mes_prog_pct" id="mes_prog_pct">0%</span>
      </div>
    </div>
  </div>

  <!-- CUERPO -->
  <div class="mes_body">

    <!-- CALENDARIO -->
    <div class="mes_cal_panel">
      <div class="mes_dias_semana">
        ${DIAS_ES.map((d,i)=>`<div class="mes_dia_lbl${i===0||i===6?' mes_dia_lbl_fin':''}">${d}</div>`).join('')}
      </div>
      <div class="mes_grid" id="mes_grid"></div>
    </div>

    <!-- PANEL DETALLE -->
    <div class="mes_detail_panel" id="mes_detail_panel">
      <div class="mes_detail_head" id="mes_detail_head">
        <div class="mes_detail_fecha_ico"><i class="fas fa-calendar-day"></i></div>
        <div>
          <div class="mes_detail_titulo" id="mes_detail_titulo">Selecciona un día</div>
          <div class="mes_detail_sub" id="mes_detail_sub">Haz clic en cualquier día</div>
        </div>
        <button class="mes_detail_add" id="mes_detail_add" ${wiTip('Agregar evento')}><i class="fas fa-plus"></i></button>
      </div>
      <div class="mes_detail_body" id="mes_detail_body">
        <div class="mes_detail_empty"><i class="fas fa-calendar-xmark"></i><span>Sin eventos este día</span></div>
      </div>
    </div>

  </div>
</div>

<!-- MODAL EVENTO -->
<div class="wiModal" id="modal_mes">
  <div class="modalBody mes_modal">
    <button class="modalX"><i class="fas fa-times"></i></button>
    <div class="mes_modal_hero" id="mes_m_hero">
      <div class="mes_modal_ico" id="mes_m_ico"><i class="fas fa-calendar-plus"></i></div>
      <div>
        <h2 class="mes_modal_tit" id="mes_m_tit">Nuevo Evento</h2>
        <p class="mes_modal_sub" id="mes_m_sub">Agrega a tu mes</p>
      </div>
    </div>
    <div class="mes_modal_body">

      <div class="mes_field">
        <label class="mes_label"><i class="fas fa-heading"></i> Título <span class="mes_req">*</span></label>
        <div class="mes_input_ico"><i class="fas fa-pen"></i>
          <input type="text" class="mes_input" id="m_titulo" placeholder="Ej: Reunión de equipo" maxlength="80"/>
        </div>
      </div>

      <div class="mes_field">
        <label class="mes_label"><i class="fas fa-align-left"></i> Nota</label>
        <textarea class="mes_textarea" id="m_nota" placeholder="Detalles opcionales…" maxlength="300" rows="2"></textarea>
      </div>

      <!-- Fecha + Sugerencias dinámicas -->
      <div class="mes_field">
        <label class="mes_label"><i class="fas fa-calendar"></i> Fecha <span class="mes_req">*</span></label>
        <div class="mes_fecha_wrap">
          <input type="date" class="mes_input mes_input_plain" id="m_fecha"/>
          <div class="mes_sugerencias" id="mes_sugerencias"></div>
        </div>
      </div>

      <div class="mes_field_row mes_field_row3">
        <div class="mes_field">
          <label class="mes_label"><i class="fas fa-clock"></i> Hora</label>
          <input type="time" class="mes_input mes_input_plain" id="m_hora"/>
        </div>
        <div class="mes_field">
          <label class="mes_label"><i class="fas fa-tag"></i> Categoría</label>
          <select class="mes_select" id="m_cat">
            ${Object.entries(CATEGORIAS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
          </select>
        </div>
        <div class="mes_field">
          <label class="mes_label"><i class="fas fa-flag"></i> Prioridad</label>
          <select class="mes_select" id="m_prio">
            ${Object.entries(PRIORIDADES).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="mes_field">
        <label class="mes_label"><i class="fas fa-palette"></i> Color</label>
        <div class="mes_colores" id="m_colores">
          ${COLORES.map(c=>`<button type="button" class="mes_color_opt" data-color="${c}" style="--c:${c}"></button>`).join('')}
        </div>
      </div>

      <div class="mes_modal_footer">
        <button type="button" class="mes_btn_del dpn" id="m_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
        <div class="mes_modal_footer_r">
          <button type="button" class="mes_btn_cancel" id="m_cancelar">Cancelar</button>
          <button type="button" class="mes_btn_save" id="m_guardar"><i class="fas fa-floppy-disk"></i> Guardar</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- MODAL CONFIRMAR -->
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

/* ══════════════════════════════════════════════════════════
   RENDER GRID MES
══════════════════════════════════════════════════════════ */
const _renderGrid = () => {
  const $g = $('#mes_grid').empty();
  const primerDia = primerDiaMes(_año, _mes);
  const totalDias = diasEnMes(_año, _mes);
  const mesItems  = _mesItems();
  const todayStr  = hoy();

  $('#mes_titulo_mes').text(`${MESES_ES[_mes]} ${_año}`);

  const done = mesItems.filter(x=>x.done).length;
  const alta = mesItems.filter(x=>x.prioridad==='alta').length;
  const pct  = mesItems.length?Math.round(done/mesItems.length*100):0;
  $('#mes_n_total').text(mesItems.length);
  $('#mes_n_done').text(done);
  $('#mes_n_alta').text(alta);
  $('#mes_prog_label').text(`${done} / ${mesItems.length}`);
  $('#mes_prog_fill').css('width',`${pct}%`);
  $('#mes_prog_pct').text(`${pct}%`);

  for (let i=0; i<primerDia; i++) $g.append(`<div class="mes_cell mes_cell_vacio"></div>`);

  for (let d=1; d<=totalDias; d++) {
    const fStr  = fechaStr(_año,_mes,d);
    const items = _diaItems(fStr);
    const isHoy = fStr===todayStr;
    const isPast= fStr<todayStr;
    const isSel = fStr===_selFecha;
    const dow   = new Date(fStr+'T00:00:00').getDay();
    const isFin = dow===0||dow===6;

    const dots = items.slice(0,3).map(item=>{
      const color=item.color||(CATEGORIAS[item.categoria]||CATEGORIAS.otro).color;
      return `<span class="mes_dot" style="background:${color}" title="${item.titulo}"></span>`;
    }).join('');
    const mas = items.length>3?`<span class="mes_dot_mas">+${items.length-3}</span>`:'';

    $g.append(`
    <div class="mes_cell${isHoy?' mes_cell_hoy':''}${isPast?' mes_cell_past':''}${isSel?' mes_cell_sel':''}${isFin?' mes_cell_fin':''}" data-fecha="${fStr}">
      <div class="mes_cell_num${isHoy?' mes_cell_num_hoy':''}">${d}</div>
      ${items.length?`<div class="mes_cell_dots">${dots}${mas}</div>`:''}
    </div>`);
  }

  const totalCeldas = primerDia+totalDias;
  const resto = totalCeldas%7===0?0:7-(totalCeldas%7);
  for (let i=0; i<resto; i++) $g.append(`<div class="mes_cell mes_cell_vacio"></div>`);

  if (_selFecha) _renderDetail(_selFecha);
};

/* ══════════════════════════════════════════════════════════
   RENDER DETALLE DÍA
══════════════════════════════════════════════════════════ */
const _renderDetail = fecha => {
  _selFecha = fecha;
  const items  = _diaItems(fecha).sort((a,b)=>(a.hora||'99:99').localeCompare(b.hora||'99:99'));
  const isHoy  = esHoy(fecha);
  const isPast = esPasado(fecha);
  const d      = new Date(fecha+'T00:00:00');

  const nombreDia   = d.toLocaleDateString('es-PE',{weekday:'long'});
  const nombreFecha = d.toLocaleDateString('es-PE',{day:'numeric',month:'long',year:'numeric'});
  $('#mes_detail_titulo').text(`${nombreDia.charAt(0).toUpperCase()+nombreDia.slice(1)}${isHoy?' · Hoy':''}`);
  $('#mes_detail_sub').text(nombreFecha);
  $('#mes_detail_head').css('--dh_color', isHoy?'var(--mco)':isPast?'#94A3B8':'var(--brd)');
  $('#mes_detail_add').attr('data-fecha', fecha);

  const $body = $('#mes_detail_body').empty();
  if (!items.length) {
    $body.html(`<div class="mes_detail_empty"><i class="fas fa-calendar-xmark"></i><span>${isPast?'Sin eventos registrados':'Día libre — agrega un evento'}</span></div>`);
    return;
  }

  items.forEach(item => {
    const cat   = CATEGORIAS[item.categoria]||CATEGORIAS.otro;
    const prio  = PRIORIDADES[item.prioridad]||PRIORIDADES.media;
    const color = item.color||cat.color;

    $body.append(`
    <div class="mes_ev_item${item.done?' mes_ev_done':''}" data-id="${item._fsId}" style="--ev_c:${color}">
      <div class="mes_ev_left">
        <button class="mes_ev_check${item.done?' mes_ev_checked':''}" data-id="${item._fsId}">
          <i class="fas ${item.done?'fa-circle-check':'fa-circle-dot'}"></i>
        </button>
      </div>
      <div class="mes_ev_body">
        <div class="mes_ev_titulo">${item.titulo}</div>
        <div class="mes_ev_meta">
          ${item.hora?`<span class="mes_ev_hora"><i class="fas fa-clock"></i>${item.hora}</span>`:''}
          <span class="mes_ev_cat" style="--cc:${cat.color}"><i class="fas ${cat.icon}"></i>${cat.label}</span>
          <span class="mes_ev_prio" style="--pc:${prio.color}"><i class="fas ${prio.icon}"></i></span>
        </div>
        ${item.nota?`<p class="mes_ev_nota">${item.nota}</p>`:''}
      </div>
      <div class="mes_ev_actions">
        <button class="mes_ev_edit" data-id="${item._fsId}" ${wiTip('Editar')}><i class="fas fa-pen"></i></button>
        <button class="mes_ev_del"  data-id="${item._fsId}" ${wiTip('Eliminar')}><i class="fas fa-times"></i></button>
      </div>
    </div>`);
  });
};

/* ══════════════════════════════════════════════════════════
   MODAL HELPERS
══════════════════════════════════════════════════════════ */
const _selColor  = c => { $('#m_colores .mes_color_opt').removeClass('active'); $(`#m_colores .mes_color_opt[data-color="${c}"]`).addClass('active'); };
const _getColor  = () => $('#m_colores .mes_color_opt.active').data('color')||COLORES[0];
const _heroColor = (color, icon) => {
  $('#mes_m_hero').css('background',`linear-gradient(135deg,${color}dd,${color}88)`);
  $('#mes_m_ico').css('background',color).html(`<i class="fas ${icon}"></i>`);
};

/* ── Actualizar pills cuando cambia el input fecha ── */
const _syncSugerencias = () => {
  const base  = _selFecha || hoy();         // base = día seleccionado en calendario
  const actual = $('#m_fecha').val() || base;
  _renderSugerencias(base, actual);
};

const _openModal = (d={}, fechaPresel=null) => {
  _edit = d._fsId ? d : null;

  /* Fecha base: fecha del evento, o día seleccionado, o hoy */
  const fechaBase = d.fecha || fechaPresel || _selFecha || hoy();

  const cat   = d.categoria||'trabajo';
  const color = d.color||CATEGORIAS[cat]?.color||COLORES[0];

  $('#m_titulo').val(d.titulo||'');
  $('#m_nota').val(d.nota||'');
  $('#m_fecha').val(fechaBase);
  $('#m_hora').val(d.hora||'');
  $('#m_cat').val(cat);
  $('#m_prio').val(d.prioridad||'media');
  _selColor(color);
  _heroColor(color, CATEGORIAS[cat]?.icon||'fa-calendar-plus');
  $('#mes_m_tit').text(_edit?'Editar Evento':'Nuevo Evento');
  $('#mes_m_sub').text(_edit?'Modifica los datos':`Para: ${fmtCorto(fechaBase)}`);
  $('#m_eliminar').toggleClass('dpn',!_edit);

  /* Renderizar pills con base = fechaBase */
  _renderSugerencias(fechaBase, fechaBase);

  abrirModal('modal_mes');
  setTimeout(()=>$('#m_titulo').focus(),30);
};

const _guardar = () => {
  const titulo = $('#m_titulo').val().trim();
  if (!titulo) return Notificacion('Título requerido','warning');
  const fecha  = $('#m_fecha').val();
  if (!fecha)  return Notificacion('Fecha requerida','warning');
  wiSpin('#m_guardar',true,'Guardar');
  const cat = $('#m_cat').val();
  _upsert({
    ...(_edit||{}),
    titulo,
    nota:      $('#m_nota').val().trim(),
    fecha,
    hora:      $('#m_hora').val()||'',
    categoria: cat,
    prioridad: $('#m_prio').val(),
    color:     _getColor(),
    done:      _edit?.done||false,
    creado:    _edit?.creado||new Date().toISOString(),
  });
  cerrarModal('modal_mes');

  /* Navegar al mes del evento si cambió */
  const [fy,fm] = fecha.split('-').map(Number);
  if (fy!==_año||fm-1!==_mes) { _año=fy; _mes=fm-1; }
  _selFecha = fecha;
  _renderGrid();
  setTimeout(()=>$(`.mes_cell[data-fecha="${fecha}"]`).addClass('mes_cell_sel'),30);

  wiSpin('#m_guardar',false,'Guardar');
  Notificacion(_edit?'Evento actualizado ✓':'Evento creado ✓','success');
};

const _toggleDone = id => {
  const item = getAll().find(x=>x._fsId===id); if (!item) return;
  _upsert({...item, done:!item.done});
  _renderGrid();
  if (!item.done) Notificacion('✅ ¡Evento completado!','success');
};

const _openConfirm = item => {
  $('#mes_confirm_nombre').text(item.titulo||'Sin título');
  _confirmCb = () => {
    _delete(item);
    cerrarModal('modal_mes_confirm');
    _renderGrid();
    Notificacion('Evento eliminado ✓','success');
  };
  abrirModal('modal_mes_confirm');
};

/* ══════════════════════════════════════════════════════════
   BIND
══════════════════════════════════════════════════════════ */
const _bind = () => {
  $(document).off('.mes');
  const $d = $(document);

  $d
    /* nav mes */
    .on('click.mes','#mes_prev', ()=>{ if(_mes===0){_mes=11;_año--;}else _mes--; _renderGrid(); })
    .on('click.mes','#mes_next', ()=>{ if(_mes===11){_mes=0;_año++;}else _mes++; _renderGrid(); })
    .on('click.mes','#mes_hoy',  ()=>{ _año=new Date().getFullYear(); _mes=new Date().getMonth(); _selFecha=hoy(); _renderGrid(); })

    .on('click.mes','#mes_refresh', async ()=>{
      wiSpin('#mes_refresh',true,'');
      localStorage.removeItem(CACHE);
      await _cargar(true);
      _renderGrid();
      wiSpin('#mes_refresh',false,'');
      Notificacion('Mes actualizado ✓','success');
    })

    /* ── click día en calendario ── */
    .on('click.mes','.mes_cell:not(.mes_cell_vacio)', function(){
      $('.mes_cell').removeClass('mes_cell_sel');
      $(this).addClass('mes_cell_sel');
      _renderDetail($(this).data('fecha'));
    })

    /* nuevo global → usa _selFecha (día activo en calendario) */
    .on('click.mes','#mes_nuevo', ()=>_openModal({}, _selFecha||hoy()))

    /* nuevo desde panel detalle → usa fecha del botón */
    .on('click.mes','#mes_detail_add', function(){ _openModal({}, $(this).data('fecha')||_selFecha||hoy()); })

    /* toggle done */
    .on('click.mes','.mes_ev_check', function(e){ e.stopPropagation(); _toggleDone($(this).data('id')); })

    /* click card → edit */
    .on('click.mes','.mes_ev_item', function(e){
      if ($(e.target).closest('.mes_ev_check,.mes_ev_edit,.mes_ev_del').length) return;
      const item = getAll().find(x=>x._fsId===$(this).data('id'));
      if (item) _openModal(item);
    })
    .on('click.mes','.mes_ev_edit', function(e){
      e.stopPropagation();
      const item = getAll().find(x=>x._fsId===$(this).data('id'));
      if (item) _openModal(item);
    })
    .on('click.mes','.mes_ev_del', function(e){
      e.stopPropagation();
      const item = getAll().find(x=>x._fsId===$(this).data('id'));
      if (item) _openConfirm(item);
    })

    /* ── Sugerencias → ponen fecha en input y marcan pill ── */
    .on('click.mes','.mes_sug_btn', function(){
      const f = $(this).data('fecha');
      $('#m_fecha').val(f);
      /* actualizar pills con la base que ya estaba */
      const base = _selFecha || hoy();
      _renderSugerencias(base, f);
      /* actualizar sub del hero */
      $('#mes_m_sub').text(`Para: ${fmtCorto(f)}`);
    })

    /* ── Input fecha manual → resync pills ── */
    .on('change.mes','#m_fecha', _syncSugerencias)

    /* modal helpers */
    .on('change.mes','#m_cat', function(){
      _heroColor(_getColor(), CATEGORIAS[$(this).val()]?.icon||'fa-calendar-plus');
    })
    .on('click.mes','#m_colores .mes_color_opt', function(){
      _selColor($(this).data('color'));
      _heroColor($(this).data('color'), CATEGORIAS[$('#m_cat').val()]?.icon||'fa-calendar-plus');
    })
    .on('click.mes','#m_cancelar',  ()=>cerrarModal('modal_mes'))
    .on('click.mes','#m_guardar',   _guardar)
    .on('keydown.mes','#m_titulo',  e=>{ if(e.key==='Enter') _guardar(); })
    .on('click.mes','#m_eliminar',  ()=>{ if(_edit){ cerrarModal('modal_mes'); _openConfirm(_edit); } })
    /* confirm */
    .on('click.mes','#mes_conf_no', ()=>cerrarModal('modal_mes_confirm'))
    .on('click.mes','#mes_conf_si', ()=>_confirmCb?.());
};

/* ══════════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════════ */
export const init = async () => {
  _año = new Date().getFullYear();
  _mes = new Date().getMonth();
  await _cargar();
  _renderGrid();
  _selFecha = hoy();
  _renderDetail(hoy());
  setTimeout(()=>$(`.mes_cell[data-fecha="${hoy()}"]`).addClass('mes_cell_sel'),50);
  _bind();
  console.log('📆 Mes v1.0 OK');
};

export const cleanup = () => {
  $(document).off('.mes');
  console.log('🧹 Mes limpiado');
};