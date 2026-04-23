import{j as a}from"./vendor-gzd0YkcT.js";import{l as e,b as n,k as t,a as s,v}from"./main-CuczXLwU.js";function r(){const o=new Date;return`
  <footer class="foo wb txc psa">
    <span>Creado con <i class="fas fa-heart"></i> by <a class="ftx lkme" href="${e}" target="_blank">${n}</a></span>
    <span>${t} - <span class="wty">${o.getFullYear()}</span></span>
    <span class="abw"> | ${s} ${v} | actualizado:
    <span class="wtu">${o.toLocaleString()}</span></span>
  </footer>
  `}a("body").append(r());a("head").append('<style>:root{--bgim:url("/winwii/v19/wpuntos.svg")}body{background: var(--bgim), var(--bg)}</style>');const i=()=>`<div class="movil_divider"></div>${a(".nv_right").html()}`;a("body").append(`<div class="movil_overlay"></div>
<nav class="movil_drawer" role="navigation" aria-label="Menú móvil">
  <button class="movil_close" aria-label="Cerrar menú"><i class="fas fa-times"></i></button>
  <div class="movil_logo"><i class="fas fa-heart"></i> ${s}</div>
  <div class="movil_nav">${a(".winav").html()}${i()}</div>
</nav>`);const c=()=>{const o=a(".movil_nav .movil_divider");o.nextAll().remove(),o.remove(),a(".movil_nav").append(i())};new MutationObserver(c).observe(a(".nv_right")[0],{childList:!0,subtree:!0});const l=()=>a("body").removeClass("movil_open");a(".wimenu").on("click",()=>a("body").addClass("movil_open"));a(".movil_close, .movil_overlay").on("click",l);a(document).on("click",".movil_nav .nv_item, .movil_nav .bt_auth, .movil_nav .bt_salir",l);export{r as footer};
