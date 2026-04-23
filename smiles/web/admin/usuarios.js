// ════════════════════════════════════════════════════════════════════
// usuarios.js — TypingWii · Admin · Gestión de Usuarios
// Jesús es mi Señor 🙏
// ════════════════════════════════════════════════════════════════════
import './usuarios.css';
import $ from 'jquery';
import { getls, Notificacion, avatar, formatearFechaHora } from '../widev.js';
import { db } from '../firebase.js';
import { collection, query, orderBy, limit, getDocs, doc, deleteDoc } from 'firebase/firestore';

const wi = () => getls('wiSmile');
let _usuarios = [];
let _filtro = 'todos';

// ── RENDER ────────────────────────────────────────────────────────────────────
export const render = () => {
  const u = wi();
  if (!u || u.rol !== 'admin') return `<div class="adu_page"><div class="adu_empty"><i class="fas fa-ban"></i><p>Acceso denegado.</p></div></div>`;

  return `
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

  </div>`;
};

// ── INIT ──────────────────────────────────────────────────────────────────────
export const init = async () => {
  const u = wi();
  if (!u || u.rol !== 'admin') return;

  $(document).off('.adu');
  await _cargarDatos();

  // Buscar
  $(document).on('input.adu', '#adu_input_search', function () {
    _renderTabla();
  });

  // Filtros
  $(document).on('click.adu', '.adu_filter_btn', function () {
    $('.adu_filter_btn').removeClass('active');
    $(this).addClass('active');
    _filtro = $(this).data('rol');
    _renderTabla();
  });

  // Actualizar DB
  $(document).on('click.adu', '#adu_btn_sync', async function () {
    const $i = $(this).find('i').addClass('fa-spin');
    await _cargarDatos(true);
    setTimeout(() => $i.removeClass('fa-spin'), 500);
  });

  // Acciones: Ver / Eliminar
  $(document).on('click.adu', '.adu_btn_ico.danger', async function () {
    const id = $(this).data('id');
    if (!confirm(`¿Atención! Eliminarás a "${id}" de forma permanente. ¿Continuar?`)) return;
    try {
      await deleteDoc(doc(db, 'smiles', id));
      Notificacion('Usuario eliminado', 'info');
      await _cargarDatos(true);
    } catch { Notificacion('Error al eliminar', 'error'); }
  });

  $(document).on('click.adu', '.adu_btn_ico.view', function () {
    const id = $(this).data('id');
    const u = _usuarios.find(x => x.id === id);
    if (u) _modalInfo(u);
  });

  // Cerrar modales
  $(document).on('click.adu', '.adu_modal_close, .adu_btn_cancel', () => $('#adu_modales').html(''));
  $(document).on('click.adu', '.adu_modal_bg', e => { if ($(e.target).hasClass('adu_modal_bg')) $('#adu_modales').html(''); });
};

export const cleanup = () => {
  $(document).off('.adu');
};

// ── DATOS ─────────────────────────────────────────────────────────────────────
async function _cargarDatos(forzar = false) {
  try {
    // Limitamos a 300. (Se remueve orderBy porque si 'fecha' no existe en el doc, Firestore no lo trae)
    const q = query(collection(db, 'smiles'), limit(300));
    const snap = await getDocs(q);
    
    _usuarios = snap.docs.map(d => ({ id: d.id, usuario: d.id, ...d.data() }));
    _renderTabla();
  } catch (err) {
    console.error('[admin_usuarios] Error:', err);
    $('#adu_table_body').html('<tr><td colspan="5"><div class="adu_empty" style="padding:4vh"><i class="fas fa-exclamation-triangle"></i><p>Error de conexión.</p></div></td></tr>');
  }
}

// ── RENDER TABLA ──────────────────────────────────────────────────────────────
function _renderTabla() {
  const txt = ($('#adu_input_search').val() || '').toLowerCase();
  
  const filtrados = _usuarios.filter(u => {
    // Filtro por Rol
    if (_filtro !== 'todos' && (u.rol || 'smile') !== _filtro) return false;
    // Filtro por Texto (email, id, nombre)
    if (txt) {
      const match = [u.id, u.email, u.nombre, u.nombres, u.apellidos].join(' ').toLowerCase();
      if (!match.includes(txt)) return false;
    }
    return true;
  });

  if (!filtrados.length) {
    $('#adu_table_body').html('<tr><td colspan="5"><div class="adu_empty" style="padding:4vh"><i class="fas fa-user-slash"></i><p>No se encontraron usuarios.</p></div></td></tr>');
    return;
  }

  const html = filtrados.map(u => {
    const nom = u.nombres || u.nombre || u.id;
    const em  = u.email || '—';
    const av  = avatar(nom);
    const rol = u.rol || 'smile';
    const fDate = u.fecha?.toDate ? formatearFechaHora(u.fecha) : '—';
    const dep = u.empresa || u.empresa_id || u.gestor || u.gestor_id || 'Independiente';

    return `
      <tr class="adu_row">
        <td>
          <div class="adu_user_cell">
            <div class="adu_av">${av}</div>
            <div>
              <div class="adu_nom">${nom}</div>
              <div class="adu_eml">${em}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="adu_role_badge ${rol}"><i class="fas fa-circle" style="font-size:0.6em;margin-right:0.4vh"></i> ${rol}</div>
        </td>
        <td>
          <span style="color:var(--tx3);font-weight:600"><i class="fas fa-building"></i> ${dep}</span>
        </td>
        <td>
          <div class="adu_date">${fDate.split(',')[0]}<small>${fDate.split(',')[1] || ''}</small></div>
        </td>
        <td>
          <div class="adu_actions">
            <button class="adu_btn_ico view" data-id="${u.id}" title="Ver detalles"><i class="fas fa-eye"></i></button>
            <button class="adu_btn_ico danger" data-id="${u.id}" title="Eliminar usuario"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
  }).join('');

  $('#adu_table_body').html(html);
}

// ── MODAL DETALLES ────────────────────────────────────────────────────────────
function _modalInfo(u) {
  const fDate = u.fecha?.toDate ? formatearFechaHora(u.fecha) : 'Desconocido';
  
  $('#adu_modales').html(`
    <div class="adu_modal_bg">
      <div class="adu_modal_card">
        <div class="adu_modal_hdr">
          <h3 class="adu_modal_title"><i class="fas fa-address-card"></i> Información del Usuario</h3>
          <button class="adu_modal_close"><i class="fas fa-times"></i></button>
        </div>
        <div class="adu_modal_body">
          <div class="adu_field">
            <label>Username (ID)</label>
            <input type="text" class="adu_input" value="${u.id}" disabled>
          </div>
          <div class="adu_field">
            <label>Nombres y Apellidos</label>
            <input type="text" class="adu_input" value="${u.nombres || u.nombre || ''} ${u.apellidos || ''}" disabled>
          </div>
          <div class="adu_field">
            <label>Correo Electrónico</label>
            <input type="text" class="adu_input" value="${u.email || '—'}" disabled>
          </div>
          <div style="display:flex;gap:2vh">
            <div class="adu_field" style="flex:1">
              <label>Rol de Acceso</label>
              <input type="text" class="adu_input" value="${u.rol || 'smile'}" style="text-transform:uppercase;font-weight:bold" disabled>
            </div>
            <div class="adu_field" style="flex:1">
              <label>Fecha de Registro</label>
              <input type="text" class="adu_input" value="${fDate}" disabled>
            </div>
          </div>
        </div>
        <div class="adu_modal_foot">
          <button class="adu_btn_cancel">Cerrar panel</button>
        </div>
      </div>
    </div>`);
}
