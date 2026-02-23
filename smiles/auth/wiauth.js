import './wiauth.css';
import $ from 'jquery';
import { auth, db } from '../smile/firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification, sendPasswordResetEmail, onAuthStateChanged, signOut } from 'firebase/auth';
import { setDoc, getDoc, doc, query, where, getDocs, collection, serverTimestamp } from 'firebase/firestore';
import { wiTip, Mensaje, wiAuth, wiSpin, abrirModal, cerrarModal, cerrarTodos } from '../widev.js';

export { auth, onAuthStateChanged, signOut };

// CONFIGURACION_________________________________
const cfg = { db: 'smiles', rol: 'smile' };

const errAuth = {
  'auth/email-already-in-use': 'Email ya registrado', 'auth/weak-password': 'Contraseña débil',
  'auth/invalid-credential': 'Contraseña incorrecta', 'auth/invalid-email': 'Email no válido',
  'auth/missing-email': 'Usuario no registrado', 'auth/too-many-requests': 'Demasiados intentos, espera'
};

const reglas = {
  regEmail:     [v => v.toLowerCase().trim(), v => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v) || 'Email inválido'],
  regUsuario:   [v => v.toLowerCase().replace(/[^a-z0-9_]/g, '').trim(), v => v.length >= 4 || 'Usuario 4-20 caracteres'],
  regNombre:    [v => v.trim(), v => v.length > 0 || 'Ingrese nombre'],
  regApellidos: [v => v.trim(), v => v.length > 0 || 'Ingrese apellidos'],
  regPassword:  [v => v, v => v.length >= 6 || 'Mínimo 6 caracteres'],
  regPassword1: [v => v, v => v === $('#regPassword').val() || 'No coinciden']
};

// PLANTILLAS HTML_________________________________
const campo = (ico, tipo, id, place, ojo) =>
  `<div class="au_grupo"><i class="fas fa-${ico}"></i><input type="${tipo}" id="${id}" placeholder="${place}" required>${ojo ? '<i class="fas fa-eye au_ojo"></i>' : ''}</div>`;

const caja = (id, titulo, html, cls = '') =>
  `<div id="${id}" class="wiModal au_mod ${cls}"><div class="modalBody"><button class="modalX">&times;</button><div class="au_main"><div class="au_logo">
   <img src="./smile.avif"></div><h2>${titulo}</h2><form id="${id.replace('Modal', 'Form')}">${html}</form></div></div></div>`;

const modales = [
  caja('loginModal', 'Login', [
    campo('envelope', 'text', 'email', 'Email o usuario'),
    campo('lock', 'password', 'password', 'Contraseña', true),
    '<button type="button" id="Login" class="au_btn inactivo">Iniciar Sesión</button>',
    '<div class="au_links"><span class="olvidastePass">¿Olvidaste tu contraseña?</span><span class="crearCuenta">Crear cuenta</span></div>'
  ].join('')),
  caja('registroModal', 'Crear Cuenta', [
    campo('envelope', 'email', 'regEmail', 'Email'),
    campo('user', 'text', 'regUsuario', 'Usuario'),
    campo('user-tie', 'text', 'regNombre', 'Nombre'),
    campo('user-tie', 'text', 'regApellidos', 'Apellidos'),
    campo('lock', 'password', 'regPassword', 'Contraseña', true),
    campo('lock', 'password', 'regPassword1', 'Confirmar', true),
    '<div class="au_grupo au_check"><label><input type="checkbox" id="regTerminos" required><span>Acepto los <a href="/terminos.html" target="_blank">términos y condiciones</a></span></label></div>',
    '<button type="button" id="Registrar" class="au_btn inactivo">Registrarme</button>',
    '<div class="au_links"><span class="conCuenta">Ya tengo cuenta</span></div>'
  ].join(''), 'au_reg'),
  caja('recuperarModal', 'Restablecer', [
    '<p>Ingresa tu Email o usuario:</p>',
    campo('envelope', 'text', 'recEmail', 'Email o usuario'),
    '<button type="button" id="Recuperar" class="au_btn inactivo">Enviar enlace</button>',
    '<div class="au_links"><span class="volverLogin"><i class="fas fa-arrow-left"></i> Volver</span></div>'
  ].join(''))
];

// UTILIDADES AUTH_________________________________
let listo = false;
const inyectar = () => { if (listo) return; $('body').append(modales.join('')); listo = true; eventos(); };

const correo = async (val) => {
  if (val.includes('@')) return val;
  const snap = await getDoc(doc(db, cfg.db, val));
  if (!snap.exists()) throw new Error('Usuario no encontrado');
  return snap.data().email;
};

const tema = (t) => {
  if (!t) return;
  const [n, c] = t.split('|');
  document.documentElement.dataset.theme = n;
  $('meta[name="theme-color"]').attr('content', c);
  $('.tema').removeClass('mtha').filter(`[data-ths="${t}"]`).addClass('mtha');
};

const ok = async (wi, h = 24) => { wiAuth.login(wi, h); cerrarTodos(); };
const val = (id) => $(`#${id}`).val().trim();

// EVENTOS INTERNOS_________________________________
const eventos = () => {
  let usuarioOk = false, emailOk = false, registrando = false;

  $(document).on('click.wa', '.au_ojo', function () {
    const $i = $(this).siblings('input');
    $i.attr('type', $i.attr('type') === 'password' ? 'text' : 'password');
    $(this).toggleClass('fa-eye fa-eye-slash');
  });

  $(document).on('input.wa', '#regUsuario,#regEmail,#email,#recEmail', function () { $(this).val($(this).val().toLowerCase()); });

  [['#password', '#Login'], ['#regPassword1', '#Registrar'], ['#recEmail', '#Recuperar']].forEach(([i, b]) =>
    $(document).on('input.wa keyup.wa', i, e => { $(b).removeClass('inactivo'); e.key === 'Enter' && $(b).click(); })
  );

  Object.entries(reglas).forEach(([id, [trans, vld]]) =>
    $(document).on('blur.wa', `#${id}`, function () {
      const v = trans($(this).val()); $(this).val(v);
      const r = vld(v); r !== true && wiTip(this, r, 'error', 2500);
    })
  );

  $(document).on('blur.wa', '#regUsuario', async function () {
    const u = $(this).val().trim();
    if (u.includes('@')) return (usuarioOk = false, wiTip(this, 'No puede contener @', 'error', 2500));
    if (u.length < 3) return;
    try { const e = (await getDoc(doc(db, cfg.db, u))).exists(); usuarioOk = !e; wiTip(this, `Usuario ${e ? 'no disponible <i class="fas fa-times-circle"></i>' : 'disponible <i class="fas fa-circle-check"></i>'}`, !e ? 'success' : 'error', 3000); }
    catch (e) { console.error(e); }
  });

  $(document).on('focus.wa', '#email,#password', function () { wiTip(this, $(this).attr('placeholder')); });

  $(document).on('blur.wa', '#regEmail', async function () {
    const e = $(this).val().trim();
    if (e.length > 0 && !e.includes('@')) return (emailOk = false, wiTip(this, 'Debe ser email válido', 'error', 2500));
    if (e.length < 3 || !e.includes('@')) return;
    try { const x = !(await getDocs(query(collection(db, cfg.db), where('email', '==', e)))).empty; emailOk = !x; 
          wiTip(this, `Email ${x ? 'no disponible <i class="fas fa-times-circle"></i>' : 'disponible <i class="fas fa-circle-check"></i>'}`, !x ? 'success' : 'error', 3000); }
    catch (e) { console.error(e); }
  });

  // REGISTRAR_________________________________
  $(document).on('click.wa', '#Registrar', async function () {
    if (registrando) return;
    if (!$('#regTerminos').is(':checked')) return wiTip($('#regTerminos')[0], 'Acepta los términos', 'error', 2500);
    registrando = true; wiSpin(this, true, 'Registrando');
    const checks = [
      [usuarioOk, $('#regUsuario')[0], 'Usuario no disponible'],
      [emailOk, $('#regEmail')[0], 'Email no disponible'],
      ...Object.entries(reglas).map(([id, [t, v]]) => { const r = v(t($(`#${id}`).val())); return [r === true, $(`#${id}`)[0], r !== true ? r : '']; })
    ];
    const fallo = checks.find(([ok, , m]) => !ok && m);
    if (fallo) { wiSpin(this, false); wiTip(fallo[1], fallo[2], 'error', 2500); fallo[1].focus(); registrando = false; return; }
    try {
      const datos = { email: val('regEmail'), usuario: val('regUsuario'), nombre: val('regNombre'), apellidos: val('regApellidos'), password: val('regPassword') };
      const { user } = await createUserWithEmailAndPassword(auth, datos.email, datos.password);
      await Promise.all([updateProfile(user, { displayName: datos.usuario }), sendEmailVerification(user)]);
      const wi = { usuario: datos.usuario, email: datos.email, nombre: datos.nombre, apellidos: datos.apellidos, rol: cfg.rol, uid: user.uid, terminos: true, tema: localStorage.wiTema };
      await setDoc(doc(db, cfg.db, datos.usuario), { ...wi, creado: serverTimestamp() });
      await ok(wi);
    } catch (e) { Mensaje(errAuth[e.code] || e.message, 'error'); }
    finally { wiSpin(this, false); registrando = false; }
  });

  // LOGIN_________________________________
  $(document).on('click.wa', '#Login', async function () {
    wiSpin(this, true, 'Iniciando');
    try {
      await signInWithEmailAndPassword(auth, await correo(val('email')), val('password'));
      const nombre = auth.currentUser.displayName || val('email');
      const usuario = (await getDoc(doc(db, cfg.db, nombre))).data();
      if (usuario?.tema) { localStorage.wiTema = usuario.tema; tema(usuario.tema); }
      await ok(usuario, 450);
    } catch (e) { Mensaje(errAuth[e.code] || e.message, 'error'); }
    finally { wiSpin(this, false); }
  });

  // RECUPERAR_________________________________
  $(document).on('click.wa', '#Recuperar', async function () {
    wiSpin(this, true, 'Enviando');
    try { await sendPasswordResetEmail(auth, await correo(val('recEmail'))); Mensaje('✅ Email enviado para restablecer', 'success'); }
    catch (e) { Mensaje(e.message || 'Error al enviar', 'error'); }
    finally { wiSpin(this, false); }
  });

  const nav = { crearCuenta: ['registroModal', 'loginModal'], conCuenta: ['loginModal', 'registroModal'], olvidastePass: ['recuperarModal', 'loginModal'], 
                volverLogin: ['loginModal', 'recuperarModal'] };
  $(document).on('click.wa', Object.keys(nav).map(k => '.' + k).join(','), function () {
    const [a, c] = nav[$(this).attr('class').split(' ')[0]];
    cerrarModal(c); abrirModal(a);
  });
};

// EVENTOS GLOBALES_________________________________
$(document).on('click.wa', '.login,.registrar', function (e) {
  e.preventDefault(); inyectar();
  setTimeout(() => abrirModal($(this).hasClass('login') ? 'loginModal' : 'registroModal'), 100);
});

$(document).on('click.wa', '.tema', async function () {
  const t = localStorage.wiTema, wi = wiAuth.user;
  if (!wi) return;
  try { await setDoc(doc(db, cfg.db, wi.usuario), { tema: t, actualizado: serverTimestamp() }, { merge: true }); Mensaje(`Tema ${t.split('|')[0]} guardado`); }
  catch (e) { console.error(e); }
});