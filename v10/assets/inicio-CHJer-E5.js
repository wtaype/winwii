import{j as t}from"./vendor-gzd0YkcT.js";import{a as d,l as v,b as m,v as r,w as n,S as u,d as i,y as f}from"./main-DUTIACxr.js";import"./main-Dq4azQ__.js";const g=["Organiza tu semana 📅","Tareas del día ✅","Notas profesionales 📝","Logros semanales 🏆"],h=[{valor:7,label:"Días planificados",sufijo:""},{valor:100,label:"Gratis",sufijo:"%"},{valor:2026,label:"Actualizado",sufijo:""},{valor:24,label:"Horas organizadas",sufijo:"h"}],l=[{id:"horario",icon:"fa-calendar-week",color:"#0EBEFF",nombre:"Horario",desc:"Visualiza y gestiona tu semana completa",items:[{icon:"fa-clock",name:"Vista semanal",desc:"Horario día a día organizado"},{icon:"fa-plus-circle",name:"Agregar eventos",desc:"Añade tareas con hora y día"},{icon:"fa-bell",name:"Recordatorios",desc:"Nunca olvides un compromiso"}]},{id:"planes",icon:"fa-list-check",color:"#29C72E",nombre:"Planes",desc:"Organiza tus tareas y pendientes del día",items:[{icon:"fa-check-square",name:"To-Do list",desc:"Lista de tareas por día"},{icon:"fa-flag",name:"Prioridades",desc:"Marca tus tareas más urgentes"},{icon:"fa-rotate",name:"Seguimiento",desc:"Controla tu progreso diario"}]},{id:"semanal",icon:"fa-table-cells",color:"#7000FF",nombre:"Semanal",desc:"Vista global de toda tu semana en un vistazo",items:[{icon:"fa-table",name:"Tabla semanal",desc:"Los 7 días en una sola vista"},{icon:"fa-note-sticky",name:"Notas por día",desc:"Block de notas por jornada"},{icon:"fa-chart-bar",name:"Resumen",desc:"Estadísticas de tu semana"}]},{id:"abiertos",icon:"fa-folder-open",color:"#FF5C69",nombre:"Abiertos",desc:"Proyectos y temas pendientes por cerrar",items:[{icon:"fa-circle-dot",name:"En progreso",desc:"Tareas que aún no terminan"},{icon:"fa-bookmark",name:"Guardados",desc:"Temas importantes marcados"},{icon:"fa-spinner",name:"Pendientes",desc:"Lo que queda por resolver"}]},{id:"mes",icon:"fa-calendar-days",color:"#FFB800",nombre:"Mes",desc:"Calendario mensual con vista de todos tus días",items:[{icon:"fa-calendar",name:"Vista mensual",desc:"Panorama del mes completo"},{icon:"fa-circle-check",name:"Días completados",desc:"Historial de días exitosos"},{icon:"fa-pen-to-square",name:"Planifica el mes",desc:"Agenda eventos futuros"}]},{id:"logros",icon:"fa-trophy",color:"#FF8C00",nombre:"Logros",desc:"Celebra tu progreso y hábitos semanales",items:[{icon:"fa-medal",name:"Metas cumplidas",desc:"Tus logros de la semana"},{icon:"fa-fire",name:"Racha",desc:"Días consecutivos activos"},{icon:"fa-chart-line",name:"Progreso",desc:"Evolución de tus hábitos"}]}],$=[{icon:"fa-brain",titulo:"Pensado para ti",desc:"Diseñado como el horario de un profesional real. Dos columnas: calendario y block de notas, todo en un solo lugar."},{icon:"fa-layer-group",titulo:"Todo organizado",desc:"Horario semanal, notas por día, to-do list, proyectos abiertos y logros. Tu semana entera bajo control."},{icon:"fa-rocket",titulo:"Rápido y elegante",desc:"Interfaz limpia, responde al instante y se adapta a tu estilo con 5 temas de color distintos."}],b=["Lun","Mar","Mié","Jue","Vie"],y=[{done:!0,txt:"Reunión equipo 9am"},{done:!0,txt:"Revisar propuesta"},{done:!1,txt:"Entrega informe",color:"#FFB800"},{done:!1,txt:"Llamada cliente",color:"#bbb"}],k=a=>`
  <div class="ini_stat">
    <div class="ini_stat_n" data-target="${a.valor}" data-sufijo="${a.sufijo}">0</div>
    <div class="ini_stat_l">${a.label}</div>
  </div>`,j=(a,s)=>`
  <div class="ini_prev_day${s===1?" active":""}">
    <span class="ini_prev_day_n">${a}</span>
    <div class="ini_prev_dots">
      <span class="ini_dot" style="background:#0EBEFF"></span>
      ${s<3?'<span class="ini_dot" style="background:#29C72E"></span>':""}
      ${s===1?'<span class="ini_dot" style="background:#FF5C69"></span>':""}
    </div>
  </div>`,w=a=>`
  <div class="ini_prev_task${a.done?"":" pending"}">
    <i class="fas ${a.done?"fa-check-circle":"fa-circle"}" style="color:${a.done?"#29C72E":a.color}"></i>
    ${a.txt}
  </div>`,F=a=>`
  <div class="ini_cat_card" style="--cc:${a.color}">
    <div class="ini_cat_bar"></div>
    <div class="ini_cat_top">
      <div class="ini_cat_ico"><i class="fas ${a.icon}"></i></div>
      <div class="ini_cat_info"><h3>${a.nombre}</h3><p>${a.desc}</p></div>
    </div>
    <ul class="ini_cat_tools">
      ${a.items.map(s=>`
        <li><a href="/${a.id}" class="ini_tool_a">
          <i class="fas ${s.icon}"></i>
          <div><strong>${s.name}</strong><span>${s.desc}</span></div>
          <i class="fas fa-arrow-right ini_ext"></i>
        </a></li>`).join("")}
    </ul>
  </div>`,C=(a,s)=>`
  <div class="ini_about_card" style="--d:${s*.15}s">
    <div class="ini_card_ico"><i class="fas ${a.icon}"></i></div>
    <h3>${a.titulo}</h3>
    <p>${a.desc}</p>
  </div>`,P=()=>`
<div class="ini_wrap">

  <!-- ===== HERO ===== -->
  <section class="ini_hero">
    <div class="ini_hero_content">

      <div class="ini_saludo" style="--d:0s">
        <span>${u()} Bienvenido!</span><span class="ini_wave">👋</span>
      </div>

      <h1 class="ini_titulo" style="--d:.18s">
        Organiza tu semana <span class="ini_grad">como un profesional</span>
      </h1>

      <div class="ini_roles" style="--d:.36s">
        ${g.map((a,s)=>`<span class="ini_role${s===0?" active":""}">${a}</span>`).join("")}
      </div>

      <p class="ini_sub" style="--d:.54s">
        Gestiona tu horario, tareas y notas diarias con un planificador inteligente.
        Calendario semanal, block de notas y to-do list en un solo lugar. 100% gratis.
      </p>

      <div class="ini_stats" id="in_stats" style="--d:.72s">
        ${h.map(k).join("")}
      </div>

      <div class="ini_btns" style="--d:.9s">
        <a href="/horario" class="ini_btn_p"><i class="fas fa-calendar-week"></i> Ver mi semana</a>
        <a href="/semanal" class="ini_btn_s"><i class="fas fa-table-cells"></i> Vista semanal</a>
      </div>

    </div>

    <!-- Derecha: preview -->
    <div class="ini_hero_visual">
      <div class="ini_planner_preview" style="--d:.3s">
        <div class="ini_prev_header">
          <i class="fas fa-calendar"></i>
          <span>Semana del ${new Date().toLocaleDateString("es-PE",{day:"2-digit",month:"short"})}</span>
          <span class="ini_prev_badge"><i class="fas fa-circle"></i> Hoy</span>
        </div>
        <div class="ini_prev_cols">
          <div class="ini_prev_left">${b.map(j).join("")}</div>
          <div class="ini_prev_right">
            <div class="ini_prev_note_title"><i class="fas fa-note-sticky"></i> Notas del día</div>
            ${y.map(w).join("")}
            <div class="ini_prev_add"><i class="fas fa-plus"></i> Agregar tarea...</div>
          </div>
        </div>
      </div>
      <div class="ini_ftech ini_ft1" style="--d:.5s"  ${i("Horario semanal")}><i class="fas fa-calendar-week"></i></div>
      <div class="ini_ftech ini_ft2" style="--d:.65s" ${i("To-Do list")}><i class="fas fa-list-check"></i></div>
      <div class="ini_ftech ini_ft3" style="--d:.8s"  ${i("Notas diarias")}><i class="fas fa-note-sticky"></i></div>
      <div class="ini_ftech ini_ft4" style="--d:.95s" ${i("Tus logros")}><i class="fas fa-trophy"></i></div>
    </div>
  </section>

  <!-- ===== FUNCIONALIDADES ===== -->
  <section class="ini_cats_sec">
    <div class="ini_sec_head">
      <h2 class="ini_sec_tit">Todo lo que <span class="ini_grad">necesitas</span></h2>
      <div class="ini_sec_line"></div>
      <p class="ini_sec_desc">6 módulos diseñados para que nunca pierdas el control de tu semana</p>
    </div>
    <div class="ini_cats_grid">${l.map(F).join("")}</div>
  </section>

  <!-- ===== ¿POR QUÉ? ===== -->
  <section class="ini_about_sec">
    <div class="ini_sec_head">
      <h2 class="ini_sec_tit">¿Por qué <span class="ini_grad">${d}?</span></h2>
      <div class="ini_sec_line"></div>
    </div>
    <div class="ini_about_grid">${$.map(C).join("")}</div>
  </section>

  <!-- ===== CTA ===== -->
  <section class="ini_cta_sec">
    <div class="ini_cta_wrap">
      <i class="fas fa-calendar-check ini_cta_ico"></i>
      <h2>¿Listo para organizar tu semana?</h2>
      <p>Empieza ahora, es completamente gratis</p>
      <div class="ini_cta_chips">
        ${l.map(a=>`<a href="/${a.id}" class="ini_chip" style="--cc:${a.color}" ${i(a.desc)}><i class="fas ${a.icon}"></i> ${a.nombre}</a>`).join("")}
      </div>
      <p class="ini_cta_autor">Creado con ❤️ por <a href="${v}" target="_blank" rel="noopener">${m}</a> · ${r} © ${f()}</p>
    </div>
  </section>

</div>`,z=()=>{let a=0;const s=t(".ini_role");setInterval(()=>{s.removeClass("active"),s.eq(a=(a+1)%s.length).addClass("active")},2800),n("#in_stats",()=>{t(".ini_stat_n").each(function(){const e=t(this),o=+e.data("target"),p=e.data("sufijo")||"";let c=0;const _=setInterval(()=>{c+=o/50,c>=o?(e.text(o+p),clearInterval(_)):e.text(Math.floor(c))},28)})}),n(".ini_cat_card",null,{anim:"wi_fadeUp",stagger:80}),n(".ini_about_card",null,{anim:"wi_fadeUp",stagger:140}),n(".ini_cta_wrap",null,{anim:"wi_fadeUp"}),console.log(`📅 ${d} ${r} · Inicio OK`)},q=()=>console.log("🧹 Inicio limpiado");export{q as cleanup,z as init,P as render};
