import './login.css';
import $ from 'jquery';
import { auth, db } from '../firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,
         sendEmailVerification, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { setDoc, getDoc, getDocs, doc, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { wiTip, Mensaje, savels, getls, wiSpin, wiAuth, abrirModal, cerrarTodos } from '../widev.js';
import { rutas } from '../rutas.js';

export { auth, signOut };

// ── CONFIG ───────────────────────────────────────────────────────────────────
const cfg = { db: 'smiles', pagina: 'rol' };
let modal = 'si', link = 'si', restablecer = 'si', login = 'si', registrar = 'si';

// Ruta por rol
const ROL_PATH = { smile: '/win', gestor: '/gestor', empresa: '/empresa', admin: '/admin' };

const err = {
  'auth/email-already-in-use':'Email ya registrado', 'auth/weak-password':'Contraseña débil (mín. 6)',
  'auth/invalid-credential':'Contraseña incorrecta', 'auth/invalid-email':'Email no válido',
  'auth/missing-email':'Usuario no registrado',      'auth/too-many-requests':'Demasiados intentos'
};

const reglas = {
  regEmail:     [v => v.toLowerCase().trim(),                            v => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v) || 'Email inválido'],
  regUsuario:   [v => v.toLowerCase().replace(/[^a-z0-9_]/g,'').trim(), v => v.length >= 4 || 'Mínimo 4 caracteres'],
  regNombre:    [v => v.trim(),                                          v => v.length > 0 || 'Ingresa tu nombre'],
  regApellidos: [v => v.trim(),                                          v => v.length > 0 || 'Ingresa tus apellidos'],
  regPassword:  [v => v,                                                 v => v.length >= 6 || 'Mínimo 6 caracteres'],
  regPassword1: [v => v,                                                 v => v === $('#regPassword').val() || 'No coinciden']
};

// ── HELPERS ──────────────────────────────────────────────────────────────────
const campo = (ico, tipo, id, place, ojo = false) =>
  `<div class="wilg_grupo"><i class="fas fa-${ico}"></i><input type="${tipo}" id="${id}" placeholder="${place}" autocomplete="off">${ojo ? '<i class="fas fa-eye wilg_ojo"></i>' : ''}</div>`;

// ── ROL SELECTOR ─────────────────────────────────────────────────────────────
// Retorna el bloque dinámico dependiendo del rol seleccionado
const rolExtra = (rol = 'smile') => {
  if (rol === 'smile') return `
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
        ${campo('key','text','regCodigo','Código de clase (ej: ABC123)')}
      </div>
    </div>`;

  if (rol === 'gestor') return `
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
        ${campo('building','text','regRuc','RUC de la empresa')}
      </div>
      <div class="wilg_info_badge"><i class="fas fa-info-circle"></i> Tu cuenta de gestor será activada por el administrador.</div>
    </div>`;

  if (rol === 'empresa') return `
    <div class="wilg_rol_extra" id="rolExtra">
      <div class="wilg_extra_label"><i class="fas fa-building"></i> Datos de tu empresa</div>
      <div class="wilg_extra_field wilg_extra_2col" id="extraField">
        ${campo('id-card','text','regRuc','RUC (11 dígitos)')}
        ${campo('building','text','regEmpresaNombre','Nombre de la empresa')}
      </div>
      <div class="wilg_info_badge"><i class="fas fa-info-circle"></i> Tu cuenta empresarial será verificada y activada en 24h.</div>
    </div>`;

  return '';
};

// ── TEMPLATES ────────────────────────────────────────────────────────────────
const tpl = {
  login: () => `
    <div class="wilg_head">
      <div class="wilg_logo"><img src="./smile.avif" alt="TypingWii"></div>
      <h2>Bienvenido</h2><p>Inicia sesión en tu cuenta</p>
    </div>
    ${campo('envelope','text','email','Email o usuario')}
    ${campo('lock','password','password','Contraseña',true)}
    <button type="button" id="Login" class="wilg_btn inactivo"><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</button>
    ${(restablecer==='si'||registrar==='si') ? `<div class="wilg_links">
      ${restablecer==='si' ? '<span class="wilg_rec"><i class="fas fa-key"></i> ¿Olvidaste tu contraseña?</span>' : ''}
      ${registrar==='si'   ? '<span class="wilg_reg">Crear cuenta <i class="fas fa-arrow-right"></i></span>' : ''}
    </div>` : ''}`,

  registrar: () => `
    <div class="wilg_head">
      <div class="wilg_logo"><img src="./smile.avif" alt="TypingWii"></div>
      <h2>Crear Cuenta</h2><p>Únete a la comunidad</p>
    </div>
    <div class="wilg_grid">
      ${[['envelope','email','regEmail','Email'],['user','text','regUsuario','Usuario'],
         ['user-tie','text','regNombre','Nombre'],['user-tie','text','regApellidos','Apellidos']]
        .map(([i,t,id,p]) => campo(i,t,id,p)).join('')}
      ${campo('lock','password','regPassword','Contraseña',true)}
      ${campo('lock','password','regPassword1','Confirmar contraseña',true)}
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
    ${rolExtra('smile')}
    <!-- ─────────────────────────────────────── -->

    <div class="wilg_check">
      <label><input type="checkbox" id="regTerminos">
      <span>Acepto los <a href="/terminos.html" target="_blank">términos y condiciones</a></span></label>
    </div>
    <button type="button" id="Registrar" class="wilg_btn inactivo"><i class="fas fa-user-plus"></i> Registrarme</button>
    <div class="wilg_links"><span class="wilg_log"><i class="fas fa-arrow-left"></i> Ya tengo cuenta</span></div>`,

  restablecer: () => `
    <div class="wilg_head">
      <div class="wilg_logo wilg_logo_sm"><img src="./smile.avif" alt="TypingWii"></div>
      <h2>Recuperar</h2><p>Te enviaremos un enlace a tu email</p>
    </div>
    ${campo('envelope','text','recEmail','Email o usuario')}
    <button type="button" id="Recuperar" class="wilg_btn"><i class="fas fa-paper-plane"></i> Enviar enlace</button>
    <div class="wilg_links"><span class="wilg_log"><i class="fas fa-arrow-left"></i> Volver</span></div>`
};

// ── MODAL ────────────────────────────────────────────────────────────────────
const modalHTML = (vista, cls = '') =>
  `<div id="wilg_modal" class="wiModal wilg_mod ${cls}"><div class="modalBody"><button class="modalX">&times;</button>
   <form id="liForm">${tpl[vista]()}</form></div></div>`;

const inyectarModal = (vista = 'login') => {
  $('#wilg_modal').remove();
  const cls = vista === 'registrar' ? 'wilg_mod_reg' : '';
  $('body').append(modalHTML(vista, cls));
  setTimeout(() => { abrirModal('wilg_modal'); $('#liForm input:first').focus(); }, 50);
};

const mostrarModal = v => {
  const cls = v === 'registrar' ? 'wilg_mod_reg' : '';
  $('#wilg_modal').toggleClass('wilg_mod_reg', cls === 'wilg_mod_reg');
  $('#liForm').html(tpl[v]()).attr('data-vista', v);
  setTimeout(() => $('#liForm input:first').focus(), 30);
};

// ── RENDER (PÁGINA) ──────────────────────────────────────────────────────────
export const render = () => (link !== 'si' || wiAuth.user)
  ? ''
  : `<div class="wilg_wrap"><div class="wilg_card"><form id="liForm"></form></div></div>`;

export const init = () => {
  if (link !== 'si') { setTimeout(() => rutas.navigate('/'), 0); return; }
  const wi = wiAuth.user;
  if (wi) { setTimeout(() => rutas.navigate(ROL_PATH[wi.rol] || '/'), 0); return; }
  mostrar('login');
};

const mostrar = v => { $('#liForm').html(tpl[v]()).attr('data-vista', v); setTimeout(() => $('#liForm input:first').focus(), 30); };

// ── UTILS ────────────────────────────────────────────────────────────────────
const val     = id => $(`#${id}`).val().trim();
const esModal = () => $('#wilg_modal.active').length > 0;
const swap    = v  => esModal() ? mostrarModal(v) : mostrar(v);
const accion  = async (btn, txt, fn) => {
  wiSpin(btn, true, txt);
  try { await fn(); } catch(e) { Mensaje(err[e.code] || e.message, 'error'); }
  finally { wiSpin(btn, false); }
};

// Resuelve email desde username
const fetchUser = async input => {
  if (input.includes('@')) return { email: input, wi: null };
  const snap = await getDoc(doc(db, 'smiles', input));
  if (!snap.exists()) throw new Error('Usuario no encontrado');
  return { email: snap.data().email, wi: snap.data() };
};

const tema = t => {
  if (!t) return;
  const [n, c] = t.split('|');
  document.documentElement.dataset.theme = n;
  $('meta[name="theme-color"]').attr('content', c);
  $('.tema').removeClass('mtha').filter(`[data-ths="${t}"]`).addClass('mtha');
};

const redir = wi => {
  if (cfg.pagina === 'actual') return;
  const ruta = cfg.pagina === 'rol' ? (ROL_PATH[wi?.rol] || '/') : cfg.pagina;
  rutas.navigate(ruta);
};

const entrar = wi => {
  wiAuth.login(wi, 7);
  if (wi?.tema) { localStorage.wiTema = wi.tema; tema(wi.tema); }
  if (esModal()) cerrarTodos();
  redir(wi);
};

// ── EVENTOS ──────────────────────────────────────────────────────────────────
$(document)
  .on('submit.wi', '#liForm', e => e.preventDefault())
  .on('click.wi', '.wilg_ojo', function () {
    const $i = $(this).siblings('input');
    $i.attr('type', $i.attr('type') === 'password' ? 'text' : 'password');
    $(this).toggleClass('fa-eye fa-eye-slash');
  })
  .on('input.wi', '#email,#recEmail,#regEmail,#regUsuario', function () { $(this).val($(this).val().toLowerCase()); })
  .on('click.wi', '.wilg_reg', () => { registrar === 'si' && swap('registrar'); })
  .on('click.wi', '.wilg_rec', () => { restablecer === 'si' && swap('restablecer'); })
  .on('click.wi', '.wilg_log', () => swap('login'))
  .on('input.wi keyup.wi', '#password',     e => { $('#Login').removeClass('inactivo');     e.key === 'Enter' && $('#Login').click(); })
  .on('input.wi keyup.wi', '#regPassword1', e => { $('#Registrar').removeClass('inactivo'); e.key === 'Enter' && $('#Registrar').click(); })
  .on('input.wi keyup.wi', '#recEmail',     e => { e.key === 'Enter' && $('#Recuperar').trigger('click'); })
  .on('blur.wi', Object.keys(reglas).map(id => `#${id}`).join(','), function () {
    const raw = $(this).val(); if (!raw) return;
    const [trans, vld] = reglas[this.id];
    const v = trans(raw); $(this).val(v);
    const r = vld(v); r !== true && wiTip(this, r, 'error', 2500);
  })
  .on('blur.wi', '#regUsuario', async function () {
    const u = val('regUsuario'); if (!u || u.length < 3) return;
    if (u.includes('@')) return ($(this).data('ok', false), wiTip(this, 'No puede contener @', 'error', 2500));
    const libre = !(await getDoc(doc(db, 'smiles', u))).exists();
    $(this).data('ok', libre);
    wiTip(this, `Usuario ${libre ? 'disponible <i class="fa-solid fa-check-circle"></i>' : 'no disponible <i class="fa-solid fa-times-circle"></i>'}`, libre ? 'success' : 'error', 3000);
  })
  .on('blur.wi', '#regEmail', async function () {
    const e = val('regEmail'); if (!e || !e.includes('@')) return;
    const libre = (await getDocs(query(collection(db, 'smiles'), where('email','==',e)))).empty;
    $(this).data('ok', libre);
    wiTip(this, `Email ${libre ? 'disponible <i class="fa-solid fa-check-circle"></i>' : 'no disponible <i class="fa-solid fa-times-circle"></i>'}`, libre ? 'success' : 'error', 3000);
  })

  // ── SELECTOR DE ROL — switch dinámico ────────────────────────────
  .on('click.wi', '.wilg_rol_tab', function () {
    const rol = $(this).data('rol');
    $('.wilg_rol_tab').removeClass('active');
    $(this).addClass('active');
    $('#rolExtra').replaceWith(rolExtra(rol));
    // re-bind radio events dentro del nuevo HTML
    _bindRolExtra();
  })

  // ── RADIO EXTRA — mostrar/ocultar campo condicional ──────────────
  .on('change.wi', 'input[name="regExtra"]', function () {
    const opt = $(this).val();
    // Marcar la opción activa visualmente
    $('.wilg_extra_opt').removeClass('active');
    $(this).closest('.wilg_extra_opt').addClass('active');
    const $f = $('#extraField');
    // Mostrar campo solo si no es la opción por defecto (personal / crear)
    if (opt === 'personal' || opt === 'crear') {
      $f.addClass('hidden');
    } else {
      $f.removeClass('hidden');
      $f.find('input:first').focus();
    }
  })

  // ── LOGIN ────────────────────────────────────────────────────────
  .on('click.wi', '#Login', async function () {
    await accion(this, 'Iniciando', async () => {
      const input = val('email'), pass = val('password');
      const { email, wi: wiPre } = await fetchUser(input);
      await signInWithEmailAndPassword(auth, email, pass);
      const wi = wiPre ?? (await getDoc(doc(db, 'smiles', auth.currentUser.displayName || input))).data();

      // Verificar si la cuenta está pendiente de activación
      if (wi.status === 'pendiente') {
        await signOut(auth);
        throw new Error('Tu cuenta está pendiente de activación. Te notificaremos por email.');
      }
      entrar(wi);
    });
  })

  // ── REGISTRO ─────────────────────────────────────────────────────
  .on('click.wi', '#Registrar', async function () {
    if ($(this).data('busy')) return;

    const rolSeleccionado = $('.wilg_rol_tab.active').data('rol') || 'smile';
    const extraOpt        = $('input[name="regExtra"]:checked').val() || 'personal';

    const chk = [
      [!$('#regTerminos').is(':checked'), '#regTerminos', 'Acepta los términos'],
      [!$('#regUsuario').data('ok'),      '#regUsuario',  'Verifica el usuario'],
      [!$('#regEmail').data('ok'),        '#regEmail',    'Verifica el email']
    ];

    // Validar RUC para empresa
    if (rolSeleccionado === 'empresa') {
      const ruc = val('regRuc');
      if (!/^\d{11}$/.test(ruc)) {
        return wiTip($('#regRuc')[0], 'El RUC debe tener 11 dígitos', 'error', 2500);
      }
    }

    const fallo = chk.find(([c]) => c);
    if (fallo) return wiTip($(fallo[1])[0], fallo[2], 'error', 2500);

    $(this).data('busy', true);
    await accion(this, 'Registrando', async () => {
      const d = {
        email:      val('regEmail'),
        usuario:    val('regUsuario'),
        nombre:     val('regNombre'),
        apellidos:  val('regApellidos'),
        password:   val('regPassword')
      };

      const { user } = await createUserWithEmailAndPassword(auth, d.email, d.password);
      await Promise.all([updateProfile(user, { displayName: d.usuario }), sendEmailVerification(user)]);

      // Determinar rol y status según selección
      const esPendiente = rolSeleccionado === 'gestor' || rolSeleccionado === 'empresa';
      const rolFinal    = esPendiente ? rolSeleccionado : 'smile';
      const status      = esPendiente ? 'pendiente' : 'activo';

      const wi = {
        usuario:   d.usuario,
        email:     d.email,
        nombre:    d.nombre,
        apellidos: d.apellidos,
        rol:       rolFinal,
        status,
        uid:       user.uid,
        terminos:  true,
        tema:      localStorage.wiTema || 'Cielo|#0EBEFF',
        // Extras por rol
        ...(rolSeleccionado === 'empresa' && {
          ruc:          val('regRuc'),
          empresaNombre:val('regEmpresaNombre'),
        }),
        ...(rolSeleccionado === 'gestor' && extraOpt === 'unir' && {
          empresaRuc: val('regRuc'),
        }),
        ...(rolSeleccionado === 'smile' && extraOpt === 'clase' && {
          claseIdSolicitud: val('regCodigo'), // se procesa al entrar
        }),
      };

      await setDoc(doc(db, 'smiles', d.usuario), { ...wi, creado: serverTimestamp() });

      if (esPendiente) {
        // No hacer login — solo notificar
        await signOut(auth);
        Mensaje('<i class="fa-solid fa-clock"></i> Registro enviado. Tu cuenta será activada pronto.', 'success');
        setTimeout(() => swap('login'), 2500);
      } else {
        entrar(wi);
        Mensaje('<i class="fa-solid fa-check-circle"></i> ¡Cuenta creada! Verifica tu email', 'success');
      }
    });
    $(this).data('busy', false);
  })

  // ── RESTABLECER ──────────────────────────────────────────────────
  .on('click.wi', '#Recuperar', async function () {
    const emailVal = val('recEmail');
    if (!emailVal) return wiTip(this, 'Ingresa tu email o usuario', 'error', 2500);
    await accion(this, 'Enviando', async () => {
      const { email } = await fetchUser(emailVal);
      await sendPasswordResetEmail(auth, email);
      Mensaje('<i class="fa-solid fa-check-circle"></i> Email enviado, revisa tu bandeja', 'success');
      setTimeout(() => swap('login'), 2000);
    });
  })
  .on('click.wi', '.tema', async function () {
    const wi = getls('wiSmile'); if (!wi?.usuario) return;
    setTimeout(async () => {
      const t = localStorage.wiTema; if (!t) return;
      try {
        await setDoc(doc(db, 'smiles', wi.usuario), { tema: t, actualizado: serverTimestamp() }, { merge: true });
        savels('wiSmile', { ...wi, tema: t }, 7);
        Mensaje(`Tema ${t.split('|')[0]} guardado <i class="fas fa-check-circle"></i>`, 'success');
      } catch (e) { console.error('tema:', e); }
    }, 0);
  });

// ── RE-BIND radio extra (llamado al cambiar rol) ──────────────────────────────
function _bindRolExtra() {
  // Los eventos de radio ya están delegados arriba, solo necesitamos
  // setear el estado inicial del campo oculto
  const opt = $('input[name="regExtra"]:checked').val();
  if (opt === 'personal' || opt === 'crear') $('#extraField').addClass('hidden');
}

// ── AUTH MODAL ───────────────────────────────────────────────────────────────
export const abrirLogin = (tipo = 'login') => {
  if (modal === 'si') {
    inyectarModal(tipo === 'registrar' && registrar === 'si' ? 'registrar' : 'login');
  } else {
    rutas.navigate('/login');
  }
};

export const salir = async (keep = []) => {
  try { await signOut(auth); } catch(e) { console.error('signOut:', e); }
  wiAuth.logout(keep);
};

export const cleanup = () => { $(document).off('.wi'); };