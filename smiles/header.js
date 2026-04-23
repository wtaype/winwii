import $ from 'jquery';
import { rutas, NAV } from './rutas/ruta.js';
import { Mensaje, wiAuth } from './widev.js';

// ── MOTOR DE RENDERIZADO ──────────────────────────────────────────────────────
const buildNav = (items, wi) => items.map(i => {
  if (i.isBtn)    return `<button class="${i.cls}"><i class="fas ${i.ico}"></i><span>${i.txt}</span></button>`;
  if (i.isPerfil) return `<a href="/perfil" class="nv_item" data-page="perfil"><img src="${wi?.imagen || './smile.avif'}" alt="${wi?.nombre}"><span>${wi?.nombre}</span></a>`;
  if (i.isSalir)  return `<button class="nv_item bt_salir" data-page="inicio"><i class="fa-solid fa-sign-out-alt"></i> <span>Salir</span></button>`;
  return `<a href="${i.href}" class="nv_item" data-page="${i.page}"><i class="fas ${i.ico}"></i> <span>${i.txt}</span></a>`;
}).join('');

const renderHeader = (wi) => {
  const cfg = NAV[wi?.rol] ?? NAV.todos;
  if (wi) Mensaje?.('Bienvenido ' + wi.nombre);
  $('.winav').html(buildNav(cfg.winav, wi));
  $('.nv_right').html(buildNav(cfg.nvrig, wi));
};

// ── AUTH LISTENER ─────────────────────────────────────────────────────────────
wiAuth.on(wi => wi ? renderHeader(wi) : (renderHeader(), rutas.navigate('/')));
const wi = wiAuth.user; wi ? renderHeader(wi) : renderHeader();

// ── EVENTOS GLOBALES ──────────────────────────────────────────────────────────
$(document).on('click', '.bt_salir', async () => {
  const { salir } = await import('./web/todos/login.js');
  salir(['wiTema', 'wiSmart', 'wiFresh']);
});

$(document).on('click', '.bt_auth', async function () {
  const { abrirLogin } = await import('./web/todos/login.js');
  abrirLogin($(this).hasClass('registrar') ? 'registrar' : 'login');
});
