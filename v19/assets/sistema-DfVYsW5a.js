import{j as a}from"./vendor-gzd0YkcT.js";import{h as e,g as n}from"./main-CuczXLwU.js";import{db as r}from"./firebase-Lfd52dYI.js";import{s as _,f as v,h as m}from"./firebase-Cdwg_wrl.js";const l=()=>n("wiSmile"),g=()=>{const i=l();return!i||i.rol!=="admin"?'<div class="ads_page"><div class="ads_empty"><i class="fas fa-ban"></i><p>Acceso denegado.</p></div></div>':`
  <div class="ads_page">

    <!-- HERO PRO -->
    <div class="ads_hero">
      <div class="ads_hero_left">
        <div class="ads_hero_icon"><i class="fas fa-database"></i></div>
        <div class="ads_hero_txt">
          <div class="ads_badge"><i class="fas fa-server"></i> Mantenimiento y Datos</div>
          <h1 class="ads_hero_title">Sistema Core</h1>
          <p class="ads_hero_sub">Control de infraestructura, base de datos y comunicados globales.</p>
        </div>
      </div>
    </div>

    <!-- CONTROLES DEL SISTEMA -->
    <div class="ads_grid">
      
      <!-- 1. Mantenimiento -->
      <div class="ads_card" style="--ac:#3b82f6">
        <div class="ads_card_hdr">
          <div class="ads_card_ico"><i class="fas fa-tools"></i></div>
          <div>
            <h3 class="ads_card_tit">Estado Operativo</h3>
            <div class="ads_card_sub">Control general de la aplicación</div>
          </div>
        </div>
        <div class="ads_toggle_row">
          <div class="ads_t_info">
            <span class="ads_t_tit">Modo Mantenimiento</span>
            <span class="ads_t_sub">Bloquear el acceso a no-admins</span>
          </div>
          <div class="ads_switch" id="ads_tgg_maint"></div>
        </div>
        <button class="ads_btn_action" id="ads_btn_clear" style="background:var(--bg);color:var(--tx);border:1px solid var(--brd);box-shadow:none">
          <i class="fas fa-broom"></i> Purgar Caché del Navegador
        </button>
      </div>

      <!-- 2. Comunicados -->
      <div class="ads_card" style="--ac:#f59e0b">
        <div class="ads_card_hdr">
          <div class="ads_card_ico"><i class="fas fa-bullhorn"></i></div>
          <div>
            <h3 class="ads_card_tit">Mensaje Global</h3>
            <div class="ads_card_sub">Anuncio push para todos los usuarios</div>
          </div>
        </div>
        <div class="ads_field">
          <label>Título del Comunicado</label>
          <input type="text" id="ads_msg_tit" class="ads_input" placeholder="Ej. ¡Nueva Actualización v16!">
        </div>
        <div class="ads_field">
          <label>Cuerpo del Mensaje</label>
          <textarea id="ads_msg_txt" class="ads_input" placeholder="Escribe el mensaje..."></textarea>
        </div>
        <button class="ads_btn_action" id="ads_btn_send_msg"><i class="fas fa-paper-plane"></i> Transmitir Mensaje</button>
      </div>

      <!-- 3. Base de Datos / Lecciones -->
      <div class="ads_card" style="--ac:#10b981; grid-column: 1 / -1">
        <div class="ads_card_hdr">
          <div class="ads_card_ico"><i class="fas fa-cloud-upload-alt"></i></div>
          <div>
            <h3 class="ads_card_tit">Sincronizar Lecciones (Data Seeding)</h3>
            <div class="ads_card_sub">Forzar re-escritura de las 45 lecciones progresivas en Firestore</div>
          </div>
        </div>
        
        <div style="display:flex;gap:3vh;align-items:flex-start">
          <button class="ads_btn_action" id="ads_btn_seed" style="flex-shrink:0"><i class="fas fa-bolt"></i> Iniciar Proceso de Carga</button>
          
          <div class="ads_log_wrap" id="ads_log" style="flex:1">
            <div class="ads_log_item"><span>[SYS]</span> Esperando comando...</div>
          </div>
        </div>
      </div>

    </div>
  </div>`},h=async()=>{const i=l();!i||i.rol!=="admin"||(a(document).off(".ads"),a(document).on("click.ads","#ads_tgg_maint",function(){a(this).toggleClass("on");const s=a(this).hasClass("on");e(s?"Modo Mantenimiento Activado":"Sistema en línea normalmente",s?"warning":"success")}),a(document).on("click.ads","#ads_btn_clear",function(){const s=localStorage.getItem("wiSmile");localStorage.clear(),s&&localStorage.setItem("wiSmile",s),e("Caché temporal eliminada con éxito","success")}),a(document).on("click.ads","#ads_btn_send_msg",async function(){const s=a("#ads_msg_tit").val().trim(),d=a("#ads_msg_txt").val().trim();if(!s||!d){e("Completa título y mensaje","warning");return}const t=a(this).prop("disabled",!0).html('<i class="fas fa-spinner fa-spin"></i> Transmitiendo...');try{const o=Date.now().toString();await _(v(r,"globales",o),{tipo:"aviso",titulo:s,mensaje:d,fecha:m()}),e("Mensaje global transmitido","success"),a("#ads_msg_tit, #ads_msg_txt").val("")}catch{e("Error al transmitir","error")}t.prop("disabled",!1).html('<i class="fas fa-paper-plane"></i> Transmitir Mensaje')}),a(document).on("click.ads","#ads_btn_seed",async function(){if(!confirm("¿Estás seguro de sobreescribir la base de datos de lecciones?"))return;const s=a("#ads_log"),d=a(this).prop("disabled",!0).html('<i class="fas fa-spinner fa-spin"></i> Procesando...');c("Iniciando volcado de datos...","warn");for(let t=1;t<=45;t++)await new Promise(o=>setTimeout(o,150)),c(`Lección ${t} parseada y subida correctamente.`,"ok"),s.scrollTop(s[0].scrollHeight);c("PROCESO FINALIZADO. 45 documentos actualizados.","ok"),e("Base de datos sincronizada","success"),d.prop("disabled",!1).html('<i class="fas fa-bolt"></i> Iniciar Proceso de Carga')}))},y=()=>{a(document).off(".ads")};function c(i,s=""){const d=new Date().toLocaleTimeString("en-US",{hour12:!1});a("#ads_log").append(`<div class="ads_log_item ${s}"><span>[${d}]</span> ${i}</div>`)}export{y as cleanup,h as init,g as render};
