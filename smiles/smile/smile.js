import './smile.css';
import $ from 'jquery';
import { auth, db } from './firebase.js';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Notificacion, wicopy, wiTip, getls } from '../widev.js';
import { app } from '../wii.js';

const waitAuth = () => new Promise(r => {
  if (auth.currentUser) return r(auth.currentUser);
  const unsub = onAuthStateChanged(auth, u => { unsub(); r(u); });
});

let mensajes = [];
let eliminarId = null;

export const render = () => `
  <div class="smile_container">
    <div class="smile_header">
      <div class="header_left">
        <h1><i class="fas fa-inbox"></i> Mis mensajes</h1>
        <p id="smileUser"></p>
      </div>
      <button class="btn_actualizar" id="btnActualizar">
        <i class="fas fa-sync-alt"></i>
        <span>Actualizar</span>
      </button>
    </div>

    <div class="smile_table_wrapper">
      <table class="smile_table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Título</th>
            <th>Para</th>
            <th>Fecha</th>
            <th>Vistas</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="smileTableBody">
          <tr><td colspan="6" class="loading_td"><i class="fas fa-spinner fa-pulse"></i> Cargando...</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="modal_overlay" id="modalEliminar">
    <div class="modal_content">
      <div class="modal_icon"><i class="fas fa-trash-alt"></i></div>
      <h3>¿Eliminar mensaje?</h3>
      <p>Esta acción no se puede deshacer</p>
      <div class="modal_actions">
        <button class="btn_modal_cancelar" id="btnCancelar"><i class="fas fa-times"></i> Cancelar</button>
        <button class="btn_modal_eliminar" id="btnConfirmar"><i class="fas fa-trash"></i> Eliminar</button>
      </div>
    </div>
  </div>
`;

export const init = async () => {
  console.log(`✅ Smile de ${app}`);
  
  const user = await waitAuth();
  if (!user) return Notificacion('Debes iniciar sesión', 'error'), window.location.hash = '#/auth?mode=login';

  const wi = getls('wiSmile');
  $('#smileUser').html(`<i class="fas fa-user"></i> ${wi?.usuario || auth.currentUser.email} • ${wi?.email || auth.currentUser.email}`);

  $(document).on('click.sm', '#btnActualizar', cargarMensajes)
    .on('click.sm', '#btnCancelar, #modalEliminar', (e) => $(e.target).is('#btnCancelar, #modalEliminar') && cerrarModal())
    .on('click.sm', '#btnConfirmar', confirmarEliminar)
    .on('click.sm', '.btn_abrir', (e) => window.open($(e.currentTarget).data('url'), '_blank'))
    .on('click.sm', '.btn_copiar', (e) => wicopy($(e.currentTarget).data('url'), e.currentTarget, '¡Copiado!'))
    .on('click.sm', '.btn_eliminar_msg', (e) => { eliminarId = $(e.currentTarget).data('id'); $('#modalEliminar').addClass('show'); });

  await cargarMensajes();
};

async function cargarMensajes() {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const $btn = $('#btnActualizar');
  $btn.find('i').addClass('fa-spin').end().prop('disabled', true);

  mostrarSkeleton();

  try {
    const q = query(collection(db, 'wiLoves'), where('uid', '==', uid));
    const snapshot = await getDocs(q);
    mensajes = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

    mensajes.sort((a, b) => {
      const fA = a.creado?.toDate?.() || a.creado?.seconds ? new Date(a.creado.seconds * 1000) : new Date(a.creado || 0);
      const fB = b.creado?.toDate?.() || b.creado?.seconds ? new Date(b.creado.seconds * 1000) : new Date(b.creado || 0);
      return fB - fA;
    });

    renderMensajes(mensajes);
    console.log(`📬 ${mensajes.length} mensajes`);
  } catch (error) {
    console.error('❌', error);
    $('#smileTableBody').html(`
      <tr><td colspan="6" class="error_td">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Error: ${error.message}</p>
        <button class="btn_reintentar" onclick="location.reload()"><i class="fas fa-redo"></i> Reintentar</button>
      </td></tr>
    `);
  } finally {
    $btn.find('i').removeClass('fa-spin').end().prop('disabled', false);
  }
}

function mostrarSkeleton() {
  $('#smileTableBody').html(Array(5).fill(0).map(() => `
    <tr class="skeleton_row">
      <td><div class="sk_badge"></div></td>
      <td><div class="sk_line sk_title"></div></td>
      <td><div class="sk_line sk_text"></div></td>
      <td><div class="sk_line sk_date"></div></td>
      <td><div class="sk_line sk_vistas"></div></td>
      <td><div class="td_actions">${Array(3).fill('<div class="sk_btn"></div>').join('')}</div></td>
    </tr>
  `).join(''));
}

function renderMensajes(lista) {
  if (!lista.length) {
    return $('#smileTableBody').html(`
      <tr><td colspan="6" class="empty_td">
        <div class="empty_icon"><i class="fas fa-inbox"></i></div>
        <h3>No tienes mensajes</h3>
        <p>Crea tu primer mensaje en <a href="#/crear">Crear mensaje</a></p>
      </td></tr>
    `);
  }

  const iconos = { amor: 'fa-heart', amistad: 'fa-user-friends', saludo: 'fa-gift', declaracion: 'fa-comment-dots', aniversario: 'fa-calendar-star', carta: 'fa-envelope' };
  
  $('#smileTableBody').html(lista.map(m => {
    const tipo = m.plantilla || 'amor';
    const icono = iconos[tipo] || 'fa-envelope';
    const titulo = esc(m.nombre || m.de || 'Sin título');
    const para = esc(m.para || 'Alguien especial');
    const url = `${location.origin}/?${m.id}`;

    return `
      <tr data-id="${m.id}">
        <td><span class="badge_tipo ${tipo}"><i class="fas ${icono}"></i> ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span></td>
        <td class="td_titulo">${titulo}</td>
        <td class="td_para">${para}</td>
        <td class="td_fecha">${formatFecha(m.creado)}</td>
        <td class="td_vistas">${m.vistas || 0}</td>
        <td>
          <div class="td_actions">
            <button class="btn_action btn_abrir" data-url="${url}" ${wiTip('Abrir')}><i class="fas fa-external-link-alt"></i></button>
            <button class="btn_action btn_copiar" data-url="${url}" ${wiTip('Copiar')}><i class="fas fa-link"></i></button>
            <button class="btn_action btn_eliminar_msg" data-id="${m.id}" ${wiTip('Eliminar')}><i class="fas fa-trash-alt"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join(''));
}

function cerrarModal() {
  eliminarId = null;
  $('#modalEliminar').removeClass('show');
}

async function confirmarEliminar() {
  if (!eliminarId) return;
  const id = eliminarId;
  cerrarModal();

  try {
    $(`tr[data-id="${id}"]`).addClass('removing');
    await deleteDoc(doc(db, 'wiLoves', id));
    setTimeout(() => {
      mensajes = mensajes.filter(m => m.id !== id);
      renderMensajes(mensajes);
    }, 300);
    Notificacion('Mensaje eliminado 🗑️', 'success');
  } catch (error) {
    console.error('❌', error);
    $(`tr[data-id="${id}"]`).removeClass('removing');
    Notificacion('Error al eliminar', 'error');
  }
}

const esc = (t) => !t ? '' : String(t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));

function formatFecha(ts) {
  if (!ts) return 'Reciente';
  let f = ts.toDate?.() || (ts.seconds ? new Date(ts.seconds * 1000) : new Date(ts));
  if (isNaN(f.getTime())) return 'Reciente';
  const diff = new Date() - f;
  const min = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const dias = Math.floor(diff / 86400000);
  if (min < 1) return 'Ahora';
  if (min < 60) return `${min}m`;
  if (hrs < 24) return `${hrs}h`;
  if (dias < 7) return `${dias}d`;
  if (dias < 30) return `${Math.floor(dias / 7)} sem`;
  return f.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

export const cleanup = () => {
  console.log('🧹 Smile');
  mensajes = [];
  eliminarId = null;
  $(document).off('.sm');
};