import{j as e}from"./vendor-gzd0YkcT.js";import{auth as l,db as b}from"./firebase-BDgw2_sS.js";import{o as g,q as w,c as $,w as y,a as k,k as C,d as j}from"./firebase-DYzFYKGm.js";import{a as A,N as f,g as D,c as T,d as u}from"./main-C2_vhC0w.js";const E=()=>new Promise(t=>{if(l.currentUser)return t(l.currentUser);const s=g(l,a=>{s(),t(a)})});let o=[],c=null;const q=()=>`
  <div class="smile_container">
    <div class="smile_header">
      <div class="header_left">
        <h1><i class="fas fa-inbox"></i> Mis mensajes</h1>
        <p id="smileUser"></p>
      </div>
      <button class="btn_actualizar" id="btnActualizar">
        <i class="fas fa-sync-alt"></i>
        <span>Actualizar</span>
      </button>
    </div>

    <div class="smile_table_wrapper">
      <table class="smile_table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Título</th>
            <th>Para</th>
            <th>Fecha</th>
            <th>Vistas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="smileTableBody">
          <tr><td colspan="6" class="loading_td"><i class="fas fa-spinner fa-pulse"></i> Cargando...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="modal_overlay" id="modalEliminar">
    <div class="modal_content">
      <div class="modal_icon"><i class="fas fa-trash-alt"></i></div>
      <h3>¿Eliminar mensaje?</h3>
      <p>Esta acción no se puede deshacer</p>
      <div class="modal_actions">
        <button class="btn_modal_cancelar" id="btnCancelar"><i class="fas fa-times"></i> Cancelar</button>
        <button class="btn_modal_eliminar" id="btnConfirmar"><i class="fas fa-trash"></i> Eliminar</button>
      </div>
    </div>
  </div>
`,L=async()=>{if(console.log(`✅ Smile de ${A}`),!await E())return f("Debes iniciar sesión","error"),window.location.hash="#/auth?mode=login";const s=D("wiSmile");e("#smileUser").html(`<i class="fas fa-user"></i> ${s?.usuario||l.currentUser.email} • ${s?.email||l.currentUser.email}`),e(document).on("click.sm","#btnActualizar",p).on("click.sm","#btnCancelar, #modalEliminar",a=>e(a.target).is("#btnCancelar, #modalEliminar")&&v()).on("click.sm","#btnConfirmar",S).on("click.sm",".btn_abrir",a=>window.open(e(a.currentTarget).data("url"),"_blank")).on("click.sm",".btn_copiar",a=>T(e(a.currentTarget).data("url"),a.currentTarget,"¡Copiado!")).on("click.sm",".btn_eliminar_msg",a=>{c=e(a.currentTarget).data("id"),e("#modalEliminar").addClass("show")}),await p()};async function p(){const t=l.currentUser?.uid;if(!t)return;const s=e("#btnActualizar");s.find("i").addClass("fa-spin").end().prop("disabled",!0),M();try{const a=w($(b,"wiLoves"),y("uid","==",t));o=(await k(a)).docs.map(i=>({id:i.id,...i.data()})),o.sort((i,n)=>{const d=i.creado?.toDate?.()||i.creado?.seconds?new Date(i.creado.seconds*1e3):new Date(i.creado||0);return(n.creado?.toDate?.()||n.creado?.seconds?new Date(n.creado.seconds*1e3):new Date(n.creado||0))-d}),_(o),console.log(`📬 ${o.length} mensajes`)}catch(a){console.error("❌",a),e("#smileTableBody").html(`
      <tr><td colspan="6" class="error_td">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Error: ${a.message}</p>
        <button class="btn_reintentar" onclick="location.reload()"><i class="fas fa-redo"></i> Reintentar</button>
      </td></tr>
    `)}finally{s.find("i").removeClass("fa-spin").end().prop("disabled",!1)}}function M(){e("#smileTableBody").html(Array(5).fill(0).map(()=>`
    <tr class="skeleton_row">
      <td><div class="sk_badge"></div></td>
      <td><div class="sk_line sk_title"></div></td>
      <td><div class="sk_line sk_text"></div></td>
      <td><div class="sk_line sk_date"></div></td>
      <td><div class="sk_line sk_vistas"></div></td>
      <td><div class="td_actions">${Array(3).fill('<div class="sk_btn"></div>').join("")}</div></td>
    </tr>
  `).join(""))}function _(t){if(!t.length)return e("#smileTableBody").html(`
      <tr><td colspan="6" class="empty_td">
        <div class="empty_icon"><i class="fas fa-inbox"></i></div>
        <h3>No tienes mensajes</h3>
        <p>Crea tu primer mensaje en <a href="#/crear">Crear mensaje</a></p>
      </td></tr>
    `);const s={amor:"fa-heart",amistad:"fa-user-friends",saludo:"fa-gift",declaracion:"fa-comment-dots",aniversario:"fa-calendar-star",carta:"fa-envelope"};e("#smileTableBody").html(t.map(a=>{const r=a.plantilla||"amor",i=s[r]||"fa-envelope",n=h(a.nombre||a.de||"Sin título"),d=h(a.para||"Alguien especial"),m=`${location.origin}/?${a.id}`;return`
      <tr data-id="${a.id}">
        <td><span class="badge_tipo ${r}"><i class="fas ${i}"></i> ${r.charAt(0).toUpperCase()+r.slice(1)}</span></td>
        <td class="td_titulo">${n}</td>
        <td class="td_para">${d}</td>
        <td class="td_fecha">${U(a.creado)}</td>
        <td class="td_vistas">${a.vistas||0}</td>
        <td>
          <div class="td_actions">
            <button class="btn_action btn_abrir" data-url="${m}" ${u("Abrir")}><i class="fas fa-external-link-alt"></i></button>
            <button class="btn_action btn_copiar" data-url="${m}" ${u("Copiar")}><i class="fas fa-link"></i></button>
            <button class="btn_action btn_eliminar_msg" data-id="${a.id}" ${u("Eliminar")}><i class="fas fa-trash-alt"></i></button>
          </div>
        </td>
      </tr>
    `}).join(""))}function v(){c=null,e("#modalEliminar").removeClass("show")}async function S(){if(!c)return;const t=c;v();try{e(`tr[data-id="${t}"]`).addClass("removing"),await C(j(b,"wiLoves",t)),setTimeout(()=>{o=o.filter(s=>s.id!==t),_(o)},300),f("Mensaje eliminado 🗑️","success")}catch(s){console.error("❌",s),e(`tr[data-id="${t}"]`).removeClass("removing"),f("Error al eliminar","error")}}const h=t=>t?String(t).replace(/[&<>"']/g,s=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"})[s]):"";function U(t){if(!t)return"Reciente";let s=t.toDate?.()||(t.seconds?new Date(t.seconds*1e3):new Date(t));if(isNaN(s.getTime()))return"Reciente";const a=new Date-s,r=Math.floor(a/6e4),i=Math.floor(a/36e5),n=Math.floor(a/864e5);return r<1?"Ahora":r<60?`${r}m`:i<24?`${i}h`:n<7?`${n}d`:n<30?`${Math.floor(n/7)} sem`:s.toLocaleDateString("es-ES",{day:"numeric",month:"short",year:"numeric"})}const R=()=>{console.log("🧹 Smile"),o=[],c=null,e(document).off(".sm")};export{R as cleanup,L as init,q as render};
