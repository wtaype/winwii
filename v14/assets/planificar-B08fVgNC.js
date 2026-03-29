import{j as e}from"./vendor-gzd0YkcT.js";import{S as ca}from"./sortable.esm-BzJVkfZx.js";import{db as P}from"./firebase-DHVsH4U5.js";import{g as la,q as da,c as _a,w as ua,s as fa,d as Q,a as pa,b as va}from"./firebase-Whrs9NU2.js";import{h as ba,d as n,e as h,g as W,s as ha,N as v,f as J,j as T}from"./main-B6nsIEdO.js";const q="wii_tareas_v1",B="tareas",p={pendiente:"Pendiente",progreso:"En progreso",revision:"Revisión",hecho:"Hecho"},x={pendiente:"fa-circle-dot",progreso:"fa-spinner fa-pulse",revision:"fa-eye",hecho:"fa-circle-check"},E={pendiente:"#FFB800",progreso:"#0EBEFF",revision:"#7000FF",hecho:"#29C72E"},Y={pendiente:"progreso",progreso:"revision",revision:"hecho",hecho:"hecho"},Z={pendiente:"pendiente",progreso:"pendiente",revision:"progreso",hecho:"revision"},b={trabajo:{label:"Trabajo",icon:"fa-briefcase",color:"#29C72E"},estudio:{label:"Estudio",icon:"fa-book",color:"#7000FF"},web:{label:"Web",icon:"fa-globe",color:"#0EBEFF"},personal:{label:"Personal",icon:"fa-user",color:"#FFB800"},otros:{label:"Otros",icon:"fa-circle",color:"#94A3B8"}},G={alta:"#FF5C69",media:"#FFB800",baja:"#29C72E"},X={alta:0,media:1,baja:2},F=["#29C72E","#0EBEFF","#7000FF","#FF5C69","#FFB800","#94A3B8"],ma=()=>new Date().toISOString().split("T")[0],ga=a=>a?new Date(a+"T00:00:00").toLocaleDateString("es-PE",{day:"numeric",month:"short"}):"",$a=a=>{if(!a)return"";const t=Math.ceil((new Date(a+"T00:00:00")-new Date(ma()+"T00:00:00"))/864e5);return t<0?`<span class="tar_vencido"><i class="fas fa-exclamation-triangle"></i> ${-t}d</span>`:t===0?'<span class="tar_hoy_tag"><i class="fas fa-bolt"></i> Hoy</span>':t<=3?`<span class="tar_hoy_tag">${t}d</span>`:`${t}d`},A=()=>{const a=new Date;return a.setDate(a.getDate()+7),a.toISOString().split("T")[0]},ya=a=>`${(a||"tarea").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"").slice(0,25)}_${Date.now()}`,M=()=>W("wiSmile")||null,N=()=>!!M()?.usuario,f=()=>W(q)||[],z=a=>ha(q,a,48),_=a=>{const t=e("#tar_sync_dot");if(!t.length)return;t[0].className=`tar_sync_dot tar_sync_${a}`;const s={loading:"Cargando…",ok:"Sincronizado ✓",error:"Sin conexión",saving:"Guardando…"};t.attr("data-witip",s[a]||"")},ka=a=>{const t=M()||{},s={...a};return delete s._fsId,{...s,usuario:t.usuario||"",email:t.email||"",actualizado:va()}},wa=(a,t)=>({...t,_fsId:a,id:a}),I=async(a=!1)=>{if(!a&&f().length)return _("ok");if(!N())return _("error");_("loading");try{const t=await la(da(_a(P,B),ua("usuario","==",M().usuario)));z(t.docs.map(s=>wa(s.id,s.data()))),_("ok")}catch(t){console.error("❌ tareas:",t),_("error")}},k=a=>{const t=f(),s=a._fsId||ya(a.titulo),i={...a,_fsId:s,id:s},r=t.findIndex(o=>o._fsId===s);return r>=0?t.splice(r,1,i):t.push(i),z(t),N()&&(_("saving"),fa(Q(P,B,s),ka(i),{merge:!0}).then(()=>_("ok")).catch(o=>{console.error("❌ upsert:",o),_("error")})),i},Ea=a=>{const t=a._fsId||a.id;z(f().filter(s=>s._fsId!==t)),N()&&(_("saving"),pa(Q(P,B,t)).then(()=>_("ok")).catch(s=>{console.error("❌ del:",s),_("error")}))},aa=async()=>{T("#tar_refresh",!0,""),localStorage.removeItem(q),await I(!0),u(),T("#tar_refresh",!1,""),v("✓ Tareas actualizadas","success")};let j="todos",D="",d=null,ta=null,$=[],y=[],S=null;const Ca=(a,t)=>{let s;return(...i)=>{clearTimeout(s),s=setTimeout(()=>a(...i),t)}},Ta=()=>{let a=f();if(j!=="todos"&&(a=a.filter(t=>(t.estado||"pendiente")===j)),D){const t=D.toLowerCase();a=a.filter(s=>(s.titulo||"").toLowerCase().includes(t)||(s.tipo||"").toLowerCase().includes(t))}return a},Sa=()=>{const a=e("#tar_quick_input").val().trim();if(!a)return v("Escribe un título","warning");const t=e("#tar_quick_tipo").val()||"trabajo";k({titulo:a,fecha:A(),prio:"media",tipo:t,estado:"pendiente",color:b[t]?.color||F[0],subtareas:[],historial:[],creado:new Date().toISOString()}),u(),e("#tar_quick_input").val("").focus(),v("✓ Tarea creada","success"),L()},Fa=(a,t)=>{const s=f().find(c=>c._fsId===a);if(!s)return;const i=t==="next"?Y[s.estado||"pendiente"]:Z[s.estado||"pendiente"];if(i===s.estado)return;const r=s.historial||[];r.push({de:s.estado,a:i,fecha:new Date().toISOString()});const o=s.estado==="hecho",l=i==="hecho";k({...s,estado:i,historial:r,completado:l?new Date().toISOString():""}),u();const m={pendiente:"⏳",progreso:"🔄",revision:"👀",hecho:"🎉"}[i];v(`${m} ${s.titulo} → ${p[i]}`,"success"),l&&!o&&R()},R=()=>{const a=e('<div class="tar_confetti"></div>').appendTo("body"),t=["#29C72E","#0EBEFF","#7000FF","#FF5C69","#FFB800"];for(let s=0;s<30;s++){const i=t[Math.floor(Math.random()*t.length)],r=(Math.random()-.5)*200,o=Math.random()*.3;e(`<div class="tar_confetti_piece" style="background:${i};left:${r}px;animation-delay:${o}s"></div>`).appendTo(a)}setTimeout(()=>a.remove(),1500)},xa=(a,t="eliminar")=>{clearTimeout(S),y.push({tarea:a,action:t});let s=e("#tar_undo_toast");s.length||(s=e(`<div class="tar_undo_toast" id="tar_undo_toast">
      <span><i class="fas fa-trash"></i> Tarea eliminada</span>
      <button class="tar_undo_btn" id="tar_undo_btn"><i class="fas fa-undo"></i> Deshacer</button>
    </div>`).appendTo(".tar_wrap")),requestAnimationFrame(()=>s.addClass("show")),S=setTimeout(()=>{s.removeClass("show"),y=[]},5e3)},sa=()=>{if(!y.length)return;const a=y.pop();a.action==="eliminar"&&(k(a.tarea),u(),v("✓ Tarea restaurada","success")),clearTimeout(S),e("#tar_undo_toast").removeClass("show")},L=()=>{let a=e(".tar_kbd_hint");a.length||(a=e(`<div class="tar_kbd_hint">
      <span class="tar_kbd">N</span> Nueva
      <span class="tar_kbd">/</span> Buscar
      <span class="tar_kbd">?</span> Ayuda
    </div>`).appendTo(".tar_wrap")),a.addClass("show"),setTimeout(()=>a.removeClass("show"),3e3)},Ra=()=>`
<div class="tar_wrap">
  <div class="tar_toolbar">
    <div class="tar_tb_left">
      <div class="tar_logo"><i class="fas fa-folder-open"></i><span>Mis Tareas</span></div>
    </div>
    <div class="tar_tb_right">
      <div class="tar_resumen" id="tar_resumen">
        <div class="tar_res_item" ${n("Total de tareas")}><i class="fas fa-layer-group"></i><strong id="tar_n_total">0</strong><span>Total</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item" ${n("Tareas pendientes")}><i class="fas fa-circle-dot" style="color:#FFB800"></i><strong id="tar_n_pend">0</strong><span>Pend.</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item" ${n("En progreso")}><i class="fas fa-spinner" style="color:#0EBEFF"></i><strong id="tar_n_prog">0</strong><span>Prog.</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item" ${n("En revisión")}><i class="fas fa-eye" style="color:#7000FF"></i><strong id="tar_n_rev">0</strong><span>Rev.</span></div>
        <div class="tar_res_sep"></div>
        <div class="tar_res_item" ${n("Completadas")}><i class="fas fa-circle-check" style="color:#29C72E"></i><strong id="tar_n_done">0</strong><span>Hecho</span></div>
      </div>
    </div>
  </div>

  <div class="tar_actionbar">
    <div class="tar_ab_left">
      <span class="tar_sync_dot tar_sync_loading" id="tar_sync_dot" ${n("Estado de sincronización")}></span>
      <button class="tar_ab_btn" id="tar_refresh" ${n("Actualizar (Ctrl+R)")}><i class="fas fa-rotate-right"></i></button>
      <div class="tar_quick_wrap">
        <input type="text" class="tar_quick_input" id="tar_quick_input" placeholder="✨ Nueva tarea... (presiona Enter)" maxlength="100" autocomplete="off"/>
        <select class="tar_quick_select" id="tar_quick_tipo" ${n("Tipo de tarea")}>
          ${Object.entries(b).map(([a,t])=>`<option value="${a}">${t.label}</option>`).join("")}
        </select>
        <button class="tar_ab_btn tar_ab_details" id="tar_quick_details" ${n("Agregar con detalles (N)")}><i class="fas fa-sliders"></i></button>
      </div>
    </div>
    <div class="tar_ab_right">
      <div class="tar_filtros" id="tar_filtros">
        <button class="tar_fil active" data-fil="todos" ${n("Ver todas")}>Todos</button>
        ${Object.entries(p).map(([a,t])=>`<button class="tar_fil" data-fil="${a}" ${n(t)}><i class="fas ${x[a]}" style="color:${E[a]}"></i> <span>${t}</span></button>`).join("")}
      </div>
      <div class="tar_search_wrap">
        <i class="fas fa-search"></i>
        <input type="text" class="tar_search_input" id="tar_buscar" placeholder="Buscar… (/)" autocomplete="off"/>
      </div>
    </div>
  </div>

  <div class="tar_board" id="tar_board">
    ${Object.entries(p).map(([a,t])=>`
    <div class="tar_col" data-estado="${a}">
      <div class="tar_col_head" style="--ec:${E[a]}">
        <div class="tar_col_tit"><i class="fas ${x[a]}" style="color:${E[a]}"></i><span>${t}</span><span class="tar_col_count" id="tar_count_${a}">0</span></div>
      </div>
      <div class="tar_col_body" id="tar_list_${a}"></div>
    </div>`).join("")}
  </div>
</div>

<div class="wiModal" id="modal_tarea">
  <div class="modalBody tar_modal">
    <button class="modalX" ${n("Cerrar (Esc)")}><i class="fas fa-times"></i></button>
    <div class="tar_modal_scroll">
      <div class="tar_modal_hero" id="tar_m_hero">
        <div class="tar_deco1"></div>
        <div class="tar_deco2"></div>
        <div class="tar_modal_ico" id="tar_m_ico"><i class="fas fa-plus-circle"></i></div>
        <div class="tar_modal_info">
          <h2 class="tar_modal_tit" id="tar_m_tit">Nueva Tarea</h2>
          <p class="tar_modal_sub" id="tar_m_sub">Completa los datos para organizar tu trabajo</p>
        </div>
      </div>
      <div class="tar_modal_body">
        <!-- Sección: Información básica -->
        <div class="tar_section">
          <div class="tar_section_tit"><i class="fas fa-info-circle"></i> Información</div>
          <div class="tar_field">
            <label class="tar_label"><i class="fas fa-heading"></i> Título <span class="tar_req">*</span></label>
            <div class="tar_input_ico"><i class="fas fa-pen"></i><input type="text" class="tar_input" id="t_titulo" placeholder="Ej: Entregar informe mensual" maxlength="100" autocomplete="off"/></div>
          </div>
        </div>

        <!-- Sección: Pasos / Subtareas -->
        <div class="tar_section">
          <div class="tar_section_tit"><i class="fas fa-list-check"></i> Pasos a seguir</div>
          <div class="tar_subs_list" id="t_subs_list"></div>
          <button type="button" class="tar_btn_add_sub" id="t_add_sub"><i class="fas fa-plus"></i> Añadir paso</button>
        </div>

        <!-- Sección: Detalles -->
        <div class="tar_section">
          <div class="tar_section_tit"><i class="fas fa-sliders"></i> Detalles</div>
          <div class="tar_field_row tar_field_row2">
            <div class="tar_field">
              <label class="tar_label"><i class="fas fa-calendar-day"></i> Fecha límite</label>
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
          </div>
          <div class="tar_field_row tar_field_row2" style="margin-top:.6vh">
            <div class="tar_field">
              <label class="tar_label"><i class="fas fa-signal"></i> Estado</label>
              <select class="tar_select" id="t_estado">
                ${Object.entries(p).map(([a,t])=>`<option value="${a}">${t}</option>`).join("")}
              </select>
            </div>
            <div class="tar_field">
              <label class="tar_label"><i class="fas fa-tag"></i> Categoría</label>
              <select class="tar_select" id="t_tipo">
                ${Object.entries(b).map(([a,t])=>`<option value="${a}">${t.label}</option>`).join("")}
              </select>
            </div>
          </div>
        </div>

        <!-- Sección: Personalización -->
        <div class="tar_section">
          <div class="tar_section_tit"><i class="fas fa-palette"></i> Personalizar</div>
          <div class="tar_field">
            <label class="tar_label"><i class="fas fa-swatchbook"></i> Color de la tarea</label>
            <div class="tar_colores" id="t_colores">
              ${F.map(a=>`<button type="button" class="tar_color_opt" data-color="${a}" style="--c:${a}" ${n(a)}></button>`).join("")}
            </div>
          </div>
        </div>
      </div>
      <div class="tar_modal_footer">
        <button type="button" class="tar_btn_del dpn" id="t_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
        <div class="tar_modal_footer_r">
          <button type="button" class="tar_btn_cancel" id="t_cancelar">Cancelar</button>
          <button type="button" class="tar_btn_save" id="t_guardar"><i class="fas fa-check-circle"></i> Guardar</button>
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
</div>`,u=()=>{const a=Ta(),t=f();Object.keys(p).forEach(s=>{const i=e(`#tar_list_${s}`).empty(),r=a.filter(o=>(o.estado||"pendiente")===s).sort((o,l)=>(X[o.prio]||1)-(X[l.prio]||1));if(e(`#tar_count_${s}`).text(r.length),!r.length){const o={pendiente:"📋",progreso:"🚀",revision:"👁️",hecho:"🎉"};i.html(`<div class="tar_empty"><i class="fas fa-inbox"></i><span>${o[s]} Sin tareas aquí</span></div>`);return}r.forEach(o=>{const l=b[o.tipo]||b.trabajo,m=o.color||l.color,c=o.subtareas||[],w=c.filter(g=>g.done).length,ia=c.length?Math.round(w/c.length*100):s==="hecho"?100:0,K=s!=="pendiente",H=s!=="hecho",ra=o.prio==="alta"?"tar_prio_alta":"",na=s==="hecho"?"tar_card_done":"";i.append(`
      <div class="tar_card ${na}" data-id="${o._fsId}" style="--tc:${m}" tabindex="0">
        <div class="tar_card_top">
          <span class="tar_prio_dot ${ra}" style="background:${G[o.prio]||"#FFB800"};color:${G[o.prio]||"#FFB800"}" ${n(o.prio==="alta"?"¡Prioridad alta!":o.prio==="media"?"Prioridad media":"Prioridad baja")}></span>
          <span class="tar_card_titulo">${o.titulo}</span>
          <span class="tar_card_tipo" style="--tag:${l.color}"><i class="fas ${l.icon}"></i>${l.label}</span>
          <button class="tar_card_menu" data-id="${o._fsId}" ${n("Eliminar")}><i class="fas fa-ellipsis-v"></i></button>
        </div>
        ${c.length?`<div class="tar_card_subs">${c.slice(0,4).map(g=>`<span class="tar_sub_pill${g.done?" tar_sub_done":""}"><i class="fas ${g.done?"fa-check-circle":"fa-circle-dot"}"></i>${g.txt}</span>`).join("")}${c.length>4?`<span class="tar_sub_pill">+${c.length-4}</span>`:""}</div>`:""}
        ${c.length?`<div class="tar_card_prog"><div class="tar_prog_bar"><div class="tar_prog_fill" style="width:${ia}%;background:${m}"></div></div><span class="tar_prog_txt">${w}/${c.length}</span></div>`:""}
        <div class="tar_card_bottom">
          <div class="tar_card_meta">${o.fecha?`<span class="tar_meta_fecha"><i class="fas fa-calendar"></i>${ga(o.fecha)} ${$a(o.fecha)}</span>`:""}</div>
          <div class="tar_card_flow">
            <button class="tar_flow_btn ${K?"":"tar_flow_off"}" data-id="${o._fsId}" data-dir="prev" ${n(K?`← ${p[Z[s]]}`:"")}><i class="fas fa-chevron-left"></i></button>
            <span class="tar_flow_estado" style="color:${E[s]}"><i class="fas ${x[s]}"></i></span>
            <button class="tar_flow_btn ${H?"":"tar_flow_off"}" data-id="${o._fsId}" data-dir="next" ${n(H?`${p[Y[s]]} →`:"")}><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>
      </div>`)})}),e("#tar_n_total").text(t.length),e("#tar_n_pend").text(t.filter(s=>(s.estado||"pendiente")==="pendiente").length),e("#tar_n_prog").text(t.filter(s=>s.estado==="progreso").length),e("#tar_n_rev").text(t.filter(s=>s.estado==="revision").length),e("#tar_n_done").text(t.filter(s=>s.estado==="hecho").length),Ia()},Ia=()=>{$.forEach(a=>{try{a?.destroy?.()}catch{}}),$=[],Object.keys(p).forEach(a=>{const t=document.getElementById(`tar_list_${a}`);t&&$.push(new ca(t,{group:"tareas",animation:200,ghostClass:"tar_ghost",dragClass:"tar_dragging",easing:"cubic-bezier(0.4, 0, 0.2, 1)",onEnd:s=>{const i=s.item?.dataset?.id,r=s.to?.id?.replace("tar_list_","");if(!i||!r)return;const o=f().find(w=>w._fsId===i);if(!o||o.estado===r)return;const l=o.historial||[];l.push({de:o.estado,a:r,fecha:new Date().toISOString()});const m=r==="hecho"&&o.estado!=="hecho";k({...o,estado:r,historial:l,completado:r==="hecho"?new Date().toISOString():""}),u();const c={pendiente:"⏳",progreso:"🔄",revision:"👀",hecho:"🎉"}[r];v(`${c} Movido a ${p[r]}`,"success"),m&&R()}}))})},ea=a=>{e("#t_colores .tar_color_opt").removeClass("active"),e(`#t_colores .tar_color_opt[data-color="${a}"]`).addClass("active")},oa=()=>e("#t_colores .tar_color_opt.active").data("color")||F[0],O=(a,t)=>{e("#tar_m_hero").css("background",`linear-gradient(135deg,${a}ee,${a}99)`),e("#tar_m_ico").css("background",a).html(`<i class="fas ${t}"></i>`)},ja=(a=[])=>{const t=e("#t_subs_list").empty();(a.length?a:[{txt:"",done:!1},{txt:"",done:!1},{txt:"",done:!1}]).forEach((i,r)=>{const o=typeof i=="string"?{txt:i,done:!1}:i;t.append(`<div class="tar_sub_row"><div class="tar_sub_check${o.done?" tar_sub_checked":""}" data-si="${r}"><i class="fas fa-check"></i></div><input type="text" class="tar_sub_input" placeholder="Paso ${r+1}…" value="${o.txt||""}" maxlength="80" autocomplete="off"/><button type="button" class="tar_del_sub" ${n("Eliminar paso")}><i class="fas fa-times"></i></button></div>`)})},Da=()=>e(".tar_sub_row").map((a,t)=>{const s=e(t).find(".tar_sub_input").val().trim(),i=e(t).find(".tar_sub_check").hasClass("tar_sub_checked");return s?{txt:s,done:i}:null}).get().filter(Boolean),C=(a={})=>{d=a._fsId?a:null;const t=a.color||F[0],s=a.tipo||"trabajo";e("#t_titulo").val(a.titulo||e("#tar_quick_input").val().trim()||""),e("#t_fecha").val(a.fecha||A()),e("#t_prio").val(a.prio||"media"),e("#t_tipo").val(a.tipo||e("#tar_quick_tipo").val()||s),e("#t_estado").val(a.estado||"pendiente"),ja(a.subtareas||[]),ea(t),O(t,b[s]?.icon||"fa-plus-circle"),e("#tar_m_tit").text(d?"Editar Tarea":"Nueva Tarea"),e("#tar_m_sub").text(d?"Modifica los datos de tu tarea":"Completa los datos para crear tu tarea"),e("#t_eliminar").toggleClass("dpn",!d),J("modal_tarea"),setTimeout(()=>e("#t_titulo").focus(),50)},U=()=>{const a=e("#t_titulo").val().trim();if(!a)return v("⚠️ El título es requerido","warning");T("#t_guardar",!0,"Guardar");const t=e("#t_estado").val(),s=d?.estado,i=t==="hecho"&&s!=="hecho";k({...d||{},titulo:a,fecha:e("#t_fecha").val()||A(),prio:e("#t_prio").val(),tipo:e("#t_tipo").val(),estado:t,color:oa(),subtareas:Da(),historial:d?.historial||[],creado:d?.creado||new Date().toISOString(),completado:t==="hecho"?d?.completado||new Date().toISOString():""}),h("modal_tarea"),u(),e("#tar_quick_input").val(""),T("#t_guardar",!1,"Guardar"),v(d?"✓ Tarea actualizada":"✓ Tarea creada","success"),i&&R()},V=a=>{e("#tar_confirm_nombre").text(`"${a.titulo||"Sin título"}"`),ta=()=>{xa(a,"eliminar"),Ea(a),h("modal_tar_confirm"),u(),v("🗑️ Tarea eliminada","info")},J("modal_tar_confirm")},Oa=a=>{if(["INPUT","TEXTAREA","SELECT"].includes(document.activeElement?.tagName)){a.key==="Escape"&&document.activeElement.blur();return}switch(a.key.toLowerCase()){case"n":a.preventDefault(),C();break;case"/":a.preventDefault(),e("#tar_buscar").focus();break;case"r":a.ctrlKey&&(a.preventDefault(),aa());break;case"escape":h("modal_tarea"),h("modal_tar_confirm");break;case"z":a.ctrlKey&&(a.preventDefault(),sa());break;case"?":L();break}},Pa=Ca(()=>u(),200),qa=()=>{e(document).off(".tar"),e(document).on("keydown.tar","#tar_quick_input",t=>{t.key==="Enter"&&(t.preventDefault(),Sa())}).on("click.tar","#tar_quick_details",()=>C()).on("click.tar","#tar_refresh",aa).on("click.tar",".tar_fil",function(){j=e(this).data("fil"),e(".tar_fil").removeClass("active"),e(this).addClass("active"),u()}).on("input.tar","#tar_buscar",function(){D=e(this).val(),Pa()}).on("click.tar",".tar_card",function(t){if(e(t.target).closest(".tar_card_menu,.tar_flow_btn").length)return;const s=f().find(i=>i._fsId===e(this).data("id"));s&&C(s)}).on("keydown.tar",".tar_card",function(t){if(t.key==="Enter"||t.key===" "){t.preventDefault();const s=f().find(i=>i._fsId===e(this).data("id"));s&&C(s)}}).on("click.tar",".tar_card_menu",function(t){t.stopPropagation();const s=f().find(i=>i._fsId===e(this).data("id"));s&&V(s)}).on("click.tar",".tar_flow_btn:not(.tar_flow_off)",function(t){t.stopPropagation(),Fa(e(this).data("id"),e(this).data("dir"))}).on("click.tar","#t_colores .tar_color_opt",function(){ea(e(this).data("color")),O(e(this).data("color"),b[e("#t_tipo").val()]?.icon||"fa-plus-circle")}).on("change.tar","#t_tipo",function(){O(oa(),b[e(this).val()]?.icon||"fa-plus-circle")}).on("click.tar","#t_add_sub",()=>{const t=e("#t_subs_list .tar_sub_row").length+1;e("#t_subs_list").append(`<div class="tar_sub_row"><div class="tar_sub_check" data-si="${t-1}"><i class="fas fa-check"></i></div><input type="text" class="tar_sub_input" placeholder="Paso ${t}…" maxlength="80" autocomplete="off"/><button type="button" class="tar_del_sub" ${n("Eliminar paso")}><i class="fas fa-times"></i></button></div>`),e("#t_subs_list .tar_sub_row:last .tar_sub_input").focus()}).on("click.tar",".tar_sub_check",function(){e(this).toggleClass("tar_sub_checked")}).on("click.tar",".tar_del_sub",function(){const t=e(this).closest(".tar_sub_row");t.css({opacity:0,transform:"translateX(10px)"}),setTimeout(()=>t.remove(),150)}).on("keydown.tar",".tar_sub_input",function(t){t.key==="Enter"&&(t.preventDefault(),e("#t_add_sub").click())}).on("click.tar","#t_cancelar",()=>h("modal_tarea")).on("click.tar","#t_guardar",U).on("click.tar","#t_eliminar",()=>{d&&(h("modal_tarea"),V(d))}).on("keydown.tar","#t_titulo",t=>{t.key==="Enter"&&t.ctrlKey&&U()}).on("click.tar","#tar_conf_no",()=>h("modal_tar_confirm")).on("click.tar","#tar_conf_si",()=>ta?.()).on("click.tar","#tar_undo_btn",sa).on("keydown.tar",Oa)},La=async()=>{await I(),u(),qa(),ba(I,u),setTimeout(L,1500),console.log("📋 Tareas v6.0 PRO OK")},Ka=()=>{$.forEach(a=>{try{a?.el?.parentNode&&a.destroy()}catch{}}),$=[],y=[],clearTimeout(S),e(document).off(".tar"),console.log("🧹 Tareas limpiado")};export{Ka as cleanup,La as init,Ra as render};
