// ════════════════════════════════════════════════════════════════════
// empresa.js — TypingWii · Dashboard Principal de Empresa
// Jesús es mi Señor 🙏
// ════════════════════════════════════════════════════════════════════
import './empresa.css';
import $ from 'jquery';
import { db } from '../firebase.js';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import {
  getls, savels, Saludar, fechaHoy, NombreApellido, avatar, Capit, formatearFechaHora
} from '../../widev.js';
import { app } from '../../wii.js';

const wi = () => getls('wiSmile');
const K_EMP = 'epTotalEmpleados';
const K_EQP = 'epTotalEquipos';
const K_MET = 'epMetricas';
const K_FED = 'epFeed';

// ── RENDER ────────────────────────────────────────────────────────────────────
export const render = async () => {
  const u = wi();
  if (!u) return `<div class="epd_page"><div class="epd_empty"><i class="fas fa-lock"></i><p>Sin sesión activa.</p></div></div>`;

  const nombre = NombreApellido(u.nombres || u.nombre || 'Administrador');
  const av     = avatar(u.nombres || u.nombre || '');
  const foto   = u.foto || null;
  const org    = Capit(u.empresa || app);

  // Caché instantáneo
  const totEmp = getls(K_EMP) ?? '—';
  const totEqp = getls(K_EQP) ?? '—';
  const metr   = getls(K_MET) || { wpm: '—', cert: '—' };

  const ACCESOS = [
    { page: 'empleados',    ico: 'fa-id-badge',          color: '#38bdf8', tit: 'Colaboradores', sub: 'Gestión de nómina' },
    { page: 'equipos',      ico: 'fa-users-gear',        color: '#8b5cf6', tit: 'Departamentos', sub: 'Organización de áreas' },
    { page: 'reportes',     ico: 'fa-chart-pie',         color: '#f59e0b', tit: 'Analítica',     sub: 'Métricas y estadísticas' },
    { page: 'certificados', ico: 'fa-certificate',       color: '#10b981', tit: 'Certificados',  sub: 'Diplomas oficiales' },
    { page: 'mensajes',     ico: 'fa-envelope-open-text',color: '#ec4899', tit: 'Comunicados',   sub: 'Avisos internos' },
    { page: 'perfil',       ico: 'fa-building-user',     color: '#64748b', tit: 'Perfil',        sub: 'Configuración corporativa' }
  ];

  return `
  <div class="epd_page">

    <!-- HERO PRO -->
    <div class="epd_hero">
      <div class="epd_hero_left">
        <div class="epd_avatar_wrap">
          <div class="epd_avatar_glow"></div>
          <div class="epd_avatar">
            ${foto ? `<img src="${foto}" alt="${nombre}" onerror="this.parentElement.innerHTML='${av}'">` : av}
          </div>
        </div>
        <div class="epd_hero_txt">
          <p class="epd_saludo">${Saludar()}</p>
          <h1 class="epd_nombre">${nombre.split(' ')[0]}</h1>
          <div class="epd_tags">
            <span class="epd_tag"><i class="fas fa-crown"></i> Admin. Corporativo</span>
            <span class="epd_tag"><i class="fas fa-building"></i> ${org}</span>
          </div>
        </div>
      </div>
      <div class="epd_hero_right">
        <div class="epd_date"><i class="fas fa-calendar-alt"></i> ${fechaHoy()}</div>
      </div>
    </div>

    <!-- KPI GRID -->
    <div class="epd_kpi_grid">
      <div class="epd_kpi_card" style="--kc:#38bdf8">
        <div class="epd_kpi_icon"><i class="fas fa-user-tie"></i></div>
        <div class="epd_kpi_val" id="epd_k_emp">${totEmp}</div>
        <div class="epd_kpi_lbl">Colaboradores Totales</div>
      </div>
      <div class="epd_kpi_card" style="--kc:#8b5cf6">
        <div class="epd_kpi_icon"><i class="fas fa-sitemap"></i></div>
        <div class="epd_kpi_val" id="epd_k_eqp">${totEqp}</div>
        <div class="epd_kpi_lbl">Departamentos Activos</div>
      </div>
      <div class="epd_kpi_card" style="--kc:#f59e0b">
        <div class="epd_kpi_icon"><i class="fas fa-bolt"></i></div>
        <div class="epd_kpi_val" id="epd_k_wpm">${metr.wpm}</div>
        <div class="epd_kpi_lbl">WPM Corporativo</div>
      </div>
      <div class="epd_kpi_card" style="--kc:#10b981">
        <div class="epd_kpi_icon"><i class="fas fa-award"></i></div>
        <div class="epd_kpi_val" id="epd_k_cert">${metr.cert}</div>
        <div class="epd_kpi_lbl">Personal Certificado</div>
      </div>
    </div>

    <!-- ACCESOS GRID -->
    <h2 class="epd_sec_title"><i class="fas fa-layer-group"></i> Módulos Corporativos</h2>
    <div class="epd_acc_grid">
      ${ACCESOS.map(a => `
        <a href="/${a.page}" class="epd_acc_card nv_item" data-page="${a.page}" style="--ac:${a.color}">
          <div class="epd_acc_icon"><i class="fas ${a.ico}"></i></div>
          <div class="epd_acc_info">
            <div class="epd_acc_tit">${a.tit}</div>
            <div class="epd_acc_sub">${a.sub}</div>
          </div>
          <i class="fas fa-arrow-right epd_acc_arr"></i>
        </a>
      `).join('')}
    </div>

    <!-- FEED RECIENTE -->
    <div class="epd_feed_wrap">
      <div class="epd_feed_hdr">
        <h2 class="epd_feed_title"><i class="fas fa-satellite-dish"></i> Actividad Reciente</h2>
        <button class="epd_feed_btn" id="epd_btn_sync"><i class="fas fa-sync-alt"></i> Actualizar</button>
      </div>
      <div id="epd_feed_body">
        <div class="epd_empty"><i class="fas fa-spinner fa-spin"></i><p>Sincronizando entrenamientos...</p></div>
      </div>
    </div>

  </div>`;
};

// ── INIT ──────────────────────────────────────────────────────────────────────
export const init = async () => {
  const u = wi();
  if (!u) return;

  $(document).off('.epd');

  await _cargarTodo(u);

  // Navegación
  $(document).on('click.epd', '.nv_item', function (e) {
    e.preventDefault();
    const page = $(this).data('page');
    if (!page) return;
    import('../../rutas/ruta.js').then(({ rutas }) => rutas.navigate(`/${page}`));
  });

  // Botón actualizar feed manual
  $(document).on('click.epd', '#epd_btn_sync', async function () {
    const $i = $(this).find('i').addClass('fa-spin');
    [K_EMP, K_EQP, K_MET, K_FED].forEach(k => localStorage.removeItem(k));
    await _cargarTodo(u, true);
    setTimeout(() => $i.removeClass('fa-spin'), 500);
  });
};

export const cleanup = () => {
  $(document).off('.epd');
};

// ── LÓGICA DE DATOS ───────────────────────────────────────────────────────────
async function _cargarTodo(u, forzar = false) {
  await Promise.all([
    _cargarKPIs(u, forzar),
    _cargarFeed(u, forzar),
  ]);
}

async function _cargarKPIs(u, forzar) {
  if (!forzar && getls(K_EMP) != null) return; // Si hay caché y no fuerza, ya pintado
  
  try {
    // 1. Empleados / Lecciones
    let snapEm = await getDocs(query(collection(db, 'lecciones'), where('empresa_id', '==', u.usuario)));
    if (snapEm.empty) snapEm = await getDocs(query(collection(db, 'lecciones'), where('gestor_id', '==', u.usuario)));
    
    const emps = snapEm.docs.map(d => d.data());
    const totEmp = emps.length;
    
    // Métricas
    const wpms = emps.map(e => e.wpmMax || 0);
    const avgWpm = totEmp > 0 ? Math.round(wpms.reduce((a,b)=>a+b,0) / totEmp) : 0;
    const certs = emps.filter(e => (e.completadas?.length || 0) >= 45 && (e.wpmMax || 0) >= 80).length;

    // 2. Departamentos
    let snapEq = await getDocs(query(collection(db, 'clases'), where('empresa_id', '==', u.usuario)));
    if (snapEq.empty) snapEq = await getDocs(query(collection(db, 'clases'), where('gestor_id', '==', u.usuario)));
    const totEqp = snapEq.size;

    // Guardar Caché
    savels(K_EMP, totEmp, 2);
    savels(K_EQP, totEqp, 2);
    savels(K_MET, { wpm: avgWpm, cert: certs }, 2);

    // Actualizar DOM
    $('#epd_k_emp').text(totEmp);
    $('#epd_k_eqp').text(totEqp);
    $('#epd_k_wpm').text(avgWpm || '—');
    $('#epd_k_cert').text(certs);

  } catch (e) { console.error('[empresa] KPI Error', e); }
}

async function _cargarFeed(u, forzar) {
  if (!forzar) {
    const cached = getls(K_FED);
    if (cached?.length) { _renderFeed(cached); return; }
  }

  try {
    // Ultimas prácticas, intentando orden
    let snap = await getDocs(query(collection(db, 'lecciones'), where('empresa_id', '==', u.usuario), orderBy('ultPractica', 'desc'), limit(10)));
    if (snap.empty) snap = await getDocs(query(collection(db, 'lecciones'), where('gestor_id', '==', u.usuario), orderBy('ultPractica', 'desc'), limit(10)));
    
    const items = snap.docs.map(d => ({ usuario: d.id, ...d.data() }));
    savels(K_FED, items, 1/12); // Cachea 5 mins
    _renderFeed(items);
  } catch (err) {
    // Fallback sin index
    try {
      let fallback = await getDocs(query(collection(db, 'lecciones'), where('empresa_id', '==', u.usuario), limit(10)));
      if (fallback.empty) fallback = await getDocs(query(collection(db, 'lecciones'), where('gestor_id', '==', u.usuario), limit(10)));
      
      const items = fallback.docs.map(d => ({ usuario: d.id, ...d.data() }));
      _renderFeed(items);
    } catch { _renderFeed([]); }
  }
}

function _renderFeed(items) {
  if (!items.length) {
    $('#epd_feed_body').html(`
      <div class="epd_empty">
        <i class="fas fa-ghost"></i>
        <p>No hay actividad registrada aún.</p>
      </div>`);
    return;
  }

  const html = items.map(e => {
    const nom  = e.nombre || e.usuario || '—';
    const ini  = avatar(nom);
    const dep  = e.equipo_id || e.clase_id || e.claseId || 'General';
    const wpm  = e.wpmMax || 0;
    const prec = e.precision || 0;
    const fec  = e.ultPractica?.toDate ? formatearFechaHora(e.ultPractica) : 'Reciente';

    return `
      <div class="epd_feed_item">
        <div class="epd_fi_av">${ini}</div>
        <div class="epd_fi_main">
          <div class="epd_fi_head">
            <span class="epd_fi_nom">${nom}</span>
            <span class="epd_fi_dep"><i class="fas fa-building"></i> ${dep}</span>
          </div>
          <div class="epd_fi_metrics">
            <div class="epd_fi_met w"><i class="fas fa-bolt"></i> ${wpm} WPM</div>
            <div class="epd_fi_met p"><i class="fas fa-bullseye"></i> ${prec}%</div>
          </div>
        </div>
        <div class="epd_fi_time">${fec}</div>
      </div>`;
  }).join('');

  $('#epd_feed_body').html(`<div class="epd_feed_list">${html}</div>`);
}
