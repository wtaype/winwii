import './agregar.css';
import $ from 'jquery';
import { db, auth } from '../firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';
import { wiTip, getls, Notificacion, wiSpin } from '../widev.js';

const COL_AUDIO = 'wiAudios';
const COL_IMG   = 'wiImg';

const getEmail = () => {
  const wi = getls('wiSmile');
  return wi?.email || auth.currentUser?.email || '';
};

const listar = async (col) => {
  const email = getEmail();
  if (!email) return [];
  const q = query(collection(db, col), where('email', '==', email));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.creado?.seconds || 0) - (a.creado?.seconds || 0));
};

const agregar = async (col, titulo, src) => {
  const email = getEmail();
  if (!email) return null;
  const ref = await addDoc(collection(db, col), {
    email, titulo, src,
    creado: serverTimestamp(),
    actualizado: serverTimestamp()
  });
  return ref.id;
};

const eliminar = async (col, id) => {
  await deleteDoc(doc(db, col, id));
};

// ==================== EXPORTAR para crear.js ====================
export const misAudios  = () => listar(COL_AUDIO);
export const misImagenes = () => listar(COL_IMG);

// ==================== RENDER ====================
const renderItem = (item, col) => `
<div class="ag_item" data-id="${item.id}" data-col="${col}">
  <div class="ag_item_info">
    <span class="ag_item_titulo">${item.titulo}</span>
    <span class="ag_item_src" title="${item.src}">${item.src.length > 50 ? item.src.substring(0, 50) + '...' : item.src}</span>
  </div>
  <div class="ag_item_accs">
    <button class="ag_copiar" ${wiTip('Copiar URL')}><i class="fas fa-copy"></i></button>
    <button class="ag_eliminar" ${wiTip('Eliminar')}><i class="fas fa-trash"></i></button>
  </div>
</div>`;

const renderLista = (items, col) => items.length
  ? items.map(i => renderItem(i, col)).join('')
  : '<p class="ag_vacio"><i class="fas fa-inbox"></i> Sin elementos guardados</p>';

export const render = () => `
<div class="agregar">
  <h2 class="ag_titulo"><i class="fas fa-folder-plus"></i> Mis Recursos</h2>

  <div class="ag_grid">
    <div class="ag_sec">
      <h3 class="ag_stit"><i class="fas fa-music"></i> Audios</h3>
      <div class="ag_form">
        <div class="ag_row">
          <div class="ag_inp"><i class="fas fa-tag"></i><input id="agAudTit" maxlength="40" placeholder="Título"></div>
          <div class="ag_inp ag_inp_url"><i class="fas fa-link"></i><input id="agAudSrc" maxlength="300" placeholder="URL del audio (.mp3)"></div>
          <button class="ag_btn" id="agAudBtn"><i class="fas fa-plus"></i> Agregar</button>
        </div>
      </div>
      <div class="ag_lista" id="agAudList"><p class="ag_vacio"><i class="fas fa-spinner fa-spin"></i> Cargando...</p></div>
    </div>

    <div class="ag_sec">
      <h3 class="ag_stit"><i class="fas fa-image"></i> Imágenes</h3>
      <div class="ag_form">
        <div class="ag_row">
          <div class="ag_inp"><i class="fas fa-tag"></i><input id="agImgTit" maxlength="40" placeholder="Título"></div>
          <div class="ag_inp ag_inp_url"><i class="fas fa-link"></i><input id="agImgSrc" maxlength="300" placeholder="URL de la imagen"></div>
          <button class="ag_btn" id="agImgBtn"><i class="fas fa-plus"></i> Agregar</button>
        </div>
      </div>
      <div class="ag_lista" id="agImgList"><p class="ag_vacio"><i class="fas fa-spinner fa-spin"></i> Cargando...</p></div>
    </div>
  </div>
</div>`;

// ==================== INIT ====================
export const init = async () => {
  const email = getEmail();
  if (!email) return Notificacion('Inicia sesión para gestionar recursos', 'warning');

  const cargarAudios = async () => {
    const items = await listar(COL_AUDIO);
    $('#agAudList').html(renderLista(items, COL_AUDIO));
  };
  const cargarImagenes = async () => {
    const items = await listar(COL_IMG);
    $('#agImgList').html(renderLista(items, COL_IMG));
  };

  await Promise.all([cargarAudios(), cargarImagenes()]);

  // Agregar audio
  $(document).on('click.ag', '#agAudBtn', async function () {
    const titulo = $('#agAudTit').val().trim();
    const src = $('#agAudSrc').val().trim();
    if (!titulo || !src) return Notificacion('Completa título y URL', 'warning');
    wiSpin(this, true);
    try {
      await agregar(COL_AUDIO, titulo, src);
      $('#agAudTit, #agAudSrc').val('');
      await cargarAudios();
      Notificacion('Audio guardado 🎵', 'success');
    } catch (e) { console.error(e); Notificacion('Error al guardar', 'error'); }
    finally { wiSpin(this, false); }
  });

  // Agregar imagen
  $(document).on('click.ag', '#agImgBtn', async function () {
    const titulo = $('#agImgTit').val().trim();
    const src = $('#agImgSrc').val().trim();
    if (!titulo || !src) return Notificacion('Completa título y URL', 'warning');
    wiSpin(this, true);
    try {
      await agregar(COL_IMG, titulo, src);
      $('#agImgTit, #agImgSrc').val('');
      await cargarImagenes();
      Notificacion('Imagen guardada 🖼️', 'success');
    } catch (e) { console.error(e); Notificacion('Error al guardar', 'error'); }
    finally { wiSpin(this, false); }
  });

  // Copiar URL
  $(document).on('click.ag', '.ag_copiar', function () {
    const src = $(this).closest('.ag_item').find('.ag_item_src').attr('title');
    navigator.clipboard.writeText(src);
    Notificacion('URL copiada', 'success');
  });

  // Eliminar
  $(document).on('click.ag', '.ag_eliminar', async function () {
    const item = $(this).closest('.ag_item');
    const id = item.data('id');
    const col = item.data('col');
    item.css('opacity', '.4');
    try {
      await eliminar(col, id);
      item.slideUp(200, () => item.remove());
      Notificacion('Eliminado', 'info');
    } catch (e) { console.error(e); item.css('opacity', '1'); Notificacion('Error', 'error'); }
  });
};

export const cleanup = () => { $(document).off('.ag'); };