import{j as a}from"./vendor-gzd0YkcT.js";import{a as F,N as p,i as T}from"./main-BgIJnqNd.js";const S=(()=>{if(typeof window>"u")return"";const l=window.location.hostname;return new Set(["localhost",T]).has(l)?`http://${l}:3000`:window.location.origin})(),O=()=>`
  <div class="watermark_container mwb">
    <section class="watermark_main">
      <div class="watermark_left">
        <div class="video_info_section">
          <div class="video_info_header">
            <h3><i class="fas fa-crop-alt"></i> Selección Manual Smart</h3>
          </div>

          <div class="upload_zone_compact" id="uploadZone">
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Doble clic para seleccionar video</p>
            <input type="file" id="videoInput" accept="video/*" hidden>
          </div>

          <div class="video_actions">
            <button class="btn_select" id="btnSelect">
              <i class="fas fa-folder-open"></i>
              <span>Seleccionar</span>
            </button>
            <button class="btn_delete" id="btnDelete">
              <i class="fas fa-trash-alt"></i>
              <span>Eliminar</span>
            </button>
          </div>

          <div class="video_stats_grid" id="videoStatsGrid" style="display:none;">
            <div class="stat_card">
              <div class="stat_card_icon"><i class="fas fa-clock"></i></div>
              <div class="stat_card_label">Duración:</div>
              <div class="stat_card_value" id="videoDuration">--</div>
            </div>
            <div class="stat_card">
              <div class="stat_card_icon"><i class="fas fa-desktop"></i></div>
              <div class="stat_card_label">Resolución:</div>
              <div class="stat_card_value" id="videoResolution">--</div>
            </div>
            <div class="stat_card">
              <div class="stat_card_icon"><i class="fas fa-hdd"></i></div>
              <div class="stat_card_label">Tamaño:</div>
              <div class="stat_card_value" id="videoSize">--</div>
            </div>
            <div class="stat_card">
              <div class="stat_card_icon"><i class="fas fa-file-video"></i></div>
              <div class="stat_card_label">Formato:</div>
              <div class="stat_card_value" id="videoFormat">--</div>
            </div>
            <div class="stat_card">
              <div class="stat_card_icon"><i class="fas fa-bullseye"></i></div>
              <div class="stat_card_label">Zona:</div>
              <div class="stat_card_value" id="zoneState">--</div>
            </div>
            <div class="stat_card">
              <div class="stat_card_icon"><i class="fas fa-magic"></i></div>
              <div class="stat_card_label">Método:</div>
              <div class="stat_card_value" id="methodState">Smart</div>
            </div>
          </div>

          <div class="watermark_preview" id="watermarkPreview" style="display:none;">
            <div class="preview_header">
              <h4><i class="fas fa-eye"></i> <span id="previewTitle">Vista Previa</span></h4>
            </div>
            <div class="preview_comparison">
              <div class="preview_cell">
                <span class="preview_label">Original:</span>
                <span class="preview_value" id="previewOriginal">--</span>
              </div>
              <div class="preview_arrow"><i class="fas fa-arrow-right"></i></div>
              <div class="preview_cell">
                <span class="preview_label" id="previewLabel">Estimado:</span>
                <span class="preview_value success" id="previewEstimated">--</span>
              </div>
              <div class="preview_reduction">
                <i class="fas fa-brain"></i>
                <span id="smartResult">Smart</span>
              </div>
            </div>
          </div>

          <div class="file_info_left" id="fileInfoLeft" style="display:none;">
            <div class="file_info_header">
              <i class="fas fa-file-video"></i>
              <span>Nombre:</span>
            </div>
            <div class="file_name_display" id="fileNameDisplay" title="">video.mp4</div>
          </div>
        </div>
      </div>

      <div class="watermark_right">
        <div class="video_player_wrapper" id="videoWrapper">
          <div class="no_video_placeholder" id="noVideoPlaceholder">
            <i class="fas fa-video"></i>
            <h3>Carga video y arrastra para seleccionar zona</h3>
            <p>La zona se procesa con blur o relleno según el contenido</p>
          </div>
          <div class="video_player_container" id="videoPlayerContainer" style="display:none;">
            <video id="watermarkVideo" controls playsinline autoplay loop></video>
            <div class="wm_overlay" id="wmOverlay"></div>
          </div>
        </div>

        <div class="watermark_controls" id="watermarkControls" style="display:none;">
          <div class="legal_notice">
            <i class="fas fa-balance-scale"></i>
            <span>Solo para contenido propio o autorizado.</span>
          </div>

          <div class="auto_info">
            <div class="auto_item"><i class="fas fa-mouse-pointer"></i><span>Arrastra sobre el video para marcar zona.</span></div>
            <div class="auto_item"><i class="fas fa-robot"></i><span>Smart decide blur o relleno automáticamente.</span></div>
          </div>

          <div class="controls_row watermark_action">
            <button class="btn_watermark" id="btnWatermark">
              <i class="fas fa-eraser"></i>
              <span>Procesar</span>
            </button>
            <div class="progress_wrapper" id="progressWrapper" style="display:none;">
              <div class="progress_bar_inline"><div class="progress_fill_inline" id="progressFillInline"></div></div>
              <span class="progress_text" id="progressText">0%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
`,V=()=>{console.log(`✅ Watermark manual-smart de ${F} cargado`);let l=null,c=null,f=!1,o=null,h=!1,u=null;const W=e=>`${Math.floor(e/60)}:${Math.floor(e%60).toString().padStart(2,"0")}`,w=e=>e<1024?`${e.toFixed(2)} B`:e<1024*1024?`${(e/1024).toFixed(2)} KB`:`${(e/(1024*1024)).toFixed(2)} MB`,_=e=>{a("#progressFillInline").css("width",`${e}%`),a("#progressText").text(`${e}%`)},b=()=>{const e=a("#watermarkVideo")[0];if(!e)return null;const t=e.getBoundingClientRect(),i=e.videoWidth||c?.width||0,s=e.videoHeight||c?.height||0;if(!i||!s||!t.width||!t.height)return null;const r=Math.min(t.width/i,t.height/s),n=i*r,d=s*r,v=(t.width-n)/2,g=(t.height-d)/2;return{rect:t,offsetX:v,offsetY:g,renderLeft:t.left+v,renderTop:t.top+g,renderWidth:n,renderHeight:d}},x=(e,t,i,s,r)=>{const n=Math.max(r.renderLeft,Math.min(e,i)),d=Math.max(r.renderTop,Math.min(t,s)),v=Math.min(r.renderLeft+r.renderWidth,Math.max(e,i)),g=Math.min(r.renderTop+r.renderHeight,Math.max(t,s)),R=Math.max(6,v-n),U=Math.max(6,g-d);return{x:(n-r.renderLeft)/r.renderWidth*100,y:(d-r.renderTop)/r.renderHeight*100,width:R/r.renderWidth*100,height:U/r.renderHeight*100}},m=()=>{const e=a("#wmOverlay");if(!o)return e.hide();const t=b();if(!t)return e.hide();const i=t.offsetX+o.x/100*t.renderWidth,s=t.offsetY+o.y/100*t.renderHeight,r=o.width/100*t.renderWidth,n=o.height/100*t.renderHeight;e.show().css({left:`${i}px`,top:`${s}px`,width:`${r}px`,height:`${n}px`}),a("#zoneState").text(`${o.width.toFixed(1)}x${o.height.toFixed(1)}%`)},z=e=>{if(!c||f)return;const t=b();if(!t)return;const i=e.clientX>=t.renderLeft&&e.clientX<=t.renderLeft+t.renderWidth,s=e.clientY>=t.renderTop&&e.clientY<=t.renderTop+t.renderHeight;!i||!s||(h=!0,u={x:e.clientX,y:e.clientY,metrics:t},o=x(e.clientX,e.clientY,e.clientX+8,e.clientY+8,t),m())},P=e=>{!h||!u||(o=x(u.x,u.y,e.clientX,e.clientY,u.metrics),m())},$=()=>{h&&(h=!1,o&&(o.width<1.2||o.height<1.2)&&(o=null,m(),p("Selecciona un área más grande","warning",1800),a("#zoneState").text("--")))},L=()=>{c&&(a("#previewOriginal").text(w(c.size)),a("#previewEstimated").text(w(c.size*1.01)),a("#watermarkPreview").fadeIn())},k=e=>{if(!e.type.startsWith("video/"))return p("Por favor selecciona un archivo de video válido","error",3e3);l=e;const t=a("#watermarkVideo")[0],i=URL.createObjectURL(e);t.onloadedmetadata=t.onerror=null,t.src=i,t.onloadedmetadata=()=>{const s=t.duration,r=e.size;c={duration:s,size:r,bitrateMbps:r*8/Math.max(1,s)/1e3/1e3,width:t.videoWidth,height:t.videoHeight,format:e.name.split(".").pop().toUpperCase()},a("#noVideoPlaceholder").hide(),a("#videoPlayerContainer, #watermarkControls, #watermarkPreview, #videoStatsGrid, #fileInfoLeft").show(),a("#fileNameDisplay").text(e.name).attr("title",e.name),a("#videoDuration").text(W(s)),a("#videoResolution").text(`${t.videoWidth}x${t.videoHeight}`),a("#videoSize").text(w(r)),a("#videoFormat").text(c.format),a("#videoBitrate").text(`${c.bitrateMbps.toFixed(2)} Mbps`),o={x:70,y:80,width:30,height:20},a("#zoneState").text("30.0x20.0%"),a("#smartResult").text("Smart"),m(),L(),p("✅ Video listo. Zona por defecto: right-bottom 30x20. Puedes arrastrar para cambiar.","success",3400)},t.onerror=()=>{l&&(p("Error al cargar el video. Intenta con otro archivo.","error",3e3),y())}},y=()=>{const e=a("#watermarkVideo")[0];e&&(e.onloadedmetadata=e.onerror=null,e.pause(),e.src&&URL.revokeObjectURL(e.src),e.src="",e.load()),a("#videoPlayerContainer, #watermarkControls, #watermarkPreview, #videoStatsGrid, #fileInfoLeft").hide(),a("#noVideoPlaceholder").show(),a("#videoInput").val(""),a("#progressWrapper").hide(),o=null,m(),l=null,c=null,f=!1},M=async()=>{if(!l)return p("No hay video para procesar","warning",2e3);if(!o)return p("Primero selecciona una zona arrastrando sobre el video","warning",2200);if(f)return p("Ya hay un procesamiento en progreso","warning",2e3);const e=(i,s="Analizando zona...")=>{i?(a("#btnWatermark").prop("disabled",!0).html(`<i class="fas fa-spinner fa-spin"></i> ${s}`),a("#progressWrapper").fadeIn()):(a("#progressWrapper").fadeOut(),a("#btnWatermark").prop("disabled",!1).html('<i class="fas fa-eraser"></i> Procesar'))},t=async({mode:i="smart-manual",method:s="",color:r=""}={})=>{const n=new FormData;n.append("video",l),n.append("mode",i),s&&n.append("method",s),r&&n.append("color",r),n.append("x",o.x.toFixed(3)),n.append("y",o.y.toFixed(3)),n.append("width",o.width.toFixed(3)),n.append("height",o.height.toFixed(3));const d=await fetch(`${S}/watermark`,{method:"POST",body:n}),v=await d.json().catch(()=>null);if(!d.ok)throw new Error(v?.error||`Error del servidor (${d.status})`);if(!v?.success)throw new Error(v?.error||"Error desconocido");return v};try{f=!0,e(!0,"Analizando zona..."),_(10);let i;try{i=await t({mode:"smart-manual"})}catch(v){console.warn("⚠️ Smart falló, intentando fallback cover:",v.message),e(!0,"Aplicando fallback..."),i=await t({mode:"manual",method:"cover",color:"black@0.70"})}_(60),a("#methodState").text(i.methodUsed||"Smart"),a("#smartResult").text(i.methodUsed||"Smart"),i.zone&&(o=i.zone,m()),_(82);const r=await(await fetch(`${S}${i.downloadUrl}`)).blob(),n=URL.createObjectURL(r),d=document.createElement("a");d.href=n,d.download=`clean_manual_${l.name}`,d.click(),URL.revokeObjectURL(n),_(100),a("#previewTitle").text("Resultado"),a("#previewLabel").text("Procesado:"),a("#previewEstimated").text(w(r.size)),setTimeout(()=>{e(!1),p(`✅ Listo: método ${i.methodUsed||"smart"}`,"success",3200)},700)}catch(i){console.error("❌ Error watermark manual-smart:",i),e(!1),p(`Error al procesar: ${i.message}`,"error",4e3)}finally{f=!1}};a("#uploadZone").on("dblclick",()=>a("#videoInput").click()).on("dragover",e=>{e.preventDefault(),a(e.currentTarget).addClass("dragover")}).on("dragleave",e=>a(e.currentTarget).removeClass("dragover")).on("drop",e=>{e.preventDefault(),a(e.currentTarget).removeClass("dragover");const t=e.originalEvent.dataTransfer.files;t.length&&k(t[0])}),a("#videoInput").on("change",e=>{const t=e.target.files[0];t&&k(t)}),a("#videoWrapper").on("pointerdown","#watermarkVideo, #wmOverlay",z),a(document).on("pointermove",P),a(document).on("pointerup",$),a(window).on("resize.watermark",m),a(document).on("click","#btnSelect",()=>!f&&a("#videoInput").click()),a(document).on("click","#btnDelete",()=>{if(f)return p("No puedes eliminar mientras se procesa","warning",2e3);confirm("¿Estás seguro de eliminar este video?")&&(y(),p("Video eliminado","success",2e3))}),a(document).on("click","#btnWatermark",M)},C=()=>{console.log("🧹 Watermark manual-smart limpiado"),a("#uploadZone, #videoInput, #btnSelect, #btnDelete, #btnWatermark, #videoWrapper").off(),a(document).off("pointermove").off("pointerup"),a(window).off("resize.watermark");const l=a("#watermarkVideo")[0];l?.src&&URL.revokeObjectURL(l.src)};export{C as cleanup,V as init,O as render};
