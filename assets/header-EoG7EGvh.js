const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/login-BQsRC5io.js","assets/vendor-gzd0YkcT.js","assets/firebase-DqoUuv0g.js","assets/main-D7fYqA8Y.js","assets/firebase-CrRCUYpg.js","assets/login-pzxUIRzl.css"])))=>i.map(i=>d[i]);
import{M as l,e as n,r as c,_ as e}from"./main-D7fYqA8Y.js";import{j as s}from"./vendor-gzd0YkcT.js";const r=a=>{l?.("Bienvenido "+a.nombre),s(".nv_right").html(`
    <a href="/milab" class="nv_item" data-page="milab"><i class="fa-solid fa-graduation-cap"></i> <span>Mi Lab</span></a>
    <a href="/smile" class="nv_item" data-page="smile"><i class="fa-solid fa-dashboard"></i> <span>Dashboard</span></a>
    <a href="/mensajes" class="nv_item" data-page="mensajes"><i class="fa-solid fa-comments"></i> <span>Mensajes</span></a>
    <a href="/perfil" class="nv_item" data-page="perfil"><img src="${a.imagen||"./smile.avif"}" alt="${a.nombre}"><span>${a.nombre}</span></a>
    <button class="nv_item bt_salir" data-page="inicio"><i class="fa-solid fa-sign-out-alt"></i> <span>salir</span></button>
  `)},o=()=>{s(".nv_right").html(`
    <a href="/descubre" class="nv_item" data-page="descubre"><i class="fa-solid fa-gauge"></i> <span>Descubre </span></a>
    <button class="bt_auth registrar"><i class="fas fa-user-plus"></i><span>Registrar</span></button>
    <button class="bt_auth login"><i class="fas fa-sign-in-alt"></i><span>Login</span></button>  
  `)};n.on(a=>a?r(a):(o(),c.navigate("/")));const t=n.user;t?r(t):o();const p=["wiTema","wiSmart","wiFresh"];s(document).on("click",".bt_salir",async()=>{const{salir:a}=await e(async()=>{const{salir:i}=await import("./login-BQsRC5io.js");return{salir:i}},__vite__mapDeps([0,1,2,3,4,5]));a(p)});s(document).on("click",".bt_auth",async function(){const{abrirLogin:a}=await e(async()=>{const{abrirLogin:i}=await import("./login-BQsRC5io.js");return{abrirLogin:i}},__vite__mapDeps([0,1,2,3,4,5]));a(s(this).hasClass("registrar")?"registrar":"login")});export{r as personal};
