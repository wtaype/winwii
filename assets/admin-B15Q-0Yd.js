import{j as s}from"./vendor-gzd0YkcT.js";import{db as g}from"./firebase-BbiX5iLQ.js";import{c as b,d,q as m,w as v}from"./firebase-Cdwg_wrl.js";import{a as h,g as i,s as l,h as f}from"./main-CEDqlAXn.js";const u=()=>i("wiSmile"),n="amUsersTotal",r="amUsersPro",_="amOrgsTotal",k="amLessonsTotal",C=()=>{const a=u();return!a||a.rol!=="admin"?'<div class="am_page"><div class="am_empty"><i class="fas fa-ban"></i> Acceso denegado.</div></div>':`
  <div class="am_page">
    
    <!-- ══ COMPACT HERO ══ -->
    <div class="am_hero">
      <div class="am_hero_left">
        <div class="am_hero_icon"><i class="fas fa-globe-americas"></i></div>
        <div class="am_hero_txt">
          <div class="am_badge"><i class="fas fa-chart-line"></i> Dashboard Global</div>
          <h1 class="am_hero_title">Centro de Control</h1>
          <p class="am_hero_sub">Administración maestra de la infraestructura ${h}.</p>
        </div>
      </div>
      <div>
        <button class="am_btn_sync" id="am_btn_refresh">
          <i class="fas fa-sync-alt"></i> Sincronizar Data
        </button>
      </div>
    </div>

    <!-- ══ MASTER KPIs ══ -->
    <div class="am_grid_4">
      <div class="am_kpi" style="--c:#38bdf8">
        <div class="am_kpi_head">
          <div class="am_ki_ico"><i class="fas fa-users"></i></div>
          <span class="am_ki_label">Usuarios</span>
        </div>
        <div class="am_ki_val" id="am_n_total">—</div>
        <div class="am_ki_trend"><i class="fas fa-arrow-up"></i> Cuentas totales</div>
      </div>

      <div class="am_kpi" style="--c:#8b5cf6">
        <div class="am_kpi_head">
          <div class="am_ki_ico"><i class="fas fa-star"></i></div>
          <span class="am_ki_label">Suscripciones</span>
        </div>
        <div class="am_ki_val" id="am_n_pro">—</div>
        <div class="am_ki_trend"><i class="fas fa-check-circle"></i> Gestores / Empresas</div>
      </div>

      <div class="am_kpi" style="--c:#f59e0b">
        <div class="am_kpi_head">
          <div class="am_ki_ico"><i class="fas fa-building"></i></div>
          <span class="am_ki_label">Empresas B2B</span>
        </div>
        <div class="am_ki_val" id="am_n_org">—</div>
        <div class="am_ki_trend"><i class="fas fa-briefcase"></i> Organizaciones activas</div>
      </div>

      <div class="am_kpi" style="--c:#10b981">
        <div class="am_kpi_head">
          <div class="am_ki_ico"><i class="fas fa-book-open"></i></div>
          <span class="am_ki_label">Lecciones</span>
        </div>
        <div class="am_ki_val" id="am_n_les">—</div>
        <div class="am_ki_trend"><i class="fas fa-layer-group"></i> Nivel base de la app</div>
      </div>
    </div>

    <!-- ══ ACCIONES MAESTRAS ══ -->
    <div class="am_sec_header">
      <i class="fas fa-cogs"></i>
      <h2 class="am_sec_h2">Módulos Administrativos</h2>
    </div>

    <div class="am_actions_grid">
      <!-- Módulo Usuarios -->
      <a href="/usuarios" class="am_act_card nv_item" data-page="usuarios">
        <div class="am_act_ico" style="--c:#38bdf8"><i class="fas fa-users-cog"></i></div>
        <div class="am_act_info">
          <strong>Usuarios Globales</strong>
          <span>Moderación y perfiles de base de datos</span>
        </div>
      </a>

      <!-- Módulo Permisos -->
      <a href="/permisos" class="am_act_card nv_item" data-page="permisos">
        <div class="am_act_ico" style="--c:#8b5cf6"><i class="fas fa-user-shield"></i></div>
        <div class="am_act_info">
          <strong>Permisos y Roles</strong>
          <span>Asignación de privilegios VIP</span>
        </div>
      </a>

      <!-- Módulo Sistema -->
      <a href="/sistema" class="am_act_card nv_item" data-page="sistema">
        <div class="am_act_ico" style="--c:#10b981"><i class="fas fa-database"></i></div>
        <div class="am_act_info">
          <strong>Sistema y Data</strong>
          <span>Mantenimiento y comunicados</span>
        </div>
      </a>
    </div>

  </div>`},E=async()=>{const a=u();!a||a.rol!=="admin"||(s(document).off(".am"),y(),p(),s(document).on("click.am","#am_btn_refresh",function(){const c=s(this).find("i").addClass("fa-spin");p(!0).then(()=>{setTimeout(()=>c.removeClass("fa-spin"),500)})}))},P=()=>{s(document).off(".am")};function y(){s("#am_n_total").text(i(n)||"—"),s("#am_n_pro").text(i(r)||"—"),s("#am_n_org").text(i(_)||"—"),s("#am_n_les").text(i(k)||"45")}async function p(a=!1){try{const c=b(g,"smiles");if(a||!i(n)){const o=(await d(c)).data().count;l(n,o),s("#am_n_total").text(o)}if(a||!i(r)){const e=m(c,v("rol","in",["gestor","empresa","admin"])),t=(await d(e)).data().count;l(r,t),s("#am_n_pro").text(t)}if(a||!i(_)){const e=m(c,v("rol","==","empresa")),t=(await d(e)).data().count;l(_,t),s("#am_n_org").text(t)}a&&f("Estadísticas sincronizadas","success")}catch(c){console.error("[Admin] Error cargando stats:",c),a&&f("Error sincronizando","error")}}export{P as cleanup,E as init,C as render};
