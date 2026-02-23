import{j as o}from"./vendor-gzd0YkcT.js";import{S as Z}from"./sortable.esm-BzJVkfZx.js";import{db as T}from"./firebase-jggN8PZ1.js";import{g as aa,q as ta,c as sa,w as oa,s as ia,d as G,a as ea,b as ra}from"./firebase-X7xaP-Jv.js";import{d as b,e as m,g as H,s as la,N as p,f as V,h as w}from"./main-PaQvqqIh.js";import"./main-dTXxXa1j.js";const I="wii_tareas_v1",j="tareas",_={pendiente:"Pendiente",progreso:"En progreso",revision:"Revisión",hecho:"Hecho"},S={pendiente:"fa-circle-dot",progreso:"fa-spinner",revision:"fa-eye",hecho:"fa-circle-check"},y={pendiente:"#FFB800",progreso:"#0EBEFF",revision:"#7000FF",hecho:"#29C72E"},X={pendiente:"progreso",progreso:"revision",revision:"hecho",hecho:"hecho"},K={pendiente:"pendiente",progreso:"pendiente",revision:"progreso",hecho:"revision"},v={trabajo:{label:"Trabajo",icon:"fa-briefcase",color:"#29C72E"},estudio:{label:"Estudio",icon:"fa-book",color:"#7000FF"},web:{label:"Web",icon:"fa-globe",color:"#0EBEFF"},personal:{label:"Personal",icon:"fa-user",color:"#FFB800"},otros:{label:"Otros",icon:"fa-circle",color:"#94A3B8"}},ca={alta:"#FF5C69",media:"#FFB800",baja:"#29C72E"},N={alta:0,media:1,baja:2},k=["#29C72E","#0EBEFF","#7000FF","#FF5C69","#FFB800","#94A3B8"],na=()=>new Date().toISOString().split("T")[0],da=a=>a?new Date(a+"T00:00:00").toLocaleDateString("es-PE",{day:"numeric",month:"short"}):"",_a=a=>{if(!a)return"";const t=Math.ceil((new Date(a+"T00:00:00")-new Date(na()+"T00:00:00"))/864e5);return t<0?`<span class="tar_vencido">Vencido ${-t}d</span>`:t===0?'<span class="tar_hoy_tag">Hoy</span>':`${t}d`},O=()=>{const a=new Date;return a.setDate(a.getDate()+7),a.toISOString().split("T")[0]},ua=a=>`${(a||"tarea").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"").slice(0,25)}_${Date.now()}`,D=()=>H("wiSmile")||null,q=()=>!!D()?.usuario,u=()=>H(I)||[],B=a=>la(I,a,48),c=a=>{const t=o("#tar_sync_dot");if(!t.length)return;t[0].className=`tar_sync_dot tar_sync_${a}`;const s={loading:"Cargando…",ok:"Sincronizado",error:"Sin conexión",saving:"Guardando…"};t.attr("data-witip",s[a]||"")},fa=a=>{const t=D()||{},s={...a};return delete s._fsId,{...s,usuario:t.usuario||"",email:t.email||"",actualizado:ra()}},pa=(a,t)=>({...t,_fsId:a,id:a}),Q=async(a=!1)=>{if(!a&&u().length)return c("ok");if(!q())return c("error");c("loading");try{const t=await aa(ta(sa(T,j),oa("usuario","==",D().usuario)));B(t.docs.map(s=>pa(s.id,s.data()))),c("ok")}catch(t){console.error("❌ tareas:",t),c("error")}},E=a=>{const t=u(),s=a._fsId||ua(a.titulo),e={...a,_fsId:s,id:s},r=t.findIndex(i=>i._fsId===s);return r>=0?t.splice(r,1,e):t.push(e),B(t),q()&&(c("saving"),ia(G(T,j,s),fa(e),{merge:!0}).then(()=>c("ok")).catch(i=>{console.error("❌ upsert:",i),c("error")})),e},va=a=>{const t=a._fsId||a.id;B(u().filter(s=>s._fsId!==t)),q()&&(c("saving"),ea(G(T,j,t)).then(()=>c("ok")).catch(s=>{console.error("❌ del:",s),c("error")}))},ba=async()=>{w("#tar_refresh",!0,""),localStorage.removeItem(I),await Q(!0),f(),w("#tar_refresh",!1,""),p("Tareas actualizadas ✓","success")};let F="todos",C="",n=null,U=null,g=[];const ha=()=>{let a=u();if(F!=="todos"&&(a=a.filter(t=>t.estado===F)),C){const t=C.toLowerCase();a=a.filter(s=>(s.titulo||"").toLowerCase().includes(t))}return a},ma=()=>{const a=o("#tar_quick_input").val().trim();if(!a)return p("Escribe un título","warning");const t=o("#tar_quick_tipo").val()||"trabajo";E({titulo:a,fecha:O(),prio:"media",tipo:t,estado:"pendiente",color:v[t]?.color||k[0],subtareas:[],historial:[],creado:new Date().toISOString()}),f(),o("#tar_quick_input").val("").focus(),p("Tarea creada ✓","success")},ga=(a,t)=>{const s=u().find(l=>l._fsId===a);if(!s)return;const e=t==="next"?X[s.estado||"pendiente"]:K[s.estado||"pendiente"];if(e===s.estado)return;const r=s.historial||[];r.push({de:s.estado,a:e,fecha:new Date().toISOString()}),E({...s,estado:e,historial:r,completado:e==="hecho"?new Date().toISOString():""}),f();const i={pendiente:"⏳",progreso:"🔄",revision:"👀",hecho:"✅"}[e];p(`${i} ${s.titulo} → ${_[e]},'success'`)},Ia=()=>`
<div class="tar_wrap">
  <div class="tar_toolbar">
    <div class="tar_tb_left">
      <div class="tar_logo"><i class="fas fa-folder-open"></i><span>Mis Tareas</span></div>
    </div>
    <div class="tar_tb_right">
      <div class="tar_resumen" id="tar_resumen">
        <div class="tar_res_item" ${b("Total")}><i class="fas fa-layer-group"></i><strong id="tar_n_total">0</strong><span>Total</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item"><i class="fas fa-circle-dot" style="color:#FFB800"></i><strong id="tar_n_pend">0</strong><span>Pend.</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item"><i class="fas fa-spinner" style="color:#0EBEFF"></i><strong id="tar_n_prog">0</strong><span>Prog.</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item"><i class="fas fa-eye" style="color:#7000FF"></i><strong id="tar_n_rev">0</strong><span>Rev.</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item"><i class="fas fa-circle-check" style="color:#29C72E"></i><strong id="tar_n_done">0</strong><span>Hecho</span></div>
      </div>
    </div>
  </div>

  <div class="tar_actionbar">
    <div class="tar_ab_left">
      <span class="tar_sync_dot tar_sync_loading" id="tar_sync_dot"></span>
      <button class="tar_ab_btn" id="tar_refresh" ${b("Actualizar")}><i class="fas fa-rotate-right"></i></button>
      <div class="tar_quick_wrap">
        <input type="text" class="tar_quick_input" id="tar_quick_input" placeholder="Nueva tarea… (Enter = crear)" maxlength="100"/>
        <select class="tar_quick_select" id="tar_quick_tipo">
          ${Object.entries(v).map(([a,t])=>`<option value="${a}">${t.label}</option>`).join("")}
        </select>
        <button class="tar_ab_btn tar_ab_details" id="tar_quick_details" ${b("+ Detalles")}><i class="fas fa-sliders"></i></button>
      </div>
    </div>
    <div class="tar_ab_right">
      <div class="tar_filtros" id="tar_filtros">
        <button class="tar_fil active" data-fil="todos">Todos</button>
        ${Object.entries(_).map(([a,t])=>`<button class="tar_fil" data-fil="${a}"><i class="fas ${S[a]}" style="color:${y[a]}"></i> ${t}</button>`).join("")}
      </div>
      <div class="tar_search_wrap">
        <i class="fas fa-search"></i>
        <input type="text" class="tar_search_input" id="tar_buscar" placeholder="Buscar…"/>
      </div>
    </div>
  </div>

  <div class="tar_board" id="tar_board">
    ${Object.entries(_).map(([a,t])=>`
    <div class="tar_col" data-estado="${a}">
      <div class="tar_col_head" style="--ec:${y[a]}">
        <div class="tar_col_tit"><i class="fas ${S[a]}" style="color:${y[a]}"></i><span>${t}</span><span class="tar_col_count" id="tar_count_${a}">0</span></div>
      </div>
      <div class="tar_col_body" id="tar_list_${a}"></div>
    </div>`).join("")}
  </div>
</div>

<div class="wiModal" id="modal_tarea">
  <div class="modalBody tar_modal">
    <button class="modalX"><i class="fas fa-times"></i></button>
    <div class="tar_modal_hero" id="tar_m_hero">
      <div class="tar_modal_ico" id="tar_m_ico"><i class="fas fa-plus-circle"></i></div>
      <div><h2 class="tar_modal_tit" id="tar_m_tit">Nueva Tarea</h2><p class="tar_modal_sub" id="tar_m_sub">Completa los datos</p></div>
    </div>
    <div class="tar_modal_body">
      <div class="tar_field">
        <label class="tar_label"><i class="fas fa-heading"></i> Título <span class="tar_req">*</span></label>
        <div class="tar_input_ico"><i class="fas fa-pen"></i><input type="text" class="tar_input" id="t_titulo" placeholder="Ej: Entregar informe" maxlength="100"/></div>
      </div>
      <div class="tar_field">
        <label class="tar_label"><i class="fas fa-tasks"></i> Subtareas</label>
        <div class="tar_subs_list" id="t_subs_list"></div>
        <button type="button" class="tar_btn_add_sub" id="t_add_sub"><i class="fas fa-plus"></i> Añadir paso</button>
      </div>
      <div class="tar_field_row tar_field_row3">
        <div class="tar_field">
          <label class="tar_label"><i class="fas fa-calendar-day"></i> Límite</label>
          <input type="date" class="tar_input tar_input_plain" id="t_fecha"/>
        </div>
        <div class="tar_field">
          <label class="tar_label"><i class="fas fa-flag"></i> Prioridad</label>
          <select class="tar_select" id="t_prio">
            <option value="alta">🔴 Alta</option>
            <option value="media" selected>🟡 Media</option>
            <option value="baja">🟢 Baja</option>
          </select>
        </div>
        <div class="tar_field">
          <label class="tar_label"><i class="fas fa-signal"></i> Estado</label>
          <select class="tar_select" id="t_estado">
            ${Object.entries(_).map(([a,t])=>`<option value="${a}">${t}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="tar_field_row tar_field_row_tipo">
        <div class="tar_field">
          <label class="tar_label"><i class="fas fa-tag"></i> Tipo</label>
          <select class="tar_select" id="t_tipo">
            ${Object.entries(v).map(([a,t])=>`<option value="${a}">${t.label}</option>`).join("")}
          </select>
        </div>
        <div class="tar_field">
          <label class="tar_label"><i class="fas fa-palette"></i> Color</label>
          <div class="tar_colores" id="t_colores">
            ${k.map(a=>`<button type="button" class="tar_color_opt" data-color="${a}" style="--c:${a}"></button>`).join("")}
          </div>
        </div>
      </div>
      <div class="tar_modal_footer">
        <button type="button" class="tar_btn_del dpn" id="t_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
        <div class="tar_modal_footer_r">
          <button type="button" class="tar_btn_cancel" id="t_cancelar">Cancelar</button>
          <button type="button" class="tar_btn_save" id="t_guardar"><i class="fas fa-floppy-disk"></i> Guardar</button>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_tar_confirm">
  <div class="modalBody tar_modal_confirm">
    <div class="tar_confirm_ico"><i class="fas fa-triangle-exclamation"></i></div>
    <h3>¿Eliminar tarea?</h3>
    <p id="tar_confirm_nombre"></p>
    <div class="tar_confirm_btns">
      <button class="tar_btn_cancel" id="tar_conf_no">Cancelar</button>
      <button class="tar_btn_del_confirm" id="tar_conf_si"><i class="fas fa-trash"></i> Eliminar</button>
    </div>
  </div>
</div>`,f=()=>{const a=ha(),t=u();Object.keys(_).forEach(s=>{const e=o(`#tar_list_${s}`).empty(),r=a.filter(i=>(i.estado||"pendiente")===s).sort((i,l)=>(N[i.prio]||1)-(N[l.prio]||1));if(o(`#tar_count_${s}`).text(r.length),!r.length){e.html('<div class="tar_empty"><i class="fas fa-inbox"></i><span>Sin tareas</span></div>');return}r.forEach(i=>{const l=v[i.tipo]||v.trabajo,$=i.color||l.color,d=i.subtareas||[],P=d.filter(h=>h.done).length,Y=d.length?Math.round(P/d.length*100):s==="hecho"?100:0,M=s!=="pendiente",A=s!=="hecho";e.append(`
      <div class="tar_card" data-id="${i._fsId}" style="--tc:${$}">
        <div class="tar_card_top">
          <span class="tar_prio_dot" style="background:${ca[i.prio]||"#FFB800"}"></span>
          <span class="tar_card_titulo">${i.titulo}</span>
          <span class="tar_card_tipo" style="--tag:${l.color}"><i class="fas ${l.icon}"></i>${l.label}</span>
          <button class="tar_card_menu" data-id="${i._fsId}" ${b("Eliminar")}><i class="fas fa-ellipsis-v"></i></button>
        </div>
        ${d.length?`<div class="tar_card_subs">${d.map(h=>`<span class="tar_sub_pill${h.done?" tar_sub_done":""}"><i class="fas ${h.done?"fa-check-circle":"fa-circle-dot"}"></i>${h.txt}</span>`).join("")}</div>`:""}
        ${d.length?`<div class="tar_card_prog"><div class="tar_prog_bar"><div class="tar_prog_fill" style="width:${Y}%;background:${$}"></div></div><span class="tar_prog_txt">${P}/${d.length}</span></div>`:""}
        <div class="tar_card_bottom">
          <div class="tar_card_meta">${i.fecha?`<span class="tar_meta_fecha"><i class="fas fa-calendar"></i>${da(i.fecha)} ${_a(i.fecha)}</span>`:""}</div>
          <div class="tar_card_flow">
            <button class="tar_flow_btn ${M?"":"tar_flow_off"}" data-id="${i._fsId}" data-dir="prev" ${b(M?_[K[s]]:"")}><i class="fas fa-chevron-left"></i></button>
            <span class="tar_flow_estado" style="color:${y[s]}"><i class="fas ${S[s]}"></i></span>
            <button class="tar_flow_btn ${A?"":"tar_flow_off"}" data-id="${i._fsId}" data-dir="next" ${b(A?_[X[s]]:"")}><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>`)})}),o("#tar_n_total").text(t.length),o("#tar_n_pend").text(t.filter(s=>(s.estado||"pendiente")==="pendiente").length),o("#tar_n_prog").text(t.filter(s=>s.estado==="progreso").length),o("#tar_n_rev").text(t.filter(s=>s.estado==="revision").length),o("#tar_n_done").text(t.filter(s=>s.estado==="hecho").length),$a()},$a=()=>{g.forEach(a=>{try{a?.destroy?.()}catch{}}),g=[],Object.keys(_).forEach(a=>{const t=document.getElementById(`tar_list_${a}`);t&&g.push(new Z(t,{group:"tareas",animation:150,ghostClass:"tar_ghost",dragClass:"tar_dragging",onEnd:s=>{const e=s.item?.dataset?.id,r=s.to?.id?.replace("tar_list_","");if(!e||!r)return;const i=u().find(d=>d._fsId===e);if(!i||i.estado===r)return;const l=i.historial||[];l.push({de:i.estado,a:r,fecha:new Date().toISOString()}),E({...i,estado:r,historial:l,completado:r==="hecho"?new Date().toISOString():""}),f();const $={pendiente:"⏳",progreso:"🔄",revision:"👀",hecho:"✅"}[r];p(`${$} Movido a ${_[r]}`,"success")}}))})},W=a=>{o("#t_colores .tar_color_opt").removeClass("active"),o(`#t_colores .tar_color_opt[data-color="${a}"]`).addClass("active")},J=()=>o("#t_colores .tar_color_opt.active").data("color")||k[0],x=(a,t)=>{o("#tar_m_hero").css("background",`linear-gradient(135deg,${a}dd,${a}88)`),o("#tar_m_ico").css("background",a).html(`<i class="fas ${t}"></i>`)},ya=(a=[])=>{const t=o("#t_subs_list").empty();(a.length?a:[{txt:"",done:!1},{txt:"",done:!1},{txt:"",done:!1}]).forEach((e,r)=>{const i=typeof e=="string"?{txt:e,done:!1}:e;t.append(`<div class="tar_sub_row"><div class="tar_sub_check${i.done?" tar_sub_checked":""}" data-si="${r}"><i class="fas fa-check"></i></div><input type="text" class="tar_sub_input" placeholder="Paso ${r+1}…" value="${i.txt||""}" maxlength="80"/><button type="button" class="tar_del_sub"><i class="fas fa-times"></i></button></div>`)})},wa=()=>o(".tar_sub_row").map((a,t)=>{const s=o(t).find(".tar_sub_input").val().trim(),e=o(t).find(".tar_sub_check").hasClass("tar_sub_checked");return s?{txt:s,done:e}:null}).get().filter(Boolean),L=(a={})=>{n=a._fsId?a:null;const t=a.color||k[0],s=a.tipo||"trabajo";o("#t_titulo").val(a.titulo||o("#tar_quick_input").val().trim()||""),o("#t_fecha").val(a.fecha||O()),o("#t_prio").val(a.prio||"media"),o("#t_tipo").val(a.tipo||o("#tar_quick_tipo").val()||s),o("#t_estado").val(a.estado||"pendiente"),ya(a.subtareas||[]),W(t),x(t,v[s]?.icon||"fa-plus-circle"),o("#tar_m_tit").text(n?"Editar Tarea":"Nueva Tarea"),o("#tar_m_sub").text(n?"Modifica los datos":"Completa los datos"),o("#t_eliminar").toggleClass("dpn",!n),V("modal_tarea"),setTimeout(()=>o("#t_titulo").focus(),30)},R=()=>{const a=o("#t_titulo").val().trim();if(!a)return p("Título requerido","warning");w("#t_guardar",!0,"Guardar"),E({...n||{},titulo:a,fecha:o("#t_fecha").val()||O(),prio:o("#t_prio").val(),tipo:o("#t_tipo").val(),estado:o("#t_estado").val(),color:J(),subtareas:wa(),historial:n?.historial||[],creado:n?.creado||new Date().toISOString()}),m("modal_tarea"),f(),o("#tar_quick_input").val(""),w("#t_guardar",!1,"Guardar"),p(n?"Tarea actualizada ✓":"Tarea creada ✓","success")},z=a=>{o("#tar_confirm_nombre").text(a.titulo||"Sin título"),U=()=>{va(a),m("modal_tar_confirm"),f(),p("Tarea eliminada ✓","success")},V("modal_tar_confirm")},ka=()=>{o(document).off(".tar"),o(document).on("keydown.tar","#tar_quick_input",t=>{t.key==="Enter"&&(t.preventDefault(),ma())}).on("click.tar","#tar_quick_details",()=>L()).on("click.tar","#tar_refresh",ba).on("click.tar",".tar_fil",function(){F=o(this).data("fil"),o(".tar_fil").removeClass("active"),o(this).addClass("active"),f()}).on("input.tar","#tar_buscar",function(){C=o(this).val(),f()}).on("click.tar",".tar_card",function(t){if(o(t.target).closest(".tar_card_menu,.tar_flow_btn").length)return;const s=u().find(e=>e._fsId===o(this).data("id"));s&&L(s)}).on("click.tar",".tar_card_menu",function(t){t.stopPropagation();const s=u().find(e=>e._fsId===o(this).data("id"));s&&z(s)}).on("click.tar",".tar_flow_btn:not(.tar_flow_off)",function(t){t.stopPropagation(),ga(o(this).data("id"),o(this).data("dir"))}).on("click.tar","#t_colores .tar_color_opt",function(){W(o(this).data("color")),x(o(this).data("color"),v[o("#t_tipo").val()]?.icon||"fa-plus-circle")}).on("change.tar","#t_tipo",function(){x(J(),v[o(this).val()]?.icon||"fa-plus-circle")}).on("click.tar","#t_add_sub",()=>{const t=o("#t_subs_list .tar_sub_row").length+1;o("#t_subs_list").append(`<div class="tar_sub_row"><div class="tar_sub_check" data-si="${t-1}"><i class="fas fa-check"></i></div><input type="text" class="tar_sub_input" placeholder="Paso ${t}…" maxlength="80"/><button type="button" class="tar_del_sub"><i class="fas fa-times"></i></button></div>`),o("#t_subs_list .tar_sub_row:last .tar_sub_input").focus()}).on("click.tar",".tar_sub_check",function(){o(this).toggleClass("tar_sub_checked")}).on("click.tar",".tar_del_sub",function(){o(this).closest(".tar_sub_row").remove()}).on("click.tar","#t_cancelar",()=>m("modal_tarea")).on("click.tar","#t_guardar",R).on("click.tar","#t_eliminar",()=>{n&&(m("modal_tarea"),z(n))}).on("keydown.tar","#t_titulo",t=>{t.key==="Enter"&&R()}).on("click.tar","#tar_conf_no",()=>m("modal_tar_confirm")).on("click.tar","#tar_conf_si",()=>U?.())},ja=async()=>{await Q(),f(),ka(),console.log("📋 Tareas v5.0 OK")},Oa=()=>{g.forEach(a=>{try{a?.el?.parentNode&&a.destroy()}catch{}}),g=[],o(document).off(".tar"),console.log("🧹 Tareas limpiado")};export{Oa as cleanup,ja as init,Ia as render};
