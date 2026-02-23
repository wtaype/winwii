import $ from 'jquery';
import {app, lanzamiento, autor, link, version} from './wii.js';

export { footer };
function footer(){
  const ahora = new Date();
  return `
  <footer class="foo wb txc psa">
    <span>Creado con <i class="fas fa-heart"></i> by <a class="ftx lkme" href="${link}" target="_blank">${autor}</a></span>
    <span>${lanzamiento} - <span class="wty">${ahora.getFullYear()}</span></span>
    <span class="abw"> | ${app} ${version} | actualizado:
    <span class="wtu">${ahora.toLocaleString()}</span></span>
  </footer>
  `;
}; $('body').append(footer());  //Actualizar 

$("head").append(`<style>:root{--bgim:url("${import.meta.env.BASE_URL}wpuntos.svg")}body{background: var(--bgim), var(--bg)}</style>`)
$('.wimenu').on('click', function(){$('.wiheader').toggleClass('movil'); $(this).find('i').toggleClass('fa-bars fa-times')});

console.log(`✅ ${app} : ${version}`)