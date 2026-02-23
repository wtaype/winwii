import './logros.css';
import $ from 'jquery';
import { db } from '../smile/firebase.js';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Notificacion, abrirModal, cerrarModal, getls, savels, wiTip, wiSpin, wiAuth } from '../widev.js';

const CACHE = 'wii_logros_v1', COL = 'logros';

/* ── Categorías ── */
const CATEGORIAS = {
  personal:  { label:'Personal',   icon:'fa-user',            color:'#FFB800' },
  trabajo:   { label:'Trabajo',    icon:'fa-briefcase',       color:'#0EBEFF' },
  estudio:   { label:'Estudio',    icon:'fa-book',            color:'#7000FF' },
  salud:     { label:'Salud',      icon:'fa-heart-pulse',     color:'#FF5C69' },
  deporte:   { label:'Deporte',    icon:'fa-dumbbell',        color:'#29C72E' },
  finanzas:  { label:'Finanzas',   icon:'fa-coins',           color:'#00C9B1' },
  social:    { label:'Social',     icon:'fa-users',           color:'#A855F7' },
  creativo:  { label:'Creativo',   icon:'fa-palette',         color:'#F97316' },
  otro:      { label:'Otro',       icon:'fa-star',            color:'#94A3B8' },
};

/* ── Niveles / XP ── */
const NIVELES = [
  { min:0,    max:100,  label:'Novato',    icon:'fa-seedling',     color:'#94A3B8', badge:'🌱' },
  { min:100,  max:300,  label:'Aprendiz',  icon:'fa-bolt',         color:'#29C72E', badge:'⚡' },
  { min:300,  max:600,  label:'Veterano',  icon:'fa-shield',       color:'#0EBEFF', badge:'🛡️' },
  { min:600,  max:1000, label:'Experto',   icon:'fa-gem',          color:'#7000FF', badge:'💎' },
  { min:1000, max:2000, label:'Maestro',   icon:'fa-crown',        color:'#FFB800', badge:'👑' },
  { min:2000, max:9999, label:'Leyenda',   icon:'fa-dragon',       color:'#FF5C69', badge:'🔥' },
];

/* ── Insignias automáticas ── */
const INSIGNIAS = [
  { id:'primer_logro', label:'Primer paso',   icon:'fa-flag',        color:'#29C72E', cond: l => l.length >= 1 },
  { id:'x5',          label:'Racha x5',       icon:'fa-fire',        color:'#FF5C69', cond: l => l.length >= 5 },
  { id:'x10',         label:'Décimo logro',   icon:'fa-star',        color:'#FFB800', cond: l => l.length >= 10 },
  { id:'x25',         label:'Imparable x25',  icon:'fa-rocket',      color:'#7000FF', cond: l => l.length >= 25 },
  { id:'multcat',     label:'Versátil',        icon:'fa-shuffle',     color:'#0EBEFF', cond: l => new Set(l.map(x=>x.categoria)).size >= 4 },
  { id:'100xp',       label:'100 XP',         icon:'fa-bolt',        color:'#29C72E', cond: (_,xp) => xp >= 100 },
  { id:'500xp',       label:'500 XP',         icon:'fa-gem',         color:'#7000FF', cond: (_,xp) => xp >= 500 },
  { id:'1000xp',      label:'Maestro XP',     icon:'fa-crown',       color:'#FFB800', cond: (_,xp) => xp >= 1000 },
];

const XP_CAT = { personal:15, trabajo:20, estudio:25, salud:18, deporte:20, finanzas:15, social:12, creativo:18, otro:10 };

const COLORES = ['#FFB800','#0EBEFF','#7000FF','#FF5C69','#29C72E','#A855F7','#00C9B1','#F97316','#94A3B8'];

/* ── Utils ── */
const hoy      = () => new Date().toISOString().split('T')[0];
const addDias  = n => { const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().split('T')[0]; };
const mkId     = tit => { const s=(tit||'logro').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'').slice(0,25); return `${s}_${Date.now()}`; };
const fmtCorto = f => new Date(f+'T00:00:00').toLocaleDateString('es-PE',{day:'numeric',month:'short',year:'numeric'});
const fmtRel   = f => {
  const d = Math.floor((new Date(hoy()) - new Date(f+'T00:00:00')) / 86400000);
  if (d === 0) return '🟢 Hoy';
  if (d === 1) return '🔵 Ayer';
  if (d < 7)  return `${d}d atrás`;
  if (d < 30) return `${Math.floor(d/7)}sem atrás`;
  return `${Math.floor(d/30)}m atrás`;
};
const getNivel = xp => NIVELES.find(n => xp >= n.min && xp < n.max) || NIVELES[NIVELES.length-1];
const getXP    = lista => lista.reduce((acc,l) => acc + (XP_CAT[l.categoria]||10) + (l.destacado?10:0), 0);

/* ── Sugerencias de fecha ── */
const getSugerencias = () => [
  { label:'Hoy',      fecha: hoy(),       icon:'fa-circle-dot',   color:'#0EBEFF' },
  { label:'Ayer',     fecha: addDias(-1), icon:'fa-clock-rotate-left', color:'#FFB800' },
  { label:'Antier',   fecha: addDias(-2), icon:'fa-backward',     color:'#29C72E' },
  { label:'-1 semana',fecha: addDias(-7), icon:'fa-calendar-week',color:'#7000FF' },
  { label:'Este mes', fecha: new Date().toISOString().split('T')[0].slice(0,8)+'01', icon:'fa-flag', color:'#A855F7' },
];

/* ── Auth / Cache ── */
const getUser  = () => getls('wiSmile')||null;
const isLogged = () => !!getUser()?.usuario;
const getAll   = () => getls(CACHE)||[];
const setAll   = l  => savels(CACHE,l,48);

/* ── Sync ── */
const _sync = s => { const $d=$('#log_sync'); if(!$d.length) return; $d[0].className=`log_sync_dot log_sync_${s}`; };

/* ── Firestore ── */
const _cargar = async (force=false) => {
  if (!force&&getAll().length) return _sync('ok');
  if (!isLogged()) return _sync('error');
  _sync('loading');
  try {
    const snap = await getDocs(query(collection(db,COL), where('usuario','==',getUser().usuario)));
    setAll(snap.docs.map(d=>({...d.data(),_fsId:d.id,id:d.id})));
    _sync('ok');
  } catch(e) { console.error('❌ logros:',e); _sync('error'); }
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
let _edit=null, _confirmCb=null, _filtro='todos', _busq='', _vista='grid';

const _filtrados = () => {
  let list = getAll().sort((a,b) => (b.fecha||'').localeCompare(a.fecha||''));
  if (_filtro !== 'todos') list = list.filter(x => x.categoria === _filtro || (_filtro==='destacado'&&x.destacado));
  if (_busq) { const q=_busq.toLowerCase(); list = list.filter(x=>(x.titulo||'').toLowerCase().includes(q)||(x.descripcion||'').toLowerCase().includes(q)); }
  return list;
};

/* ══════════════════════════════════════════════════════════
   RENDER HTML
══════════════════════════════════════════════════════════ */
export const render = () => `
<div class="log_wrap">

  <!-- HERO BANNER -->
  <div class="log_hero" id="log_hero">
    <div class="log_hero_left">
      <div class="log_hero_avatar" id="log_hero_avatar">
        <i class="fas fa-seedling" id="log_hero_icon"></i>
      </div>
      <div class="log_hero_info">
        <div class="log_hero_nivel" id="log_hero_nivel">Novato</div>
        <div class="log_hero_badge" id="log_hero_badge">🌱 Empieza tu historia</div>
        <div class="log_hero_xp_wrap">
          <div class="log_hero_xp_bar"><div class="log_hero_xp_fill" id="log_xp_fill" style="width:0%"></div></div>
          <span class="log_hero_xp_txt" id="log_xp_txt">0 XP</span>
        </div>
      </div>
    </div>
    <div class="log_hero_right">
      <div class="log_stat_pill"><i class="fas fa-trophy" style="color:#FFB800"></i><strong id="log_n_total">0</strong><span>Logros</span></div>
      <div class="log_stat_pill"><i class="fas fa-fire" style="color:#FF5C69"></i><strong id="log_n_dest">0</strong><span>Destacados</span></div>
      <div class="log_stat_pill"><i class="fas fa-medal" style="color:#0EBEFF"></i><strong id="log_n_insig">0</strong><span>Insignias</span></div>
    </div>
  </div>

  <!-- INSIGNIAS -->
  <div class="log_insignias_bar" id="log_insignias_bar"></div>

  <!-- ACTION BAR -->
  <div class="log_actionbar">
    <div class="log_ab_left">
      <span class="log_sync_dot log_sync_loading" id="log_sync"></span>
      <button class="log_ab_btn" id="log_refresh" ${wiTip('Actualizar')}><i class="fas fa-rotate-right"></i></button>
      <button class="log_ab_btn log_ab_nuevo" id="log_nuevo"><i class="fas fa-plus"></i> Nuevo logro</button>
    </div>
    <div class="log_ab_right">
      <div class="log_filtros" id="log_filtros">
        <button class="log_fil active" data-fil="todos">Todos</button>
        <button class="log_fil" data-fil="destacado" style="--fc:#FFB800"><i class="fas fa-star"></i> Top</button>
        ${Object.entries(CATEGORIAS).slice(0,5).map(([k,v])=>`<button class="log_fil" data-fil="${k}" style="--fc:${v.color}"><i class="fas ${v.icon}"></i> ${v.label}</button>`).join('')}
      </div>
      <div class="log_search_wrap">
        <i class="fas fa-search"></i>
        <input type="text" class="log_search_input" id="log_buscar" placeholder="Buscar logro…"/>
      </div>
      <div class="log_vista_btns">
        <button class="log_vista_btn active" data-vista="grid" ${wiTip('Cuadrícula')}><i class="fas fa-grid-2"></i></button>
        <button class="log_vista_btn" data-vista="list" ${wiTip('Lista')}><i class="fas fa-list"></i></button>
        <button class="log_vista_btn" data-vista="timeline" ${wiTip('Línea de tiempo')}><i class="fas fa-timeline"></i></button>
      </div>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="log_content" id="log_content"></div>

</div>

<!-- MODAL LOGRO -->
<div class="wiModal" id="modal_logro">
  <div class="modalBody log_modal">
    <button class="modalX"><i class="fas fa-times"></i></button>

    <div class="log_modal_hero" id="log_m_hero">
      <div class="log_modal_ico" id="log_m_ico"><i class="fas fa-trophy"></i></div>
      <div>
        <h2 class="log_modal_tit" id="log_m_tit">Nuevo Logro</h2>
        <p class="log_modal_sub" id="log_m_sub">Registra tu éxito</p>
      </div>
      <div class="log_modal_xp_badge" id="log_m_xp">+15 XP</div>
    </div>

    <div class="log_modal_body">

      <div class="log_field">
        <label class="log_label"><i class="fas fa-heading"></i> Título <span class="log_req">*</span></label>
        <div class="log_input_ico"><i class="fas fa-pen"></i>
          <input type="text" class="log_input" id="l_titulo" placeholder="Ej: Terminé mi primer proyecto" maxlength="80"/>
        </div>
      </div>

      <div class="log_field">
        <label class="log_label"><i class="fas fa-align-left"></i> Descripción</label>
        <textarea class="log_textarea" id="l_desc" placeholder="¿Qué lograste exactamente? Cuéntalo con orgullo…" maxlength="400" rows="2"></textarea>
      </div>

      <!-- Fecha + Sugerencias -->
      <div class="log_field">
        <label class="log_label"><i class="fas fa-calendar"></i> ¿Cuándo lo lograste? <span class="log_req">*</span></label>
        <div class="log_fecha_wrap">
          <input type="date" class="log_input log_input_plain" id="l_fecha"/>
          <div class="log_sugerencias" id="log_sugerencias"></div>
        </div>
      </div>

      <div class="log_field_row log_field_row2">
        <div class="log_field">
          <label class="log_label"><i class="fas fa-tag"></i> Categoría</label>
          <select class="log_select" id="l_cat">
            ${Object.entries(CATEGORIAS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}
          </select>
        </div>
        <div class="log_field">
          <label class="log_label"><i class="fas fa-palette"></i> Color</label>
          <div class="log_colores" id="l_colores">
            ${COLORES.map(c=>`<button type="button" class="log_color_opt" data-color="${c}" style="--c:${c}"></button>`).join('')}
          </div>
        </div>
      </div>

      <!-- Destacado toggle -->
      <div class="log_field">
        <div class="log_destacado_row" id="l_destacado_row">
          <div class="log_destacado_info">
            <i class="fas fa-star" style="color:#FFB800"></i>
            <div>
              <div class="log_destacado_lbl">Marcar como destacado</div>
              <div class="log_destacado_sub">+10 XP extra · aparece primero</div>
            </div>
          </div>
          <button type="button" class="log_toggle" id="l_destacado"><i class="fas fa-toggle-off"></i></button>
        </div>
      </div>

      <div class="log_modal_footer">
        <button type="button" class="log_btn_del dpn" id="l_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
        <div class="log_modal_footer_r">
          <button type="button" class="log_btn_cancel" id="l_cancelar">Cancelar</button>
          <button type="button" class="log_btn_save" id="l_guardar"><i class="fas fa-floppy-disk"></i> Guardar</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- MODAL CONFIRMAR -->
<div class="wiModal" id="modal_log_confirm">
  <div class="modalBody log_modal_confirm">
    <div class="log_confirm_ico"><i class="fas fa-triangle-exclamation"></i></div>
    <h3>¿Eliminar logro?</h3>
    <p id="log_confirm_nombre"></p>
    <div class="log_confirm_btns">
      <button class="log_btn_cancel" id="log_conf_no">Cancelar</button>
      <button class="log_btn_del_confirm" id="log_conf_si"><i class="fas fa-trash"></i> Eliminar</button>
    </div>
  </div>
</div>`;

/* ══════════════════════════════════════════════════════════
   RENDER HERO + INSIGNIAS
══════════════════════════════════════════════════════════ */
const _renderHero = () => {
  const list = getAll();
  const xp   = getXP(list);
  const niv  = getNivel(xp);
  const next = NIVELES.find(n => n.min > xp) || niv;
  const pct  = niv.min === niv.max ? 100 : Math.min(100, Math.round((xp - niv.min) / (next.min - niv.min) * 100));
  const dest = list.filter(x=>x.destacado).length;

  /* Hero */
  $('#log_hero').css('--hero_c', niv.color);
  $('#log_hero_avatar').css('background', `radial-gradient(circle, ${niv.color}33, ${niv.color}11)`);
  $('#log_hero_icon').attr('class', `fas ${niv.icon}`).css('color', niv.color);
  $('#log_hero_nivel').text(`Nivel: ${niv.label}`).css('color', niv.color);
  $('#log_hero_badge').html(`${niv.badge} <strong>${xp} XP</strong> · siguiente: ${next.label} (${next.min} XP)`);
  $('#log_xp_fill').css({width:`${pct}%`, background: niv.color});
  $('#log_xp_txt').text(`${xp} XP`);
  $('#log_n_total').text(list.length);
  $('#log_n_dest').text(dest);

  /* Insignias */
  const ganadas = INSIGNIAS.filter(ins => ins.cond(list, xp));
  $('#log_n_insig').text(ganadas.length);
  const $bar = $('#log_insignias_bar').empty();
  if (!ganadas.length) { $bar.html(`<div class="log_insig_empty"><i class="fas fa-lock"></i><span>Sigue logrando para desbloquear insignias</span></div>`); return; }
  ganadas.forEach(ins => {
    $bar.append(`<div class="log_insig_pill" style="--ic:${ins.color}" ${wiTip(ins.label)}><i class="fas ${ins.icon}"></i><span>${ins.label}</span></div>`);
  });
};

/* ══════════════════════════════════════════════════════════
   RENDER CONTENT
══════════════════════════════════════════════════════════ */
const _renderContent = () => {
  const list = _filtrados();
  const $c   = $('#log_content').empty();

  /* Vista class */
  $c.attr('class', `log_content log_${_vista}`);

  if (!list.length) {
    $c.html(`<div class="log_empty">
      <i class="fas fa-trophy"></i>
      <h3>Sin logros aún</h3>
      <p>Cada gran hazaña empieza con el primer paso. ¡Registra tu primer logro!</p>
      <button class="log_btn_save" id="log_empty_nuevo"><i class="fas fa-plus"></i> Registrar logro</button>
    </div>`);
    return;
  }

  if (_vista === 'timeline') {
    _renderTimeline(list, $c);
    return;
  }

  list.forEach(item => {
    const cat   = CATEGORIAS[item.categoria]||CATEGORIAS.otro;
    const color = item.color||cat.color;
    const xpItem = (XP_CAT[item.categoria]||10) + (item.destacado?10:0);

    $c.append(`
    <div class="log_card${item.destacado?' log_card_dest':''}" data-id="${item._fsId}" style="--lc:${color}">
      ${item.destacado?'<div class="log_card_dest_ribbon"><i class="fas fa-star"></i></div>':''}
      <div class="log_card_header">
        <div class="log_card_ico" style="background:${color}">
          <i class="fas ${cat.icon}"></i>
        </div>
        <div class="log_card_head_info">
          <div class="log_card_titulo">${item.titulo}</div>
          <div class="log_card_meta">
            <span class="log_card_cat" style="--cc:${cat.color}"><i class="fas ${cat.icon}"></i>${cat.label}</span>
            <span class="log_card_xp" style="color:${color}">+${xpItem} XP</span>
          </div>
        </div>
        <button class="log_card_opts" data-id="${item._fsId}" ${wiTip('Eliminar')}><i class="fas fa-ellipsis-v"></i></button>
      </div>
      ${item.descripcion?`<p class="log_card_desc">${item.descripcion}</p>`:''}
      <div class="log_card_footer">
        <span class="log_card_fecha"><i class="fas fa-calendar"></i>${fmtCorto(item.fecha||hoy())} <em>${fmtRel(item.fecha||hoy())}</em></span>
        <button class="log_card_edit" data-id="${item._fsId}" ${wiTip('Editar')}><i class="fas fa-pen"></i></button>
      </div>
    </div>`);
  });
};

/* ── Timeline ── */
const _renderTimeline = (list, $c) => {
  const porMes = {};
  list.forEach(item => {
    const key = (item.fecha||hoy()).slice(0,7);
    if (!porMes[key]) porMes[key] = [];
    porMes[key].push(item);
  });

  const $tl = $('<div class="log_timeline"></div>').appendTo($c);

  Object.entries(porMes).sort((a,b)=>b[0].localeCompare(a[0])).forEach(([mes, items]) => {
    const [y,m] = mes.split('-');
    const nombreMes = new Date(y, m-1, 1).toLocaleDateString('es-PE',{month:'long',year:'numeric'});
    $tl.append(`<div class="log_tl_mes_lbl"><i class="fas fa-calendar-alt"></i> ${nombreMes} <span>${items.length} logro${items.length>1?'s':''}</span></div>`);

    items.forEach(item => {
      const cat   = CATEGORIAS[item.categoria]||CATEGORIAS.otro;
      const color = item.color||cat.color;
      const xpItem = (XP_CAT[item.categoria]||10) + (item.destacado?10:0);
      $tl.append(`
      <div class="log_tl_item${item.destacado?' log_tl_dest':''}" data-id="${item._fsId}" style="--lc:${color}">
        <div class="log_tl_dot" style="background:${color}"><i class="fas ${item.destacado?'fa-star':cat.icon}"></i></div>
        <div class="log_tl_body">
          <div class="log_tl_titulo">${item.titulo}</div>
          <div class="log_tl_meta">
            <span class="log_tl_cat" style="--cc:${cat.color}"><i class="fas ${cat.icon}"></i>${cat.label}</span>
            <span class="log_tl_xp" style="color:${color}">+${xpItem} XP</span>
            <span class="log_tl_fecha"><i class="fas fa-clock"></i>${fmtRel(item.fecha||hoy())}</span>
          </div>
          ${item.descripcion?`<p class="log_tl_desc">${item.descripcion}</p>`:''}
        </div>
        <div class="log_tl_actions">
          <button class="log_card_edit" data-id="${item._fsId}" ${wiTip('Editar')}><i class="fas fa-pen"></i></button>
          <button class="log_card_opts" data-id="${item._fsId}" ${wiTip('Eliminar')}><i class="fas fa-times"></i></button>
        </div>
      </div>`);
    });
  });
};

/* ══════════════════════════════════════════════════════════
   MODAL HELPERS
══════════════════════════════════════════════════════════ */
const _selColor  = c => { $('#l_colores .log_color_opt').removeClass('active'); $(`#l_colores .log_color_opt[data-color="${c}"]`).addClass('active'); };
const _getColor  = () => $('#l_colores .log_color_opt.active').data('color')||COLORES[0];

const _heroColor = (color, icon) => {
  $('#log_m_hero').css('background', `linear-gradient(135deg,${color}dd,${color}88)`);
  $('#log_m_ico').css('background', color).html(`<i class="fas ${icon}"></i>`);
};

const _setDestacado = val => {
  $('#l_destacado').html(`<i class="fas ${val?'fa-toggle-on':'fa-toggle-off'}"></i>`);
  $('#l_destacado_row').toggleClass('log_dest_on', !!val);
  $('#l_destacado').data('val', val?1:0);
};

const _getDestacado = () => !!$('#l_destacado').data('val');

const _renderSugerencias = fechaActual => {
  const sugs = getSugerencias();
  $('#log_sugerencias').html(
    sugs.map(s => `
      <button type="button" class="log_sug_btn${s.fecha===fechaActual?' active':''}"
        data-fecha="${s.fecha}" style="--sc:${s.color}" ${wiTip(fmtCorto(s.fecha))}>
        <i class="fas ${s.icon}"></i><span>${s.label}</span>
      </button>`).join('')
  );
};

const _updateXPBadge = () => {
  const cat = $('#l_cat').val()||'otro';
  const dest = _getDestacado();
  const xp = (XP_CAT[cat]||10) + (dest?10:0);
  $('#log_m_xp').text(`+${xp} XP`);
};

const _openModal = (d={}) => {
  _edit = d._fsId ? d : null;
  const cat   = d.categoria||'personal';
  const color = d.color||CATEGORIAS[cat]?.color||COLORES[0];
  const fecha = d.fecha||hoy();

  $('#l_titulo').val(d.titulo||'');
  $('#l_desc').val(d.descripcion||'');
  $('#l_fecha').val(fecha);
  $('#l_cat').val(cat);
  _selColor(color);
  _setDestacado(d.destacado||false);
  _heroColor(color, CATEGORIAS[cat]?.icon||'fa-trophy');
  _renderSugerencias(fecha);
  _updateXPBadge();

  $('#log_m_tit').text(_edit?'Editar Logro':'Nuevo Logro');
  $('#log_m_sub').text(_edit?'Modifica tu logro':'Registra tu éxito');
  $('#l_eliminar').toggleClass('dpn', !_edit);

  abrirModal('modal_logro');
  setTimeout(()=>$('#l_titulo').focus(),30);
};

const _guardar = () => {
  const titulo = $('#l_titulo').val().trim();
  if (!titulo) return Notificacion('Título requerido','warning');
  const fecha  = $('#l_fecha').val();
  if (!fecha)  return Notificacion('Fecha requerida','warning');
  wiSpin('#l_guardar',true,'Guardar');
  const cat = $('#l_cat').val();
  _upsert({
    ...(_edit||{}),
    titulo,
    descripcion: $('#l_desc').val().trim(),
    fecha,
    categoria:   cat,
    color:       _getColor(),
    destacado:   _getDestacado(),
    creado:      _edit?.creado||new Date().toISOString(),
  });
  cerrarModal('modal_logro');
  _renderHero();
  _renderContent();
  wiSpin('#l_guardar',false,'Guardar');
  const xp = (XP_CAT[cat]||10) + (_getDestacado()?10:0);
  Notificacion(_edit?`Logro actualizado ✓`:`🏆 +${xp} XP · ¡Logro registrado!`,'success');
};

const _openConfirm = item => {
  $('#log_confirm_nombre').text(item.titulo||'Sin título');
  _confirmCb = () => {
    _delete(item);
    cerrarModal('modal_log_confirm');
    _renderHero();
    _renderContent();
    Notificacion('Logro eliminado ✓','success');
  };
  abrirModal('modal_log_confirm');
};

/* ══════════════════════════════════════════════════════════
   BIND
══════════════════════════════════════════════════════════ */
const _bind = () => {
  $(document).off('.log');
  const $d = $(document);

  $d
    .on('click.log','#log_nuevo,#log_empty_nuevo', ()=>_openModal())

    .on('click.log','#log_refresh', async ()=>{
      wiSpin('#log_refresh',true,'');
      localStorage.removeItem(CACHE);
      await _cargar(true);
      _renderHero();
      _renderContent();
      wiSpin('#log_refresh',false,'');
      Notificacion('Logros actualizados ✓','success');
    })

    /* filtros */
    .on('click.log','.log_fil', function(){
      _filtro = $(this).data('fil');
      $('.log_fil').removeClass('active');
      $(this).addClass('active');
      _renderContent();
    })

    /* búsqueda */
    .on('input.log','#log_buscar', function(){ _busq=$(this).val(); _renderContent(); })

    /* vista */
    .on('click.log','.log_vista_btn', function(){
      _vista=$(this).data('vista');
      $('.log_vista_btn').removeClass('active');
      $(this).addClass('active');
      _renderContent();
    })

    /* click card → edit */
    .on('click.log','.log_card', function(e){
      if ($(e.target).closest('.log_card_opts,.log_card_edit').length) return;
      const item = getAll().find(x=>x._fsId===$(this).data('id'));
      if (item) _openModal(item);
    })
    .on('click.log','.log_card_edit', function(e){
      e.stopPropagation();
      const item = getAll().find(x=>x._fsId===$(this).data('id'));
      if (item) _openModal(item);
    })
    .on('click.log','.log_card_opts', function(e){
      e.stopPropagation();
      const item = getAll().find(x=>x._fsId===$(this).data('id'));
      if (item) _openConfirm(item);
    })

    /* timeline */
    .on('click.log','.log_tl_item', function(e){
      if ($(e.target).closest('.log_card_edit,.log_card_opts').length) return;
      const item = getAll().find(x=>x._fsId===$(this).data('id'));
      if (item) _openModal(item);
    })

    /* sugerencias fecha */
    .on('click.log','.log_sug_btn', function(){
      const f = $(this).data('fecha');
      $('#l_fecha').val(f);
      _renderSugerencias(f);
      $('#log_m_sub').text(`Logrado: ${fmtCorto(f)}`);
    })
    .on('change.log','#l_fecha', function(){
      _renderSugerencias($(this).val());
    })

    /* categoría → hero + xp */
    .on('change.log','#l_cat', function(){
      const cat = $(this).val();
      _heroColor(_getColor(), CATEGORIAS[cat]?.icon||'fa-trophy');
      _updateXPBadge();
    })

    /* color */
    .on('click.log','#l_colores .log_color_opt', function(){
      _selColor($(this).data('color'));
      _heroColor($(this).data('color'), CATEGORIAS[$('#l_cat').val()]?.icon||'fa-trophy');
    })

    /* destacado toggle */
    .on('click.log','#l_destacado', function(){
      _setDestacado(!_getDestacado());
      _updateXPBadge();
    })

    /* modal */
    .on('click.log','#l_cancelar',  ()=>cerrarModal('modal_logro'))
    .on('click.log','#l_guardar',   _guardar)
    .on('keydown.log','#l_titulo',  e=>{ if(e.key==='Enter') _guardar(); })
    .on('click.log','#l_eliminar',  ()=>{ if(_edit){ cerrarModal('modal_logro'); _openConfirm(_edit); } })

    /* confirm */
    .on('click.log','#log_conf_no', ()=>cerrarModal('modal_log_confirm'))
    .on('click.log','#log_conf_si', ()=>_confirmCb?.());
};

/* ══════════════════════════════════════════════════════════
   EXPORT
══════════════════════════════════════════════════════════ */
export const init = async () => {
  await _cargar();
  _renderHero();
  _renderContent();
  _bind();
  wiAuth(_cargar, _renderContent);
  console.log('🏆 Logros v1.0 OK');
};

export const cleanup = () => {
  $(document).off('.log');
  console.log('🧹 Logros limpiado');
};