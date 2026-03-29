import './mensajes.css';
import $ from 'jquery';
import { auth, db } from './firebase.js';
import { collection, setDoc, doc, query, where, getDocs, deleteDoc, serverTimestamp, limit } from 'firebase/firestore';
import { Notificacion, wicopy, wiTip, savels, getls, Saludar } from '../widev.js';
import { rutas } from '../rutas/ruta.js';
import { app } from '../wii.js';

// ── Estado ───────────────────────────────────────────────────
let msgs = [], pendiente = null, enviando = false, refreshTimer = null, _onVis = null;
const CACHE = 'wi_mensajes_cache';
const LIMIT = 50;
const wi = () => getls('wiSmile') || {};
const _save = d => { try { localStorage.setItem(CACHE, JSON.stringify(d)); } catch (_) {} };
const _cache = () => { try { return JSON.parse(localStorage.getItem(CACHE) || '[]'); } catch (_) { return []; } };
const _scroll = () => { const el = document.getElementById('wmChat'); el && requestAnimationFrame(() => el.scrollTop = el.scrollHeight); };

// ── Render ───────────────────────────────────────────────────
export const render = () => {
  const u = wi();
  if (!u.email) { location.replace('/'); return ''; }
  const display = u.nombre || u.usuario || u.email || auth.currentUser?.email || '';

  return `
  <div class="wm_container">
    <div class="wm_header">
      <div class="wm_info">
        <img src="/smile.avif" alt="${app}" class="wm_avatar" />
        <div class="wm_text">
          <h1>Mis Mensajes</h1>
          <p>${Saludar()} <strong>${display}</strong></p>
        </div>
      </div>
      <div class="wm_status">
        <span class="wm_dot"></span>
        <span class="wm_dotxt">Conectando...</span>
      </div>
    </div>

    <div class="wm_chat" id="wmChat">${_htmlList(_cache())}</div>

    <div class="wm_input">
      <div class="wm_wrap">
        <textarea id="wmNuevo" placeholder="Escribe un mensaje." rows="1" maxlength="500"></textarea>
        <span class="wm_count" id="wmCount">0/500</span>
      </div>
      <button id="wmEnviar" disabled ${wiTip('Enviar · Enter')}><i class="fas fa-paper-plane"></i></button>
    </div>

    <div class="wm_modal" id="wmEliminar">
      <div class="wm_modal_body">
        <i class="fas fa-trash-alt"></i>
        <h3>¿Eliminar mensaje?</h3>
        <p>Esta acción no se puede deshacer</p>
        <div class="wm_modal_acts">
          <button class="wm_cancel" id="wmCancel">Cancelar</button>
          <button class="wm_confirm" id="wmConfirm">Eliminar</button>
        </div>
      </div>
    </div>
  </div>`;
};

// ── Init ─────────────────────────────────────────────────────
export const init = () => {
  cleanup();

  const u = wi();
  if (!u.email) return rutas.navigate('/');
  const userEmail = u.email || auth.currentUser?.email;

  $(document)
    .on('input.wm', '#wmNuevo', function () {
      $('#wmCount').text(`${$(this).val().length}/500`);
      $('#wmEnviar').prop('disabled', !$(this).val().trim());
      $(this).css('height', 'auto').css('height', Math.min(this.scrollHeight, 150) + 'px');
    })
    .on('keydown.wm', '#wmNuevo', e => { e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), _enviar(userEmail)); })
    .on('click.wm', '#wmEnviar', () => _enviar(userEmail))
    .on('click.wm', '.wm_item', function (e) {
      if ($(e.target).closest('.wm_del').length) return;
      const msg = msgs.find(m => m.id === $(this).data('id'));
      if (!msg) return;
      wicopy(msg.mensaje, this, '¡Copiado! <i class="fas fa-check-circle"></i>');
      $(this).addClass('copied'); setTimeout(() => $(this).removeClass('copied'), 800);
    })
    .on('click.wm', '.wm_del', function (e) { e.stopPropagation(); pendiente = $(this).data('id'); $('#wmEliminar').addClass('show'); })
    .on('click.wm', '#wmCancel, #wmEliminar', e => { $(e.target).is('#wmCancel, #wmEliminar') && ($('#wmEliminar').removeClass('show'), pendiente = null); })
    .on('click.wm', '#wmConfirm', _eliminar);

  // Mostrar cache inmediato, luego sync en background
  _cargar(userEmail, true);

  // Auto-refresh cada 30s solo si tab visible
  refreshTimer = setInterval(() => !document.hidden && _cargar(userEmail, true), 30000);
  _onVis = () => { !document.hidden && _cargar(userEmail, true); };
  document.addEventListener('visibilitychange', _onVis);
  _scroll();
};

// ── Cargar (getDocs = 1 read batch, no listener permanente) ──
const _cargar = async (email, silent = false) => {
  try {
    const q = query(collection(db, 'wiMensajes'), where('email', '==', email), limit(LIMIT));
    const snap = await getDocs(q);
    msgs = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.fecha?.seconds || 0) - (b.fecha?.seconds || 0));
    _save(msgs); $('#wmChat').html(_htmlList(msgs)); _status(true); _scroll();
  } catch (e) {
    console.error('❌', e); _status(false);
    if (!silent) {
      const cache = _cache();
      cache.length ? (msgs = cache, $('#wmChat').html(_htmlList(msgs)), Notificacion('Caché local 📦', 'warning', 2000))
        : $('#wmChat').html(_empty('fa-wifi-slash', 'Sin conexión', 'Verifica tu internet'));
    }
  }
};

// ── Enviar (optimistic UI: aparece al instante, Firestore en background) ──
const _enviar = (email) => {
  if (enviando) return;
  const $ta = $('#wmNuevo'), nota = $ta.val().trim();
  if (!nota) return;
  enviando = true;
  const { usuario = '', nombre = '' } = wi();
  const id = `m${Date.now()}`;

  // UI instantánea
  const fake = { id, mensaje: nota, email, usuario: nombre || usuario || email, fecha: { seconds: Date.now() / 1000 } };
  msgs.push(fake); _save(msgs);
  $('#wmChat').html(_htmlList(msgs)); _scroll();
  $ta.val('').css('height', 'auto').trigger('focus'); $('#wmCount').text('0/500');
  $('#wmEnviar').prop('disabled', true);

  // Background write
  setDoc(doc(db, 'wiMensajes', id), { id, mensaje: nota, email, usuario: nombre || usuario || email, fecha: serverTimestamp() })
    .then(() => { _status(true); })
    .catch(e => { console.error('❌', e); msgs = msgs.filter(m => m.id !== id); _save(msgs); $('#wmChat').html(_htmlList(msgs)); Notificacion('Error al guardar', 'error'); })
    .finally(() => { enviando = false; });
};

// ── Eliminar (optimistic: desaparece al instante) ──
const _eliminar = () => {
  if (!pendiente) return;
  const id = pendiente; pendiente = null;
  $('#wmEliminar').removeClass('show');

  // UI instantánea
  const backup = [...msgs];
  msgs = msgs.filter(m => m.id !== id); _save(msgs);
  $(`.wm_item[data-id="${id}"]`).addClass('deleting');
  setTimeout(() => { $('#wmChat').html(_htmlList(msgs)); }, 250);

  // Background delete
  deleteDoc(doc(db, 'wiMensajes', id))
    .then(() => Notificacion('Eliminado 🗑️', 'success', 1200))
    .catch(e => { console.error('❌', e); msgs = backup; _save(msgs); $('#wmChat').html(_htmlList(msgs)); Notificacion('Error al eliminar', 'error'); });
};

// ── Helpers ──────────────────────────────────────────────────
const _status = ok => { $('.wm_dot').removeClass('active error').addClass(ok ? 'active' : 'error'); $('.wm_dotxt').text(ok ? 'Online' : 'Offline'); };

const _dateLabel = ts => {
  if (!ts) return 'Hoy';
  const d = ts.toDate?.() || new Date((ts.seconds || 0) * 1000);
  const hoy = new Date(), ayer = new Date(hoy);
  hoy.setHours(0, 0, 0, 0); ayer.setDate(ayer.getDate() - 1); ayer.setHours(0, 0, 0, 0);
  return d >= hoy ? 'Hoy' : d >= ayer ? 'Ayer' : d.toLocaleDateString('es', { day: 'numeric', month: 'long' });
};

const _hora = ts => {
  if (!ts) return 'Ahora';
  const d = ts.toDate?.() || new Date((ts.seconds || 0) * 1000);
  return d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
};

const _htmlList = list => {
  if (!list?.length) return _empty('fa-comment-dots', 'Sin mensajes aún', 'Escribe tu primer mensaje 👇');
  let lastLabel = '';
  return list.map(m => {
    const label = _dateLabel(m.fecha);
    const sep = label !== lastLabel ? `<div class="wm_sep"><span>${label}</span></div>` : '';
    lastLabel = label;
    return `${sep}<div class="wm_item" data-id="${m.id}" ${wiTip('Click para copiar')}>
      <div class="wm_bubble">
        <p class="wm_txt">${_esc(m.mensaje).replace(/\n/g, '<br>')}</p>
        <div class="wm_foot"><span class="wm_time">${_hora(m.fecha)}</span><i class="fas fa-check-double wm_check"></i></div>
      </div>
      <button class="wm_del" data-id="${m.id}" ${wiTip('Eliminar')}><i class="fas fa-trash"></i></button>
    </div>`;
  }).join('');
};

const _empty = (ico, txt, sub) => `<div class="wm_empty"><i class="fas ${ico}"></i><p>${txt}</p><span>${sub}</span></div>`;
const _esc = t => String(t || '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c]));

export const cleanup = () => {
  clearInterval(refreshTimer); refreshTimer = null;
  if (_onVis) { document.removeEventListener('visibilitychange', _onVis); _onVis = null; }
  $(document).off('.wm');
  [msgs, pendiente, enviando] = [[], null, false];
};