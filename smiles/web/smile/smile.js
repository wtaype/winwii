import './smile.css';
import $ from 'jquery';
import { auth } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { getls, getNombre, fechaHoy, calcMeses, formatearFechaHora } from '../widev.js';
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

const FRASES = [
  { ico: 'fa-rocket',        txt: 'Cada día que avanzas te acerca más a donde quieres llegar. ¡No pares!' },
  { ico: 'fa-star',          txt: 'Los sueños grandes requieren pasos constantes. Tú ya diste el primero.' },
  { ico: 'fa-fire-flame-curved', txt: 'Tu esfuerzo de hoy es el logro que celebrarás mañana.' },
  { ico: 'fa-heart',         txt: 'Creer en ti mismo es el superpoder más poderoso que tienes.' },
  { ico: 'fa-bolt',          txt: 'No importa el ritmo, lo importante es no detenerse.' },
  { ico: 'fa-seedling',      txt: 'Cada pequeño avance cuenta. Estás construyendo algo increíble.' },
  { ico: 'fa-trophy',        txt: 'El éxito no es un destino, es el camino que recorres cada día.' },
];

export const render = () => `
  <div class="smw_page">

    <!-- HERO -->
    <div class="smw_hero">
      <div class="smw_hero_inner">
        <div class="smw_avatar" id="smwAvatar"></div>
        <div class="smw_hero_info">
          <p class="smw_saludo"   id="smwSaludo"></p>
          <h1 class="smw_nombre" id="smwNombre"></h1>
          <p class="smw_hoy"     id="smwHoy"></p>
          <div class="smw_badges" id="smwBadges"></div>
        </div>
      </div>
    </div>

    <!-- STATS -->
    <div class="smw_wrap">
      <div class="smw_cards" id="smwCards"></div>

      <!-- FRASE MOTIVACIONAL -->
      <div class="smw_motiv" id="smwMotiv"></div>
    </div>

  </div>
`;

export const init = async () => {
  console.log(`✅ Smile Home — ${app}`);

  const user = await waitAuth();
  if (!user) return;

  const wi = getls('wiSmile');
  if (!wi) return;

  const nombre    = getNombre(wi.nombre || wi.usuario || '');
  const fullName  = `${wi.nombre || ''} ${wi.apellidos || ''}`.trim();
  const email     = wi.email || user.email;
  const rol       = wi.rol   || 'smile';
  const meses     = calcMeses(wi.creado?.seconds ? new Date(wi.creado.seconds * 1000) : wi.creado);
  const iniciales = `${(wi.nombre || '?')[0]}${(wi.apellidos || '')[0] || ''}`.toUpperCase();
  const saludo    = getSaludo();
  const frase     = FRASES[Math.floor(Math.random() * FRASES.length)];

  // Hero
  $('#smwAvatar').text(iniciales);
  $('#smwSaludo').html(`<i class="fas ${saludo.ico}"></i> ${saludo.txt}, <strong>${nombre}</strong>`);
  $('#smwNombre').text(fullName);
  $('#smwHoy').text(fechaHoy());
  $('#smwBadges').html(`
    <span class="smw_badge smw_rol"><i class="fas fa-shield-halved"></i> ${rol}</span>
    <span class="smw_badge smw_email"><i class="fas fa-envelope"></i> ${email}</span>
  `);

  // Stats cards
  const tiempoTxt = meses <= 0   ? 'Recién llegado 🎉'
                  : meses === 1  ? '1 mes con nosotros'
                  : `${meses} meses con nosotros`;

  $('#smwCards').html(`
    <div class="smw_card" style="--d:0s">
      <span class="smw_card_ico"><i class="fas fa-calendar-heart"></i></span>
      <div class="smw_card_data">
        <small>Miembro desde</small>
        <strong>${fmtFecha(wi.creado)}</strong>
      </div>
    </div>
    <div class="smw_card" style="--d:.07s">
      <span class="smw_card_ico"><i class="fas fa-hourglass-half"></i></span>
      <div class="smw_card_data">
        <small>Tiempo en ${app}</small>
        <strong>${tiempoTxt}</strong>
      </div>
    </div>
    <div class="smw_card" style="--d:.14s">
      <span class="smw_card_ico"><i class="fas fa-clock-rotate-left"></i></span>
      <div class="smw_card_data">
        <small>Última actividad</small>
        <strong>${formatearFechaHora(wi.ultimaActividad)}</strong>
      </div>
    </div>
    <div class="smw_card" style="--d:.21s">
      <span class="smw_card_ico"><i class="fas fa-at"></i></span>
      <div class="smw_card_data">
        <small>Usuario</small>
        <strong>@${wi.usuario || nombre.toLowerCase()}</strong>
      </div>
    </div>
  `);

  // Frase motivacional
  $('#smwMotiv').html(`
    <div class="smw_motiv_inner">
      <span class="smw_motiv_ico"><i class="fas ${frase.ico}"></i></span>
      <div class="smw_motiv_txt">
        <small>Para ti, ${nombre} 💛</small>
        <p>${frase.txt}</p>
      </div>
    </div>
  `);
};

export const cleanup = () => {
  console.log('🧹 Smile Home');
};