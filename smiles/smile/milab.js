import './milab.css';
import $ from 'jquery';

// ══ wiVista v10 — ACTUAL (copia exacta de widev.js) ═════
const wiVistav10 = (sel, fn, opts = {}) => {
  const { stagger = 0, anim = '', threshold = 0.1, once = true } = opts;
  const els = [...document.querySelectorAll(sel)];
  if (!els.length) return;
  anim && els.forEach(el => el.classList.add(anim));
  const obs = new IntersectionObserver(es => es.filter(e => e.isIntersecting).forEach(e => {
    const i = els.indexOf(e.target);
    setTimeout(() => { anim && e.target.classList.add('wi_visible'); fn?.(e.target, i); }, stagger * i);
    once && obs.unobserve(e.target);
  }), { rootMargin: '20px', threshold });
  els.forEach(el => obs.observe(el));
};wiVistav10.v = '10.1';

// ══ wiVista v11 — NUEVO ══════════════════════════════════
const wiVistav11 = (sel, fn, opts = {}) => {
  const {
    stagger = 0, anim = '', threshold = 0.1, once = true,
    root   = null,
    onExit = null,
    delay  = 0,
  } = opts;
  const els = [...document.querySelectorAll(sel)];
  if (!els.length) return null;
  anim && els.forEach(el => el.classList.add(anim));
  const obs = new IntersectionObserver(es => es.forEach(e => {
    const i = els.indexOf(e.target);
    if (e.isIntersecting) {
      setTimeout(() => { anim && e.target.classList.add('wi_visible'); fn?.(e.target, i); }, delay + stagger * i);
      once && obs.unobserve(e.target);
    } else {
      onExit?.(e.target, i);
    }
  }), { rootMargin: '20px', threshold, root });
  els.forEach(el => obs.observe(el));
  return obs;
};wiVistav11.v = '11.0';

// ══ RENDER ══════════════════════════════════════════════
export const render = () => `
<div class="mlab_wrap">

  <div class="mlab_hero">
    <span class="mlab_tag"><i class="fas fa-flask"></i> Mi Lab</span>
    <h1 class="mlab_title">wiVista <span class="mlab_grad">v10 → v11</span></h1>
    <p class="mlab_sub">Playground · prueba aquí antes de subir a widev.js</p>
  </div>

  <div class="mlab_compare">

    <!-- ── PANEL v10 ────────────────────────────────── -->
    <div class="mlab_panel">
      <div class="mlab_panel_head mlab_head_10">
        <div class="mlab_ver_chip">v10.1</div>
        <h2>Actual <small>— en producción</small></h2>
      </div>

      <div class="mlab_section">
        <h3 class="mlab_sec_tit"><i class="fas fa-layer-group"></i> Stagger fadeUp</h3>
        <p class="mlab_sec_sub"><code>anim:'wi_fadeUp'</code> · <code>stagger:120</code></p>
        <div class="mlab_demo" id="d10_stagger">
          <div class="mlab_card">Card A</div>
          <div class="mlab_card">Card B</div>
          <div class="mlab_card">Card C</div>
        </div>
      </div>

      <div class="mlab_section">
        <h3 class="mlab_sec_tit"><i class="fas fa-calculator"></i> Callback · dispara 1 vez</h3>
        <p class="mlab_sec_sub"><code>once:true</code> · fn se llama al entrar · nunca más</p>
        <div class="mlab_counter" id="d10_cnt">
          <span class="mlab_num" id="cnt10" data-target="100">0</span>
          <span class="mlab_cnt_lbl">se ejecutó <strong>1 vez</strong> · ya no repite</span>
        </div>
      </div>

      <div class="mlab_section">
        <h3 class="mlab_sec_tit"><i class="fas fa-triangle-exclamation"></i> Limitaciones</h3>
        <ul class="mlab_list">
          <li class="mlab_bad"><i class="fas fa-xmark"></i> Retorna <code>undefined</code> — sin control externo</li>
          <li class="mlab_bad"><i class="fas fa-xmark"></i> Sin callback al salir del viewport</li>
          <li class="mlab_bad"><i class="fas fa-xmark"></i> Sin root container personalizado</li>
          <li class="mlab_bad"><i class="fas fa-xmark"></i> Sin delay global pre-stagger</li>
        </ul>
      </div>
    </div>

    <!-- ── PANEL v11 ────────────────────────────────── -->
    <div class="mlab_panel">
      <div class="mlab_panel_head mlab_head_11">
        <div class="mlab_ver_chip mlab_chip_new">v11.0</div>
        <h2>Nuevo <small>— en pruebas</small></h2>
      </div>

      <div class="mlab_section">
        <h3 class="mlab_sec_tit"><i class="fas fa-layer-group"></i> Stagger fadeUp</h3>
        <p class="mlab_sec_sub">API idéntica — <span class="mlab_ok"><i class="fas fa-check"></i> 100% compatible</span></p>
        <div class="mlab_demo" id="d11_stagger">
          <div class="mlab_card">Card A</div>
          <div class="mlab_card">Card B</div>
          <div class="mlab_card">Card C</div>
        </div>
      </div>

      <div class="mlab_section">
        <h3 class="mlab_sec_tit"><i class="fas fa-rotate"></i> onExit · re-entrada real <span class="mlab_new">NUEVO</span></h3>
        <p class="mlab_sec_sub"><code>once:false</code> + <code>onExit</code> · scroll fuera y vuelve a entrar</p>
        <div class="mlab_demo" id="d11_exit">
          <div class="mlab_card mlab_card_exit">
            <i class="fas fa-sync-alt"></i>
            <span>Anima cada vez que entra al viewport</span>
            <span class="mlab_entry_cnt" id="entry_cnt">×0</span>
          </div>
        </div>
      </div>

      <div class="mlab_section">
        <h3 class="mlab_sec_tit"><i class="fas fa-plug-circle-xmark"></i> Retorna Observer <span class="mlab_new">NUEVO</span></h3>
        <p class="mlab_sec_sub">Guarda la ref · llama <code>.disconnect()</code> para parar</p>
        <div class="mlab_demo" id="d11_obs">
          <div class="mlab_card">
            <i class="fas fa-eye"></i>
            <span>Scroll fuera y vuelve · desconectar lo detiene</span>
            <span class="mlab_obs_status" id="obs_status"><i class="fas fa-circle"></i> activo</span>
          </div>
        </div>
        <button class="mlab_btn_disc" id="btn_disc">
          <i class="fas fa-plug-circle-xmark"></i> Desconectar Observer
        </button>
      </div>

      <div class="mlab_section">
        <h3 class="mlab_sec_tit"><i class="fas fa-clock"></i> Delay global <span class="mlab_new">NUEVO</span></h3>
        <p class="mlab_sec_sub"><code>delay:600</code> — espera antes de iniciar el stagger</p>
        <div class="mlab_demo" id="d11_delay">
          <div class="mlab_card"><i class="fas fa-hourglass-start mlab_ico_a"></i> +600ms · A</div>
          <div class="mlab_card"><i class="fas fa-hourglass-half  mlab_ico_b"></i> +750ms · B</div>
          <div class="mlab_card"><i class="fas fa-hourglass-end   mlab_ico_c"></i> +900ms · C</div>
        </div>
      </div>

      <div class="mlab_section">
        <h3 class="mlab_sec_tit"><i class="fas fa-list-check"></i> Novedades v11</h3>
        <ul class="mlab_list">
          <li class="mlab_good"><i class="fas fa-plus"></i> Retorna <code>IntersectionObserver</code> — control total</li>
          <li class="mlab_good"><i class="fas fa-plus"></i> <code>onExit(el, i)</code> — callback al salir</li>
          <li class="mlab_good"><i class="fas fa-plus"></i> <code>root</code> — scroll container personalizado</li>
          <li class="mlab_good"><i class="fas fa-plus"></i> <code>delay</code> — ms offset antes del primer stagger</li>
        </ul>
      </div>
    </div>

  </div>

  <!-- ── TABLA DIFERENCIAS ─────────────────────────── -->
  <div class="mlab_diff_wrap">
    <div class="mlab_diff_head">
      <i class="fas fa-table-columns"></i> Diferencias completas v10 → v11
    </div>
    <table class="mlab_diff_table">
      <thead>
        <tr>
          <th class="mlab_th_feat">Característica</th>
          <th class="mlab_th_old"><span class="mlab_ver_chip" style="font-size:var(--fz_s2)">v10.1</span> Actual</th>
          <th class="mlab_th_new"><span class="mlab_ver_chip mlab_chip_new" style="font-size:var(--fz_s2)">v11.0</span> Nuevo</th>
          <th class="mlab_th_impact">Impacto</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Valor de retorno</strong></td>
          <td class="mlab_td_no"><i class="fas fa-xmark"></i> <code>undefined</code></td>
          <td class="mlab_td_ok"><i class="fas fa-check"></i> <code>IntersectionObserver</code></td>
          <td class="mlab_td_impact mlab_imp_hi">Control externo total</td>
        </tr>
        <tr>
          <td><strong>Callback al salir</strong></td>
          <td class="mlab_td_no"><i class="fas fa-xmark"></i> No existe</td>
          <td class="mlab_td_ok"><i class="fas fa-check"></i> <code>onExit(el, i)</code></td>
          <td class="mlab_td_impact mlab_imp_hi">Animaciones re-entry</td>
        </tr>
        <tr>
          <td><strong>Root container</strong></td>
          <td class="mlab_td_no"><i class="fas fa-xmark"></i> Solo viewport</td>
          <td class="mlab_td_ok"><i class="fas fa-check"></i> <code>root: element</code></td>
          <td class="mlab_td_impact mlab_imp_md">Scroll dentro de div</td>
        </tr>
        <tr>
          <td><strong>Delay global</strong></td>
          <td class="mlab_td_no"><i class="fas fa-xmark"></i> No existe</td>
          <td class="mlab_td_ok"><i class="fas fa-check"></i> <code>delay: ms</code></td>
          <td class="mlab_td_impact mlab_imp_md">Sync con otras anims</td>
        </tr>
        <tr>
          <td><strong>Procesa eventos de salida</strong></td>
          <td class="mlab_td_no"><i class="fas fa-xmark"></i> Filtra solo entrada</td>
          <td class="mlab_td_ok"><i class="fas fa-check"></i> Entrada + salida</td>
          <td class="mlab_td_impact mlab_imp_hi">Base para onExit</td>
        </tr>
        <tr class="mlab_tr_compat">
          <td><strong>stagger</strong></td>
          <td class="mlab_td_ok"><i class="fas fa-check"></i> <code>stagger: ms</code></td>
          <td class="mlab_td_ok"><i class="fas fa-check"></i> <code>stagger: ms</code></td>
          <td class="mlab_td_impact mlab_imp_lo">Sin cambio</td>
        </tr>
        <tr class="mlab_tr_compat">
          <td><strong>anim class</strong></td>
          <td class="mlab_td_ok"><i class="fas fa-check"></i> <code>anim: ''</code></td>
          <td class="mlab_td_ok"><i class="fas fa-check"></i> <code>anim: ''</code></td>
          <td class="mlab_td_impact mlab_imp_lo">Sin cambio</td>
        </tr>
        <tr class="mlab_tr_compat">
          <td><strong>once · threshold</strong></td>
          <td class="mlab_td_ok"><i class="fas fa-check"></i> Soportados</td>
          <td class="mlab_td_ok"><i class="fas fa-check"></i> Soportados</td>
          <td class="mlab_td_impact mlab_imp_lo">Sin cambio</td>
        </tr>
        <tr>
          <td><strong>Retrocompatibilidad</strong></td>
          <td class="mlab_td_na">—</td>
          <td class="mlab_td_ok"><i class="fas fa-check"></i> 100% garantizada</td>
          <td class="mlab_td_impact mlab_imp_ok">0 cambios requeridos</td>
        </tr>
        <!-- ── SEPARADOR USOS ── -->
        <tr class="mlab_tr_sep">
          <td colspan="4"><i class="fas fa-code"></i> Formas de uso — v10 vs v11</td>
        </tr>
        <tr>
          <td><strong>Uso 1</strong><br><span class="mlab_td_sub">Animación básica</span></td>
          <td><code>wiVista('.card', null,<br>{ anim:'wi_fadeUp' })</code></td>
          <td class="mlab_td_ok"><code>wiVista('.card', null,<br>{ anim:'wi_fadeUp' })</code></td>
          <td class="mlab_td_impact mlab_imp_lo">Idéntico ✓</td>
        </tr>
        <tr>
          <td><strong>Uso 2</strong><br><span class="mlab_td_sub">Stagger en lista</span></td>
          <td><code>wiVista('.item', null,<br>{ anim:'wi_fadeUp', stagger:120 })</code></td>
          <td class="mlab_td_ok"><code>wiVista('.item', null,<br>{ anim:'wi_fadeUp', stagger:120 })</code></td>
          <td class="mlab_td_impact mlab_imp_lo">Idéntico ✓</td>
        </tr>
        <tr>
          <td><strong>Uso 3</strong><br><span class="mlab_td_sub">Callback + delay</span></td>
          <td><code>wiVista('.el', el => fn(el))<br><span class="mlab_td_note">// sin delay posible</span></code></td>
          <td class="mlab_td_ok"><code>wiVista('.el', el => fn(el),<br>{ delay:500, stagger:80 })</code></td>
          <td class="mlab_td_impact mlab_imp_md">+delay global</td>
        </tr>
        <tr>
          <td><strong>Uso 4</strong><br><span class="mlab_td_sub">Re-entrada / repeat</span></td>
          <td class="mlab_td_no"><code>// No posible nativamente<br>// requiere workaround manual</code></td>
          <td class="mlab_td_ok"><code>wiVista('.el', fn, { once:false,<br>onExit: el => el.classList<br>.remove('wi_visible') })</code></td>
          <td class="mlab_td_impact mlab_imp_hi">Solo en v11</td>
        </tr>
        <tr>
          <td><strong>Uso 5</strong><br><span class="mlab_td_sub">Control externo</span></td>
          <td class="mlab_td_no"><code>wiVista('.el', fn)<br>// retorna undefined<br>// no se puede parar</code></td>
          <td class="mlab_td_ok"><code>const obs = wiVista('.el', fn)<br>// ... más tarde:<br>obs?.disconnect()</code></td>
          <td class="mlab_td_impact mlab_imp_hi">Solo en v11</td>
        </tr>
      </tbody>
    </table>
  </div>

</div>`;

// ══ INIT ════════════════════════════════════════════════
let _obs11 = null;
let _entries = 0;

export const init = () => {
  // v10 — stagger
  wiVistav10('#d10_stagger .mlab_card', null, { anim: 'wi_fadeUp', stagger: 120 });

  // v10 — contador once (dispara 1 sola vez)
  wiVistav10('#d10_cnt', () => {
    const $n = $('#cnt10'), target = +$n.data('target');
    let v = 0;
    const t = setInterval(() => {
      v += target / 50;
      if (v >= target) { $n.text(target); clearInterval(t); }
      else $n.text(Math.floor(v));
    }, 30);
  });

  // v11 — stagger (100% compat)
  wiVistav11('#d11_stagger .mlab_card', null, { anim: 'wi_fadeUp', stagger: 120 });

  // v11 — onExit: resetea al salir, re-anima al entrar, cuenta entradas
  wiVistav11('#d11_exit .mlab_card_exit', el => {
    _entries++;
    $('#entry_cnt').text('×' + _entries);
  }, {
    anim: 'wi_fadeUp',
    once: false,
    onExit: el => el.classList.remove('wi_visible'),
  });

  // v11 — observer retornable: scroll out/in se ve hasta desconectar
  _obs11 = wiVistav11('#d11_obs .mlab_card', () => {
    $('#obs_status').removeClass('mlab_obs_off').html('<i class="fas fa-circle"></i> activo');
  }, {
    anim: 'wi_fadeUp',
    once: false,
    onExit: el => {
      el.classList.remove('wi_visible');
      if (_obs11) $('#obs_status').html('<i class="fas fa-circle"></i> activo · espera');
    },
  });

  // v11 — delay global
  wiVistav11('#d11_delay .mlab_card', null, { anim: 'wi_fadeUp', stagger: 150, delay: 600 });

  $(document).on('click.mlab', '#btn_disc', function () {
    if (_obs11) {
      _obs11.disconnect();
      _obs11 = null;
      $('#obs_status').addClass('mlab_obs_off').html('<i class="fas fa-circle"></i> desconectado');
      $(this)
        .html('<i class="fas fa-check"></i> Observer desconectado — ya no responde')
        .prop('disabled', true)
        .addClass('mlab_btn_done');
    }
  });
};

export const cleanup = () => {
  _obs11?.disconnect();
  _obs11 = null;
  _entries = 0;
  $(document).off('.mlab');
};