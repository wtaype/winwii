import{j as a}from"./vendor-gzd0YkcT.js";import{db as A}from"./firebase-B3vp4rhK.js";import{g as ls,q as is,c as cs,w as ns,s as ds,d as U,a as rs,b as _s}from"./firebase-D7N42Z9V.js";import{d as E,i as S,N as w,f as D,g as Y,s as ms,h as J}from"./main-DUSF4zO2.js";import"./main-DIv9EtZD.js";const x="wii_mes_v1",O="meses",b={trabajo:{label:"Trabajo",icon:"fa-briefcase",color:"#0EBEFF"},personal:{label:"Personal",icon:"fa-user",color:"#FFB800"},estudio:{label:"Estudio",icon:"fa-book",color:"#7000FF"},salud:{label:"Salud",icon:"fa-heart-pulse",color:"#FF5C69"},finanzas:{label:"Finanzas",icon:"fa-coins",color:"#29C72E"},reunion:{label:"Reunión",icon:"fa-users",color:"#A855F7"},proyecto:{label:"Proyecto",icon:"fa-diagram-project",color:"#00C9B1"},otro:{label:"Otro",icon:"fa-circle",color:"#94A3B8"}},I={alta:{label:"Alta",color:"#FF5C69",icon:"fa-arrow-up"},media:{label:"Media",color:"#FFB800",icon:"fa-minus"},baja:{label:"Baja",color:"#29C72E",icon:"fa-arrow-down"}},B=["#0EBEFF","#FFB800","#7000FF","#FF5C69","#29C72E","#A855F7","#00C9B1","#94A3B8"],fs=["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],vs=["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"],d=()=>new Date().toISOString().split("T")[0],us=s=>`${(s||"mes").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"").slice(0,25)}_${Date.now()}`,ps=s=>s===d(),bs=s=>s<d(),gs=(s,e)=>new Date(s,e,1).getDay(),hs=(s,e)=>new Date(s,e+1,0).getDate(),$s=(s,e,o)=>`${s}-${String(e+1).padStart(2,"0")}-${String(o).padStart(2,"0")}`,T=s=>new Date(s+"T00:00:00").toLocaleDateString("es-PE",{day:"numeric",month:"short"}),P=()=>Y("wiSmile")||null,j=()=>!!P()?.usuario,p=()=>Y(x)||[],L=s=>ms(x,s,48),m=s=>{const e=a("#mes_sync");e.length&&(e[0].className=`mes_sync_dot mes_sync_${s}`)},V=async(s=!1)=>{if(!s&&p().length)return m("ok");if(!j())return m("error");m("loading");try{const e=await ls(is(cs(A,O),ns("usuario","==",P().usuario)));L(e.docs.map(o=>({...o.data(),_fsId:o.id,id:o.id}))),m("ok")}catch(e){console.error("❌ mes:",e),m("error")}},K=s=>{const e=p(),o=s._fsId||us(s.titulo),t={...s,_fsId:o,id:o},c=e.findIndex(r=>r._fsId===o);if(c>=0?e.splice(c,1,t):e.push(t),L(e),j()){m("saving");const r=P()||{},v={...t};delete v._fsId,ds(U(A,O,o),{...v,usuario:r.usuario||"",email:r.email||"",actualizado:_s()},{merge:!0}).then(()=>m("ok")).catch(y=>{console.error("❌ upsert:",y),m("error")})}return t},ys=s=>{const e=s._fsId||s.id;L(p().filter(o=>o._fsId!==e)),j()&&(m("saving"),rs(U(A,O,e)).then(()=>m("ok")).catch(o=>{console.error("❌ del:",o),m("error")}))};let f=new Date().getFullYear(),n=new Date().getMonth(),_=d(),u=null,Q=null;const W=s=>p().filter(e=>e.fecha===s),Es=()=>{const s=`${f}-${String(n+1).padStart(2,"0")}`;return p().filter(e=>e.fecha?.startsWith(s))},ws=s=>{const e=new Date(s+"T00:00:00"),o=r=>{const v=new Date(e);return v.setDate(v.getDate()+r),v.toISOString().split("T")[0]},t=new Date(e.getFullYear(),e.getMonth()+1,0).toISOString().split("T")[0];return[{label:s===d()?"Hoy":"Mismo día",fecha:s,icon:"fa-circle-dot",color:"#0EBEFF"},{label:"Mañana",fecha:o(1),icon:"fa-sun",color:"#FFB800"},{label:"Pasado",fecha:o(2),icon:"fa-forward",color:"#29C72E"},{label:"+1 semana",fecha:o(7),icon:"fa-calendar-week",color:"#7000FF"},{label:"Fin de mes",fecha:t,icon:"fa-flag-checkered",color:"#A855F7"}]},N=(s,e)=>{const o=ws(s);a("#mes_sugerencias").html(o.map(t=>`
      <button type="button" class="mes_sug_btn${t.fecha===e?" active":""}"
        data-fecha="${t.fecha}" style="--sc:${t.color}" ${E(T(t.fecha))}>
        <i class="fas ${t.icon}"></i><span>${t.label}</span>
      </button>`).join(""))},Os=()=>`
<div class="mes_wrap">

  <!-- TOOLBAR -->
  <div class="mes_toolbar">
    <div class="mes_tb_left">
      <div class="mes_logo"><i class="fas fa-calendar-days"></i><span>Mes</span></div>
      <div class="mes_nav">
        <button class="mes_nav_btn" id="mes_prev" ${E("Mes anterior")}><i class="fas fa-chevron-left"></i></button>
        <button class="mes_nav_hoy" id="mes_hoy"><i class="fas fa-crosshairs"></i> Hoy</button>
        <button class="mes_nav_btn" id="mes_next" ${E("Mes siguiente")}><i class="fas fa-chevron-right"></i></button>
      </div>
      <div class="mes_titulo_mes" id="mes_titulo_mes">—</div>
    </div>
    <div class="mes_tb_right">
      <div class="mes_resumen" id="mes_resumen">
        <div class="mes_res_item"><i class="fas fa-layer-group" style="color:var(--mco)"></i><strong id="mes_n_total">0</strong><span>Eventos</span></div>
        <div class="mes_res_sep"></div>
        <div class="mes_res_item"><i class="fas fa-circle-check" style="color:#29C72E"></i><strong id="mes_n_done">0</strong><span>Hechos</span></div>
        <div class="mes_res_sep"></div>
        <div class="mes_res_item"><i class="fas fa-fire" style="color:#FF5C69"></i><strong id="mes_n_alta">0</strong><span>Urgentes</span></div>
      </div>
    </div>
  </div>

  <!-- ACTION BAR -->
  <div class="mes_actionbar">
    <div class="mes_ab_left">
      <span class="mes_sync_dot mes_sync_loading" id="mes_sync"></span>
      <button class="mes_ab_btn" id="mes_refresh" ${E("Actualizar")}><i class="fas fa-rotate-right"></i></button>
      <button class="mes_ab_btn mes_ab_nuevo" id="mes_nuevo"><i class="fas fa-plus"></i> Nuevo evento</button>
    </div>
    <div class="mes_ab_right">
      <div class="mes_prog_wrap">
        <span class="mes_prog_label" id="mes_prog_label">0 / 0</span>
        <div class="mes_prog_track"><div class="mes_prog_fill" id="mes_prog_fill" style="width:0%"></div></div>
        <span class="mes_prog_pct" id="mes_prog_pct">0%</span>
      </div>
    </div>
  </div>

  <!-- CUERPO -->
  <div class="mes_body">

    <!-- CALENDARIO -->
    <div class="mes_cal_panel">
      <div class="mes_dias_semana">
        ${vs.map((s,e)=>`<div class="mes_dia_lbl${e===0||e===6?" mes_dia_lbl_fin":""}">${s}</div>`).join("")}
      </div>
      <div class="mes_grid" id="mes_grid"></div>
    </div>

    <!-- PANEL DETALLE -->
    <div class="mes_detail_panel" id="mes_detail_panel">
      <div class="mes_detail_head" id="mes_detail_head">
        <div class="mes_detail_fecha_ico"><i class="fas fa-calendar-day"></i></div>
        <div>
          <div class="mes_detail_titulo" id="mes_detail_titulo">Selecciona un día</div>
          <div class="mes_detail_sub" id="mes_detail_sub">Haz clic en cualquier día</div>
        </div>
        <button class="mes_detail_add" id="mes_detail_add" ${E("Agregar evento")}><i class="fas fa-plus"></i></button>
      </div>
      <div class="mes_detail_body" id="mes_detail_body">
        <div class="mes_detail_empty"><i class="fas fa-calendar-xmark"></i><span>Sin eventos este día</span></div>
      </div>
    </div>

  </div>
</div>

<!-- MODAL EVENTO -->
<div class="wiModal" id="modal_mes">
  <div class="modalBody mes_modal">
    <button class="modalX"><i class="fas fa-times"></i></button>
    <div class="mes_modal_hero" id="mes_m_hero">
      <div class="mes_modal_ico" id="mes_m_ico"><i class="fas fa-calendar-plus"></i></div>
      <div>
        <h2 class="mes_modal_tit" id="mes_m_tit">Nuevo Evento</h2>
        <p class="mes_modal_sub" id="mes_m_sub">Agrega a tu mes</p>
      </div>
    </div>
    <div class="mes_modal_body">

      <div class="mes_field">
        <label class="mes_label"><i class="fas fa-heading"></i> Título <span class="mes_req">*</span></label>
        <div class="mes_input_ico"><i class="fas fa-pen"></i>
          <input type="text" class="mes_input" id="m_titulo" placeholder="Ej: Reunión de equipo" maxlength="80"/>
        </div>
      </div>

      <div class="mes_field">
        <label class="mes_label"><i class="fas fa-align-left"></i> Nota</label>
        <textarea class="mes_textarea" id="m_nota" placeholder="Detalles opcionales…" maxlength="300" rows="2"></textarea>
      </div>

      <!-- Fecha + Sugerencias dinámicas -->
      <div class="mes_field">
        <label class="mes_label"><i class="fas fa-calendar"></i> Fecha <span class="mes_req">*</span></label>
        <div class="mes_fecha_wrap">
          <input type="date" class="mes_input mes_input_plain" id="m_fecha"/>
          <div class="mes_sugerencias" id="mes_sugerencias"></div>
        </div>
      </div>

      <div class="mes_field_row mes_field_row3">
        <div class="mes_field">
          <label class="mes_label"><i class="fas fa-clock"></i> Hora</label>
          <input type="time" class="mes_input mes_input_plain" id="m_hora"/>
        </div>
        <div class="mes_field">
          <label class="mes_label"><i class="fas fa-tag"></i> Categoría</label>
          <select class="mes_select" id="m_cat">
            ${Object.entries(b).map(([s,e])=>`<option value="${s}">${e.label}</option>`).join("")}
          </select>
        </div>
        <div class="mes_field">
          <label class="mes_label"><i class="fas fa-flag"></i> Prioridad</label>
          <select class="mes_select" id="m_prio">
            ${Object.entries(I).map(([s,e])=>`<option value="${s}">${e.label}</option>`).join("")}
          </select>
        </div>
      </div>

      <div class="mes_field">
        <label class="mes_label"><i class="fas fa-palette"></i> Color</label>
        <div class="mes_colores" id="m_colores">
          ${B.map(s=>`<button type="button" class="mes_color_opt" data-color="${s}" style="--c:${s}"></button>`).join("")}
        </div>
      </div>

      <div class="mes_modal_footer">
        <button type="button" class="mes_btn_del dpn" id="m_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
        <div class="mes_modal_footer_r">
          <button type="button" class="mes_btn_cancel" id="m_cancelar">Cancelar</button>
          <button type="button" class="mes_btn_save" id="m_guardar"><i class="fas fa-floppy-disk"></i> Guardar</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- MODAL CONFIRMAR -->
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
</div>`,$=()=>{const s=a("#mes_grid").empty(),e=gs(f,n),o=hs(f,n),t=Es(),c=d();a("#mes_titulo_mes").text(`${fs[n]} ${f}`);const r=t.filter(i=>i.done).length,v=t.filter(i=>i.prioridad==="alta").length,y=t.length?Math.round(r/t.length*100):0;a("#mes_n_total").text(t.length),a("#mes_n_done").text(r),a("#mes_n_alta").text(v),a("#mes_prog_label").text(`${r} / ${t.length}`),a("#mes_prog_fill").css("width",`${y}%`),a("#mes_prog_pct").text(`${y}%`);for(let i=0;i<e;i++)s.append('<div class="mes_cell mes_cell_vacio"></div>');for(let i=1;i<=o;i++){const h=$s(f,n,i),F=W(h),z=h===c,ss=h<c,es=h===_,H=new Date(h+"T00:00:00").getDay(),as=H===0||H===6,os=F.slice(0,3).map(C=>`<span class="mes_dot" style="background:${C.color||(b[C.categoria]||b.otro).color}" title="${C.titulo}"></span>`).join(""),ts=F.length>3?`<span class="mes_dot_mas">+${F.length-3}</span>`:"";s.append(`
    <div class="mes_cell${z?" mes_cell_hoy":""}${ss?" mes_cell_past":""}${es?" mes_cell_sel":""}${as?" mes_cell_fin":""}" data-fecha="${h}">
      <div class="mes_cell_num${z?" mes_cell_num_hoy":""}">${i}</div>
      ${F.length?`<div class="mes_cell_dots">${os}${ts}</div>`:""}
    </div>`)}const l=e+o,g=l%7===0?0:7-l%7;for(let i=0;i<g;i++)s.append('<div class="mes_cell mes_cell_vacio"></div>');_&&R(_)},R=s=>{_=s;const e=W(s).sort((l,g)=>(l.hora||"99:99").localeCompare(g.hora||"99:99")),o=ps(s),t=bs(s),c=new Date(s+"T00:00:00"),r=c.toLocaleDateString("es-PE",{weekday:"long"}),v=c.toLocaleDateString("es-PE",{day:"numeric",month:"long",year:"numeric"});a("#mes_detail_titulo").text(`${r.charAt(0).toUpperCase()+r.slice(1)}${o?" · Hoy":""}`),a("#mes_detail_sub").text(v),a("#mes_detail_head").css("--dh_color",o?"var(--mco)":t?"#94A3B8":"var(--brd)"),a("#mes_detail_add").attr("data-fecha",s);const y=a("#mes_detail_body").empty();if(!e.length){y.html(`<div class="mes_detail_empty"><i class="fas fa-calendar-xmark"></i><span>${t?"Sin eventos registrados":"Día libre — agrega un evento"}</span></div>`);return}e.forEach(l=>{const g=b[l.categoria]||b.otro,i=I[l.prioridad]||I.media,h=l.color||g.color;y.append(`
    <div class="mes_ev_item${l.done?" mes_ev_done":""}" data-id="${l._fsId}" style="--ev_c:${h}">
      <div class="mes_ev_left">
        <button class="mes_ev_check${l.done?" mes_ev_checked":""}" data-id="${l._fsId}">
          <i class="fas ${l.done?"fa-circle-check":"fa-circle-dot"}"></i>
        </button>
      </div>
      <div class="mes_ev_body">
        <div class="mes_ev_titulo">${l.titulo}</div>
        <div class="mes_ev_meta">
          ${l.hora?`<span class="mes_ev_hora"><i class="fas fa-clock"></i>${l.hora}</span>`:""}
          <span class="mes_ev_cat" style="--cc:${g.color}"><i class="fas ${g.icon}"></i>${g.label}</span>
          <span class="mes_ev_prio" style="--pc:${i.color}"><i class="fas ${i.icon}"></i></span>
        </div>
        ${l.nota?`<p class="mes_ev_nota">${l.nota}</p>`:""}
      </div>
      <div class="mes_ev_actions">
        <button class="mes_ev_edit" data-id="${l._fsId}" ${E("Editar")}><i class="fas fa-pen"></i></button>
        <button class="mes_ev_del"  data-id="${l._fsId}" ${E("Eliminar")}><i class="fas fa-times"></i></button>
      </div>
    </div>`)})},X=s=>{a("#m_colores .mes_color_opt").removeClass("active"),a(`#m_colores .mes_color_opt[data-color="${s}"]`).addClass("active")},Z=()=>a("#m_colores .mes_color_opt.active").data("color")||B[0],M=(s,e)=>{a("#mes_m_hero").css("background",`linear-gradient(135deg,${s}dd,${s}88)`),a("#mes_m_ico").css("background",s).html(`<i class="fas ${e}"></i>`)},Ds=()=>{const s=_||d(),e=a("#m_fecha").val()||s;N(s,e)},k=(s={},e=null)=>{u=s._fsId?s:null;const o=s.fecha||e||_||d(),t=s.categoria||"trabajo",c=s.color||b[t]?.color||B[0];a("#m_titulo").val(s.titulo||""),a("#m_nota").val(s.nota||""),a("#m_fecha").val(o),a("#m_hora").val(s.hora||""),a("#m_cat").val(t),a("#m_prio").val(s.prioridad||"media"),X(c),M(c,b[t]?.icon||"fa-calendar-plus"),a("#mes_m_tit").text(u?"Editar Evento":"Nuevo Evento"),a("#mes_m_sub").text(u?"Modifica los datos":`Para: ${T(o)}`),a("#m_eliminar").toggleClass("dpn",!u),N(o,o),J("modal_mes"),setTimeout(()=>a("#m_titulo").focus(),30)},q=()=>{const s=a("#m_titulo").val().trim();if(!s)return w("Título requerido","warning");const e=a("#m_fecha").val();if(!e)return w("Fecha requerida","warning");S("#m_guardar",!0,"Guardar");const o=a("#m_cat").val();K({...u||{},titulo:s,nota:a("#m_nota").val().trim(),fecha:e,hora:a("#m_hora").val()||"",categoria:o,prioridad:a("#m_prio").val(),color:Z(),done:u?.done||!1,creado:u?.creado||new Date().toISOString()}),D("modal_mes");const[t,c]=e.split("-").map(Number);(t!==f||c-1!==n)&&(f=t,n=c-1),_=e,$(),setTimeout(()=>a(`.mes_cell[data-fecha="${e}"]`).addClass("mes_cell_sel"),30),S("#m_guardar",!1,"Guardar"),w(u?"Evento actualizado ✓":"Evento creado ✓","success")},Fs=s=>{const e=p().find(o=>o._fsId===s);e&&(K({...e,done:!e.done}),$(),e.done||w("✅ ¡Evento completado!","success"))},G=s=>{a("#mes_confirm_nombre").text(s.titulo||"Sin título"),Q=()=>{ys(s),D("modal_mes_confirm"),$(),w("Evento eliminado ✓","success")},J("modal_mes_confirm")},ks=()=>{a(document).off(".mes"),a(document).on("click.mes","#mes_prev",()=>{n===0?(n=11,f--):n--,$()}).on("click.mes","#mes_next",()=>{n===11?(n=0,f++):n++,$()}).on("click.mes","#mes_hoy",()=>{f=new Date().getFullYear(),n=new Date().getMonth(),_=d(),$()}).on("click.mes","#mes_refresh",async()=>{S("#mes_refresh",!0,""),localStorage.removeItem(x),await V(!0),$(),S("#mes_refresh",!1,""),w("Mes actualizado ✓","success")}).on("click.mes",".mes_cell:not(.mes_cell_vacio)",function(){a(".mes_cell").removeClass("mes_cell_sel"),a(this).addClass("mes_cell_sel"),R(a(this).data("fecha"))}).on("click.mes","#mes_nuevo",()=>k({},_||d())).on("click.mes","#mes_detail_add",function(){k({},a(this).data("fecha")||_||d())}).on("click.mes",".mes_ev_check",function(e){e.stopPropagation(),Fs(a(this).data("id"))}).on("click.mes",".mes_ev_item",function(e){if(a(e.target).closest(".mes_ev_check,.mes_ev_edit,.mes_ev_del").length)return;const o=p().find(t=>t._fsId===a(this).data("id"));o&&k(o)}).on("click.mes",".mes_ev_edit",function(e){e.stopPropagation();const o=p().find(t=>t._fsId===a(this).data("id"));o&&k(o)}).on("click.mes",".mes_ev_del",function(e){e.stopPropagation();const o=p().find(t=>t._fsId===a(this).data("id"));o&&G(o)}).on("click.mes",".mes_sug_btn",function(){const e=a(this).data("fecha");a("#m_fecha").val(e);const o=_||d();N(o,e),a("#mes_m_sub").text(`Para: ${T(e)}`)}).on("change.mes","#m_fecha",Ds).on("change.mes","#m_cat",function(){M(Z(),b[a(this).val()]?.icon||"fa-calendar-plus")}).on("click.mes","#m_colores .mes_color_opt",function(){X(a(this).data("color")),M(a(this).data("color"),b[a("#m_cat").val()]?.icon||"fa-calendar-plus")}).on("click.mes","#m_cancelar",()=>D("modal_mes")).on("click.mes","#m_guardar",q).on("keydown.mes","#m_titulo",e=>{e.key==="Enter"&&q()}).on("click.mes","#m_eliminar",()=>{u&&(D("modal_mes"),G(u))}).on("click.mes","#mes_conf_no",()=>D("modal_mes_confirm")).on("click.mes","#mes_conf_si",()=>Q?.())},Bs=async()=>{f=new Date().getFullYear(),n=new Date().getMonth(),await V(),$(),_=d(),R(d()),setTimeout(()=>a(`.mes_cell[data-fecha="${d()}"]`).addClass("mes_cell_sel"),50),ks(),console.log("📆 Mes v1.0 OK")},Ts=()=>{a(document).off(".mes"),console.log("🧹 Mes limpiado")};export{Ts as cleanup,Bs as init,Os as render};
