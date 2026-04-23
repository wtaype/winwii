const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/main-CuczXLwU.js","assets/vendor-gzd0YkcT.js"])))=>i.map(i=>d[i]);
import{_ as D,N as q,d as M,C as S,a as I,g,S as T,f as R,s as y,e as K}from"./main-CuczXLwU.js";import{j as c}from"./vendor-gzd0YkcT.js";import{db as r}from"./firebase-Lfd52dYI.js";import{g as l,q as n,c as _,w as v,b as C,l as b}from"./firebase-Cdwg_wrl.js";const x=()=>g("wiSmile"),k="epTotalEmpleados",$="epTotalEquipos",E="epMetricas",w="epFeed",z=async()=>{const s=x();if(!s)return'<div class="epd_page"><div class="epd_empty"><i class="fas fa-lock"></i><p>Sin sesión activa.</p></div></div>';const e=q(s.nombres||s.nombre||"Administrador"),a=M(s.nombres||s.nombre||""),i=s.foto||null,d=S(s.empresa||I),o=g(k)??"—",u=g($)??"—",f=g(E)||{wpm:"—",cert:"—"},m=[{page:"empleados",ico:"fa-id-badge",color:"#38bdf8",tit:"Colaboradores",sub:"Gestión de nómina"},{page:"equipos",ico:"fa-users-gear",color:"#8b5cf6",tit:"Departamentos",sub:"Organización de áreas"},{page:"reportes",ico:"fa-chart-pie",color:"#f59e0b",tit:"Analítica",sub:"Métricas y estadísticas"},{page:"certificados",ico:"fa-certificate",color:"#10b981",tit:"Certificados",sub:"Diplomas oficiales"},{page:"mensajes",ico:"fa-envelope-open-text",color:"#ec4899",tit:"Comunicados",sub:"Avisos internos"},{page:"perfil",ico:"fa-building-user",color:"#64748b",tit:"Perfil",sub:"Configuración corporativa"}];return`
  <div class="epd_page">

    <!-- HERO PRO -->
    <div class="epd_hero">
      <div class="epd_hero_left">
        <div class="epd_avatar_wrap">
          <div class="epd_avatar_glow"></div>
          <div class="epd_avatar">
            ${i?`<img src="${i}" alt="${e}" onerror="this.parentElement.innerHTML='${a}'">`:a}
          </div>
        </div>
        <div class="epd_hero_txt">
          <p class="epd_saludo">${T()}</p>
          <h1 class="epd_nombre">${e.split(" ")[0]}</h1>
          <div class="epd_tags">
            <span class="epd_tag"><i class="fas fa-crown"></i> Admin. Corporativo</span>
            <span class="epd_tag"><i class="fas fa-building"></i> ${d}</span>
          </div>
        </div>
      </div>
      <div class="epd_hero_right">
        <div class="epd_date"><i class="fas fa-calendar-alt"></i> ${R()}</div>
      </div>
    </div>

    <!-- KPI GRID -->
    <div class="epd_kpi_grid">
      <div class="epd_kpi_card" style="--kc:#38bdf8">
        <div class="epd_kpi_icon"><i class="fas fa-user-tie"></i></div>
        <div class="epd_kpi_val" id="epd_k_emp">${o}</div>
        <div class="epd_kpi_lbl">Colaboradores Totales</div>
      </div>
      <div class="epd_kpi_card" style="--kc:#8b5cf6">
        <div class="epd_kpi_icon"><i class="fas fa-sitemap"></i></div>
        <div class="epd_kpi_val" id="epd_k_eqp">${u}</div>
        <div class="epd_kpi_lbl">Departamentos Activos</div>
      </div>
      <div class="epd_kpi_card" style="--kc:#f59e0b">
        <div class="epd_kpi_icon"><i class="fas fa-bolt"></i></div>
        <div class="epd_kpi_val" id="epd_k_wpm">${f.wpm}</div>
        <div class="epd_kpi_lbl">WPM Corporativo</div>
      </div>
      <div class="epd_kpi_card" style="--kc:#10b981">
        <div class="epd_kpi_icon"><i class="fas fa-award"></i></div>
        <div class="epd_kpi_val" id="epd_k_cert">${f.cert}</div>
        <div class="epd_kpi_lbl">Personal Certificado</div>
      </div>
    </div>

    <!-- ACCESOS GRID -->
    <h2 class="epd_sec_title"><i class="fas fa-layer-group"></i> Módulos Corporativos</h2>
    <div class="epd_acc_grid">
      ${m.map(t=>`
        <a href="/${t.page}" class="epd_acc_card nv_item" data-page="${t.page}" style="--ac:${t.color}">
          <div class="epd_acc_icon"><i class="fas ${t.ico}"></i></div>
          <div class="epd_acc_info">
            <div class="epd_acc_tit">${t.tit}</div>
            <div class="epd_acc_sub">${t.sub}</div>
          </div>
          <i class="fas fa-arrow-right epd_acc_arr"></i>
        </a>
      `).join("")}
    </div>

    <!-- FEED RECIENTE -->
    <div class="epd_feed_wrap">
      <div class="epd_feed_hdr">
        <h2 class="epd_feed_title"><i class="fas fa-satellite-dish"></i> Actividad Reciente</h2>
        <button class="epd_feed_btn" id="epd_btn_sync"><i class="fas fa-sync-alt"></i> Actualizar</button>
      </div>
      <div id="epd_feed_body">
        <div class="epd_empty"><i class="fas fa-spinner fa-spin"></i><p>Sincronizando entrenamientos...</p></div>
      </div>
    </div>

  </div>`},W=async()=>{const s=x();s&&(c(document).off(".epd"),await P(s),c(document).on("click.epd",".nv_item",function(e){e.preventDefault();const a=c(this).data("page");a&&D(async()=>{const{rutas:i}=await import("./main-CuczXLwU.js").then(d=>d.x);return{rutas:i}},__vite__mapDeps([0,1])).then(({rutas:i})=>i.navigate(`/${a}`))}),c(document).on("click.epd","#epd_btn_sync",async function(){const e=c(this).find("i").addClass("fa-spin");[k,$,E,w].forEach(a=>localStorage.removeItem(a)),await P(s,!0),setTimeout(()=>e.removeClass("fa-spin"),500)}))},L=()=>{c(document).off(".epd")};async function P(s,e=!1){await Promise.all([F(s,e),O(s,e)])}async function F(s,e){if(!(!e&&g(k)!=null))try{let a=await l(n(_(r,"lecciones"),v("empresa_id","==",s.usuario)));a.empty&&(a=await l(n(_(r,"lecciones"),v("gestor_id","==",s.usuario))));const i=a.docs.map(p=>p.data()),d=i.length,o=i.map(p=>p.wpmMax||0),u=d>0?Math.round(o.reduce((p,A)=>p+A,0)/d):0,f=i.filter(p=>(p.completadas?.length||0)>=45&&(p.wpmMax||0)>=80).length;let m=await l(n(_(r,"clases"),v("empresa_id","==",s.usuario)));m.empty&&(m=await l(n(_(r,"clases"),v("gestor_id","==",s.usuario))));const t=m.size;y(k,d,2),y($,t,2),y(E,{wpm:u,cert:f},2),c("#epd_k_emp").text(d),c("#epd_k_eqp").text(t),c("#epd_k_wpm").text(u||"—"),c("#epd_k_cert").text(f)}catch(a){console.error("[empresa] KPI Error",a)}}async function O(s,e){if(!e){const a=g(w);if(a?.length){h(a);return}}try{let a=await l(n(_(r,"lecciones"),v("empresa_id","==",s.usuario),C("ultPractica","desc"),b(10)));a.empty&&(a=await l(n(_(r,"lecciones"),v("gestor_id","==",s.usuario),C("ultPractica","desc"),b(10))));const i=a.docs.map(d=>({usuario:d.id,...d.data()}));y(w,i,1/12),h(i)}catch{try{let i=await l(n(_(r,"lecciones"),v("empresa_id","==",s.usuario),b(10)));i.empty&&(i=await l(n(_(r,"lecciones"),v("gestor_id","==",s.usuario),b(10))));const d=i.docs.map(o=>({usuario:o.id,...o.data()}));h(d)}catch{h([])}}}function h(s){if(!s.length){c("#epd_feed_body").html(`
      <div class="epd_empty">
        <i class="fas fa-ghost"></i>
        <p>No hay actividad registrada aún.</p>
      </div>`);return}const e=s.map(a=>{const i=a.nombre||a.usuario||"—",d=M(i),o=a.equipo_id||a.clase_id||a.claseId||"General",u=a.wpmMax||0,f=a.precision||0,m=a.ultPractica?.toDate?K(a.ultPractica):"Reciente";return`
      <div class="epd_feed_item">
        <div class="epd_fi_av">${d}</div>
        <div class="epd_fi_main">
          <div class="epd_fi_head">
            <span class="epd_fi_nom">${i}</span>
            <span class="epd_fi_dep"><i class="fas fa-building"></i> ${o}</span>
          </div>
          <div class="epd_fi_metrics">
            <div class="epd_fi_met w"><i class="fas fa-bolt"></i> ${u} WPM</div>
            <div class="epd_fi_met p"><i class="fas fa-bullseye"></i> ${f}%</div>
          </div>
        </div>
        <div class="epd_fi_time">${m}</div>
      </div>`}).join("");c("#epd_feed_body").html(`<div class="epd_feed_list">${e}</div>`)}export{L as cleanup,W as init,z as render};
