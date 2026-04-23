import{j as c}from"./vendor-gzd0YkcT.js";import{S as T}from"./sortable.esm-BzJVkfZx.js";import{db as p}from"./firebase-Lfd52dYI.js";import{g as B,q as D,c as j,w as O,s as C,f as v,h as $,i as P}from"./firebase-Cdwg_wrl.js";import{h as u,i as A,a as z,S as N,c as h,g as M}from"./main-CuczXLwU.js";const k="wii_scrum_v1",f="scrum",w={planificacion:{label:"Planificación",icon:"fa-clipboard-list",color:"#FFB800"},analisis:{label:"Análisis",icon:"fa-search",color:"#0EBEFF"},completado:{label:"Completado",icon:"fa-check-circle",color:"#29C72E"}},L=["#29C72E","#0EBEFF","#7000FF","#FF5C69","#FFB800","#94A3B8","#00C9B1","#EC4899"];let n=[],g=[],m=null;const b=()=>M("wiSmile")||{},q=a=>`${a.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"").slice(0,25)}_${Date.now()}`,I=a=>String(a||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[t]),J=a=>a?new Date(a).toLocaleDateString("es-PE",{day:"numeric",month:"short"}):"",_=a=>{try{localStorage.setItem(k,JSON.stringify(a))}catch{}},U=()=>{try{return JSON.parse(localStorage.getItem(k)||"[]")}catch{return[]}},l=a=>{const t=c(".sb_dot");t.length&&(t.removeClass("active error saving").addClass(a==="ok"?"active":a==="error"?"error":"saving"),c(".sb_dotxt").text(a==="ok"?"Online":a==="loading"?"Cargando...":a==="saving"?"Guardando...":"Offline"))},E=async(a=!1)=>{const t=b();if(!t.email)return l("error");const o=U();if(!a&&o.length){n=o,l("ok");return}l("loading");try{n=(await B(D(j(p,f),O("usuario","==",t.usuario)))).docs.map(i=>({id:i.id,_fsId:i.id,...i.data()})),_(n),l("ok")}catch(s){console.error("❌ scrum:",s),n=o,l("error")}},G=async a=>{const t=b(),o=c(`.sb_card[data-id="${a}"]`),s=n.find(r=>r._fsId===a);if(!s)return;const i=o.find(".sb_titulo").text().trim(),e=o.find(".sb_desc").text().trim();if(!(s.titulo===i&&s.descripcion===e)){s.titulo=i,s.descripcion=e,_(n),o.addClass("saving");try{const{_fsId:r,id:F,...y}=s;await C(v(p,f,r),{...y,usuario:t.usuario,email:t.email,actualizado:$()}),l("ok"),o.removeClass("saving").addClass("saved"),setTimeout(()=>o.removeClass("saved"),800)}catch(r){console.error("❌",r),o.removeClass("saving"),l("error"),u("Error al guardar","error")}}},x=async(a="planificacion")=>{const t=b(),o=q("tarea"),s={id:o,_fsId:o,titulo:"",descripcion:"",columna:a,prio:"media",color:w[a].color,creado:new Date().toISOString(),orden:0};n.unshift(s),_(n),d(),setTimeout(()=>{c(`.sb_card[data-id="${o}"]`).addClass("editing").find(".sb_titulo").focus()},50);try{const{_fsId:i,id:e,...r}=s;await C(v(p,f,o),{...r,usuario:t.usuario,email:t.email,actualizado:$()}),l("ok"),u("Nueva tarea ✨","success",1200)}catch(i){console.error("❌",i),n=n.filter(e=>e._fsId!==o),_(n),d(),u("Error al crear","error")}},H=async a=>{if(!n.find(s=>s._fsId===a))return;const o=[...n];n=n.filter(s=>s._fsId!==a),_(n),c(`.sb_card[data-id="${a}"]`).addClass("deleting"),setTimeout(()=>d(),250);try{await P(v(p,f,a)),u("Eliminada 🗑️","success",1e3),S()}catch(s){console.error("❌",s),n=o,_(n),d(),u("Error al eliminar","error")}},Q=async(a,t)=>{const o=n.find(e=>e._fsId===a);if(!o||o.columna===t)return;const s=o.columna;o.columna=t,t==="completado"&&s!=="completado"&&(o.completado=new Date().toISOString(),V()),_(n),S();const i=b();try{const{_fsId:e,id:r,...F}=o;await C(v(p,f,e),{...F,usuario:i.usuario,email:i.email,actualizado:$()}),l("ok");const y={planificacion:"📋",analisis:"🔍",completado:"🎉"}[t];u(`${y} ${w[t].label}`,"success",1200)}catch(e){console.error("❌",e),o.columna=s,_(n),d(),l("error")}},R=async(a,t)=>{const o=n.find(i=>i._fsId===a);if(!o||o.color===t)return;o.color=t,_(n),d();const s=b();try{const{_fsId:i,id:e,...r}=o;await C(v(p,f,i),{...r,usuario:s.usuario,email:s.email,actualizado:$()}),l("ok")}catch(i){console.error("❌",i)}},K=async(a,t)=>{const o=n.find(i=>i._fsId===a);if(!o||o.prio===t)return;o.prio=t,_(n),d();const s=b();try{const{_fsId:i,id:e,...r}=o;await C(v(p,f,i),{...r,usuario:s.usuario,email:s.email,actualizado:$()}),l("ok")}catch(i){console.error("❌",i)}},V=()=>{const a=c('<div class="sb_confetti"></div>').appendTo("body"),t=["#29C72E","#0EBEFF","#7000FF","#FF5C69","#FFB800"];for(let o=0;o<25;o++){const s=t[Math.floor(Math.random()*t.length)];c(`<span style="--c:${s};--x:${(Math.random()-.5)*200}px;--d:${Math.random()*.3}s"></span>`).appendTo(a)}setTimeout(()=>a.remove(),1500)},S=()=>{const a=n.filter(s=>s.columna==="planificacion").length,t=n.filter(s=>s.columna==="analisis").length,o=n.filter(s=>s.columna==="completado").length;c("#sbPlan").text(a),c("#sbAnal").text(t),c("#sbComp").text(o),c("#sbTotal").text(n.length),c('.sb_col[data-col="planificacion"] .sb_col_count').text(a),c('.sb_col[data-col="analisis"] .sb_col_count').text(t),c('.sb_col[data-col="completado"] .sb_col_count').text(o)},W=a=>{const t=a.prio||"media";return`
  <div class="sb_card ${a.columna==="completado"?"done":""}" data-id="${a._fsId}" style="--card-color:${a.color||"#0EBEFF"}">
    <div class="sb_card_bar"></div>
    <div class="sb_card_body">
      <div class="sb_card_head">
        <div class="sb_prio ${t}" data-id="${a._fsId}" ${h("Prioridad")}>
          <span class="sb_prio_dot"></span>
        </div>
        <div class="sb_card_tools">
          <button class="sb_color_btn" data-id="${a._fsId}" ${h("Color")}>
            <i class="fas fa-palette"></i>
          </button>
          <button class="sb_del" data-id="${a._fsId}" ${h("Eliminar")}>
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <div class="sb_titulo" contenteditable="true" data-placeholder="Título de la tarea" spellcheck="false">${I(a.titulo)}</div>
      <div class="sb_desc" contenteditable="true" data-placeholder="Descripción..." spellcheck="false">${I(a.descripcion).replace(/\n/g,"<br>")}</div>
      
      <div class="sb_card_foot">
        <span class="sb_creado"><i class="fas fa-clock"></i> ${J(a.creado)}</span>
        <span class="sb_saved"><i class="fas fa-check"></i></span>
      </div>
    </div>
    
    <!-- Dropdowns -->
    <div class="sb_dropdown sb_prios_dd" data-for="${a._fsId}">
      <div class="sb_dd_item ${t==="alta"?"active":""}" data-prio="alta">
        <span class="sb_prio_dot alta"></span> Alta
      </div>
      <div class="sb_dd_item ${t==="media"?"active":""}" data-prio="media">
        <span class="sb_prio_dot media"></span> Media
      </div>
      <div class="sb_dd_item ${t==="baja"?"active":""}" data-prio="baja">
        <span class="sb_prio_dot baja"></span> Baja
      </div>
    </div>
    
    <div class="sb_dropdown sb_colores_dd" data-for="${a._fsId}">
      <div class="sb_colores_grid">
        ${L.map(s=>`<span class="sb_color_opt ${a.color===s?"active":""}" data-color="${s}" style="--cc:${s}"></span>`).join("")}
      </div>
    </div>
  </div>`},d=()=>{Object.keys(w).forEach(a=>{const t=n.filter(s=>s.columna===a),o=c(`.sb_col[data-col="${a}"] .sb_col_list`);t.length===0?o.html('<div class="sb_empty">Sin tareas</div>'):o.html(t.map(W).join(""))}),X(),S()},X=()=>{g.forEach(a=>a.destroy()),g=[],document.querySelectorAll(".sb_col_list").forEach(a=>{const t=new T(a,{group:"scrum",animation:180,ghostClass:"sb_ghost",chosenClass:"sb_chosen",dragClass:"sb_drag",handle:".sb_card",onEnd:async o=>{const s=o.item.dataset.id,i=o.to.closest(".sb_col").dataset.col,e=n.find(r=>r._fsId===s);e&&e.columna!==i&&await Q(s,i)}});g.push(t)})},cs=()=>{const a=b(),t=a.nombre||a.usuario||a.email||"";return`
  <div class="sb_container">
    <div class="sb_header">
      <div class="sb_info">
        <img src="/smile.avif" alt="${z}" class="sb_avatar" />
        <div class="sb_text">
          <h1><i class="fas fa-columns"></i> Scrum Board</h1>
          <p>${N()} <strong>${t}</strong></p>
        </div>
      </div>
      <div class="sb_actions">
        <div class="sb_stats_mini">
          <span><i class="fas fa-clipboard-list" style="color:#FFB800"></i> <strong id="sbPlan">0</strong></span>
          <span><i class="fas fa-search" style="color:#0EBEFF"></i> <strong id="sbAnal">0</strong></span>
          <span><i class="fas fa-check-circle" style="color:#29C72E"></i> <strong id="sbComp">0</strong></span>
          <span class="sb_stats_sep"></span>
          <span><i class="fas fa-layer-group"></i> <strong id="sbTotal">0</strong></span>
        </div>
        <div class="sb_status_wrap">
          <div class="sb_status">
            <span class="sb_dot"></span>
            <span class="sb_dotxt">Cargando...</span>
          </div>
          <button class="sb_btn_sync" id="sbSync" ${h("Sincronizar")}>
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div class="sb_board">
      ${Object.entries(w).map(([o,s])=>`
      <div class="sb_col" data-col="${o}">
        <div class="sb_col_header" style="--col-color:${s.color}">
          <div class="sb_col_title">
            <i class="fas ${s.icon}"></i>
            <span>${s.label}</span>
            <span class="sb_col_count">0</span>
          </div>
          <button class="sb_col_add" data-col="${o}" ${h("Agregar tarea")}>
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="sb_col_list"></div>
      </div>
      `).join("")}
    </div>
    
    <div class="sb_confirm" id="sbConfirm">
      <div class="sb_confirm_box">
        <i class="fas fa-trash-alt"></i>
        <h3>¿Eliminar tarea?</h3>
        <p>Esta acción no se puede deshacer</p>
        <div class="sb_confirm_btns">
          <button class="sb_cancel" id="sbCancel">Cancelar</button>
          <button class="sb_delete" id="sbDelete">Eliminar</button>
        </div>
      </div>
    </div>
  </div>`},is=async()=>{if(Y(),!b().email)return;await E(),d();const o=((s,i)=>{let e;return(...r)=>{clearTimeout(e),e=setTimeout(()=>s(...r),i)}})(s=>G(s),1e3);c(document).on("click.sb",".sb_col_add",function(){const s=c(this).data("col");x(s)}).on("click.sb","#sbSync",async()=>{c("#sbSync").addClass("spinning"),localStorage.removeItem(k),await E(!0),d(),c("#sbSync").removeClass("spinning"),u("Sincronizado ✓","success",1500)}).on("click.sb",".sb_card",function(s){c(s.target).closest(".sb_card_tools, .sb_dropdown, .sb_prio").length||(c(".sb_card.editing").not(this).removeClass("editing"),c(this).addClass("editing"))}).on("input.sb",".sb_titulo, .sb_desc",function(){const s=c(this).closest(".sb_card").data("id");o(s)}).on("click.sb",".sb_prio",function(s){s.stopPropagation();const i=c(this).data("id");c(".sb_dropdown").removeClass("show"),c(`.sb_prios_dd[data-for="${i}"]`).toggleClass("show")}).on("click.sb",".sb_prios_dd .sb_dd_item",function(s){s.stopPropagation();const i=c(this).closest(".sb_dropdown").data("for"),e=c(this).data("prio");K(i,e),c(".sb_dropdown").removeClass("show")}).on("click.sb",".sb_color_btn",function(s){s.stopPropagation();const i=c(this).data("id");c(".sb_dropdown").removeClass("show"),c(`.sb_colores_dd[data-for="${i}"]`).toggleClass("show")}).on("click.sb",".sb_color_opt",function(s){s.stopPropagation();const i=c(this).closest(".sb_dropdown").data("for"),e=c(this).data("color");R(i,e),c(".sb_dropdown").removeClass("show")}).on("click.sb",".sb_del",function(s){s.stopPropagation(),m=c(this).data("id"),c("#sbConfirm").addClass("show")}).on("click.sb","#sbCancel, #sbConfirm",function(s){c(s.target).is("#sbCancel, #sbConfirm")&&(c("#sbConfirm").removeClass("show"),m=null)}).on("click.sb","#sbDelete",()=>{m&&(H(m),c("#sbConfirm").removeClass("show"),m=null)}).on("click.sb",s=>{c(s.target).closest(".sb_dropdown, .sb_prio, .sb_color_btn").length||c(".sb_dropdown").removeClass("show")}).on("keydown.sb",s=>{c("#sbConfirm").hasClass("show")||s.target.contentEditable==="true"||s.target.tagName==="INPUT"||(s.key==="n"||s.key==="N")&&(s.preventDefault(),x("planificacion"))}),A(()=>{E(!0).then(()=>d())}),console.log("✅ Scrum Board v1.0")},Y=()=>{g.forEach(a=>a.destroy()),g=[],c(document).off(".sb"),n=[],m=null};export{Y as cleanup,is as init,cs as render};
