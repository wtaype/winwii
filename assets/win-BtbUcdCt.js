import{j as s}from"./vendor-gzd0YkcT.js";import{db as v}from"./firebase-BInPmxgK.js";import{q as z,c as N,w as A,l as j,a as G,e as m,b as T,d as g,k as q}from"./firebase-DYzFYKGm.js";import{d as f,g as O,h as d,N as k}from"./main-LeR3ZN5I.js";let a=[],i=null,x="",I=null,p=null,_=!0,l=!1;const h="wiWin",D="wi_win_cache",b=()=>O("wiSmile")||{},u=t=>localStorage.setItem(D,JSON.stringify(t)),U=()=>JSON.parse(localStorage.getItem(D)||"[]"),L=()=>a.sort((t,e)=>(e.pin?1:0)-(t.pin?1:0)||(e.fechaActualizado?.seconds||0)-(t.fechaActualizado?.seconds||0)),w=async(t,e=!1)=>{if(l=!t?.email,l){_=!1,C();return}e||s(".es_btn_refresh").addClass("syncing");try{const n=z(N(v,h),A("email","==",t.email),j(100));a=(await G(n)).docs.map(o=>({_fsId:o.id,...o.data()})),L(),u(a),_=!1,C()}catch{_=!1,e||r()}finally{s(".es_btn_refresh").removeClass("syncing")}},C=()=>{i||(i=a.find(t=>t.pin)||a[0]||null),r()},S=async(t=!1)=>{if(!i)return;const e=b(),n=s("#btnS2"),c=s(".es_in_title_h").val().trim()||"Untitled",o=s(".es_editor").html();if(!(!t&&i.titulo===c&&i.contenido===o)){if(i.titulo=c,i.contenido=o,u(a),t&&d(n,!0,"Guardando"),l){t&&setTimeout(()=>{d(n,!1,"Guardado"),setTimeout(()=>n.html('<i class="fas fa-save"></i> <span>Guardar</span>'),1500)},600);return}try{const y=i._fsId,P={id:i.id,titulo:i.titulo,contenido:i.contenido,email:e.email,usuario:e.usuario||"Public",fecha:i.fecha||m(),fechaActualizado:m(),pin:i.pin||!1};await T(g(v,h,y),P),t&&(k("Sincronización Exitosa ✨","success",800),d(n,!1,"Guardado"))}catch(y){t&&(console.error("Save Error:",y),k("Error al guardar","error"),d(n,!1,"Reintentar"))}finally{t&&setTimeout(()=>{s("#btnS2").length&&s("#btnS2").html('<i class="fas fa-save"></i> <span>Guardar</span>')},2e3)}}},W=async()=>{const t=b(),e=Date.now(),n=`win${e}`,c={_fsId:n,id:n,titulo:"",contenido:"",pin:!1,email:t.email||"guest",usuario:t.usuario||"Public",fecha:m(),fechaActualizado:m()};if(a.unshift(c),i=c,u(a),r(),s(".es_in_title_h").focus(),!l)try{const o={...c};delete o._fsId,await T(g(v,h,n),o)}catch{}s(".es_container").removeClass("menu-open")},M=async(t,e=null)=>{if(confirm("¿Eliminar?")){e&&d(s(e),!0,"...");try{a=a.filter(n=>n._fsId!==t),i?._fsId===t&&(i=a[0]||null),u(a),l||await q(g(v,h,t)),r()}catch{e&&d(s(e),!1,'<i class="fas fa-trash-alt"></i>'),k("Error al eliminar","error")}}},B=async t=>{const e=a.find(n=>n._fsId===t);if(e&&(e.pin=!e.pin,L(),u(a),r(),!l))try{await T(g(v,h,t),{...e,_fsId:void 0,fechaActualizado:m()})}catch{}},$=()=>{s(".es_tool_btn").each(function(){const t=s(this).data("cmd");try{document.queryCommandState(t)?s(this).addClass("active"):s(this).removeClass("active")}catch{}})},E=()=>{const t=a.filter(e=>(e.titulo||"").toLowerCase().includes(x.toLowerCase()));s(".es_list_items_final").html(t.map(e=>`
        <div class="es_item_final ${i?._fsId===e._fsId?"active":""}" data-id="${e._fsId}">
            <div class="item_info_final">
                <strong>${e.titulo||"Untitled"}</strong>
                <span>${new Date((e.fechaActualizado?.seconds||Date.now()/1e3)*1e3).toLocaleDateString()}</span>
            </div>
            <div class="item_acts_final">
                <div class="btn_sub btnPin" data-id="${e._fsId}" ${f("Pin")}><i class="fas fa-thumbtack"></i></div>
                <div class="btn_sub btnDel" data-id="${e._fsId}" ${f("Borrar")}><i class="fas fa-trash"></i></div>
            </div>
        </div>`).join("")||'<div class="txc" style="margin-top:20px; opacity:0.4;">Registry Empty</div>')},H=()=>{const t=s(".es_left");if(t.length){if(_&&!a.length)return t.html('<div class="es_skeleton"> <div class="sk_line" style="width:40%"></div> <div class="sk_line"></div> </div>');if(!i)return t.html('<div style="margin:auto; text-align:center;"><button class="es_btn_new_final" id="btnS1" style="width:280px">+ Nuevo Win</button></div>');t.html(`
        <div class="es_page">
            <div class="es_page_header">
                <div class="es_header_left">
                    <input type="text" class="es_in_title_h" placeholder="Escribir el título..." value="${i.titulo||""}" spellcheck="false">
                </div>
                <div class="es_header_right">
                    <button class="es_btn_pro save" id="btnS2"><i class="fas fa-save" id="iconSync"></i> <span>Guardar</span></button>
                    <button class="es_btn_pro del" id="btnD2" ${f("Eliminar permanentemente")}><i class="fas fa-trash-alt"></i> <span>Eliminar</span></button>
                    <button class="es_btn_menu" id="toggleMenu" ${f("Historial")}><i class="fas fa-history"></i></button>
                </div>
            </div>
            <div class="es_page_content">
                <div class="es_editor" contenteditable="true" data-placeholder="Escriba aquí contenido pro..." spellcheck="false">${i.contenido||""}</div>
            </div>
            <div class="es_page_footer">
                ${["bold","italic","underline","justifyCenter","insertUnorderedList"].map(e=>`
                    <button class="es_tool_btn" data-cmd="${e}" ${f(e)}><i class="fas fa-${e==="justifyCenter"?"align-center":e==="insertUnorderedList"?"list-ul":e==="underline"?"underline":e}"></i></button>
                `).join("")}
            </div>
        </div>`)}},r=()=>{s(".es_container").length||s("#wimain").html(J()),H(),E()},J=()=>`<div class="es_container">
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
                    <div class="wn_dot_final"></div> ${l?"Offline - Local Mode":"Online - wiWin Cloud"}
                </div>
            </div>
        </div>
    </div>`,X=async()=>{R();const t=b();l=!t.email,a=U(),a.length?(_=!1,C()):r(),w(t,!0),s(document).on("click.es",".es_tool_btn[data-cmd]",function(){document.execCommand(s(this).data("cmd")),s(".es_editor").focus(),$()}).on("input.es",".es_editor, .es_in_title_h",function(){i&&(i.titulo=s(".es_in_title_h").val().trim(),i.contenido=s(".es_editor").html(),u(a),s(".es_in_title_h").is(":focus")&&E()),clearTimeout(I),I=setTimeout(S,3e4)}).on("click.es","#btnS2",()=>S(!0)).on("click.es","#btnSync",()=>w(b())).on("click.es","#btnD2, .btnDel",function(e){e.stopPropagation(),M(s(this).data("id")||i._fsId,this)}).on("click.es",".btnPin",function(e){e.stopPropagation(),B(s(this).data("id"))}).on("click.es","#btnN1, #btnS1",W).on("click.es","#toggleMenu, .es_overlay",()=>s(".es_container").toggleClass("menu-open")).on("click.es",".es_item_final",async function(){const e=s(this).data("id");i?._fsId!==e&&(await S(),i=a.find(n=>n._fsId===e),r(),$(),s(".es_container").removeClass("menu-open"))}).on("input.es",".es_search_final",function(){x=s(this).val(),E()}).on("keyup.es mouseup.es click.es",".es_editor",$).on("keydown.es",".es_in_title_h",function(e){e.key==="Tab"&&(e.preventDefault(),s(".es_editor").focus())}),p=()=>!document.hidden&&w(t,!0),document.addEventListener("visibilitychange",p)},R=()=>{s(document).off(".es"),p&&document.removeEventListener("visibilitychange",p),a=[],i=null,clearTimeout(I)};export{R as cleanup,X as init,J as render};
