import{j as a}from"./vendor-gzd0YkcT.js";import{h as r,g as v,d as u}from"./main-CuczXLwU.js";import{db as p}from"./firebase-Lfd52dYI.js";import{e as g,f as _,u as y,q as $,c as w,w as E,g as P}from"./firebase-Cdwg_wrl.js";const h=()=>v("wiSmile");let l=[];const x=()=>{const i=h();return!i||i.rol!=="admin"?'<div class="adp_page"><div class="adp_empty"><i class="fas fa-ban"></i><p>Acceso denegado.</p></div></div>':`
  <div class="adp_page">

    <!-- HERO PRO -->
    <div class="adp_hero">
      <div class="adp_hero_left">
        <div class="adp_hero_icon"><i class="fas fa-user-shield"></i></div>
        <div class="adp_hero_txt">
          <div class="adp_badge"><i class="fas fa-key"></i> Autorización</div>
          <h1 class="adp_hero_title">Gestión de Permisos</h1>
          <p class="adp_hero_sub">Promueve usuarios a Gestores, Empresas o revoca sus accesos.</p>
        </div>
      </div>
    </div>

    <!-- BUSCADOR DIRECTO -->
    <div class="adp_finder">
      <div class="adp_finder_txt">
        <h3 class="adp_finder_tit">Buscar Usuario</h3>
        <p class="adp_finder_sub">Ingresa el ID (usuario) exacto para modificar su rol.</p>
      </div>
      <div class="adp_finder_inp_wrap">
        <input type="text" id="adp_inp_search" class="adp_finder_inp" placeholder="Ej. geluksee..." autocomplete="off">
        <button id="adp_btn_search" class="adp_finder_btn"><i class="fas fa-search"></i> Buscar</button>
      </div>
    </div>

    <!-- GRID DE PRIVILEGIADOS -->
    <h2 class="adp_sec_title"><i class="fas fa-star"></i> Cuentas Privilegiadas Actuales</h2>
    <div class="adp_grid" id="adp_grid">
      <div class="adp_empty"><i class="fas fa-spinner fa-spin"></i><p>Buscando cuentas especiales...</p></div>
    </div>

    <!-- MODALES -->
    <div id="adp_modales"></div>

  </div>`},C=async()=>{const i=h();!i||i.rol!=="admin"||(a(document).off(".adp"),await m(),a(document).on("click.adp","#adp_btn_search",async function(){const d=a("#adp_inp_search").val().trim();if(!d)return;const s=a(this).prop("disabled",!0).html('<i class="fas fa-spinner fa-spin"></i>');try{const e=await g(_(p,"smiles",d));e.exists()?f({id:e.id,...e.data()}):r("Usuario no encontrado","warning")}catch{r("Error en la búsqueda","error")}s.prop("disabled",!1).html('<i class="fas fa-search"></i> Buscar')}),a(document).on("keydown.adp","#adp_inp_search",d=>{d.key==="Enter"&&a("#adp_btn_search").click()}),a(document).on("click.adp",".adp_btn_edit",function(){const d=a(this).data("id"),s=l.find(e=>e.id===d);s&&f(s)}),a(document).on("click.adp",".adp_role_opt",function(){a(".adp_role_opt").removeClass("selected"),a(this).addClass("selected")}),a(document).on("click.adp","#adp_btn_save_rol",async function(){const d=a(this).data("id"),s=a(".adp_role_opt.selected").data("rol");if(!s||d===i.usuario&&s!=="admin"&&!confirm("¿Estás seguro de quitarte los permisos de admin a ti mismo? Cerrarás tu propia sesión."))return;const e=a(this).prop("disabled",!0).html('<i class="fas fa-spinner fa-spin"></i> Guardando...');try{if(await y(_(p,"smiles",d),{rol:s}),r(`Rol actualizado a ${s.toUpperCase()}`,"success"),n(),a("#adp_inp_search").val(""),await m(),d===i.usuario&&s!=="admin"){const o=v("wiSmile");o.rol=s,localStorage.setItem("wiSmile",JSON.stringify(o)),setTimeout(()=>location.reload(),1e3)}}catch{r("Error al guardar","error"),e.prop("disabled",!1).html("Guardar Permisos")}}),a(document).on("click.adp",".adp_modal_close, .adp_btn_cancel",n),a(document).on("click.adp",".adp_modal_bg",d=>{a(d.target).hasClass("adp_modal_bg")&&n()}))},A=()=>{a(document).off(".adp")};function n(){a("#adp_modales").html("")}async function m(){try{const i=$(w(p,"smiles"),E("rol","in",["gestor","empresa","admin"]));l=(await P(i)).docs.map(s=>({id:s.id,...s.data()})),k()}catch(i){console.error("[admin_permisos] Error VIPs:",i),a("#adp_grid").html('<div class="adp_empty"><i class="fas fa-exclamation-triangle"></i><p>Error cargando cuentas VIP.</p></div>')}}function k(){if(!l.length){a("#adp_grid").html('<div class="adp_empty"><i class="fas fa-user-shield"></i><p>No hay cuentas privilegiadas asignadas aún.</p></div>');return}const i={gestor:"#8b5cf6",empresa:"#f59e0b",admin:"#020617"},d=l.map(s=>{const e=s.rol||"smile",o=i[e]||"#38bdf8",c=s.nombres||s.nombre||s.id,t=s.email||"Sin correo registrado",b=u(c);return`
      <div class="adp_card" style="--clr:${o}">
        <div class="adp_c_rol">${e}</div>
        <div class="adp_av">${b}</div>
        <div class="adp_nom">${c}</div>
        <div class="adp_eml">${t}</div>
        <button class="adp_btn_edit" data-id="${s.id}"><i class="fas fa-sliders-h"></i> Editar Rol</button>
      </div>`}).join("");a("#adp_grid").html(d)}function f(i){const d=i.nombres||i.nombre||i.id,s=u(d),e=i.rol||"smile",c=[{id:"smile",ic:"fa-user",tit:"Estudiante",sub:"Acceso estándar. Modo práctica y lecciones.",c:"#38bdf8"},{id:"gestor",ic:"fa-chalkboard-teacher",tit:"Gestor (Profesor)",sub:"Puede crear clases y ver notas de alumnos.",c:"#8b5cf6"},{id:"empresa",ic:"fa-building",tit:"Empresa",sub:"Panel corporativo, departamentos y certificados.",c:"#f59e0b"},{id:"admin",ic:"fa-crown",tit:"Admin",sub:"Control total de la plataforma y usuarios.",c:"#020617"}].map(t=>`
    <div class="adp_role_opt ${e===t.id?"selected":""}" data-rol="${t.id}" style="--ac:${t.c}">
      <i class="fas ${t.ic}"></i>
      <b>${t.tit}</b>
      <small>${t.sub}</small>
    </div>
  `).join("");a("#adp_modales").html(`
    <div class="adp_modal_bg">
      <div class="adp_modal_card">
        <div class="adp_modal_hdr">
          <h3 class="adp_modal_title"><i class="fas fa-user-tag"></i> Asignar Permisos</h3>
          <button class="adp_modal_close"><i class="fas fa-times"></i></button>
        </div>
        <div class="adp_modal_body">
          <div class="adp_usr_preview">
            <div class="adp_av" style="width:5vh;height:5vh;margin:0;font-size:2vh">${s}</div>
            <div>
              <div style="font-weight:800;font-size:var(--fz_m1);color:var(--tx)">${d}</div>
              <div style="font-size:var(--fz_s4);color:var(--tx3)">@${i.id}</div>
            </div>
          </div>
          <div style="font-weight:700;color:var(--tx)">Selecciona el nivel de acceso:</div>
          <div class="adp_roles_grid">
            ${c}
          </div>
        </div>
        <div class="adp_modal_foot">
          <button class="adp_btn_cancel">Cancelar</button>
          <button class="adp_btn_save" id="adp_btn_save_rol" data-id="${i.id}">Guardar Permisos</button>
        </div>
      </div>
    </div>`)}export{A as cleanup,C as init,x as render};
