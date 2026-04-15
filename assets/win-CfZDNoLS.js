import{j as s}from"./vendor-gzd0YkcT.js";import{db as S}from"./firebase-B2ji0hhV.js";import{q as T,c as A,w as P,l as L,a as N,e as k,b as j,d as I,k as G}from"./firebase-DYzFYKGm.js";import{d as f,g as q,N as v,h as d}from"./main-DGj1lpKw.js";let i=[],a=null,D="",m=!0,_=!1;const $="wiWin",E="wi_win_cache",h=()=>q("wiSmile")||{},l=e=>localStorage.setItem(E,JSON.stringify(e)),O=()=>JSON.parse(localStorage.getItem(E)||"[]"),x=()=>i.sort((e,t)=>(t.pin?1:0)-(e.pin?1:0)||(t.fechaActualizado?.seconds||0)-(e.fechaActualizado?.seconds||0)),p=()=>({seconds:Math.floor(Date.now()/1e3)}),C=async(e,t=!1)=>{if(_=!e?.email,_){m=!1,g();return}t||s(".es_btn_refresh").addClass("syncing");try{const n=T(A(S,$),P("email","==",e.email),L(100));i=(await N(n)).docs.map(c=>({_fsId:c.id,...c.data()})),x(),l(i),m=!1,g()}catch{m=!1,t||r()}finally{s(".es_btn_refresh").removeClass("syncing")}},g=()=>{a||(a=i.find(e=>e.pin)||i[0]||null),r()},U=async(e=!1)=>{if(!a)return;const t=h(),n=s("#btnS2"),u=s(".es_in_title_h").val().trim()||"Untitled",c=s(".es_editor").html();a.titulo=u,a.contenido=c,a._dirty&&(a.fechaActualizado=p());const b=i.filter(o=>o._dirty);if(!b.length){e&&v("Sin cambios por guardar","info",800);return}if(l(i),e&&d(n,!0,"Guardando"),_){b.forEach(o=>o._dirty=!1),l(i),e&&setTimeout(()=>{d(n,!1,"Guardado"),setTimeout(()=>n.html('<i class="fas fa-save"></i> <span>Guardar</span>'),1500)},600);return}try{for(const o of b){const z={id:o.id,titulo:o.titulo||"Untitled",contenido:o.contenido||"",email:t.email,usuario:t.usuario||"Public",fecha:o.fecha||k(),fechaActualizado:k(),pin:!!o.pin};await j(I(S,$,o._fsId),z),o._dirty=!1}l(i),e&&(v("Sincronización Exitosa ✨","success",800),d(n,!1,"Guardado"))}catch(o){e&&(console.error("Save Error:",o),v("Error al guardar","error"),d(n,!1,"Reintentar"))}finally{e&&setTimeout(()=>{s("#btnS2").length&&s("#btnS2").html('<i class="fas fa-save"></i> <span>Guardar</span>')},2e3)}},M=async()=>{const e=h(),t=Date.now(),n=`win${t}`,u=p(),c={_fsId:n,id:n,titulo:"",contenido:"",pin:!1,email:e.email||"guest",usuario:e.usuario||"Public",fecha:u,fechaActualizado:u,_dirty:!0};i.unshift(c),a=c,l(i),r(),s(".es_in_title_h").focus(),s(".es_container").removeClass("menu-open")},W=async(e,t=null)=>{if(confirm("¿Eliminar?")){t&&d(s(t),!0,"...");try{i=i.filter(n=>n._fsId!==e),a?._fsId===e&&(a=i[0]||null),l(i),_||await G(I(S,$,e)),r()}catch{t&&d(s(t),!1,'<i class="fas fa-trash-alt"></i>'),v("Error al eliminar","error")}}},B=async e=>{const t=i.find(n=>n._fsId===e);t&&(t.pin=!t.pin,t._dirty=!0,t.fechaActualizado=p(),x(),l(i),r())},y=()=>{s(".es_tool_btn").each(function(){const e=s(this).data("cmd");try{document.queryCommandState(e)?s(this).addClass("active"):s(this).removeClass("active")}catch{}})},w=()=>{const e=i.filter(t=>(t.titulo||"").toLowerCase().includes(D.toLowerCase()));s(".es_list_items_final").html(e.map(t=>`
        <div class="es_item_final ${a?._fsId===t._fsId?"active":""}" data-id="${t._fsId}">
            <div class="item_info_final">
                <strong>${t.titulo||"Untitled"}</strong>
                <span>${new Date((t.fechaActualizado?.seconds||Date.now()/1e3)*1e3).toLocaleDateString()}</span>
            </div>
            <div class="item_acts_final">
                <div class="btn_sub btnPin" data-id="${t._fsId}" ${f("Pin")}><i class="fas fa-thumbtack"></i></div>
                <div class="btn_sub btnDel" data-id="${t._fsId}" ${f("Borrar")}><i class="fas fa-trash"></i></div>
            </div>
        </div>`).join("")||'<div class="txc" style="margin-top:20px; opacity:0.4;">Registry Empty</div>')},H=()=>{const e=s(".es_left");if(e.length){if(m&&!i.length)return e.html('<div class="es_skeleton"> <div class="sk_line" style="width:40%"></div> <div class="sk_line"></div> </div>');if(!a)return e.html('<div style="margin:auto; text-align:center;"><button class="es_btn_new_final" id="btnS1" style="width:280px">+ Nuevo Win</button></div>');e.html(`
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
        </div>`)}},r=()=>{s(".es_container").length||s("#wimain").html(J()),H(),w()},J=()=>`<div class="es_container">
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
    </div>`,X=async()=>{R();const e=h();_=!e.email,i=O(),i.length?(m=!1,g()):(r(),C(e,!0)),s(document).on("click.es",".es_tool_btn[data-cmd]",function(){document.execCommand(s(this).data("cmd")),s(".es_editor").focus(),y()}).on("input.es",".es_editor, .es_in_title_h",function(){a&&(a.titulo=s(".es_in_title_h").val().trim(),a.contenido=s(".es_editor").html(),a._dirty=!0,a.fechaActualizado=p(),l(i),s(".es_in_title_h").is(":focus")&&w())}).on("click.es","#btnS2",()=>U(!0)).on("click.es","#btnSync",()=>C(h())).on("click.es","#btnD2, .btnDel",function(t){t.stopPropagation(),W(s(this).data("id")||a._fsId,this)}).on("click.es",".btnPin",function(t){t.stopPropagation(),B(s(this).data("id"))}).on("click.es","#btnN1, #btnS1",M).on("click.es","#toggleMenu, .es_overlay",()=>s(".es_container").toggleClass("menu-open")).on("click.es",".es_item_final",async function(){const t=s(this).data("id");a?._fsId!==t&&(a=i.find(n=>n._fsId===t),r(),y(),s(".es_container").removeClass("menu-open"))}).on("input.es",".es_search_final",function(){D=s(this).val(),w()}).on("keyup.es mouseup.es click.es",".es_editor",y).on("keydown.es",".es_in_title_h",function(t){t.key==="Tab"&&(t.preventDefault(),s(".es_editor").focus())})},R=()=>{s(document).off(".es"),i=[],a=null};export{R as cleanup,X as init,J as render};
