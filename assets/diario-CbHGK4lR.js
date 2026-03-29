import{j as d}from"./vendor-gzd0YkcT.js";import{db as I}from"./firebase-a1Ov4hWR.js";import{g as H,q as L,c as z,w as R,s as Q,d as A,a as G,b as U}from"./firebase-Whrs9NU2.js";import{d as t,e as p,N as m,f as M,g as N,s as X}from"./main-ChOd9MzQ.js";const O="wii_horario_v1",F="horario",Y=Array.from({length:24},(a,s)=>s),v={trabajo:{label:"Trabajo",icon:"fa-briefcase",color:"#0EBEFF"},estudio:{label:"Estudio",icon:"fa-book",color:"#7000FF"},personal:{label:"Personal",icon:"fa-user",color:"#FFB800"},salud:{label:"Salud",icon:"fa-heart-pulse",color:"#FF5C69"},proyecto:{label:"Proyecto",icon:"fa-diagram-project",color:"#A855F7"},reunion:{label:"Reunión",icon:"fa-users",color:"#29C72E"},otro:{label:"Otro",icon:"fa-circle",color:"#94A3B8"}},j={alta:"#FF5C69",media:"#FFB800",baja:"#29C72E"},D=["#0EBEFF","#7000FF","#FFB800","#FF5C69","#29C72E","#A855F7","#00C9B1","#94A3B8"];let e=new Date().toISOString().split("T")[0],n=null;const k=()=>new Date().toISOString().split("T")[0],J=a=>new Date(a+"T00:00:00").toLocaleDateString("es-PE",{weekday:"long",day:"numeric",month:"long",year:"numeric"}),b=(a,s)=>{const i=new Date(a+"T12:00:00");return i.setDate(i.getDate()+s),i.toISOString().split("T")[0]},w=a=>a===k(),K=a=>a<k(),V=a=>`${(a||"hor").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"").slice(0,25)}_${Date.now()}`,E=a=>a/60*6,u=a=>{const[s,i]=a.split(":").map(Number);return s*60+(i||0)},W=()=>{const a=new Date;return`${String(a.getHours()).padStart(2,"0")}:${String(a.getMinutes()).padStart(2,"0")}`},C=()=>N("wiSmile")||null,S=()=>!!C()?.usuario,f=()=>N(O)||[],x=a=>X(O,a,48),T=a=>f().filter(s=>s.fecha===a),c=a=>{const s=d("#dia_sync");s.length&&(s[0].className=`dia_sync_dot dia_sync_${a}`)},Z=async(a=!1)=>{if(!a&&f().length)return c("ok");if(!S())return c("error");c("loading");try{const s=await H(L(z(I,F),R("usuario","==",C().usuario)));x(s.docs.map(i=>({...i.data(),_fsId:i.id,id:i.id}))),c("ok")}catch(s){console.error("❌ diario:",s),c("error")}},B=a=>{const s=f(),i=a._fsId||V(a.titulo),o={...a,_fsId:i,id:i},r=s.findIndex(_=>_._fsId===i);if(r>=0?s.splice(r,1,o):s.push(o),x(s),S()){c("saving");const _=C()||{},h={...o};delete h._fsId,Q(A(I,F,i),{...h,usuario:_.usuario||"",email:_.email||"",actualizado:U()},{merge:!0}).then(()=>c("ok")).catch(y=>{console.error("❌ upsert:",y),c("error")})}return o},aa=a=>{const s=a._fsId||a.id;x(f().filter(i=>i._fsId!==s)),S()&&(c("saving"),G(A(I,F,s)).then(()=>c("ok")).catch(i=>{console.error("❌ del:",i),c("error")}))},na=()=>`
<div class="dia_wrap">
  <div class="dia_toolbar">
    <div class="dia_tb_left">
      <div class="dia_logo"><i class="fas fa-calendar-day"></i><span>Mi Día</span></div>
      <span class="dia_sync_dot dia_sync_loading" id="dia_sync" ${t("Estado de sincronización")}></span>
    </div>
    <div class="dia_tb_center">
      <div class="dia_nav">
        <button class="dia_nav_btn" id="dia_prev" ${t("Día anterior")}><i class="fas fa-chevron-left"></i></button>
        <button class="dia_nav_hoy" id="dia_hoy" ${t("Ir a hoy")}><i class="fas fa-calendar-check"></i> Hoy</button>
        <button class="dia_nav_btn" id="dia_next" ${t("Día siguiente")}><i class="fas fa-chevron-right"></i></button>
      </div>
      <span class="dia_fecha_label" id="dia_fecha_label"></span>
    </div>
    <div class="dia_tb_right">
      <div class="dia_resumen">
        <div class="dia_res_item" ${t("Total eventos")}><i class="fas fa-calendar-days" style="color:var(--mco)"></i><strong id="dia_n_total">0</strong><span>Total</span></div>
        <div class="dia_res_sep"></div>
        <div class="dia_res_item" ${t("Pendientes")}><i class="fas fa-clock" style="color:#FFB800"></i><strong id="dia_n_pend">0</strong><span>Pend.</span></div>
        <div class="dia_res_sep"></div>
        <div class="dia_res_item" ${t("Completados")}><i class="fas fa-check-circle" style="color:#29C72E"></i><strong id="dia_n_done">0</strong><span>Hecho</span></div>
      </div>
      <button class="dia_btn_add" id="dia_add" ${t("Agregar evento (N)")}><i class="fas fa-plus"></i> Nuevo</button>
    </div>
  </div>

  <div class="dia_content">
    <div class="dia_timeline" id="dia_timeline">
      <div class="dia_time_col">
        ${Y.map(a=>`<div class="dia_time_slot" data-hora="${a}"><span>${String(a).padStart(2,"0")}:00</span></div>`).join("")}
      </div>
      <div class="dia_events_col" id="dia_events">
        <div class="dia_now_line" id="dia_now_line"></div>
        <!-- Events render here -->
      </div>
    </div>
    
    <div class="dia_sidebar">
      <div class="dia_side_header">
        <i class="fas fa-list-check"></i> Resumen del día
      </div>
      <div class="dia_side_body" id="dia_agenda">
        <!-- Quick agenda list -->
      </div>
      <div class="dia_side_footer">
        <button class="dia_quick_add" id="dia_quick_add"><i class="fas fa-plus"></i> Evento rápido</button>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_diario">
  <div class="modalBody dia_modal">
    <button class="modalX" ${t("Cerrar (Esc)")}><i class="fas fa-times"></i></button>
    <div class="dia_modal_hero" id="dia_m_hero">
      <div class="dia_deco1"></div>
      <div class="dia_deco2"></div>
      <div class="dia_modal_ico" id="dia_m_ico"><i class="fas fa-calendar-plus"></i></div>
      <div class="dia_modal_info">
        <h2 class="dia_modal_tit" id="dia_m_tit">Nuevo Evento</h2>
        <p class="dia_modal_sub" id="dia_m_sub">Organiza tu día con precisión</p>
      </div>
    </div>
    <div class="dia_modal_body">
      <div class="dia_section">
        <div class="dia_section_tit"><i class="fas fa-heading"></i> Información</div>
        <div class="dia_field">
          <label class="dia_label">Título <span class="dia_req">*</span></label>
          <input type="text" class="dia_input" id="d_titulo" placeholder="Ej: Reunión de equipo" maxlength="100" autocomplete="off"/>
        </div>
        <div class="dia_field">
          <label class="dia_label">Descripción</label>
          <textarea class="dia_textarea" id="d_desc" placeholder="Notas adicionales..." rows="2"></textarea>
        </div>
      </div>

      <div class="dia_section">
        <div class="dia_section_tit"><i class="fas fa-clock"></i> Horario</div>
        <div class="dia_field_row">
          <div class="dia_field">
            <label class="dia_label"><i class="fas fa-play"></i> Inicio</label>
            <input type="time" class="dia_input dia_input_time" id="d_inicio" value="09:00"/>
          </div>
          <div class="dia_field">
            <label class="dia_label"><i class="fas fa-stop"></i> Fin</label>
            <input type="time" class="dia_input dia_input_time" id="d_fin" value="10:00"/>
          </div>
          <div class="dia_field">
            <label class="dia_label"><i class="fas fa-calendar"></i> Fecha</label>
            <input type="date" class="dia_input" id="d_fecha"/>
          </div>
        </div>
      </div>

      <div class="dia_section">
        <div class="dia_section_tit"><i class="fas fa-sliders"></i> Detalles</div>
        <div class="dia_field_row">
          <div class="dia_field">
            <label class="dia_label"><i class="fas fa-tag"></i> Categoría</label>
            <select class="dia_select" id="d_tipo">
              ${Object.entries(v).map(([a,s])=>`<option value="${a}">${s.label}</option>`).join("")}
            </select>
          </div>
          <div class="dia_field">
            <label class="dia_label"><i class="fas fa-flag"></i> Prioridad</label>
            <select class="dia_select" id="d_prio">
              <option value="alta">🔴 Alta</option>
              <option value="media" selected>🟡 Media</option>
              <option value="baja">🟢 Baja</option>
            </select>
          </div>
        </div>
        <div class="dia_field">
          <label class="dia_label"><i class="fas fa-palette"></i> Color</label>
          <div class="dia_colores" id="d_colores">
            ${D.map(a=>`<button type="button" class="dia_color_opt" data-color="${a}" style="--c:${a}" ${t(a)}></button>`).join("")}
          </div>
        </div>
      </div>
    </div>
    <div class="dia_modal_footer">
      <button type="button" class="dia_btn_del dpn" id="d_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
      <div class="dia_modal_footer_r">
        <button type="button" class="dia_btn_cancel" id="d_cancelar">Cancelar</button>
        <button type="button" class="dia_btn_save" id="d_guardar"><i class="fas fa-check-circle"></i> Guardar</button>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_dia_confirm">
  <div class="modalBody dia_modal_confirm">
    <div class="dia_confirm_ico"><i class="fas fa-triangle-exclamation"></i></div>
    <h3>¿Eliminar evento?</h3>
    <p id="dia_confirm_nombre"></p>
    <div class="dia_confirm_btns">
      <button class="dia_btn_cancel" id="dia_conf_no">Cancelar</button>
      <button class="dia_btn_del_confirm" id="dia_conf_si"><i class="fas fa-trash"></i> Eliminar</button>
    </div>
  </div>
</div>`,l=()=>{const a=T(e),s=d("#dia_events");s.find(".dia_event").remove(),a.forEach(i=>{const o=v[i.tipo]||v.otro,r=i.color||o.color,_=u(i.horaInicio||"09:00"),h=u(i.horaFin||"10:00"),y=E(_),q=Math.max(E(h-_),2.5),$=i.estado==="completado";s.append(`
      <div class="dia_event ${$?"dia_event_done":""}" data-id="${i._fsId}" 
           style="--ec:${r}; top:${y}vh; height:${q}vh;">
        <div class="dia_event_bar"></div>
        <div class="dia_event_content">
          <div class="dia_event_time">${i.horaInicio} - ${i.horaFin}</div>
          <div class="dia_event_titulo">${i.titulo}</div>
          ${i.descripcion?`<div class="dia_event_desc">${i.descripcion}</div>`:""}
          <div class="dia_event_meta">
            <span class="dia_event_tipo"><i class="fas ${o.icon}"></i> ${o.label}</span>
            <span class="dia_event_prio" style="color:${j[i.prioridad]||j.media}"><i class="fas fa-flag"></i></span>
          </div>
        </div>
        <div class="dia_event_actions">
          <button class="dia_ev_check" data-id="${i._fsId}" ${t($?"Marcar pendiente":"Completar")}><i class="fas ${$?"fa-undo":"fa-check"}"></i></button>
          <button class="dia_ev_edit" data-id="${i._fsId}" ${t("Editar")}><i class="fas fa-pen"></i></button>
        </div>
      </div>
    `)}),P(),ia(),da(),d("#dia_fecha_label").html(`<i class="fas ${w(e)?"fa-bolt":K(e)?"fa-history":"fa-calendar"}"></i> ${J(e)}`),w(e)?d("#dia_fecha_label").addClass("dia_es_hoy"):d("#dia_fecha_label").removeClass("dia_es_hoy")},P=()=>{const a=d("#dia_now_line");if(!w(e)){a.hide();return}const s=new Date,i=s.getHours()*60+s.getMinutes();a.css("top",E(i)+"vh").show(),a.find(".dia_now_time").text(W())},ia=()=>{const a=T(e).sort((i,o)=>u(i.horaInicio||"00:00")-u(o.horaInicio||"00:00")),s=d("#dia_agenda");if(!a.length){s.html('<div class="dia_empty"><i class="fas fa-calendar-xmark"></i><span>Sin eventos para este día</span></div>');return}s.html(a.map(i=>{const o=v[i.tipo]||v.otro,r=i.estado==="completado";return`
      <div class="dia_agenda_item ${r?"dia_agenda_done":""}" data-id="${i._fsId}">
        <div class="dia_agenda_time">${i.horaInicio}</div>
        <div class="dia_agenda_bar" style="background:${i.color||o.color}"></div>
        <div class="dia_agenda_info">
          <span class="dia_agenda_titulo">${i.titulo}</span>
          <span class="dia_agenda_tipo"><i class="fas ${o.icon}"></i> ${o.label}</span>
        </div>
        <button class="dia_agenda_check" data-id="${i._fsId}"><i class="fas ${r?"fa-check-circle":"fa-circle"}"></i></button>
      </div>
    `}).join(""))},da=()=>{const a=T(e);d("#dia_n_total").text(a.length),d("#dia_n_pend").text(a.filter(s=>s.estado!=="completado").length),d("#dia_n_done").text(a.filter(s=>s.estado==="completado").length)},g=(a=null)=>{n=a;const s=!a;d("#dia_m_tit").text(s?"Nuevo Evento":"Editar Evento"),d("#dia_m_sub").text(s?"Organiza tu día con precisión":"Modifica los detalles del evento"),d("#dia_m_ico i").attr("class",s?"fas fa-calendar-plus":"fas fa-calendar-pen"),d("#dia_m_hero").css("background",s?"linear-gradient(145deg, var(--mco), var(--hv))":`linear-gradient(145deg, ${a?.color||"var(--mco)"}, var(--hv))`),d("#d_titulo").val(a?.titulo||""),d("#d_desc").val(a?.descripcion||""),d("#d_inicio").val(a?.horaInicio||"09:00"),d("#d_fin").val(a?.horaFin||"10:00"),d("#d_fecha").val(a?.fecha||e),d("#d_tipo").val(a?.tipo||"trabajo"),d("#d_prio").val(a?.prioridad||"media"),d(".dia_color_opt").removeClass("active");const i=a?.color||v[a?.tipo||"trabajo"]?.color||D[0];d(`.dia_color_opt[data-color="${i}"]`).addClass("active"),d("#d_eliminar").toggleClass("dpn",s),M("modal_diario"),setTimeout(()=>d("#d_titulo").trigger("focus"),100)},sa=()=>{const a=d("#d_titulo").val().trim();if(!a)return m("El título es requerido","error");const s=d("#d_inicio").val(),i=d("#d_fin").val();if(u(i)<=u(s))return m("La hora de fin debe ser posterior al inicio","error");const o={...n||{},titulo:a,descripcion:d("#d_desc").val().trim(),horaInicio:s,horaFin:i,fecha:d("#d_fecha").val()||e,tipo:d("#d_tipo").val(),prioridad:d("#d_prio").val(),color:d(".dia_color_opt.active").data("color")||D[0],estado:n?.estado||"pendiente"};B(o),p("modal_diario"),l(),m(n?"✓ Evento actualizado":"✓ Evento creado","success")},oa=()=>{d("#dia_prev").off("click.dia").on("click.dia",()=>{e=b(e,-1),l()}),d("#dia_next").off("click.dia").on("click.dia",()=>{e=b(e,1),l()}),d("#dia_hoy").off("click.dia").on("click.dia",()=>{e=k(),l()}),d("#dia_add, #dia_quick_add").off("click.dia").on("click.dia",()=>g()),d("#d_guardar").off("click.dia").on("click.dia",sa),d("#d_cancelar").off("click.dia").on("click.dia",()=>p("modal_diario")),d(document).off("click.dia_col").on("click.dia_col",".dia_color_opt",function(){d(".dia_color_opt").removeClass("active"),d(this).addClass("active")}),d(document).off("click.dia_ev").on("click.dia_ev",".dia_ev_edit, .dia_event",function(a){if(d(a.target).closest(".dia_ev_check").length)return;const s=d(this).data("id")||d(this).closest(".dia_event").data("id"),i=f().find(o=>o._fsId===s);i&&g(i)}),d(document).off("click.dia_check").on("click.dia_check",".dia_ev_check, .dia_agenda_check",function(a){a.stopPropagation();const s=d(this).data("id"),i=f().find(o=>o._fsId===s);i&&(i.estado=i.estado==="completado"?"pendiente":"completado",B(i),l(),m(i.estado==="completado"?"✓ Evento completado":"↺ Evento pendiente","success"))}),d(document).off("click.dia_agenda").on("click.dia_agenda",".dia_agenda_item",function(a){if(d(a.target).closest(".dia_agenda_check").length)return;const s=d(this).data("id"),i=f().find(o=>o._fsId===s);i&&g(i)}),d("#d_eliminar").off("click.dia").on("click.dia",()=>{n&&(d("#dia_confirm_nombre").text(n.titulo),M("modal_dia_confirm"))}),d("#dia_conf_si").off("click.dia").on("click.dia",()=>{n&&(aa(n),p("modal_dia_confirm"),p("modal_diario"),l(),m("🗑 Evento eliminado","success"))}),d("#dia_conf_no").off("click.dia").on("click.dia",()=>p("modal_dia_confirm")),d(document).off("keydown.dia").on("keydown.dia",a=>{d(".wiModal.active").length||((a.key==="n"||a.key==="N")&&(a.preventDefault(),g()),a.key==="ArrowLeft"&&(a.preventDefault(),e=b(e,-1),l()),a.key==="ArrowRight"&&(a.preventDefault(),e=b(e,1),l()),(a.key==="t"||a.key==="T")&&(a.preventDefault(),e=k(),l()))}),setInterval(P,6e4)},ra=async()=>{await Z(),l(),oa()},_a=()=>{d(document).off(".dia"),d(document).off(".dia_col"),d(document).off(".dia_ev"),d(document).off(".dia_check"),d(document).off(".dia_agenda")};export{_a as cleanup,ra as init,na as render};
