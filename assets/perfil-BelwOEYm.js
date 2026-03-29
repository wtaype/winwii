import{j as i}from"./vendor-gzd0YkcT.js";import{db as d}from"./firebase-DqoUuv0g.js";import{n as u,d as _}from"./firebase-CrRCUYpg.js";import{r as m,d as c,s as v,M as e,c as b,g as h}from"./main-D7fYqA8Y.js";const l=()=>h("wiSmile")||{},D=()=>{const a=l();if(!a.email)return location.replace("/"),"";const s=a.nombre||"",r=a.apellidos||"",p=a.usuario||"",f=a.email||"",o=a.rol||"smile",n=a.uid||"",t=a.imagen||"./smile.avif";return((s[0]||"")+(r[0]||"")).toUpperCase(),`
  <div class="prf_wrap">

    <div class="prf_hero">
      <div class="prf_av_wrap">
        <img src="${t}" alt="${s}" class="prf_av" onerror="this.src='./smile.avif'">
        <div class="prf_av_ring"></div>
      </div>
      <div class="prf_hero_info">
        <h1 class="prf_fullname">${s} ${r}</h1>
        <p class="prf_username"><i class="fas fa-at"></i> ${p}</p>
        <span class="prf_rol_chip"><i class="fas fa-shield-alt"></i> ${o}</span>
      </div>
    </div>

    <div class="prf_grid">

      <div class="prf_card">
        <h2 class="prf_card_tit"><i class="fas fa-user-edit"></i> Editar perfil</h2>
        <label>Nombre</label>
        <input id="prf_nombre"    value="${s}"    placeholder="Tu nombre">
        <label>Apellidos</label>
        <input id="prf_apellidos" value="${r}" placeholder="Tus apellidos">
        <button id="prf_guardar" class="prf_btn"><i class="fas fa-save"></i> Guardar cambios</button>
      </div>

      <div class="prf_card">
        <h2 class="prf_card_tit"><i class="fas fa-info-circle"></i> Datos de cuenta</h2>
        <div class="prf_row">
          <span class="prf_lbl"><i class="fas fa-envelope"></i> Email</span>
          <span class="prf_val">${f}</span>
        </div>
        <div class="prf_row">
          <span class="prf_lbl"><i class="fas fa-user"></i> Usuario</span>
          <span class="prf_val">@${p}</span>
        </div>
        <div class="prf_row">
          <span class="prf_lbl"><i class="fas fa-shield-alt"></i> Rol</span>
          <span class="prf_val prf_rol_val">${o}</span>
        </div>
        <div class="prf_row prf_uid_row">
          <span class="prf_lbl"><i class="fas fa-fingerprint"></i> UID</span>
          <span class="prf_uid_val">${n}</span>
          <button class="prf_copy" id="prf_copy_uid" ${c("Copiar UID")}><i class="fas fa-copy"></i></button>
        </div>
      </div>

    </div>
  </div>`},I=()=>{if(!l().email)return m.navigate("/");i(document).on("click.prf","#prf_guardar",async function(){const a=l(),s=i("#prf_nombre").val().trim(),r=i("#prf_apellidos").val().trim();if(!s)return c(document.getElementById("prf_nombre"),"Ingresa tu nombre","error");i(this).prop("disabled",!0).html('<i class="fas fa-spinner fa-spin"></i> Guardando');try{await u(_(d,"smiles",a.usuario),{nombre:s,apellidos:r}),v("wiSmile",{...a,nombre:s,apellidos:r},24),i(".prf_fullname").text(`${s} ${r}`),e("Perfil actualizado ✅","success")}catch{e("Error al guardar","error")}finally{i(this).prop("disabled",!1).html('<i class="fas fa-save"></i> Guardar cambios')}}).on("click.prf","#prf_copy_uid",function(){b(l().uid||"",this,"¡UID copiado!")})},U=()=>i(document).off(".prf");export{U as cleanup,I as init,D as render};
