import{j as s}from"./vendor-gzd0YkcT.js";import{db as P}from"./firebase-jggN8PZ1.js";import{g as ao,q as lo,c as so,w as to,a as io,d as H,s as co,b as eo}from"./firebase-X7xaP-Jv.js";import{d,h as E,N as m,e as $,g as V,s as no,f as Q}from"./main-PaQvqqIh.js";import"./main-dTXxXa1j.js";const O="wii_logros_v1",T="logros",_={personal:{label:"Personal",icon:"fa-user",color:"#FFB800"},trabajo:{label:"Trabajo",icon:"fa-briefcase",color:"#0EBEFF"},estudio:{label:"Estudio",icon:"fa-book",color:"#7000FF"},salud:{label:"Salud",icon:"fa-heart-pulse",color:"#FF5C69"},deporte:{label:"Deporte",icon:"fa-dumbbell",color:"#29C72E"},finanzas:{label:"Finanzas",icon:"fa-coins",color:"#00C9B1"},social:{label:"Social",icon:"fa-users",color:"#A855F7"},creativo:{label:"Creativo",icon:"fa-palette",color:"#F97316"},otro:{label:"Otro",icon:"fa-star",color:"#94A3B8"}},x=[{min:0,max:100,label:"Novato",icon:"fa-seedling",color:"#94A3B8",badge:"🌱"},{min:100,max:300,label:"Aprendiz",icon:"fa-bolt",color:"#29C72E",badge:"⚡"},{min:300,max:600,label:"Veterano",icon:"fa-shield",color:"#0EBEFF",badge:"🛡️"},{min:600,max:1e3,label:"Experto",icon:"fa-gem",color:"#7000FF",badge:"💎"},{min:1e3,max:2e3,label:"Maestro",icon:"fa-crown",color:"#FFB800",badge:"👑"},{min:2e3,max:9999,label:"Leyenda",icon:"fa-dragon",color:"#FF5C69",badge:"🔥"}],ro=[{id:"primer_logro",label:"Primer paso",icon:"fa-flag",color:"#29C72E",cond:a=>a.length>=1},{id:"x5",label:"Racha x5",icon:"fa-fire",color:"#FF5C69",cond:a=>a.length>=5},{id:"x10",label:"Décimo logro",icon:"fa-star",color:"#FFB800",cond:a=>a.length>=10},{id:"x25",label:"Imparable x25",icon:"fa-rocket",color:"#7000FF",cond:a=>a.length>=25},{id:"multcat",label:"Versátil",icon:"fa-shuffle",color:"#0EBEFF",cond:a=>new Set(a.map(o=>o.categoria)).size>=4},{id:"100xp",label:"100 XP",icon:"fa-bolt",color:"#29C72E",cond:(a,o)=>o>=100},{id:"500xp",label:"500 XP",icon:"fa-gem",color:"#7000FF",cond:(a,o)=>o>=500},{id:"1000xp",label:"Maestro XP",icon:"fa-crown",color:"#FFB800",cond:(a,o)=>o>=1e3}],y={personal:15,trabajo:20,estudio:25,salud:18,deporte:20,finanzas:15,social:12,creativo:18,otro:10},M=["#FFB800","#0EBEFF","#7000FF","#FF5C69","#29C72E","#A855F7","#00C9B1","#F97316","#94A3B8"],v=()=>new Date().toISOString().split("T")[0],S=a=>{const o=new Date;return o.setDate(o.getDate()+a),o.toISOString().split("T")[0]},_o=a=>`${(a||"logro").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g,"_").replace(/[^a-z0-9_]/g,"").slice(0,25)}_${Date.now()}`,X=a=>new Date(a+"T00:00:00").toLocaleDateString("es-PE",{day:"numeric",month:"short",year:"numeric"}),K=a=>{const o=Math.floor((new Date(v())-new Date(a+"T00:00:00"))/864e5);return o===0?"🟢 Hoy":o===1?"🔵 Ayer":o<7?`${o}d atrás`:o<30?`${Math.floor(o/7)}sem atrás`:`${Math.floor(o/30)}m atrás`},go=a=>x.find(o=>a>=o.min&&a<o.max)||x[x.length-1],fo=a=>a.reduce((o,l)=>o+(y[l.categoria]||10)+(l.destacado?10:0),0),uo=()=>[{label:"Hoy",fecha:v(),icon:"fa-circle-dot",color:"#0EBEFF"},{label:"Ayer",fecha:S(-1),icon:"fa-clock-rotate-left",color:"#FFB800"},{label:"Antier",fecha:S(-2),icon:"fa-backward",color:"#29C72E"},{label:"-1 semana",fecha:S(-7),icon:"fa-calendar-week",color:"#7000FF"},{label:"Este mes",fecha:new Date().toISOString().split("T")[0].slice(0,8)+"01",icon:"fa-flag",color:"#A855F7"}],z=()=>V("wiSmile")||null,R=()=>!!z()?.usuario,g=()=>V(O)||[],j=a=>no(O,a,48),r=a=>{const o=s("#log_sync");o.length&&(o[0].className=`log_sync_dot log_sync_${a}`)},U=async(a=!1)=>{if(!a&&g().length)return r("ok");if(!R())return r("error");r("loading");try{const o=await ao(lo(so(P,T),to("usuario","==",z().usuario)));j(o.docs.map(l=>({...l.data(),_fsId:l.id,id:l.id}))),r("ok")}catch(o){console.error("❌ logros:",o),r("error")}},po=a=>{const o=g(),l=a._fsId||_o(a.titulo),t={...a,_fsId:l,id:l},c=o.findIndex(i=>i._fsId===l);if(c>=0?o.splice(c,1,t):o.push(t),j(o),R()){r("saving");const i=z()||{},u={...t};delete u._fsId,co(H(P,T,l),{...u,usuario:i.usuario||"",email:i.email||"",actualizado:eo()},{merge:!0}).then(()=>r("ok")).catch(b=>{console.error("❌ upsert:",b),r("error")})}return t},vo=a=>{const o=a._fsId||a.id;j(g().filter(l=>l._fsId!==o)),R()&&(r("saving"),io(H(P,T,o)).then(()=>r("ok")).catch(l=>{console.error("❌ del:",l),r("error")}))};let f=null,J=null,C="todos",D="",L="grid";const bo=()=>{let a=g().sort((o,l)=>(l.fecha||"").localeCompare(o.fecha||""));if(C!=="todos"&&(a=a.filter(o=>o.categoria===C||C==="destacado"&&o.destacado)),D){const o=D.toLowerCase();a=a.filter(l=>(l.titulo||"").toLowerCase().includes(o)||(l.descripcion||"").toLowerCase().includes(o))}return a},Eo=()=>`
<div class="log_wrap">

  <!-- HERO BANNER -->
  <div class="log_hero" id="log_hero">
    <div class="log_hero_left">
      <div class="log_hero_avatar" id="log_hero_avatar">
        <i class="fas fa-seedling" id="log_hero_icon"></i>
      </div>
      <div class="log_hero_info">
        <div class="log_hero_nivel" id="log_hero_nivel">Novato</div>
        <div class="log_hero_badge" id="log_hero_badge">🌱 Empieza tu historia</div>
        <div class="log_hero_xp_wrap">
          <div class="log_hero_xp_bar"><div class="log_hero_xp_fill" id="log_xp_fill" style="width:0%"></div></div>
          <span class="log_hero_xp_txt" id="log_xp_txt">0 XP</span>
        </div>
      </div>
    </div>
    <div class="log_hero_right">
      <div class="log_stat_pill"><i class="fas fa-trophy" style="color:#FFB800"></i><strong id="log_n_total">0</strong><span>Logros</span></div>
      <div class="log_stat_pill"><i class="fas fa-fire" style="color:#FF5C69"></i><strong id="log_n_dest">0</strong><span>Destacados</span></div>
      <div class="log_stat_pill"><i class="fas fa-medal" style="color:#0EBEFF"></i><strong id="log_n_insig">0</strong><span>Insignias</span></div>
    </div>
  </div>

  <!-- INSIGNIAS -->
  <div class="log_insignias_bar" id="log_insignias_bar"></div>

  <!-- ACTION BAR -->
  <div class="log_actionbar">
    <div class="log_ab_left">
      <span class="log_sync_dot log_sync_loading" id="log_sync"></span>
      <button class="log_ab_btn" id="log_refresh" ${d("Actualizar")}><i class="fas fa-rotate-right"></i></button>
      <button class="log_ab_btn log_ab_nuevo" id="log_nuevo"><i class="fas fa-plus"></i> Nuevo logro</button>
    </div>
    <div class="log_ab_right">
      <div class="log_filtros" id="log_filtros">
        <button class="log_fil active" data-fil="todos">Todos</button>
        <button class="log_fil" data-fil="destacado" style="--fc:#FFB800"><i class="fas fa-star"></i> Top</button>
        ${Object.entries(_).slice(0,5).map(([a,o])=>`<button class="log_fil" data-fil="${a}" style="--fc:${o.color}"><i class="fas ${o.icon}"></i> ${o.label}</button>`).join("")}
      </div>
      <div class="log_search_wrap">
        <i class="fas fa-search"></i>
        <input type="text" class="log_search_input" id="log_buscar" placeholder="Buscar logro…"/>
      </div>
      <div class="log_vista_btns">
        <button class="log_vista_btn active" data-vista="grid" ${d("Cuadrícula")}><i class="fas fa-grid-2"></i></button>
        <button class="log_vista_btn" data-vista="list" ${d("Lista")}><i class="fas fa-list"></i></button>
        <button class="log_vista_btn" data-vista="timeline" ${d("Línea de tiempo")}><i class="fas fa-timeline"></i></button>
      </div>
    </div>
  </div>

  <!-- CONTENT -->
  <div class="log_content" id="log_content"></div>

</div>

<!-- MODAL LOGRO -->
<div class="wiModal" id="modal_logro">
  <div class="modalBody log_modal">
    <button class="modalX"><i class="fas fa-times"></i></button>

    <div class="log_modal_hero" id="log_m_hero">
      <div class="log_modal_ico" id="log_m_ico"><i class="fas fa-trophy"></i></div>
      <div>
        <h2 class="log_modal_tit" id="log_m_tit">Nuevo Logro</h2>
        <p class="log_modal_sub" id="log_m_sub">Registra tu éxito</p>
      </div>
      <div class="log_modal_xp_badge" id="log_m_xp">+15 XP</div>
    </div>

    <div class="log_modal_body">

      <div class="log_field">
        <label class="log_label"><i class="fas fa-heading"></i> Título <span class="log_req">*</span></label>
        <div class="log_input_ico"><i class="fas fa-pen"></i>
          <input type="text" class="log_input" id="l_titulo" placeholder="Ej: Terminé mi primer proyecto" maxlength="80"/>
        </div>
      </div>

      <div class="log_field">
        <label class="log_label"><i class="fas fa-align-left"></i> Descripción</label>
        <textarea class="log_textarea" id="l_desc" placeholder="¿Qué lograste exactamente? Cuéntalo con orgullo…" maxlength="400" rows="2"></textarea>
      </div>

      <!-- Fecha + Sugerencias -->
      <div class="log_field">
        <label class="log_label"><i class="fas fa-calendar"></i> ¿Cuándo lo lograste? <span class="log_req">*</span></label>
        <div class="log_fecha_wrap">
          <input type="date" class="log_input log_input_plain" id="l_fecha"/>
          <div class="log_sugerencias" id="log_sugerencias"></div>
        </div>
      </div>

      <div class="log_field_row log_field_row2">
        <div class="log_field">
          <label class="log_label"><i class="fas fa-tag"></i> Categoría</label>
          <select class="log_select" id="l_cat">
            ${Object.entries(_).map(([a,o])=>`<option value="${a}">${o.label}</option>`).join("")}
          </select>
        </div>
        <div class="log_field">
          <label class="log_label"><i class="fas fa-palette"></i> Color</label>
          <div class="log_colores" id="l_colores">
            ${M.map(a=>`<button type="button" class="log_color_opt" data-color="${a}" style="--c:${a}"></button>`).join("")}
          </div>
        </div>
      </div>

      <!-- Destacado toggle -->
      <div class="log_field">
        <div class="log_destacado_row" id="l_destacado_row">
          <div class="log_destacado_info">
            <i class="fas fa-star" style="color:#FFB800"></i>
            <div>
              <div class="log_destacado_lbl">Marcar como destacado</div>
              <div class="log_destacado_sub">+10 XP extra · aparece primero</div>
            </div>
          </div>
          <button type="button" class="log_toggle" id="l_destacado"><i class="fas fa-toggle-off"></i></button>
        </div>
      </div>

      <div class="log_modal_footer">
        <button type="button" class="log_btn_del dpn" id="l_eliminar"><i class="fas fa-trash"></i> Eliminar</button>
        <div class="log_modal_footer_r">
          <button type="button" class="log_btn_cancel" id="l_cancelar">Cancelar</button>
          <button type="button" class="log_btn_save" id="l_guardar"><i class="fas fa-floppy-disk"></i> Guardar</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- MODAL CONFIRMAR -->
<div class="wiModal" id="modal_log_confirm">
  <div class="modalBody log_modal_confirm">
    <div class="log_confirm_ico"><i class="fas fa-triangle-exclamation"></i></div>
    <h3>¿Eliminar logro?</h3>
    <p id="log_confirm_nombre"></p>
    <div class="log_confirm_btns">
      <button class="log_btn_cancel" id="log_conf_no">Cancelar</button>
      <button class="log_btn_del_confirm" id="log_conf_si"><i class="fas fa-trash"></i> Eliminar</button>
    </div>
  </div>
</div>`,I=()=>{const a=g(),o=fo(a),l=go(o),t=x.find(n=>n.min>o)||l,c=l.min===l.max?100:Math.min(100,Math.round((o-l.min)/(t.min-l.min)*100)),i=a.filter(n=>n.destacado).length;s("#log_hero").css("--hero_c",l.color),s("#log_hero_avatar").css("background",`radial-gradient(circle, ${l.color}33, ${l.color}11)`),s("#log_hero_icon").attr("class",`fas ${l.icon}`).css("color",l.color),s("#log_hero_nivel").text(`Nivel: ${l.label}`).css("color",l.color),s("#log_hero_badge").html(`${l.badge} <strong>${o} XP</strong> · siguiente: ${t.label} (${t.min} XP)`),s("#log_xp_fill").css({width:`${c}%`,background:l.color}),s("#log_xp_txt").text(`${o} XP`),s("#log_n_total").text(a.length),s("#log_n_dest").text(i);const u=ro.filter(n=>n.cond(a,o));s("#log_n_insig").text(u.length);const b=s("#log_insignias_bar").empty();if(!u.length){b.html('<div class="log_insig_empty"><i class="fas fa-lock"></i><span>Sigue logrando para desbloquear insignias</span></div>');return}u.forEach(n=>{b.append(`<div class="log_insig_pill" style="--ic:${n.color}" ${d(n.label)}><i class="fas ${n.icon}"></i><span>${n.label}</span></div>`)})},p=()=>{const a=bo(),o=s("#log_content").empty();if(o.attr("class",`log_content log_${L}`),!a.length){o.html(`<div class="log_empty">
      <i class="fas fa-trophy"></i>
      <h3>Sin logros aún</h3>
      <p>Cada gran hazaña empieza con el primer paso. ¡Registra tu primer logro!</p>
      <button class="log_btn_save" id="log_empty_nuevo"><i class="fas fa-plus"></i> Registrar logro</button>
    </div>`);return}if(L==="timeline"){ho(a,o);return}a.forEach(l=>{const t=_[l.categoria]||_.otro,c=l.color||t.color,i=(y[l.categoria]||10)+(l.destacado?10:0);o.append(`
    <div class="log_card${l.destacado?" log_card_dest":""}" data-id="${l._fsId}" style="--lc:${c}">
      ${l.destacado?'<div class="log_card_dest_ribbon"><i class="fas fa-star"></i></div>':""}
      <div class="log_card_header">
        <div class="log_card_ico" style="background:${c}">
          <i class="fas ${t.icon}"></i>
        </div>
        <div class="log_card_head_info">
          <div class="log_card_titulo">${l.titulo}</div>
          <div class="log_card_meta">
            <span class="log_card_cat" style="--cc:${t.color}"><i class="fas ${t.icon}"></i>${t.label}</span>
            <span class="log_card_xp" style="color:${c}">+${i} XP</span>
          </div>
        </div>
        <button class="log_card_opts" data-id="${l._fsId}" ${d("Eliminar")}><i class="fas fa-ellipsis-v"></i></button>
      </div>
      ${l.descripcion?`<p class="log_card_desc">${l.descripcion}</p>`:""}
      <div class="log_card_footer">
        <span class="log_card_fecha"><i class="fas fa-calendar"></i>${X(l.fecha||v())} <em>${K(l.fecha||v())}</em></span>
        <button class="log_card_edit" data-id="${l._fsId}" ${d("Editar")}><i class="fas fa-pen"></i></button>
      </div>
    </div>`)})},ho=(a,o)=>{const l={};a.forEach(c=>{const i=(c.fecha||v()).slice(0,7);l[i]||(l[i]=[]),l[i].push(c)});const t=s('<div class="log_timeline"></div>').appendTo(o);Object.entries(l).sort((c,i)=>i[0].localeCompare(c[0])).forEach(([c,i])=>{const[u,b]=c.split("-"),n=new Date(u,b-1,1).toLocaleDateString("es-PE",{month:"long",year:"numeric"});t.append(`<div class="log_tl_mes_lbl"><i class="fas fa-calendar-alt"></i> ${n} <span>${i.length} logro${i.length>1?"s":""}</span></div>`),i.forEach(e=>{const h=_[e.categoria]||_.otro,k=e.color||h.color,oo=(y[e.categoria]||10)+(e.destacado?10:0);t.append(`
      <div class="log_tl_item${e.destacado?" log_tl_dest":""}" data-id="${e._fsId}" style="--lc:${k}">
        <div class="log_tl_dot" style="background:${k}"><i class="fas ${e.destacado?"fa-star":h.icon}"></i></div>
        <div class="log_tl_body">
          <div class="log_tl_titulo">${e.titulo}</div>
          <div class="log_tl_meta">
            <span class="log_tl_cat" style="--cc:${h.color}"><i class="fas ${h.icon}"></i>${h.label}</span>
            <span class="log_tl_xp" style="color:${k}">+${oo} XP</span>
            <span class="log_tl_fecha"><i class="fas fa-clock"></i>${K(e.fecha||v())}</span>
          </div>
          ${e.descripcion?`<p class="log_tl_desc">${e.descripcion}</p>`:""}
        </div>
        <div class="log_tl_actions">
          <button class="log_card_edit" data-id="${e._fsId}" ${d("Editar")}><i class="fas fa-pen"></i></button>
          <button class="log_card_opts" data-id="${e._fsId}" ${d("Eliminar")}><i class="fas fa-times"></i></button>
        </div>
      </div>`)})})},W=a=>{s("#l_colores .log_color_opt").removeClass("active"),s(`#l_colores .log_color_opt[data-color="${a}"]`).addClass("active")},Y=()=>s("#l_colores .log_color_opt.active").data("color")||M[0],B=(a,o)=>{s("#log_m_hero").css("background",`linear-gradient(135deg,${a}dd,${a}88)`),s("#log_m_ico").css("background",a).html(`<i class="fas ${o}"></i>`)},Z=a=>{s("#l_destacado").html(`<i class="fas ${a?"fa-toggle-on":"fa-toggle-off"}"></i>`),s("#l_destacado_row").toggleClass("log_dest_on",!!a),s("#l_destacado").data("val",a?1:0)},w=()=>!!s("#l_destacado").data("val"),A=a=>{const o=uo();s("#log_sugerencias").html(o.map(l=>`
      <button type="button" class="log_sug_btn${l.fecha===a?" active":""}"
        data-fecha="${l.fecha}" style="--sc:${l.color}" ${d(X(l.fecha))}>
        <i class="fas ${l.icon}"></i><span>${l.label}</span>
      </button>`).join(""))},N=()=>{const a=s("#l_cat").val()||"otro",o=w(),l=(y[a]||10)+(o?10:0);s("#log_m_xp").text(`+${l} XP`)},F=(a={})=>{f=a._fsId?a:null;const o=a.categoria||"personal",l=a.color||_[o]?.color||M[0],t=a.fecha||v();s("#l_titulo").val(a.titulo||""),s("#l_desc").val(a.descripcion||""),s("#l_fecha").val(t),s("#l_cat").val(o),W(l),Z(a.destacado||!1),B(l,_[o]?.icon||"fa-trophy"),A(t),N(),s("#log_m_tit").text(f?"Editar Logro":"Nuevo Logro"),s("#log_m_sub").text(f?"Modifica tu logro":"Registra tu éxito"),s("#l_eliminar").toggleClass("dpn",!f),Q("modal_logro"),setTimeout(()=>s("#l_titulo").focus(),30)},q=()=>{const a=s("#l_titulo").val().trim();if(!a)return m("Título requerido","warning");const o=s("#l_fecha").val();if(!o)return m("Fecha requerida","warning");E("#l_guardar",!0,"Guardar");const l=s("#l_cat").val();po({...f||{},titulo:a,descripcion:s("#l_desc").val().trim(),fecha:o,categoria:l,color:Y(),destacado:w(),creado:f?.creado||new Date().toISOString()}),$("modal_logro"),I(),p(),E("#l_guardar",!1,"Guardar");const t=(y[l]||10)+(w()?10:0);m(f?"Logro actualizado ✓":`🏆 +${t} XP · ¡Logro registrado!`,"success")},G=a=>{s("#log_confirm_nombre").text(a.titulo||"Sin título"),J=()=>{vo(a),$("modal_log_confirm"),I(),p(),m("Logro eliminado ✓","success")},Q("modal_log_confirm")},mo=()=>{s(document).off(".log"),s(document).on("click.log","#log_nuevo,#log_empty_nuevo",()=>F()).on("click.log","#log_refresh",async()=>{E("#log_refresh",!0,""),localStorage.removeItem(O),await U(!0),I(),p(),E("#log_refresh",!1,""),m("Logros actualizados ✓","success")}).on("click.log",".log_fil",function(){C=s(this).data("fil"),s(".log_fil").removeClass("active"),s(this).addClass("active"),p()}).on("input.log","#log_buscar",function(){D=s(this).val(),p()}).on("click.log",".log_vista_btn",function(){L=s(this).data("vista"),s(".log_vista_btn").removeClass("active"),s(this).addClass("active"),p()}).on("click.log",".log_card",function(o){if(s(o.target).closest(".log_card_opts,.log_card_edit").length)return;const l=g().find(t=>t._fsId===s(this).data("id"));l&&F(l)}).on("click.log",".log_card_edit",function(o){o.stopPropagation();const l=g().find(t=>t._fsId===s(this).data("id"));l&&F(l)}).on("click.log",".log_card_opts",function(o){o.stopPropagation();const l=g().find(t=>t._fsId===s(this).data("id"));l&&G(l)}).on("click.log",".log_tl_item",function(o){if(s(o.target).closest(".log_card_edit,.log_card_opts").length)return;const l=g().find(t=>t._fsId===s(this).data("id"));l&&F(l)}).on("click.log",".log_sug_btn",function(){const o=s(this).data("fecha");s("#l_fecha").val(o),A(o),s("#log_m_sub").text(`Logrado: ${X(o)}`)}).on("change.log","#l_fecha",function(){A(s(this).val())}).on("change.log","#l_cat",function(){const o=s(this).val();B(Y(),_[o]?.icon||"fa-trophy"),N()}).on("click.log","#l_colores .log_color_opt",function(){W(s(this).data("color")),B(s(this).data("color"),_[s("#l_cat").val()]?.icon||"fa-trophy")}).on("click.log","#l_destacado",function(){Z(!w()),N()}).on("click.log","#l_cancelar",()=>$("modal_logro")).on("click.log","#l_guardar",q).on("keydown.log","#l_titulo",o=>{o.key==="Enter"&&q()}).on("click.log","#l_eliminar",()=>{f&&($("modal_logro"),G(f))}).on("click.log","#log_conf_no",()=>$("modal_log_confirm")).on("click.log","#log_conf_si",()=>J?.())},wo=async()=>{await U(),I(),p(),mo(),console.log("🏆 Logros v1.0 OK")},Io=()=>{s(document).off(".log"),console.log("🧹 Logros limpiado")};export{Io as cleanup,wo as init,Eo as render};
