import './emojis.css';
import $ from 'jquery';
import { Notificacion, getls, savels, wiTip, Saludar } from '../widev.js';
import { app } from '../wii.js';

/* ══════════════════════════════════════════════════════════════
   EMOJIS v1.0 — Selector de Emojis + Notepad
   ✨ Copiar emojis · Notepad persistente · WhatsApp Style
══════════════════════════════════════════════════════════════ */

const CACHE_NOTEPAD = 'wii_emojis_notepad';
const CACHE_RECIENTES = 'wii_emojis_recientes';

// Categorías de emojis
const CATEGORIAS = {
  recientes: { icon: 'fa-clock', label: 'Recientes' },
  caras: { icon: 'fa-smile', label: 'Caras' },
  corazones: { icon: 'fa-heart', label: 'Corazones' },
  manos: { icon: 'fa-hand-paper', label: 'Manos' },
  animales: { icon: 'fa-paw', label: 'Animales' },
  comida: { icon: 'fa-utensils', label: 'Comida' },
  objetos: { icon: 'fa-lightbulb', label: 'Objetos' },
  simbolos: { icon: 'fa-star', label: 'Símbolos' },
  banderas: { icon: 'fa-flag', label: 'Banderas' }
};

// Base de datos de emojis
const EMOJIS = {
  caras: [
    '😀','😃','😄','😁','😆','😅','🤣','😂','🙂','🙃','😉','😊','😇','🥰','😍','🤩',
    '😘','😗','☺️','😚','😙','🥲','😋','😛','😜','🤪','😝','🤑','🤗','🤭','🤫','🤔',
    '🤐','🤨','😐','😑','😶','😏','😒','🙄','😬','🤥','😌','😔','😪','🤤','😴','😷',
    '🤒','🤕','🤢','🤮','🤧','🥵','🥶','🥴','😵','🤯','🤠','🥳','🥸','😎','🤓','🧐',
    '😕','😟','🙁','☹️','😮','😯','😲','😳','🥺','😦','😧','😨','😰','😥','😢','😭',
    '😱','😖','😣','😞','😓','😩','😫','🥱','😤','😡','😠','🤬','😈','👿','💀','☠️',
    '💩','🤡','👹','👺','👻','👽','👾','🤖','😺','😸','😹','😻','😼','😽','🙀','😿','😾'
  ],
  corazones: [
    '❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖',
    '💘','💝','💟','♥️','🫀','❤️‍🔥','❤️‍🩹','🩷','🩵','🩶','💌','💋','👄','🫦','💑','👩‍❤️‍👨',
    '👨‍❤️‍👨','👩‍❤️‍👩','💏','👩‍❤️‍💋‍👨','👨‍❤️‍💋‍👨','👩‍❤️‍💋‍👩','🥰','😍','😘','😻','💐','🌹','🥀','🌷','🌸','💮'
  ],
  manos: [
    '👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆',
    '🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️',
    '💅','🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🧠','🫀','🫁','🦷','🦴','👀',
    '👁️','👅','👄','🫦','💋','👶','🧒','👦','👧','🧑','👱','👨','🧔','👩','🧓','👴','👵'
  ],
  animales: [
    '🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐻‍❄️','🐨','🐯','🦁','🐮','🐷','🐽','🐸',
    '🐵','🙈','🙉','🙊','🐒','🐔','🐧','🐦','🐤','🐣','🐥','🦆','🦅','🦉','🦇','🐺',
    '🐗','🐴','🦄','🐝','🪱','🐛','🦋','🐌','🐞','🐜','🪰','🪲','🪳','🦟','🦗','🕷️',
    '🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳',
    '🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🦣','🐘','🦛','🦏','🐪','🐫','🦒','🦘'
  ],
  comida: [
    '🍏','🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥',
    '🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🌽','🥕','🫒','🧄','🧅','🥔','🍠',
    '🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴',
    '🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🍝','🍜',
    '🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥠','🥮','🍢','🍡','🍧',
    '🍨','🍦','🥧','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯'
  ],
  objetos: [
    '📱','💻','⌨️','🖥️','🖨️','🖱️','🖲️','💽','💾','💿','📀','📼','📷','📸','📹','🎥',
    '📽️','🎞️','📞','☎️','📟','📠','📺','📻','🎙️','🎚️','🎛️','🧭','⏱️','⏲️','⏰','🕰️',
    '⌛','⏳','📡','🔋','🔌','💡','🔦','🕯️','🧯','🛢️','💸','💵','💴','💶','💷','🪙',
    '💰','💳','💎','⚖️','🪜','🧰','🪛','🔧','🔨','⚒️','🛠️','⛏️','🪚','🔩','⚙️','🪤',
    '🧱','⛓️','🧲','🔫','💣','🧨','🪓','🔪','🗡️','⚔️','🛡️','🚬','⚰️','🪦','⚱️','🏺'
  ],
  simbolos: [
    '⭐','🌟','✨','💫','⚡','🔥','💥','☀️','🌙','🌈','☁️','❄️','💧','🌊','🎯','🏆',
    '🥇','🥈','🥉','🏅','🎖️','🎗️','🎪','🎭','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🎷',
    '🎺','🎸','🪕','🎻','🎲','♟️','🎯','🎳','🎮','🕹️','🎰','🧩','♠️','♥️','♦️','♣️',
    '🃏','🀄','🎴','🔮','✅','❌','❓','❗','💯','🔴','🟠','🟡','🟢','🔵','🟣','⚫',
    '⚪','🟤','🔶','🔷','🔸','🔹','🔺','🔻','💠','🔘','🔳','🔲','▪️','▫️','◾','◽'
  ],
  banderas: [
    '🏳️','🏴','🏁','🚩','🏳️‍🌈','🏳️‍⚧️','🇦🇷','🇧🇴','🇧🇷','🇨🇱','🇨🇴','🇨🇷','🇨🇺','🇩🇴','🇪🇨','🇸🇻',
    '🇬🇹','🇭🇳','🇲🇽','🇳🇮','🇵🇦','🇵🇾','🇵🇪','🇵🇷','🇺🇾','🇻🇪','🇪🇸','🇺🇸','🇬🇧','🇫🇷','🇩🇪','🇮🇹',
    '🇵🇹','🇯🇵','🇰🇷','🇨🇳','🇮🇳','🇷🇺','🇦🇺','🇨🇦','🇳🇱','🇧🇪','🇨🇭','🇦🇹','🇸🇪','🇳🇴','🇩🇰','🇫🇮'
  ]
};

// State
let categoriaActual = 'caras';
let recientes = [];
const wi = () => getls('wiSmile') || {};

// Utils
const _getRecientes = () => {
  try {
    return JSON.parse(localStorage.getItem(CACHE_RECIENTES) || '[]');
  } catch { return []; }
};

const _saveRecientes = (arr) => {
  localStorage.setItem(CACHE_RECIENTES, JSON.stringify(arr.slice(0, 32)));
};

const _addReciente = (emoji) => {
  recientes = _getRecientes();
  recientes = recientes.filter(e => e !== emoji);
  recientes.unshift(emoji);
  recientes = recientes.slice(0, 32);
  _saveRecientes(recientes);
};

const _getNotepad = () => localStorage.getItem(CACHE_NOTEPAD) || '';
const _saveNotepad = (txt) => localStorage.setItem(CACHE_NOTEPAD, txt);

// Copiar al portapapeles
const _copiar = async (texto) => {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = texto;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    return true;
  }
};

// Render emojis grid
const _renderEmojis = (filtro = '') => {
  let emojis = [];
  
  if (categoriaActual === 'recientes') {
    emojis = _getRecientes();
  } else {
    emojis = EMOJIS[categoriaActual] || [];
  }
  
  // Filtrar si hay búsqueda
  if (filtro) {
    const allEmojis = Object.values(EMOJIS).flat();
    emojis = allEmojis.filter(e => e.includes(filtro));
  }
  
  const $grid = $('.em_grid');
  if (emojis.length === 0) {
    $grid.html('<div class="em_empty">No hay emojis</div>');
    return;
  }
  
  $grid.html(emojis.map(e => `
    <button class="em_emoji" data-emoji="${e}" ${wiTip('Click para copiar')}>
      ${e}
    </button>
  `).join(''));
};

// Render
export const render = () => {
  const u = wi();
  const display = u.nombre || u.usuario || u.email || '';
  recientes = _getRecientes();

  return `
  <div class="em_container">
    <div class="em_header">
      <div class="em_info">
        <img src="/smile.avif" alt="${app}" class="em_avatar" />
        <div class="em_text">
          <h1><i class="fas fa-smile-wink"></i> Emojis</h1>
          <p>${Saludar()} <strong>${display}</strong></p>
        </div>
      </div>
      <div class="em_actions">
        <button class="em_btn" id="emCopiarTodo" ${wiTip('Copiar todo el texto')}>
          <i class="fas fa-copy"></i> Copiar Todo
        </button>
        <button class="em_btn em_btn_danger" id="emLimpiar" ${wiTip('Limpiar notepad')}>
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
    
    <div class="em_main">
      <!-- LEFT: Notepad 35% -->
      <div class="em_notepad">
        <div class="em_notepad_header">
          <h3><i class="fas fa-edit"></i> Notepad</h3>
          <span class="em_char_count">0 caracteres</span>
        </div>
        <textarea class="em_textarea" id="emTextarea" placeholder="Escribe tu mensaje aquí... Los emojis se agregarán automáticamente 😊">${_getNotepad()}</textarea>
        <div class="em_notepad_foot">
          <button class="em_btn_sm" id="emInsertarEnter">
            <i class="fas fa-level-down-alt"></i> Salto
          </button>
          <button class="em_btn_sm" id="emCopiarTexto">
            <i class="fas fa-clipboard"></i> Copiar
          </button>
        </div>
      </div>
      
      <!-- RIGHT: Emojis 64% -->
      <div class="em_picker">
        <div class="em_search_wrap">
          <i class="fas fa-search"></i>
          <input type="text" class="em_search" id="emSearch" placeholder="Buscar emoji..." />
        </div>
        
        <div class="em_tabs">
          ${Object.entries(CATEGORIAS).map(([key, cat]) => `
            <button class="em_tab ${key === categoriaActual ? 'active' : ''}" data-cat="${key}" ${wiTip(cat.label)}>
              <i class="fas ${cat.icon}"></i>
            </button>
          `).join('')}
        </div>
        
        <div class="em_cat_label">
          <i class="fas ${CATEGORIAS[categoriaActual].icon}"></i>
          <span>${CATEGORIAS[categoriaActual].label}</span>
        </div>
        
        <div class="em_grid">
          <!-- Emojis se renderizan aquí -->
        </div>
      </div>
    </div>
  </div>`;
};

// Init
export const init = async () => {
  cleanup();
  
  recientes = _getRecientes();
  _renderEmojis();
  _updateCharCount();

  const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const debouncedSearch = debounce((q) => _renderEmojis(q), 300);
  const debouncedSave = debounce((txt) => _saveNotepad(txt), 500);

  $(document)
    // Click en emoji - copiar y agregar al notepad
    .on('click.em', '.em_emoji', async function() {
      const emoji = $(this).data('emoji');
      
      // Copiar al portapapeles
      await _copiar(emoji);
      
      // Agregar a recientes
      _addReciente(emoji);
      
      // Agregar al notepad
      const $ta = $('#emTextarea');
      const pos = $ta[0].selectionStart;
      const txt = $ta.val();
      const newTxt = txt.slice(0, pos) + emoji + txt.slice(pos);
      $ta.val(newTxt);
      $ta[0].selectionStart = $ta[0].selectionEnd = pos + emoji.length;
      $ta.focus();
      _saveNotepad(newTxt);
      _updateCharCount();
      
      // Animación y notificación
      $(this).addClass('copied');
      setTimeout(() => $(this).removeClass('copied'), 300);
      Notificacion(`${emoji} Copiado!`, 'success', 1200);
    })
    
    // Cambiar categoría
    .on('click.em', '.em_tab', function() {
      const cat = $(this).data('cat');
      categoriaActual = cat;
      
      $('.em_tab').removeClass('active');
      $(this).addClass('active');
      
      $('.em_cat_label').html(`
        <i class="fas ${CATEGORIAS[cat].icon}"></i>
        <span>${CATEGORIAS[cat].label}</span>
      `);
      
      $('#emSearch').val('');
      _renderEmojis();
    })
    
    // Buscar
    .on('input.em', '#emSearch', function() {
      const q = $(this).val().trim();
      debouncedSearch(q);
    })
    
    // Textarea cambios
    .on('input.em', '#emTextarea', function() {
      debouncedSave($(this).val());
      _updateCharCount();
    })
    
    // Copiar todo
    .on('click.em', '#emCopiarTodo, #emCopiarTexto', async function() {
      const txt = $('#emTextarea').val();
      if (!txt) {
        Notificacion('Notepad vacío', 'warning', 1500);
        return;
      }
      await _copiar(txt);
      Notificacion('Texto copiado! 📋', 'success', 1500);
    })
    
    // Limpiar
    .on('click.em', '#emLimpiar', function() {
      $('#emTextarea').val('');
      _saveNotepad('');
      _updateCharCount();
      Notificacion('Notepad limpiado 🗑️', 'success', 1200);
    })
    
    // Insertar salto de línea
    .on('click.em', '#emInsertarEnter', function() {
      const $ta = $('#emTextarea');
      const pos = $ta[0].selectionStart;
      const txt = $ta.val();
      const newTxt = txt.slice(0, pos) + '\n' + txt.slice(pos);
      $ta.val(newTxt);
      $ta[0].selectionStart = $ta[0].selectionEnd = pos + 1;
      $ta.focus();
      _saveNotepad(newTxt);
      _updateCharCount();
    })
    
    // Atajos de teclado
    .on('keydown.em', function(e) {
      // Ctrl+C en textarea ya funciona nativo
      // Escape para limpiar búsqueda
      if (e.key === 'Escape') {
        $('#emSearch').val('');
        _renderEmojis();
      }
    });

  console.log('✅ Emojis v1.0');
};

const _updateCharCount = () => {
  const len = $('#emTextarea').val().length;
  $('.em_char_count').text(`${len} caracteres`);
};

export const cleanup = () => {
  $(document).off('.em');
};