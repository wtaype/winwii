import{j as s}from"./vendor-gzd0YkcT.js";import{j as _,g as y,i as g,h as m}from"./main-BEFDoIKE.js";import{db as f}from"./firebase-BS8Opw9z.js";import{i as $,f as x,q as w,c as A,l as C,g as D}from"./firebase-CiLZDPlJ.js";const v=()=>y("wiSmile");let c=[],o="todos";const O=()=>{const t=v();return!t||t.rol!=="admin"?'<div class="adu_page"><div class="adu_empty"><i class="fas fa-ban"></i><p>Acceso denegado.</p></div></div>':`
  <div class="adu_page">

    <!-- HERO PRO -->
    <div class="adu_hero">
      <div class="adu_hero_left">
        <div class="adu_hero_icon"><i class="fas fa-users-cog"></i></div>
        <div class="adu_hero_txt">
          <div class="adu_badge"><i class="fas fa-shield-alt"></i> Seguridad Global</div>
          <h1 class="adu_hero_title">Usuarios Registrados</h1>
          <p class="adu_hero_sub">Administra todas las cuentas, empresas y gestores de la plataforma.</p>
        </div>
      </div>
      <div class="adu_hero_actions">
        <button class="adu_btn_primary" id="adu_btn_sync"><i class="fas fa-sync-alt"></i> Actualizar Base</button>
      </div>
    </div>

    <!-- CONTROLES -->
    <div class="adu_controls">
      <div class="adu_filters" id="adu_filters">
        <button class="adu_filter_btn active" data-rol="todos">Todos</button>
        <button class="adu_filter_btn" data-rol="smile">Smiles</button>
        <button class="adu_filter_btn" data-rol="gestor">Gestores</button>
        <button class="adu_filter_btn" data-rol="empresa">Empresas</button>
        <button class="adu_filter_btn" data-rol="admin">Admins</button>
      </div>
      <div class="adu_search">
        <i class="fas fa-search"></i>
        <input type="text" id="adu_input_search" placeholder="Buscar por email, usuario o nombre..." autocomplete="off">
      </div>
    </div>

    <!-- TABLA DE USUARIOS -->
    <div class="adu_table_card">
      <div class="adu_table_wrap">
        <table class="adu_table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol de Acceso</th>
              <th>Dependencia</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="adu_table_body">
            <tr><td colspan="5"><div class="adu_empty" style="padding:4vh"><i class="fas fa-spinner fa-spin"></i><p>Cargando base de datos...</p></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- MODALES -->
    <div id="adu_modales"></div>

  </div>`},j=async()=>{const t=v();!t||t.rol!=="admin"||(s(document).off(".adu"),await l(),s(document).on("input.adu","#adu_input_search",function(){n()}),s(document).on("click.adu",".adu_filter_btn",function(){s(".adu_filter_btn").removeClass("active"),s(this).addClass("active"),o=s(this).data("rol"),n()}),s(document).on("click.adu","#adu_btn_sync",async function(){const d=s(this).find("i").addClass("fa-spin");await l(!0),setTimeout(()=>d.removeClass("fa-spin"),500)}),s(document).on("click.adu",".adu_btn_ico.danger",async function(){const d=s(this).data("id");if(confirm(`¿Atención! Eliminarás a "${d}" de forma permanente. ¿Continuar?`))try{await $(x(f,"smiles",d)),_("Usuario eliminado","info"),await l(!0)}catch{_("Error al eliminar","error")}}),s(document).on("click.adu",".adu_btn_ico.view",function(){const d=s(this).data("id"),i=c.find(a=>a.id===d);i&&E(i)}),s(document).on("click.adu",".adu_modal_close, .adu_btn_cancel",()=>s("#adu_modales").html("")),s(document).on("click.adu",".adu_modal_bg",d=>{s(d.target).hasClass("adu_modal_bg")&&s("#adu_modales").html("")}))},I=()=>{s(document).off(".adu")};async function l(t=!1){try{const d=w(A(f,"smiles"),C(300));c=(await D(d)).docs.map(a=>({id:a.id,usuario:a.id,...a.data()})),n()}catch(d){console.error("[admin_usuarios] Error:",d),s("#adu_table_body").html('<tr><td colspan="5"><div class="adu_empty" style="padding:4vh"><i class="fas fa-exclamation-triangle"></i><p>Error de conexión.</p></div></td></tr>')}}function n(){const t=(s("#adu_input_search").val()||"").toLowerCase(),d=c.filter(a=>!(o!=="todos"&&(a.rol||"smile")!==o||t&&![a.id,a.email,a.nombre,a.nombres,a.apellidos].join(" ").toLowerCase().includes(t)));if(!d.length){s("#adu_table_body").html('<tr><td colspan="5"><div class="adu_empty" style="padding:4vh"><i class="fas fa-user-slash"></i><p>No se encontraron usuarios.</p></div></td></tr>');return}const i=d.map(a=>{const e=a.nombres||a.nombre||a.id,b=a.email||"—",p=g(e),r=a.rol||"smile",u=a.fecha?.toDate?m(a.fecha):"—",h=a.empresa||a.empresa_id||a.gestor||a.gestor_id||"Independiente";return`
      <tr class="adu_row">
        <td>
          <div class="adu_user_cell">
            <div class="adu_av">${p}</div>
            <div>
              <div class="adu_nom">${e}</div>
              <div class="adu_eml">${b}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="adu_role_badge ${r}"><i class="fas fa-circle" style="font-size:0.6em;margin-right:0.4vh"></i> ${r}</div>
        </td>
        <td>
          <span style="color:var(--tx3);font-weight:600"><i class="fas fa-building"></i> ${h}</span>
        </td>
        <td>
          <div class="adu_date">${u.split(",")[0]}<small>${u.split(",")[1]||""}</small></div>
        </td>
        <td>
          <div class="adu_actions">
            <button class="adu_btn_ico view" data-id="${a.id}" title="Ver detalles"><i class="fas fa-eye"></i></button>
            <button class="adu_btn_ico danger" data-id="${a.id}" title="Eliminar usuario"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`}).join("");s("#adu_table_body").html(i)}function E(t){const d=t.fecha?.toDate?m(t.fecha):"Desconocido";s("#adu_modales").html(`
    <div class="adu_modal_bg">
      <div class="adu_modal_card">
        <div class="adu_modal_hdr">
          <h3 class="adu_modal_title"><i class="fas fa-address-card"></i> Información del Usuario</h3>
          <button class="adu_modal_close"><i class="fas fa-times"></i></button>
        </div>
        <div class="adu_modal_body">
          <div class="adu_field">
            <label>Username (ID)</label>
            <input type="text" class="adu_input" value="${t.id}" disabled>
          </div>
          <div class="adu_field">
            <label>Nombres y Apellidos</label>
            <input type="text" class="adu_input" value="${t.nombres||t.nombre||""} ${t.apellidos||""}" disabled>
          </div>
          <div class="adu_field">
            <label>Correo Electrónico</label>
            <input type="text" class="adu_input" value="${t.email||"—"}" disabled>
          </div>
          <div style="display:flex;gap:2vh">
            <div class="adu_field" style="flex:1">
              <label>Rol de Acceso</label>
              <input type="text" class="adu_input" value="${t.rol||"smile"}" style="text-transform:uppercase;font-weight:bold" disabled>
            </div>
            <div class="adu_field" style="flex:1">
              <label>Fecha de Registro</label>
              <input type="text" class="adu_input" value="${d}" disabled>
            </div>
          </div>
        </div>
        <div class="adu_modal_foot">
          <button class="adu_btn_cancel">Cerrar panel</button>
        </div>
      </div>
    </div>`)}export{I as cleanup,j as init,O as render};
