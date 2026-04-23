const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/main-CuczXLwU.js","assets/vendor-gzd0YkcT.js"])))=>i.map(i=>d[i]);
import{g as r,s as p,_ as P,N as M,d as x,S as R,C as D,a as F,f as K,e as O}from"./main-CuczXLwU.js";import{j as e}from"./vendor-gzd0YkcT.js";import{db as _}from"./firebase-Lfd52dYI.js";import{q as g,l as w,w as u,c as f,a as V,g as m,b as A}from"./firebase-Cdwg_wrl.js";const T=()=>r("wiSmile"),$="gsTotalAlumnos",y="gsTotalClases",C="gsFeedReciente",k="gsMetricas",b={feedSub:null},B=async()=>{const a=T();if(!a)return`
    <div class="gs_page">
      <div class="gs_empty"><i class="fas fa-lock"></i><p>Sin sesión activa.</p></div>
    </div>`;const o=M(a.nombres||a.nombre||"Instructor"),s=x(a.nombres||a.nombre||""),t=a.foto||null,i=r($)??"—",l=r(y)??"—",n=r(k)||{},v=[{page:"misclases",ico:"fa-chalkboard-teacher",color:"#6366f1",title:"Aulas",sub:"Crea y gestiona tus clases"},{page:"alumnos",ico:"fa-users",color:"#0ea5e9",title:"Estudiantes",sub:"Métricas y asignaciones"},{page:"calificaciones",ico:"fa-chart-bar",color:"#f59e0b",title:"Rankings",sub:"Podio de rendimiento"},{page:"buscar",ico:"fa-search",color:"#22c55e",title:"Búsqueda",sub:"Historial detallado"},{page:"mensajes",ico:"fa-paper-plane",color:"#ec4899",title:"Notificaciones",sub:"Comunicados oficiales"},{page:"perfil",ico:"fa-user-shield",color:"#a855f7",title:"Mi Cuenta",sub:"Configuración personal"}];return`
  <div class="gs_page">
    <div class="gs_ambient"></div>

    <!-- ══ HERO PREMIUM ══ -->
    <div class="gs_hero">
      <div class="gs_hero_main">
        <div class="gs_av_container">
          <div class="gs_av_glow"></div>
          <div class="gs_av">
            ${t?`<img src="${t}" alt="${o}" onerror="this.parentElement.innerHTML='${s}'">`:s}
          </div>
        </div>
        <div class="gs_hero_text">
          <p class="gs_hero_saludo">${R()}</p>
          <h1 class="gs_hero_nombre">${o.split(" ")[0]}</h1>
          <div class="gs_hero_tags">
            <span class="gs_tag"><i class="fas fa-crown"></i> Admin. Aula</span>
            <span class="gs_tag"><i class="fas fa-school"></i> ${D(a.empresa||F)}</span>
          </div>
        </div>
      </div>
      <div class="gs_hero_right">
        <div class="gs_date"><i class="fas fa-calendar-alt"></i> ${K()}</div>
        <div class="gs_rt_toggle" id="gs_btn_rt" title="Monitoreo de prácticas en vivo">
          <div class="gs_rt_dot"></div>
          <span class="gs_rt_txt">En Vivo</span>
        </div>
      </div>
    </div>

    <!-- ══ KPI GRID ══ -->
    <div class="gs_kpi_grid">
      ${[{id:"gs_k_alumnos",ico:"fa-user-graduate",col:"#0ea5e9",lbl:"Alumnos Activos",val:i},{id:"gs_k_clases",ico:"fa-layer-group",col:"#6366f1",lbl:"Aulas Creadas",val:l},{id:"gs_k_wpm",ico:"fa-bolt",col:"#f59e0b",lbl:"Promedio WPM",val:n.wpm||"—"},{id:"gs_k_cert",ico:"fa-award",col:"#22c55e",lbl:"Certificados",val:n.cert||0}].map(c=>`
        <div class="gs_kpi_card" style="--kc:${c.col}">
          <div class="gs_kpi_top">
            <div class="gs_kpi_ico"><i class="fas ${c.ico}"></i></div>
          </div>
          <div class="gs_kpi_val" id="${c.id}">${c.val}</div>
          <div class="gs_kpi_lbl">${c.lbl}</div>
        </div>`).join("")}
    </div>

    <!-- ══ ACCESOS ══ -->
    <div class="gs_sec_hdr">
      <i class="fas fa-grip-horizontal"></i> Herramientas
    </div>
    <div class="gs_access_grid">
      ${v.map(c=>`
        <a href="/${c.page}" class="gs_ac_card nv_item" data-page="${c.page}" style="--ac:${c.color}">
          <div class="gs_ac_ico"><i class="fas ${c.ico}"></i></div>
          <div class="gs_ac_info">
            <div class="gs_ac_tit">${c.title}</div>
            <div class="gs_ac_sub">${c.sub}</div>
          </div>
          <i class="fas fa-arrow-right gs_ac_arr"></i>
        </a>`).join("")}
    </div>

    <!-- ══ FEED EN VIVO ══ -->
    <div class="gs_sec_hdr" style="margin-top:1.5vh">
      <i class="fas fa-chart-line"></i> Últimas Prácticas
      <div class="gs_feed_tools">
        <span class="gs_badge_count" id="gs_feed_num">—</span>
        <button class="gs_btn_sync" id="gs_refresh" title="Actualizar datos"><i class="fas fa-sync-alt"></i></button>
      </div>
    </div>
    <div class="gs_feed_wrap" id="gs_feed">
      <div class="gs_feed_empty">
        <i class="fas fa-spinner fa-spin" style="font-size:3vh;margin-bottom:1vh"></i>
        <p>Cargando registros...</p>
      </div>
    </div>

  </div>`},W=async()=>{const a=T();if(!a)return;e(document).off(".gs");const o=r("gsRealTime")===!0;o&&e("#gs_btn_rt").addClass("active"),await E(a),o&&S(a),e(document).on("click.gs","#gs_btn_rt",function(){const s=!e(this).hasClass("active");e(this).toggleClass("active",s),p("gsRealTime",s,24*365),s?S(a):(b.feedSub?.(),b.feedSub=null)}),e(document).on("click.gs","#gs_refresh",async function(){const s=e(this).find("i").addClass("fa-spin");[$,y,C,k].forEach(t=>localStorage.removeItem(t)),await E(a,!0),setTimeout(()=>s.removeClass("fa-spin"),500)}),e(document).on("click.gs",".nv_item",function(s){s.preventDefault();const t=e(this).data("page");t&&P(async()=>{const{rutas:i}=await import("./main-CuczXLwU.js").then(l=>l.x);return{rutas:i}},__vite__mapDeps([0,1])).then(({rutas:i})=>i.navigate(`/${t}`))}),e(document).on("click.gs",".gs_fi_btn",function(){const s=e(this).data("usuario");p("gsBuscarTerm",s,1/60),P(async()=>{const{rutas:t}=await import("./main-CuczXLwU.js").then(i=>i.x);return{rutas:t}},__vite__mapDeps([0,1])).then(({rutas:t})=>t.navigate("/buscar"))})},G=()=>{b.feedSub?.(),e(document).off(".gs")};async function E(a,o=!1){await Promise.all([j(a,o),H(a,o)])}async function j(a,o=!1){if(!o){const s=r($),t=r(y),i=r(k);if(s!=null&&e("#gs_k_alumnos").text(s),t!=null&&e("#gs_k_clases").text(t),i?.wpm&&e("#gs_k_wpm").text(i.wpm),i?.cert!=null&&e("#gs_k_cert").text(i.cert),s!=null&&t!=null&&i)return}try{let s=await m(g(f(_,"lecciones"),u("gestor_id","==",a.usuario)));s.empty&&(s=await m(g(f(_,"lecciones"),u("gestorId","==",a.usuario))));const t=s.docs.map(d=>d.data()),i=t.length,l=t.reduce((d,I)=>d+(I.wpmMax||0),0),n=i>0?Math.round(l/i):0,v=t.filter(d=>(d.completadas?.length||0)>=45&&(d.wpmMax||0)>=80).length;p($,i,2),p(k,{wpm:n,cert:v},2),e("#gs_k_alumnos").text(i),e("#gs_k_wpm").text(n||"—"),e("#gs_k_cert").text(v);let c=await m(g(f(_,"clases"),u("gestor_id","==",a.usuario)));c.empty&&(c=await m(g(f(_,"clases"),u("gestorId","==",a.usuario)))),p(y,c.size,2),e("#gs_k_clases").text(c.size)}catch(s){console.error("[gestor] Error KPIs",s)}}async function H(a,o=!1){if(!(!o&&r("gsRealTime")===!0)){if(!o){const s=r(C);if(s?.length){h(s);return}}try{let s=await m(g(f(_,"lecciones"),u("gestor_id","==",a.usuario),A("ultPractica","desc"),w(15)));s.empty&&(s=await m(g(f(_,"lecciones"),u("gestorId","==",a.usuario),A("ultPractica","desc"),w(15))));const t=s.docs.map(i=>({usuario:i.id,...i.data()}));p(C,t,1/12),h(t)}catch{try{const i=(await m(g(f(_,"lecciones"),u("gestor_id","==",a.usuario),w(15)))).docs.map(l=>({usuario:l.id,...l.data()}));h(i)}catch{h([])}}}}function S(a){b.feedSub?.();const o=g(f(_,"lecciones"),u("gestor_id","==",a.usuario),w(15));b.feedSub=V(o,s=>{const t=s.docs.map(i=>({usuario:i.id,...i.data()}));t.sort((i,l)=>{const n=i.ultPractica?.toDate?i.ultPractica.toDate().getTime():0;return(l.ultPractica?.toDate?l.ultPractica.toDate().getTime():0)-n}),h(t)})}function h(a){if(e("#gs_feed_num").text(a.length>0?`${a.length} Registros`:"0 Registros"),!a.length){e("#gs_feed").html(`
      <div class="gs_feed_empty">
        <i class="fas fa-ghost"></i>
        <p>No hay actividad registrada aún.<br><small>Tus alumnos aparecerán aquí al iniciar una lección.</small></p>
      </div>`);return}const o=a.map(s=>{const t=x(s.nombre||s.usuario||"A"),i=s.wpmMax||0,l=s.precision||0,n=s.completadas?.length||0,v=Math.round(n/45*100),c=s.clase_id||s.claseId||null,d=s.ultPractica?.toDate?O(s.ultPractica):"Reciente";return`
      <div class="gs_fi">
        <div class="gs_fi_av">${t}</div>
        <div class="gs_fi_main">
          <div class="gs_fi_head">
            <span class="gs_fi_nom">${s.nombre||s.usuario||"—"}</span>
            ${c?`<span class="gs_fi_clase"><i class="fas fa-chalkboard"></i> ${c}</span>`:""}
          </div>
          <div class="gs_fi_metrics">
            <div class="gs_fi_metric wpm"><i class="fas fa-bolt"></i> ${i} WPM</div>
            <div class="gs_fi_metric prec"><i class="fas fa-bullseye"></i> ${l}%</div>
            <div class="gs_fi_prog">
              <div class="gs_fi_track"><div class="gs_fi_fill" style="width:${v}%"></div></div>
              <span>${n}/45</span>
            </div>
          </div>
        </div>
        <div class="gs_fi_time">${d}</div>
        <button class="gs_fi_btn" data-usuario="${s.usuario}" title="Ver historial completo">
          <i class="fas fa-search"></i>
        </button>
      </div>`}).join("");e("#gs_feed").html(`<div class="gs_feed_list">${o}</div>`)}export{G as cleanup,W as init,B as render};
