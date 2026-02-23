import './login.css';
import $ from 'jquery';
import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile,
         sendEmailVerification, sendPasswordResetEmail, onAuthStateChanged, signOut } from 'firebase/auth';
import { setDoc, getDoc, getDocs, doc, collection, query, where, serverTimestamp } from 'firebase/firestore';
import { wiTip, Mensaje, savels, getls, wiSpin } from '../widev.js';
import { personal } from '../header.js';

export { auth, onAuthStateChanged, signOut };

// ==================== CONFIG ====================
const cfg = { db: 'smiles', rol: 'smile' };
let login = 'si', registrar = 'no', restablecer = 'no';

const err = {
  'auth/email-already-in-use':'Email ya registrado', 'auth/weak-password':'Contraseña débil',
  'auth/invalid-credential':'Contraseña incorrecta', 'auth/invalid-email':'Email no válido',
  'auth/missing-email':'Usuario no registrado',      'auth/too-many-requests':'Demasiados intentos'
};

const reglas = {
  regEmail:     [v => v.toLowerCase().trim(),                            v => /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v) || 'Email inválido'],
  regUsuario:   [v => v.toLowerCase().replace(/[^a-z0-9_]/g,'').trim(), v => v.length >= 4 || 'Mínimo 4 caracteres'],
  regNombre:    [v => v.trim(),                                           v => v.length > 0 || 'Ingresa tu nombre'],
  regApellidos: [v => v.trim(),                                           v => v.length > 0 || 'Ingresa tus apellidos'],
  regPassword:  [v => v,                                                  v => v.length >= 6 || 'Mínimo 6 caracteres'],
  regPassword1: [v => v,                                                  v => v === $('#regPassword').val() || 'No coinciden']
};

// ==================== TEMPLATES ====================
const campo = (ico, tipo, id, place, ojo = false) =>
  `<div class="wilg_grupo"><i class="fas fa-${ico}"></i><input type="${tipo}" id="${id}" placeholder="${place}" autocomplete="off">${ojo ? '<i class="fas fa-eye wilg_ojo"></i>' : ''}</div>`;

const tpl = {
  login: () => `
    <div class="wilg_head">
      <div class="wilg_logo"><img src="./smile.avif" alt="Awonbe"></div>
      <h2>Bienvenido</h2><p>Inicia sesión en tu cuenta</p>
    </div>
    ${campo('envelope','text','email','Email o usuario')}
    ${campo('lock','password','password','Contraseña',true)}
    <button type="button" id="Login" class="wilg_btn inactivo"><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</button>
    <div class="wilg_links">
      ${restablecer==='si' ? '<span class="wilg_rec">¿Olvidaste tu contraseña?</span>' : ''}
      ${registrar==='si'   ? '<span class="wilg_reg">Crear cuenta <i class="fas fa-arrow-right"></i></span>' : ''}
    </div>`,

  registrar: () => `
    <div class="wilg_head">
      <div class="wilg_logo"><img src="./smile.avif" alt="Awonbe"></div>
      <h2>Crear Cuenta</h2><p>Únete a la comunidad</p>
    </div>
    <div class="wilg_grid">
      ${[['envelope','email','regEmail','Email'],['user','text','regUsuario','Usuario'],
         ['user-tie','text','regNombre','Nombre'],['user-tie','text','regApellidos','Apellidos']]
        .map(([i,t,id,p]) => campo(i,t,id,p)).join('')}
      ${campo('lock','password','regPassword','Contraseña',true)}
      ${campo('lock','password','regPassword1','Confirmar contraseña',true)}
    </div>
    <div class="wilg_check">
      <label><input type="checkbox" id="regTerminos">
      <span>Acepto los <a href="/terminos.html" target="_blank">términos y condiciones</a></span></label>
    </div>
    <button type="button" id="Registrar" class="wilg_btn inactivo"><i class="fas fa-user-plus"></i> Registrarme</button>
    <div class="wilg_links"><span class="wilg_log"><i class="fas fa-arrow-left"></i> Ya tengo cuenta</span></div>`,

  restablecer: () => `
    <div class="wilg_head">
      <div class="wilg_logo wilg_logo_sm"><img src="./smile.avif" alt="Awonbe"></div>
      <h2>Restablecer</h2><p>Te enviaremos un enlace a tu email</p>
    </div>
    ${campo('envelope','text','recEmail','Email o usuario')}
    <button type="button" id="Recuperar" class="wilg_btn inactivo"><i class="fas fa-paper-plane"></i> Enviar enlace</button>
    <div class="wilg_links"><span class="wilg_log"><i class="fas fa-arrow-left"></i> Volver</span></div>`
};

// ==================== RENDER ====================
export const render = () => {
  $('#wimain').html(`<div class="wilg_wrap"><div class="wilg_card"><form id="liForm"></form></div></div>`);
  mostrar('login');
};
const mostrar = v => { $('#liForm').html(tpl[v]()).attr('data-vista', v); $('#liForm input:first').focus(); };

// ==================== UTILS ====================
const val    = id => $(`#${id}`).val().trim();
const correo = async v => {
  if (v.includes('@')) return v;
  const snap = await getDoc(doc(db, cfg.db, v));
  if (!snap.exists()) throw new Error('Usuario no encontrado');
  return snap.data().email;
};
const entrar = async wi => {
  savels('wiSmile', wi, 24);
  if (wi?.tema && wi.tema !== localStorage.wiTema) $(`.tema[data-ths="${wi.tema}"]`).trigger('click');
  personal(wi);
};

// ==================== EVENTOS ====================
$(document)
  .on('click.wi', '.wilg_ojo', function () {
    const $i = $(this).siblings('input');
    $i.attr('type', $i.attr('type') === 'password' ? 'text' : 'password');
    $(this).toggleClass('fa-eye fa-eye-slash');
  })
  .on('input.wi', '#email,#recEmail,#regEmail,#regUsuario', function () { $(this).val($(this).val().toLowerCase()); })
  .on('click.wi', '.wilg_reg', () => mostrar('registrar'))
  .on('click.wi', '.wilg_rec', () => mostrar('restablecer'))
  .on('click.wi', '.wilg_log', () => mostrar('login'))
  .on('input.wi keyup.wi', '#password',     e => { $('#Login').removeClass('inactivo');     e.key === 'Enter' && $('#Login').click(); })
  .on('input.wi keyup.wi', '#regPassword1', e => { $('#Registrar').removeClass('inactivo'); e.key === 'Enter' && $('#Registrar').click(); })
  .on('input.wi keyup.wi', '#recEmail',     e => { $('#Recuperar').removeClass('inactivo'); e.key === 'Enter' && $('#Recuperar').click(); })
  .on('blur.wi', Object.keys(reglas).map(id => `#${id}`).join(','), function () {
    const [trans, vld] = reglas[this.id];
    const v = trans($(this).val()); $(this).val(v);
    const r = vld(v); r !== true && wiTip(this, r, 'error', 2500);
  })
  .on('blur.wi', '#regUsuario', async function () {
    const u = val('regUsuario'); if (u.length < 3) return;
    const libre = !(await getDoc(doc(db, cfg.db, u))).exists();
    $(this).data('ok', libre);
    wiTip(this, `Usuario ${libre ? 'disponible ✅' : 'no disponible ❌'}`, libre ? 'success' : 'error', 3000);
  })
  .on('blur.wi', '#regEmail', async function () {
    const e = val('regEmail'); if (!e.includes('@')) return;
    const libre = (await getDocs(query(collection(db, cfg.db), where('email','==',e)))).empty;
    $(this).data('ok', libre);
    wiTip(this, `Email ${libre ? 'disponible ✅' : 'no disponible ❌'}`, libre ? 'success' : 'error', 3000);
  })
  .on('click.wi', '#Login', async function () {
    wiSpin(this, true, 'Iniciando');
    try {
      await signInWithEmailAndPassword(auth, await correo(val('email')), val('password'));
      const wi = (await getDoc(doc(db, cfg.db, auth.currentUser.displayName || val('email')))).data();
      await entrar(wi);
    } catch (e) { Mensaje(err[e.code] || e.message, 'error'); }
    finally { wiSpin(this, false); }
  })
  .on('click.wi', '#Registrar', async function () {
    const chk = [
      [!$('#regTerminos').is(':checked'), '#regTerminos', 'Acepta los términos'],
      [!$('#regUsuario').data('ok'),      '#regUsuario',  'Verifica el usuario'],
      [!$('#regEmail').data('ok'),        '#regEmail',    'Verifica el email']
    ];
    const fallo = chk.find(([c]) => c);
    if (fallo) return wiTip($(fallo[1])[0], fallo[2], 'error', 2500);
    wiSpin(this, true, 'Registrando');
    try {
      const d = { email: val('regEmail'), usuario: val('regUsuario'), nombre: val('regNombre'), apellidos: val('regApellidos'), password: val('regPassword') };
      const { user } = await createUserWithEmailAndPassword(auth, d.email, d.password);
      await Promise.all([updateProfile(user, { displayName: d.usuario }), sendEmailVerification(user)]);
      const wi = { usuario: d.usuario, email: d.email, nombre: d.nombre, apellidos: d.apellidos, rol: cfg.rol, uid: user.uid, terminos: true, tema: localStorage.wiTema };
      await setDoc(doc(db, cfg.db, d.usuario), { ...wi, creado: serverTimestamp() });
      await entrar(wi); Mensaje('✅ Cuenta creada. Verifica tu email', 'success');
    } catch (e) { Mensaje(err[e.code] || e.message, 'error'); }
    finally { wiSpin(this, false); }
  })
  .on('click.wi', '#Recuperar', async function () {
    wiSpin(this, true, 'Enviando');
    try {
      await sendPasswordResetEmail(auth, await correo(val('recEmail')));
      Mensaje('✅ Email enviado, revisa tu bandeja', 'success');
      setTimeout(() => mostrar('login'), 2000);
    } catch (e) { Mensaje(err[e.code] || e.message, 'error'); }
    finally { wiSpin(this, false); }
  })
  .on('click.wi', '.tema', async function () {
    const wi = getls('wiSmile'); if (!wi?.usuario) return;
    setTimeout(async () => {
      const t = localStorage.wiTema; if (!t) return;
      try {
        await setDoc(doc(db, cfg.db, wi.usuario), { tema: t, actualizado: serverTimestamp() }, { merge: true });
        savels('wiSmile', { ...wi, tema: t }, 24);
        Mensaje(`Tema ${t.split('|')[0]} guardado <i class="fas fa-check-circle"></i>`, 'success');
      } catch (e) { console.error('❌ tema:', e); }
    }, 0);
  });

// ==================== PUNTO DE ENTRADA ====================
onAuthStateChanged(auth, async user => {
  if (!user) return render();
  const wi = getls('wiSmile');
  if (wi) return entrar(wi);
  const snap = await getDoc(doc(db, cfg.db, user.displayName || user.email));
  snap.exists() ? entrar(snap.data()) : render();
});