import './scrum.css';
import $ from 'jquery';
import Sortable from 'sortablejs';
import { db } from '../firebase.js';
import { collection, doc, setDoc, getDocs, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { Notificacion, getls, savels, wiTip, wiSpin, wiAuth, Saludar } from '../widev.js';
import { app } from '../../wii.js';

/* ══════════════════════════════════════════════════════════════
   SCRUM BOARD v1.0 — Kanban Premium
   ✨ 3 Columnas · Drag & Drop · Edición Inline · Sin Modal
══════════════════════════════════════════════════════════════ */

const CACHE = 'wii_scrum_v1', COL = 'scrum';

// Columnas del Scrum Board
const COLUMNAS = {
  planificacion: { label: 'Planificación', icon: 'fa-clipboard-list', color: '#FFB800' },
  analisis:      { label: 'Análisis',      icon: 'fa-search',         color: '#0EBEFF' },
  completado:    { label: 'Completado',    icon: 'fa-check-circle',   color: '#29C72E' }
};

const PRIOS = { alta: '#FF5C69', media: '#FFB800', baja: '#29C72E' };
const COLORES = ['#29C72E','#0EBEFF','#7000FF','#FF5C69','#FFB800','#94A3B8','#00C9B1','#EC4899'];

// State
let tareas = [], sortables = [], editando = null;
const wi = () => getls('wiSmile') || {};

// Utils
const hoy = () => new Date().toISOString().split('T')[0];
const mkId = tit => {
  const s = (tit || 'tarea').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 25);
  return `${s}_${Date.now()}`;
};
const _esc = t => String(t || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
const fmtFecha = ts => {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('es-PE', { day: 'numeric', month: 'short' });
};

// Cache
const _saveCache = d => { try { localStorage.setItem(CACHE, JSON.stringify(d)); } catch (_) {} };
const _getCache = () => { try { return JSON.parse(localStorage.getItem(CACHE) || '[]'); } catch (_) { return []; } };

// Sync indicator
const _sync = s => {
  const $d = $('.sb_dot');
  if (!$d.length) return;
  $d.removeClass('active error saving').addClass(s === 'ok' ? 'active' : s === 'error' ? 'error' : 'saving');
  $('.sb_dotxt').text(s === 'ok' ? 'Online' : s === 'loading' ? 'Cargando...' : s === 'saving' ? 'Guardando...' : 'Offline');
};

// Firestore
const _cargar = async (force = false) => {
  const u = wi();
  if (!u.email) return _sync('error');

  const cache = _getCache();
  if (!force && cache.length) {
    tareas = cache;
    _sync('ok');
    return;
  }

  _sync('loading');
  try {
    const snap = await getDocs(query(collection(db, COL), where('usuario', '==', u.usuario)));
    tareas = snap.docs.map(d => ({ id: d.id, _fsId: d.id, ...d.data() }));
    _saveCache(tareas);
    _sync('ok');
  } catch (e) {
    console.error('❌ scrum:', e);
    tareas = cache;
    _sync('error');
  }
};

const _guardarTarea = async (id) => {
  const u = wi();
  const $card = $(`.sb_card[data-id="${id}"]`);
  const tarea = tareas.find(t => t._fsId === id);
  if (!tarea) return;

  const titulo = $card.find('.sb_titulo').text().trim();
  const desc = $card.find('.sb_desc').text().trim();

  if (tarea.titulo === titulo && tarea.descripcion === desc) return;

  tarea.titulo = titulo;
  tarea.descripcion = desc;
  _saveCache(tareas);
  $card.addClass('saving');

  try {
    const { _fsId, id: _, ...data } = tarea;
    await setDoc(doc(db, COL, _fsId), { ...data, usuario: u.usuario, email: u.email, actualizado: serverTimestamp() });
    _sync('ok');
    $card.removeClass('saving').addClass('saved');
    setTimeout(() => $card.removeClass('saved'), 800);
  } catch (e) {
    console.error('❌', e);
    $card.removeClass('saving');
    _sync('error');
    Notificacion('Error al guardar', 'error');
  }
};

const _crearTarea = async (columna = 'planificacion') => {
  const u = wi();
  const id = mkId('tarea');

  const nueva = {
    id, _fsId: id,
    titulo: '',
    descripcion: '',
    columna,
    prio: 'media',
    color: COLUMNAS[columna].color,
    creado: new Date().toISOString(),
    orden: 0
  };

  tareas.unshift(nueva);
  _saveCache(tareas);
  _renderColumnas();

  setTimeout(() => {
    $(`.sb_card[data-id="${id}"]`).addClass('editing').find('.sb_titulo').focus();
  }, 50);

  try {
    const { _fsId, id: _, ...data } = nueva;
    await setDoc(doc(db, COL, id), { ...data, usuario: u.usuario, email: u.email, actualizado: serverTimestamp() });
    _sync('ok');
    Notificacion('Nueva tarea ✨', 'success', 1200);
  } catch (e) {
    console.error('❌', e);
    tareas = tareas.filter(t => t._fsId !== id);
    _saveCache(tareas);
    _renderColumnas();
    Notificacion('Error al crear', 'error');
  }
};

const _eliminar = async (id) => {
  const tarea = tareas.find(t => t._fsId === id);
  if (!tarea) return;

  const backup = [...tareas];
  tareas = tareas.filter(t => t._fsId !== id);
  _saveCache(tareas);

  $(`.sb_card[data-id="${id}"]`).addClass('deleting');
  setTimeout(() => _renderColumnas(), 250);

  try {
    await deleteDoc(doc(db, COL, id));
    Notificacion('Eliminada 🗑️', 'success', 1000);
    _updateStats();
  } catch (e) {
    console.error('❌', e);
    tareas = backup;
    _saveCache(tareas);
    _renderColumnas();
    Notificacion('Error al eliminar', 'error');
  }
};

const _moverTarea = async (id, columna) => {
  const tarea = tareas.find(t => t._fsId === id);
  if (!tarea || tarea.columna === columna) return;

  const oldColumna = tarea.columna;
  tarea.columna = columna;
  
  if (columna === 'completado' && oldColumna !== 'completado') {
    tarea.completado = new Date().toISOString();
    _confetti();
  }
  
  _saveCache(tareas);
  _updateStats();

  const u = wi();
  try {
    const { _fsId, id: _, ...data } = tarea;
    await setDoc(doc(db, COL, _fsId), { ...data, usuario: u.usuario, email: u.email, actualizado: serverTimestamp() });
    _sync('ok');
    const emoji = { planificacion: '📋', analisis: '🔍', completado: '🎉' }[columna];
    Notificacion(`${emoji} ${COLUMNAS[columna].label}`, 'success', 1200);
  } catch (e) {
    console.error('❌', e);
    tarea.columna = oldColumna;
    _saveCache(tareas);
    _renderColumnas();
    _sync('error');
  }
};

const _cambiarColor = async (id, color) => {
  const tarea = tareas.find(t => t._fsId === id);
  if (!tarea || tarea.color === color) return;

  tarea.color = color;
  _saveCache(tareas);
  _renderColumnas();

  const u = wi();
  try {
    const { _fsId, id: _, ...data } = tarea;
    await setDoc(doc(db, COL, _fsId), { ...data, usuario: u.usuario, email: u.email, actualizado: serverTimestamp() });
    _sync('ok');
  } catch (e) {
    console.error('❌', e);
  }
};

const _cambiarPrio = async (id, prio) => {
  const tarea = tareas.find(t => t._fsId === id);
  if (!tarea || tarea.prio === prio) return;

  tarea.prio = prio;
  _saveCache(tareas);
  _renderColumnas();

  const u = wi();
  try {
    const { _fsId, id: _, ...data } = tarea;
    await setDoc(doc(db, COL, _fsId), { ...data, usuario: u.usuario, email: u.email, actualizado: serverTimestamp() });
    _sync('ok');
  } catch (e) {
    console.error('❌', e);
  }
};

// Confetti
const _confetti = () => {
  const $c = $('<div class="sb_confetti"></div>').appendTo('body');
  const colors = ['#29C72E', '#0EBEFF', '#7000FF', '#FF5C69', '#FFB800'];
  for (let i = 0; i < 25; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    $(`<span style="--c:${color};--x:${(Math.random() - .5) * 200}px;--d:${Math.random() * .3}s"></span>`).appendTo($c);
  }
  setTimeout(() => $c.remove(), 1500);
};

// Stats
const _updateStats = () => {
  const plan = tareas.filter(t => t.columna === 'planificacion').length;
  const anal = tareas.filter(t => t.columna === 'analisis').length;
  const comp = tareas.filter(t => t.columna === 'completado').length;

  $('#sbPlan').text(plan);
  $('#sbAnal').text(anal);
  $('#sbComp').text(comp);
  $('#sbTotal').text(tareas.length);

  // Update column counts
  $('.sb_col[data-col="planificacion"] .sb_col_count').text(plan);
  $('.sb_col[data-col="analisis"] .sb_col_count').text(anal);
  $('.sb_col[data-col="completado"] .sb_col_count').text(comp);
};

// HTML Card
const _htmlCard = (t) => {
  const prio = t.prio || 'media';
  const isComplete = t.columna === 'completado';

  return `
  <div class="sb_card ${isComplete ? 'done' : ''}" data-id="${t._fsId}" style="--card-color:${t.color || '#0EBEFF'}">
    <div class="sb_card_bar"></div>
    <div class="sb_card_body">
      <div class="sb_card_head">
        <div class="sb_prio ${prio}" data-id="${t._fsId}" ${wiTip('Prioridad')}>
          <span class="sb_prio_dot"></span>
        </div>
        <div class="sb_card_tools">
          <button class="sb_color_btn" data-id="${t._fsId}" ${wiTip('Color')}>
            <i class="fas fa-palette"></i>
          </button>
          <button class="sb_del" data-id="${t._fsId}" ${wiTip('Eliminar')}>
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      
      <div class="sb_titulo" contenteditable="true" data-placeholder="Título de la tarea" spellcheck="false">${_esc(t.titulo)}</div>
      <div class="sb_desc" contenteditable="true" data-placeholder="Descripción..." spellcheck="false">${_esc(t.descripcion).replace(/\n/g, '<br>')}</div>
      
      <div class="sb_card_foot">
        <span class="sb_creado"><i class="fas fa-clock"></i> ${fmtFecha(t.creado)}</span>
        <span class="sb_saved"><i class="fas fa-check"></i></span>
      </div>
    </div>
    
    <!-- Dropdowns -->
    <div class="sb_dropdown sb_prios_dd" data-for="${t._fsId}">
      <div class="sb_dd_item ${prio === 'alta' ? 'active' : ''}" data-prio="alta">
        <span class="sb_prio_dot alta"></span> Alta
      </div>
      <div class="sb_dd_item ${prio === 'media' ? 'active' : ''}" data-prio="media">
        <span class="sb_prio_dot media"></span> Media
      </div>
      <div class="sb_dd_item ${prio === 'baja' ? 'active' : ''}" data-prio="baja">
        <span class="sb_prio_dot baja"></span> Baja
      </div>
    </div>
    
    <div class="sb_dropdown sb_colores_dd" data-for="${t._fsId}">
      <div class="sb_colores_grid">
        ${COLORES.map(c => `<span class="sb_color_opt ${t.color === c ? 'active' : ''}" data-color="${c}" style="--cc:${c}"></span>`).join('')}
      </div>
    </div>
  </div>`;
};

// Render columnas
const _renderColumnas = () => {
  Object.keys(COLUMNAS).forEach(col => {
    const cards = tareas.filter(t => t.columna === col);
    const $list = $(`.sb_col[data-col="${col}"] .sb_col_list`);
    
    if (cards.length === 0) {
      $list.html('<div class="sb_empty">Sin tareas</div>');
    } else {
      $list.html(cards.map(_htmlCard).join(''));
    }
  });
  
  _initSortables();
  _updateStats();
};

// Sortable
const _initSortables = () => {
  sortables.forEach(s => s.destroy());
  sortables = [];

  document.querySelectorAll('.sb_col_list').forEach(el => {
    const s = new Sortable(el, {
      group: 'scrum',
      animation: 180,
      ghostClass: 'sb_ghost',
      chosenClass: 'sb_chosen',
      dragClass: 'sb_drag',
      handle: '.sb_card',
      onEnd: async (evt) => {
        const id = evt.item.dataset.id;
        const newCol = evt.to.closest('.sb_col').dataset.col;
        const tarea = tareas.find(t => t._fsId === id);
        
        if (tarea && tarea.columna !== newCol) {
          await _moverTarea(id, newCol);
        }
      }
    });
    sortables.push(s);
  });
};

// Render
export const render = () => {
  const u = wi();
  const display = u.nombre || u.usuario || u.email || '';

  return `
  <div class="sb_container">
    <div class="sb_header">
      <div class="sb_info">
        <img src="/smile.avif" alt="${app}" class="sb_avatar" />
        <div class="sb_text">
          <h1><i class="fas fa-columns"></i> Scrum Board</h1>
          <p>${Saludar()} <strong>${display}</strong></p>
        </div>
      </div>
      <div class="sb_actions">
        <div class="sb_stats_mini">
          <span><i class="fas fa-clipboard-list" style="color:#FFB800"></i> <strong id="sbPlan">0</strong></span>
          <span><i class="fas fa-search" style="color:#0EBEFF"></i> <strong id="sbAnal">0</strong></span>
          <span><i class="fas fa-check-circle" style="color:#29C72E"></i> <strong id="sbComp">0</strong></span>
          <span class="sb_stats_sep"></span>
          <span><i class="fas fa-layer-group"></i> <strong id="sbTotal">0</strong></span>
        </div>
        <div class="sb_status_wrap">
          <div class="sb_status">
            <span class="sb_dot"></span>
            <span class="sb_dotxt">Cargando...</span>
          </div>
          <button class="sb_btn_sync" id="sbSync" ${wiTip('Sincronizar')}>
            <i class="fas fa-sync-alt"></i>
          </button>
        </div>
      </div>
    </div>
    
    <div class="sb_board">
      ${Object.entries(COLUMNAS).map(([key, col]) => `
      <div class="sb_col" data-col="${key}">
        <div class="sb_col_header" style="--col-color:${col.color}">
          <div class="sb_col_title">
            <i class="fas ${col.icon}"></i>
            <span>${col.label}</span>
            <span class="sb_col_count">0</span>
          </div>
          <button class="sb_col_add" data-col="${key}" ${wiTip('Agregar tarea')}>
            <i class="fas fa-plus"></i>
          </button>
        </div>
        <div class="sb_col_list"></div>
      </div>
      `).join('')}
    </div>
    
    <div class="sb_confirm" id="sbConfirm">
      <div class="sb_confirm_box">
        <i class="fas fa-trash-alt"></i>
        <h3>¿Eliminar tarea?</h3>
        <p>Esta acción no se puede deshacer</p>
        <div class="sb_confirm_btns">
          <button class="sb_cancel" id="sbCancel">Cancelar</button>
          <button class="sb_delete" id="sbDelete">Eliminar</button>
        </div>
      </div>
    </div>
  </div>`;
};

// Init
export const init = async () => {
  cleanup();

  const u = wi();
  if (!u.email) return;

  await _cargar();
  _renderColumnas();

  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const debouncedSave = debounce((id) => _guardarTarea(id), 1000);

  $(document)
    // Nueva tarea en columna
    .on('click.sb', '.sb_col_add', function () {
      const col = $(this).data('col');
      _crearTarea(col);
    })

    // Sync
    .on('click.sb', '#sbSync', async () => {
      $('#sbSync').addClass('spinning');
      localStorage.removeItem(CACHE);
      await _cargar(true);
      _renderColumnas();
      $('#sbSync').removeClass('spinning');
      Notificacion('Sincronizado ✓', 'success', 1500);
    })

    // Card click for editing
    .on('click.sb', '.sb_card', function (e) {
      if ($(e.target).closest('.sb_card_tools, .sb_dropdown, .sb_prio').length) return;
      $('.sb_card.editing').not(this).removeClass('editing');
      $(this).addClass('editing');
    })

    // Contenido editable
    .on('input.sb', '.sb_titulo, .sb_desc', function () {
      const id = $(this).closest('.sb_card').data('id');
      debouncedSave(id);
    })

    // Prio dropdown
    .on('click.sb', '.sb_prio', function (e) {
      e.stopPropagation();
      const id = $(this).data('id');
      $('.sb_dropdown').removeClass('show');
      $(`.sb_prios_dd[data-for="${id}"]`).toggleClass('show');
    })
    .on('click.sb', '.sb_prios_dd .sb_dd_item', function (e) {
      e.stopPropagation();
      const id = $(this).closest('.sb_dropdown').data('for');
      const prio = $(this).data('prio');
      _cambiarPrio(id, prio);
      $('.sb_dropdown').removeClass('show');
    })

    // Color dropdown
    .on('click.sb', '.sb_color_btn', function (e) {
      e.stopPropagation();
      const id = $(this).data('id');
      $('.sb_dropdown').removeClass('show');
      $(`.sb_colores_dd[data-for="${id}"]`).toggleClass('show');
    })
    .on('click.sb', '.sb_color_opt', function (e) {
      e.stopPropagation();
      const id = $(this).closest('.sb_dropdown').data('for');
      const color = $(this).data('color');
      _cambiarColor(id, color);
      $('.sb_dropdown').removeClass('show');
    })

    // Delete
    .on('click.sb', '.sb_del', function (e) {
      e.stopPropagation();
      editando = $(this).data('id');
      $('#sbConfirm').addClass('show');
    })
    .on('click.sb', '#sbCancel, #sbConfirm', function (e) {
      if ($(e.target).is('#sbCancel, #sbConfirm')) {
        $('#sbConfirm').removeClass('show');
        editando = null;
      }
    })
    .on('click.sb', '#sbDelete', () => {
      if (editando) {
        _eliminar(editando);
        $('#sbConfirm').removeClass('show');
        editando = null;
      }
    })

    // Close dropdowns on outside click
    .on('click.sb', e => {
      if (!$(e.target).closest('.sb_dropdown, .sb_prio, .sb_color_btn').length) {
        $('.sb_dropdown').removeClass('show');
      }
    })

    // Keyboard shortcuts
    .on('keydown.sb', e => {
      if ($('#sbConfirm').hasClass('show')) return;
      if (e.target.contentEditable === 'true' || e.target.tagName === 'INPUT') return;
      if (e.key === 'n' || e.key === 'N') { e.preventDefault(); _crearTarea('planificacion'); }
    });

  wiAuth(() => { _cargar(true).then(() => _renderColumnas()); });
  console.log('✅ Scrum Board v1.0');
};

export const cleanup = () => {
  sortables.forEach(s => s.destroy());
  sortables = [];
  $(document).off('.sb');
  tareas = [];
  editando = null;
};