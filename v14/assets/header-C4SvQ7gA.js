const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/login-vNpCTnLC.js","assets/vendor-gzd0YkcT.js","assets/firebase-DHVsH4U5.js","assets/main-B6nsIEdO.js","assets/firebase-Whrs9NU2.js","assets/login-pzxUIRzl.css"])))=>i.map(i=>d[i]);
import{M as c,h as n,r as l,_ as e}from"./main-B6nsIEdO.js";import{j as s}from"./vendor-gzd0YkcT.js";const r=a=>{c?.("Bienvenido "+a.nombre),s(".nv_right").html(`
    
    <a href="/notas" class="nv_item" data-page="notas"><i class="fa-solid fa-note-sticky"></i> <span>Mis Notas</span></a>
    <a href="/mensajes" class="nv_item" data-page="mensajes"><i class="fa-solid fa-message"></i> <span>Mensajes</span></a>
    <a href="/perfil" class="nv_item" data-page="perfil"><img src="${a.imagen||"./smile.avif"}" alt="${a.nombre}"><span>${a.nombre}</span></a>
    <button class="nv_item bt_salir" data-page="inicio"><i class="fa-solid fa-sign-out-alt"></i> <span>salir</span></button>
  `)},o=()=>{s(".nv_right").html(`
    <a href="/descubre" class="nv_item" data-page="descubre"><i class="fa-solid fa-gauge"></i> <span>Descubre </span></a>
    <button class="bt_auth registrar"><i class="fas fa-user-plus"></i><span>Registrar</span></button>
    <button class="bt_auth login"><i class="fas fa-sign-in-alt"></i><span>Login</span></button>  
  `)};n.on(a=>a?r(a):(o(),l.navigate("/")));const i=n.user;i?r(i):o();const p=["wiTema","wiSmart","wiFresh"];s(document).on("click",".bt_salir",async()=>{const{salir:a}=await e(async()=>{const{salir:t}=await import("./login-vNpCTnLC.js");return{salir:t}},__vite__mapDeps([0,1,2,3,4,5]));a(p)});s(document).on("click",".bt_auth",async function(){const{abrirLogin:a}=await e(async()=>{const{abrirLogin:t}=await import("./login-vNpCTnLC.js");return{abrirLogin:t}},__vite__mapDeps([0,1,2,3,4,5]));a(s(this).hasClass("registrar")?"registrar":"login")});export{r as personal};
