import $ from 'jquery';
import {app, lanzamiento, by, linkme, version} from './wii.js';

export { footer };
function footer(){
  const ahora = new Date();
  return `
  <footer class="foo wb txc psa">
    <span>Creado con <i class="fas fa-heart"></i> by <a class="ftx lkme" href="${linkme}" target="_blank">${by}</a></span>
    <span>${lanzamiento} - <span class="wty">${ahora.getFullYear()}</span></span>
    <span class="abw"> | ${app} ${version} | actualizado:
    <span class="wtu">${ahora.toLocaleString()}</span></span>
  </footer>
  `;
}; $('body').append(footer());  //Actualizar 

$("head").append(`<style>:root{--bgim:url("${import.meta.env.BASE_URL}wpuntos.svg")}body{background: var(--bgim), var(--bg)}</style>`)

// MOBILE DRAWER v3.0
const authHtml = () => `<div class="movil_divider"></div>${$('.nv_right').html()}`;
$('body').append(`<div class="movil_overlay"></div>
<nav class="movil_drawer" role="navigation" aria-label="Menú móvil">
  <button class="movil_close" aria-label="Cerrar menú"><i class="fas fa-times"></i></button>
  <div class="movil_logo"><i class="fas fa-heart"></i> ${app}</div>
  <div class="movil_nav">${$('.winav').html()}${authHtml()}</div>
</nav>`);
const sync = () => { const $d = $('.movil_nav .movil_divider'); $d.nextAll().remove(); $d.remove(); $('.movil_nav').append(authHtml()); };
new MutationObserver(sync).observe($('.nv_right')[0], { childList: true, subtree: true });
const cerrar = () => $('body').removeClass('movil_open');
$('.wimenu').on('click', () => $('body').addClass('movil_open'));
$('.movil_close, .movil_overlay').on('click', cerrar);
$(document).on('click', '.movil_nav .nv_item, .movil_nav .bt_auth, .movil_nav .bt_salir', cerrar);