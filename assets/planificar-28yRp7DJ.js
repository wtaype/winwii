import{j as i}from"./vendor-gzd0YkcT.js";import{S as x}from"./sortable.esm-BzJVkfZx.js";import{db as f}from"./firebase-BInPmxgK.js";import{a as D,q as O,c as F,w as z,b as C,d as v,e as $,k as A}from"./firebase-DYzFYKGm.js";import{N as m,e as N,a as B,S as M,d as g,g as L}from"./main-LeR3ZN5I.js";const I="wii_planificar_v1",u="planificar",b={planificacion:{label:"Planificación",icon:"fa-clipboard-list",color:"#90EE90"},analisis:{label:"Análisis",icon:"fa-search",color:"#87CEEB"},completado:{label:"Completado",icon:"fa-check-circle",color:"#29C72E"}},q=["#90EE90","#87CEEB","#29C72E","#7000FF","#FF5C69","#FFB800","#94A3B8","#EC4899"],E={trabajo:{icon:"fa-briefcase",label:"Trabajo"},estudio:{icon:"fa-book",label:"Estudio"},web:{icon:"fa-globe",label:"Web/Dev"},personal:{icon:"fa-user",label:"Personal"},otros:{icon:"fa-star",label:"Otros"}};let c=[],w=[],h=null;const _=()=>L("wiSmile")||{},J=o=>(o.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"").slice(0,25),`pl_${Date.now()}`),j=o=>String(o||"").replace(/[&<>"']/g,l=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[l]),U=o=>o?new Date(o).toLocaleDateString("es-PE",{day:"numeric",month:"short"}):"",p=o=>{try{localStorage.setItem(I,JSON.stringify(o))}catch{}},G=()=>{try{return JSON.parse(localStorage.getItem(I)||"[]")}catch{return[]}},r=o=>{const l=i(".pl_dot");l.length&&(l.removeClass("active error saving").addClass(o==="ok"?"active":o==="error"?"error":"saving"),i(".pl_dotxt").text(o==="ok"?"Online":o==="loading"?"Cargando...":o==="saving"?"Guardando...":"Offline"))},k=async(o=!1)=>{const l=_();if(!l.email)return r("error");const s=G();if(!o&&s.length){c=s,r("ok");return}r("loading");try{c=(await D(O(F(f,u),z("usuario","==",l.usuario)))).docs.map(t=>({id:t.id,_fsId:t.id,...t.data()})),p(c),r("ok")}catch(a){console.error("❌ planificar:",a),c=s,r("error")}},H=async o=>{const l=_(),s=i(`.pl_card[data-id="${o}"]`),a=c.find(e=>e._fsId===o);if(!a)return;const t=s.find(".pl_titulo").text().trim(),n=s.find(".pl_desc").text().trim();if(!(a.titulo===t&&a.descripcion===n)){a.titulo=t,a.descripcion=n,p(c),s.addClass("saving");try{const{_fsId:e,id:T,...y}=a;await C(v(f,u,e),{...y,usuario:l.usuario,email:l.email,actualizado:$()}),r("ok"),s.removeClass("saving").addClass("saved"),setTimeout(()=>s.removeClass("saved"),800)}catch(e){console.error("❌",e),s.removeClass("saving"),r("error"),m("Error al guardar","error")}}},P=async(o="planificacion")=>{const l=_(),s=J("tarea"),a={id:s,_fsId:s,titulo:"",descripcion:"",columna:o,prio:"media",tipo:"trabajo",color:b[o].color,creado:new Date().toISOString(),orden:0};c.unshift(a),p(c),d(),setTimeout(()=>{i(`.pl_card[data-id="${s}"]`).addClass("editing").find(".pl_titulo").focus()},50);try{const{_fsId:t,id:n,...e}=a;await C(v(f,u,s),{...e,usuario:l.usuario,email:l.email,actualizado:$()}),r("ok"),m("Nueva tarea ✨","success",1200)}catch(t){console.error("❌",t),c=c.filter(n=>n._fsId!==s),p(c),d(),m("Error al crear","error")}},Q=async o=>{if(!c.find(a=>a._fsId===o))return;const s=[...c];c=c.filter(a=>a._fsId!==o),p(c),i(`.pl_card[data-id="${o}"]`).addClass("deleting"),setTimeout(()=>d(),250);try{await A(v(f,u,o)),m("Eliminada 🗑️","success",1e3),S()}catch(a){console.error("❌",a),c=s,p(c),d(),m("Error al eliminar","error")}},R=async(o,l)=>{const s=c.find(n=>n._fsId===o);if(!s||s.columna===l)return;const a=s.columna;s.columna=l,s.color=b[l].color,l==="completado"&&a!=="completado"&&(s.completado=new Date().toISOString(),X()),p(c),d(),S();const t=_();try{const{_fsId:n,id:e,...T}=s;await C(v(f,u,n),{...T,usuario:t.usuario,email:t.email,actualizado:$()}),r("ok");const y={planificacion:"📋",analisis:"🔍",completado:"🎉"}[l];m(`${y} ${b[l].label}`,"success",1200)}catch(n){console.error("❌",n),s.columna=a,p(c),d(),r("error")}},W=async(o,l)=>{const s=c.find(t=>t._fsId===o);if(!s||s.color===l)return;s.color=l,p(c),d();const a=_();try{const{_fsId:t,id:n,...e}=s;await C(v(f,u,t),{...e,usuario:a.usuario,email:a.email,actualizado:$()}),r("ok")}catch(t){console.error("❌",t)}},K=async(o,l)=>{const s=c.find(t=>t._fsId===o);if(!s||s.prio===l)return;s.prio=l,p(c),d();const a=_();try{const{_fsId:t,id:n,...e}=s;await C(v(f,u,t),{...e,usuario:a.usuario,email:a.email,actualizado:$()}),r("ok")}catch(t){console.error("❌",t)}},V=async(o,l)=>{const s=c.find(t=>t._fsId===o);if(!s||s.tipo===l)return;s.tipo=l,p(c),d();const a=_();try{const{_fsId:t,id:n,...e}=s;await C(v(f,u,t),{...e,usuario:a.usuario,email:a.email,actualizado:$()}),r("ok")}catch(t){console.error("❌",t)}},X=()=>{const o=i('<div class="pl_confetti"></div>').appendTo("body"),l=["#90EE90","#87CEEB","#29C72E","#FF5C69","#FFB800"];for(let s=0;s<25;s++){const a=l[Math.floor(Math.random()*l.length)];i(`<span style="--c:${a};--x:${(Math.random()-.5)*200}px;--d:${Math.random()*.3}s"></span>`).appendTo(o)}setTimeout(()=>o.remove(),1500)},S=()=>{const o=c.filter(a=>a.columna==="planificacion").length,l=c.filter(a=>a.columna==="analisis").length,s=c.filter(a=>a.columna==="completado").length;i("#plPlan").text(o),i("#plAnal").text(l),i("#plComp").text(s),i("#plTotal").text(c.length),i('.pl_col[data-col="planificacion"] .pl_col_count').text(o),i('.pl_col[data-col="analisis"] .pl_col_count').text(l),i('.pl_col[data-col="completado"] .pl_col_count').text(s)},Y=o=>{const l=o.prio||"media",s=E[o.tipo]||E.trabajo;return`
  <div class="pl_card ${o.columna==="completado"?"done":""}" data-id="${o._fsId}" style="--card-color:${o.color||"#90EE90"}">
    <div class="pl_card_bar"></div>
    <div class="pl_card_body">
      <div class="pl_card_head">
        <div class="pl_prio ${l}" data-id="${o._fsId}" ${g("Prioridad")}>
          <span class="pl_prio_dot"></span>
        </div>
        <div class="pl_card_tools">
          <button class="pl_tipo_btn" data-id="${o._fsId}" ${g("Tipo")}>
            <i class="fas ${s.icon}"></i>
          </button>
          <button class="pl_color_btn" data-id="${o._fsId}" ${g("Color")}>
            <i class="fas fa-palette"></i>
          </button>
          <button class="pl_del" data-id="${o._fsId}" ${g("Eliminar")}>
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <div class="pl_titulo" contenteditable="true" data-placeholder="Título de la tarea" spellcheck="false">${j(o.titulo)}</div>
      <div class="pl_desc" contenteditable="true" data-placeholder="Descripción..." spellcheck="false">${j(o.descripcion).replace(/\n/g,"<br>")}</div>
      
      <div class="pl_card_foot">
        <span class="pl_tipo_badge" style="--tipo-color:${b[o.columna]?.color||"#90EE90"}">
          <i class="fas ${s.icon}"></i> ${s.label}
        </span>
        <span class="pl_creado"><i class="fas fa-clock"></i> ${U(o.creado)}</span>
        <span class="pl_saved"><i class="fas fa-check"></i></span>
      </div>
    </div>
    
    <!-- Dropdowns -->
    <div class="pl_dropdown pl_prios_dd" data-for="${o._fsId}">
      <div class="pl_dd_item ${l==="alta"?"active":""}" data-prio="alta">
        <span class="pl_prio_dot alta"></span> Alta
      </div>
      <div class="pl_dd_item ${l==="media"?"active":""}" data-prio="media">
        <span class="pl_prio_dot media"></span> Media
      </div>
      <div class="pl_dd_item ${l==="baja"?"active":""}" data-prio="baja">
        <span class="pl_prio_dot baja"></span> Baja
      </div>
    </div>
    
    <div class="pl_dropdown pl_tipos_dd" data-for="${o._fsId}">
      ${Object.entries(E).map(([t,n])=>`
        <div class="pl_dd_item ${o.tipo===t?"active":""}" data-tipo="${t}">
          <i class="fas ${n.icon}"></i> ${n.label}
        </div>
      `).join("")}
    </div>
    
    <div class="pl_dropdown pl_colores_dd" data-for="${o._fsId}">
      <div class="pl_colores_grid">
        ${q.map(t=>`<span class="pl_color_opt ${o.color===t?"active":""}" data-color="${t}" style="--cc:${t}"></span>`).join("")}
      </div>
    </div>
  </div>`},d=()=>{Object.keys(b).forEach(o=>{const l=c.filter(a=>a.columna===o),s=i(`.pl_col[data-col="${o}"] .pl_col_list`);l.length===0?s.html('<div class="pl_empty">Sin tareas</div>'):s.html(l.map(Y).join(""))}),Z(),S()},Z=()=>{w.forEach(o=>o.destroy()),w=[],document.querySelectorAll(".pl_col_list").forEach(o=>{const l=new x(o,{group:"planificar",animation:180,ghostClass:"pl_ghost",chosenClass:"pl_chosen",dragClass:"pl_drag",handle:".pl_card",onEnd:async s=>{const a=s.item.dataset.id,t=s.to.closest(".pl_col").dataset.col,n=c.find(e=>e._fsId===a);n&&n.columna!==t&&await R(a,t)}});w.push(l)})},ca=()=>{const o=_(),l=o.nombre||o.usuario||o.email||"";return`
  <div class="pl_container">
    <div class="pl_header">
      <div class="pl_info">
        <img src="/smile.avif" alt="${B}" class="pl_avatar" />
        <div class="pl_text">
          <h1><i class="fas fa-tasks"></i> Planificador</h1>
          <p>${M()} <strong>${l}</strong></p>
        </div>
      </div>
      <div class="pl_actions">
        <div class="pl_stats_mini">
          <span><i class="fas fa-clipboard-list" style="color:#90EE90"></i> <strong id="plPlan">0</strong></span>
          <span><i class="fas fa-search" style="color:#87CEEB"></i> <strong id="plAnal">0</strong></span>
          <span><i class="fas fa-check-circle" style="color:#29C72E"></i> <strong id="plComp">0</strong></span>
          <span class="pl_stats_sep"></span>
          <span><i class="fas fa-layer-group"></i> <strong id="plTotal">0</strong></span>
        </div>
        <div class="pl_status_wrap">
          <div class="pl_status">
            <span class="pl_dot"></span>
            <span class="pl_dotxt">Cargando...</span>
          </div>
          <button class="pl_btn_sync" id="plSync" ${g("Sincronizar")}>
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div class="pl_board">
      ${Object.entries(b).map(([s,a])=>`
      <div class="pl_col" data-col="${s}">
        <div class="pl_col_header" style="--col-color:${a.color}">
          <div class="pl_col_title">
            <i class="fas ${a.icon}"></i>
            <span>${a.label}</span>
            <span class="pl_col_count">0</span>
          </div>
          <button class="pl_col_add" data-col="${s}" ${g("Agregar tarea")}>
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="pl_col_list"></div>
      </div>
      `).join("")}
    </div>
    
    <div class="pl_confirm" id="plConfirm">
      <div class="pl_confirm_box">
        <i class="fas fa-trash-alt"></i>
        <h3>¿Eliminar tarea?</h3>
        <p>Esta acción no se puede deshacer</p>
        <div class="pl_confirm_btns">
          <button class="pl_cancel" id="plCancel">Cancelar</button>
          <button class="pl_delete" id="plDelete">Eliminar</button>
        </div>
      </div>
    </div>
  </div>`},na=async()=>{if(aa(),!_().email)return;await k(),d();const s=((a,t)=>{let n;return(...e)=>{clearTimeout(n),n=setTimeout(()=>a(...e),t)}})(a=>H(a),1e3);i(document).on("click.pl",".pl_col_add",function(){const a=i(this).data("col");P(a)}).on("click.pl","#plSync",async()=>{i("#plSync").addClass("spinning"),localStorage.removeItem(I),await k(!0),d(),i("#plSync").removeClass("spinning"),m("Sincronizado ✓","success",1500)}).on("click.pl",".pl_card",function(a){i(a.target).closest(".pl_card_tools, .pl_dropdown, .pl_prio").length||(i(".pl_card.editing").not(this).removeClass("editing"),i(this).addClass("editing"))}).on("input.pl",".pl_titulo, .pl_desc",function(){const a=i(this).closest(".pl_card").data("id");s(a)}).on("click.pl",".pl_prio",function(a){a.stopPropagation();const t=i(this).data("id");i(".pl_dropdown").removeClass("show"),i(`.pl_prios_dd[data-for="${t}"]`).toggleClass("show")}).on("click.pl",".pl_prios_dd .pl_dd_item",function(a){a.stopPropagation();const t=i(this).closest(".pl_dropdown").data("for"),n=i(this).data("prio");K(t,n),i(".pl_dropdown").removeClass("show")}).on("click.pl",".pl_tipo_btn",function(a){a.stopPropagation();const t=i(this).data("id");i(".pl_dropdown").removeClass("show"),i(`.pl_tipos_dd[data-for="${t}"]`).toggleClass("show")}).on("click.pl",".pl_tipos_dd .pl_dd_item",function(a){a.stopPropagation();const t=i(this).closest(".pl_dropdown").data("for"),n=i(this).data("tipo");V(t,n),i(".pl_dropdown").removeClass("show")}).on("click.pl",".pl_color_btn",function(a){a.stopPropagation();const t=i(this).data("id");i(".pl_dropdown").removeClass("show"),i(`.pl_colores_dd[data-for="${t}"]`).toggleClass("show")}).on("click.pl",".pl_color_opt",function(a){a.stopPropagation();const t=i(this).closest(".pl_dropdown").data("for"),n=i(this).data("color");W(t,n),i(".pl_dropdown").removeClass("show")}).on("click.pl",".pl_del",function(a){a.stopPropagation(),h=i(this).data("id"),i("#plConfirm").addClass("show")}).on("click.pl","#plCancel, #plConfirm",function(a){i(a.target).is("#plCancel, #plConfirm")&&(i("#plConfirm").removeClass("show"),h=null)}).on("click.pl","#plDelete",()=>{h&&(Q(h),i("#plConfirm").removeClass("show"),h=null)}).on("click.pl",a=>{i(a.target).closest(".pl_dropdown, .pl_prio, .pl_color_btn, .pl_tipo_btn").length||i(".pl_dropdown").removeClass("show")}).on("keydown.pl",a=>{i("#plConfirm").hasClass("show")||a.target.contentEditable==="true"||a.target.tagName==="INPUT"||(a.key==="n"||a.key==="N")&&(a.preventDefault(),P("planificacion"))}),N(()=>{k(!0).then(()=>d())}),console.log("✅ Planificar v7.0")},aa=()=>{w.forEach(o=>o.destroy()),w=[],i(document).off(".pl"),c=[],h=null};export{aa as cleanup,na as init,ca as render};
