import{j as e}from"./vendor-gzd0YkcT.js";import{db as O}from"./firebase-C4LyfHx4.js";import{g as ss,q as as,c as es,w as os,s as is,h as ts,f as H,i as ls}from"./firebase-CiLZDPlJ.js";import{k as cs,c as h,q as y,g as q,s as ns,t as G,j as $,o as L}from"./main-Dlu14CdS.js";const V="wii_horario_v1",T="horario",ds=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"],v={trabajo:{label:"Trabajo",icon:"fa-briefcase",color:"#0EBEFF"},estudio:{label:"Estudio",icon:"fa-book",color:"#7000FF"},personal:{label:"Personal",icon:"fa-user",color:"#FFB800"},salud:{label:"Salud",icon:"fa-heart-pulse",color:"#FF5C69"},proyecto:{label:"Proyecto",icon:"fa-diagram-project",color:"#A855F7"},reunion:{label:"Reunión",icon:"fa-users",color:"#29C72E"},otro:{label:"Otro",icon:"fa-circle",color:"#94A3B8"}},C={alta:{label:"Alta",color:"#FF5C69",icon:"fa-arrow-up"},media:{label:"Media",color:"#FFB800",icon:"fa-minus"},baja:{label:"Baja",color:"#29C72E",icon:"fa-arrow-down"}},x=["#0EBEFF","#7000FF","#FFB800","#FF5C69","#29C72E","#A855F7","#00C9B1","#94A3B8"],P=()=>new Date().toISOString().split("T")[0],D=(a=new Date)=>{const s=new Date(a),o=s.getDay()||7;return s.setDate(s.getDate()-o+1),s.toISOString().split("T")[0]},f=(a,s)=>{const o=new Date(a+"T12:00:00");return o.setDate(o.getDate()+s),o.toISOString().split("T")[0]},A=a=>new Date(a+"T00:00:00").toLocaleDateString("es-PE",{day:"numeric",month:"short"}),rs=a=>new Date(a+"T00:00:00").toLocaleDateString("es-PE",{weekday:"long",day:"numeric",month:"long"}),_s=a=>`${(a||"hor").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"").slice(0,25)}_${Date.now()}`,ms=a=>a===P(),fs=a=>a<P(),N=a=>{const s=a.length,o=a.filter(t=>t.estado==="completado").length;return s?Math.round(o/s*100):0},j=()=>q("wiSmile")||null,B=()=>!!j()?.usuario,m=()=>q(V)||[],M=a=>ns(V,a,48),n=a=>{const s=e("#sem_sync");s.length&&(s[0].className=`sem_sync_dot sem_sync_${a}`)},R=async(a=!1)=>{if(!a&&m().length)return n("ok");if(!B())return n("error");n("loading");try{const s=await ss(as(es(O,T),os("usuario","==",j().usuario)));M(s.docs.map(o=>({...o.data(),_fsId:o.id,id:o.id}))),n("ok")}catch(s){console.error("❌ semanal:",s),n("error")}},U=a=>{const s=m(),o=a._fsId||_s(a.titulo),t={...a,_fsId:o,id:o},k=s.findIndex(p=>p._fsId===o);if(k>=0?s.splice(k,1,t):s.push(t),M(s),B()){n("saving");const p=j()||{},u={...t};delete u._fsId,is(H(O,T,o),{...u,usuario:p.usuario||"",email:p.email||"",actualizado:ts()},{merge:!0}).then(()=>n("ok")).catch(I=>{console.error("❌ upsert:",I),n("error")})}return t},vs=a=>{const s=a._fsId||a.id;M(m().filter(o=>o._fsId!==s)),B()&&(n("saving"),ls(H(O,T,s)).then(()=>n("ok")).catch(o=>{console.error("❌ del:",o),n("error")}))};let l=D(),d=null,X=null;const ps=()=>{const a=f(l,6);return m().filter(s=>s.fecha>=l&&s.fecha<=a)},us=a=>m().filter(s=>s.fecha===a),Ds=()=>`
<div class="sem_wrap">

  <!-- TOOLBAR -->
  <div class="sem_toolbar">
    <div class="sem_tb_left">
      <div class="sem_logo"><i class="fas fa-table-cells"></i><span>Semana</span></div>
      <span class="sem_sync_dot sem_sync_loading" id="sem_sync" ${h("Estado de sincronización")}></span>
    </div>
    <div class="sem_tb_center">
      <div class="sem_week_nav">
        <button class="sem_nav_btn" id="sem_prev" ${h("Semana anterior")}><i class="fas fa-chevron-left"></i></button>
        <button class="sem_nav_hoy" id="sem_hoy"><i class="fas fa-crosshairs"></i> Hoy</button>
        <button class="sem_nav_btn" id="sem_next" ${h("Semana siguiente")}><i class="fas fa-chevron-right"></i></button>
      </div>
      <div class="sem_week_label" id="sem_week_label">—</div>
    </div>
    <div class="sem_tb_right">
      <div class="sem_resumen" id="sem_resumen">
        <div class="sem_res_item"><i class="fas fa-layer-group" style="color:var(--mco)"></i><strong id="sem_n_total">0</strong><span>Actividades</span></div>
        <div class="sem_res_sep"></div>
        <div class="sem_res_item"><i class="fas fa-circle-check" style="color:#29C72E"></i><strong id="sem_n_done">0</strong><span>Hechas</span></div>
        <div class="sem_res_sep"></div>
        <div class="sem_res_item"><i class="fas fa-chart-line" style="color:#0EBEFF"></i><strong id="sem_n_pct">0%</strong><span>Avance</span></div>
      </div>
      <button class="sem_btn_add" id="sem_nuevo"><i class="fas fa-plus"></i> Nueva</button>
    </div>
  </div>

  <!-- BOARD SEMANAL -->
  <div class="sem_board" id="sem_board"></div>

</div>

<!-- MODAL ACTIVIDAD -->
<div class="wiModal" id="modal_semanal">
  <div class="modalBody sem_modal">
    <button class="modalX"><i class="fas fa-times"></i></button>
    
    <div class="sem_modal_hero" id="sem_m_hero">
      <div class="sem_deco1"></div>
      <div class="sem_deco2"></div>
      <div class="sem_modal_ico" id="sem_m_ico"><i class="fas fa-calendar-plus"></i></div>
      <div class="sem_modal_info">
        <h2 class="sem_modal_tit" id="sem_m_tit">Nueva Actividad</h2>
        <p class="sem_modal_sub" id="sem_m_sub">Organiza tu semana</p>
      </div>
    </div>
    
    <div class="sem_modal_body">
      <div class="sem_section">
        <div class="sem_section_tit"><i class="fas fa-info-circle"></i> Información</div>
        <div class="sem_field">
          <label class="sem_label"><i class="fas fa-heading"></i> Título <span class="sem_req">*</span></label>
          <input type="text" class="sem_input" id="s_titulo" placeholder="Ej: Estudiar matemáticas" maxlength="80"/>
        </div>
        <div class="sem_field">
          <label class="sem_label"><i class="fas fa-align-left"></i> Descripción</label>
          <textarea class="sem_textarea" id="s_nota" placeholder="Detalles opcionales…" maxlength="300" rows="2"></textarea>
        </div>
      </div>
      
      <div class="sem_section">
        <div class="sem_section_tit"><i class="fas fa-clock"></i> Horario</div>
        <div class="sem_field_row">
          <div class="sem_field">
            <label class="sem_label"><i class="fas fa-calendar-day"></i> Fecha</label>
            <input type="date" class="sem_input" id="s_fecha"/>
          </div>
          <div class="sem_field">
            <label class="sem_label"><i class="fas fa-clock"></i> Inicio</label>
            <input type="time" class="sem_input" id="s_hora_inicio"/>
          </div>
          <div class="sem_field">
            <label class="sem_label"><i class="fas fa-hourglass-end"></i> Fin</label>
            <input type="time" class="sem_input" id="s_hora_fin"/>
          </div>
        </div>
      </div>
      
      <div class="sem_section">
        <div class="sem_section_tit"><i class="fas fa-sliders"></i> Detalles</div>
        <div class="sem_field_row">
          <div class="sem_field">
            <label class="sem_label"><i class="fas fa-tag"></i> Tipo</label>
            <select class="sem_select" id="s_tipo">
              ${Object.entries(v).map(([a,s])=>`<option value="${a}">${s.label}</option>`).join("")}
            </select>
          </div>
          <div class="sem_field">
            <label class="sem_label"><i class="fas fa-flag"></i> Prioridad</label>
            <select class="sem_select" id="s_prio">
              ${Object.entries(C).map(([a,s])=>`<option value="${a}">${s.label}</option>`).join("")}
            </select>
          </div>
          <div class="sem_field">
            <label class="sem_label"><i class="fas fa-circle-half-stroke"></i> Estado</label>
            <select class="sem_select" id="s_estado">
              <option value="pendiente">Pendiente</option>
              <option value="progreso">En progreso</option>
              <option value="completado">Completado</option>
            </select>
          </div>
        </div>
      </div>
      
      <div class="sem_section">
        <div class="sem_section_tit"><i class="fas fa-palette"></i> Personalizar</div>
        <div class="sem_colores" id="s_colores">
          ${x.map(a=>`<button type="button" class="sem_color_opt" data-color="${a}" style="--c:${a}"></button>`).join("")}
        </div>
      </div>
    </div>
    
    <div class="sem_modal_footer">
      <button type="button" class="sem_btn_del dpn" id="s_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
      <div class="sem_modal_footer_r">
        <button type="button" class="sem_btn_cancel" id="s_cancelar">Cancelar</button>
        <button type="button" class="sem_btn_save" id="s_guardar"><i class="fas fa-floppy-disk"></i> Guardar</button>
      </div>
    </div>
  </div>
</div>

<!-- MODAL CONFIRMAR -->
<div class="wiModal" id="modal_sem_confirm">
  <div class="modalBody sem_modal_confirm">
    <div class="sem_confirm_ico"><i class="fas fa-triangle-exclamation"></i></div>
    <h3>¿Eliminar actividad?</h3>
    <p id="sem_confirm_nombre"></p>
    <div class="sem_confirm_btns">
      <button class="sem_btn_cancel" id="sem_conf_no">Cancelar</button>
      <button class="sem_btn_del_confirm" id="sem_conf_si"><i class="fas fa-trash"></i> Eliminar</button>
    </div>
  </div>
</div>`,c=()=>{const a=e("#sem_board").empty(),s=ps(),o=s.length,t=s.filter(u=>u.estado==="completado").length,k=N(s);e("#sem_n_total").text(o),e("#sem_n_done").text(t),e("#sem_n_pct").text(`${k}%`);const p=f(l,6);e("#sem_week_label").text(`${A(l)} — ${A(p)}`),ds.forEach((u,I)=>{const r=f(l,I),_=us(r),F=ms(r),E=fs(r),Q=_.filter(i=>i.estado==="completado").length,W=N(_);a.append(`
    <div class="sem_col${F?" sem_col_hoy":""}${E?" sem_col_past":""}" data-fecha="${r}">
      <div class="sem_col_head">
        <div class="sem_col_dia">
          <span class="sem_col_nombre">${u}</span>
          <span class="sem_col_fecha${F?" sem_col_hoy_badge":""}">${A(r)}${F?" · Hoy":""}</span>
        </div>
        <div class="sem_col_meta">
          ${_.length?`<span class="sem_col_count">${_.length}</span>`:""}
          ${E?"":`<button class="sem_col_add" data-fecha="${r}" ${h("Agregar")}><i class="fas fa-plus"></i></button>`}
        </div>
      </div>
      ${_.length?`
      <div class="sem_col_prog">
        <div class="sem_col_prog_bar"><div class="sem_col_prog_fill" style="width:${W}%"></div></div>
        <span class="sem_col_prog_txt">${Q}/${_.length}</span>
      </div>`:""}
      <div class="sem_col_body" data-fecha="${r}">
        ${_.length===0?`<div class="sem_empty_dia"><i class="fas fa-moon"></i><span>${E?"Sin registros":"Vacío"}</span></div>`:""}
      </div>
    </div>`);const Y=a.find(`.sem_col_body[data-fecha="${r}"]`);_.sort((i,b)=>(i.horaInicio||"99:99").localeCompare(b.horaInicio||"99:99")).forEach(i=>{const b=v[i.tipo]||v.otro;C[i.prioridad]||C.media;const Z=i.color||b.color,w=i.estado==="completado";Y.append(`
      <div class="sem_item${w?" sem_item_done":""}" data-id="${i._fsId}" style="--ic:${Z}">
        <div class="sem_item_left">
          <button class="sem_item_check${w?" sem_item_checked":""}" data-id="${i._fsId}" ${h(w?"Marcar pendiente":"Completar")}>
            <i class="fas ${w?"fa-circle-check":"fa-circle-dot"}"></i>
          </button>
        </div>
        <div class="sem_item_body">
          <div class="sem_item_titulo">${i.titulo}</div>
          <div class="sem_item_meta">
            ${i.horaInicio?`<span class="sem_item_hora"><i class="fas fa-clock"></i> ${i.horaInicio}${i.horaFin?" - "+i.horaFin:""}</span>`:""}
            <span class="sem_item_tipo" style="--tc:${b.color}"><i class="fas ${b.icon}"></i> ${b.label}</span>
          </div>
          ${i.descripcion?`<p class="sem_item_nota">${i.descripcion}</p>`:""}
        </div>
        <div class="sem_item_actions">
          <button class="sem_item_edit" data-id="${i._fsId}" ${h("Editar")}><i class="fas fa-pen"></i></button>
        </div>
      </div>`)})})},J=a=>{e("#s_colores .sem_color_opt").removeClass("active"),e(`#s_colores .sem_color_opt[data-color="${a}"]`).addClass("active")},K=()=>e("#s_colores .sem_color_opt.active").data("color")||x[0],S=(a,s)=>{e("#sem_m_hero").css("background",`linear-gradient(145deg,${a},${a}99)`),e("#sem_m_ico").css("background",`${a}33`).html(`<i class="fas ${s}" style="color:${a}"></i>`)},g=(a={},s=null)=>{d=a._fsId?a:null;const o=a.tipo||"trabajo",t=a.color||v[o]?.color||x[0];e("#s_titulo").val(a.titulo||""),e("#s_nota").val(a.descripcion||""),e("#s_fecha").val(a.fecha||s||P()),e("#s_hora_inicio").val(a.horaInicio||""),e("#s_hora_fin").val(a.horaFin||""),e("#s_tipo").val(o),e("#s_prio").val(a.prioridad||"media"),e("#s_estado").val(a.estado||"pendiente"),J(t),S(t,v[o]?.icon||"fa-calendar-plus"),e("#sem_m_tit").text(d?"Editar Actividad":"Nueva Actividad"),e("#sem_m_sub").text(d?rs(a.fecha):"Organiza tu semana"),e("#s_eliminar").toggleClass("dpn",!d),G("modal_semanal"),setTimeout(()=>e("#s_titulo").focus(),30)},z=()=>{const a=e("#s_titulo").val().trim();if(!a)return $("Título requerido","warning");const s=e("#s_fecha").val();if(!s)return $("Fecha requerida","warning");L("#s_guardar",!0,"Guardar");const o=e("#s_tipo").val();U({...d||{},titulo:a,descripcion:e("#s_nota").val().trim(),fecha:s,horaInicio:e("#s_hora_inicio").val()||"",horaFin:e("#s_hora_fin").val()||"",tipo:o,prioridad:e("#s_prio").val(),estado:e("#s_estado").val(),color:K(),creado:d?.creado||new Date().toISOString()}),y("modal_semanal"),c(),L("#s_guardar",!1,"Guardar"),$(d?"✓ Actividad actualizada":"✓ Actividad creada","success")},bs=a=>{const s=m().find(t=>t._fsId===a);if(!s)return;const o=s.estado==="completado"?"pendiente":"completado";U({...s,estado:o,completadoEn:o==="completado"?new Date().toISOString():""}),c(),o==="completado"&&$("✅ ¡Completado!","success")},hs=a=>{e("#sem_confirm_nombre").text(a.titulo||"Sin título"),X=()=>{vs(a),y("modal_sem_confirm"),c(),$("Actividad eliminada ✓","success")},G("modal_sem_confirm")},gs=()=>{e(document).off(".sem"),e(document).on("click.sem","#sem_prev",()=>{l=f(l,-7),c()}).on("click.sem","#sem_next",()=>{l=f(l,7),c()}).on("click.sem","#sem_hoy",()=>{l=D(),c()}).on("click.sem","#sem_nuevo",()=>g({},null)).on("click.sem",".sem_col_add",function(s){s.stopPropagation(),g({},e(this).data("fecha"))}).on("click.sem",".sem_item_check",function(s){s.stopPropagation(),bs(e(this).data("id"))}).on("click.sem",".sem_item",function(s){if(e(s.target).closest(".sem_item_check,.sem_item_edit").length)return;const o=m().find(t=>t._fsId===e(this).data("id"));o&&g(o)}).on("click.sem",".sem_item_edit",function(s){s.stopPropagation();const o=m().find(t=>t._fsId===e(this).data("id"));o&&g(o)}).on("change.sem","#s_tipo",function(){const s=e(this).val();S(K(),v[s]?.icon||"fa-calendar-plus")}).on("click.sem","#s_colores .sem_color_opt",function(){J(e(this).data("color")),S(e(this).data("color"),v[e("#s_tipo").val()]?.icon||"fa-calendar-plus")}).on("click.sem","#s_cancelar",()=>y("modal_semanal")).on("click.sem","#s_guardar",z).on("keydown.sem","#s_titulo",s=>{s.key==="Enter"&&z()}).on("click.sem","#s_eliminar",()=>{d&&(y("modal_semanal"),hs(d))}).on("click.sem","#sem_conf_no",()=>y("modal_sem_confirm")).on("click.sem","#sem_conf_si",()=>X?.()).on("keydown.sem",s=>{e(".wiModal.active").length||s.target.tagName==="INPUT"||s.target.tagName==="TEXTAREA"||((s.key==="n"||s.key==="N")&&(s.preventDefault(),g({})),s.key==="ArrowLeft"&&(s.preventDefault(),l=f(l,-7),c()),s.key==="ArrowRight"&&(s.preventDefault(),l=f(l,7),c()),(s.key==="t"||s.key==="T")&&(s.preventDefault(),l=D(),c()))})},Is=async()=>{l=D(),await R(),c(),gs(),cs(R,c),console.log("📅 Semanal v2.0 PRO OK")},Fs=()=>{e(document).off(".sem"),console.log("🧹 Semanal limpiado")};export{Fs as cleanup,Is as init,Ds as render};
