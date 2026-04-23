import{j as c}from"./vendor-gzd0YkcT.js";import{auth as l}from"./firebase-BbiX5iLQ.js";import{o as _}from"./firebase-Cdwg_wrl.js";import{a as p,g as w}from"./main-CEDqlAXn.js";const f=()=>new Promise(a=>{if(l.currentUser)return a(l.currentUser);const s=_(l,i=>{s(),a(i)})}),n=a=>{if(!a)return"—";const s=a.seconds?new Date(a.seconds*1e3):new Date(a);return isNaN(s.getTime())?"—":s.toLocaleDateString("es-ES",{day:"numeric",month:"long",year:"numeric"})},u=()=>{const a=new Date().getHours();return a<12?{txt:"Buenos días",ico:"fa-sun"}:a<18?{txt:"Buenas tardes",ico:"fa-cloud-sun"}:{txt:"Buenas noches",ico:"fa-moon"}},x=()=>`
  <div class="smw_page">

    <!-- HERO -->
    <div class="smw_hero">
      <div class="smw_avatar" id="smwAvatar"></div>
      <div class="smw_hero_info">
        <p class="smw_saludo" id="smwSaludo"></p>
        <h1 class="smw_nombre" id="smwNombre"></h1>
        <div class="smw_badges" id="smwBadges"></div>
      </div>
    </div>

    <!-- CARDS INFO -->
    <div class="smw_cards" id="smwCards"></div>

    <!-- ACCESO RÁPIDO -->
    <div class="smw_acciones">
      <h2 class="smw_sec_title"><i class="fa-solid fa-bolt"></i> Acceso rápido</h2>
      <div class="smw_grid">
        <a href="/win" class="nv_item smw_acc" data-page="win">
          <span class="smw_acc_ico"><i class="fa-solid fa-pen-to-square"></i></span>
          <span class="smw_acc_txt">Win</span>
          <small>Crea mensajes</small>
        </a>
        <a href="/notas" class="nv_item smw_acc" data-page="notas">
          <span class="smw_acc_ico"><i class="fa-solid fa-note-sticky"></i></span>
          <span class="smw_acc_txt">Notas</span>
          <small>Tus apuntes</small>
        </a>
        <a href="/milab" class="nv_item smw_acc" data-page="milab">
          <span class="smw_acc_ico"><i class="fa-solid fa-flask"></i></span>
          <span class="smw_acc_txt">Mi Lab</span>
          <small>Experimenta</small>
        </a>
        <a href="/agregar" class="nv_item smw_acc" data-page="agregar">
          <span class="smw_acc_ico"><i class="fa-solid fa-circle-plus"></i></span>
          <span class="smw_acc_txt">Agregar</span>
          <small>Nuevo contenido</small>
        </a>
        <a href="/mensajes" class="nv_item smw_acc" data-page="mensajes">
          <span class="smw_acc_ico"><i class="fa-solid fa-comments"></i></span>
          <span class="smw_acc_txt">Mensajes</span>
          <small>Tu bandeja</small>
        </a>
        <a href="/perfil" class="nv_item smw_acc" data-page="perfil">
          <span class="smw_acc_ico"><i class="fa-solid fa-circle-user"></i></span>
          <span class="smw_acc_txt">Perfil</span>
          <small>Tu cuenta</small>
        </a>
      </div>
    </div>

  </div>
`,$=async()=>{console.log(`✅ Smile Home — ${p}`);const a=await f();if(!a)return;const s=w("wiSmile");if(!s)return;const i=s.nombre||s.usuario||a.email,t=s.apellidos||"",m=s.email||a.email,o=s.rol||"smile",r=s.usuario||i.toLowerCase(),d=`${(s.nombre||"?")[0]}${(s.apellidos||"")[0]||""}`.toUpperCase(),e=u();c("#smwAvatar").text(d),c("#smwSaludo").html(`<i class="fas ${e.ico}"></i> ${e.txt}`),c("#smwNombre").text(`${i} ${t}`.trim()),c("#smwBadges").html(`
    <span class="smw_badge smw_rol"><i class="fas fa-shield-halved"></i> ${o}</span>
    <span class="smw_badge smw_email"><i class="fas fa-envelope"></i> ${m}</span>
  `),c("#smwCards").html(`
    <div class="smw_card" style="--d:.0s">
      <span class="smw_card_ico"><i class="fas fa-calendar-plus"></i></span>
      <div class="smw_card_data">
        <small>Miembro desde</small>
        <strong>${n(s.creado)}</strong>
      </div>
    </div>
    <div class="smw_card" style="--d:.08s">
      <span class="smw_card_ico"><i class="fas fa-clock"></i></span>
      <div class="smw_card_data">
        <small>Última actividad</small>
        <strong>${n(s.ultimaActividad)}</strong>
      </div>
    </div>
    <div class="smw_card" style="--d:.16s">
      <span class="smw_card_ico"><i class="fas fa-at"></i></span>
      <div class="smw_card_data">
        <small>Usuario</small>
        <strong>@${r}</strong>
      </div>
    </div>
  `)},S=()=>{console.log("🧹 Smile Home")};export{S as cleanup,$ as init,x as render};
