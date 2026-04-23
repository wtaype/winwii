import{j as i}from"./vendor-gzd0YkcT.js";import{a as v,j as d,w as x}from"./main-Dlu14CdS.js";const b={tiktok:{name:"TikTok",maxDuration:180,aspectRatio:"9:16",recommended:"1080x1920",formats:["MP4","MOV"],maxSize:287},youtube:{name:"YouTube Shorts",maxDuration:60,aspectRatio:"9:16",recommended:"1080x1920",formats:["MP4","MOV","WEBM"],maxSize:256},facebook:{name:"Facebook Reels",maxDuration:90,aspectRatio:"9:16",recommended:"1080x1920",formats:["MP4","MOV"],maxSize:4e3}},$=()=>`
  <div class="preview_container mwb">
    <section class="preview_main">
      <div class="preview_left">
        <div class="device_wrapper">
          <div class="device_mockup vertical tiktok" id="deviceMockup">
            <div class="device_frame">
              <div class="device_notch"></div>
              <div class="device_screen">
                <div class="no_video_placeholder" id="noVideoPlaceholder">
                  <i class="fas fa-video"></i>
                  <p>Carga un video para previsualizar</p>
                </div>
                <video id="previewVideo" controls playsinline autoplay loop style="display:none;"></video>
                <div class="platform_ui" id="platformUI"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="preview_right">
        <div class="upload_zone" id="uploadZone">
          <div class="upload_icon"><i class="fas fa-cloud-upload-alt"></i></div>
          <h3>Arrastra tu video aquí</h3>
          <p>o haz doble clic para seleccionar</p>
          <span class="upload_formats">MP4, MOV, WEBM, AVI</span>
          <input type="file" id="videoInput" accept="video/*" hidden>
        </div>
        <div class="video_info_panel" id="videoInfoPanel" style="display:none;">
          <div class="info_header">
            <h3><i class="fas fa-info-circle"></i> Información del Video</h3>
          </div>
          <div class="info_actions">
            <button class="btn_select" id="btnSelect"><i class="fas fa-folder-open"></i><span>Seleccionar</span></button>
            <button class="btn_delete" id="btnDelete"><i class="fas fa-trash-alt"></i><span>Eliminar</span></button>
          </div>
          <div class="platform_selector">
            ${["tiktok","youtube","facebook"].map((e,o)=>`<button class="platform_btn${o===0?" active":""}" data-platform="${e}"><i class="fab fa-${e}"></i><span>${b[e].name.split(" ")[0]}</span></button>`).join("")}
          </div>
          <div class="orientation_selector">
            <button class="orientation_btn active" data-orientation="vertical"><i class="fas fa-mobile-alt"></i><span>Vertical (9:16)</span></button>
            <button class="orientation_btn" data-orientation="horizontal"><i class="fas fa-desktop"></i><span>Horizontal (16:9)</span></button>
          </div>
          <div class="info_stats">
            <div class="stat_item">
              <div class="stat_icon"><i class="fas fa-clock"></i></div>
              <div class="stat_content">
                <span class="stat_label">Duración:</span>
                <span class="stat_value" id="videoDuration">--</span>
              </div>
            </div>
            <div class="stat_item">
              <div class="stat_icon"><i class="fas fa-expand"></i></div>
              <div class="stat_content">
                <span class="stat_label">Resolución:</span>
                <span class="stat_value" id="videoResolution">--</span>
              </div>
            </div>
            <div class="stat_item">
              <div class="stat_icon"><i class="fas fa-file"></i></div>
              <div class="stat_content">
                <span class="stat_label">Tamaño:</span>
                <span class="stat_value" id="videoSize">--</span>
              </div>
            </div>
            <div class="stat_item">
              <div class="stat_icon"><i class="fas fa-film"></i></div>
              <div class="stat_content">
                <span class="stat_label">Formato:</span>
                <span class="stat_value" id="videoFormat">--</span>
              </div>
            </div>
            <div class="stat_item">
              <div class="stat_icon"><i class="fas fa-tachometer-alt"></i></div>
              <div class="stat_content">
                <span class="stat_label">FPS:</span>
                <span class="stat_value" id="videoFps">30</span>
              </div>
            </div>
            <div class="stat_item">
              <div class="stat_icon"><i class="fas fa-compress"></i></div>
              <div class="stat_content">
                <span class="stat_label">Bitrate:</span>
                <span class="stat_value" id="videoBitrate">--</span>
              </div>
            </div>
          </div>
          <div class="compatibility_section">
            <h4><i class="fas fa-check-circle"></i> Compatibilidad</h4>
            <div class="compatibility_grid" id="compatibilityList"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
`,V=()=>{console.log(`✅ Preview de ${v} cargado`);let e=null,o={},n=!1;const p=a=>{if(n)return console.log("Ya hay un video cargándose...");if(!a.type.startsWith("video/"))return d("Por favor selecciona un archivo de video válido","error",3e3);n=!0,e=a;const s=URL.createObjectURL(a),t=i("#previewVideo")[0];t.onloadedmetadata=t.onerror=null,t.src=s,t.onloadedmetadata=()=>{n=!1,o={duration:t.duration,width:t.videoWidth,height:t.videoHeight,size:a.size,format:a.type.split("/")[1].toUpperCase(),name:a.name},i("#noVideoPlaceholder").hide(),i("#previewVideo").show(),i("#videoDuration").text(r(t.duration)),i("#videoResolution").text(`${t.videoWidth}x${t.videoHeight}`),i("#videoSize").text(_(a.size)),i("#videoFormat").text(o.format),i("#videoBitrate").text(k(a.size,t.duration)),i("#uploadZone").hide(),i("#videoInfoPanel").fadeIn(),l(),u(),m(),d("¡Video cargado exitosamente! 🎬","success",2e3)},t.onerror=()=>{console.error("Error al cargar video"),n=!1,e&&(d("Error al cargar el video. Intenta con otro archivo.","error",3e3),f())}},f=()=>{const a=i("#previewVideo")[0];a&&(a.onloadedmetadata=a.onerror=null,a.pause(),a.src&&URL.revokeObjectURL(a.src),a.src="",a.load()),i("#previewVideo").hide(),i("#noVideoPlaceholder").show(),i("#videoInfoPanel").hide(),i("#uploadZone").show(),i("#videoInput").val(""),i("#platformUI").html(""),e=null,o={},n=!1},l=()=>{const a=i(".platform_btn.active").data("platform"),s=i(".orientation_btn.active").data("orientation");i("#deviceMockup").removeClass("tiktok youtube facebook vertical horizontal").addClass(`${a} ${s}`)},u=()=>{const a=i(".platform_btn.active").data("platform");if(!e)return i("#platformUI").html("");const s={tiktok:`<div class="tiktok_ui"><div class="tiktok_sidebar"><div class="tiktok_action"><i class="fas fa-heart"></i><span>125K</span></div><div class="tiktok_action"><i class="fas fa-comment"></i><span>1.2K</span></div><div class="tiktok_action"><i class="fas fa-share"></i><span>856</span></div></div><div class="tiktok_bottom"><div class="tiktok_user">@${v.toLowerCase()}</div><div class="tiktok_desc">Tu descripción aquí... #viral #fyp</div></div></div>`,youtube:'<div class="youtube_ui"><div class="youtube_top"><i class="fab fa-youtube"></i><span>Shorts</span></div><div class="youtube_sidebar"><div class="youtube_action"><i class="fas fa-thumbs-up"></i><span>12K</span></div><div class="youtube_action"><i class="fas fa-thumbs-down"></i></div><div class="youtube_action"><i class="fas fa-comment"></i><span>234</span></div><div class="youtube_action"><i class="fas fa-share"></i></div></div></div>',facebook:`<div class="facebook_ui"><div class="facebook_top"><div class="facebook_user"><div class="facebook_avatar" style="background-image: url('/winwii/smile.avif'); background-size: cover; background-position: center;"></div><span>${v}</span></div></div><div class="facebook_bottom"><div class="facebook_actions"><div class="facebook_action"><i class="fas fa-thumbs-up"></i> Me gusta</div><div class="facebook_action"><i class="fas fa-comment"></i> Comentar</div><div class="facebook_action"><i class="fas fa-share"></i> Compartir</div></div></div></div>`};i("#platformUI").html(s[a]||"")},m=()=>{const a=i(".platform_btn.active").data("platform"),s=b[a];if(!o.duration)return i("#compatibilityList").html("");const t=[{label:"Duración:",pass:o.duration<=s.maxDuration,current:r(o.duration),max:r(s.maxDuration)},{label:"Tamaño:",pass:o.size/1024/1024<=s.maxSize,current:_(o.size),max:`${s.maxSize}MB`},{label:"Formato:",pass:s.formats.includes(o.format),current:o.format,max:s.formats.join(", ")},{label:"Relación:",pass:h(o.width,o.height,s.aspectRatio),current:`${o.width}:${o.height}`,max:s.aspectRatio}];i("#compatibilityList").html(t.map(c=>`<div class="compat_item ${c.pass?"pass":"fail"}"><i class="fas fa-${c.pass?"check":"times"}-circle"></i><div class="compat_content"><span class="compat_label">${c.label}</span><span class="compat_value">${c.current} / ${c.max}</span></div></div>`).join(""))},h=(a,s,t)=>{const[c,g]=t.split(":").map(Number);return Math.abs(a/s-c/g)<.1},r=a=>`${Math.floor(a/60)}:${Math.floor(a%60).toString().padStart(2,"0")}`,_=a=>a<1024?a+" B":a<1024*1024?(a/1024).toFixed(2)+" KB":(a/(1024*1024)).toFixed(2)+" MB",k=(a,s)=>{if(!s)return"--";const t=a*8/s/1e3;return t>1e3?(t/1e3).toFixed(2)+" Mbps":t.toFixed(0)+" kbps"};i("#uploadZone").on("dblclick",()=>i("#videoInput").click()).on("dragover",a=>{a.preventDefault(),i(a.currentTarget).addClass("dragover")}).on("dragleave",a=>i(a.currentTarget).removeClass("dragover")).on("drop",a=>{a.preventDefault(),i(a.currentTarget).removeClass("dragover");const s=a.originalEvent.dataTransfer.files;s.length&&p(s[0])}),i("#videoInput").on("change",a=>{const s=a.target.files[0];s&&p(s)}),i(".platform_btn").on("click",function(){i(".platform_btn").removeClass("active"),i(this).addClass("active"),l(),u(),m()}),i(".orientation_btn").on("click",function(){i(".orientation_btn").removeClass("active"),i(this).addClass("active"),l()}),i(document).on("click","#btnSelect",()=>i("#videoInput").click()),i(document).on("click","#btnDelete",()=>{confirm("¿Estás seguro de eliminar este video?")&&(f(),d("Video eliminado","success",2e3))}),x(".preview_hero",()=>i(".preview_hero").addClass("visible"))},z=()=>{console.log("🧹 Preview limpiado");const e=i("#previewVideo")[0];e&&(e.onloadedmetadata=e.onerror=null,e.pause(),e.src&&URL.revokeObjectURL(e.src),e.src=""),i("#uploadZone, #videoInput, .platform_btn, .orientation_btn, #btnSelect, #btnDelete").off()};export{z as cleanup,V as init,$ as render};
