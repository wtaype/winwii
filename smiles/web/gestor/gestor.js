// ════════════════════════════════════════════════════════════════════
// gestor.js — TypingWii · Premium Dashboard Gestor
// Jesús es mi Señor 🙏
// ════════════════════════════════════════════════════════════════════
import './gestor.css';
import $ from 'jquery';
import { db } from '../firebase.js';
import {
  collection, query, where, orderBy, limit,
  getDocs, onSnapshot
} from 'firebase/firestore';
import {
  savels, getls,
  Saludar, fechaHoy,
  NombreApellido, avatar, Capit,
  formatearFechaHora
} from '../../widev.js';
import { app } from '../../wii.js';

// ── USUARIO Y CACHE ───────────────────────────────────────────────────────────
const wi = () => getls('wiSmile');
const K_TOTAL  = 'gsTotalAlumnos';
const K_CLASES = 'gsTotalClases';
const K_FEED   = 'gsFeedReciente';
const K_METR   = 'gsMetricas';

const state = { feedSub: null };

// ── RENDER ────────────────────────────────────────────────────────────────────
export const render = async () => {
  const u = wi();
  if (!u) return `
    <div class="gs_page">
      <div class="gs_empty"><i class="fas fa-lock"></i><p>Sin sesión activa.</p></div>
    </div>`;

  const nombre = NombreApellido(u.nombres || u.nombre || 'Instructor');
  const av     = avatar(u.nombres || u.nombre || '');
  const foto   = u.foto || null;

  // Render inicial instantáneo desde caché
  const totalAlumnos = getls(K_TOTAL) ?? '—';
  const totalClases  = getls(K_CLASES) ?? '—';
  const metr         = getls(K_METR) || {};

  const ACCESOS = [
    { page:'misclases',      ico:'fa-chalkboard-teacher', color:'#6366f1', title:'Aulas',          sub:'Crea y gestiona tus clases' },
    { page:'alumnos',        ico:'fa-users',              color:'#0ea5e9', title:'Estudiantes',    sub:'Métricas y asignaciones'    },
    { page:'calificaciones', ico:'fa-chart-bar',          color:'#f59e0b', title:'Rankings',       sub:'Podio de rendimiento'       },
    { page:'buscar',         ico:'fa-search',             color:'#22c55e', title:'Búsqueda',       sub:'Historial detallado'        },
    { page:'mensajes',       ico:'fa-paper-plane',        color:'#ec4899', title:'Notificaciones', sub:'Comunicados oficiales'      },
    { page:'perfil',         ico:'fa-user-shield',        color:'#a855f7', title:'Mi Cuenta',      sub:'Configuración personal'     },
  ];

  return `
  <div class="gs_page">
    <div class="gs_ambient"></div>

    <!-- ══ HERO PREMIUM ══ -->
    <div class="gs_hero">
      <div class="gs_hero_main">
        <div class="gs_av_container">
          <div class="gs_av_glow"></div>
          <div class="gs_av">
            ${foto ? `<img src="${foto}" alt="${nombre}" onerror="this.parentElement.innerHTML='${av}'">` : av}
          </div>
        </div>
        <div class="gs_hero_text">
          <p class="gs_hero_saludo">${Saludar()}</p>
          <h1 class="gs_hero_nombre">${nombre.split(' ')[0]}</h1>
          <div class="gs_hero_tags">
            <span class="gs_tag"><i class="fas fa-crown"></i> Admin. Aula</span>
            <span class="gs_tag"><i class="fas fa-school"></i> ${Capit(u.empresa || app)}</span>
          </div>
        </div>
      </div>
      <div class="gs_hero_right">
        <div class="gs_date"><i class="fas fa-calendar-alt"></i> ${fechaHoy()}</div>
        <div class="gs_rt_toggle" id="gs_btn_rt" title="Monitoreo de prácticas en vivo">
          <div class="gs_rt_dot"></div>
          <span class="gs_rt_txt">En Vivo</span>
        </div>
      </div>
    </div>

    <!-- ══ KPI GRID ══ -->
    <div class="gs_kpi_grid">
      ${[
        { id:'gs_k_alumnos', ico:'fa-user-graduate', col:'#0ea5e9', lbl:'Alumnos Activos', val: totalAlumnos },
        { id:'gs_k_clases',  ico:'fa-layer-group',   col:'#6366f1', lbl:'Aulas Creadas',   val: totalClases  },
        { id:'gs_k_wpm',     ico:'fa-bolt',          col:'#f59e0b', lbl:'Promedio WPM',    val: metr.wpm || '—' },
        { id:'gs_k_cert',    ico:'fa-award',         col:'#22c55e', lbl:'Certificados',    val: metr.cert || 0 },
      ].map(k => `
        <div class="gs_kpi_card" style="--kc:${k.col}">
          <div class="gs_kpi_top">
            <div class="gs_kpi_ico"><i class="fas ${k.ico}"></i></div>
          </div>
          <div class="gs_kpi_val" id="${k.id}">${k.val}</div>
          <div class="gs_kpi_lbl">${k.lbl}</div>
        </div>`).join('')}
    </div>

    <!-- ══ ACCESOS ══ -->
    <div class="gs_sec_hdr">
      <i class="fas fa-grip-horizontal"></i> Herramientas
    </div>
    <div class="gs_access_grid">
      ${ACCESOS.map(a => `
        <a href="/${a.page}" class="gs_ac_card nv_item" data-page="${a.page}" style="--ac:${a.color}">
          <div class="gs_ac_ico"><i class="fas ${a.ico}"></i></div>
          <div class="gs_ac_info">
            <div class="gs_ac_tit">${a.title}</div>
            <div class="gs_ac_sub">${a.sub}</div>
          </div>
          <i class="fas fa-arrow-right gs_ac_arr"></i>
        </a>`).join('')}
    </div>

    <!-- ══ FEED EN VIVO ══ -->
    <div class="gs_sec_hdr" style="margin-top:1.5vh">
      <i class="fas fa-chart-line"></i> Últimas Prácticas
      <div class="gs_feed_tools">
        <span class="gs_badge_count" id="gs_feed_num">—</span>
        <button class="gs_btn_sync" id="gs_refresh" title="Actualizar datos"><i class="fas fa-sync-alt"></i></button>
      </div>
    </div>
    <div class="gs_feed_wrap" id="gs_feed">
      <div class="gs_feed_empty">
        <i class="fas fa-spinner fa-spin" style="font-size:3vh;margin-bottom:1vh"></i>
        <p>Cargando registros...</p>
      </div>
    </div>

  </div>`;
};

// ── INIT ──────────────────────────────────────────────────────────────────────
export const init = async () => {
  const u = wi();
  if (!u) return;

  $(document).off('.gs');

  const rtActivo = getls('gsRealTime') === true;
  if (rtActivo) $('#gs_btn_rt').addClass('active');

  // Cargar datos estáticos/iniciales
  await _cargarTodo(u);
  if (rtActivo) _escucharFeedVivo(u);

  // Toggle tiempo real
  $(document).on('click.gs', '#gs_btn_rt', function () {
    const act = !$(this).hasClass('active');
    $(this).toggleClass('active', act);
    savels('gsRealTime', act, 24 * 365);
    
    if (act) _escucharFeedVivo(u);
    else {
      state.feedSub?.();
      state.feedSub = null;
    }
  });

  // Botón sincronizar manual
  $(document).on('click.gs', '#gs_refresh', async function () {
    const $i = $(this).find('i').addClass('fa-spin');
    [K_TOTAL, K_CLASES, K_FEED, K_METR].forEach(k => localStorage.removeItem(k));
    await _cargarTodo(u, true);
    setTimeout(() => $i.removeClass('fa-spin'), 500);
  });

  // Navegación rápida
  $(document).on('click.gs', '.nv_item', function (e) {
    e.preventDefault();
    const page = $(this).data('page');
    if (!page) return;
    import('../../rutas/ruta.js').then(({ rutas }) => rutas.navigate(`/${page}`));
  });

  // Ver alumno específico
  $(document).on('click.gs', '.gs_fi_btn', function () {
    const usuario = $(this).data('usuario');
    savels('gsBuscarTerm', usuario, 1/60);
    import('../../rutas/ruta.js').then(({ rutas }) => rutas.navigate('/buscar'));
  });
};

export const cleanup = () => {
  state.feedSub?.();
  $(document).off('.gs');
};

// ── LÓGICA DE DATOS ───────────────────────────────────────────────────────────
async function _cargarTodo(u, forzar = false) {
  await Promise.all([
    _cargarKPIs(u, forzar),
    _cargarFeed(u, forzar),
  ]);
}

async function _cargarKPIs(u, forzar = false) {
  if (!forzar) {
    const total  = getls(K_TOTAL);
    const clases = getls(K_CLASES);
    const metr   = getls(K_METR);
    if (total != null)  $('#gs_k_alumnos').text(total);
    if (clases != null) $('#gs_k_clases').text(clases);
    if (metr?.wpm)      $('#gs_k_wpm').text(metr.wpm);
    if (metr?.cert != null) $('#gs_k_cert').text(metr.cert);
    if (total != null && clases != null && metr) return;
  }
  try {
    // Alumnos directos
    let snapAl = await getDocs(query(collection(db, 'lecciones'), where('gestor_id', '==', u.usuario)));
    if (snapAl.empty) snapAl = await getDocs(query(collection(db, 'lecciones'), where('gestorId', '==', u.usuario)));
    
    const alumnos = snapAl.docs.map(d => d.data());
    const total   = alumnos.length;
    const wpmSum  = alumnos.reduce((s, a) => s + (a.wpmMax || 0), 0);
    const wpmAvg  = total > 0 ? Math.round(wpmSum / total) : 0;
    const cert    = alumnos.filter(a => (a.completadas?.length || 0) >= 45 && (a.wpmMax || 0) >= 80).length;
    
    savels(K_TOTAL, total, 2);
    savels(K_METR, { wpm: wpmAvg, cert }, 2);
    
    $('#gs_k_alumnos').text(total);
    $('#gs_k_wpm').text(wpmAvg || '—');
    $('#gs_k_cert').text(cert);

    // Clases
    let snapCl = await getDocs(query(collection(db, 'clases'), where('gestor_id', '==', u.usuario)));
    if (snapCl.empty) snapCl = await getDocs(query(collection(db, 'clases'), where('gestorId', '==', u.usuario)));
    
    savels(K_CLASES, snapCl.size, 2);
    $('#gs_k_clases').text(snapCl.size);
  } catch (err) { console.error('[gestor] Error KPIs', err); }
}

async function _cargarFeed(u, forzar = false) {
  if (!forzar && getls('gsRealTime') === true) return; // Si hay real-time, no cargamos estático

  if (!forzar) {
    const cached = getls(K_FEED);
    if (cached?.length) { _renderFeed(cached); return; }
  }
  try {
    let snap = await getDocs(query(collection(db, 'lecciones'), where('gestor_id', '==', u.usuario), orderBy('ultPractica', 'desc'), limit(15)));
    if (snap.empty) snap = await getDocs(query(collection(db, 'lecciones'), where('gestorId', '==', u.usuario), orderBy('ultPractica', 'desc'), limit(15)));
    
    const items = snap.docs.map(d => ({ usuario: d.id, ...d.data() }));
    savels(K_FEED, items, 1 / 12);
    _renderFeed(items);
  } catch (err) {
    try {
      let fallback = await getDocs(query(collection(db, 'lecciones'), where('gestor_id', '==', u.usuario), limit(15)));
      const items = fallback.docs.map(d => ({ usuario: d.id, ...d.data() }));
      _renderFeed(items);
    } catch { _renderFeed([]); }
  }
}

function _escucharFeedVivo(u) {
  state.feedSub?.();
  // El listener de onSnapshot requiere que el índice exista si usamos orderBy.
  // Por defecto Firestore permite query + filter sin order, limitaremos a los 15 modificados recientemente.
  const q = query(collection(db, 'lecciones'), where('gestor_id', '==', u.usuario), limit(15));
  
  state.feedSub = onSnapshot(q, snap => {
    const items = snap.docs.map(d => ({ usuario: d.id, ...d.data() }));
    // Ordenamos en local por si falla el index de Firestore
    items.sort((a, b) => {
      const ta = a.ultPractica?.toDate ? a.ultPractica.toDate().getTime() : 0;
      const tb = b.ultPractica?.toDate ? b.ultPractica.toDate().getTime() : 0;
      return tb - ta;
    });
    _renderFeed(items);
  });
}

// ── RENDER FEED ───────────────────────────────────────────────────────────────
function _renderFeed(items) {
  $('#gs_feed_num').text(items.length > 0 ? `${items.length} Registros` : '0 Registros');

  if (!items.length) {
    $('#gs_feed').html(`
      <div class="gs_feed_empty">
        <i class="fas fa-ghost"></i>
        <p>No hay actividad registrada aún.<br><small>Tus alumnos aparecerán aquí al iniciar una lección.</small></p>
      </div>`);
    return;
  }

  const html = items.map(al => {
    const ini     = avatar(al.nombre || al.usuario || 'A');
    const wpm     = al.wpmMax    || 0;
    const prec    = al.precision || 0;
    const lecs    = al.completadas?.length || 0;
    const pct     = Math.round((lecs / 45) * 100);
    const clId    = al.clase_id || al.claseId || null;
    const fecha   = al.ultPractica?.toDate ? formatearFechaHora(al.ultPractica) : 'Reciente';

    return `
      <div class="gs_fi">
        <div class="gs_fi_av">${ini}</div>
        <div class="gs_fi_main">
          <div class="gs_fi_head">
            <span class="gs_fi_nom">${al.nombre || al.usuario || '—'}</span>
            ${clId ? `<span class="gs_fi_clase"><i class="fas fa-chalkboard"></i> ${clId}</span>` : ''}
          </div>
          <div class="gs_fi_metrics">
            <div class="gs_fi_metric wpm"><i class="fas fa-bolt"></i> ${wpm} WPM</div>
            <div class="gs_fi_metric prec"><i class="fas fa-bullseye"></i> ${prec}%</div>
            <div class="gs_fi_prog">
              <div class="gs_fi_track"><div class="gs_fi_fill" style="width:${pct}%"></div></div>
              <span>${lecs}/45</span>
            </div>
          </div>
        </div>
        <div class="gs_fi_time">${fecha}</div>
        <button class="gs_fi_btn" data-usuario="${al.usuario}" title="Ver historial completo">
          <i class="fas fa-search"></i>
        </button>
      </div>`;
  }).join('');

  $('#gs_feed').html(`<div class="gs_feed_list">${html}</div>`);
}
