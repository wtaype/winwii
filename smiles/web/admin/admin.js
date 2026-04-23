// ════════════════════════════════════════════════════════════════════
// admin.js — TypingWii · Plataforma Master
// Jesús es mi Señor 🙏
// ════════════════════════════════════════════════════════════════════
import './admin.css';
import $ from 'jquery';
import { db } from '../firebase.js';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { savels, getls, Saludar, Notificacion } from '../../widev.js';
import { app } from '../../wii.js';

const wi = () => getls('wiSmile');

// ── CACHE KEYS ────────────────────────────────────────────────────────────────
const K_TOT = 'amUsersTotal';
const K_PRO = 'amUsersPro';
const K_ORG = 'amOrgsTotal';
const K_LES = 'amLessonsTotal';

// ── RENDER ────────────────────────────────────────────────────────────────────
export const render = () => {
  const u = wi();
  if (!u || u.rol !== 'admin') return `<div class="am_page"><div class="am_empty"><i class="fas fa-ban"></i> Acceso denegado.</div></div>`;

  return `
  <div class="am_page">
    
    <!-- ══ COMPACT HERO ══ -->
    <div class="am_hero">
      <div class="am_hero_left">
        <div class="am_hero_icon"><i class="fas fa-globe-americas"></i></div>
        <div class="am_hero_txt">
          <div class="am_badge"><i class="fas fa-chart-line"></i> Dashboard Global</div>
          <h1 class="am_hero_title">Centro de Control</h1>
          <p class="am_hero_sub">Administración maestra de la infraestructura ${app}.</p>
        </div>
      </div>
      <div>
        <button class="am_btn_sync" id="am_btn_refresh">
          <i class="fas fa-sync-alt"></i> Sincronizar Data
        </button>
      </div>
    </div>

    <!-- ══ MASTER KPIs ══ -->
    <div class="am_grid_4">
      <div class="am_kpi" style="--c:#38bdf8">
        <div class="am_kpi_head">
          <div class="am_ki_ico"><i class="fas fa-users"></i></div>
          <span class="am_ki_label">Usuarios</span>
        </div>
        <div class="am_ki_val" id="am_n_total">—</div>
        <div class="am_ki_trend"><i class="fas fa-arrow-up"></i> Cuentas totales</div>
      </div>

      <div class="am_kpi" style="--c:#8b5cf6">
        <div class="am_kpi_head">
          <div class="am_ki_ico"><i class="fas fa-star"></i></div>
          <span class="am_ki_label">Suscripciones</span>
        </div>
        <div class="am_ki_val" id="am_n_pro">—</div>
        <div class="am_ki_trend"><i class="fas fa-check-circle"></i> Gestores / Empresas</div>
      </div>

      <div class="am_kpi" style="--c:#f59e0b">
        <div class="am_kpi_head">
          <div class="am_ki_ico"><i class="fas fa-building"></i></div>
          <span class="am_ki_label">Empresas B2B</span>
        </div>
        <div class="am_ki_val" id="am_n_org">—</div>
        <div class="am_ki_trend"><i class="fas fa-briefcase"></i> Organizaciones activas</div>
      </div>

      <div class="am_kpi" style="--c:#10b981">
        <div class="am_kpi_head">
          <div class="am_ki_ico"><i class="fas fa-book-open"></i></div>
          <span class="am_ki_label">Lecciones</span>
        </div>
        <div class="am_ki_val" id="am_n_les">—</div>
        <div class="am_ki_trend"><i class="fas fa-layer-group"></i> Nivel base de la app</div>
      </div>
    </div>

    <!-- ══ ACCIONES MAESTRAS ══ -->
    <div class="am_sec_header">
      <i class="fas fa-cogs"></i>
      <h2 class="am_sec_h2">Módulos Administrativos</h2>
    </div>

    <div class="am_actions_grid">
      <!-- Módulo Usuarios -->
      <a href="/usuarios" class="am_act_card nv_item" data-page="usuarios">
        <div class="am_act_ico" style="--c:#38bdf8"><i class="fas fa-users-cog"></i></div>
        <div class="am_act_info">
          <strong>Usuarios Globales</strong>
          <span>Moderación y perfiles de base de datos</span>
        </div>
      </a>

      <!-- Módulo Permisos -->
      <a href="/permisos" class="am_act_card nv_item" data-page="permisos">
        <div class="am_act_ico" style="--c:#8b5cf6"><i class="fas fa-user-shield"></i></div>
        <div class="am_act_info">
          <strong>Permisos y Roles</strong>
          <span>Asignación de privilegios VIP</span>
        </div>
      </a>

      <!-- Módulo Sistema -->
      <a href="/sistema" class="am_act_card nv_item" data-page="sistema">
        <div class="am_act_ico" style="--c:#10b981"><i class="fas fa-database"></i></div>
        <div class="am_act_info">
          <strong>Sistema y Data</strong>
          <span>Mantenimiento y comunicados</span>
        </div>
      </a>
    </div>

  </div>`;
};

// ── INIT ──────────────────────────────────────────────────────────────────────
export const init = async () => {
  const u = wi();
  if (!u || u.rol !== 'admin') return;

  $(document).off('.am');
  
  _cargarLocal();
  _cargarStats(); // Cargar silente

  $(document).on('click.am', '#am_btn_refresh', function () {
    const $i = $(this).find('i').addClass('fa-spin');
    _cargarStats(true).then(() => {
      setTimeout(() => $i.removeClass('fa-spin'), 500);
    });
  });
};

export const cleanup = () => {
  $(document).off('.am');
};

// ── LÓGICA DE DATOS ───────────────────────────────────────────────────────────
function _cargarLocal() {
  $('#am_n_total').text(getls(K_TOT) || '—');
  $('#am_n_pro').text(getls(K_PRO) || '—');
  $('#am_n_org').text(getls(K_ORG) || '—');
  $('#am_n_les').text(getls(K_LES) || '45');
}

async function _cargarStats(forzar = false) {
  try {
    const colSm = collection(db, 'smiles');

    // Total Usuarios
    if (forzar || !getls(K_TOT)) {
      const sTot = await getCountFromServer(colSm);
      const val = sTot.data().count;
      savels(K_TOT, val);
      $('#am_n_total').text(val);
    }

    // Suscripciones / VIPs (Gestores, Empresas, Admins)
    if (forzar || !getls(K_PRO)) {
      const qPro = query(colSm, where('rol', 'in', ['gestor', 'empresa', 'admin']));
      const sPro = await getCountFromServer(qPro);
      const val = sPro.data().count;
      savels(K_PRO, val);
      $('#am_n_pro').text(val);
    }

    // Empresas B2B
    if (forzar || !getls(K_ORG)) {
      const qOrg = query(colSm, where('rol', '==', 'empresa'));
      const sOrg = await getCountFromServer(qOrg);
      const val = sOrg.data().count;
      savels(K_ORG, val);
      $('#am_n_org').text(val);
    }
    
    if (forzar) Notificacion('Estadísticas sincronizadas', 'success');

  } catch (err) {
    console.error('[Admin] Error cargando stats:', err);
    if (forzar) Notificacion('Error sincronizando', 'error');
  }
}
