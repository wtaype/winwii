import{j as e}from"./vendor-gzd0YkcT.js";import{a as z,N as l,i as L}from"./main-B5MrI45c.js";const g=(()=>{if(typeof window>"u")return"";const d=window.location.hostname;return new Set(["localhost",L]).has(d)?`http://${d}:3000`:window.location.origin})(),M=()=>`
  <div class="extraer_container mwb">
    <section class="extraer_main">
      <!-- LEFT COLUMN (29%) -->
      <div class="extraer_left">
        <div class="video_info_section">
          <div class="video_info_header">
            <h3><i class="fas fa-wand-magic-sparkles"></i> Extraer Contenido</h3>
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
              <div class="stat_card_icon"><i class="fas fa-tachometer-alt"></i></div>
              <div class="stat_card_label">Bitrate:</div>
              <div class="stat_card_value" id="videoBitrate">--</div>
            </div>
            <div class="stat_card">
              <div class="stat_card_icon"><i class="fas fa-star"></i></div>
              <div class="stat_card_label">FPS:</div>
              <div class="stat_card_value" id="videoFps">--</div>
            </div>
          </div>

          <div class="extraction_preview" id="extractionPreview" style="display:none;">
            <div class="preview_header">
              <h4><i class="fas fa-eye"></i> <span id="previewTitle">Vista Previa</span></h4>
            </div>
            <div class="preview_comparison">
              <div class="preview_cell">
                <span class="preview_label">Original:</span>
                <span class="preview_value" id="previewOriginal">--</span>
              </div>
              <div class="preview_arrow">
                <i class="fas fa-arrow-right"></i>
              </div>
              <div class="preview_cell">
                <span class="preview_label" id="previewLabel">Estimado:</span>
                <span class="preview_value success" id="previewEstimated">--</span>
              </div>
              <div class="preview_reduction">
                <i class="fas fa-chart-pie"></i>
                <span id="previewReduction">0%</span>
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

      <!-- RIGHT COLUMN (70%) -->
      <div class="extraer_right">
        <div class="video_player_wrapper">
          <div class="no_video_placeholder" id="noVideoPlaceholder">
            <i class="fas fa-video"></i>
            <h3>Carga un video para extraer contenido</h3>
            <p>Soporta MP4, MOV, WEBM, AVI, MKV y más formatos</p>
          </div>
          <div class="video_player_container" id="videoPlayerContainer" style="display:none;">
            <video id="extraerVideo" controls playsinline autoplay loop></video>
            <div class="video_timeline" id="videoTimeline" style="display:none;">
              <div class="timeline_marker" id="timelineMarker"></div>
              <div class="timeline_tooltip" id="timelineTooltip">0:00</div>
            </div>
          </div>
        </div>

        <div class="extraction_controls" id="extractionControls" style="display:none;">
          <div class="controls_row">
            <div class="control_group">
              <label><i class="fas fa-magic"></i> Extraer:</label>
              <select id="extractionTypeSelect">
                <option value="audio">🎵 Audio (MP3)</option>
                <option value="frame-manual">📸 Frame Actual</option>
                <option value="frame-auto">🖼️ 3 Frames Automáticos</option>
              </select>
            </div>

            <div class="control_group" id="qualityGroup">
              <label><i class="fas fa-star"></i> Calidad:</label>
              <select id="qualitySelect">
                <option value="320">Alta (320 kbps)</option>
                <option value="192" selected>Media (192 kbps)</option>
                <option value="128">Baja (128 kbps)</option>
                <option value="96">Muy Baja (96 kbps)</option>
              </select>
            </div>

            <div class="control_group" id="formatGroup" style="display:none;">
              <label><i class="fas fa-image"></i> Formato:</label>
              <select id="formatSelect">
                <option value="jpg" selected>JPG</option>
                <option value="png">PNG</option>
                <option value="webp">WEBP</option>
              </select>
            </div>
          </div>

          <div class="controls_row extraction_action">
            <button class="btn_extract" id="btnExtract">
              <i class="fas fa-download"></i>
              <span>Extraer Audio</span>
            </button>
            <div class="progress_wrapper" id="progressWrapper" style="display:none;">
              <div class="progress_bar_inline">
                <div class="progress_fill_inline" id="progressFillInline"></div>
              </div>
              <span class="progress_text" id="progressText">0%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
`,V=()=>{console.log(`✅ Extraer de ${z} cargado`);let d=null,m={},r=null,_="audio",f=!1;const k=(t,a)=>{const i=a.duration,s=t.size,n=s*8/i/1e3,c=n/1e3,v=t.name.split(".").pop().toLowerCase();return{duration:i,size:s,bitrate:n,bitrateMbps:c,format:v,width:a.videoWidth,height:a.videoHeight,fps:30}},b=()=>{if(!r)return;const t=e("#extractionTypeSelect").val();let a=0;switch(t){case"audio":const s=e("#qualitySelect").val(),o=parseInt(s);a=r.duration*o*1e3/8;break;case"frame-auto":const n=e("#formatSelect").val();a=y(n,90)*3;break;case"frame-manual":const v=e("#formatSelect").val();a=y(v,90);break}const i=((1-a/r.size)*100).toFixed(1);e("#previewOriginal").text(u(r.size)),e("#previewEstimated").text(u(a)),e("#previewReduction").text(`${i>0?"-":"+"}${Math.abs(i)}%`),e("#previewLabel").text("Estimado:"),e("#previewTitle").text("Vista Previa"),a>=r.size*.95?(e("#previewEstimated").removeClass("success").addClass("warning"),e("#previewReduction").closest(".preview_reduction").css("background","var(--warning)")):(e("#previewEstimated").removeClass("warning").addClass("success"),e("#previewReduction").closest(".preview_reduction").css("background","var(--success)")),e("#extractionPreview").fadeIn()},y=(t,a)=>{const s=r.width*r.height/10,o={jpg:.8,png:2.5,webp:.6}[t]||1,n=parseInt(a)/100;return s*o*n},w=t=>{const a=Math.floor(t/60),i=Math.floor(t%60);return`${a}:${i.toString().padStart(2,"0")}`},E=t=>{if(!t.type.startsWith("video/")){l("Por favor selecciona un archivo de video válido","error",3e3);return}d=t;const a=URL.createObjectURL(t),i=e("#extraerVideo")[0];i.onloadedmetadata=i.onerror=null,i.src=a,i.onloadedmetadata=()=>{m={duration:i.duration,width:i.videoWidth,height:i.videoHeight,size:t.size,format:t.name.split(".").pop().toUpperCase(),name:t.name},r=k(t,i),e("#noVideoPlaceholder").hide(),e("#videoPlayerContainer, #extractionControls, #extractionPreview, #videoStatsGrid, #fileInfoLeft, #videoTimeline").show(),e("#fileNameDisplay").text(t.name).attr("title",t.name),e("#videoDuration").text(w(i.duration)),e("#videoResolution").text(`${i.videoWidth}x${i.videoHeight}`),e("#videoSize").text(u(t.size)),e("#videoFormat").text(m.format),e("#videoBitrate").text(`${r.bitrateMbps.toFixed(2)} Mbps`),e("#videoFps").text(`${r.fps} fps`),b(),l(`✅ Video analizado: ${r.format.toUpperCase()} | ${w(i.duration)}`,"success",3e3)},i.onerror=()=>{d&&(l("Error al cargar el video. Intenta con otro archivo.","error",3e3),S())}},S=()=>{const t=e("#extraerVideo")[0];t&&(t.onloadedmetadata=t.onerror=null,t.pause(),t.src&&URL.revokeObjectURL(t.src),t.src="",t.load()),e("#videoPlayerContainer, #extractionControls, #extractionPreview, #videoStatsGrid, #fileInfoLeft, #videoTimeline").hide(),e("#noVideoPlaceholder").show(),e("#videoInput").val(""),e("#progressWrapper").hide(),d=null,m={},r=null,_="audio",f=!1},F=async()=>{if(!d){l("No hay video para extraer","warning",2e3);return}if(f){l("Ya hay una extracción en progreso","warning",2e3);return}try{f=!0,e("#btnExtract").prop("disabled",!0).html('<i class="fas fa-spinner fa-spin"></i> Extrayendo...'),e("#progressWrapper").fadeIn(),p(0);const t=e("#extractionTypeSelect").val(),a=new FormData;switch(a.append("video",d),a.append("type",t),t){case"audio":a.append("quality",e("#qualitySelect").val());break;case"frame-manual":const o=e("#extraerVideo")[0];a.append("timestamp",o.currentTime),a.append("format",e("#formatSelect").val());break;case"frame-auto":a.append("format",e("#formatSelect").val());break}p(10);const i=await fetch(`${g}/extract`,{method:"POST",body:a});if(!i.ok)throw new Error(`Error del servidor: ${i.statusText}`);p(50);const s=await i.json();if(!s.success)throw new Error(s.error||"Error desconocido");if(p(80),s.files&&Array.isArray(s.files)){for(const c of s.files)await R(`${g}${c.downloadUrl}`,c.filename);const o=s.files.reduce((c,v)=>c+(v.size||0),0);p(100),e("#previewTitle").text("Resultado"),e("#previewLabel").text("Extraído:"),e("#previewEstimated").text(u(o));const n=((1-o/r.size)*100).toFixed(1);e("#previewReduction").text(`${n>0?"-":"+"}${Math.abs(n)}%`),setTimeout(()=>{e("#progressWrapper").fadeOut(),e("#btnExtract").prop("disabled",!1).html('<i class="fas fa-download"></i> Extraer Frames'),l(`✅ ${s.files.length} frames extraídos: ${u(o)}`,"success",4e3)},1e3)}else{const o=`${g}${s.downloadUrl}`,c=await(await fetch(o)).blob();p(95);const v=document.createElement("a"),T=URL.createObjectURL(c);v.href=T,v.download=s.filename,v.click(),URL.revokeObjectURL(T);const x=c.size,$=((1-x/r.size)*100).toFixed(1);p(100),e("#previewTitle").text("Resultado"),e("#previewLabel").text("Extraído:"),e("#previewEstimated").text(u(x)),e("#previewReduction").text(`${$>0?"-":"+"}${Math.abs($)}%`),x>=r.size?(e("#previewEstimated").removeClass("success").addClass("warning"),e("#previewReduction").closest(".preview_reduction").css("background","var(--warning)")):(e("#previewEstimated").removeClass("warning").addClass("success"),e("#previewReduction").closest(".preview_reduction").css("background","var(--success)")),setTimeout(()=>{e("#progressWrapper").fadeOut(),e("#btnExtract").prop("disabled",!1).html(`<i class="fas fa-download"></i> Extraer ${h(t)}`),l(`✅ ${h(t)} extraído: ${u(x)}`,"success",4e3)},1e3)}}catch(t){console.error("❌ Error extrayendo:",t),e("#progressWrapper").fadeOut(),e("#btnExtract").prop("disabled",!1).html(`<i class="fas fa-download"></i> Extraer ${h(_)}`),l(`Error al extraer: ${t.message}`,"error",4e3)}finally{f=!1}},R=async(t,a)=>{const s=await(await fetch(t)).blob(),o=document.createElement("a"),n=URL.createObjectURL(s);o.href=n,o.download=a,o.click(),URL.revokeObjectURL(n)},h=t=>({audio:"Audio","frame-auto":"Frames","frame-manual":"Frame"})[t]||"Contenido",p=t=>{e("#progressFillInline").css("width",`${t}%`),e("#progressText").text(`${t}%`)},u=t=>t<1024?t.toFixed(2)+" B":t<1024*1024?(t/1024).toFixed(2)+" KB":(t/(1024*1024)).toFixed(2)+" MB",C=()=>{const t=e("#extractionTypeSelect").val();_=t,t==="audio"?(e("#qualityGroup").show(),e("#formatGroup").hide()):(e("#qualityGroup").hide(),e("#formatGroup").show());const a={audio:"Audio","frame-auto":"Frames","frame-manual":"Frame"};e("#btnExtract span").text(`Extraer ${a[t]}`),r&&b()};e("#uploadZone").on("dblclick",()=>e("#videoInput").click()).on("dragover",t=>{t.preventDefault(),e(t.currentTarget).addClass("dragover")}).on("dragleave",t=>e(t.currentTarget).removeClass("dragover")).on("drop",t=>{t.preventDefault(),e(t.currentTarget).removeClass("dragover");const a=t.originalEvent.dataTransfer.files;a.length&&E(a[0])}),e("#videoInput").on("change",t=>{const a=t.target.files[0];a&&E(a)}),e(document).on("click","#btnSelect",()=>!f&&e("#videoInput").click()),e(document).on("click","#btnDelete",()=>{if(f)return l("No puedes eliminar mientras se extrae","warning",2e3);confirm("¿Estás seguro de eliminar este video?")&&(S(),l("Video eliminado","success",2e3))}),e(document).on("change","#extractionTypeSelect",C),e(document).on("change","#qualitySelect, #formatSelect",()=>{r&&b()}),e(document).on("click","#btnExtract",F),e("#extraerVideo").on("timeupdate",function(){const t=this.currentTime/this.duration*100;e("#timelineMarker").css("left",`${t}%`)}),e("#videoTimeline").on("mousemove",function(t){const a=e("#extraerVideo")[0],i=this.getBoundingClientRect(),o=(t.clientX-i.left)/i.width*a.duration;e("#timelineTooltip").text(w(o)).css("left",`${t.clientX-i.left}px`).show()}).on("mouseleave",function(){e("#timelineTooltip").hide()}).on("click",function(t){const a=e("#extraerVideo")[0],i=this.getBoundingClientRect(),s=(t.clientX-i.left)/i.width;a.currentTime=s*a.duration,l(`📸 Posicionado en: ${w(a.currentTime)}`,"success",2e3)})},I=()=>{console.log("🧹 Extraer limpiado"),e("#uploadZone, #videoInput, #btnSelect, #btnDelete, #btnExtract, #extractionTypeSelect, #videoTimeline").off();const d=e("#extraerVideo")[0];d?.src&&URL.revokeObjectURL(d.src)};export{I as cleanup,V as init,M as render};
