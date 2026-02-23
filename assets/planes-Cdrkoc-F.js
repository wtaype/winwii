import{j as s}from"./vendor-gzd0YkcT.js";import{db as E}from"./firebase-CqWas0S_.js";import{g as V,q as X,c as J,w as W,s as Y,d as z,a as Z,b as aa}from"./firebase-X7xaP-Jv.js";import{d as v,h as $,N as g,e as m,g as L,s as la,f as q}from"./main-B0GSvCsW.js";import"./main-D_fbEcK-.js";const x="wii_planes_v1",P="planes",f={personal:{label:"Personal",icon:"fa-user",color:"#FFB800"},trabajo:{label:"Trabajo",icon:"fa-briefcase",color:"#0EBEFF"},estudio:{label:"Estudio",icon:"fa-book",color:"#7000FF"},salud:{label:"Salud",icon:"fa-heart-pulse",color:"#FF5C69"},finanzas:{label:"Finanzas",icon:"fa-coins",color:"#29C72E"},viaje:{label:"Viaje",icon:"fa-plane",color:"#00C9B1"},proyecto:{label:"Proyecto",icon:"fa-diagram-project",color:"#A855F7"},otro:{label:"Otro",icon:"fa-circle",color:"#94A3B8"}},C={alta:{label:"Alta",color:"#FF5C69",icon:"fa-arrow-up"},media:{label:"Media",color:"#FFB800",icon:"fa-minus"},baja:{label:"Baja",color:"#29C72E",icon:"fa-arrow-down"}},y={activo:{label:"Activo",icon:"fa-circle-dot",color:"#0EBEFF"},pausado:{label:"Pausado",icon:"fa-pause-circle",color:"#FFB800"},completado:{label:"Completado",icon:"fa-circle-check",color:"#29C72E"},cancelado:{label:"Cancelado",icon:"fa-circle-xmark",color:"#94A3B8"}},I=["#0EBEFF","#29C72E","#7000FF","#FF5C69","#FFB800","#00C9B1","#A855F7","#94A3B8"],j=()=>new Date().toISOString().split("T")[0],sa=l=>`${(l||"plan").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"").slice(0,25)}_${Date.now()}`,O=l=>l?new Date(l+"T00:00:00").toLocaleDateString("es-PE",{day:"numeric",month:"short",year:"numeric"}):"—",na=l=>{if(!l)return"";const a=Math.ceil((new Date(l+"T00:00:00")-new Date(j()+"T00:00:00"))/864e5);return a<0?`<span class="pln_vencido">${-a}d atrás</span>`:a===0?'<span class="pln_hoy">Hoy</span>':`<span class="pln_dias">${a}d</span>`},oa=l=>{const a=l.pasos?.length||0,o=l.pasos?.filter(n=>n.done).length||0;return a?Math.round(o/a*100):l.estado==="completado"?100:0},B=()=>L("wiSmile")||null,A=()=>!!B()?.usuario,p=()=>L(x)||[],D=l=>la(x,l,48),c=l=>{const a=s("#pln_sync");a.length&&(a[0].className=`pln_sync_dot pln_sync_${l}`)},N=async(l=!1)=>{if(!l&&p().length)return c("ok");if(!A())return c("error");c("loading");try{const a=await V(X(J(E,P),W("usuario","==",B().usuario)));D(a.docs.map(o=>({...o.data(),_fsId:o.id,id:o.id}))),c("ok")}catch(a){console.error("❌ planes:",a),c("error")}},R=l=>{const a=p(),o=l._fsId||sa(l.titulo),n={...l,_fsId:o,id:o},t=a.findIndex(i=>i._fsId===o);if(t>=0?a.splice(t,1,n):a.push(n),D(a),A()){c("saving");const i=B()||{},u={...n};delete u._fsId,Y(z(E,P,o),{...u,usuario:i.usuario||"",email:i.email||"",actualizado:aa()},{merge:!0}).then(()=>c("ok")).catch(b=>{console.error("❌ upsert:",b),c("error")})}return n},ta=l=>{const a=l._fsId||l.id;D(p().filter(o=>o._fsId!==a)),A()&&(c("saving"),Z(z(E,P,a)).then(()=>c("ok")).catch(o=>{console.error("❌ del:",o),c("error")}))};let h="todos",w="",e=null,G=null,H="grid";const ia=()=>{let l=p();if(h!=="todos"&&(l=l.filter(a=>a.estado===h||a.categoria===h)),w){const a=w.toLowerCase();l=l.filter(o=>(o.titulo||"").toLowerCase().includes(a)||(o.descripcion||"").toLowerCase().includes(a))}return l.sort((a,o)=>{const n={alta:0,media:1,baja:2};return(n[a.prioridad]||1)-(n[o.prioridad]||1)})},ba=()=>`
<div class="pln_wrap">
  <div class="pln_toolbar">
    <div class="pln_tb_left">
      <div class="pln_logo"><i class="fas fa-rocket"></i><span>Mis Planes</span></div>
    </div>
    <div class="pln_tb_right">
      <div class="pln_resumen" id="pln_resumen">
        <div class="pln_res_item"><i class="fas fa-layer-group" style="color:var(--mco)"></i><strong id="pln_n_total">0</strong><span>Total</span></div>
        <div class="pln_res_sep"></div>
        <div class="pln_res_item"><i class="fas fa-circle-dot" style="color:#0EBEFF"></i><strong id="pln_n_activo">0</strong><span>Activos</span></div>
        <div class="pln_res_sep"></div>
        <div class="pln_res_item"><i class="fas fa-pause-circle" style="color:#FFB800"></i><strong id="pln_n_pausado">0</strong><span>Pausados</span></div>
        <div class="pln_res_sep"></div>
        <div class="pln_res_item"><i class="fas fa-circle-check" style="color:#29C72E"></i><strong id="pln_n_comp">0</strong><span>Hechos</span></div>
      </div>
    </div>
  </div>

  <div class="pln_actionbar">
    <div class="pln_ab_left">
      <span class="pln_sync_dot pln_sync_loading" id="pln_sync"></span>
      <button class="pln_ab_btn" id="pln_refresh" ${v("Actualizar")}><i class="fas fa-rotate-right"></i></button>
      <button class="pln_ab_btn pln_ab_nuevo" id="pln_nuevo"><i class="fas fa-plus"></i> Nuevo plan</button>
    </div>
    <div class="pln_ab_right">
      <div class="pln_filtros" id="pln_filtros">
        <button class="pln_fil active" data-fil="todos">Todos</button>
        ${Object.entries(y).map(([l,a])=>`<button class="pln_fil" data-fil="${l}" style="--fc:${a.color}"><i class="fas ${a.icon}"></i> ${a.label}</button>`).join("")}
      </div>
      <div class="pln_search_wrap">
        <i class="fas fa-search"></i>
        <input type="text" class="pln_search_input" id="pln_buscar" placeholder="Buscar…"/>
      </div>
      <div class="pln_vista_btns">
        <button class="pln_vista_btn active" data-vista="grid" ${v("Cuadrícula")}><i class="fas fa-grid-2"></i></button>
        <button class="pln_vista_btn" data-vista="list" ${v("Lista")}><i class="fas fa-list"></i></button>
      </div>
    </div>
  </div>

  <div class="pln_content" id="pln_content"></div>
</div>

<div class="wiModal" id="modal_plan">
  <div class="modalBody pln_modal">
    <button class="modalX"><i class="fas fa-times"></i></button>
    <div class="pln_modal_hero" id="pln_m_hero">
      <div class="pln_modal_ico" id="pln_m_ico"><i class="fas fa-rocket"></i></div>
      <div><h2 class="pln_modal_tit" id="pln_m_tit">Nuevo Plan</h2><p class="pln_modal_sub" id="pln_m_sub">Define tu objetivo</p></div>
    </div>
    <div class="pln_modal_body">
      <div class="pln_field">
        <label class="pln_label"><i class="fas fa-heading"></i> Título <span class="pln_req">*</span></label>
        <div class="pln_input_ico"><i class="fas fa-pen"></i><input type="text" class="pln_input" id="p_titulo" placeholder="Ej: Aprender inglés" maxlength="80"/></div>
      </div>
      <div class="pln_field">
        <label class="pln_label"><i class="fas fa-align-left"></i> Descripción</label>
        <textarea class="pln_textarea" id="p_desc" placeholder="¿En qué consiste tu plan?" maxlength="300" rows="2"></textarea>
      </div>
      <div class="pln_field">
        <label class="pln_label"><i class="fas fa-list-check"></i> Pasos</label>
        <div class="pln_pasos_list" id="p_pasos_list"></div>
        <button type="button" class="pln_btn_add_paso" id="p_add_paso"><i class="fas fa-plus"></i> Añadir paso</button>
      </div>
      <div class="pln_field_row pln_field_row3">
        <div class="pln_field">
          <label class="pln_label"><i class="fas fa-calendar"></i> Inicio</label>
          <input type="date" class="pln_input pln_input_plain" id="p_inicio"/>
        </div>
        <div class="pln_field">
          <label class="pln_label"><i class="fas fa-flag-checkered"></i> Meta</label>
          <input type="date" class="pln_input pln_input_plain" id="p_meta"/>
        </div>
        <div class="pln_field">
          <label class="pln_label"><i class="fas fa-signal"></i> Estado</label>
          <select class="pln_select" id="p_estado">
            ${Object.entries(y).map(([l,a])=>`<option value="${l}">${a.label}</option>`).join("")}
          </select>
        </div>
      </div>
      <div class="pln_field_row pln_field_row3">
        <div class="pln_field">
          <label class="pln_label"><i class="fas fa-tag"></i> Categoría</label>
          <select class="pln_select" id="p_cat">
            ${Object.entries(f).map(([l,a])=>`<option value="${l}">${a.label}</option>`).join("")}
          </select>
        </div>
        <div class="pln_field">
          <label class="pln_label"><i class="fas fa-flag"></i> Prioridad</label>
          <select class="pln_select" id="p_prio">
            ${Object.entries(C).map(([l,a])=>`<option value="${l}">${a.label}</option>`).join("")}
          </select>
        </div>
        <div class="pln_field">
          <label class="pln_label"><i class="fas fa-palette"></i> Color</label>
          <div class="pln_colores" id="p_colores">
            ${I.map(l=>`<button type="button" class="pln_color_opt" data-color="${l}" style="--c:${l}"></button>`).join("")}
          </div>
        </div>
      </div>
      <div class="pln_modal_footer">
        <button type="button" class="pln_btn_del dpn" id="p_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
        <div class="pln_modal_footer_r">
          <button type="button" class="pln_btn_cancel" id="p_cancelar">Cancelar</button>
          <button type="button" class="pln_btn_save" id="p_guardar"><i class="fas fa-floppy-disk"></i> Guardar</button>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="wiModal" id="modal_pln_confirm">
  <div class="modalBody pln_modal_confirm">
    <div class="pln_confirm_ico"><i class="fas fa-triangle-exclamation"></i></div>
    <h3>¿Eliminar plan?</h3>
    <p id="pln_confirm_nombre"></p>
    <div class="pln_confirm_btns">
      <button class="pln_btn_cancel" id="pln_conf_no">Cancelar</button>
      <button class="pln_btn_del_confirm" id="pln_conf_si"><i class="fas fa-trash"></i> Eliminar</button>
    </div>
  </div>
</div>`,_=()=>{const l=ia(),a=p(),o=s("#pln_content").empty().attr("class",`pln_content pln_${H}`);if(s("#pln_n_total").text(a.length),s("#pln_n_activo").text(a.filter(n=>n.estado==="activo").length),s("#pln_n_pausado").text(a.filter(n=>n.estado==="pausado").length),s("#pln_n_comp").text(a.filter(n=>n.estado==="completado").length),!l.length){o.html('<div class="pln_empty"><i class="fas fa-rocket"></i><h3>Sin planes aún</h3><p>Crea tu primer plan y empieza a avanzar hacia tus metas</p><button class="pln_btn_save" id="pln_empty_nuevo"><i class="fas fa-plus"></i> Crear plan</button></div>');return}l.forEach(n=>{const t=f[n.categoria]||f.otro,i=y[n.estado]||y.activo,u=C[n.prioridad]||C.media,b=n.color||t.color,S=oa(n),r=n.pasos||[];r.filter(d=>d.done).length;const U=n.estado==="completado";o.append(`
    <div class="pln_card${U?" pln_card_done":""}" data-id="${n._fsId}" style="--pc:${b}">
      <div class="pln_card_header">
        <div class="pln_card_ico" style="background:${b}"><i class="fas ${t.icon}"></i></div>
        <div class="pln_card_head_info">
          <div class="pln_card_titulo">${n.titulo}</div>
          <div class="pln_card_badges">
            <span class="pln_badge_est" style="--ec:${i.color}"><i class="fas ${i.icon}"></i>${i.label}</span>
            <span class="pln_badge_prio" style="--rc:${u.color}"><i class="fas ${u.icon}"></i>${u.label}</span>
            <span class="pln_badge_cat" style="--cc:${t.color}"><i class="fas ${t.icon}"></i>${t.label}</span>
          </div>
        </div>
        <button class="pln_card_opts" data-id="${n._fsId}" ${v("Opciones")}><i class="fas fa-ellipsis-v"></i></button>
      </div>
      ${n.descripcion?`<p class="pln_card_desc">${n.descripcion}</p>`:""}
      <div class="pln_card_prog">
        <div class="pln_prog_header">
          <span class="pln_prog_label"><i class="fas fa-chart-line"></i> Progreso</span>
          <span class="pln_prog_pct">${S}%</span>
        </div>
        <div class="pln_prog_track"><div class="pln_prog_fill" style="width:${S}%;background:${b}"></div></div>
        ${r.length?`<div class="pln_pasos_mini">${r.map(d=>`<span class="pln_paso_dot${d.done?" pln_paso_done":""}" title="${d.txt}"></span>`).join("")}</div>`:""}
      </div>
      ${r.length?`<div class="pln_card_pasos_preview">${r.slice(0,3).map(d=>`<div class="pln_paso_item${d.done?" pln_paso_item_done":""}"><i class="fas ${d.done?"fa-circle-check":"fa-circle-dot"}"></i><span>${d.txt}</span></div>`).join("")}${r.length>3?`<div class="pln_paso_more">+${r.length-3} más</div>`:""}</div>`:""}
      <div class="pln_card_footer">
        <div class="pln_card_fechas">
          ${n.inicio?`<span><i class="fas fa-play"></i>${O(n.inicio)}</span>`:""}
          ${n.meta?`<span class="pln_card_meta_fecha"><i class="fas fa-flag-checkered"></i>${O(n.meta)} ${na(n.meta)}</span>`:""}
        </div>
        <div class="pln_card_actions">
          ${n.estado!=="completado"?`<button class="pln_action_btn pln_action_check" data-id="${n._fsId}" ${v("Completar")}><i class="fas fa-check"></i></button>`:""}
          <button class="pln_action_btn pln_action_edit" data-id="${n._fsId}" ${v("Editar")}><i class="fas fa-pen"></i></button>
        </div>
      </div>
    </div>`)})},ca=(l=[])=>{const a=s("#p_pasos_list").empty();(l.length?l:[{txt:"",done:!1},{txt:"",done:!1}]).forEach((n,t)=>{const i=typeof n=="string"?{txt:n,done:!1}:n;a.append(`<div class="pln_paso_row"><div class="pln_paso_check${i.done?" pln_paso_checked":""}" data-pi="${t}"><i class="fas fa-check"></i></div><input type="text" class="pln_paso_input" placeholder="Paso ${t+1}…" value="${i.txt||""}" maxlength="80"/><button type="button" class="pln_del_paso"><i class="fas fa-times"></i></button></div>`)})},ea=()=>s(".pln_paso_row").map((l,a)=>{const o=s(a).find(".pln_paso_input").val().trim(),n=s(a).find(".pln_paso_check").hasClass("pln_paso_checked");return o?{txt:o,done:n}:null}).get().filter(Boolean),K=l=>{s("#p_colores .pln_color_opt").removeClass("active"),s(`#p_colores .pln_color_opt[data-color="${l}"]`).addClass("active")},Q=()=>s("#p_colores .pln_color_opt.active").data("color")||I[0],F=(l,a)=>{s("#pln_m_hero").css("background",`linear-gradient(135deg,${l}dd,${l}88)`),s("#pln_m_ico").css("background",l).html(`<i class="fas ${a}"></i>`)},k=(l={})=>{e=l._fsId?l:null;const a=l.categoria||"personal",o=l.color||f[a]?.color||I[0];s("#p_titulo").val(l.titulo||""),s("#p_desc").val(l.descripcion||""),s("#p_inicio").val(l.inicio||j()),s("#p_meta").val(l.meta||""),s("#p_estado").val(l.estado||"activo"),s("#p_cat").val(a),s("#p_prio").val(l.prioridad||"media"),ca(l.pasos||[]),K(o),F(o,f[a]?.icon||"fa-rocket"),s("#pln_m_tit").text(e?"Editar Plan":"Nuevo Plan"),s("#pln_m_sub").text(e?"Modifica tu plan":"Define tu objetivo"),s("#p_eliminar").toggleClass("dpn",!e),q("modal_plan"),setTimeout(()=>s("#p_titulo").focus(),30)},T=()=>{const l=s("#p_titulo").val().trim();if(!l)return g("Título requerido","warning");$("#p_guardar",!0,"Guardar");const a=s("#p_cat").val();R({...e||{},titulo:l,descripcion:s("#p_desc").val().trim(),inicio:s("#p_inicio").val()||j(),meta:s("#p_meta").val()||"",estado:s("#p_estado").val(),categoria:a,prioridad:s("#p_prio").val(),color:Q(),pasos:ea(),creado:e?.creado||new Date().toISOString()}),m("modal_plan"),_(),$("#p_guardar",!1,"Guardar"),g(e?"Plan actualizado ✓":"Plan creado ✓","success")},pa=l=>{const a=p().find(n=>n._fsId===l);if(!a)return;const o=(a.pasos||[]).map(n=>({...n,done:!0}));R({...a,estado:"completado",pasos:o,completadoEn:new Date().toISOString()}),_(),g("🎉 ¡Plan completado!","success")},M=l=>{s("#pln_confirm_nombre").text(l.titulo||"Sin título"),G=()=>{ta(l),m("modal_pln_confirm"),_(),g("Plan eliminado ✓","success")},q("modal_pln_confirm")},da=()=>{s(document).off(".pln"),s(document).on("click.pln","#pln_nuevo,#pln_empty_nuevo",()=>k()).on("click.pln","#pln_refresh",async()=>{$("#pln_refresh",!0,""),localStorage.removeItem(x),await N(!0),_(),$("#pln_refresh",!1,""),g("Planes actualizados ✓","success")}).on("click.pln",".pln_fil",function(){h=s(this).data("fil"),s(".pln_fil").removeClass("active"),s(this).addClass("active"),_()}).on("input.pln","#pln_buscar",function(){w=s(this).val(),_()}).on("click.pln",".pln_vista_btn",function(){H=s(this).data("vista"),s(".pln_vista_btn").removeClass("active"),s(this).addClass("active"),_()}).on("click.pln",".pln_card",function(a){if(s(a.target).closest(".pln_card_opts,.pln_action_btn").length)return;const o=p().find(n=>n._fsId===s(this).data("id"));o&&k(o)}).on("click.pln",".pln_action_edit",function(a){a.stopPropagation();const o=p().find(n=>n._fsId===s(this).data("id"));o&&k(o)}).on("click.pln",".pln_action_check",function(a){a.stopPropagation(),pa(s(this).data("id"))}).on("click.pln",".pln_card_opts",function(a){a.stopPropagation();const o=p().find(n=>n._fsId===s(this).data("id"));o&&M(o)}).on("change.pln","#p_cat",function(){const a=s(this).val();F(Q(),f[a]?.icon||"fa-rocket")}).on("click.pln","#p_colores .pln_color_opt",function(){K(s(this).data("color")),F(s(this).data("color"),f[s("#p_cat").val()]?.icon||"fa-rocket")}).on("click.pln","#p_add_paso",()=>{const a=s("#p_pasos_list .pln_paso_row").length+1;s("#p_pasos_list").append(`<div class="pln_paso_row"><div class="pln_paso_check" data-pi="${a-1}"><i class="fas fa-check"></i></div><input type="text" class="pln_paso_input" placeholder="Paso ${a}…" maxlength="80"/><button type="button" class="pln_del_paso"><i class="fas fa-times"></i></button></div>`),s("#p_pasos_list .pln_paso_row:last .pln_paso_input").focus()}).on("click.pln",".pln_paso_check",function(){s(this).toggleClass("pln_paso_checked")}).on("click.pln",".pln_del_paso",function(){s(this).closest(".pln_paso_row").remove()}).on("click.pln","#p_cancelar",()=>m("modal_plan")).on("click.pln","#p_guardar",T).on("click.pln","#p_eliminar",()=>{e&&(m("modal_plan"),M(e))}).on("keydown.pln","#p_titulo",a=>{a.key==="Enter"&&T()}).on("click.pln","#pln_conf_no",()=>m("modal_pln_confirm")).on("click.pln","#pln_conf_si",()=>G?.())},ma=async()=>{await N(),_(),da(),console.log("🚀 Planes v1.0 OK")},ga=()=>{s(document).off(".pln"),console.log("🧹 Planes limpiado")};export{ga as cleanup,ma as init,ba as render};
