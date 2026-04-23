import{j as e}from"./vendor-gzd0YkcT.js";import{db as S}from"./firebase-Lfd52dYI.js";import{q as T,c as A,w as P,l as L,g as N,h as k,s as j,f as I,i as G}from"./firebase-Cdwg_wrl.js";import{c as f,g as q,h as v,m as d}from"./main-CuczXLwU.js";let i=[],a=null,D="",m=!0,_=!1;const $="wiWin",E="wi_win_cache",h=()=>q("wiSmile")||{},l=s=>localStorage.setItem(E,JSON.stringify(s)),O=()=>JSON.parse(localStorage.getItem(E)||"[]"),x=()=>i.sort((s,t)=>(t.pin?1:0)-(s.pin?1:0)||(t.fechaActualizado?.seconds||0)-(s.fechaActualizado?.seconds||0)),p=()=>({seconds:Math.floor(Date.now()/1e3)}),C=async(s,t=!1)=>{if(_=!s?.email,_){m=!1,g();return}t||e(".es_btn_refresh").addClass("syncing");try{const n=T(A(S,$),P("email","==",s.email),L(100));i=(await N(n)).docs.map(c=>({_fsId:c.id,...c.data()})),x(),l(i),m=!1,g()}catch{m=!1,t||r()}finally{e(".es_btn_refresh").removeClass("syncing")}},g=()=>{a||(a=i.find(s=>s.pin)||i[0]||null),r()},U=async(s=!1)=>{if(!a)return;const t=h(),n=e("#btnS2"),u=e(".es_in_title_h").val().trim()||"Untitled",c=e(".es_editor").html();a.titulo=u,a.contenido=c,a._dirty&&(a.fechaActualizado=p());const b=i.filter(o=>o._dirty);if(!b.length){s&&v("Sin cambios por guardar","info",800);return}if(l(i),s&&d(n,!0,"Guardando"),_){b.forEach(o=>o._dirty=!1),l(i),s&&setTimeout(()=>{d(n,!1,"Guardado"),setTimeout(()=>n.html('<i class="fas fa-save"></i> <span>Guardar</span>'),1500)},600);return}try{for(const o of b){const z={id:o.id,titulo:o.titulo||"Untitled",contenido:o.contenido||"",email:t.email,usuario:t.usuario||"Public",fecha:o.fecha||k(),fechaActualizado:k(),pin:!!o.pin};await j(I(S,$,o._fsId),z),o._dirty=!1}l(i),s&&(v("Sincronización Exitosa ✨","success",800),d(n,!1,"Guardado"))}catch(o){s&&(console.error("Save Error:",o),v("Error al guardar","error"),d(n,!1,"Reintentar"))}finally{s&&setTimeout(()=>{e("#btnS2").length&&e("#btnS2").html('<i class="fas fa-save"></i> <span>Guardar</span>')},2e3)}},M=async()=>{const s=h(),t=Date.now(),n=`win${t}`,u=p(),c={_fsId:n,id:n,titulo:"",contenido:"",pin:!1,email:s.email||"guest",usuario:s.usuario||"Public",fecha:u,fechaActualizado:u,_dirty:!0};i.unshift(c),a=c,l(i),r(),e(".es_in_title_h").focus(),e(".es_container").removeClass("menu-open")},W=async(s,t=null)=>{if(confirm("¿Eliminar?")){t&&d(e(t),!0,"...");try{i=i.filter(n=>n._fsId!==s),a?._fsId===s&&(a=i[0]||null),l(i),_||await G(I(S,$,s)),r()}catch{t&&d(e(t),!1,'<i class="fas fa-trash-alt"></i>'),v("Error al eliminar","error")}}},B=async s=>{const t=i.find(n=>n._fsId===s);t&&(t.pin=!t.pin,t._dirty=!0,t.fechaActualizado=p(),x(),l(i),r())},y=()=>{e(".es_tool_btn").each(function(){const s=e(this).data("cmd");try{document.queryCommandState(s)?e(this).addClass("active"):e(this).removeClass("active")}catch{}})},w=()=>{const s=i.filter(t=>(t.titulo||"").toLowerCase().includes(D.toLowerCase()));e(".es_list_items_final").html(s.map(t=>`
        <div class="es_item_final ${a?._fsId===t._fsId?"active":""}" data-id="${t._fsId}">
            <div class="item_info_final">
                <strong>${t.titulo||"Untitled"}</strong>
                <span>${new Date((t.fechaActualizado?.seconds||Date.now()/1e3)*1e3).toLocaleDateString()}</span>
            </div>
            <div class="item_acts_final">
                <div class="btn_sub btnPin" data-id="${t._fsId}" ${f("Pin")}><i class="fas fa-thumbtack"></i></div>
                <div class="btn_sub btnDel" data-id="${t._fsId}" ${f("Borrar")}><i class="fas fa-trash"></i></div>
            </div>
        </div>`).join("")||'<div class="txc" style="margin-top:20px; opacity:0.4;">Registry Empty</div>')},H=()=>{const s=e(".es_left");if(s.length){if(m&&!i.length)return s.html('<div class="es_skeleton"> <div class="sk_line" style="width:40%"></div> <div class="sk_line"></div> </div>');if(!a)return s.html('<div style="margin:auto; text-align:center;"><button class="es_btn_new_final" id="btnS1" style="width:280px">+ Nuevo Win</button></div>');s.html(`
        <div class="es_page">
            <div class="es_page_header">
                <div class="es_header_left">
                    <input type="text" class="es_in_title_h" placeholder="Escribir el título..." value="${a.titulo||""}" spellcheck="false">
                </div>
                <div class="es_header_right">
                    <button class="es_btn_pro save" id="btnS2"><i class="fas fa-save" id="iconSync"></i> <span>Guardar</span></button>
                    <button class="es_btn_pro del" id="btnD2" ${f("Eliminar permanentemente")}><i class="fas fa-trash-alt"></i> <span>Eliminar</span></button>
                    <button class="es_btn_menu" id="toggleMenu" ${f("Historial")}><i class="fas fa-history"></i></button>
                </div>
            </div>
            <div class="es_page_content">
                <div class="es_editor" contenteditable="true" data-placeholder="Escriba aquí contenido pro..." spellcheck="false">${a.contenido||""}</div>
            </div>
            <div class="es_page_footer">
                ${["bold","italic","underline","justifyCenter","insertUnorderedList"].map(t=>`
                    <button class="es_tool_btn" data-cmd="${t}" ${f(t)}><i class="fas fa-${t==="justifyCenter"?"align-center":t==="insertUnorderedList"?"list-ul":t==="underline"?"underline":t}"></i></button>
                `).join("")}
            </div>
        </div>`)}},r=()=>{e(".es_container").length||e("#wimain").html(J()),H(),w()},J=()=>`<div class="es_container">
        <div class="es_overlay"></div>
        <div class="es_left"></div>
        <div class="es_right">
            <div class="es_sidebar_final">
                <div class="es_sidebar_actions">
                    <button class="es_btn_new_final" id="btnN1">+ Nuevo Win</button>
                    <button class="es_btn_refresh" id="btnSync" ${f("Sync Firestore")}><i class="fas fa-sync-alt"></i></button>
                </div>
                <input type="text" class="es_search_final" placeholder="Buscar documentos...">
                <div class="es_list_items_final"></div>
                <div style="margin-top:auto; font-size:10px; opacity:0.5; display:flex; align-items:center; gap:5px;">
                    <div class="wn_dot_final"></div> ${_?"Offline - Local Mode":"Online - wiWin Cloud"}
                </div>
            </div>
        </div>
    </div>`,X=async()=>{R();const s=h();_=!s.email,i=O(),i.length?(m=!1,g()):(r(),C(s,!0)),e(document).on("click.es",".es_tool_btn[data-cmd]",function(){document.execCommand(e(this).data("cmd")),e(".es_editor").focus(),y()}).on("input.es",".es_editor, .es_in_title_h",function(){a&&(a.titulo=e(".es_in_title_h").val().trim(),a.contenido=e(".es_editor").html(),a._dirty=!0,a.fechaActualizado=p(),l(i),e(".es_in_title_h").is(":focus")&&w())}).on("click.es","#btnS2",()=>U(!0)).on("click.es","#btnSync",()=>C(h())).on("click.es","#btnD2, .btnDel",function(t){t.stopPropagation(),W(e(this).data("id")||a._fsId,this)}).on("click.es",".btnPin",function(t){t.stopPropagation(),B(e(this).data("id"))}).on("click.es","#btnN1, #btnS1",M).on("click.es","#toggleMenu, .es_overlay",()=>e(".es_container").toggleClass("menu-open")).on("click.es",".es_item_final",async function(){const t=e(this).data("id");a?._fsId!==t&&(a=i.find(n=>n._fsId===t),r(),y(),e(".es_container").removeClass("menu-open"))}).on("input.es",".es_search_final",function(){D=e(this).val(),w()}).on("keyup.es mouseup.es click.es",".es_editor",y).on("keydown.es",".es_in_title_h",function(t){t.key==="Tab"&&(t.preventDefault(),e(".es_editor").focus())})},R=()=>{e(document).off(".es"),i=[],a=null};export{R as cleanup,X as init,J as render};
