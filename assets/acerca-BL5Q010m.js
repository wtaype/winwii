import{j as c}from"./vendor-gzd0YkcT.js";import{a as o,v as p,l as v,b as f,w as e,c as g,y as u,d as b}from"./main-B0GSvCsW.js";import"./main-D_fbEcK-.js";const h=[{num:"7",label:"Módulos inteligentes",icon:"fa-layer-group",color:"#0EBEFF"},{num:"100%",label:"Gratis para siempre",icon:"fa-heart",color:"#FF5C69"},{num:"2026",label:"Actualizado",icon:"fa-calendar-check",color:"#29C72E"},{num:"24h",label:"Organización total",icon:"fa-clock",color:"#7000FF"}],$=[{icon:"fa-calendar-week",color:"Cielo",titulo:"Horario Semanal Visual",desc:"Visualiza toda tu semana en un solo lugar. Arrastra, organiza y gestiona cada bloque de tiempo con un calendario inteligente que se adapta a tu ritmo."},{icon:"fa-folder-open",color:"Dulce",titulo:"Tareas Scrum Board",desc:"Gestiona tus tareas con un tablero Kanban estilo Scrum. De Pendiente a Hecho, arrastra y mueve tus tareas con fluidez profesional."},{icon:"fa-rocket",color:"Paz",titulo:"Planes & Metas",desc:"Define proyectos, establece pasos y realiza seguimiento de tus metas personales y profesionales con indicadores de progreso visuales."},{icon:"fa-table-cells",color:"Mora",titulo:"Vista Semanal Completa",desc:"Los 7 días de tu semana en una sola pantalla. Compara, planifica y equilibra tu carga diaria de actividades con total claridad."},{icon:"fa-calendar-days",color:"Cielo",titulo:"Calendario Mensual",desc:"Tu mes completo de un vistazo. Agrega eventos, gestiona prioridades y nunca pierdas una fecha importante."},{icon:"fa-trophy",color:"Dulce",titulo:"Sistema de Logros & XP",desc:"Registra tus éxitos, gana experiencia y sube de nivel. Tu historial de logros personales y profesionales siempre a mano."}],d=[{icon:"fa-calendar-week",color:"#0EBEFF",nombre:"Horario",desc:"Gestiona tu semana",url:"/horario"},{icon:"fa-folder-open",color:"#FF5C69",nombre:"Tareas",desc:"Board Kanban Scrum",url:"/tareas"},{icon:"fa-rocket",color:"#29C72E",nombre:"Planes",desc:"Metas y proyectos",url:"/planes"},{icon:"fa-table-cells",color:"#7000FF",nombre:"Semanal",desc:"Los 7 días de un vistazo",url:"/semanal"},{icon:"fa-calendar-days",color:"#FFB800",nombre:"Mes",desc:"Calendario mensual",url:"/mes"},{icon:"fa-trophy",color:"#FF8C00",nombre:"Logros",desc:"XP y reconocimientos",url:"/logros"}],_=[{num:"1",icon:"fa-user-plus",titulo:"Crea tu cuenta",desc:"Regístrate gratis en segundos. Tus datos sincronizados en todos tus dispositivos."},{num:"2",icon:"fa-calendar",titulo:"Planifica tu semana",desc:"Agrega eventos al horario, crea tareas y define tus metas del mes."},{num:"3",icon:"fa-chart-line",titulo:"Mide tu progreso",desc:"Revisa tus logros, gana XP y mantén el control de cada objetivo conseguido."}],y=[{icon:"fa-bullseye",color:"#FF5C69",titulo:"Nuestra Misión",desc:"Ayudar a cada persona a organizar su tiempo como un profesional. Con herramientas visuales, intuitivas y completamente gratuitas para dominar tu semana."},{icon:"fa-eye",color:"#0EBEFF",titulo:"Nuestra Visión",desc:"Convertirnos en el planificador personal más completo en español, donde cada persona pueda gestionar su horario, tareas, metas y logros en un solo lugar."},{icon:"fa-heart",color:"#29C72E",titulo:"Nuestros Valores",desc:"Gratuidad, diseño elegante, sincronización en la nube y mejora continua. Tu productividad personal es nuestra prioridad número uno."}],w=[{avatar:"👩‍💼",nombre:"Carla Mendoza",rol:"Gerente de Proyectos",texto:"Winwii cambió cómo planifico mi semana. El tablero Kanban es perfecto y el horario visual me ahorra mucho tiempo.",estrellas:5},{avatar:"👨‍🎓",nombre:"Diego Torres",rol:"Estudiante Universitario",texto:"Uso el módulo de Planes para mis proyectos académicos. El sistema de XP y logros me mantiene motivado cada día.",estrellas:5},{avatar:"👩‍💻",nombre:"Sofía Quispe",rol:"Desarrolladora Freelance",texto:"La vista semanal con los 7 días es increíble. Puedo ver toda mi carga de trabajo y balancearla perfectamente.",estrellas:5},{avatar:"👨‍🏫",nombre:"Marco Llanos",rol:"Docente y Coach",texto:"Recomiendo Winwii a todos mis alumnos. Es simple, elegante y tiene todo lo que necesitan para ser más productivos.",estrellas:5}],F=[{icon:"fab fa-js",label:"JavaScript ES6+",color:"#FFB800"},{icon:"fab fa-css3-alt",label:"CSS3 Moderno",color:"#0EBEFF"},{icon:"fab fa-html5",label:"HTML5",color:"#FF5C69"},{icon:"fas fa-fire",label:"Firebase",color:"#FF8C00"},{icon:"fas fa-bolt",label:"Vite",color:"#7000FF"},{icon:"fas fa-mobile-screen",label:"Responsive",color:"#29C72E"}],z=()=>`
<div class="ac_wrap">

  <!-- ══ HERO ══ -->
  <section class="ac_hero">
    <div class="ac_hero_orb ac_orb1"></div>
    <div class="ac_hero_orb ac_orb2"></div>
    <div class="ac_hero_orb ac_orb3"></div>
    <div class="ac_hero_body">
      <div class="ac_hero_logo">
        <img src="/winwii/logo.webp" alt="${o}" loading="lazy">
      </div>
      <div class="ac_hero_badge"><i class="fas fa-calendar-check"></i> Planificador Semanal Profesional</div>
      <h1 class="ac_hero_tit">${o}</h1>
      <p class="ac_hero_sub">
        Tu semana, <strong>perfectamente organizada</strong>. Horario visual, tareas Kanban,
        metas con seguimiento y logros con XP. Todo en un solo lugar, 
        <strong>100% gratis</strong>.
      </p>
      <div class="ac_hero_stats">
        ${h.map(a=>`
          <div class="ac_stat" style="--sc:${a.color}">
            <i class="fas ${a.icon}" style="color:${a.color}"></i>
            <strong>${a.num}</strong>
            <span>${a.label}</span>
          </div>`).join("")}
      </div>
      <div class="ac_hero_btns">
        <a href="/horario" class="ac_btn_p"><i class="fas fa-calendar-week"></i> Ver mi semana</a>
        <button class="ac_btn_s" id="ac_compartir"><i class="fas fa-share-nodes"></i> Compartir</button>
      </div>
      <div class="ac_hero_scroll"><i class="fas fa-chevron-down"></i></div>
    </div>
  </section>

  <!-- ══ COUNTER BAND ══ -->
  <div class="ac_counter_band">
    <div class="ac_counter_item">
      <span class="ac_counter_num" data-target="7">0</span>
      <p>Módulos inteligentes</p>
    </div>
    <div class="ac_counter_sep"></div>
    <div class="ac_counter_item">
      <span class="ac_counter_num" data-target="100">0</span><span>%</span>
      <p>Gratis para siempre</p>
    </div>
    <div class="ac_counter_sep"></div>
    <div class="ac_counter_item">
      <span class="ac_counter_num" data-target="5">0</span>
      <p>Temas de color</p>
    </div>
    <div class="ac_counter_sep"></div>
    <div class="ac_counter_item">
      <span class="ac_counter_num" data-target="2026">0</span>
      <p>Siempre actualizado</p>
    </div>
  </div>

  <!-- ══ MÓDULOS ══ -->
  <section class="ac_sec">
    <div class="ac_sec_head">
      <div class="ac_sec_badge"><i class="fas fa-layer-group"></i> Módulos</div>
      <h2 class="ac_sec_tit">Todo lo que necesitas para <span class="ac_grad">dominar tu semana</span></h2>
      <p class="ac_sec_sub">6 módulos diseñados para que nunca pierdas el control de tu tiempo</p>
    </div>
    <div class="ac_modulos_grid">
      ${d.map(a=>`
        <a href="${a.url}" class="ac_modulo_card wi_fadeUp" style="--mc:${a.color}">
          <div class="ac_modulo_ico"><i class="fas ${a.icon}"></i></div>
          <div class="ac_modulo_info">
            <strong>${a.nombre}</strong>
            <span>${a.desc}</span>
          </div>
          <div class="ac_modulo_arr"><i class="fas fa-arrow-right"></i></div>
        </a>`).join("")}
    </div>
  </section>

  <!-- ══ BENEFICIOS ══ -->
  <section class="ac_sec ac_sec_alt">
    <div class="ac_sec_head">
      <div class="ac_sec_badge"><i class="fas fa-star"></i> ¿Por qué Winwii?</div>
      <h2 class="ac_sec_tit">Beneficios reales para <span class="ac_grad">tu productividad</span></h2>
      <p class="ac_sec_sub">Cada módulo resuelve un problema real de organización personal</p>
    </div>
    <div class="ac_feat_grid">
      ${$.map(a=>`
        <div class="ac_feat_card wi_fadeUp ac_color_${a.color.toLowerCase()}">
          <div class="ac_feat_ico"><i class="fas ${a.icon}"></i></div>
          <h3>${a.titulo}</h3>
          <p>${a.desc}</p>
        </div>`).join("")}
    </div>
  </section>

  <!-- ══ CÓMO FUNCIONA ══ -->
  <section class="ac_sec">
    <div class="ac_sec_head">
      <div class="ac_sec_badge"><i class="fas fa-route"></i> Cómo funciona</div>
      <h2 class="ac_sec_tit">3 pasos para <span class="ac_grad">empezar hoy</span></h2>
      <p class="ac_sec_sub">Sin complicaciones. En minutos tendrás tu semana bajo control</p>
    </div>
    <div class="ac_pasos">
      ${_.map((a,s)=>`
        <div class="ac_paso wi_fadeUp">
          <div class="ac_paso_num">${a.num}</div>
          <div class="ac_paso_ico"><i class="fas ${a.icon}"></i></div>
          <h3>${a.titulo}</h3>
          <p>${a.desc}</p>
        </div>
        ${s<_.length-1?'<div class="ac_paso_sep"><i class="fas fa-chevron-right"></i></div>':""}`).join("")}
    </div>
  </section>

  <!-- ══ TESTIMONIOS ══ -->
  <section class="ac_sec ac_sec_alt">
    <div class="ac_sec_head">
      <div class="ac_sec_badge"><i class="fas fa-comments"></i> Testimonios</div>
      <h2 class="ac_sec_tit">Personas que ya organizan <span class="ac_grad">su semana mejor</span></h2>
      <p class="ac_sec_sub">Descubre cómo Winwii transforma la productividad real de las personas</p>
    </div>
    <div class="ac_test_grid">
      ${w.map(a=>`
        <div class="ac_test_card wi_fadeUp">
          <div class="ac_test_stars">${'<i class="fas fa-star"></i>'.repeat(a.estrellas)}</div>
          <p class="ac_test_txt">"${a.texto}"</p>
          <div class="ac_test_autor">
            <span class="ac_test_avatar">${a.avatar}</span>
            <div><strong>${a.nombre}</strong><span>${a.rol}</span></div>
          </div>
        </div>`).join("")}
    </div>
  </section>

  <!-- ══ MISIÓN / VISIÓN ══ -->
  <section class="ac_sec">
    <div class="ac_sec_head">
      <div class="ac_sec_badge"><i class="fas fa-bullseye"></i> Misión y Visión</div>
      <h2 class="ac_sec_tit">Lo que nos <span class="ac_grad">impulsa cada día</span></h2>
    </div>
    <div class="ac_mv_grid">
      ${y.map(a=>`
        <div class="ac_mv_card wi_fadeUp" style="--mc:${a.color}">
          <div class="ac_mv_ico" style="background:${a.color}"><i class="fas ${a.icon}"></i></div>
          <h3>${a.titulo}</h3>
          <p>${a.desc}</p>
        </div>`).join("")}
    </div>
  </section>

  <!-- ══ TECNOLOGÍA ══ -->
  <section class="ac_sec ac_sec_alt">
    <div class="ac_sec_head">
      <div class="ac_sec_badge"><i class="fas fa-code"></i> Stack técnico</div>
      <h2 class="ac_sec_tit">Construido con <span class="ac_grad">lo mejor</span></h2>
      <p class="ac_sec_sub">Tecnología moderna para una experiencia rápida y confiable</p>
    </div>
    <div class="ac_tech_grid">
      ${F.map(a=>`
        <div class="ac_tech_item wi_fadeUp" style="--tc:${a.color}">
          <i class="${a.icon}" style="color:${a.color}"></i>
          <span>${a.label}</span>
        </div>`).join("")}
    </div>
  </section>

  <!-- ══ CTA ══ -->
  <section class="ac_cta_sec">
    <div class="ac_cta_wrap wi_fadeUp">
      <div class="ac_cta_glow"></div>
      <div class="ac_cta_particles">
        ${Array.from({length:6}).map(()=>'<span class="ac_particle"></span>').join("")}
      </div>
      <div class="ac_cta_inner">
        <span class="ac_cta_emoji">📅</span>
        <h2>¿Listo para dominar<br>tu semana?</h2>
        <p>Empieza ahora, es completamente gratis y sin registro obligatorio</p>
        <div class="ac_cta_chips">
          ${d.map(a=>`
            <a href="${a.url}" class="ac_chip" style="--cc:${a.color}" ${b(a.desc)}>
              <i class="fas ${a.icon}"></i> ${a.nombre}
            </a>`).join("")}
        </div>
        <div class="ac_cta_btns">
          <a href="/horario" class="ac_btn_p ac_btn_lg"><i class="fas fa-calendar-week"></i> Organizar mi semana</a>
          <a href="/" class="ac_btn_s ac_btn_lg"><i class="fas fa-house"></i> Ir al Inicio</a>
        </div>
        <p class="ac_footer_txt">
          ${o} ${p} · Hecho con <i class="fas fa-heart"></i> por
          <a href="${v}" target="_blank" rel="noopener">${f}</a> · ${u()}
        </p>
      </div>
    </div>
  </section>

</div>`,C=()=>{c(".ac_counter_num").each(function(){const a=c(this),s=+a.data("target"),i=1800;let n=null;const r=l=>{n||(n=l);const t=Math.min((l-n)/i,1),m=1-Math.pow(1-t,3);a.text(Math.floor(m*s).toLocaleString()),t<1&&requestAnimationFrame(r)};requestAnimationFrame(r)})},T=()=>{e(".ac_modulo_card",null,{anim:"wi_fadeUp",stagger:60}),e(".ac_feat_card",null,{anim:"wi_fadeUp",stagger:80}),e(".ac_paso",null,{anim:"wi_fadeUp",stagger:120}),e(".ac_mv_card",null,{anim:"wi_fadeUp",stagger:100}),e(".ac_tech_item",null,{anim:"wi_fadeUp",stagger:60}),e(".ac_test_card",null,{anim:"wi_fadeUp",stagger:80}),e(".ac_cta_wrap",null,{anim:"wi_fadeUp"});const a=c(".ac_counter_band")[0];if(a){const s=new IntersectionObserver(([i])=>{i.isIntersecting&&(C(),s.disconnect())},{threshold:.3});s.observe(a)}c("#ac_compartir").on("click",function(){const s="https://winwii.web.app/";navigator.share?navigator.share({title:o,text:`📅 ${o} — Planificador Semanal Profesional`,url:s}).catch(()=>{}):g(s,this,"¡Link copiado! ✨")}),console.log(`📖 ${o} ${p} · Acerca ${u()}`)},j=()=>{c("#ac_compartir").off("click"),console.log("🧹 Acerca")};export{j as cleanup,T as init,z as render};
