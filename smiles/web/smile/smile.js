import './smile.css';
import $ from 'jquery';
import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { getls } from '../../widev.js';
import { app } from '../../wii.js';

const waitAuth = () => new Promise(r => {
  if (auth.currentUser) return r(auth.currentUser);
  const unsub = onAuthStateChanged(auth, u => { unsub(); r(u); });
});

const fmtFecha = (ts) => {
  if (!ts) return '—';
  const f = ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts);
  if (isNaN(f.getTime())) return '—';
  return f.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
};

const getSaludo = () => {
  const h = new Date().getHours();
  if (h < 12) return { txt: 'Buenos días',   ico: 'fa-sun'       };
  if (h < 18) return { txt: 'Buenas tardes', ico: 'fa-cloud-sun' };
  return           { txt: 'Buenas noches', ico: 'fa-moon'      };
};

export const render = () => `
  <div class="smw_page">

    <!-- HERO -->
    <div class="smw_hero">
      <div class="smw_avatar" id="smwAvatar"></div>
      <div class="smw_hero_info">
        <p class="smw_saludo" id="smwSaludo"></p>
        <h1 class="smw_nombre" id="smwNombre"></h1>
        <div class="smw_badges" id="smwBadges"></div>
      </div>
    </div>

    <!-- CARDS INFO -->
    <div class="smw_cards" id="smwCards"></div>

    <!-- ACCESO RÁPIDO -->
    <div class="smw_acciones">
      <h2 class="smw_sec_title"><i class="fa-solid fa-bolt"></i> Acceso rápido</h2>
      <div class="smw_grid">
        <a href="/win" class="nv_item smw_acc" data-page="win">
          <span class="smw_acc_ico"><i class="fa-solid fa-pen-to-square"></i></span>
          <span class="smw_acc_txt">Win</span>
          <small>Crea mensajes</small>
        </a>
        <a href="/notas" class="nv_item smw_acc" data-page="notas">
          <span class="smw_acc_ico"><i class="fa-solid fa-note-sticky"></i></span>
          <span class="smw_acc_txt">Notas</span>
          <small>Tus apuntes</small>
        </a>
        <a href="/milab" class="nv_item smw_acc" data-page="milab">
          <span class="smw_acc_ico"><i class="fa-solid fa-flask"></i></span>
          <span class="smw_acc_txt">Mi Lab</span>
          <small>Experimenta</small>
        </a>
        <a href="/agregar" class="nv_item smw_acc" data-page="agregar">
          <span class="smw_acc_ico"><i class="fa-solid fa-circle-plus"></i></span>
          <span class="smw_acc_txt">Agregar</span>
          <small>Nuevo contenido</small>
        </a>
        <a href="/mensajes" class="nv_item smw_acc" data-page="mensajes">
          <span class="smw_acc_ico"><i class="fa-solid fa-comments"></i></span>
          <span class="smw_acc_txt">Mensajes</span>
          <small>Tu bandeja</small>
        </a>
        <a href="/perfil" class="nv_item smw_acc" data-page="perfil">
          <span class="smw_acc_ico"><i class="fa-solid fa-circle-user"></i></span>
          <span class="smw_acc_txt">Perfil</span>
          <small>Tu cuenta</small>
        </a>
      </div>
    </div>

  </div>
`;

export const init = async () => {
  console.log(`✅ Smile Home — ${app}`);

  const user = await waitAuth();
  if (!user) return;

  const wi = getls('wiSmile');
  if (!wi) return;

  const nombre    = wi.nombre    || wi.usuario || user.email;
  const apellidos = wi.apellidos || '';
  const email     = wi.email     || user.email;
  const rol       = wi.rol       || 'smile';
  const usuario   = wi.usuario   || nombre.toLowerCase();
  const iniciales = `${(wi.nombre || '?')[0]}${(wi.apellidos || '')[0] || ''}`.toUpperCase();
  const saludo    = getSaludo();

  $('#smwAvatar').text(iniciales);
  $('#smwSaludo').html(`<i class="fas ${saludo.ico}"></i> ${saludo.txt}`);
  $('#smwNombre').text(`${nombre} ${apellidos}`.trim());

  $('#smwBadges').html(`
    <span class="smw_badge smw_rol"><i class="fas fa-shield-halved"></i> ${rol}</span>
    <span class="smw_badge smw_email"><i class="fas fa-envelope"></i> ${email}</span>
  `);

  $('#smwCards').html(`
    <div class="smw_card" style="--d:.0s">
      <span class="smw_card_ico"><i class="fas fa-calendar-plus"></i></span>
      <div class="smw_card_data">
        <small>Miembro desde</small>
        <strong>${fmtFecha(wi.creado)}</strong>
      </div>
    </div>
    <div class="smw_card" style="--d:.08s">
      <span class="smw_card_ico"><i class="fas fa-clock"></i></span>
      <div class="smw_card_data">
        <small>Última actividad</small>
        <strong>${fmtFecha(wi.ultimaActividad)}</strong>
      </div>
    </div>
    <div class="smw_card" style="--d:.16s">
      <span class="smw_card_ico"><i class="fas fa-at"></i></span>
      <div class="smw_card_data">
        <small>Usuario</small>
        <strong>@${usuario}</strong>
      </div>
    </div>
  `);
};

export const cleanup = () => {
  console.log('🧹 Smile Home');
};