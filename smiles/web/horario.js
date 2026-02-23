import './horario.css';
import $ from 'jquery';
import Sortable from 'sortablejs';
import { Calendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { db } from '../smile/firebase.js';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Notificacion, abrirModal, cerrarModal, getls, savels, wiTip, wiAuth} from '../widev.js';

const CACHE_KEY='wii_horario_v4', NOTA_KEY='wii_horario_notas_v3', TAR_CACHE='wii_tareas_v1', COL='horario', TAR_COL='tareas';

const TIPOS = {
  trabajo:  { label:'Trabajo',  icon:'fa-briefcase', color:'#0EBEFF' },
  personal: { label:'Personal', icon:'fa-user',      color:'#29C72E' },
  estudio:  { label:'Estudio',  icon:'fa-book',      color:'#7000FF' },
  urgente:  { label:'Urgente',  icon:'fa-fire',      color:'#FF5C69' },
  reunion:  { label:'Reunión',  icon:'fa-users',     color:'#FFB800' },
  sueno:    { label:'Sueño',    icon:'fa-moon',      color:'#3D4C7E' },
  otro:     { label:'Otro',     icon:'fa-circle',    color:'#94A3B8' },
};
const TIPOS_TAREA = {
  trabajo:  { label:'Trabajo',  icon:'fa-briefcase', color:'#29C72E' },
  estudio:  { label:'Estudio',  icon:'fa-book',      color:'#7000FF' },
  web:      { label:'Web',      icon:'fa-globe',     color:'#0EBEFF' },
  personal: { label:'Personal', icon:'fa-user',      color:'#FFB800' },
  otros:    { label:'Otros',    icon:'fa-circle',    color:'#94A3B8' },
};
const ESTADOS  = { pendiente:'Pendiente', progreso:'En progreso', revision:'Revisión', hecho:'Hecho' };
const EST_ICO  = { pendiente:'fa-circle-dot', progreso:'fa-spinner', revision:'fa-eye', hecho:'fa-circle-check' };
const EST_CLR  = { pendiente:'#FFB800', progreso:'#0EBEFF', revision:'#7000FF', hecho:'#29C72E' };
const EST_NEXT = { pendiente:'progreso', progreso:'revision', revision:'hecho', hecho:'hecho' };
const EST_PREV = { pendiente:'pendiente', progreso:'pendiente', revision:'progreso', hecho:'revision' };
const REPETIR  = {
  solo_hoy: { label:'Solo hoy',         dias:[0,1,2,3,4,5,6] },
  lun_vie:  { label:'Lunes a Viernes',  dias:[1,2,3,4,5]     },
  lun_sab:  { label:'Lunes a Sábado',   dias:[1,2,3,4,5,6]   },
  todos:    { label:'Todos los días',    dias:[0,1,2,3,4,5,6] },
  rango:    { label:'Fecha específica',  dias:[0,1,2,3,4,5,6] },
};
const COLORES    = ['#0EBEFF','#29C72E','#7000FF','#FF5C69','#FFB800'];
const PRIO_COLOR = { alta:'#FF5C69', media:'#FFB800', baja:'#29C72E' };
const ACCIONES   = [
  { icon:'fa-rotate',       color:'#0EBEFF', label:'Rutina',     fn:()=>_openModalRapido('rutina')  },
  { icon:'fa-moon',         color:'#3D4C7E', label:'Sueño',      fn:()=>_openModalSueno()           },
  { icon:'fa-briefcase',    color:'#29C72E', label:'Trabajo',    fn:()=>_openModalRapido('trabajo') },
  { icon:'fa-chart-pie',    color:'#FFB800', label:'Resumen',    fn:()=>_abrirResumenModal()        },
  { icon:'fa-list-check',   color:'#7000FF', label:'Tarea',      fn:()=>$('#hor_add_tarea').trigger('click') },
  { icon:'fa-crosshairs',   color:'#FF5C69', label:'Hoy',        fn:()=>{ _cal?.today(); _diaActivo=hoy(); _renderBlock(_diaActivo); } },
  { icon:'fa-rotate-right', color:'#94A3B8', label:'Actualizar', fn:async()=>{ clearCache(); await _cargarEvs(true); _cal?.refetchEvents(); _actualizarResumen(); Notificacion('Actualizado ✓','success'); } },
];
const RAPIDOS = {
  rutina:  { titulo:'Mi rutina', tipo:'personal', color:'#0EBEFF', horaInicio:'07:00', horaFin:'09:00', icon:'fa-rotate',    heroColor:'#0EBEFF', tituloModal:'Registrar Rutina',  subModal:'Rutina diaria', repetir:'todos'   },
  trabajo: { titulo:'Trabajo',   tipo:'trabajo',  color:'#29C72E', horaInicio:'08:40', horaFin:'18:00', icon:'fa-briefcase', heroColor:'#29C72E', tituloModal:'Registrar Trabajo', subModal:'Lun–Vie',       repetir:'lun_vie' },
};

const hoy           = () => new Date().toISOString().split('T')[0];
const ahora         = () => { const d=new Date(); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; };
const esPasado      = f => f < hoy();
const esHoyF        = f => f === hoy();
const fmtH          = h => (typeof h==='string'&&h.includes(':'))?h:'00:00';
const toMins        = t => { if(!t||!t.includes(':')) return 0; const [h,m]=t.split(':').map(Number); return (h||0)*60+(m||0); };
const minsHH        = (hi,hf) => { let d=toMins(hf)-toMins(hi); if(d<=0) d+=1440; return Math.max(0,d); };
const fmtMin        = m => m<=0?'0m':m<60?`${m}m`:(m%60?`${Math.floor(m/60)}h ${m%60}m`:`${Math.floor(m/60)}h`);
const addDays       = (f,n) => { const d=new Date(f+'T12:00:00'); d.setDate(d.getDate()+n); return d.toISOString().split('T')[0]; };
const fmtFecha      = f => new Date(f+'T00:00:00').toLocaleDateString('es-PE',{weekday:'long',day:'numeric',month:'long'});
const fmtFechaCorta = f => new Date(f+'T00:00:00').toLocaleDateString('es-PE',{weekday:'short',day:'numeric',month:'short'});
const defFechaTarea = () => addDays(hoy(),7);
const fmtFTarea     = f => f?new Date(f+'T00:00:00').toLocaleDateString('es-PE',{day:'numeric',month:'short'}):'';
const fsId          = tit => { const s=(tit||'ev').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'').slice(0,25); return `${s}_${Date.now()}`; };
const diasR         = f => { if(!f) return ''; const d=Math.ceil((new Date(f+'T00:00:00')-new Date(hoy()+'T00:00:00'))/864e5); return d<0?`<span class="hor_vencido">V${-d}d</span>`:d===0?'<span class="hor_hoy_tag">Hoy</span>':`${d}d`; };

const getUser    = () => getls('wiSmile')||null;
const isLogged   = () => !!getUser()?.usuario;
const getCache   = () => getls(CACHE_KEY)||[];
const setCache   = list => savels(CACHE_KEY,list,48);
const clearCache = () => localStorage.removeItem(CACHE_KEY);
const getEvs     = () => getCache();
const getTareas  = () => getls(TAR_CACHE)||[];
const setTareas  = l => savels(TAR_CACHE,l,48);

const evToFs = ev => { const u=getUser()||{}; return { titulo:ev.titulo, horaInicio:ev.horaInicio, horaFin:ev.horaFin, tipo:ev.tipo, color:ev.color, subtareas:ev.subtareas||[], completado:ev.completado||false, sueno:ev.sueno||false, suenoHoras:ev.suenoHoras||0, repetir:ev.repetir||'solo_hoy', fecha:ev.fecha||hoy(), fechaInicio:ev.fechaInicio||ev.fecha||hoy(), fechaFin:ev.fechaFin||ev.fecha||hoy(), usuario:u.usuario||'', email:u.email||'', actualizado:serverTimestamp() }; };
const fsToEv = (id,d) => ({ id, _fsId:id, titulo:d.titulo||'Sin título', fecha:d.fecha||d.fechaInicio||hoy(), fechaInicio:d.fechaInicio||d.fecha||hoy(), fechaFin:d.fechaFin||d.fechaInicio||d.fecha||hoy(), horaInicio:d.horaInicio||'09:00', horaFin:d.horaFin||'10:00', tipo:d.tipo||'trabajo', color:d.color||'#0EBEFF', repetir:d.repetir||'solo_hoy', subtareas:d.subtareas||[], completado:d.completado||false, sueno:d.sueno||false, suenoHoras:d.suenoHoras||0, usuario:d.usuario||'', email:d.email||'' });

const SYNC_MAP = { loading:'<i class="fas fa-spinner fa-spin"></i> Cargando…', ok:'<i class="fas fa-circle-check"></i> Sincronizado', error:'<i class="fas fa-circle-xmark"></i> Sin conexión', saving:'<i class="fas fa-spinner fa-spin"></i> Guardando…' };
const _setSyncStatus = s => { const $d=$('#hor_sync_dot'),$t=$('#hor_sync_txt'); if(!$d.length) return; $d[0].className=`hor_sync_dot hor_sync_${s}`; $t.html(SYNC_MAP[s]||''); };

const _cargarEvs = async (force=false) => {
  if (!force&&getCache().length) { _setSyncStatus('ok'); return; }
  if (!isLogged()) { _setSyncStatus('error'); return; }
  _setSyncStatus('loading');
  try { const snap=await getDocs(query(collection(db,COL),where('usuario','==',getUser().usuario))); setCache(snap.docs.map(d=>fsToEv(d.id,d.data()))); _setSyncStatus('ok'); }
  catch(e) { console.error('❌ cargarEvs:',e); _setSyncStatus('error'); }
};

const upsertEv = async ev => {
  _setSyncStatus('saving');
  const list=getEvs(), id=ev._fsId||fsId(ev.titulo), full={...ev,_fsId:id,id};
  const idx=list.findIndex(x=>x._fsId===id);
  idx>=0?list.splice(idx,1,full):list.push(full);
  setCache(list);
  if (isLogged()) { try { await setDoc(doc(db,COL,id),evToFs(full),{merge:true}); } catch(e) { console.error('❌ upsert:',e); } }
  _setSyncStatus('ok'); return full;
};

const deleteEv = async ev => {
  _setSyncStatus('saving');
  const id=ev._fsId||ev.id;
  setCache(getEvs().filter(x=>x._fsId!==id&&x._parentId!==id));
  if (isLogged()) { try { await deleteDoc(doc(db,COL,id)); } catch(e) { console.error('❌ delete:',e); } }
  _setSyncStatus('ok');
};

const _upsertTarea = t => {
  const list=getTareas(), id=t._fsId||fsId(t.titulo), full={...t,_fsId:id,id};
  const idx=list.findIndex(x=>x._fsId===id);
  idx>=0?list.splice(idx,1,full):list.push(full);
  setTareas(list);
  if (isLogged()) { const u=getUser()||{}; const o={...full}; delete o._fsId; setDoc(doc(db,TAR_COL,id),{...o,usuario:u.usuario||'',email:u.email||'',actualizado:serverTimestamp()},{merge:true}).catch(e=>console.error('❌ tarea:',e)); }
  return full;
};

const _deleteTarea = t => {
  const id=t._fsId||t.id;
  setTareas(getTareas().filter(x=>x._fsId!==id));
  if (isLogged()) deleteDoc(doc(db,TAR_COL,id)).catch(e=>console.error('❌ tarea del:',e));
};

const _moverTareaEstado = (id, dir) => {
  const t=getTareas().find(x=>x._fsId===id); if(!t) return;
  const nuevo=dir==='next'?EST_NEXT[t.estado||'pendiente']:EST_PREV[t.estado||'pendiente'];
  if (nuevo===t.estado) return;
  const hist=t.historial||[];
  hist.push({de:t.estado,a:nuevo,fecha:new Date().toISOString()});
  _upsertTarea({...t,estado:nuevo,historial:hist,completado:nuevo==='hecho'?new Date().toISOString():''});
  _renderTareas(false);
  Notificacion(`${{pendiente:'⏳',progreso:'🔄',revision:'👀',hecho:'✅'}[nuevo]} ${t.titulo} → ${ESTADOS[nuevo]}`,'success');
};

const _expandRange = (ev, start, end) => {
  const modo=ev.repetir||'solo_hoy', res=[];
  if (modo==='solo_hoy') { const f=ev.fecha||ev.fechaInicio||hoy(); if(f>=start&&f<=end) res.push({...ev,fecha:f,_parentId:ev._fsId||ev.id}); return res; }
  const desde=modo==='rango'?(ev.fechaInicio||ev.fecha||hoy()):start;
  const hasta=modo==='rango'?(ev.fechaFin||ev.fechaInicio||ev.fecha||hoy()):end;
  const dias=REPETIR[modo]?.dias||[0,1,2,3,4,5,6];
  let cur=new Date(Math.max(new Date(desde+'T00:00:00'),new Date(start+'T00:00:00')));
  const fin=new Date(Math.min(new Date(hasta+'T23:59:59'),new Date(end+'T23:59:59')));
  while (cur<=fin) { const f=cur.toISOString().split('T')[0]; if(dias.includes(cur.getDay())) res.push({...ev,fecha:f,id:`${ev._fsId||ev.id}_${f}`,_parentId:ev._fsId||ev.id}); cur.setDate(cur.getDate()+1); }
  return res;
};

const evToFC = ev => { const pasado=esPasado(ev.fecha); return { id:ev.id, title:ev.sueno?`😴 ${ev.titulo}`:ev.titulo, start:`${ev.fecha}T${fmtH(ev.horaInicio)}`, end:`${ev.fecha}T${fmtH(ev.horaFin)}`, backgroundColor:pasado?'#94A3B8':ev.color, borderColor:pasado?'#94A3B8':ev.color, textColor:'#fff', classNames:[...(ev.sueno?['ev_sueno']:[]),...(ev.completado?['ev_done']:[]),...(pasado?['ev_pasado']:[])], extendedProps:{tipo:ev.tipo,completado:ev.completado,sueno:ev.sueno||false,_parentId:ev._parentId,_fsId:ev._fsId||ev.id,pasado} }; };

export const render = () => `
<div class="hor_wrap">
  <div class="hor_toolbar">
    <div class="hor_tb_left"><div class="hor_logo"><i class="fas fa-calendar-week"></i><span>Mi Horario</span></div></div>
    <div class="hor_tb_right">
      <div class="hor_resumen" id="hor_resumen">
        <div class="hor_res_item" ${wiTip('Eventos')}><i class="fas fa-calendar-check"></i><strong id="res_total_n">0</strong><span>Eventos</span></div>
        <div class="hor_res_sep"></div>
        <div class="hor_res_item" ${wiTip('Horas')}><i class="fas fa-clock"></i><strong id="res_horas_n">0m</strong><span>Horas</span></div>
        <div class="hor_res_sep"></div>
        <div class="hor_res_item" ${wiTip('Completado')}><i class="fas fa-circle-check"></i><strong id="res_comp_n">0%</strong><span>Hecho</span></div>
        <div class="hor_res_sep"></div>
        <div class="hor_res_item" ${wiTip('Tareas')}><i class="fas fa-list-check"></i><strong id="res_tareas_n">0</strong><span>Tareas</span></div>
        <div class="hor_res_sep"></div>
        <div class="hor_res_item" ${wiTip('Sueño')}><i class="fas fa-moon"></i><strong id="res_sueno_n">—</strong><span>Sueño</span></div>
      </div>
      <button class="hor_btn_nuevo" id="hor_nuevo_ev"><i class="fas fa-plus"></i> Nuevo</button>
    </div>
  </div>

  <div class="hor_body">
    <div class="hor_col_left">
      <div class="hor_cal_panel">
        <div class="hor_cal_sync" id="hor_cal_sync">
          <div class="hor_sync_left">
            <span class="hor_sync_dot hor_sync_loading" id="hor_sync_dot"></span>
            <span id="hor_sync_txt"><i class="fas fa-spinner fa-spin"></i> Cargando…</span>
          </div>
          <div class="hor_sync_right">
            <span class="hor_semana_txt" id="hor_semana_txt"></span>
            <div class="hor_nav">
              <button class="hor_nav_btn" id="hor_prev" ${wiTip('Anterior')}><i class="fas fa-chevron-left"></i></button>
              <button class="hor_nav_btn hor_nav_hoy" id="hor_hoy"><i class="fas fa-crosshairs"></i> Hoy</button>
              <button class="hor_nav_btn" id="hor_next" ${wiTip('Siguiente')}><i class="fas fa-chevron-right"></i></button>
            </div>
          </div>
        </div>
        <div id="hor_calendar"></div>
      </div>
    </div>

    <div class="hor_col_right">
      <div class="hor_block">
        <div class="hor_block_head">
          <div class="hor_block_fecha">
            <div class="hor_block_fecha_ico"><i class="fas fa-calendar-day"></i></div>
            <div><span id="hor_dia_nombre">Hoy</span><small id="hor_dia_fecha"></small></div>
          </div>
          <div id="hor_dia_pasado_badge" class="hor_pasado_badge dpn"><i class="fas fa-clock-rotate-left"></i> Pasado</div>
        </div>
        <div class="hor_sec hor_sec_acciones">
          <div class="hor_sec_lbl"><i class="fas fa-bolt"></i> Acciones rápidas</div>
          <div class="hor_acciones_grid" id="hor_acciones_grid">
            ${ACCIONES.map((a,i)=>`<button class="hor_accion_btn" data-idx="${i}" style="--ac:${a.color}" ${wiTip(a.label)}><i class="fas ${a.icon}"></i><span>${a.label}</span></button>`).join('')}
          </div>
        </div>
        <div class="hor_sec hor_sec_tareas">
          <div class="hor_sec_row">
            <div class="hor_sec_lbl"><i class="fas fa-list-check"></i> Tareas <span class="hor_badge" id="hor_tareas_count"></span></div>
            <button class="hor_add_btn" id="hor_add_tarea"><i class="fas fa-plus"></i> Agregar</button>
          </div>
          <div class="hor_tarea_new dpn" id="hor_tarea_new">
            <div class="hor_input_ico"><i class="fas fa-pen"></i>
              <input type="text" class="hor_input" id="hor_tarea_input" placeholder="Nueva tarea… (Enter para guardar)" maxlength="120"/>
            </div>
            <div class="hor_tarea_opts">
              <select class="hor_select" id="hor_tarea_tipo">
                ${Object.entries(TIPOS_TAREA).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
              </select>
              <input type="date" class="hor_input hor_input_plain" id="hor_tarea_fecha" style="flex:1"/>
              <button class="hor_ok_btn" id="hor_tarea_ok"><i class="fas fa-check"></i></button>
              <button class="hor_cancel_btn" id="hor_tarea_cancel"><i class="fas fa-times"></i></button>
            </div>
          </div>
          <div id="hor_tareas_list"></div>
          <div class="hor_prog">
            <div class="hor_prog_row"><span class="hor_prog_pct" id="hor_prog_pct">0%</span></div>
            <div class="hor_prog_bar_wrap"><div class="hor_prog_bar" id="hor_prog_bar" style="width:0%"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_evento">
  <div class="modalBody hor_modal">
    <button class="modalX"><i class="fas fa-times"></i></button>
    <div class="hor_modal_hero" id="modal_ev_hero">
      <div class="hor_modal_hero_ico" id="modal_ev_ico"><i class="fas fa-calendar-plus"></i></div>
      <div><h2 class="hor_modal_tit" id="modal_ev_tit">Nuevo Evento</h2><p class="hor_modal_sub" id="modal_ev_sub">Completa los datos</p></div>
    </div>
    <div class="hor_modal_body">
      <div class="hor_field">
        <label class="hor_label"><i class="fas fa-heading"></i> Título <span class="hor_req">*</span></label>
        <div class="hor_input_ico"><i class="fas fa-pen"></i><input type="text" class="hor_input" id="ev_titulo" placeholder="Ej: Reunión de equipo" maxlength="80"/></div>
      </div>
      <div class="hor_field_row hor_field_row3">
        <div class="hor_field"><label class="hor_label"><i class="fas fa-calendar-day"></i> Fecha</label><input type="date" class="hor_input hor_input_plain" id="ev_fecha"/></div>
        <div class="hor_field"><label class="hor_label"><i class="fas fa-play"></i> Inicio</label><input type="time" class="hor_input hor_input_plain" id="ev_inicio"/></div>
        <div class="hor_field"><label class="hor_label"><i class="fas fa-stop"></i> Fin</label><input type="time" class="hor_input hor_input_plain" id="ev_fin"/></div>
      </div>
      <div class="hor_dur_preview"><i class="fas fa-hourglass-half"></i><span id="ev_dur_txt">—</span></div>
      <div class="hor_field_row hor_field_row2 dpn" id="ev_rango_wrap">
        <div class="hor_field"><label class="hor_label"><i class="fas fa-calendar-plus"></i> Desde</label><input type="date" class="hor_input hor_input_plain" id="ev_fecha_desde"/></div>
        <div class="hor_field"><label class="hor_label"><i class="fas fa-calendar-minus"></i> Hasta</label><input type="date" class="hor_input hor_input_plain" id="ev_fecha_hasta"/></div>
      </div>
      <div class="hor_field_row hor_field_row3">
        <div class="hor_field"><label class="hor_label"><i class="fas fa-tag"></i> Tipo</label>
          <select class="hor_select" id="ev_tipo">${Object.entries(TIPOS).filter(([k])=>k!=='sueno').map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select>
        </div>
        <div class="hor_field"><label class="hor_label"><i class="fas fa-repeat"></i> Repetir</label>
          <select class="hor_select" id="ev_repetir">${Object.entries(REPETIR).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select>
        </div>
        <div class="hor_field"><label class="hor_label"><i class="fas fa-palette"></i> Color</label>
          <div class="hor_colores" id="ev_colores">${COLORES.map(c=>`<button type="button" class="hor_color_opt" data-color="${c}" style="--c:${c}"></button>`).join('')}</div>
        </div>
      </div>
      <div class="hor_field">
        <label class="hor_label"><i class="fas fa-tasks"></i> Subtareas <span class="hor_label_hint">opcional</span></label>
        <div class="hor_subtareas_list" id="ev_subtareas_list"></div>
        <button type="button" class="hor_btn_add_sub" id="ev_add_subtarea"><i class="fas fa-plus"></i> Añadir subtarea</button>
      </div>
      <div class="hor_modal_footer">
        <button type="button" class="hor_btn_del dpn" id="ev_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
        <div class="hor_modal_footer_r">
          <button type="button" class="hor_btn_cancel" id="ev_cancelar">Cancelar</button>
          <button type="button" class="hor_btn_save" id="ev_guardar"><i class="fas fa-floppy-disk"></i> Guardar</button>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_rapido">
  <div class="modalBody hor_modal hor_modal_rapido">
    <button class="modalX"><i class="fas fa-times"></i></button>
    <div class="hor_modal_hero" id="rap_hero">
      <div class="hor_modal_hero_ico" id="rap_ico"><i class="fas fa-rotate"></i></div>
      <div><h2 class="hor_modal_tit" id="rap_tit">Registrar Rutina</h2><p class="hor_modal_sub" id="rap_sub">Rutina diaria</p></div>
    </div>
    <div class="hor_modal_body">
      <div class="hor_field"><label class="hor_label"><i class="fas fa-heading"></i> Título</label>
        <div class="hor_input_ico"><i class="fas fa-pen"></i><input type="text" class="hor_input" id="rap_titulo" placeholder="Nombre…" maxlength="80"/></div>
      </div>
      <div class="hor_field_row hor_field_row2">
        <div class="hor_field"><label class="hor_label"><i class="fas fa-play"></i> Inicio</label><input type="time" class="hor_input hor_input_plain" id="rap_ini"/></div>
        <div class="hor_field"><label class="hor_label"><i class="fas fa-stop"></i> Fin</label><input type="time" class="hor_input hor_input_plain" id="rap_fin"/></div>
      </div>
      <div class="hor_dur_preview"><i class="fas fa-hourglass-half"></i><span id="rap_dur_txt">—</span></div>
      <div class="hor_field"><label class="hor_label"><i class="fas fa-repeat"></i> Programar</label>
        <select class="hor_select" id="rap_repetir"><option value="solo_hoy">Solo hoy</option><option value="lun_vie">Lun a Vie</option><option value="lun_sab">Lun a Sáb</option><option value="todos">Todos</option><option value="rango">Rango</option></select>
      </div>
      <div class="hor_field" id="rap_campo_fecha"><label class="hor_label"><i class="fas fa-calendar-day"></i> Fecha</label><input type="date" class="hor_input hor_input_plain" id="rap_fecha"/></div>
      <div class="hor_field_row hor_field_row2 dpn" id="rap_campo_rango">
        <div class="hor_field"><label class="hor_label"><i class="fas fa-calendar-plus"></i> Desde</label><input type="date" class="hor_input hor_input_plain" id="rap_desde"/></div>
        <div class="hor_field"><label class="hor_label"><i class="fas fa-calendar-minus"></i> Hasta</label><input type="date" class="hor_input hor_input_plain" id="rap_hasta"/></div>
      </div>
      <div class="hor_field"><label class="hor_label"><i class="fas fa-palette"></i> Color</label>
        <div class="hor_colores" id="rap_colores">${COLORES.map(c=>`<button type="button" class="hor_color_opt hor_color_rap" data-color="${c}" style="--c:${c}"></button>`).join('')}</div>
      </div>
      <div class="hor_modal_footer"><div></div>
        <div class="hor_modal_footer_r">
          <button type="button" class="hor_btn_cancel" id="rap_cancelar">Cancelar</button>
          <button type="button" class="hor_btn_save" id="rap_guardar"><i class="fas fa-floppy-disk"></i> Guardar</button>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_sueno">
  <div class="modalBody hor_modal hor_modal_sueno">
    <button class="modalX"><i class="fas fa-times"></i></button>
    <div class="hor_modal_hero hor_modal_hero_sueno">
      <div class="hor_modal_hero_ico" style="background:#3D4C7E"><i class="fas fa-moon"></i></div>
      <div><h2 class="hor_modal_tit">Registrar Sueño</h2><p class="hor_modal_sub">Horas de descanso</p></div>
    </div>
    <div class="hor_modal_body">
      <div class="hor_sueno_visual">
        <div class="hor_sueno_arc" id="sueno_arc">
          <i class="fas fa-moon hor_sueno_moon"></i>
          <div class="hor_sueno_horas" id="sueno_horas_display">8h 00m</div>
          <div class="hor_sueno_label">de descanso</div>
        </div>
      </div>
      <div class="hor_field_row hor_field_row2">
        <div class="hor_field"><label class="hor_label"><i class="fas fa-moon"></i> Dormir</label><input type="time" class="hor_input hor_input_plain" id="sueno_ini" value="22:00"/></div>
        <div class="hor_field"><label class="hor_label"><i class="fas fa-sun"></i> Despertar</label><input type="time" class="hor_input hor_input_plain" id="sueno_fin" value="06:00"/></div>
      </div>
      <div class="hor_field"><label class="hor_label"><i class="fas fa-repeat"></i> Programar</label>
        <select class="hor_select" id="sueno_modo"><option value="solo_hoy">Solo hoy</option><option value="lun_vie">Lun a Vie</option><option value="lun_sab">Lun a Sáb</option><option value="todos" selected>Todos</option><option value="rango">Rango</option></select>
      </div>
      <div class="hor_field dpn" id="sueno_campo_fecha"><label class="hor_label"><i class="fas fa-calendar-day"></i> Fecha</label><input type="date" class="hor_input hor_input_plain" id="sueno_fecha"/></div>
      <div class="hor_field_row hor_field_row2 dpn" id="sueno_campo_rango">
        <div class="hor_field"><label class="hor_label"><i class="fas fa-calendar-plus"></i> Desde</label><input type="date" class="hor_input hor_input_plain" id="sueno_desde"/></div>
        <div class="hor_field"><label class="hor_label"><i class="fas fa-calendar-minus"></i> Hasta</label><input type="date" class="hor_input hor_input_plain" id="sueno_hasta"/></div>
      </div>
      <div class="hor_sueno_tips">
        <div class="hor_sueno_tip hor_sueno_tip_ok" id="stip_ok"><i class="fas fa-check-circle"></i> Ideal (7–9h)</div>
        <div class="hor_sueno_tip hor_sueno_tip_warn" id="stip_warn" style="display:none"><i class="fas fa-exclamation-triangle"></i> Poco (&lt;7h)</div>
        <div class="hor_sueno_tip hor_sueno_tip_over" id="stip_over" style="display:none"><i class="fas fa-info-circle"></i> Mucho (&gt;9h)</div>
      </div>
      <div class="hor_modal_footer">
        <button type="button" class="hor_btn_del dpn" id="sueno_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
        <div class="hor_modal_footer_r">
          <button type="button" class="hor_btn_cancel" id="sueno_cancelar">Cancelar</button>
          <button type="button" class="hor_btn_save hor_btn_save_sueno" id="sueno_guardar"><i class="fas fa-moon"></i> Guardar</button>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_ver_evento">
  <div class="modalBody hor_modal hor_modal_ver">
    <button class="modalX"><i class="fas fa-times"></i></button>
    <div id="hor_ver_content"></div>
  </div>
</div>

<div class="wiModal" id="modal_resumen">
  <div class="modalBody hor_modal hor_modal_resumen">
    <button class="modalX"><i class="fas fa-times"></i></button>
    <div class="hor_modal_hero" style="background:linear-gradient(135deg,#29C72Ecc,#29C72E88)">
      <div class="hor_modal_hero_ico" style="background:#29C72E"><i class="fas fa-chart-pie"></i></div>
      <div><h2 class="hor_modal_tit">Resumen semana</h2><p class="hor_modal_sub" id="res_rango_txt">Análisis semanal</p></div>
    </div>
    <div class="hor_modal_body"><div id="hor_resumen_content"></div></div>
  </div>
</div>

<div class="wiModal" id="modal_confirmar">
  <div class="modalBody hor_modal_confirm">
    <div class="hor_confirm_ico"><i class="fas fa-triangle-exclamation"></i></div>
    <h3>¿Eliminar evento?</h3>
    <p id="confirm_ev_nombre"></p>
    <div class="hor_confirm_btns">
      <button class="hor_btn_cancel" id="confirm_no">Cancelar</button>
      <button class="hor_btn_del_confirm" id="confirm_si"><i class="fas fa-trash"></i> Eliminar</button>
    </div>
  </div>
</div>`;

let _cal=null, _diaActivo=hoy(), _evEdit=null, _suenoEdit=null,
    _sortable=null, _timerProx=null, _rapTipo=null, _confirmCb=null;

export const init = async () => {
  await _cargarEvs();
  _initCal();
  _renderBlock(_diaActivo);
  _bindAll();
  _actualizarResumen();
  $('#hor_tarea_fecha').val(defFechaTarea());
  _timerProx=setInterval(_actualizarResumen,60000);
  wiAuth(_cargarEvs, () => { _renderBlock(_diaActivo); _cal?.refetchEvents(); _actualizarResumen(); });
  wiAuth(_cargarEvs, _renderBlock);
  console.log('📅 Horario v6.0 OK');
};

const _initCal = () => {
  const el=document.getElementById('hor_calendar'); if(!el) return;
  _cal=new Calendar(el,{
    plugins:[timeGridPlugin,interactionPlugin],
    initialView:'timeGridWeek', locale:'es', firstDay:0, allDaySlot:false,
    slotMinTime:'06:00:00', slotMaxTime:'30:00:00', slotDuration:'00:30:00',
    slotLabelInterval:'01:00:00', slotLabelFormat:{hour:'2-digit',minute:'2-digit',hour12:false},
    nowIndicator:true, editable:true, selectable:true, headerToolbar:false, height:'auto',
    businessHours:{daysOfWeek:[0,1,2,3,4,5,6],startTime:'06:00',endTime:'23:00'},

    events:(info,ok)=>{ const s=info.startStr.split('T')[0],e=addDays(s,6); ok(getEvs().flatMap(ev=>_expandRange(ev,s,e)).map(evToFC)); },
    dateClick:info=>{ _diaActivo=info.dateStr.split('T')[0]; _renderBlock(_diaActivo); },
    select:info=>{
      const startF=info.startStr.split('T')[0], endF=info.endStr.split('T')[0];
      const hi=info.startStr.split('T')[1]?.slice(0,5)||ahora(), hf=info.endStr.split('T')[1]?.slice(0,5)||'';
      if (esPasado(startF)) { Notificacion('📅 No puedes crear eventos en días pasados','warning'); _cal.unselect(); return; }
      if (startF!==endF) {
        const realEndF=addDays(endF,-1);
        _openModalEv({fecha:startF,fechaInicio:startF,fechaFin:realEndF>=startF?realEndF:startF,horaInicio:hi,horaFin:hf,repetir:'rango'});
      } else { _openModalEv({fecha:startF,horaInicio:hi,horaFin:hf}); }
      _cal.unselect();
    },
    selectAllow:info=>!esPasado(info.startStr.split('T')[0]),
    eventClick:info=>{ const p=info.event.extendedProps, pid=p._parentId||p._fsId; const ev=getEvs().find(x=>x._fsId===pid)||getEvs().find(x=>x.id===pid); if(ev) _openModalVer({...ev,fecha:info.event.startStr.split('T')[0]}); },
    eventDrop:async info=>{ const p=info.event.extendedProps; if(p.pasado){info.revert();Notificacion('📅 No puedes mover eventos pasados','warning');return;} const ev=getEvs().find(x=>x._fsId===(p._parentId||p._fsId)); if(!ev){info.revert();return;} const nf=info.event.startStr.split('T')[0]; if(esPasado(nf)){info.revert();Notificacion('📅 No puedes mover a días pasados','warning');return;} await upsertEv({...ev,fecha:nf,horaInicio:info.event.startStr.split('T')[1]?.slice(0,5),horaFin:info.event.endStr.split('T')[1]?.slice(0,5)}); _cal?.refetchEvents();_actualizarResumen(); },
    eventResize:async info=>{ const p=info.event.extendedProps; if(p.pasado){info.revert();return;} const ev=getEvs().find(x=>x._fsId===(p._parentId||p._fsId)); if(!ev){info.revert();return;} await upsertEv({...ev,horaFin:info.event.endStr.split('T')[1]?.slice(0,5)}); _cal?.refetchEvents();_actualizarResumen(); },
    datesSet:info=>{ const s=info.start.toISOString().split('T')[0],e=addDays(s,6); $('#hor_semana_txt').text(`${fmtFechaCorta(s)} — ${fmtFechaCorta(e)}`); _actualizarResumen(); requestAnimationFrame(()=>_pintarDias()); },
    dayCellClassNames:  arg=>esPasado(arg.date.toISOString().split('T')[0])?['fc_dia_pasado']:[],
    dayHeaderClassNames:arg=>esPasado(arg.date.toISOString().split('T')[0])?['fc_header_pasado']:[],
  });
  _cal.render();
};

const _pintarDias = () => {
  if (!_cal) return;
  try {
    const el=_cal.el; if(!el) return;
    const cols=el.querySelectorAll('.fc-timegrid-col'), headers=el.querySelectorAll('.fc-col-header-cell');
    if (!cols.length) return;
    const view=_cal.view; if(!view) return;
    let cur=new Date(view.activeStart);
    cols.forEach((col,i)=>{ const f=cur.toISOString().split('T')[0]; col.classList.toggle('fc_dia_pasado',esPasado(f)); if(headers[i]) headers[i].classList.toggle('fc_header_pasado',esPasado(f)); cur.setDate(cur.getDate()+1); });
  } catch(_) {}
};

const _renderBlock = fecha => {
  _diaActivo=fecha;
  const d=new Date(fecha+'T00:00:00');
  const esHoy=esHoyF(fecha), pasado=esPasado(fecha);
  const corta=d.toLocaleDateString('es-PE',{weekday:'short',day:'numeric',month:'short'});
  $('#hor_dia_nombre').text(esHoy?`Hoy — ${corta}`:d.toLocaleDateString('es-PE',{weekday:'long',day:'numeric',month:'long'}));
  $('#hor_dia_fecha').text(esHoy?'Hoy':corta);
  $('#hor_dia_pasado_badge').toggleClass('dpn',!pasado);
  $('#hor_add_tarea').prop('disabled',pasado).toggleClass('hor_add_btn_disabled',pasado);
  _renderTareas(pasado);
  _actualizarResumen();
};

const _renderTareas = (soloLectura=false) => {
  const tareas=getTareas(), $list=$('#hor_tareas_list').empty();
  $('#hor_tareas_count').text(tareas.length||'');
  if (!tareas.length) { $list.html('<div class="hor_empty"><i class="fas fa-clipboard-list"></i><span>Sin tareas</span></div>'); _actualizarProgreso([]); return; }
  const PSORT={alta:0,media:1,baja:2};
  const sorted=[...tareas].sort((a,b)=>{ if(a.estado==='hecho'&&b.estado!=='hecho') return 1; if(b.estado==='hecho'&&a.estado!=='hecho') return -1; return (PSORT[a.prio]||1)-(PSORT[b.prio]||1); });
  sorted.forEach(t=>{
    const tipo=TIPOS_TAREA[t.tipo]||TIPOS_TAREA.trabajo, done=t.estado==='hecho', est=t.estado||'pendiente';
    const canPrev=est!=='pendiente', canNext=est!=='hecho', ro=soloLectura?' hor_readonly':'';
    $list.append(`
    <div class="hor_tarea_item${done?' hor_done':''}${ro}" data-tid="${t._fsId}">
      ${!soloLectura?'<i class="fas fa-grip-vertical hor_drag"></i>':''}
      <div class="hor_check${done?' hor_checked':''}" data-tcheck="${t._fsId}"><i class="fas fa-check"></i></div>
      <div class="hor_tarea_info">
        <div class="hor_tarea_tit">${t.titulo}</div>
        <div class="hor_tarea_meta">
          <span class="hor_prio_dot" style="background:${PRIO_COLOR[t.prio]||'#FFB800'}"></span>
          <span class="hor_tarea_meta_tipo" style="--tag:${tipo.color}"><i class="fas ${tipo.icon}"></i> ${tipo.label}</span>
          ${t.fecha?`<span class="hor_tarea_meta_fecha">${fmtFTarea(t.fecha)} ${diasR(t.fecha)}</span>`:''}
        </div>
      </div>
      ${!soloLectura?`
      <div class="hor_tarea_flow">
        <button class="hor_tarea_flow_btn ${canPrev?'':'hor_flow_off'}" data-tmove="${t._fsId}" data-tdir="prev"><i class="fas fa-chevron-left"></i></button>
        <span style="color:${EST_CLR[est]};font-size:var(--fz_s2)"><i class="fas ${EST_ICO[est]}"></i></span>
        <button class="hor_tarea_flow_btn ${canNext?'':'hor_flow_off'}" data-tmove="${t._fsId}" data-tdir="next"><i class="fas fa-chevron-right"></i></button>
      </div>
      <button class="hor_del_btn" data-tdel="${t._fsId}"><i class="fas fa-times"></i></button>`:''}
    </div>`);
  });
  _actualizarProgreso(tareas);
  try { if(_sortable?.el?.parentNode) _sortable.destroy(); } catch(_) {}
  _sortable=null;
  if (!soloLectura) {
    const el=$list[0]; if(!el) return;
    _sortable=new Sortable(el,{ animation:150, handle:'.hor_drag', ghostClass:'hor_ghost', onEnd:()=>{ const newOrder=[]; $list.find('.hor_tarea_item').each(function(){ const t=getTareas().find(x=>x._fsId===$(this).data('tid')); if(t) newOrder.push(t); }); setTareas(newOrder); } });
  }
};

const _actualizarProgreso = tareas => { const total=tareas.length, done=tareas.filter(t=>t.estado==='hecho').length, pct=total?Math.round(done/total*100):0; $('#hor_prog_pct').text(`${pct}%`); $('#hor_prog_bar').css('width',`${pct}%`); };

const _actualizarResumen = () => {
  const view=_cal?.view; if(!view) return;
  const s=view.currentStart?.toISOString().split('T')[0]||hoy(), e=addDays(s,6);
  const evs=getEvs().flatMap(ev=>_expandRange(ev,s,e)).filter(ev=>!ev.sueno);
  const tareas=getTareas(), done=evs.filter(x=>x.completado).length;
  $('#res_total_n').text(evs.length);
  $('#res_horas_n').text(fmtMin(evs.reduce((a,ev)=>a+minsHH(ev.horaInicio,ev.horaFin),0)));
  $('#res_comp_n').text(evs.length?`${Math.round(done/evs.length*100)}%`:'0%');
  $('#res_tareas_n').text(tareas.length);
  const suenoHoy=getEvs().find(x=>x.sueno&&(x.fecha===hoy()||(x.repetir&&x.repetir!=='solo_hoy')));
  $('#res_sueno_n').text(suenoHoy?fmtMin(suenoHoy.suenoHoras*60):'—');
};

const _agregarTarea = () => {
  const txt=$('#hor_tarea_input').val().trim(); if(!txt) return Notificacion('Escribe una tarea','warning');
  const tipo=$('#hor_tarea_tipo').val()||'trabajo', fecha=$('#hor_tarea_fecha').val()||defFechaTarea();
  _upsertTarea({titulo:txt,fecha,prio:'media',tipo,estado:'pendiente',color:TIPOS_TAREA[tipo]?.color||'#29C72E',subtareas:[],historial:[],creado:new Date().toISOString()});
  _renderTareas(false); _actualizarResumen();
  $('#hor_tarea_input').val(''); $('#hor_tarea_fecha').val(defFechaTarea());
  Notificacion('Tarea creada ✓','success');
};

const _heroColor = (heroSel,icoSel,color,icon) => { $(heroSel).css('background',`linear-gradient(135deg,${color}dd,${color}88)`); $(icoSel).css('background',color).html(`<i class="fas ${icon}"></i>`); };
const _durPreview = (iniSel,finSel,txtSel) => { const hi=$(iniSel).val(),hf=$(finSel).val(); $(txtSel).text((hi&&hf)?fmtMin(minsHH(hi,hf)):'—'); };
const _selColor   = (scope,color) => { $(scope).find('.hor_color_opt').removeClass('active'); $(scope).find(`.hor_color_opt[data-color="${color}"]`).addClass('active'); };
const _getSelColor = scope => $(scope).find('.hor_color_opt.active').data('color')||COLORES[0];
const _toggleModo  = (fechaSel,rangoSel,modo) => { $(fechaSel).toggleClass('dpn',modo!=='solo_hoy'); $(rangoSel).toggleClass('dpn',modo!=='rango'); };

const _renderSubtareas = lista => { const $c=$('#ev_subtareas_list').empty(); lista.forEach((s,i)=>{ $c.append(`<div class="hor_subtarea_row"><span class="hor_subtarea_num">${i+1}</span><input type="text" class="hor_subtarea_input" placeholder="Subtarea ${i+1}…" value="${s}" maxlength="60"/><button type="button" class="hor_del_sub"><i class="fas fa-times"></i></button></div>`); }); };
const _getSubtareas = () => $('.hor_subtarea_input').map((_,el)=>$(el).val().trim()).get().filter(Boolean);

const _openModalEv = (d={}) => {
  _evEdit=d._fsId?d:null;
  const color=d.color||COLORES[0], tipo=d.tipo||'trabajo', rep=d.repetir||'solo_hoy';
  $('#ev_titulo').val(d.titulo||''); $('#ev_fecha').val(d.fecha||_diaActivo||hoy());
  $('#ev_inicio').val(d.horaInicio||ahora()); $('#ev_fin').val(d.horaFin||'');
  $('#ev_tipo').val(tipo); $('#ev_repetir').val(rep);
  $('#ev_fecha_desde').val(d.fechaInicio||hoy()); $('#ev_fecha_hasta').val(d.fechaFin||addDays(hoy(),7));
  $('#ev_rango_wrap').toggleClass('dpn',rep!=='rango');
  _renderSubtareas(d.subtareas||[]);
  _durPreview('#ev_inicio','#ev_fin','#ev_dur_txt');
  _selColor('#ev_colores',color);
  _heroColor('#modal_ev_hero','#modal_ev_ico',color,TIPOS[tipo]?.icon||'fa-calendar-plus');
  $('#modal_ev_tit').text(_evEdit?'Editar Evento':'Nuevo Evento');
  $('#modal_ev_sub').text(_evEdit?'Modifica los datos':'Completa los datos');
  $('#ev_eliminar').toggleClass('dpn',!_evEdit);
  abrirModal('modal_evento'); setTimeout(()=>$('#ev_titulo').focus(),50);
};

const _guardarEvento = async () => {
  const titulo=$('#ev_titulo').val().trim(); if(!titulo) return Notificacion('El título es obligatorio','warning');
  const hi=$('#ev_inicio').val(),hf=$('#ev_fin').val(); if(!hi||!hf) return Notificacion('Indica hora inicio y fin','warning');
  const rep=$('#ev_repetir').val(), color=_getSelColor('#ev_colores');
  const ev={...(_evEdit||{}),titulo,fecha:$('#ev_fecha').val()||hoy(),horaInicio:hi,horaFin:hf,tipo:$('#ev_tipo').val(),repetir:rep,color,subtareas:_getSubtareas(),completado:_evEdit?.completado||false,sueno:false};
  if (rep==='rango') { ev.fechaInicio=$('#ev_fecha_desde').val()||hoy(); ev.fechaFin=$('#ev_fecha_hasta').val()||addDays(hoy(),7); }
  await upsertEv(ev); cerrarModal('modal_evento'); _cal?.refetchEvents(); _actualizarResumen();
  Notificacion(_evEdit?'Evento actualizado ✓':'Evento creado ✓','success');
};

const _openModalRapido = tipo => {
  _rapTipo=tipo; const cfg=RAPIDOS[tipo];
  $('#rap_tit').text(cfg.tituloModal); $('#rap_sub').text(cfg.subModal);
  _heroColor('#rap_hero','#rap_ico',cfg.heroColor,cfg.icon);
  $('#rap_titulo').val(cfg.titulo); $('#rap_ini').val(cfg.horaInicio); $('#rap_fin').val(cfg.horaFin);
  $('#rap_repetir').val(cfg.repetir); $('#rap_fecha').val(hoy());
  $('#rap_desde').val(hoy()); $('#rap_hasta').val(addDays(hoy(),30));
  _toggleModo('#rap_campo_fecha','#rap_campo_rango',cfg.repetir);
  _selColor('#rap_colores',cfg.color); _durPreview('#rap_ini','#rap_fin','#rap_dur_txt');
  abrirModal('modal_rapido'); setTimeout(()=>$('#rap_titulo').focus(),50);
};

const _guardarRapido = async () => {
  const titulo=$('#rap_titulo').val().trim(); if(!titulo) return Notificacion('Título requerido','warning');
  const rep=$('#rap_repetir').val(), color=_getSelColor('#rap_colores'), cfg=RAPIDOS[_rapTipo];
  const ev={titulo,horaInicio:$('#rap_ini').val(),horaFin:$('#rap_fin').val(),tipo:cfg.tipo,color,repetir:rep,subtareas:[],completado:false,sueno:false,fecha:rep==='solo_hoy'?($('#rap_fecha').val()||hoy()):hoy()};
  if (rep==='rango') { ev.fechaInicio=$('#rap_desde').val()||hoy(); ev.fechaFin=$('#rap_hasta').val()||addDays(hoy(),30); }
  await upsertEv(ev); cerrarModal('modal_rapido'); _cal?.refetchEvents(); _actualizarResumen();
  Notificacion('Registrado ✓','success');
};

const _updateSuenoPreview = () => {
  const ini=$('#sueno_ini').val()||'22:00', fin=$('#sueno_fin').val()||'06:00';
  const mins=minsHH(ini,fin), h=Math.floor(mins/60), m=mins%60;
  $('#sueno_horas_display').text(`${h}h ${String(m).padStart(2,'0')}m`);
  const $arc=$('#sueno_arc').removeClass('sueno_ideal sueno_poco sueno_mucho');
  if (h>=7&&h<=9) $arc.addClass('sueno_ideal'); else if (h<7) $arc.addClass('sueno_poco'); else $arc.addClass('sueno_mucho');
  $('#stip_ok').toggle(h>=7&&h<=9); $('#stip_warn').toggle(h<7); $('#stip_over').toggle(h>9);
};

const _openModalSueno = (ev=null) => {
  _suenoEdit=ev; const modo=ev?.repetir||'todos';
  $('#sueno_ini').val(ev?.horaInicio||'22:00'); $('#sueno_fin').val(ev?.horaFin||'06:00');
  $('#sueno_modo').val(modo); $('#sueno_fecha').val(ev?.fecha||hoy());
  $('#sueno_desde').val(ev?.fechaInicio||hoy()); $('#sueno_hasta').val(ev?.fechaFin||addDays(hoy(),30));
  _toggleModo('#sueno_campo_fecha','#sueno_campo_rango',modo);
  _updateSuenoPreview(); $('#sueno_eliminar').toggleClass('dpn',!ev);
  abrirModal('modal_sueno');
};

const _guardarSueno = async () => {
  const ini=$('#sueno_ini').val(), fin=$('#sueno_fin').val(); if(!ini||!fin) return Notificacion('Indica horas de sueño','warning');
  const modo=$('#sueno_modo').val(), mins=minsHH(ini,fin);
  const ev={...(_suenoEdit||{}),titulo:'Sueño',horaInicio:ini,horaFin:fin,tipo:'sueno',color:'#3D4C7E',repetir:modo,subtareas:[],completado:false,sueno:true,suenoHoras:Math.round(mins/60*10)/10,fecha:modo==='solo_hoy'?($('#sueno_fecha').val()||hoy()):hoy()};
  if (modo==='rango') { ev.fechaInicio=$('#sueno_desde').val()||hoy(); ev.fechaFin=$('#sueno_hasta').val()||addDays(hoy(),30); }
  await upsertEv(ev); cerrarModal('modal_sueno'); _cal?.refetchEvents(); _actualizarResumen();
  Notificacion('Sueño registrado ✓','success');
};

const _openModalVer = ev => {
  const tipo=TIPOS[ev.tipo]||TIPOS.otro, dur=minsHH(ev.horaInicio,ev.horaFin);
  const subs=ev.subtareas||[], pasado=esPasado(ev.fecha), color=pasado?'#94A3B8':ev.color;
  $('#hor_ver_content').html(`
    <div class="hor_ver_header" style="--vc:${color}">
      <div class="hor_ver_header_ico" style="background:${color}"><i class="fas ${tipo.icon}"></i></div>
      <div class="hor_ver_header_info"><h3>${ev.titulo}</h3><span class="hor_ver_tipo">${tipo.label}${pasado?' · <i class="fas fa-clock-rotate-left"></i> Pasado':''}</span></div>
    </div>
    <div class="hor_ver_body">
      <div class="hor_ver_row"><i class="fas fa-calendar-day" style="color:${color}"></i><span>${fmtFecha(ev.fecha)}</span></div>
      <div class="hor_ver_row"><i class="fas fa-clock" style="color:${color}"></i><span>${ev.horaInicio} → ${ev.horaFin}</span><span class="hor_ver_dur">${fmtMin(dur)}</span></div>
      <div class="hor_ver_row"><i class="fas fa-repeat" style="color:${color}"></i><span>${REPETIR[ev.repetir]?.label||'Solo hoy'}</span></div>
      ${subs.length?`<div class="hor_ver_row"><i class="fas fa-tasks" style="color:${color}"></i><span>${subs.length} subtarea${subs.length>1?'s':''}</span></div><div class="hor_ver_subs">${subs.map(s=>`<div class="hor_ver_sub_item"><i class="fas fa-circle-dot"></i>${s}</div>`).join('')}</div>`:''}
    </div>
    <div class="hor_ver_footer">
      ${!pasado?`<button class="hor_btn_ver_edit" id="ver_editar" style="background:${color}"><i class="fas fa-pen"></i> Editar</button>`:'<span class="hor_ver_readonly"><i class="fas fa-lock"></i> Solo lectura</span>'}
      <button class="hor_btn_ver_del" id="ver_eliminar"><i class="fas fa-trash"></i></button>
    </div>`);
  abrirModal('modal_ver_evento');
  $('#ver_editar').off('click').on('click',()=>{ cerrarModal('modal_ver_evento'); const parent=getEvs().find(x=>x._fsId===(ev._parentId||ev._fsId)); if(parent?.sueno) _openModalSueno(parent); else _openModalEv(parent||ev); });
  $('#ver_eliminar').off('click').on('click',()=>{ cerrarModal('modal_ver_evento'); _openConfirmar(getEvs().find(x=>x._fsId===(ev._parentId||ev._fsId))||ev); });
};

const _abrirResumenModal = () => {
  const view=_cal?.view, s=view?.currentStart?.toISOString().split('T')[0]||hoy(), e=addDays(s,6);
  $('#res_rango_txt').text(`${fmtFechaCorta(s)} — ${fmtFechaCorta(e)}`);
  const evs=getEvs().flatMap(ev=>_expandRange(ev,s,e)).filter(ev=>!ev.sueno);
  const totalMin=evs.reduce((a,ev)=>a+minsHH(ev.horaInicio,ev.horaFin),0);
  const done=evs.filter(x=>x.completado).length, pct=evs.length?Math.round(done/evs.length*100):0;
  const tareas=getTareas(), tareasHechas=tareas.filter(t=>t.estado==='hecho').length;
  const suenoEvs=getEvs().filter(x=>x.sueno);
  const porTipo=Object.entries(TIPOS).filter(([k])=>k!=='sueno').map(([k,v])=>{ const c=evs.filter(x=>x.tipo===k).length; return c?`<div class="hor_res_tipo_row"><i class="fas ${v.icon}" style="color:${v.color}"></i><span>${v.label}</span><strong>${c}</strong></div>`:''; }).join('');
  const diasSem=Array.from({length:7},(_,i)=>{ const f=addDays(s,i),d=new Date(f+'T00:00:00'); const cnt=evs.filter(x=>x.fecha===f).length,hPct=Math.min(cnt/6*100,100); const cls=esHoyF(f)?'hor_res_dia_hoy':esPasado(f)?'hor_res_dia_pasado':''; return `<div class="hor_res_dia_col ${cls}"><div class="hor_res_dia_bar" style="height:${hPct}%"></div><strong>${cnt}</strong><span>${d.toLocaleDateString('es-PE',{weekday:'short'})}</span></div>`; }).join('');
  $('#hor_resumen_content').html(`
    <div class="hor_res_stats_grid">
      <div class="hor_res_stat_card"><i class="fas fa-calendar-check" style="color:#0EBEFF"></i><strong>${evs.length}</strong><span>Eventos</span></div>
      <div class="hor_res_stat_card"><i class="fas fa-clock" style="color:#29C72E"></i><strong>${fmtMin(totalMin)}</strong><span>Horas</span></div>
      <div class="hor_res_stat_card"><i class="fas fa-circle-check" style="color:#7000FF"></i><strong>${pct}%</strong><span>Hecho</span></div>
      <div class="hor_res_stat_card"><i class="fas fa-list-check" style="color:#FFB800"></i><strong>${tareasHechas}/${tareas.length}</strong><span>Tareas</span></div>
    </div>
    <div class="hor_res_sec_tit"><i class="fas fa-chart-bar"></i> Eventos por día</div>
    <div class="hor_res_dias_grid">${diasSem}</div>
    ${porTipo?`<div class="hor_res_sec_tit"><i class="fas fa-tags"></i> Por tipo</div><div class="hor_res_tipos">${porTipo}</div>`:''}
    ${suenoEvs.length?`<div class="hor_res_sec_tit"><i class="fas fa-moon"></i> Sueño</div><div class="hor_res_sueno_info"><i class="fas fa-moon"></i>${suenoEvs[0].suenoHoras||0}h promedio</div>`:''}`);
  abrirModal('modal_resumen');
};

const _openConfirmar = ev => {
  $('#confirm_ev_nombre').text(ev.titulo||'Sin título');
  _confirmCb=async()=>{ await deleteEv(ev); cerrarModal('modal_confirmar'); _cal?.refetchEvents(); _actualizarResumen(); Notificacion('Evento eliminado ✓','success'); };
  abrirModal('modal_confirmar');
};

const _bindAll = () => {
  $(document).off('.hor');
  const $d=$(document);
  $d.on('click.hor','#hor_prev',()=>_cal?.prev())
    .on('click.hor','#hor_next',()=>_cal?.next())
    .on('click.hor','#hor_hoy',()=>{ _cal?.today(); _diaActivo=hoy(); _renderBlock(_diaActivo); })
    .on('click.hor','#hor_nuevo_ev',()=>{ if(esPasado(_diaActivo)) return Notificacion('📅 Es un día pasado, selecciona hoy o futuro','warning'); _openModalEv({fecha:_diaActivo}); })
    .on('click.hor','.hor_accion_btn',function(){ ACCIONES[+$(this).data('idx')]?.fn?.(); })
    .on('click.hor','#hor_add_tarea',()=>{ if(esPasado(_diaActivo)) return Notificacion('📅 Es un día pasado','warning'); $('#hor_tarea_new').toggleClass('dpn'); if(!$('#hor_tarea_new').hasClass('dpn')) setTimeout(()=>$('#hor_tarea_input').focus(),50); })
    .on('click.hor','#hor_tarea_cancel',()=>$('#hor_tarea_new').addClass('dpn'))
    .on('click.hor','#hor_tarea_ok',_agregarTarea)
    .on('keydown.hor','#hor_tarea_input',e=>{ if(e.key==='Enter'){e.preventDefault();_agregarTarea();} })
    .on('click.hor','[data-tcheck]',function(e){ e.stopPropagation(); const t=getTareas().find(x=>x._fsId===$(this).data('tcheck')); if(!t) return; const nuevo=t.estado==='hecho'?'pendiente':'hecho'; _upsertTarea({...t,estado:nuevo,completado:nuevo==='hecho'?new Date().toISOString():''}); _renderTareas(false);_actualizarResumen(); })
    .on('click.hor','[data-tmove]',function(e){ e.stopPropagation(); _moverTareaEstado($(this).data('tmove'),$(this).data('tdir')); _actualizarResumen(); })
    .on('click.hor','[data-tdel]',function(e){ e.stopPropagation(); const t=getTareas().find(x=>x._fsId===$(this).data('tdel')); if(t){ _deleteTarea(t);_renderTareas(false);_actualizarResumen();Notificacion('Tarea eliminada ✓','success'); } })
    .on('click.hor','#ev_colores .hor_color_opt:not(.hor_color_rap)',function(){ const c=$(this).data('color'); _selColor('#ev_colores',c); _heroColor('#modal_ev_hero','#modal_ev_ico',c,TIPOS[$('#ev_tipo').val()]?.icon||'fa-calendar-plus'); })
    .on('change.hor','#ev_tipo',function(){ _heroColor('#modal_ev_hero','#modal_ev_ico',_getSelColor('#ev_colores'),(TIPOS[$(this).val()]||TIPOS.trabajo).icon); })
    .on('change.hor input.hor','#ev_inicio,#ev_fin',()=>_durPreview('#ev_inicio','#ev_fin','#ev_dur_txt'))
    .on('change.hor','#ev_repetir',function(){ $('#ev_rango_wrap').toggleClass('dpn',$(this).val()!=='rango'); })
    .on('click.hor','#ev_add_subtarea',()=>{ const n=$('#ev_subtareas_list .hor_subtarea_row').length+1; $('#ev_subtareas_list').append(`<div class="hor_subtarea_row"><span class="hor_subtarea_num">${n}</span><input type="text" class="hor_subtarea_input" placeholder="Subtarea ${n}…" maxlength="60"/><button type="button" class="hor_del_sub"><i class="fas fa-times"></i></button></div>`); $('#ev_subtareas_list .hor_subtarea_row:last .hor_subtarea_input').focus(); })
    .on('click.hor','.hor_del_sub',function(){ $(this).closest('.hor_subtarea_row').remove(); })
    .on('click.hor','#ev_cancelar',()=>cerrarModal('modal_evento'))
    .on('click.hor','#ev_guardar',_guardarEvento)
    .on('click.hor','#ev_eliminar',()=>{ if(_evEdit){ cerrarModal('modal_evento');_openConfirmar(_evEdit); } })
    .on('keydown.hor','#ev_titulo',e=>{ if(e.key==='Enter') _guardarEvento(); })
    .on('change.hor','#rap_repetir',function(){ _toggleModo('#rap_campo_fecha','#rap_campo_rango',$(this).val()); })
    .on('change.hor input.hor','#rap_ini,#rap_fin',()=>_durPreview('#rap_ini','#rap_fin','#rap_dur_txt'))
    .on('click.hor','#rap_colores .hor_color_rap',function(){ _selColor('#rap_colores',$(this).data('color')); })
    .on('click.hor','#rap_cancelar',()=>cerrarModal('modal_rapido'))
    .on('click.hor','#rap_guardar',_guardarRapido)
    .on('change.hor input.hor','#sueno_ini,#sueno_fin',_updateSuenoPreview)
    .on('change.hor','#sueno_modo',function(){ _toggleModo('#sueno_campo_fecha','#sueno_campo_rango',$(this).val()); })
    .on('click.hor','#sueno_cancelar',()=>cerrarModal('modal_sueno'))
    .on('click.hor','#sueno_eliminar',async()=>{ if(_suenoEdit){ await deleteEv(_suenoEdit);cerrarModal('modal_sueno');_cal?.refetchEvents();_actualizarResumen();Notificacion('Sueño eliminado ✓','success'); } })
    .on('click.hor','#sueno_guardar',_guardarSueno)
    .on('click.hor','#confirm_no',()=>cerrarModal('modal_confirmar'))
    .on('click.hor','#confirm_si',()=>_confirmCb?.());
};

export const cleanup = () => {
  if (_timerProx) { clearInterval(_timerProx); _timerProx=null; }
  try { if(_sortable?.el?.parentNode) _sortable.destroy(); } catch(_) {}
  _sortable=null;
  try { _cal?.destroy(); } catch(_) {}
  _cal=null; _evEdit=null; _suenoEdit=null; _confirmCb=null;
  $(document).off('.hor');
  localStorage.removeItem(CACHE_KEY);
  localStorage.removeItem(NOTA_KEY);
  console.log('🧹 Horario limpiado');
};