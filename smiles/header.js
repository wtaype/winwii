import $ from 'jquery';
import { rutas } from './rutas/ruta.js';
import { getls, removels, Mensaje, wiAuth } from './widev.js';
import './auth/wiauth.js';

// VISTA PERSONAL_________________________________
export const personal = wi => {
  Mensaje('Bienvenido ' + wi.nombre);
  $('.wiauth').html(`
    <a href="/smile" class="nv_item" data-page="smile"><i class="fa-solid fa-gauge"></i> <span>Dashboard</span></a>
    <div class="sesion"><img src="${wi.imagen || './smile.avif'}" alt="${wi.nombre}"><span>${wi.nombre}</span></div>
    <button class="wibtn_auth bt_salir"><i class="fas fa-sign-out-alt"></i> Salir</button>
  `);
  // rutas.navigate('/smile')
};

// VISTA PUBLICA_________________________________
const publico = () => {
  $('.wiauth').html(`
    <button class="wibtn_auth registrar"><i class="fas fa-user-plus"></i><span>Registrar</span></button>
    <button class="wibtn_auth login"><i class="fas fa-sign-in-alt"></i><span>Login</span></button>
  `);
};

// MI AUTH_________________________________
wiAuth.on(wi => wi ? personal(wi) : (publico(), rutas.navigate('/')));
const wi = wiAuth.user; wi ? personal(wi) : publico();

// SALIR_________________________________
$(document).on('click.wi', '.bt_salir', async () => {
  const { auth, signOut } = await import('./auth/wiauth.js');
  await signOut(auth); wiAuth.logout();
});