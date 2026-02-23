import{j as s}from"./vendor-gzd0YkcT.js";import{auth as _,db as u}from"./firebase-CqWas0S_.js";import{l as x,q as S,w as k,c as D,s as j,d as b,b as M,a as N}from"./firebase-X7xaP-Jv.js";import{N as c,c as q,a as A,S as I,d,g as T}from"./main-B0GSvCsW.js";import"./main-D_fbEcK-.js";let o=[],m=null,r=null;const C="wi_notas_cache",p=()=>T("wiSmile")||{},H=a=>{try{localStorage.setItem(C,JSON.stringify(a))}catch{}},E=()=>{try{return JSON.parse(localStorage.getItem(C)||"[]")}catch{return[]}},z=()=>{const{nombre:a="",usuario:t="",email:e=""}=p(),i=a||t||e||_.currentUser?.email||"";return`
  <div class="smile_container">

    <div class="smile_header">
      <div class="header_info">
        <img src="/logo.webp" alt="${A}" class="header_avatar" />
        <div class="header_text">
          <h1>Mis Notas</h1>
          <p>${I()} <strong>${i}</strong></p>
        </div>
      </div>
      <div class="header_status">
        <span class="status_dot"></span>
        <span class="status_text">Cargando...</span>
      </div>
    </div>

    <div class="smile_chat" id="smileChat">
      ${h(E())}
    </div>

    <div class="smile_input">
      <div class="input_wrapper">
        <textarea id="nuevoMensaje"
          placeholder="Escribe una nota."
          rows="1" maxlength="500"></textarea>
        <span class="char_count" id="charCount">0/500</span>
      </div>
      <button id="btnEnviar" disabled ${d("Enviar · Enter")}>
        <i class="fas fa-paper-plane"></i>
      </button>
    </div>

    <div class="modal_overlay" id="modalEliminar">
      <div class="modal_content">
        <i class="fas fa-trash-alt"></i>
        <h3>¿Eliminar nota?</h3>
        <p>Esta acción no se puede deshacer</p>
        <div class="modal_actions">
          <button class="btn_cancelar" id="btnCancelar">Cancelar</button>
          <button class="btn_confirmar" id="btnConfirmar">Eliminar</button>
        </div>
      </div>
    </div>

  </div>`},B=()=>{const{email:a}=p(),t=a||_.currentUser?.email;if(!t)return c("Inicia sesión primero","error"),window.location.hash="#/auth?mode=login";s(document).on("input.sm","#nuevoMensaje",function(){s("#charCount").text(`${s(this).val().length}/500`),s("#btnEnviar").prop("disabled",!s(this).val().trim()),s(this).css("height","auto").css("height",Math.min(this.scrollHeight,150)+"px")}).on("keydown.sm","#nuevoMensaje",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),v(t))}).on("click.sm","#btnEnviar",()=>v(t)).on("click.sm",".msg_item",function(e){if(s(e.target).closest(".btn_delete").length)return;const i=o.find(n=>n.id===s(this).data("id"));i&&(q(i.nota,this,'¡Copiado! <i class="fas fa-check-circle"></i>'),s(this).addClass("copied"),setTimeout(()=>s(this).removeClass("copied"),800))}).on("click.sm",".btn_delete",function(e){e.stopPropagation(),r=s(this).data("id"),s("#modalEliminar").addClass("show")}).on("click.sm","#btnCancelar, #modalEliminar",e=>{s(e.target).is("#btnCancelar, #modalEliminar")&&(s("#modalEliminar").removeClass("show"),r=null)}).on("click.sm","#btnConfirmar",J),m=x(S(D(u,"notas"),k("email","==",t)),{includeMetadataChanges:!1},e=>{o=e.docs.map(i=>({id:i.id,...i.data()})).sort((i,n)=>(n.fecha?.seconds||0)-(i.fecha?.seconds||0)),H(o),s("#smileChat").html(h(o)),g(!0)},e=>{console.error("❌",e),g(!1);const i=E();i.length?(o=i,s("#smileChat").html(h(o)),c("Caché local 📦","warning",2e3)):s("#smileChat").html(w("fa-wifi-slash","Sin conexión","Verifica tu internet"))})},v=async a=>{const t=s("#nuevoMensaje"),e=t.val().trim();if(!e)return;const{usuario:i="",nombre:n=""}=p(),f=`m${Date.now()}`,$=s("#btnEnviar").prop("disabled",!0).html('<i class="fas fa-spinner fa-pulse"></i>');try{await j(b(u,"notas",f),{id:f,nota:e,email:a,usuario:n||i||a,fecha:M()}),t.val("").css("height","auto").trigger("focus"),s("#charCount").text("0/500")}catch(y){console.error("❌",y),c("Error al guardar","error")}finally{$.prop("disabled",!1).html('<i class="fas fa-paper-plane"></i>')}},J=async()=>{if(!r)return;const a=r;r=null,s("#modalEliminar").removeClass("show"),s(`.msg_item[data-id="${a}"]`).addClass("deleting");try{await N(b(u,"notas",a)),c("Nota eliminada 🗑️","success",1500)}catch(t){console.error("❌",t),s(`.msg_item[data-id="${a}"]`).removeClass("deleting"),c("Error al eliminar","error")}},g=a=>{s(".status_dot").toggleClass("active",a).toggleClass("error",!a),s(".status_text").text(a?"En vivo":"Desconectado")},h=a=>a?.length?a.map(t=>`
    <div class="msg_item" data-id="${t.id}" ${d("Click para copiar")}>
      <div class="msg_content">
        <p class="msg_texto">${L(t.nota).replace(/\n/g,"<br>")}</p>
        <div class="msg_footer">
          <span class="msg_fecha">${O(t.fecha)}</span>
          <i class="fas fa-check-double msg_check"></i>
        </div>
      </div>
      <button class="btn_delete" data-id="${t.id}" ${d("Eliminar")}>
        <i class="fas fa-trash"></i>
      </button>
    </div>`).join(""):w("fa-note-sticky","Sin notas aún","Escribe tu primera nota 👇"),w=(a,t,e)=>`
  <div class="chat_empty">
    <i class="fas ${a}"></i>
    <p>${t}</p><span>${e}</span>
  </div>`,L=a=>String(a||"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[t]),O=a=>{if(!a)return"Ahora";const t=a.toDate?.()||new Date((a.seconds||0)*1e3),e=Date.now()-t,i=~~(e/6e4),n=~~(e/36e5),l=~~(e/864e5);return i<1?"Ahora":i<60?`${i}m`:n<24?`${n}h`:l<7?`${l}d`:t.toLocaleDateString("es",{day:"2-digit",month:"short"})},F=()=>{m?.(),s(document).off(".sm"),[o,m,r]=[[],null,null]};export{F as cleanup,B as init,z as render};
