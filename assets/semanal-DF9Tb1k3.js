import{j as e}from"./vendor-gzd0YkcT.js";import{db as O}from"./firebase-BLXcngd4.js";import{g as is,q as ts,c as ls,w as cs,s as ns,d as G,a as ds,b as _s}from"./firebase-D7N42Z9V.js";import{e as rs,d as b,i as A,N as $,f as h,g as V,s as ms,h as J}from"./main-CRbatqCo.js";import"./main-DuRepGKg.js";const x="wii_semanal_v1",B="semanal",Q=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"],j=["lun","mar","mie","jue","vie","sab","dom"],f={trabajo:{label:"Trabajo",icon:"fa-briefcase",color:"#0EBEFF"},estudio:{label:"Estudio",icon:"fa-book",color:"#7000FF"},personal:{label:"Personal",icon:"fa-user",color:"#FFB800"},salud:{label:"Salud",icon:"fa-heart-pulse",color:"#FF5C69"},proyecto:{label:"Proyecto",icon:"fa-diagram-project",color:"#A855F7"},reunion:{label:"Reunión",icon:"fa-users",color:"#29C72E"},otro:{label:"Otro",icon:"fa-circle",color:"#94A3B8"}},E={alta:{label:"Alta",color:"#FF5C69",icon:"fa-arrow-up"},media:{label:"Media",color:"#FFB800",icon:"fa-minus"},baja:{label:"Baja",color:"#29C72E",icon:"fa-arrow-down"}},T=["#0EBEFF","#7000FF","#FFB800","#FF5C69","#29C72E","#A855F7","#00C9B1","#94A3B8"],U=()=>new Date().toISOString().split("T")[0],M=(s=new Date)=>{const a=new Date(s),o=a.getDay()||7;return a.setDate(a.getDate()-o+1),a.toISOString().split("T")[0]},I=(s,a)=>{const o=new Date(s+"T12:00:00");return o.setDate(o.getDate()+a),o.toISOString().split("T")[0]},C=s=>new Date(s+"T00:00:00").toLocaleDateString("es-PE",{day:"numeric",month:"short"}),fs=s=>`${(s||"sem").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"").slice(0,25)}_${Date.now()}`,vs=s=>s===U(),us=s=>s<U(),z=s=>{const a=s.length,o=s.filter(t=>t.done).length;return a?Math.round(o/a*100):0},P=()=>V("wiSmile")||null,L=()=>!!P()?.usuario,r=()=>V(x)||[],N=s=>ms(x,s,48),c=s=>{const a=e("#sem_sync");a.length&&(a[0].className=`sem_sync_dot sem_sync_${s}`)},S=async(s=!1)=>{if(!s&&r().length)return c("ok");if(!L())return c("error");c("loading");try{const a=await is(ts(ls(O,B),cs("usuario","==",P().usuario)));N(a.docs.map(o=>({...o.data(),_fsId:o.id,id:o.id}))),c("ok")}catch(a){console.error("❌ semanal:",a),c("error")}},X=s=>{const a=r(),o=s._fsId||fs(s.titulo),t={...s,_fsId:o,id:o},v=a.findIndex(u=>u._fsId===o);if(v>=0?a.splice(v,1,t):a.push(t),N(a),L()){c("saving");const u=P()||{},l={...t};delete l._fsId,ns(G(O,B,o),{...l,usuario:u.usuario||"",email:u.email||"",actualizado:_s()},{merge:!0}).then(()=>c("ok")).catch(y=>{console.error("❌ upsert:",y),c("error")})}return t},ps=s=>{const a=s._fsId||s.id;N(r().filter(o=>o._fsId!==a)),L()&&(c("saving"),ds(G(O,B,a)).then(()=>c("ok")).catch(o=>{console.error("❌ del:",o),c("error")}))};let n=M(),d=null,Y=null;const W=()=>r().filter(s=>s.semana===n),bs=s=>W().filter(a=>a.dia===s),Is=()=>`
<div class="sem_wrap">

  <!-- TOOLBAR -->
  <div class="sem_toolbar">
    <div class="sem_tb_left">
      <div class="sem_logo"><i class="fas fa-table-cells"></i><span>Semana</span></div>
      <div class="sem_week_nav">
        <button class="sem_nav_btn" id="sem_prev" ${b("Semana anterior")}><i class="fas fa-chevron-left"></i></button>
        <button class="sem_nav_hoy" id="sem_hoy"><i class="fas fa-crosshairs"></i> Hoy</button>
        <button class="sem_nav_btn" id="sem_next" ${b("Semana siguiente")}><i class="fas fa-chevron-right"></i></button>
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
    </div>
  </div>

  <!-- ACTION BAR -->
  <div class="sem_actionbar">
    <div class="sem_ab_left">
      <span class="sem_sync_dot sem_sync_loading" id="sem_sync"></span>
      <button class="sem_ab_btn" id="sem_refresh" ${b("Actualizar")}><i class="fas fa-rotate-right"></i></button>
      <button class="sem_ab_btn sem_ab_nuevo" id="sem_nuevo"><i class="fas fa-plus"></i> Nueva actividad</button>
    </div>
    <div class="sem_ab_right">
      <div class="sem_prog_wrap">
        <div class="sem_prog_label" id="sem_prog_label">0 / 0</div>
        <div class="sem_prog_track"><div class="sem_prog_fill" id="sem_prog_fill" style="width:0%"></div></div>
        <div class="sem_prog_pct" id="sem_prog_pct">0%</div>
      </div>
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
      <div class="sem_modal_ico" id="sem_m_ico"><i class="fas fa-calendar-plus"></i></div>
      <div>
        <h2 class="sem_modal_tit" id="sem_m_tit">Nueva Actividad</h2>
        <p class="sem_modal_sub" id="sem_m_sub">Organiza tu semana</p>
      </div>
    </div>
    <div class="sem_modal_body">
      <div class="sem_field">
        <label class="sem_label"><i class="fas fa-heading"></i> Título <span class="sem_req">*</span></label>
        <div class="sem_input_ico"><i class="fas fa-pen"></i><input type="text" class="sem_input" id="s_titulo" placeholder="Ej: Estudiar matemáticas" maxlength="80"/></div>
      </div>
      <div class="sem_field">
        <label class="sem_label"><i class="fas fa-align-left"></i> Nota</label>
        <textarea class="sem_textarea" id="s_nota" placeholder="Detalles opcionales…" maxlength="300" rows="2"></textarea>
      </div>
      <div class="sem_field_row sem_field_row3">
        <div class="sem_field">
          <label class="sem_label"><i class="fas fa-calendar-day"></i> Día</label>
          <select class="sem_select" id="s_dia">
            ${j.map((s,a)=>`<option value="${s}">${Q[a]}</option>`).join("")}
          </select>
        </div>
        <div class="sem_field">
          <label class="sem_label"><i class="fas fa-clock"></i> Hora</label>
          <input type="time" class="sem_input sem_input_plain" id="s_hora"/>
        </div>
        <div class="sem_field">
          <label class="sem_label"><i class="fas fa-hourglass-half"></i> Duración</label>
          <select class="sem_select" id="s_duracion">
            <option value="">—</option>
            <option value="15m">15 min</option>
            <option value="30m">30 min</option>
            <option value="45m">45 min</option>
            <option value="1h">1 hora</option>
            <option value="1.5h">1.5 h</option>
            <option value="2h">2 horas</option>
            <option value="3h">3 horas</option>
            <option value="4h">4 horas</option>
          </select>
        </div>
      </div>
      <div class="sem_field_row sem_field_row3">
        <div class="sem_field">
          <label class="sem_label"><i class="fas fa-tag"></i> Categoría</label>
          <select class="sem_select" id="s_cat">
            ${Object.entries(f).map(([s,a])=>`<option value="${s}">${a.label}</option>`).join("")}
          </select>
        </div>
        <div class="sem_field">
          <label class="sem_label"><i class="fas fa-flag"></i> Prioridad</label>
          <select class="sem_select" id="s_prio">
            ${Object.entries(E).map(([s,a])=>`<option value="${s}">${a.label}</option>`).join("")}
          </select>
        </div>
        <div class="sem_field">
          <label class="sem_label"><i class="fas fa-palette"></i> Color</label>
          <div class="sem_colores" id="s_colores">
            ${T.map(s=>`<button type="button" class="sem_color_opt" data-color="${s}" style="--c:${s}"></button>`).join("")}
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
</div>`,_=()=>{const s=e("#sem_board").empty(),a=W(),o=a.length,t=a.filter(l=>l.done).length,v=z(a);e("#sem_n_total").text(o),e("#sem_n_done").text(t),e("#sem_n_pct").text(`${v}%`),e("#sem_prog_label").text(`${t} / ${o}`),e("#sem_prog_fill").css("width",`${v}%`),e("#sem_prog_pct").text(`${v}%`);const u=I(n,6);e("#sem_week_label").text(`${C(n)} — ${C(u)}`),j.forEach((l,y)=>{const D=I(n,y),m=bs(l),g=vs(D),k=us(D),ss=m.filter(i=>i.done).length,as=z(m);s.append(`
    <div class="sem_col${g?" sem_col_hoy":""}${k?" sem_col_past":""}" data-dia="${l}">
      <div class="sem_col_head" style="--dc:${g?"var(--mco)":k?"#94A3B8":"var(--brd)"}">
        <div class="sem_col_dia">
          <span class="sem_col_nombre">${Q[y]}</span>
          <span class="sem_col_fecha${g?" sem_col_hoy_badge":""}">${C(D)}${g?" · Hoy":""}</span>
        </div>
        <div class="sem_col_meta">
          <span class="sem_col_count" id="sem_cnt_${l}">${m.length}</span>
          ${k?"":`<button class="sem_col_add" data-dia="${l}" ${b("Agregar")}><i class="fas fa-plus"></i></button>`}
        </div>
      </div>
      ${m.length?`
      <div class="sem_col_prog">
        <div class="sem_col_prog_bar"><div class="sem_col_prog_fill" style="width:${as}%;background:${g?"var(--mco)":"#94A3B8"}"></div></div>
        <span class="sem_col_prog_txt">${ss}/${m.length}</span>
      </div>`:""}
      <div class="sem_col_body" id="sem_body_${l}">
        ${m.length===0?`<div class="sem_empty_dia"><i class="fas fa-moon"></i><span>${k?"Sin registros":"Vacío"}</span></div>`:""}
      </div>
    </div>`);const es=e(`#sem_body_${l}`);m.sort((i,p)=>(i.hora||"99:99").localeCompare(p.hora||"99:99")).forEach(i=>{const p=f[i.categoria]||f.otro,R=E[i.prioridad]||E.media,os=i.color||p.color;es.append(`
      <div class="sem_item${i.done?" sem_item_done":""}" data-id="${i._fsId}" style="--ic:${os}">
        <div class="sem_item_left">
          <button class="sem_item_check${i.done?" sem_item_checked":""}" data-id="${i._fsId}">
            <i class="fas ${i.done?"fa-circle-check":"fa-circle-dot"}"></i>
          </button>
        </div>
        <div class="sem_item_body">
          <div class="sem_item_titulo">${i.titulo}</div>
          <div class="sem_item_meta">
            ${i.hora?`<span class="sem_item_hora"><i class="fas fa-clock"></i>${i.hora}${i.duracion?` · ${i.duracion}`:""}</span>`:""}
            <span class="sem_item_cat" style="--cc:${p.color}"><i class="fas ${p.icon}"></i>${p.label}</span>
            <span class="sem_item_prio" style="--pc:${R.color}"><i class="fas ${R.icon}"></i></span>
          </div>
          ${i.nota?`<p class="sem_item_nota">${i.nota}</p>`:""}
        </div>
        <div class="sem_item_actions">
          <button class="sem_item_edit" data-id="${i._fsId}" ${b("Editar")}><i class="fas fa-pen"></i></button>
          <button class="sem_item_del" data-id="${i._fsId}" ${b("Eliminar")}><i class="fas fa-times"></i></button>
        </div>
      </div>`)})})},Z=s=>{e("#s_colores .sem_color_opt").removeClass("active"),e(`#s_colores .sem_color_opt[data-color="${s}"]`).addClass("active")},K=()=>e("#s_colores .sem_color_opt.active").data("color")||T[0],F=(s,a)=>{e("#sem_m_hero").css("background",`linear-gradient(135deg,${s}dd,${s}88)`),e("#sem_m_ico").css("background",s).html(`<i class="fas ${a}"></i>`)},w=(s={},a=null)=>{d=s._fsId?s:null;const o=s.categoria||"trabajo",t=s.color||f[o]?.color||T[0];e("#s_titulo").val(s.titulo||""),e("#s_nota").val(s.nota||""),e("#s_dia").val(s.dia||a||j[0]),e("#s_hora").val(s.hora||""),e("#s_duracion").val(s.duracion||""),e("#s_cat").val(o),e("#s_prio").val(s.prioridad||"media"),Z(t),F(t,f[o]?.icon||"fa-calendar-plus"),e("#sem_m_tit").text(d?"Editar Actividad":"Nueva Actividad"),e("#sem_m_sub").text(d?"Modifica los datos":"Organiza tu semana"),e("#s_eliminar").toggleClass("dpn",!d),J("modal_semanal"),setTimeout(()=>e("#s_titulo").focus(),30)},H=()=>{const s=e("#s_titulo").val().trim();if(!s)return $("Título requerido","warning");A("#s_guardar",!0,"Guardar");const a=e("#s_cat").val();X({...d||{},titulo:s,nota:e("#s_nota").val().trim(),dia:e("#s_dia").val(),hora:e("#s_hora").val()||"",duracion:e("#s_duracion").val()||"",categoria:a,prioridad:e("#s_prio").val(),color:K(),semana:n,done:d?.done||!1,creado:d?.creado||new Date().toISOString()}),h("modal_semanal"),_(),A("#s_guardar",!1,"Guardar"),$(d?"Actividad actualizada ✓":"Actividad creada ✓","success")},gs=s=>{const a=r().find(o=>o._fsId===s);a&&(X({...a,done:!a.done,completadoEn:a.done?"":new Date().toISOString()}),_(),a.done||$("✅ ¡Actividad completada!","success"))},q=s=>{e("#sem_confirm_nombre").text(s.titulo||"Sin título"),Y=()=>{ps(s),h("modal_sem_confirm"),_(),$("Actividad eliminada ✓","success")},J("modal_sem_confirm")},hs=()=>{e(document).off(".sem"),e(document).on("click.sem","#sem_prev",()=>{n=I(n,-7),_()}).on("click.sem","#sem_next",()=>{n=I(n,7),_()}).on("click.sem","#sem_hoy",()=>{n=M(),_()}).on("click.sem","#sem_refresh",async()=>{A("#sem_refresh",!0,""),localStorage.removeItem(x),await S(!0),_(),A("#sem_refresh",!1,""),$("Semana actualizada ✓","success")}).on("click.sem","#sem_nuevo",()=>w({},null)).on("click.sem",".sem_col_add",function(a){a.stopPropagation(),w({},e(this).data("dia"))}).on("click.sem",".sem_item_check",function(a){a.stopPropagation(),gs(e(this).data("id"))}).on("click.sem",".sem_item",function(a){if(e(a.target).closest(".sem_item_check,.sem_item_edit,.sem_item_del").length)return;const o=r().find(t=>t._fsId===e(this).data("id"));o&&w(o)}).on("click.sem",".sem_item_edit",function(a){a.stopPropagation();const o=r().find(t=>t._fsId===e(this).data("id"));o&&w(o)}).on("click.sem",".sem_item_del",function(a){a.stopPropagation();const o=r().find(t=>t._fsId===e(this).data("id"));o&&q(o)}).on("change.sem","#s_cat",function(){const a=e(this).val();F(K(),f[a]?.icon||"fa-calendar-plus")}).on("click.sem","#s_colores .sem_color_opt",function(){Z(e(this).data("color")),F(e(this).data("color"),f[e("#s_cat").val()]?.icon||"fa-calendar-plus")}).on("click.sem","#s_cancelar",()=>h("modal_semanal")).on("click.sem","#s_guardar",H).on("keydown.sem","#s_titulo",a=>{a.key==="Enter"&&H()}).on("click.sem","#s_eliminar",()=>{d&&(h("modal_semanal"),q(d))}).on("click.sem","#sem_conf_no",()=>h("modal_sem_confirm")).on("click.sem","#sem_conf_si",()=>Y?.())},Ds=async()=>{n=M(),await S(),_(),hs(),rs(S,_),console.log("📅 Semanal v1.0 OK")},Cs=()=>{e(document).off(".sem"),console.log("🧹 Semanal limpiado")};export{Cs as cleanup,Ds as init,Is as render};
