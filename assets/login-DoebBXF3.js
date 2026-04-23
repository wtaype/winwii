import{j as i}from"./vendor-gzd0YkcT.js";import{auth as c,db as d}from"./firebase-BS8Opw9z.js";import{m as _,e as h,f as m,g as j,q as M,w as S,c as I,s as E,h as x,n as O,p as D,r as V,t as W,v as q}from"./firebase-CiLZDPlJ.js";import{k as p,r as R,t as z,c as n,g as B,s as H,M as g,o as k,x as Q}from"./main-BEFDoIKE.js";let X="si";const U={smile:"/smile",gestor:"/gestor",empresa:"/empresa",admin:"/admin"},Y={"auth/email-already-in-use":"Email ya registrado","auth/weak-password":"Contraseña débil (mín. 6)","auth/invalid-credential":"Contraseña incorrecta","auth/invalid-email":"Email no válido","auth/missing-email":"Usuario no registrado","auth/too-many-requests":"Demasiados intentos"},C={regEmail:[a=>a.toLowerCase().trim(),a=>/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(a)||"Email inválido"],regUsuario:[a=>a.toLowerCase().replace(/[^a-z0-9_]/g,"").trim(),a=>a.length>=4||"Mínimo 4 caracteres"],regNombre:[a=>a.trim(),a=>a.length>0||"Ingresa tu nombre"],regApellidos:[a=>a.trim(),a=>a.length>0||"Ingresa tus apellidos"],regPassword:[a=>a,a=>a.length>=6||"Mínimo 6 caracteres"],regPassword1:[a=>a,a=>a===i("#regPassword").val()||"No coinciden"]},o=(a,e,t,r,s=!1)=>`<div class="wilg_grupo"><i class="fas fa-${a}"></i><input type="${e}" id="${t}" placeholder="${r}" autocomplete="off">${s?'<i class="fas fa-eye wilg_ojo"></i>':""}</div>`,P=(a="smile")=>a==="smile"?`
    <div class="wilg_rol_extra" id="rolExtra">
      <div class="wilg_extra_label"><i class="fas fa-users"></i> ¿Tienes un código de clase?</div>
      <div class="wilg_extra_opts">
        <label class="wilg_extra_opt active" data-opt="personal">
          <input type="radio" name="regExtra" value="personal" checked>
          <i class="fas fa-user"></i> Personal
        </label>
        <label class="wilg_extra_opt" data-opt="clase">
          <input type="radio" name="regExtra" value="clase">
          <i class="fas fa-users"></i> Unirme a clase
        </label>
      </div>
      <div class="wilg_extra_field hidden" id="extraField">
        ${o("key","text","regCodigo","Código de clase (ej: ABC123)")}
      </div>
    </div>`:a==="gestor"?`
    <div class="wilg_rol_extra" id="rolExtra">
      <div class="wilg_extra_label"><i class="fas fa-chalkboard-teacher"></i> ¿Cómo quieres empezar?</div>
      <div class="wilg_extra_opts">
        <label class="wilg_extra_opt active" data-opt="crear">
          <input type="radio" name="regExtra" value="crear" checked>
          <i class="fas fa-plus-circle"></i> Crear mi grupo
        </label>
        <label class="wilg_extra_opt" data-opt="unir">
          <input type="radio" name="regExtra" value="unir">
          <i class="fas fa-building"></i> Unirme a empresa
        </label>
      </div>
      <div class="wilg_extra_field hidden" id="extraField">
        ${o("building","text","regRuc","RUC de la empresa")}
      </div>
      <div class="wilg_info_badge"><i class="fas fa-info-circle"></i> Tu cuenta de gestor será activada por el administrador.</div>
    </div>`:a==="empresa"?`
    <div class="wilg_rol_extra" id="rolExtra">
      <div class="wilg_extra_label"><i class="fas fa-building"></i> Datos de tu empresa</div>
      <div class="wilg_extra_field wilg_extra_2col" id="extraField">
        ${o("id-card","text","regRuc","RUC (11 dígitos)")}
        ${o("building","text","regEmpresaNombre","Nombre de la empresa")}
      </div>
      <div class="wilg_info_badge"><i class="fas fa-info-circle"></i> Tu cuenta empresarial será verificada y activada en 24h.</div>
    </div>`:"",b={login:()=>`
    <div class="wilg_head">
      <div class="wilg_logo"><img src="./smile.avif" alt="TypingWii"></div>
      <h2>Bienvenido</h2><p>Inicia sesión en tu cuenta</p>
    </div>
    ${o("envelope","text","email","Email o usuario")}
    ${o("lock","password","password","Contraseña",!0)}
    <button type="button" id="Login" class="wilg_btn inactivo"><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</button>
    <div class="wilg_links">
      <span class="wilg_rec"><i class="fas fa-key"></i> ¿Olvidaste tu contraseña?</span>
      <span class="wilg_reg">Crear cuenta <i class="fas fa-arrow-right"></i></span>
    </div>`,registrar:()=>`
    <div class="wilg_head">
      <div class="wilg_logo"><img src="./smile.avif" alt="TypingWii"></div>
      <h2>Crear Cuenta</h2><p>Únete a la comunidad</p>
    </div>
    <div class="wilg_grid">
      ${[["envelope","email","regEmail","Email"],["user","text","regUsuario","Usuario"],["user-tie","text","regNombre","Nombre"],["user-tie","text","regApellidos","Apellidos"]].map(([a,e,t,r])=>o(a,e,t,r)).join("")}
      ${o("lock","password","regPassword","Contraseña",!0)}
      ${o("lock","password","regPassword1","Confirmar contraseña",!0)}
    </div>

    <!-- ── SELECTOR DE ROL ─────────────────── -->
    <div class="wilg_rol_selector">
      <div class="wilg_rol_label"><i class="fas fa-id-badge"></i> Tipo de cuenta</div>
      <div class="wilg_rol_tabs">
        <button type="button" class="wilg_rol_tab active" data-rol="smile">
          <i class="fas fa-graduation-cap"></i>
          <span>Estudiante</span>
        </button>
        <button type="button" class="wilg_rol_tab" data-rol="gestor">
          <i class="fas fa-chalkboard-teacher"></i>
          <span>Profesor</span>
        </button>
        <button type="button" class="wilg_rol_tab" data-rol="empresa">
          <i class="fas fa-building"></i>
          <span>Empresa</span>
        </button>
      </div>
    </div>
    ${P("smile")}
    <!-- ─────────────────────────────────────── -->

    <div class="wilg_check">
      <label><input type="checkbox" id="regTerminos">
      <span>Acepto los <a href="/terminos.html" target="_blank">términos y condiciones</a></span></label>
    </div>
    <button type="button" id="Registrar" class="wilg_btn inactivo"><i class="fas fa-user-plus"></i> Registrarme</button>
    <div class="wilg_links"><span class="wilg_log"><i class="fas fa-arrow-left"></i> Ya tengo cuenta</span></div>`,restablecer:()=>`
    <div class="wilg_head">
      <div class="wilg_logo wilg_logo_sm"><img src="./smile.avif" alt="TypingWii"></div>
      <h2>Recuperar</h2><p>Te enviaremos un enlace a tu email</p>
    </div>
    ${o("envelope","text","recEmail","Email o usuario")}
    <button type="button" id="Recuperar" class="wilg_btn"><i class="fas fa-paper-plane"></i> Enviar enlace</button>
    <div class="wilg_links"><span class="wilg_log"><i class="fas fa-arrow-left"></i> Volver</span></div>`},Z=(a,e="")=>`<div id="wilg_modal" class="wiModal wilg_mod ${e}"><div class="modalBody"><button class="modalX">&times;</button>
   <form id="liForm">${b[a]()}</form></div></div>`,G=(a="login")=>{i("#wilg_modal").remove();const e=a==="registrar"?"wilg_mod_reg":"";i("body").append(Z(a,e)),setTimeout(()=>{z("wilg_modal"),i("#liForm input:first").focus()},50)},J=a=>{const e=a==="registrar"?"wilg_mod_reg":"";i("#wilg_modal").toggleClass("wilg_mod_reg",e==="wilg_mod_reg"),i("#liForm").html(b[a]()).attr("data-vista",a),setTimeout(()=>i("#liForm input:first").focus(),30)},la=()=>p.user?"":'<div class="wilg_wrap"><div class="wilg_card"><form id="liForm"></form></div></div>',oa=()=>{const a=p.user;if(a){setTimeout(()=>R.navigate(U[a.rol]||"/"),0);return}F("login")},F=a=>{i("#liForm").html(b[a]()).attr("data-vista",a),setTimeout(()=>i("#liForm input:first").focus(),30)},l=a=>i(`#${a}`).val().trim(),A=()=>i("#wilg_modal.active").length>0,u=a=>A()?J(a):F(a),v=async(a,e,t)=>{k(a,!0,e);try{await t()}catch(r){g(Y[r.code]||r.message,"error")}finally{k(a,!1)}},T=async a=>{if(a.includes("@"))return{email:a,wi:null};const e=await h(m(d,"smiles",a));if(!e.exists())throw new Error("Usuario no encontrado");return{email:e.data().email,wi:e.data()}},K=a=>{if(!a)return;const[e,t]=a.split("|");document.documentElement.dataset.theme=e,i('meta[name="theme-color"]').attr("content",t),i(".tema").removeClass("mtha").filter(`[data-ths="${a}"]`).addClass("mtha")},aa=a=>{const e=U[a?.rol]||"/";R.navigate(e)},$=a=>{p.login(a,7),a?.tema&&(localStorage.wiTema=a.tema,K(a.tema)),A()&&Q(),aa(a)};i(document).on("submit.wi","#liForm",a=>a.preventDefault()).on("click.wi",".wilg_ojo",function(){const a=i(this).siblings("input");a.attr("type",a.attr("type")==="password"?"text":"password"),i(this).toggleClass("fa-eye fa-eye-slash")}).on("input.wi","#email,#recEmail,#regEmail,#regUsuario",function(){i(this).val(i(this).val().toLowerCase())}).on("click.wi",".wilg_reg",()=>{u("registrar")}).on("click.wi",".wilg_rec",()=>{u("restablecer")}).on("click.wi",".wilg_log",()=>u("login")).on("input.wi keyup.wi","#password",a=>{i("#Login").removeClass("inactivo"),a.key==="Enter"&&i("#Login").click()}).on("input.wi keyup.wi","#regPassword1",a=>{i("#Registrar").removeClass("inactivo"),a.key==="Enter"&&i("#Registrar").click()}).on("input.wi keyup.wi","#recEmail",a=>{a.key==="Enter"&&i("#Recuperar").trigger("click")}).on("blur.wi",Object.keys(C).map(a=>`#${a}`).join(","),function(){const a=i(this).val();if(!a)return;const[e,t]=C[this.id],r=e(a);i(this).val(r);const s=t(r);s!==!0&&n(this,s,"error",2500)}).on("blur.wi","#regUsuario",async function(){const a=l("regUsuario");if(!a||a.length<3)return;if(a.includes("@"))return i(this).data("ok",!1),n(this,"No puede contener @","error",2500);const e=!(await h(m(d,"smiles",a))).exists();i(this).data("ok",e),n(this,`Usuario ${e?'disponible <i class="fa-solid fa-check-circle"></i>':'no disponible <i class="fa-solid fa-times-circle"></i>'}`,e?"success":"error",3e3)}).on("blur.wi","#regEmail",async function(){const a=l("regEmail");if(!a||!a.includes("@"))return;const e=(await j(M(I(d,"smiles"),S("email","==",a)))).empty;i(this).data("ok",e),n(this,`Email ${e?'disponible <i class="fa-solid fa-check-circle"></i>':'no disponible <i class="fa-solid fa-times-circle"></i>'}`,e?"success":"error",3e3)}).on("click.wi",".wilg_rol_tab",function(){const a=i(this).data("rol");i(".wilg_rol_tab").removeClass("active"),i(this).addClass("active"),i("#rolExtra").replaceWith(P(a)),ia()}).on("change.wi",'input[name="regExtra"]',function(){const a=i(this).val();i(".wilg_extra_opt").removeClass("active"),i(this).closest(".wilg_extra_opt").addClass("active");const e=i("#extraField");a==="personal"||a==="crear"?e.addClass("hidden"):(e.removeClass("hidden"),e.find("input:first").focus())}).on("click.wi","#Login",async function(){await v(this,"Iniciando",async()=>{const a=l("email"),e=l("password"),{email:t,wi:r}=await T(a);await O(c,t,e);const s=r??(await h(m(d,"smiles",c.currentUser.displayName||a))).data();if(s.status==="pendiente")throw await _(c),new Error("Tu cuenta está pendiente de activación. Te notificaremos por email.");$(s)})}).on("click.wi","#Registrar",async function(){if(i(this).data("busy"))return;const a=i(".wilg_rol_tab.active").data("rol")||"smile",e=i('input[name="regExtra"]:checked').val()||"personal",t=[[!i("#regTerminos").is(":checked"),"#regTerminos","Acepta los términos"],[!i("#regUsuario").data("ok"),"#regUsuario","Verifica el usuario"],[!i("#regEmail").data("ok"),"#regEmail","Verifica el email"]];if(a==="empresa"){const s=l("regRuc");if(!/^\d{11}$/.test(s))return n(i("#regRuc")[0],"El RUC debe tener 11 dígitos","error",2500)}const r=t.find(([s])=>s);if(r)return n(i(r[1])[0],r[2],"error",2500);i(this).data("busy",!0),await v(this,"Registrando",async()=>{const s={email:l("regEmail"),usuario:l("regUsuario"),nombre:l("regNombre"),apellidos:l("regApellidos"),password:l("regPassword")},{user:w}=await D(c,s.email,s.password);await Promise.all([V(w,{displayName:s.usuario}),W(w)]);const f=a==="gestor"||a==="empresa",L=f?a:"smile",N=f?"pendiente":"activo",y={usuario:s.usuario,email:s.email,nombre:s.nombre,apellidos:s.apellidos,rol:L,status:N,uid:w.uid,terminos:!0,tema:localStorage.wiTema||"Cielo|#0EBEFF",...a==="empresa"&&{ruc:l("regRuc"),empresaNombre:l("regEmpresaNombre")},...a==="gestor"&&e==="unir"&&{empresaRuc:l("regRuc")},...a==="smile"&&e==="clase"&&{claseIdSolicitud:l("regCodigo")}};await E(m(d,"smiles",s.usuario),{...y,creado:x()}),f?(await _(c),g('<i class="fa-solid fa-clock"></i> Registro enviado. Tu cuenta será activada pronto.',"success"),setTimeout(()=>u("login"),2500)):($(y),g('<i class="fa-solid fa-check-circle"></i> ¡Cuenta creada! Verifica tu email',"success"))}),i(this).data("busy",!1)}).on("click.wi","#Recuperar",async function(){const a=l("recEmail");if(!a)return n(this,"Ingresa tu email o usuario","error",2500);await v(this,"Enviando",async()=>{const{email:e}=await T(a);await q(c,e),g('<i class="fa-solid fa-check-circle"></i> Email enviado, revisa tu bandeja',"success"),setTimeout(()=>u("login"),2e3)})}).on("click.wi",".tema",async function(){const a=B("wiSmile");a?.usuario&&setTimeout(async()=>{const e=localStorage.wiTema;if(e)try{await E(m(d,"smiles",a.usuario),{tema:e,actualizado:x()},{merge:!0}),H("wiSmile",{...a,tema:e},7),g(`Tema ${e.split("|")[0]} guardado <i class="fas fa-check-circle"></i>`,"success")}catch(t){console.error("tema:",t)}},0)});function ia(){const a=i('input[name="regExtra"]:checked').val();(a==="personal"||a==="crear")&&i("#extraField").addClass("hidden")}const na=(a="login")=>{G(a==="registrar"&&X==="si"?"registrar":"login")},ca=async(a=[])=>{try{await _(c)}catch(e){console.error("signOut:",e)}p.logout(a)},da=()=>{i(document).off(".wi")};export{na as abrirLogin,c as auth,da as cleanup,oa as init,la as render,ca as salir,_ as signOut};
