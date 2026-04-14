import{j as i}from"./vendor-gzd0YkcT.js";import{auth as y,db as u}from"./firebase-BInPmxgK.js";import{m as I,c as h,k as A,d as b,q as L,w as T,a as S,e as f}from"./firebase-DYzFYKGm.js";import{N as n,h as l,g as U,d as p}from"./main-LeR3ZN5I.js";const e="wiAudios",d="wiImg",m=()=>U("wiSmile")?.email||y.currentUser?.email||"",g=async s=>{const t=m();if(!t)return[];const r=L(h(u,s),T("email","==",t));return(await S(r)).docs.map(c=>({id:c.id,...c.data()})).sort((c,o)=>(o.creado?.seconds||0)-(c.creado?.seconds||0))},v=async(s,t,r)=>{const a=m();return a?(await I(h(u,s),{email:a,titulo:t,src:r,creado:f(),actualizado:f()})).id:null},k=async(s,t)=>{await A(b(u,s,t))},B=()=>g(e),D=()=>g(d),x=(s,t)=>`
<div class="ag_item" data-id="${s.id}" data-col="${t}">
  <div class="ag_item_info">
    <span class="ag_item_titulo">${s.titulo}</span>
    <span class="ag_item_src" title="${s.src}">${s.src.length>50?s.src.substring(0,50)+"...":s.src}</span>
  </div>
  <div class="ag_item_accs">
    <button class="ag_copiar" ${p("Copiar URL")}><i class="fas fa-copy"></i></button>
    <button class="ag_eliminar" ${p("Eliminar")}><i class="fas fa-trash"></i></button>
  </div>
</div>`,_=(s,t)=>s.length?s.map(r=>x(r,t)).join(""):'<p class="ag_vacio"><i class="fas fa-inbox"></i> Sin elementos guardados</p>',j=()=>`
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
</div>`,q=async()=>{if(!m())return n("Inicia sesión para gestionar recursos","warning");const t=async()=>{const a=await g(e);i("#agAudList").html(_(a,e))},r=async()=>{const a=await g(d);i("#agImgList").html(_(a,d))};await Promise.all([t(),r()]),i(document).on("click.ag","#agAudBtn",async function(){const a=i("#agAudTit").val().trim(),c=i("#agAudSrc").val().trim();if(!a||!c)return n("Completa título y URL","warning");l(this,!0);try{await v(e,a,c),i("#agAudTit, #agAudSrc").val(""),await t(),n("Audio guardado 🎵","success")}catch(o){console.error(o),n("Error al guardar","error")}finally{l(this,!1)}}),i(document).on("click.ag","#agImgBtn",async function(){const a=i("#agImgTit").val().trim(),c=i("#agImgSrc").val().trim();if(!a||!c)return n("Completa título y URL","warning");l(this,!0);try{await v(d,a,c),i("#agImgTit, #agImgSrc").val(""),await r(),n("Imagen guardada 🖼️","success")}catch(o){console.error(o),n("Error al guardar","error")}finally{l(this,!1)}}),i(document).on("click.ag",".ag_copiar",function(){const a=i(this).closest(".ag_item").find(".ag_item_src").attr("title");navigator.clipboard.writeText(a),n("URL copiada","success")}),i(document).on("click.ag",".ag_eliminar",async function(){const a=i(this).closest(".ag_item"),c=a.data("id"),o=a.data("col");a.css("opacity",".4");try{await k(o,c),a.slideUp(200,()=>a.remove()),n("Eliminado","info")}catch(w){console.error(w),a.css("opacity","1"),n("Error","error")}})},O=()=>{i(document).off(".ag")};export{O as cleanup,q as init,B as misAudios,D as misImagenes,j as render};
