import{j as e}from"./vendor-gzd0YkcT.js";import{db as y}from"./firebase-C4LyfHx4.js";import{q as F,c as E,w as L,l as j,g as D,k as P,h as k,f as N,i as M}from"./firebase-CiLZDPlJ.js";import{c as f,g as G,j as b,o as h}from"./main-Dlu14CdS.js";let l=[],a=null,I="",v=!0,g=!1,d=null;const $="wiWin",R="wi_win_cache",w=()=>G("wiSmile")||{},u=i=>localStorage.setItem(R,JSON.stringify(i)),B=()=>JSON.parse(localStorage.getItem(R)||"[]"),z=()=>l.sort((i,t)=>(t.pin?1:0)-(i.pin?1:0)||(t.fechaActualizado?.seconds||0)-(i.fechaActualizado?.seconds||0)),C=()=>({seconds:Math.floor(Date.now()/1e3)}),A=async(i,t=!1)=>{if(g=!i?.email,g){v=!1,x();return}t||e(".es_btn_refresh").addClass("syncing");try{const s=F(E(y,$),L("email","==",i.email),j(100));l=(await D(s)).docs.map(n=>({_fsId:n.id,...n.data()})),z(),u(l),v=!1,x()}catch{v=!1,t||m()}finally{e(".es_btn_refresh").removeClass("syncing")}},x=()=>{a||(a=l.find(i=>i.pin)||l[0]||null),m()},H=async(i=!1)=>{if(!a)return;const t=w(),s=e("#btnS2"),o=e(".es_in_title_h").val().trim()||"Untitled",n=e(".es_editor").html();a.titulo=o,a.contenido=n,a._dirty&&(a.fechaActualizado=C());const c=l.filter(r=>r._dirty);if(!c.length){i&&b("Sin cambios por guardar","info",800);return}if(u(l),i&&h(s,!0,"Guardando"),g){c.forEach(r=>r._dirty=!1),u(l),S(),i&&setTimeout(()=>{h(s,!1,"Guardado"),setTimeout(()=>s.html('<i class="fas fa-save"></i> <span id="iconSync">Guardar</span>'),1500)},600);return}try{const r=P(y);for(const _ of c){const T={id:_.id,titulo:_.titulo||"Untitled",contenido:_.contenido||"",email:t.email,usuario:t.usuario||"Public",fecha:_.fecha||k(),fechaActualizado:k(),pin:!!_.pin};r.set(N(y,$,_._fsId),T),_._dirty=!1}await r.commit(),u(l),S(),i&&(b("Sincronización Exitosa ✨","success",800),h(s,!1,"Guardado"))}catch(r){i&&(console.error("Save Error:",r),b("Error al guardar","error"),h(s,!1,"Reintentar"))}finally{i&&setTimeout(()=>{e("#btnS2").length&&e("#btnS2").html('<i class="fas fa-save"></i> <span>Guardar</span>')},2e3)}},O=async()=>{const i=w(),t=Date.now(),s=`win${t}`,o=C(),n={_fsId:s,id:s,titulo:"",contenido:"",pin:!1,email:i.email||"guest",usuario:i.usuario||"Public",fecha:o,fechaActualizado:o,_dirty:!0};l.unshift(n),a=n,u(l),m(),e(".es_in_title_h").focus(),e(".es_container").removeClass("menu-open")},W=async(i,t=null)=>{if(confirm("¿Eliminar?")){t&&h(e(t),!0,"...");try{l=l.filter(s=>s._fsId!==i),a?._fsId===i&&(a=l[0]||null),u(l),g||await M(N(y,$,i)),m()}catch{t&&h(e(t),!1,'<i class="fas fa-trash-alt"></i>'),b("Error al eliminar","error")}}},q=async i=>{const t=l.find(s=>s._fsId===i);t&&(t.pin=!t.pin,t._dirty=!0,t.fechaActualizado=C(),z(),u(l),m())},p=()=>{e(".es_tool_btn[data-cmd]").each(function(){const i=e(this).data("cmd");try{document.queryCommandState(i)?e(this).addClass("active"):e(this).removeClass("active")}catch{}});try{const i=window.getSelection().anchorNode;if(i){const t=i.nodeType===3?i.parentNode:i;if(e(t).closest(".es_editor").length){const s=window.getComputedStyle(t);if(s.fontSize&&e("#winFontSize").val(parseInt(s.fontSize)),s.fontFamily){const n=s.fontFamily.split(",")[0].replace(/['"]/g,"");e("#winFontFamily option").each(function(){(e(this).text()===n||e(this).val().includes(n))&&e("#winFontFamily").val(e(this).val())})}const o=e(t).closest("p, div, h1, h2, h3, h4, h5, h6, li");if(o.length){const n=o[0].style.lineHeight;n&&e("#winLineHeight").val(n),o[0].style.marginBottom==="0px"||s.marginBottom==="0px"?e("#btnNoMargin").addClass("active"):e("#btnNoMargin").removeClass("active")}}}}catch{}},S=()=>{const i=l.filter(t=>(t.titulo||"").toLowerCase().includes(I.toLowerCase()));e(".es_list_items_final").html(i.map(t=>{let s=t.titulo||"Untitled",o=e("<div>").html(t.contenido||"").text().trim()||"Sin contenido...",n=o.length>30?o.substring(0,30)+"...":o;const c=!t._dirty,r=new Date((t.fechaActualizado?.seconds||Date.now()/1e3)*1e3).toLocaleDateString("es-ES",{day:"2-digit",month:"short"});return`
        <div class="es_item_final ${a?._fsId===t._fsId?"active":""}" data-id="${t._fsId}">
            <div class="it_r1">
                <strong class="it_title">${t.pin?'<i class="fas fa-thumbtack pin_ico"></i> ':""}${s}</strong>
                <div class="it_icons">
                    <span class="it_status" ${f(c?"Guardado":"Pendiente")}>
                        ${c?'<i class="fas fa-cloud"></i>':'<i class="fas fa-sync-alt fa-spin" style="color:var(--warning)"></i>'}
                    </span>
                    <i class="fas fa-thumbtack it_action btnPin" data-id="${t._fsId}" style="${t.pin?"color:var(--mco)":""}" ${f(t.pin?"Desanclar":"Anclar")}></i>
                    <i class="fas fa-trash-alt it_action btnDel" data-id="${t._fsId}" ${f("Borrar")}></i>
                </div>
            </div>
            <div class="it_r2">
                <span class="it_snippet">${n}</span>
                <span class="it_date">${r}</span>
            </div>
        </div>`}).join("")||'<div class="txc" style="margin-top:20px; opacity:0.4; font-size:12px;">No hay documentos</div>')},U=()=>{const i=e(".es_left");if(i.length){if(v&&!l.length)return i.html('<div class="es_skeleton"> <div class="sk_line" style="width:40%"></div> <div class="sk_line"></div> </div>');if(!a)return i.html('<div style="margin:auto; text-align:center;"><button class="es_btn_new_final" id="btnS1" style="width:280px">+ Nuevo Win</button></div>');i.html(`
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
                <div class="es_footer_group">
                    ${["bold","italic","underline","strikeThrough"].map(t=>`
                    <button class="es_tool_btn" data-cmd="${t}" ${f(t)}><i class="fas fa-${t==="bold"?"bold":t==="italic"?"italic":t==="underline"?"underline":"strikethrough"}"></i></button>
                    `).join("")}
                </div>
                <div class="es_footer_sep"></div>
                <div class="es_footer_group">
                    ${["justifyLeft","justifyCenter","justifyRight","justifyFull"].map(t=>`
                    <button class="es_tool_btn" data-cmd="${t}" ${f(t)}><i class="fas fa-align-${t==="justifyLeft"?"left":t==="justifyCenter"?"center":t==="justifyRight"?"right":"justify"}"></i></button>
                    `).join("")}
                </div>
                <div class="es_footer_sep"></div>
                <div class="es_footer_group">
                    <button class="es_tool_btn" data-cmd="insertUnorderedList" ${f("Lista")}><i class="fas fa-list-ul"></i></button>
                    <button class="es_tool_btn" data-cmd="insertOrderedList" ${f("Numerada")}><i class="fas fa-list-ol"></i></button>
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
        </div>`)}},m=()=>{e(".es_container").length||e("#wimain").html(J()),U(),S()},J=()=>`<div class="es_container">
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
                    <div class="wn_dot_final"></div> ${g?"Offline - Local Mode":"Online - wiWin Cloud"}
                </div>
            </div>
        </div>
    </div>`,Z=async()=>{Q();const i=w();g=!i.email,l=B(),l.length?(v=!1,x()):(m(),A(i,!0)),e(document).on("click.es",".es_tool_btn[data-cmd]",function(){document.execCommand(e(this).data("cmd")),e(".es_editor").focus(),p()}).on("input.es",".es_editor, .es_in_title_h",function(){if(a){a.titulo=e(".es_in_title_h").val().trim(),a.contenido=e(".es_editor").html(),a._dirty=!0,a.fechaActualizado=C(),u(l);const t=e(`.es_item_final[data-id="${a._fsId}"]`);if(t.length)if(t.find(".it_status").html('<i class="fas fa-sync-alt fa-spin" style="color:var(--warning)"></i>'),e(this).hasClass("es_in_title_h"))t.find(".it_title").html((a.pin?'<i class="fas fa-thumbtack pin_ico"></i> ':"")+(a.titulo||"Untitled"));else{let o=e("<div>").html(a.contenido).text().trim()||"Sin contenido...",n=o.length>30?o.substring(0,30)+"...":o;t.find(".it_snippet").text(n)}const s=e(".es_editor")[0];if(s&&e(this).hasClass("es_editor")){const o=window.getSelection();if(o?.rangeCount){const n=o.getRangeAt(0).getBoundingClientRect(),c=s.closest(".es_page_content"),r=c.getBoundingClientRect();n.bottom>r.bottom-40&&(c.scrollTop+=n.bottom-r.bottom+60)}}}}).on("click.es","#btnS2",()=>H(!0)).on("click.es","#btnSync",()=>A(w())).on("click.es","#btnD2, .btnDel",function(t){t.stopPropagation(),W(e(this).data("id")||a._fsId,this)}).on("click.es",".btnPin",function(t){t.stopPropagation(),q(e(this).data("id"))}).on("click.es","#btnN1, #btnS1",O).on("click.es","#toggleMenu, .es_overlay",()=>e(".es_container").toggleClass("menu-open")).on("click.es",".es_item_final",async function(){const t=e(this).data("id");a?._fsId!==t&&(a=l.find(s=>s._fsId===t),m(),p(),e(".es_container").removeClass("menu-open"))}).on("input.es",".es_search_final",function(){I=e(this).val(),S()}).on("keyup.es mouseup.es click.es",".es_editor",function(){p();const t=window.getSelection();t.rangeCount>0&&(d=t.getRangeAt(0))}).on("keydown.es",".es_in_title_h",function(t){t.key==="Tab"&&(t.preventDefault(),e(".es_editor").focus())}).on("keydown.es","#winFontSize",function(t){if(t.key==="Enter"){t.preventDefault();const s=Math.max(8,Math.min(72,parseInt(e(this).val())||16));if(e(this).val(s),d){const o=window.getSelection();o.removeAllRanges(),o.addRange(d)}document.execCommand("styleWithCSS",!1,!0),document.execCommand("fontSize",!1,"7"),e('.es_editor font[size="7"], .es_editor span[style*="xxx-large"]').removeAttr("size").css("font-size",s+"px"),e(".es_editor").focus().trigger("input.es"),p()}}).on("change.es","#winFontFamily",function(){if(d){const t=window.getSelection();t.removeAllRanges(),t.addRange(d)}document.execCommand("styleWithCSS",!1,!0),document.execCommand("fontName",!1,e(this).val()),e(".es_editor").focus().trigger("input.es"),p()}).on("change.es","#winLineHeight",function(){if(d){const s=window.getSelection();s.removeAllRanges(),s.addRange(d)}const t=window.getSelection();if(t.rangeCount){const o=t.getRangeAt(0).commonAncestorContainer,n=o.nodeType===3?o.parentNode:o;let c=e(n).hasClass("es_editor")?e(n).children().filter(function(){return t.containsNode(this,!0)}):e(n).closest("p, div, h1, h2, h3, h4, h5, h6, li");!c.length&&e(n).hasClass("es_editor")&&(c=e(n)),c.css("line-height",e(this).val())}e(".es_editor").focus().trigger("input.es"),p()}).on("click.es","#btnNoMargin",function(){if(d){const s=window.getSelection();s.removeAllRanges(),s.addRange(d)}const t=window.getSelection();if(t.rangeCount){const o=t.getRangeAt(0).commonAncestorContainer,n=o.nodeType===3?o.parentNode:o;let c=e(n).hasClass("es_editor")?e(n).children().filter(function(){return t.containsNode(this,!0)}):e(n).closest("p, div, h1, h2, h3, h4, h5, h6, li");!c.length&&e(n).hasClass("es_editor")&&(c=e(n)),c.css("margin-bottom")==="0px"?c.css({"margin-top":"","margin-bottom":""}):c.css({"margin-top":"0px","margin-bottom":"0px","padding-bottom":"0px"})}e(".es_editor").focus().trigger("input.es"),p()})},Q=()=>{e(document).off(".es"),l=[],a=null,d=null};export{Q as cleanup,Z as init,J as render};
