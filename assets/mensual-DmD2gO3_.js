import{j as e}from"./vendor-gzd0YkcT.js";import{db as w}from"./firebase-BbiX5iLQ.js";import{g as L,q as O,c as H,w as J,s as R,f as x,i as Y,h as G}from"./firebase-Cdwg_wrl.js";import{c,o as h,h as y,p as j,g as P,s as Q}from"./main-CEDqlAXn.js";const N="wii_horario_v1",F="horario",U=["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"],V=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],g={trabajo:{label:"Trabajo",icon:"fa-briefcase",color:"#0EBEFF"},estudio:{label:"Estudio",icon:"fa-book",color:"#7000FF"},personal:{label:"Personal",icon:"fa-user",color:"#FFB800"},salud:{label:"Salud",icon:"fa-heart-pulse",color:"#FF5C69"},proyecto:{label:"Proyecto",icon:"fa-diagram-project",color:"#A855F7"},reunion:{label:"Reunión",icon:"fa-users",color:"#29C72E"},otro:{label:"Otro",icon:"fa-circle",color:"#94A3B8"}},E=["#0EBEFF","#7000FF","#FFB800","#FF5C69","#29C72E","#A855F7","#00C9B1","#94A3B8"];let l=new Date().getMonth(),n=new Date().getFullYear(),d=null,u=null;const D=()=>new Date().toISOString().split("T")[0],X=s=>new Date(s+"T00:00:00").toLocaleDateString("es-PE",{weekday:"long",day:"numeric",month:"long"}),K=s=>s===D(),W=s=>s<D(),Z=s=>`${(s||"hor").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"").slice(0,25)}_${Date.now()}`,ss=(s,a)=>new Date(a,s+1,0).getDate(),es=(s,a)=>{const i=new Date(a,s,1).getDay();return i===0?6:i-1},as=(s,a,i)=>`${i}-${String(a+1).padStart(2,"0")}-${String(s).padStart(2,"0")}`,C=()=>P("wiSmile")||null,I=()=>!!C()?.usuario,p=()=>P(N)||[],S=s=>Q(N,s,48),is=s=>p().filter(a=>a.fecha===s),os=(s,a)=>p().filter(i=>{if(!i.fecha)return!1;const[o,m]=i.fecha.split("-").map(Number);return o===a&&m===s+1}),r=s=>{const a=e("#mes_sync");a.length&&(a[0].className=`mes_sync_dot mes_sync_${s}`)},ts=async(s=!1)=>{if(!s&&p().length)return r("ok");if(!I())return r("error");r("loading");try{const a=await L(O(H(w,F),J("usuario","==",C().usuario)));S(a.docs.map(i=>({...i.data(),_fsId:i.id,id:i.id}))),r("ok")}catch(a){console.error("❌ mensual:",a),r("error")}},B=s=>{const a=p(),i=s._fsId||Z(s.titulo),o={...s,_fsId:i,id:i},m=a.findIndex(t=>t._fsId===i);if(m>=0?a.splice(m,1,o):a.push(o),S(a),I()){r("saving");const t=C()||{},f={...o};delete f._fsId,R(x(w,F,i),{...f,usuario:t.usuario||"",email:t.email||"",actualizado:G()},{merge:!0}).then(()=>r("ok")).catch(v=>{console.error("❌ upsert:",v),r("error")})}return o},ls=s=>{const a=s._fsId||s.id;S(p().filter(i=>i._fsId!==a)),I()&&(r("saving"),Y(x(w,F,a)).then(()=>r("ok")).catch(i=>{console.error("❌ del:",i),r("error")}))},fs=()=>`
<div class="mes_wrap">
  <div class="mes_toolbar">
    <div class="mes_tb_left">
      <div class="mes_logo"><i class="fas fa-calendar-alt"></i><span>Calendario</span></div>
      <span class="mes_sync_dot mes_sync_loading" id="mes_sync" ${c("Estado de sincronización")}></span>
    </div>
    <div class="mes_tb_center">
      <div class="mes_nav">
        <button class="mes_nav_btn" id="mes_prev_y" ${c("Año anterior")}><i class="fas fa-angles-left"></i></button>
        <button class="mes_nav_btn" id="mes_prev" ${c("Mes anterior")}><i class="fas fa-chevron-left"></i></button>
        <div class="mes_nav_label" id="mes_label"></div>
        <button class="mes_nav_btn" id="mes_next" ${c("Mes siguiente")}><i class="fas fa-chevron-right"></i></button>
        <button class="mes_nav_btn" id="mes_next_y" ${c("Año siguiente")}><i class="fas fa-angles-right"></i></button>
      </div>
      <button class="mes_nav_hoy" id="mes_hoy" ${c("Ir a hoy")}><i class="fas fa-calendar-check"></i> Hoy</button>
    </div>
    <div class="mes_tb_right">
      <div class="mes_resumen">
        <div class="mes_res_item" ${c("Eventos del mes")}><i class="fas fa-calendar-days" style="color:var(--mco)"></i><strong id="mes_n_total">0</strong><span>Total</span></div>
        <div class="mes_res_sep"></div>
        <div class="mes_res_item" ${c("Días con eventos")}><i class="fas fa-calendar-week" style="color:#7000FF"></i><strong id="mes_n_dias">0</strong><span>Días</span></div>
      </div>
      <button class="mes_btn_add" id="mes_add" ${c("Agregar evento")}><i class="fas fa-plus"></i> Nuevo</button>
    </div>
  </div>

  <div class="mes_content">
    <div class="mes_calendar" id="mes_calendar">
      <div class="mes_weekdays">
        ${U.map(s=>`<div class="mes_weekday">${s}</div>`).join("")}
      </div>
      <div class="mes_days" id="mes_days">
        <!-- Days render here -->
      </div>
    </div>
    
    <div class="mes_sidebar" id="mes_sidebar">
      <div class="mes_side_header">
        <span id="mes_side_fecha">Selecciona un día</span>
      </div>
      <div class="mes_side_body" id="mes_side_body">
        <div class="mes_empty"><i class="fas fa-hand-pointer"></i><span>Haz clic en un día para ver sus eventos</span></div>
      </div>
      <div class="mes_side_footer">
        <button class="mes_quick_add dpn" id="mes_quick_add"><i class="fas fa-plus"></i> Agregar evento</button>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_mensual">
  <div class="modalBody mes_modal">
    <button class="modalX" ${c("Cerrar (Esc)")}><i class="fas fa-times"></i></button>
    <div class="mes_modal_hero" id="mes_m_hero">
      <div class="mes_deco1"></div>
      <div class="mes_deco2"></div>
      <div class="mes_modal_ico" id="mes_m_ico"><i class="fas fa-calendar-plus"></i></div>
      <div class="mes_modal_info">
        <h2 class="mes_modal_tit" id="mes_m_tit">Nuevo Evento</h2>
        <p class="mes_modal_sub" id="mes_m_sub">Planifica tu mes</p>
      </div>
    </div>
    <div class="mes_modal_body">
      <div class="mes_section">
        <div class="mes_section_tit"><i class="fas fa-heading"></i> Información</div>
        <div class="mes_field">
          <label class="mes_label">Título <span class="mes_req">*</span></label>
          <input type="text" class="mes_input" id="m_titulo" placeholder="Ej: Cita médica" maxlength="100" autocomplete="off"/>
        </div>
        <div class="mes_field">
          <label class="mes_label">Descripción</label>
          <textarea class="mes_textarea" id="m_desc" placeholder="Notas adicionales..." rows="2"></textarea>
        </div>
      </div>

      <div class="mes_section">
        <div class="mes_section_tit"><i class="fas fa-clock"></i> Fecha y Hora</div>
        <div class="mes_field_row">
          <div class="mes_field">
            <label class="mes_label"><i class="fas fa-calendar"></i> Fecha</label>
            <input type="date" class="mes_input" id="m_fecha"/>
          </div>
          <div class="mes_field">
            <label class="mes_label"><i class="fas fa-play"></i> Inicio</label>
            <input type="time" class="mes_input" id="m_inicio" value="09:00"/>
          </div>
          <div class="mes_field">
            <label class="mes_label"><i class="fas fa-stop"></i> Fin</label>
            <input type="time" class="mes_input" id="m_fin" value="10:00"/>
          </div>
        </div>
      </div>

      <div class="mes_section">
        <div class="mes_section_tit"><i class="fas fa-sliders"></i> Detalles</div>
        <div class="mes_field_row2">
          <div class="mes_field">
            <label class="mes_label"><i class="fas fa-tag"></i> Categoría</label>
            <select class="mes_select" id="m_tipo">
              ${Object.entries(g).map(([s,a])=>`<option value="${s}">${a.label}</option>`).join("")}
            </select>
          </div>
          <div class="mes_field">
            <label class="mes_label"><i class="fas fa-flag"></i> Prioridad</label>
            <select class="mes_select" id="m_prio">
              <option value="alta">🔴 Alta</option>
              <option value="media" selected>🟡 Media</option>
              <option value="baja">🟢 Baja</option>
            </select>
          </div>
        </div>
        <div class="mes_field">
          <label class="mes_label"><i class="fas fa-palette"></i> Color</label>
          <div class="mes_colores" id="m_colores">
            ${E.map(s=>`<button type="button" class="mes_color_opt" data-color="${s}" style="--c:${s}" ${c(s)}></button>`).join("")}
          </div>
        </div>
      </div>
    </div>
    <div class="mes_modal_footer">
      <button type="button" class="mes_btn_del dpn" id="m_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
      <div class="mes_modal_footer_r">
        <button type="button" class="mes_btn_cancel" id="m_cancelar">Cancelar</button>
        <button type="button" class="mes_btn_save" id="m_guardar"><i class="fas fa-check-circle"></i> Guardar</button>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_mes_confirm">
  <div class="modalBody mes_modal_confirm">
    <div class="mes_confirm_ico"><i class="fas fa-triangle-exclamation"></i></div>
    <h3>¿Eliminar evento?</h3>
    <p id="mes_confirm_nombre"></p>
    <div class="mes_confirm_btns">
      <button class="mes_btn_cancel" id="mes_conf_no">Cancelar</button>
      <button class="mes_btn_del_confirm" id="mes_conf_si"><i class="fas fa-trash"></i> Eliminar</button>
    </div>
  </div>
</div>`,_=()=>{const s=ss(l,n),a=es(l,n),i=os(l,n),o=e("#mes_days").empty();for(let t=0;t<a;t++)o.append('<div class="mes_day mes_day_empty"></div>');for(let t=1;t<=s;t++){const f=as(t,l,n),v=i.filter(A=>A.fecha===f),q=K(f),T=W(f),z=f===d;let M="";v.length&&(M=`<div class="mes_day_dots">${[...new Set(v.slice(0,3).map(k=>k.color||g[k.tipo]?.color||"#94A3B8"))].map(k=>`<span class="mes_dot" style="background:${k}"></span>`).join("")}${v.length>3?`<span class="mes_dot_more">+${v.length-3}</span>`:""}</div>`),o.append(`
      <div class="mes_day ${q?"mes_day_hoy":""} ${T?"mes_day_past":""} ${z?"mes_day_sel":""}" data-fecha="${f}">
        <span class="mes_day_num">${t}</span>
        ${M}
        ${v.length?`<span class="mes_day_count">${v.length}</span>`:""}
      </div>
    `)}e("#mes_label").html(`<i class="fas fa-calendar"></i> ${V[l]} ${n}`);const m=new Set(i.map(t=>t.fecha)).size;e("#mes_n_total").text(i.length),e("#mes_n_dias").text(m),d&&b(d)},b=s=>{d=s;const a=is(s).sort((o,m)=>{const t=o.horaInicio||"00:00",f=m.horaInicio||"00:00";return t.localeCompare(f)});e("#mes_side_fecha").html(`<i class="fas fa-calendar-day"></i> ${X(s)}`),e("#mes_quick_add").removeClass("dpn");const i=e("#mes_side_body");if(!a.length){i.html('<div class="mes_empty"><i class="fas fa-calendar-xmark"></i><span>Sin eventos este día</span></div>');return}i.html(a.map(o=>{const m=g[o.tipo]||g.otro,t=o.estado==="completado";return`
      <div class="mes_side_item ${t?"mes_side_done":""}" data-id="${o._fsId}">
        <div class="mes_side_bar" style="background:${o.color||m.color}"></div>
        <div class="mes_side_content">
          <div class="mes_side_time">${o.horaInicio||"--:--"} - ${o.horaFin||"--:--"}</div>
          <div class="mes_side_titulo">${o.titulo}</div>
          <div class="mes_side_tipo"><i class="fas ${m.icon}"></i> ${m.label}</div>
        </div>
        <div class="mes_side_actions">
          <button class="mes_side_check" data-id="${o._fsId}" ${c(t?"Pendiente":"Completar")}><i class="fas ${t?"fa-undo":"fa-check"}"></i></button>
          <button class="mes_side_edit" data-id="${o._fsId}" ${c("Editar")}><i class="fas fa-pen"></i></button>
        </div>
      </div>
    `}).join("")),e(".mes_day").removeClass("mes_day_sel"),e(`.mes_day[data-fecha="${s}"]`).addClass("mes_day_sel")},$=(s=null)=>{u=s;const a=!s;e("#mes_m_tit").text(a?"Nuevo Evento":"Editar Evento"),e("#mes_m_sub").text(a?"Planifica tu mes":"Modifica los detalles"),e("#mes_m_ico i").attr("class",a?"fas fa-calendar-plus":"fas fa-calendar-pen"),e("#m_titulo").val(s?.titulo||""),e("#m_desc").val(s?.descripcion||""),e("#m_fecha").val(s?.fecha||d||D()),e("#m_inicio").val(s?.horaInicio||"09:00"),e("#m_fin").val(s?.horaFin||"10:00"),e("#m_tipo").val(s?.tipo||"trabajo"),e("#m_prio").val(s?.prioridad||"media"),e(".mes_color_opt").removeClass("active");const i=s?.color||g[s?.tipo||"trabajo"]?.color||E[0];e(`.mes_color_opt[data-color="${i}"]`).addClass("active"),e("#m_eliminar").toggleClass("dpn",a),j("modal_mensual"),setTimeout(()=>e("#m_titulo").trigger("focus"),100)},cs=()=>{const s=e("#m_titulo").val().trim();if(!s)return y("El título es requerido","error");const a=e("#m_fecha").val();if(!a)return y("La fecha es requerida","error");const i={...u||{},titulo:s,descripcion:e("#m_desc").val().trim(),fecha:a,horaInicio:e("#m_inicio").val(),horaFin:e("#m_fin").val(),tipo:e("#m_tipo").val(),prioridad:e("#m_prio").val(),color:e(".mes_color_opt.active").data("color")||E[0],estado:u?.estado||"pendiente"};B(i),h("modal_mensual"),_(),d&&b(d),y(u?"✓ Evento actualizado":"✓ Evento creado","success")},ns=()=>{e("#mes_prev").off("click.mes").on("click.mes",()=>{l--,l<0&&(l=11,n--),_()}),e("#mes_next").off("click.mes").on("click.mes",()=>{l++,l>11&&(l=0,n++),_()}),e("#mes_prev_y").off("click.mes").on("click.mes",()=>{n--,_()}),e("#mes_next_y").off("click.mes").on("click.mes",()=>{n++,_()}),e("#mes_hoy").off("click.mes").on("click.mes",()=>{const s=new Date;l=s.getMonth(),n=s.getFullYear(),d=D(),_(),b(d)}),e(document).off("click.mes_day").on("click.mes_day",".mes_day:not(.mes_day_empty)",function(){const s=e(this).data("fecha");b(s)}),e("#mes_add").off("click.mes").on("click.mes",()=>$()),e("#mes_quick_add").off("click.mes").on("click.mes",()=>$()),e("#m_guardar").off("click.mes").on("click.mes",cs),e("#m_cancelar").off("click.mes").on("click.mes",()=>h("modal_mensual")),e(document).off("click.mes_col").on("click.mes_col",".mes_color_opt",function(){e(".mes_color_opt").removeClass("active"),e(this).addClass("active")}),e(document).off("click.mes_edit").on("click.mes_edit",".mes_side_edit, .mes_side_item",function(s){if(e(s.target).closest(".mes_side_check").length)return;const a=e(this).data("id")||e(this).closest(".mes_side_item").data("id"),i=p().find(o=>o._fsId===a);i&&$(i)}),e(document).off("click.mes_check").on("click.mes_check",".mes_side_check",function(s){s.stopPropagation();const a=e(this).data("id"),i=p().find(o=>o._fsId===a);i&&(i.estado=i.estado==="completado"?"pendiente":"completado",B(i),_(),d&&b(d),y(i.estado==="completado"?"✓ Completado":"↺ Pendiente","success"))}),e("#m_eliminar").off("click.mes").on("click.mes",()=>{u&&(e("#mes_confirm_nombre").text(u.titulo),j("modal_mes_confirm"))}),e("#mes_conf_si").off("click.mes").on("click.mes",()=>{u&&(ls(u),h("modal_mes_confirm"),h("modal_mensual"),_(),d&&b(d),y("🗑 Evento eliminado","success"))}),e("#mes_conf_no").off("click.mes").on("click.mes",()=>h("modal_mes_confirm")),e(document).off("keydown.mes").on("keydown.mes",s=>{if(!e(".wiModal.active").length&&((s.key==="n"||s.key==="N")&&(s.preventDefault(),$()),s.key==="ArrowLeft"&&(s.preventDefault(),l--,l<0&&(l=11,n--),_()),s.key==="ArrowRight"&&(s.preventDefault(),l++,l>11&&(l=0,n++),_()),s.key==="t"||s.key==="T")){s.preventDefault();const a=new Date;l=a.getMonth(),n=a.getFullYear(),_()}})},vs=async()=>{await ts(),_(),ns()},us=()=>{e(document).off(".mes"),e(document).off(".mes_day"),e(document).off(".mes_col"),e(document).off(".mes_edit"),e(document).off(".mes_check")};export{us as cleanup,vs as init,fs as render};
