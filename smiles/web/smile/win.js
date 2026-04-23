import './win.css';
import $ from 'jquery';
import { db } from '../firebase.js';
import { collection, setDoc, doc, query, where, getDocs, deleteDoc, serverTimestamp, limit, writeBatch } from 'firebase/firestore';
import { Notificacion, getls, wiAuth, wiTip, wiSpin } from '../widev.js';
import { rutas } from '../rutas.js';

/* ══════════════════════════════════════════════════════════════
   WIN v22.0 — "Right Drawer & Content First"
   🚀 Content top/first · Sidebar Right Drawer · Mobile Optimized
   📝 Colección: wiWin · 100% Pro Industrial Responsive
   ══════════════════════════════════════════════════════════════ */

let docs = [], sel = null, bus = '', _onVis = null, loading = true, isPub = false, savedRange = null;
const COL = 'wiWin', CACHE = 'wi_win_cache', wi = () => getls('wiSmile') || {};

const _save = d => localStorage.setItem(CACHE, JSON.stringify(d));
const _get = () => JSON.parse(localStorage.getItem(CACHE) || '[]');
const _sort = () => docs.sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || (b.fechaActualizado?.seconds || 0) - (a.fechaActualizado?.seconds || 0));
const _nowTs = () => ({ seconds: Math.floor(Date.now() / 1000) });

const _cargar = async (u, silent = false) => {
    isPub = !u?.email;
    if (isPub) { loading = false; _auto(); return; }
    if (!silent) $('.es_btn_refresh').addClass('syncing');
    try {
        const q = query(collection(db, COL), where('email', '==', u.email), limit(100));
        const snap = await getDocs(q);
        docs = snap.docs.map(d => ({ _fsId: d.id, ...d.data() }));
        _sort(); _save(docs); loading = false; _auto();
    } catch (e) { loading = false; if (!silent) _render(); }
    finally { $('.es_btn_refresh').removeClass('syncing'); }
};

const _auto = () => { if (!sel) sel = docs.find(d => d.pin) || docs[0] || null; _render(); };

const _guardar = async (manual = false) => {
    if (!sel) return;
    const u = wi(), $btn = $('#btnS2'), tit = $('.es_in_title_h').val().trim() || 'Untitled', cnt = $('.es_editor').html();
    sel.titulo = tit;
    sel.contenido = cnt;
    if (sel._dirty) sel.fechaActualizado = _nowTs();
    const pendientes = docs.filter(d => d._dirty);
    if (!pendientes.length) {
        if (manual) Notificacion('Sin cambios por guardar', 'info', 800);
        return;
    }
    
    _save(docs);
    if (manual) wiSpin($btn, true, 'Guardando');
    if (isPub) {
        pendientes.forEach(d => d._dirty = false);
        _save(docs);
        _renderList();
        if (manual) setTimeout(() => { wiSpin($btn, false, 'Guardado'); setTimeout(() => $btn.html('<i class="fas fa-save"></i> <span id="iconSync">Guardar</span>'), 1500); }, 600);
        return;
    }

    try {
        const batch = writeBatch(db);
        for (const d of pendientes) {
            const dataToSave = {
                id: d.id,
                titulo: d.titulo || 'Untitled',
                contenido: d.contenido || '',
                email: u.email,
                usuario: u.usuario || 'Public',
                fecha: d.fecha || serverTimestamp(),
                fechaActualizado: serverTimestamp(),
                pin: !!d.pin
            };
            batch.set(doc(db, COL, d._fsId), dataToSave);
            d._dirty = false;
        }
        await batch.commit();
        _save(docs);
        _renderList();
        if (manual) { Notificacion('Sincronización Exitosa ✨', 'success', 800); wiSpin($btn, false, 'Guardado'); }
    } catch (e) { 
        if (manual) { console.error("Save Error:", e); Notificacion('Error al guardar', 'error'); wiSpin($btn, false, 'Reintentar'); }
    } finally {
        if (manual) setTimeout(() => { if ($('#btnS2').length) $('#btnS2').html('<i class="fas fa-save"></i> <span>Guardar</span>'); }, 2000);
    }
};

const _nuevo = async () => {
    const u = wi(), ts = Date.now(), id = `win${ts}`;
    const localTs = _nowTs();
    const nuevo = { _fsId: id, id: id, titulo: '', contenido: '', pin: false, email: u.email || 'guest', usuario: u.usuario || 'Public', fecha: localTs, fechaActualizado: localTs, _dirty: true };
    docs.unshift(nuevo); sel = nuevo; _save(docs); _render(); $('.es_in_title_h').focus();
    $('.es_container').removeClass('menu-open');
};

const _borrar = async (id, btn = null) => {
    if (!confirm('¿Eliminar?')) return;
    if (btn) wiSpin($(btn), true, '...');
    try {
        docs = docs.filter(d => d._fsId !== id);
        if (sel?._fsId === id) sel = docs[0] || null;
        _save(docs);
        if (!isPub) await deleteDoc(doc(db, COL, id));
        _render();
    } catch (e) {
        if (btn) wiSpin($(btn), false, '<i class="fas fa-trash-alt"></i>');
        Notificacion('Error al eliminar', 'error');
    }
};

const _togglePin = async (id) => {
    const d = docs.find(x => x._fsId === id);
    if (d) { 
        d.pin = !d.pin; d._dirty = true; d.fechaActualizado = _nowTs(); _sort(); _save(docs); _render();
    }
};

const _checkTools = () => {
    $('.es_tool_btn[data-cmd]').each(function() {
        const cmd = $(this).data('cmd');
        try { if (document.queryCommandState(cmd)) $(this).addClass('active'); else $(this).removeClass('active'); } catch(e) {}
    });
    try {
        const selNode = window.getSelection().anchorNode;
        if (selNode) {
            const el = selNode.nodeType === 3 ? selNode.parentNode : selNode;
            if ($(el).closest('.es_editor').length) {
                const css = window.getComputedStyle(el);
                if (css.fontSize) $('#winFontSize').val(parseInt(css.fontSize));
                if (css.fontFamily) {
                    const fam = css.fontFamily.split(',')[0].replace(/['"]/g, '');
                    $('#winFontFamily option').each(function() {
                        if ($(this).text() === fam || $(this).val().includes(fam)) $('#winFontFamily').val($(this).val());
                    });
                }
                const block = $(el).closest('p, div, h1, h2, h3, h4, h5, h6, li');
                if (block.length) {
                    const inlineLh = block[0].style.lineHeight;
                    if (inlineLh) $('#winLineHeight').val(inlineLh);
                    
                    if (block[0].style.marginBottom === '0px' || css.marginBottom === '0px') {
                        $('#btnNoMargin').addClass('active');
                    } else {
                        $('#btnNoMargin').removeClass('active');
                    }
                }
            }
        }
    } catch(e) {}
};

const _renderList = () => {
    const items = docs.filter(d => (d.titulo||'').toLowerCase().includes(bus.toLowerCase()));
    $('.es_list_items_final').html(items.map(d => {
        let tit = d.titulo || 'Untitled';
        
        let plainContent = $('<div>').html(d.contenido || '').text().trim() || 'Sin contenido...';
        let snippet = plainContent.length > 30 ? plainContent.substring(0, 30) + '...' : plainContent;
        
        const isCloud = !d._dirty;
        const dateStr = new Date((d.fechaActualizado?.seconds || Date.now()/1000) * 1000).toLocaleDateString('es-ES', {day:'2-digit', month:'short'});
        
        return `
        <div class="es_item_final ${sel?._fsId === d._fsId ? 'active' : ''}" data-id="${d._fsId}">
            <div class="it_r1">
                <strong class="it_title">${d.pin ? '<i class="fas fa-thumbtack pin_ico"></i> ' : ''}${tit}</strong>
                <div class="it_icons">
                    <span class="it_status" ${wiTip(isCloud ? 'Guardado' : 'Pendiente')}>
                        ${isCloud ? '<i class="fas fa-cloud"></i>' : '<i class="fas fa-sync-alt fa-spin" style="color:var(--warning)"></i>'}
                    </span>
                    <i class="fas fa-thumbtack it_action btnPin" data-id="${d._fsId}" style="${d.pin ? 'color:var(--mco)' : ''}" ${wiTip(d.pin ? 'Desanclar' : 'Anclar')}></i>
                    <i class="fas fa-trash-alt it_action btnDel" data-id="${d._fsId}" ${wiTip('Borrar')}></i>
                </div>
            </div>
            <div class="it_r2">
                <span class="it_snippet">${snippet}</span>
                <span class="it_date">${dateStr}</span>
            </div>
        </div>`;
    }).join('') || `<div class="txc" style="margin-top:20px; opacity:0.4; font-size:12px;">No hay documentos</div>`);
};

const _renderEditor = () => {
    const $left = $('.es_left'); if (!$left.length) return;
    if (loading && !docs.length) return $left.html(`<div class="es_skeleton"> <div class="sk_line" style="width:40%"></div> <div class="sk_line"></div> </div>`);
    if (!sel) return $left.html(`<div style="margin:auto; text-align:center;"><button class="es_btn_new_final" id="btnS1" style="width:280px">+ Nuevo Win</button></div>`);

    $left.html(`
        <div class="es_page">
            <div class="es_page_header">
                <div class="es_header_left">
                    <input type="text" class="es_in_title_h" placeholder="Escribir el título..." value="${sel.titulo || ''}" spellcheck="false">
                </div>
                <div class="es_header_right">
                    <button class="es_btn_pro save" id="btnS2"><i class="fas fa-save" id="iconSync"></i> <span>Guardar</span></button>
                    <button class="es_btn_pro del" id="btnD2" ${wiTip('Eliminar permanentemente')}><i class="fas fa-trash-alt"></i> <span>Eliminar</span></button>
                    <button class="es_btn_menu" id="toggleMenu" ${wiTip('Historial')}><i class="fas fa-history"></i></button>
                </div>
            </div>
            <div class="es_page_content">
                <div class="es_editor" contenteditable="true" data-placeholder="Escriba aquí contenido pro..." spellcheck="false">${sel.contenido || ''}</div>
            </div>
            <div class="es_page_footer">
                <div class="es_footer_group">
                    ${['bold','italic','underline','strikeThrough'].map(c => `
                    <button class="es_tool_btn" data-cmd="${c}" ${wiTip(c)}><i class="fas fa-${c==='bold'?'bold':c==='italic'?'italic':c==='underline'?'underline':'strikethrough'}"></i></button>
                    `).join('')}
                </div>
                <div class="es_footer_sep"></div>
                <div class="es_footer_group">
                    ${['justifyLeft','justifyCenter','justifyRight','justifyFull'].map(c => `
                    <button class="es_tool_btn" data-cmd="${c}" ${wiTip(c)}><i class="fas fa-align-${c==='justifyLeft'?'left':c==='justifyCenter'?'center':c==='justifyRight'?'right':'justify'}"></i></button>
                    `).join('')}
                </div>
                <div class="es_footer_sep"></div>
                <div class="es_footer_group">
                    <button class="es_tool_btn" data-cmd="insertUnorderedList" ${wiTip('Lista')}><i class="fas fa-list-ul"></i></button>
                    <button class="es_tool_btn" data-cmd="insertOrderedList" ${wiTip('Numerada')}><i class="fas fa-list-ol"></i></button>
                </div>
                <div class="es_footer_sep"></div>
                <div class="es_footer_group">
                    <input type="text" id="winFontSize" class="es_font_text" value="16" maxlength="2" title="Tamaño de fuente" autocomplete="off">
                </div>
                <div class="es_footer_sep"></div>
                <div class="es_footer_group">
                    <select id="winFontFamily" class="es_font_sel" title="Familia de fuente">
                        <option value="inherit">Sistema</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="'Poppins', sans-serif">Poppins</option>
                        <option value="'Rubik', sans-serif">Rubik</option>
                        <option value="Georgia, serif">Georgia</option>
                        <option value="'Courier New', monospace">Courier</option>
                        <option value="'Times New Roman', serif">Times</option>
                    </select>
                </div>
                <div class="es_footer_sep"></div>
                <div class="es_footer_group">
                    <select id="winLineHeight" class="es_font_sel" title="Interlineado" style="width: 58px; padding: 0 0.5vh;">
                        <option value="1">1.0</option>
                        <option value="1.15">1.15</option>
                        <option value="1.5">1.5</option>
                        <option value="2">2.0</option>
                    </select>
                    <button class="es_tool_btn" id="btnNoMargin" title="Eliminar espacio de párrafos"><i class="fas fa-compress-alt"></i></button>
                </div>
            </div>
        </div>`);
};

const _render = () => { if (!$('.es_container').length) $('#wimain').html(render()); _renderEditor(); _renderList(); };

export const render = () => {
    return `<div class="es_container">
        <div class="es_overlay"></div>
        <div class="es_left"></div>
        <div class="es_right">
            <div class="es_sidebar_final">
                <div class="es_sidebar_actions">
                    <button class="es_btn_new_final" id="btnN1">+ Nuevo Win</button>
                    <button class="es_btn_refresh" id="btnSync" ${wiTip('Sync Firestore')}><i class="fas fa-sync-alt"></i></button>
                </div>
                <input type="text" class="es_search_final" placeholder="Buscar documentos...">
                <div class="es_list_items_final"></div>
                <div style="margin-top:auto; font-size:10px; opacity:0.5; display:flex; align-items:center; gap:5px;">
                    <div class="wn_dot_final"></div> ${isPub ? 'Offline - Local Mode' : 'Online - wiWin Cloud'}
                </div>
            </div>
        </div>
    </div>`;
};

export const init = async () => {
    cleanup(); const u = wi(); isPub = !u.email;
    docs = _get();
    if (docs.length) { loading = false; _auto(); } else { _render(); _cargar(u, true); }
    $(document)
        .on('click.es', '.es_tool_btn[data-cmd]', function() { document.execCommand($(this).data('cmd')); $('.es_editor').focus(); _checkTools(); })
        .on('input.es', '.es_editor, .es_in_title_h', function() { 
            if (sel) {
                sel.titulo = $('.es_in_title_h').val().trim();
                sel.contenido = $('.es_editor').html();
                sel._dirty = true;
                sel.fechaActualizado = _nowTs();
                _save(docs);
                
                // Actualización instantánea en la lista
                const $item = $(`.es_item_final[data-id="${sel._fsId}"]`);
                if ($item.length) {
                    $item.find('.it_status').html('<i class="fas fa-sync-alt fa-spin" style="color:var(--warning)"></i>');
                    if ($(this).hasClass('es_in_title_h')) {
                        $item.find('.it_title').html((sel.pin ? '<i class="fas fa-thumbtack pin_ico"></i> ' : '') + (sel.titulo || 'Untitled'));
                    } else {
                        let plain = $('<div>').html(sel.contenido).text().trim() || 'Sin contenido...';
                        let sn = plain.length > 30 ? plain.substring(0, 30) + '...' : plain;
                        $item.find('.it_snippet').text(sn);
                    }
                }
                
                // Auto-scroll
                const ed = $('.es_editor')[0];
                if (ed && $(this).hasClass('es_editor')) {
                    const sel2 = window.getSelection();
                    if (sel2?.rangeCount) {
                        const r = sel2.getRangeAt(0).getBoundingClientRect();
                        const cont = ed.closest('.es_page_content');
                        const box = cont.getBoundingClientRect();
                        if (r.bottom > box.bottom - 40) cont.scrollTop += (r.bottom - box.bottom + 60);
                    }
                }
            }
        })
        .on('click.es', '#btnS2', () => _guardar(true))
        .on('click.es', '#btnSync', () => _cargar(wi()))
        .on('click.es', '#btnD2, .btnDel', function(e) { e.stopPropagation(); _borrar($(this).data('id') || sel._fsId, this); })
        .on('click.es', '.btnPin', function(e) { e.stopPropagation(); _togglePin($(this).data('id')); })
        .on('click.es', '#btnN1, #btnS1', _nuevo)
        .on('click.es', '#toggleMenu, .es_overlay', () => $('.es_container').toggleClass('menu-open'))
        .on('click.es', '.es_item_final', async function() { 
            const newId = $(this).data('id'); if (sel?._fsId === newId) return;
            sel = docs.find(d => d._fsId === newId); _render(); _checkTools();
            $('.es_container').removeClass('menu-open');
        })
        .on('input.es', '.es_search_final', function() { bus = $(this).val(); _renderList(); })
        .on('keyup.es mouseup.es click.es', '.es_editor', function() {
            _checkTools();
            const s = window.getSelection();
            if (s.rangeCount > 0) savedRange = s.getRangeAt(0);
        })
        .on('keydown.es', '.es_in_title_h', function(e) { if (e.key === 'Tab') { e.preventDefault(); $('.es_editor').focus(); } })
        
        // Font Size "Tipo Word"
        .on('keydown.es', '#winFontSize', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const v = Math.max(8, Math.min(72, parseInt($(this).val()) || 16));
                $(this).val(v);
                
                if (savedRange) {
                    const s = window.getSelection();
                    s.removeAllRanges();
                    s.addRange(savedRange);
                }
                
                document.execCommand('styleWithCSS', false, true);
                document.execCommand('fontSize', false, '7');
                $('.es_editor font[size="7"], .es_editor span[style*="xxx-large"]').removeAttr('size').css('font-size', v + 'px');
                $('.es_editor').focus().trigger('input.es');
                _checkTools();
            }
        })
        // Font Family "Tipo Word"
        .on('change.es', '#winFontFamily', function() {
            if (savedRange) {
                const s = window.getSelection();
                s.removeAllRanges();
                s.addRange(savedRange);
            }
            document.execCommand('styleWithCSS', false, true);
            document.execCommand('fontName', false, $(this).val());
            $('.es_editor').focus().trigger('input.es');
            _checkTools();
        })
        // Interlineado
        .on('change.es', '#winLineHeight', function() {
            if (savedRange) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(savedRange); }
            const s = window.getSelection();
            if (s.rangeCount) {
                const r = s.getRangeAt(0);
                const common = r.commonAncestorContainer;
                const node = common.nodeType === 3 ? common.parentNode : common;
                let blocks = $(node).hasClass('es_editor') 
                    ? $(node).children().filter(function() { return s.containsNode(this, true); })
                    : $(node).closest('p, div, h1, h2, h3, h4, h5, h6, li');
                if (!blocks.length && $(node).hasClass('es_editor')) blocks = $(node);
                blocks.css('line-height', $(this).val());
            }
            $('.es_editor').focus().trigger('input.es');
            _checkTools();
        })
        // Eliminar Espacios de Párrafo
        .on('click.es', '#btnNoMargin', function() {
            if (savedRange) { const s = window.getSelection(); s.removeAllRanges(); s.addRange(savedRange); }
            const s = window.getSelection();
            if (s.rangeCount) {
                const r = s.getRangeAt(0);
                const common = r.commonAncestorContainer;
                const node = common.nodeType === 3 ? common.parentNode : common;
                let blocks = $(node).hasClass('es_editor') 
                    ? $(node).children().filter(function() { return s.containsNode(this, true); })
                    : $(node).closest('p, div, h1, h2, h3, h4, h5, h6, li');
                if (!blocks.length && $(node).hasClass('es_editor')) blocks = $(node);
                
                const current = blocks.css('margin-bottom');
                if (current === '0px') {
                    blocks.css({'margin-top': '', 'margin-bottom': ''});
                } else {
                    blocks.css({'margin-top': '0px', 'margin-bottom': '0px', 'padding-bottom': '0px'});
                }
            }
            $('.es_editor').focus().trigger('input.es');
            _checkTools();
        });
};

export const cleanup = () => { $(document).off('.es'); if (_onVis) document.removeEventListener('visibilitychange', _onVis); docs = []; sel = null; savedRange = null; };
