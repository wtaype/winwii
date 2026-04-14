import{j as i}from"./vendor-gzd0YkcT.js";import{db as v}from"./firebase-D3LCa7rv.js";import{q as P,c as z,w as A,l as j,a as G,e as _,b as D,d as y,k as q}from"./firebase-DYzFYKGm.js";import{d as m,g as O,h as r,N as $}from"./main-D1Fv2rJO.js";let a=[],s=null,T="",k=null,p=null,u=!0,l=!1;const h="wiWin",x="wi_win_cache",b=()=>O("wiSmile")||{},f=e=>localStorage.setItem(x,JSON.stringify(e)),U=()=>JSON.parse(localStorage.getItem(x)||"[]"),L=()=>a.sort((e,t)=>(t.pin?1:0)-(e.pin?1:0)||(t.fechaActualizado?.seconds||0)-(e.fechaActualizado?.seconds||0)),w=async(e,t=!1)=>{if(l=!e?.email,l){u=!1,E();return}t||i(".es_btn_refresh").addClass("syncing");try{const n=P(z(v,h),A("email","==",e.email),j(100));a=(await G(n)).docs.map(o=>({_fsId:o.id,...o.data()})),L(),f(a),u=!1,E()}catch{u=!1,t||d()}finally{i(".es_btn_refresh").removeClass("syncing")}},E=()=>{s||(s=a.find(e=>e.pin)||a[0]||null),d()},S=async(e=!1)=>{if(!s)return;const t=b(),n=i("#btnS2"),c=i(".es_in_title_h").val().trim()||"Untitled",o=i(".es_editor").html();if(!(!e&&s.titulo===c&&s.contenido===o)){if(s.titulo=c,s.contenido=o,f(a),e&&r(n,!0,"Guardando"),l){e&&setTimeout(()=>{r(n,!1,"Guardado"),setTimeout(()=>n.html('<i class="fas fa-save"></i> Guardar'),1500)},600);return}try{const g=s._fsId,N={id:s.id,titulo:s.titulo,contenido:s.contenido,email:t.email,usuario:t.usuario||"Public",fecha:s.fecha||_(),fechaActualizado:_(),pin:s.pin||!1};await D(y(v,h,g),N),e&&($("Sincronización Exitosa ✨","success",800),r(n,!1,"Guardado"))}catch(g){e&&(console.error("Save Error:",g),$("Error al guardar","error"),r(n,!1,"Reintentar"))}finally{e&&setTimeout(()=>{i("#btnS2").length&&i("#btnS2").html('<i class="fas fa-save"></i> Guardar')},2e3)}}},W=async()=>{const e=b(),t=Date.now(),n=`win${t}`,c={_fsId:n,id:n,titulo:"",contenido:"",pin:!1,email:e.email||"guest",usuario:e.usuario||"Public",fecha:_(),fechaActualizado:_()};if(a.unshift(c),s=c,f(a),d(),i(".es_in_title_h").focus(),!l)try{const o={...c};delete o._fsId,await D(y(v,h,n),o)}catch(o){console.error("New Doc Error:",o)}},B=async(e,t=null)=>{if(confirm("¿Eliminar?")){t&&r(i(t),!0,"...");try{a=a.filter(n=>n._fsId!==e),s?._fsId===e&&(s=a[0]||null),f(a),l||await q(y(v,h,e)),d()}catch{t&&r(i(t),!1,'<i class="fas fa-trash-alt"></i>'),$("Error al eliminar","error")}}},J=async e=>{const t=a.find(n=>n._fsId===e);if(t&&(t.pin=!t.pin,L(),f(a),d(),!l))try{await D(y(v,h,e),{...t,_fsId:void 0,fechaActualizado:_()})}catch{}},I=()=>{i(".es_tool_btn").each(function(){const e=i(this).data("cmd");try{document.queryCommandState(e)?i(this).addClass("active"):i(this).removeClass("active")}catch{}})},C=()=>{const e=a.filter(t=>(t.titulo||"").toLowerCase().includes(T.toLowerCase()));i(".es_list_items_final").html(e.map(t=>`
        <div class="es_item_final ${s?._fsId===t._fsId?"active":""}" data-id="${t._fsId}">
            <div class="item_info_final">
                <strong>${t.titulo||"Untitled"}</strong>
                <span>${new Date((t.fechaActualizado?.seconds||Date.now()/1e3)*1e3).toLocaleDateString()}</span>
            </div>
            <div class="item_acts_final">
                <div class="btn_sub btnPin" data-id="${t._fsId}" ${m("Pin")}><i class="fas fa-thumbtack"></i></div>
                <div class="btn_sub btnDel" data-id="${t._fsId}" ${m("Borrar")}><i class="fas fa-trash"></i></div>
            </div>
        </div>`).join("")||'<div class="txc" style="margin-top:20px; opacity:0.4;">Registry Empty</div>')},R=()=>{const e=i(".es_left");if(e.length){if(u&&!a.length)return e.html('<div class="es_skeleton"> <div class="sk_line" style="width:40%"></div> <div class="sk_line"></div> </div>');if(!s)return e.html('<div style="margin:auto; text-align:center;"><button class="es_btn_new_final" id="btnS1" style="width:280px">+ Nuevo Win</button></div>');e.html(`
        <div class="es_page">
            <div class="es_page_header">
                <div class="es_header_left">
                    <input type="text" class="es_in_title_h" placeholder="Escribir el título..." value="${s.titulo||""}" spellcheck="false">
                </div>
                <div class="es_header_right">
                    <button class="es_btn_pro save" id="btnS2"><i class="fas fa-save" id="iconSync"></i> Guardar</button>
                    <button class="es_btn_pro del" id="btnD2" ${m("Eliminar permanentemente")}><i class="fas fa-trash-alt"></i> Eliminar</button>
                </div>
            </div>
            <div class="es_page_content">
                <div class="es_editor" contenteditable="true" data-placeholder="Escriba aquí contenido pro..." spellcheck="false">${s.contenido||""}</div>
            </div>
            <div class="es_page_footer">
                ${["bold","italic","underline","justifyCenter","insertUnorderedList"].map(t=>`
                    <button class="es_tool_btn" data-cmd="${t}" ${m(t)}><i class="fas fa-${t==="justifyCenter"?"align-center":t==="insertUnorderedList"?"list-ul":t==="underline"?"underline":t}"></i></button>
                `).join("")}
            </div>
        </div>`)}},d=()=>{i(".es_container").length||i("#wimain").html(F()),R(),C()},F=()=>`<div class="es_container"><div class="es_left"></div><div class="es_right">
        <div class="es_sidebar_final">
            <div class="es_sidebar_actions">
                <button class="es_btn_new_final" id="btnN1">+ Nuevo Win</button>
                <button class="es_btn_refresh" id="btnSync" ${m("Sync Firestore")}><i class="fas fa-sync-alt"></i></button>
            </div>
            <input type="text" class="es_search_final" placeholder="Buscar documentos...">
            <div class="es_list_items_final"></div>
            <div style="margin-top:auto; font-size:10px; opacity:0.5; display:flex; align-items:center; gap:5px;">
                <div class="wn_dot_final"></div> ${l?"Offline - Local Mode":"Online - wiWin Cloud"}
            </div>
        </div></div></div>`,X=async()=>{H();const e=b();l=!e.email,a=U(),a.length?(u=!1,E()):d(),w(e,!0),i(document).on("click.es",".es_tool_btn[data-cmd]",function(){document.execCommand(i(this).data("cmd")),i(".es_editor").focus(),I()}).on("input.es",".es_editor, .es_in_title_h",function(){s&&(s.titulo=i(".es_in_title_h").val().trim()||"Untitled",s.contenido=i(".es_editor").html(),f(a),i(".es_in_title_h").is(":focus")&&C()),clearTimeout(k),k=setTimeout(S,3e4)}).on("click.es","#btnS2",()=>S(!0)).on("click.es","#btnSync",()=>w(b())).on("click.es","#btnD2, .btnDel",function(t){t.stopPropagation(),B(i(this).data("id")||s._fsId,this)}).on("click.es",".btnPin",function(t){t.stopPropagation(),J(i(this).data("id"))}).on("click.es","#btnN1, #btnS1",W).on("click.es",".es_item_final",async function(){const t=i(this).data("id");s&&s._fsId===t||(await S(),s=a.find(n=>n._fsId===t),d(),I())}).on("input.es",".es_search_final",function(){T=i(this).val(),C()}).on("keyup.es mouseup.es click.es",".es_editor",I).on("keydown.es",".es_in_title_h",function(t){t.key==="Tab"&&(t.preventDefault(),i(".es_editor").focus())}),p=()=>!document.hidden&&w(e,!0),document.addEventListener("visibilitychange",p)},H=()=>{i(document).off(".es"),p&&document.removeEventListener("visibilitychange",p),a=[],s=null,clearTimeout(k)};export{H as cleanup,X as init,F as render};
