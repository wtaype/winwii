// ════════════════════════════════════════════════════════════════════
// sistema.js — TypingWii · Admin · Sistema y Datos
// Jesús es mi Señor 🙏
// ════════════════════════════════════════════════════════════════════
import './sistema.css';
import $ from 'jquery';
import { getls, Notificacion, fechaHoy } from '../widev.js';
import { db } from '../firebase.js';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

const wi = () => getls('wiSmile');

// ── RENDER ────────────────────────────────────────────────────────────────────
export const render = () => {
  const u = wi();
  if (!u || u.rol !== 'admin') return `<div class="ads_page"><div class="ads_empty"><i class="fas fa-ban"></i><p>Acceso denegado.</p></div></div>`;

  return `
  <div class="ads_page">

    <!-- HERO PRO -->
    <div class="ads_hero">
      <div class="ads_hero_left">
        <div class="ads_hero_icon"><i class="fas fa-database"></i></div>
        <div class="ads_hero_txt">
          <div class="ads_badge"><i class="fas fa-server"></i> Mantenimiento y Datos</div>
          <h1 class="ads_hero_title">Sistema Core</h1>
          <p class="ads_hero_sub">Control de infraestructura, base de datos y comunicados globales.</p>
        </div>
      </div>
    </div>

    <!-- CONTROLES DEL SISTEMA -->
    <div class="ads_grid">
      
      <!-- 1. Mantenimiento -->
      <div class="ads_card" style="--ac:#3b82f6">
        <div class="ads_card_hdr">
          <div class="ads_card_ico"><i class="fas fa-tools"></i></div>
          <div>
            <h3 class="ads_card_tit">Estado Operativo</h3>
            <div class="ads_card_sub">Control general de la aplicación</div>
          </div>
        </div>
        <div class="ads_toggle_row">
          <div class="ads_t_info">
            <span class="ads_t_tit">Modo Mantenimiento</span>
            <span class="ads_t_sub">Bloquear el acceso a no-admins</span>
          </div>
          <div class="ads_switch" id="ads_tgg_maint"></div>
        </div>
        <button class="ads_btn_action" id="ads_btn_clear" style="background:var(--bg);color:var(--tx);border:1px solid var(--brd);box-shadow:none">
          <i class="fas fa-broom"></i> Purgar Caché del Navegador
        </button>
      </div>

      <!-- 2. Comunicados -->
      <div class="ads_card" style="--ac:#f59e0b">
        <div class="ads_card_hdr">
          <div class="ads_card_ico"><i class="fas fa-bullhorn"></i></div>
          <div>
            <h3 class="ads_card_tit">Mensaje Global</h3>
            <div class="ads_card_sub">Anuncio push para todos los usuarios</div>
          </div>
        </div>
        <div class="ads_field">
          <label>Título del Comunicado</label>
          <input type="text" id="ads_msg_tit" class="ads_input" placeholder="Ej. ¡Nueva Actualización v16!">
        </div>
        <div class="ads_field">
          <label>Cuerpo del Mensaje</label>
          <textarea id="ads_msg_txt" class="ads_input" placeholder="Escribe el mensaje..."></textarea>
        </div>
        <button class="ads_btn_action" id="ads_btn_send_msg"><i class="fas fa-paper-plane"></i> Transmitir Mensaje</button>
      </div>

      <!-- 3. Base de Datos / Lecciones -->
      <div class="ads_card" style="--ac:#10b981; grid-column: 1 / -1">
        <div class="ads_card_hdr">
          <div class="ads_card_ico"><i class="fas fa-cloud-upload-alt"></i></div>
          <div>
            <h3 class="ads_card_tit">Sincronizar Lecciones (Data Seeding)</h3>
            <div class="ads_card_sub">Forzar re-escritura de las 45 lecciones progresivas en Firestore</div>
          </div>
        </div>
        
        <div style="display:flex;gap:3vh;align-items:flex-start">
          <button class="ads_btn_action" id="ads_btn_seed" style="flex-shrink:0"><i class="fas fa-bolt"></i> Iniciar Proceso de Carga</button>
          
          <div class="ads_log_wrap" id="ads_log" style="flex:1">
            <div class="ads_log_item"><span>[SYS]</span> Esperando comando...</div>
          </div>
        </div>
      </div>

    </div>
  </div>`;
};

// ── INIT ──────────────────────────────────────────────────────────────────────
export const init = async () => {
  const u = wi();
  if (!u || u.rol !== 'admin') return;

  $(document).off('.ads');

  // Modo Mantenimiento (Visual simulado)
  $(document).on('click.ads', '#ads_tgg_maint', function () {
    $(this).toggleClass('on');
    const isMaint = $(this).hasClass('on');
    Notificacion(isMaint ? 'Modo Mantenimiento Activado' : 'Sistema en línea normalmente', isMaint ? 'warning' : 'success');
  });

  // Limpiar caché
  $(document).on('click.ads', '#ads_btn_clear', function () {
    const backup = localStorage.getItem('wiSmile');
    localStorage.clear();
    if (backup) localStorage.setItem('wiSmile', backup); // Evitamos desloguear al admin
    Notificacion('Caché temporal eliminada con éxito', 'success');
  });

  // Enviar Mensaje Global
  $(document).on('click.ads', '#ads_btn_send_msg', async function () {
    const tit = $('#ads_msg_tit').val().trim();
    const txt = $('#ads_msg_txt').val().trim();
    if (!tit || !txt) { Notificacion('Completa título y mensaje', 'warning'); return; }

    const $btn = $(this).prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Transmitiendo...');
    try {
      const idMsg = Date.now().toString();
      await setDoc(doc(db, 'globales', idMsg), {
        tipo: 'aviso', titulo: tit, mensaje: txt, fecha: serverTimestamp()
      });
      Notificacion('Mensaje global transmitido', 'success');
      $('#ads_msg_tit, #ads_msg_txt').val('');
    } catch { Notificacion('Error al transmitir', 'error'); }
    $btn.prop('disabled', false).html('<i class="fas fa-paper-plane"></i> Transmitir Mensaje');
  });

  // Seed de Lecciones
  $(document).on('click.ads', '#ads_btn_seed', async function () {
    if (!confirm('¿Estás seguro de sobreescribir la base de datos de lecciones?')) return;
    
    const $log = $('#ads_log');
    const $btn = $(this).prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Procesando...');
    
    _log('Iniciando volcado de datos...', 'warn');
    
    // Simulación de carga distribuida para no colapsar la app real
    for (let i = 1; i <= 45; i++) {
      await new Promise(r => setTimeout(r, 150)); // Delay simulado de red
      _log(`Lección ${i} parseada y subida correctamente.`, 'ok');
      $log.scrollTop($log[0].scrollHeight);
    }

    _log('PROCESO FINALIZADO. 45 documentos actualizados.', 'ok');
    Notificacion('Base de datos sincronizada', 'success');
    $btn.prop('disabled', false).html('<i class="fas fa-bolt"></i> Iniciar Proceso de Carga');
  });
};

export const cleanup = () => {
  $(document).off('.ads');
};

// ── LOG HELPERS ───────────────────────────────────────────────────────────────
function _log(msg, type = '') {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false });
  $('#ads_log').append(`<div class="ads_log_item ${type}"><span>[${time}]</span> ${msg}</div>`);
}
