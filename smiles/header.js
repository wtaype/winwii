import $ from 'jquery';
import { rutas } from './rutas/ruta.js';
import { getls, removels, Mensaje } from './widev.js';

// ── VISTA PERSONAL ──
export const personal = wi => {
  Mensaje('Bienvenido ' + wi.nombre);
  $('.wiauth').html(`
    <a href="/smile" class="nv_item" data-page="smile"><i class="fa-solid fa-gauge"></i> <span>Dashboard</span></a>
    <div class="sesion"><img src="${wi.imagen || './smile.avif'}" alt="${wi.nombre}"><span>${wi.nombre}</span></div>
    <button class="wibtn_auth bt_salir"><i class="fas fa-sign-out-alt"></i> Salir</button>
  `);
  // rutas.navigate('/');
};

// ── VISTA PÚBLICA ──
const publico = () => {
  // $('.wiauth').html(`
  //   <button class="wibtn_auth registrar"><i class="fas fa-user-plus"></i><span>Registrar</span></button>
  //   <button class="wibtn_auth login"><i class="fas fa-sign-in-alt"></i><span>Login</span></button>
  // `);
};

// ── AUTH OBSERVER (lazy) ──
let _unsub = null;
export const wiObservar = async (...fns) => {
  if (_unsub) return;
  const { auth, onAuthStateChanged } = await import('./smile/login.js');
  _unsub = onAuthStateChanged(auth, async user => {
    user ? fns.forEach(fn => fn(user).catch(console.error)) : (removels('wiSmile'), publico());
  });
};
export const wiDesconectar = () => { _unsub?.(); _unsub = null; };

// ── INIT ──
const wi = getls('wiSmile');
wi ? (personal(wi), wiObservar()) : publico();

// ── SALIR ──
$(document).on('click.wi', '.bt_salir', async () => {
  const keep = ['wiflash', 'wiTema'].map(k => [k, localStorage.getItem(k)]);
  const { auth, signOut } = await import('./smile/login.js');
  await signOut(auth); localStorage.clear(); keep.forEach(([k, v]) => v && localStorage.setItem(k, v)); location.reload();
});