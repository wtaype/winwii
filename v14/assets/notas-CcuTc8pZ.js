import{j as s}from"./vendor-gzd0YkcT.js";import{auth as k,db as m}from"./firebase-DHVsH4U5.js";import{s as C,d as p,b,a as I,q as F,c as O,w as j,m as L,g as A}from"./firebase-Whrs9NU2.js";import{r as q,a as B,S as P,d as f,g as U,N as w}from"./main-B6nsIEdO.js";let o=[],u=null,g=null,h=null;const $="wi_notas_cache",E="wi_notas_cache_time",H=100,M=1200,V=300*1e3,x=()=>U("wiSmile")||{},l=n=>{try{localStorage.setItem($,JSON.stringify(n)),localStorage.setItem(E,Date.now().toString())}catch{}},N=()=>{try{return JSON.parse(localStorage.getItem($)||"[]")}catch{return[]}},G=()=>{const n=parseInt(localStorage.getItem(E)||"0");return Date.now()-n<V},R=()=>{localStorage.removeItem($),localStorage.removeItem(E)},y=[{id:"Cielo",hex:"#0EBEFF",bg:"rgba(14,190,255,.12)",tx:"var(--tx)"},{id:"Rosa",hex:"#FF5C93",bg:"rgba(255,92,147,.12)",tx:"var(--tx)"},{id:"Verde",hex:"#10B981",bg:"rgba(16,185,129,.12)",tx:"var(--tx)"},{id:"Morado",hex:"#8B5CF6",bg:"rgba(139,92,246,.12)",tx:"var(--tx)"},{id:"Naranja",hex:"#F59E0B",bg:"rgba(245,158,11,.12)",tx:"var(--tx)"}],ra=()=>{const n=x();if(!n.email)return location.replace("/"),"";const a=n.nombre||n.usuario||n.email||k.currentUser?.email||"";return`
  <div class="wn_container">
    <div class="wn_header">
      <div class="wn_info">
        <img src="/smile.avif" alt="${B}" class="wn_avatar" />
        <div class="wn_text">
          <h1><i class="fas fa-sticky-note"></i> Mis Notas</h1>
          <p>${P()} <strong>${a}</strong></p>
        </div>
      </div>
      <div class="wn_actions">
        <button class="wn_btn_new" id="wnNueva" ${f("Nueva nota")}>
          <i class="fas fa-plus"></i> <span>Nueva</span>
        </button>
        <div class="wn_status_wrap">
          <div class="wn_status">
            <span class="wn_dot"></span>
            <span class="wn_dotxt">Cargando...</span>
          </div>
          <button class="wn_btn_sync" id="wnSync" ${f("Sincronizar")}>
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
    </div>

    <div class="wn_grid" id="wnGrid">${c(N())}</div>

    <div class="wn_modal" id="wnEliminar">
      <div class="wn_modal_body">
        <i class="fas fa-trash-alt"></i>
        <h3>¿Eliminar nota?</h3>
        <p>Esta acción no se puede deshacer</p>
        <div class="wn_modal_acts">
          <button class="wn_cancel" id="wnCancel">Cancelar</button>
          <button class="wn_confirm" id="wnConfirm">Eliminar</button>
        </div>
      </div>
    </div>
  </div>`},la=()=>{sa();const n=x();if(!n.email)return q.navigate("/");const a=n.email||k.currentUser?.email;s(document).on("click.wn","#wnNueva",()=>K(a)).on("click.wn","#wnSync",()=>J(a)).on("click.wn",".wn_card",function(t){s(t.target).closest(".wn_toolbar, .wn_colors").length||Y(s(this).data("id"))}).on("input.wn",".wn_titulo, .wn_contenido",function(){Q(s(this).closest(".wn_card").data("id"),a)}).on("click.wn",".wn_pin",function(t){t.stopPropagation(),X(s(this).closest(".wn_card").data("id"))}).on("click.wn",".wn_color",function(t){t.stopPropagation(),s(this).closest(".wn_card").find(".wn_colors").toggleClass("show")}).on("click.wn",".wn_color_opt",function(t){t.stopPropagation();const i=s(this).closest(".wn_card");Z(i.data("id"),s(this).data("color")),i.find(".wn_colors").removeClass("show")}).on("click.wn",".wn_del",function(t){t.stopPropagation(),u=s(this).closest(".wn_card").data("id"),s("#wnEliminar").addClass("show")}).on("click.wn","#wnCancel, #wnEliminar",t=>{s(t.target).is("#wnCancel, #wnEliminar")&&(s("#wnEliminar").removeClass("show"),u=null)}).on("click.wn","#wnConfirm",()=>aa()).on("click.wn",t=>{s(t.target).closest(".wn_colors, .wn_color").length||s(".wn_colors").removeClass("show")}),z(a),h=()=>{!document.hidden&&!G()&&S(a,!0)},document.addEventListener("visibilitychange",h)},z=n=>{const a=N();a.length&&G()?(o=a,v(),s("#wnGrid").html(c(o)),d(!0,"Cache")):S(n,!1)},J=async n=>{s("#wnSync").addClass("spinning"),R(),await S(n,!1),s("#wnSync").removeClass("spinning"),w("Sincronizado ✓","success",1500)},S=async(n,a=!1)=>{try{d(!1,"Cargando...");const t=F(O(m,"wiNotas"),j("email","==",n),L(H));o=(await A(t)).docs.map(r=>({id:r.id,...r.data()})),v(),l(o),s("#wnGrid").html(c(o)),d(!0)}catch(t){if(console.error("❌ Notas:",t),d(!1,"Offline"),!a){const i=N();i.length?(o=i,s("#wnGrid").html(c(o)),w("Usando caché local 📦","warning",2e3)):s("#wnGrid").html(T("fa-wifi-slash","Sin conexión","Verifica tu internet"))}}},v=()=>{o.sort((n,a)=>n.pin!==a.pin?a.pin?1:-1:(a.fecha?.seconds||0)-(n.fecha?.seconds||0))},K=async n=>{const a=`nota_${Date.now()}`,{usuario:t="",nombre:i=""}=x(),r={id:a,titulo:"",contenido:"",color:"Cielo",pin:!1,email:n,usuario:i||t||n,fecha:{seconds:Date.now()/1e3}};o.unshift(r),l(o),s("#wnGrid").html(c(o)),setTimeout(()=>{s(`.wn_card[data-id="${a}"]`).addClass("editing").find(".wn_titulo").focus()},50);try{await C(p(m,"wiNotas",a),{...r,fecha:b()}),d(!0),w("Nueva nota ✨","success",1200)}catch(e){console.error("❌",e),o=o.filter(_=>_.id!==a),l(o),s("#wnGrid").html(c(o)),w("Error al crear","error")}},Y=n=>{const a=s(`.wn_card[data-id="${n}"]`);s(".wn_card.editing").not(a).removeClass("editing"),a.toggleClass("editing"),a.hasClass("editing")&&a.find(".wn_titulo").focus()},Q=(n,a)=>{clearTimeout(g),g=setTimeout(()=>W(n,a),M)},W=async(n,a)=>{const t=s(`.wn_card[data-id="${n}"]`),i=t.find(".wn_titulo").text().trim(),r=t.find(".wn_contenido").text().trim(),e=o.find(_=>_.id===n);if(e&&!(e.titulo===i&&e.contenido===r)){e.titulo=i,e.contenido=r,l(o),t.addClass("saving");try{await C(p(m,"wiNotas",n),{id:n,titulo:i,contenido:r,color:e.color,pin:e.pin,email:a,usuario:e.usuario,fecha:b()}),d(!0),t.removeClass("saving").addClass("saved"),setTimeout(()=>t.removeClass("saved"),800)}catch(_){console.error("❌",_),t.removeClass("saving"),w("Error al guardar","error")}}},X=async(n,a)=>{const t=o.find(i=>i.id===n);if(t){t.pin=!t.pin,v(),l(o),s("#wnGrid").html(c(o));try{await C(p(m,"wiNotas",n),{...t,fecha:b()}),d(!0),w(t.pin?"Fijada 📌":"Desanclada","success",1e3)}catch(i){console.error("❌",i),t.pin=!t.pin,v(),l(o),s("#wnGrid").html(c(o))}}},Z=async(n,a,t)=>{const i=o.find(e=>e.id===n);if(!i||i.color===a)return;const r=i.color;i.color=a,l(o),s("#wnGrid").html(c(o));try{await C(p(m,"wiNotas",n),{...i,fecha:b()}),d(!0)}catch(e){console.error("❌",e),i.color=r,l(o),s("#wnGrid").html(c(o))}},aa=async()=>{if(!u)return;const n=u;u=null,s("#wnEliminar").removeClass("show");const a=[...o];o=o.filter(t=>t.id!==n),l(o),s(`.wn_card[data-id="${n}"]`).addClass("deleting"),setTimeout(()=>s("#wnGrid").html(c(o)),250);try{await I(p(m,"wiNotas",n)),w("Eliminada 🗑️","success",1e3)}catch(t){console.error("❌",t),o=a,l(o),s("#wnGrid").html(c(o)),w("Error al eliminar","error")}},d=(n,a)=>{s(".wn_dot").removeClass("active error").addClass(n?"active":"error"),s(".wn_dotxt").text(a||(n?"Online":"Offline"))},na=n=>y.find(a=>a.id===n)||y[0],ta=n=>{if(!n)return"Ahora";const a=n.toDate?.()||new Date((n.seconds||0)*1e3),t=new Date;t.setHours(0,0,0,0);const i=new Date(t);return i.setDate(i.getDate()-1),a>=t?a.toLocaleTimeString("es",{hour:"2-digit",minute:"2-digit"}):a>=i?"Ayer":a.toLocaleDateString("es",{day:"numeric",month:"short"})},c=n=>n?.length?n.map(a=>{const t=na(a.color);return`
    <div class="wn_card${a.pin?" pinned":""}" data-id="${a.id}" style="--c-bg:${t.bg};--c-tx:${t.tx};--c-accent:${t.hex}">
      <div class="wn_card_inner">
        ${a.pin?'<span class="wn_pin_badge"><i class="fas fa-thumbtack"></i></span>':""}
        <div class="wn_titulo" contenteditable="true" data-placeholder="Título" spellcheck="false">${D(a.titulo)}</div>
        <div class="wn_contenido" contenteditable="true" data-placeholder="Escribe aquí..." spellcheck="false">${D(a.contenido).replace(/\n/g,"<br>")}</div>
        <div class="wn_footer">
          <span class="wn_fecha">${ta(a.fecha)}</span>
          <span class="wn_saved"><i class="fas fa-check"></i></span>
        </div>
        <div class="wn_toolbar">
          <button class="wn_pin${a.pin?" active":""}" ${f("Fijar")}><i class="fas fa-thumbtack"></i></button>
          <button class="wn_color" ${f("Color")}><i class="fas fa-palette"></i></button>
          <button class="wn_del" ${f("Eliminar")}><i class="fas fa-trash"></i></button>
        </div>
        <div class="wn_colors">${y.map(i=>`<span class="wn_color_opt${i.id===a.color?" active":""}" data-color="${i.id}" style="--cc:${i.hex}"></span>`).join("")}</div>
      </div>
    </div>`}).join(""):T("fa-sticky-note","Sin notas aún","Crea tu primera nota 👆"),T=(n,a,t)=>`<div class="wn_empty"><i class="fas ${n}"></i><p>${a}</p><span>${t}</span></div>`,D=n=>String(n||"").replace(/[&<>"']/g,a=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[a]),sa=()=>{clearTimeout(g),h&&(document.removeEventListener("visibilitychange",h),h=null),s(document).off(".wn"),[o,u,g]=[[],null,null]};export{sa as cleanup,la as init,ra as render};
