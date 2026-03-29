import $ from 'jquery';
import { rutas } from './rutas/ruta.js';
import { Mensaje, wiSmart, wiAuth } from './widev.js';

// VISTA PERSONAL_________________________________
export const personal = wi => {
  Mensaje?.('Bienvenido '+wi.nombre);
  $('.nv_right').html(`
    <a href="/milab" class="nv_item" data-page="milab"><i class="fa-solid fa-graduation-cap"></i> <span>Mi Lab</span></a>
    <a href="/smile" class="nv_item" data-page="smile"><i class="fa-solid fa-dashboard"></i> <span>Dashboard</span></a>
    <a href="/mensajes" class="nv_item" data-page="mensajes"><i class="fa-solid fa-comments"></i> <span>Mensajes</span></a>
    <a href="/perfil" class="nv_item" data-page="perfil"><img src="${wi.imagen || './smile.avif'}" alt="${wi.nombre}"><span>${wi.nombre}</span></a>
    <button class="nv_item bt_salir" data-page="inicio"><i class="fa-solid fa-sign-out-alt"></i> <span>salir</span></button>
  `);
};

// VISTA PUBLICA_________________________________
const publico = () => {
  $('.nv_right').html(`
    <a href="/descubre" class="nv_item" data-page="descubre"><i class="fa-solid fa-gauge"></i> <span>Descubre </span></a>
    <button class="bt_auth registrar"><i class="fas fa-user-plus"></i><span>Registrar</span></button>
    <button class="bt_auth login"><i class="fas fa-sign-in-alt"></i><span>Login</span></button>  
  `);
};

// MI AUTH_________________________________
wiAuth.on(wi => wi ? personal(wi) : (publico(), rutas.navigate('/')));
const wi = wiAuth.user; wi ? personal(wi) : publico();

// SALIR_________________________________
const KEEP_KEYS = ['wiTema', 'wiSmart', 'wiFresh'];
$(document).on('click', '.bt_salir', async () => {
  const { salir } = await import('./smile/login.js');
  salir(KEEP_KEYS);
});

// LOGIN / REGISTRAR — Firebase se carga solo al hacer click
$(document).on('click', '.bt_auth', async function () {
  const { abrirLogin } = await import('./smile/login.js');
  abrirLogin($(this).hasClass('registrar') ? 'registrar' : 'login');
});