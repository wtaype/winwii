import{j as e}from"./vendor-gzd0YkcT.js";import{auth as i}from"./firebase-C4LyfHx4.js";import{o as f}from"./firebase-CiLZDPlJ.js";import{a as n,g as p,d as _,e as g,f as h,h as x}from"./main-Dlu14CdS.js";const $=()=>new Promise(a=>{if(i.currentUser)return a(i.currentUser);const s=f(i,o=>{s(),a(o)})}),b=a=>{if(!a)return"—";const s=a.seconds?new Date(a.seconds*1e3):new Date(a);return isNaN(s.getTime())?"—":s.toLocaleDateString("es-ES",{day:"numeric",month:"long",year:"numeric"})},y=()=>{const a=new Date().getHours();return a<12?{txt:"Buenos días",ico:"fa-sun"}:a<18?{txt:"Buenas tardes",ico:"fa-cloud-sun"}:{txt:"Buenas noches",ico:"fa-moon"}},l=[{ico:"fa-rocket",txt:"Cada día que avanzas te acerca más a donde quieres llegar. ¡No pares!"},{ico:"fa-star",txt:"Los sueños grandes requieren pasos constantes. Tú ya diste el primero."},{ico:"fa-fire-flame-curved",txt:"Tu esfuerzo de hoy es el logro que celebrarás mañana."},{ico:"fa-heart",txt:"Creer en ti mismo es el superpoder más poderoso que tienes."},{ico:"fa-bolt",txt:"No importa el ritmo, lo importante es no detenerse."},{ico:"fa-seedling",txt:"Cada pequeño avance cuenta. Estás construyendo algo increíble."},{ico:"fa-trophy",txt:"El éxito no es un destino, es el camino que recorres cada día."}],H=()=>`
  <div class="smw_page">

    <!-- HERO -->
    <div class="smw_hero">
      <div class="smw_hero_inner">
        <div class="smw_avatar" id="smwAvatar"></div>
        <div class="smw_hero_info">
          <p class="smw_saludo"   id="smwSaludo"></p>
          <h1 class="smw_nombre" id="smwNombre"></h1>
          <p class="smw_hoy"     id="smwHoy"></p>
          <div class="smw_badges" id="smwBadges"></div>
        </div>
      </div>
    </div>

    <!-- STATS -->
    <div class="smw_wrap">
      <div class="smw_cards" id="smwCards"></div>

      <!-- FRASE MOTIVACIONAL -->
      <div class="smw_motiv" id="smwMotiv"></div>
    </div>

  </div>
`,T=async()=>{console.log(`✅ Smile Home — ${n}`);const a=await $();if(!a)return;const s=p("wiSmile");if(!s)return;const o=_(s.nombre||s.usuario||""),d=`${s.nombre||""} ${s.apellidos||""}`.trim(),m=s.email||a.email,u=s.rol||"smile",t=g(s.creado?.seconds?new Date(s.creado.seconds*1e3):s.creado),w=`${(s.nombre||"?")[0]}${(s.apellidos||"")[0]||""}`.toUpperCase(),r=y(),c=l[Math.floor(Math.random()*l.length)];e("#smwAvatar").text(w),e("#smwSaludo").html(`<i class="fas ${r.ico}"></i> ${r.txt}, <strong>${o}</strong>`),e("#smwNombre").text(d),e("#smwHoy").text(h()),e("#smwBadges").html(`
    <span class="smw_badge smw_rol"><i class="fas fa-shield-halved"></i> ${u}</span>
    <span class="smw_badge smw_email"><i class="fas fa-envelope"></i> ${m}</span>
  `);const v=t<=0?"Recién llegado 🎉":t===1?"1 mes con nosotros":`${t} meses con nosotros`;e("#smwCards").html(`
    <div class="smw_card" style="--d:0s">
      <span class="smw_card_ico"><i class="fas fa-calendar-heart"></i></span>
      <div class="smw_card_data">
        <small>Miembro desde</small>
        <strong>${b(s.creado)}</strong>
      </div>
    </div>
    <div class="smw_card" style="--d:.07s">
      <span class="smw_card_ico"><i class="fas fa-hourglass-half"></i></span>
      <div class="smw_card_data">
        <small>Tiempo en ${n}</small>
        <strong>${v}</strong>
      </div>
    </div>
    <div class="smw_card" style="--d:.14s">
      <span class="smw_card_ico"><i class="fas fa-clock-rotate-left"></i></span>
      <div class="smw_card_data">
        <small>Última actividad</small>
        <strong>${x(s.ultimaActividad)}</strong>
      </div>
    </div>
    <div class="smw_card" style="--d:.21s">
      <span class="smw_card_ico"><i class="fas fa-at"></i></span>
      <div class="smw_card_data">
        <small>Usuario</small>
        <strong>@${s.usuario||o.toLowerCase()}</strong>
      </div>
    </div>
  `),e("#smwMotiv").html(`
    <div class="smw_motiv_inner">
      <span class="smw_motiv_ico"><i class="fas ${c.ico}"></i></span>
      <div class="smw_motiv_txt">
        <small>Para ti, ${o} 💛</small>
        <p>${c.txt}</p>
      </div>
    </div>
  `)},q=()=>{console.log("🧹 Smile Home")};export{q as cleanup,T as init,H as render};
