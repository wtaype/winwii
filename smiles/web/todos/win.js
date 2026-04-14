import './win.css';
import $ from 'jquery';
import { db } from '../firebase.js';
import { collection, setDoc, doc, query, where, getDocs, deleteDoc, serverTimestamp, limit } from 'firebase/firestore';
import { Notificacion, getls, wiAuth, wiTip, wiSpin } from '../../widev.js';
import { rutas } from '../../rutas/ruta.js';

/* ══════════════════════════════════════════════════════════════
   WIN v22.0 — "Right Drawer & Content First"
   🚀 Content top/first · Sidebar Right Drawer · Mobile Optimized
   📝 Colección: wiWin · 100% Pro Industrial Responsive
   ══════════════════════════════════════════════════════════════ */

let docs = [], sel = null, bus = '', saveTimer = null, _onVis = null, loading = true, isPub = false;
const COL = 'wiWin', CACHE = 'wi_win_cache', wi = () => getls('wiSmile') || {};

const _save = d => localStorage.setItem(CACHE, JSON.stringify(d));
const _get = () => JSON.parse(localStorage.getItem(CACHE) || '[]');
const _sort = () => docs.sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || (b.fechaActualizado?.seconds || 0) - (a.fechaActualizado?.seconds || 0));

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
    if (!manual && sel.titulo === tit && sel.contenido === cnt) return;
    
    sel.titulo = tit; sel.contenido = cnt; _save(docs);
    if (manual) wiSpin($btn, true, 'Guardando');
    if (isPub) { if (manual) setTimeout(() => { wiSpin($btn, false, 'Guardado'); setTimeout(() => $btn.html('<i class="fas fa-save"></i> <span>Guardar</span>'), 1500); }, 600); return; }

    try {
        const docId = sel._fsId;
        const dataToSave = { 
            id: sel.id, titulo: sel.titulo, contenido: sel.contenido, email: u.email,
            usuario: u.usuario || 'Public', fecha: sel.fecha || serverTimestamp(),
            fechaActualizado: serverTimestamp(), pin: sel.pin || false
        };
        await setDoc(doc(db, COL, docId), dataToSave);
        if (manual) { Notificacion('Sincronización Exitosa ✨', 'success', 800); wiSpin($btn, false, 'Guardado'); }
    } catch (e) { 
        if (manual) { console.error("Save Error:", e); Notificacion('Error al guardar', 'error'); wiSpin($btn, false, 'Reintentar'); }
    } finally {
        if (manual) setTimeout(() => { if ($('#btnS2').length) $('#btnS2').html('<i class="fas fa-save"></i> <span>Guardar</span>'); }, 2000);
    }
};

const _nuevo = async () => {
    const u = wi(), ts = Date.now(), id = `win${ts}`;
    const nuevo = { _fsId: id, id: id, titulo: '', contenido: '', pin: false, email: u.email || 'guest', usuario: u.usuario || 'Public', fecha: serverTimestamp(), fechaActualizado: serverTimestamp() };
    docs.unshift(nuevo); sel = nuevo; _save(docs); _render(); $('.es_in_title_h').focus();
    if (!isPub) { try { const dataToSave = { ...nuevo }; delete dataToSave._fsId; await setDoc(doc(db, COL, id), dataToSave); } catch (e) {} }
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
        d.pin = !d.pin; _sort(); _save(docs); _render(); 
        if (!isPub) try { await setDoc(doc(db, COL, id), { ...d, _fsId: undefined, fechaActualizado: serverTimestamp() }); } catch (e) {}
    }
};

const _checkTools = () => {
    $('.es_tool_btn').each(function() {
        const cmd = $(this).data('cmd');
        try { if (document.queryCommandState(cmd)) $(this).addClass('active'); else $(this).removeClass('active'); } catch(e) {}
    });
};

const _renderList = () => {
    const items = docs.filter(d => (d.titulo||'').toLowerCase().includes(bus.toLowerCase()));
    $('.es_list_items_final').html(items.map(d => `
        <div class="es_item_final ${sel?._fsId === d._fsId ? 'active' : ''}" data-id="${d._fsId}">
            <div class="item_info_final">
                <strong>${d.titulo || 'Untitled'}</strong>
                <span>${new Date((d.fechaActualizado?.seconds || Date.now()/1000) * 1000).toLocaleDateString()}</span>
            </div>
            <div class="item_acts_final">
                <div class="btn_sub btnPin" data-id="${d._fsId}" ${wiTip('Pin')}><i class="fas fa-thumbtack"></i></div>
                <div class="btn_sub btnDel" data-id="${d._fsId}" ${wiTip('Borrar')}><i class="fas fa-trash"></i></div>
            </div>
        </div>`).join('') || `<div class="txc" style="margin-top:20px; opacity:0.4;">Registry Empty</div>`);
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
                ${['bold','italic','underline','justifyCenter','insertUnorderedList'].map(c => `
                    <button class="es_tool_btn" data-cmd="${c}" ${wiTip(c)}><i class="fas fa-${c === 'justifyCenter' ? 'align-center' : (c === 'insertUnorderedList' ? 'list-ul' : (c === 'underline' ? 'underline' : c))}"></i></button>
                `).join('')}
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
    docs = _get(); if (docs.length) { loading = false; _auto(); } else { _render(); }
    _cargar(u, true); $(document)
        .on('click.es', '.es_tool_btn[data-cmd]', function() { document.execCommand($(this).data('cmd')); $('.es_editor').focus(); _checkTools(); })
        .on('input.es', '.es_editor, .es_in_title_h', function() { 
            if (sel) { sel.titulo = $('.es_in_title_h').val().trim(); sel.contenido = $('.es_editor').html(); _save(docs); if ($('.es_in_title_h').is(':focus')) _renderList(); }
            clearTimeout(saveTimer); saveTimer = setTimeout(_guardar, 30000);
        })
        .on('click.es', '#btnS2', () => _guardar(true))
        .on('click.es', '#btnSync', () => _cargar(wi()))
        .on('click.es', '#btnD2, .btnDel', function(e) { e.stopPropagation(); _borrar($(this).data('id') || sel._fsId, this); })
        .on('click.es', '.btnPin', function(e) { e.stopPropagation(); _togglePin($(this).data('id')); })
        .on('click.es', '#btnN1, #btnS1', _nuevo)
        .on('click.es', '#toggleMenu, .es_overlay', () => $('.es_container').toggleClass('menu-open'))
        .on('click.es', '.es_item_final', async function() { 
            const newId = $(this).data('id'); if (sel?._fsId === newId) return;
            await _guardar(); sel = docs.find(d => d._fsId === newId); _render(); _checkTools();
            $('.es_container').removeClass('menu-open');
        })
        .on('input.es', '.es_search_final', function() { bus = $(this).val(); _renderList(); })
        .on('keyup.es mouseup.es click.es', '.es_editor', _checkTools)
        .on('keydown.es', '.es_in_title_h', function(e) { if (e.key === 'Tab') { e.preventDefault(); $('.es_editor').focus(); } });
    
    _onVis = () => !document.hidden && _cargar(u, true);
    document.addEventListener('visibilitychange', _onVis);
};

export const cleanup = () => { $(document).off('.es'); if (_onVis) document.removeEventListener('visibilitychange', _onVis); docs = []; sel = null; clearTimeout(saveTimer); };
