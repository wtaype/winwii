// ════════════════════════════════════════════════════════════════════
// permisos.js — TypingWii · Admin · Gestión de Roles
// Jesús es mi Señor 🙏
// ════════════════════════════════════════════════════════════════════
import './permisos.css';
import $ from 'jquery';
import { getls, Notificacion, avatar } from '../widev.js';
import { db } from '../firebase.js';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

const wi = () => getls('wiSmile');
let _vips = [];

// ── RENDER ────────────────────────────────────────────────────────────────────
export const render = () => {
  const u = wi();
  if (!u || u.rol !== 'admin') return `<div class="adp_page"><div class="adp_empty"><i class="fas fa-ban"></i><p>Acceso denegado.</p></div></div>`;

  return `
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

  </div>`;
};

// ── INIT ──────────────────────────────────────────────────────────────────────
export const init = async () => {
  const u = wi();
  if (!u || u.rol !== 'admin') return;

  $(document).off('.adp');
  await _cargarVIPs();

  // Buscar usuario directo
  $(document).on('click.adp', '#adp_btn_search', async function () {
    const id = $('#adp_inp_search').val().trim();
    if (!id) return;
    const $btn = $(this).prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i>');
    try {
      const d = await getDoc(doc(db, 'smiles', id));
      if (d.exists()) {
        _modalRol({ id: d.id, ...d.data() });
      } else {
        Notificacion('Usuario no encontrado', 'warning');
      }
    } catch { Notificacion('Error en la búsqueda', 'error'); }
    $btn.prop('disabled', false).html('<i class="fas fa-search"></i> Buscar');
  });

  $(document).on('keydown.adp', '#adp_inp_search', e => { if (e.key === 'Enter') $('#adp_btn_search').click(); });

  // Editar VIP desde el Grid
  $(document).on('click.adp', '.adp_btn_edit', function () {
    const id = $(this).data('id');
    const usr = _vips.find(x => x.id === id);
    if (usr) _modalRol(usr);
  });

  // Interacción Modal
  $(document).on('click.adp', '.adp_role_opt', function () {
    $('.adp_role_opt').removeClass('selected');
    $(this).addClass('selected');
  });

  // Guardar Nuevo Rol
  $(document).on('click.adp', '#adp_btn_save_rol', async function () {
    const id = $(this).data('id');
    const rol = $('.adp_role_opt.selected').data('rol');
    if (!rol) return;

    if (id === u.usuario && rol !== 'admin') {
      if (!confirm('¿Estás seguro de quitarte los permisos de admin a ti mismo? Cerrarás tu propia sesión.')) return;
    }

    const $btn = $(this).prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Guardando...');
    try {
      await updateDoc(doc(db, 'smiles', id), { rol });
      Notificacion(`Rol actualizado a ${rol.toUpperCase()}`, 'success');
      _cerrarModales();
      $('#adp_inp_search').val('');
      await _cargarVIPs();

      // Autodespido
      if (id === u.usuario && rol !== 'admin') {
        const misDatos = getls('wiSmile');
        misDatos.rol = rol;
        localStorage.setItem('wiSmile', JSON.stringify(misDatos));
        setTimeout(() => location.reload(), 1000);
      }
    } catch {
      Notificacion('Error al guardar', 'error');
      $btn.prop('disabled', false).html('Guardar Permisos');
    }
  });

  // Cerrar modales
  $(document).on('click.adp', '.adp_modal_close, .adp_btn_cancel', _cerrarModales);
  $(document).on('click.adp', '.adp_modal_bg', e => { if ($(e.target).hasClass('adp_modal_bg')) _cerrarModales(); });
};

export const cleanup = () => {
  $(document).off('.adp');
};

function _cerrarModales() { $('#adp_modales').html(''); }

// ── DATOS VIPs ────────────────────────────────────────────────────────────────
async function _cargarVIPs() {
  try {
    const q = query(collection(db, 'smiles'), where('rol', 'in', ['gestor', 'empresa', 'admin']));
    const snap = await getDocs(q);
    
    _vips = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    _renderGrid();
  } catch (err) {
    console.error('[admin_permisos] Error VIPs:', err);
    $('#adp_grid').html('<div class="adp_empty"><i class="fas fa-exclamation-triangle"></i><p>Error cargando cuentas VIP.</p></div>');
  }
}

// ── RENDER GRID VIP ───────────────────────────────────────────────────────────
function _renderGrid() {
  if (!_vips.length) {
    $('#adp_grid').html('<div class="adp_empty"><i class="fas fa-user-shield"></i><p>No hay cuentas privilegiadas asignadas aún.</p></div>');
    return;
  }

  const colors = { gestor: '#8b5cf6', empresa: '#f59e0b', admin: '#020617' };

  const html = _vips.map(u => {
    const rol = u.rol || 'smile';
    const c   = colors[rol] || '#38bdf8';
    const nom = u.nombres || u.nombre || u.id;
    const em  = u.email || 'Sin correo registrado';
    const av  = avatar(nom);

    return `
      <div class="adp_card" style="--clr:${c}">
        <div class="adp_c_rol">${rol}</div>
        <div class="adp_av">${av}</div>
        <div class="adp_nom">${nom}</div>
        <div class="adp_eml">${em}</div>
        <button class="adp_btn_edit" data-id="${u.id}"><i class="fas fa-sliders-h"></i> Editar Rol</button>
      </div>`;
  }).join('');

  $('#adp_grid').html(html);
}

// ── MODAL ASIGNAR ROL ─────────────────────────────────────────────────────────
function _modalRol(u) {
  const nom = u.nombres || u.nombre || u.id;
  const av  = avatar(nom);
  const cur = u.rol || 'smile';

  const ROLES = [
    { id: 'smile',   ic: 'fa-user',       tit: 'Estudiante', sub: 'Acceso estándar. Modo práctica y lecciones.', c: '#38bdf8' },
    { id: 'gestor',  ic: 'fa-chalkboard-teacher', tit: 'Gestor (Profesor)', sub: 'Puede crear clases y ver notas de alumnos.', c: '#8b5cf6' },
    { id: 'empresa', ic: 'fa-building',   tit: 'Empresa',    sub: 'Panel corporativo, departamentos y certificados.', c: '#f59e0b' },
    { id: 'admin',   ic: 'fa-crown',      tit: 'Admin', sub: 'Control total de la plataforma y usuarios.', c: '#020617' }
  ];

  const htmlRoles = ROLES.map(r => `
    <div class="adp_role_opt ${cur === r.id ? 'selected' : ''}" data-rol="${r.id}" style="--ac:${r.c}">
      <i class="fas ${r.ic}"></i>
      <b>${r.tit}</b>
      <small>${r.sub}</small>
    </div>
  `).join('');

  $('#adp_modales').html(`
    <div class="adp_modal_bg">
      <div class="adp_modal_card">
        <div class="adp_modal_hdr">
          <h3 class="adp_modal_title"><i class="fas fa-user-tag"></i> Asignar Permisos</h3>
          <button class="adp_modal_close"><i class="fas fa-times"></i></button>
        </div>
        <div class="adp_modal_body">
          <div class="adp_usr_preview">
            <div class="adp_av" style="width:5vh;height:5vh;margin:0;font-size:2vh">${av}</div>
            <div>
              <div style="font-weight:800;font-size:var(--fz_m1);color:var(--tx)">${nom}</div>
              <div style="font-size:var(--fz_s4);color:var(--tx3)">@${u.id}</div>
            </div>
          </div>
          <div style="font-weight:700;color:var(--tx)">Selecciona el nivel de acceso:</div>
          <div class="adp_roles_grid">
            ${htmlRoles}
          </div>
        </div>
        <div class="adp_modal_foot">
          <button class="adp_btn_cancel">Cancelar</button>
          <button class="adp_btn_save" id="adp_btn_save_rol" data-id="${u.id}">Guardar Permisos</button>
        </div>
      </div>
    </div>`);
}
