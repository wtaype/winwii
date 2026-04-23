import $ from 'jquery';
import './perfil.css';
import { auth, db } from '../firebase.js';
import { doc, updateDoc } from 'firebase/firestore';
import { getls, savels, wicopy, Mensaje, wiTip, Saludar } from '../widev.js';
import { rutas } from '../rutas.js';

const wi = () => getls('wiSmile') || {};

export const render = () => {
  const u = wi();
  if (!u.email) { location.replace('/'); return ''; }
  const nombre    = u.nombre    || '';
  const apellidos = u.apellidos || '';
  const usuario   = u.usuario   || '';
  const email     = u.email     || '';
  const rol       = u.rol       || 'smile';
  const uid       = u.uid       || '';
  const imagen    = u.imagen    || './smile.avif';
  const ini       = ((nombre[0] || '') + (apellidos[0] || '')).toUpperCase() || '?';

  return `
  <div class="prf_wrap">

    <div class="prf_hero">
      <div class="prf_av_wrap">
        <img src="${imagen}" alt="${nombre}" class="prf_av" onerror="this.src='./smile.avif'">
        <div class="prf_av_ring"></div>
      </div>
      <div class="prf_hero_info">
        <h1 class="prf_fullname">${nombre} ${apellidos}</h1>
        <p class="prf_username"><i class="fas fa-at"></i> ${usuario}</p>
        <span class="prf_rol_chip"><i class="fas fa-shield-alt"></i> ${rol}</span>
      </div>
    </div>

    <div class="prf_grid">

      <div class="prf_card">
        <h2 class="prf_card_tit"><i class="fas fa-user-edit"></i> Editar perfil</h2>
        <label>Nombre</label>
        <input id="prf_nombre"    value="${nombre}"    placeholder="Tu nombre">
        <label>Apellidos</label>
        <input id="prf_apellidos" value="${apellidos}" placeholder="Tus apellidos">
        <button id="prf_guardar" class="prf_btn"><i class="fas fa-save"></i> Guardar cambios</button>
      </div>

      <div class="prf_card">
        <h2 class="prf_card_tit"><i class="fas fa-info-circle"></i> Datos de cuenta</h2>
        <div class="prf_row">
          <span class="prf_lbl"><i class="fas fa-envelope"></i> Email</span>
          <span class="prf_val">${email}</span>
        </div>
        <div class="prf_row">
          <span class="prf_lbl"><i class="fas fa-user"></i> Usuario</span>
          <span class="prf_val">@${usuario}</span>
        </div>
        <div class="prf_row">
          <span class="prf_lbl"><i class="fas fa-shield-alt"></i> Rol</span>
          <span class="prf_val prf_rol_val">${rol}</span>
        </div>
        <div class="prf_row prf_uid_row">
          <span class="prf_lbl"><i class="fas fa-fingerprint"></i> UID</span>
          <span class="prf_uid_val">${uid}</span>
          <button class="prf_copy" id="prf_copy_uid" ${wiTip('Copiar UID')}><i class="fas fa-copy"></i></button>
        </div>
      </div>

    </div>
  </div>`;
};

export const init = () => {
  if (!wi().email) return rutas.navigate('/');
  $(document)
    .on('click.prf', '#prf_guardar', async function () {
      const u        = wi();
      const nombre   = $('#prf_nombre').val().trim();
      const apellidos = $('#prf_apellidos').val().trim();
      if (!nombre) return wiTip(document.getElementById('prf_nombre'), 'Ingresa tu nombre', 'error');

      $(this).prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Guardando');
      try {
        await updateDoc(doc(db, 'smiles', u.usuario), { nombre, apellidos });
        savels('wiSmile', { ...u, nombre, apellidos }, 24);
        $('.prf_fullname').text(`${nombre} ${apellidos}`);
        Mensaje('Perfil actualizado ✅', 'success');
      } catch (e) {
        Mensaje('Error al guardar', 'error');
      } finally {
        $(this).prop('disabled', false).html('<i class="fas fa-save"></i> Guardar cambios');
      }
    })
    .on('click.prf', '#prf_copy_uid', function () {
      wicopy(wi().uid || '', this, '¡UID copiado!');
    });
};

export const cleanup = () => $(document).off('.prf');
