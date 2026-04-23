import{j as o}from"./vendor-gzd0YkcT.js";import{a as P,j as i,M as C}from"./main-Dlu14CdS.js";const T=()=>`
  <div class="online_container mwb">
    <section class="online_main">
      <div class="online_left">
        <div class="url_input_section">
          <div class="input_header">
            <h3><i class="fas fa-globe"></i> Ver Video Online</h3>
          </div>

          <div class="upload_zone_compact" id="urlDropZone">
            <i class="fas fa-link"></i>
            <p>Pega o arrastra el enlace aquí</p>
          </div>

          <div class="url_input_wrapper">
            <input type="text" id="videoUrl" placeholder="https://youtube.com/watch?v=..." autocomplete="off">
            <button class="btn_load" id="btnLoadVideo">
              <i class="fas fa-play-circle"></i>
              <span>Cargar Video</span>
            </button>
          </div>

          <div class="platform_detected" id="platformDetected" style="display:none;">
            <i class="fab fa-youtube"></i>
            <span id="platformName">YouTube detectado</span>
          </div>

          <div class="video_info_stats" id="videoInfoStats" style="display:none;">
            <h4><i class="fas fa-info-circle"></i> Información del Video</h4>
            <div class="info_grid">
              <div class="info_item">
                <i class="fas fa-film"></i>
                <div class="info_content">
                  <span class="info_label">Plataforma:</span>
                  <span class="info_value" id="infoPlatform">--</span>
                </div>
              </div>
              <div class="info_item">
                <i class="fas fa-expand-arrows-alt"></i>
                <div class="info_content">
                  <span class="info_label">Formato:</span>
                  <span class="info_value" id="infoFormat">--</span>
                </div>
              </div>
              <div class="info_item">
                <i class="fas fa-link"></i>
                <div class="info_content">
                  <span class="info_label">URL:</span>
                  <span class="info_value truncate" id="infoUrl">--</span>
                </div>
              </div>
            </div>
          </div>

          <div class="examples_section">
            <h4><i class="fas fa-rocket"></i> Prueba con un ejemplo</h4>
            <div class="examples_grid">
              <div class="example_card" data-url="https://www.youtube.com/watch?v=ZfNXRZI2zrA">
                <i class="fab fa-youtube"></i>
                <span>YouTube</span>
              </div>
              <div class="example_card" data-url="https://www.tiktok.com/@awonbe/video/6938241677551357189">
                <i class="fab fa-tiktok"></i>
                <span>TikTok</span>
              </div>
              <div class="example_card" data-url="https://vimeo.com/301629924">
                <i class="fab fa-vimeo"></i>
                <span>Vimeo</span>
              </div>
              <div class="example_card" data-url="https://www.dailymotion.com/video/x9bg2ws">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M14.068 10.565c-1.548 0-2.58 1.111-2.58 2.774 0 1.664 1.032 2.774 2.58 2.774 1.548 0 2.58-1.11 2.58-2.774 0-1.663-1.032-2.774-2.58-2.774zm8.197-8.83v20.53c0 .932-.755 1.687-1.687 1.687H3.422c-.932 0-1.687-.755-1.687-1.687V1.735C1.735.803 2.49.048 3.422.048h17.156c.932 0 1.687.755 1.687 1.687zM9.677 13.339c0-2.451-1.758-4.419-4.645-4.419v8.838h2.064v-3.226c.645.387 1.403.58 2.194.58.387 0 .387-1.29.387-1.29v-.483zm9.807 0c0 3.42-2.451 4.903-4.903 4.903-1.29 0-2.387-.58-3.032-1.419v1.226h-2.064V6.597h2.064v4.129c.645-.774 1.742-1.355 2.968-1.355 2.516 0 4.967 1.484 4.967 4.968z"/></svg>
                <span>Dailymotion</span>
              </div>
              <div class="example_card" data-url="https://www.facebook.com/worldofdance/videos/607384935718546/">
                <i class="fab fa-facebook"></i>
                <span>Facebook</span>
              </div>
              <div class="example_card" data-url="https://www.instagram.com/reels/Cw_XiRAo-5U/">
                <i class="fab fa-instagram"></i>
                <span>Instagram</span>
              </div>
            </div>
          </div>

          <div class="supported_platforms_compact">
            <p>Plataformas soportadas:</p>
            <div class="platforms_icons">
              <i class="fab fa-youtube" title="YouTube"></i>
              <i class="fab fa-tiktok" title="TikTok"></i>
              <i class="fab fa-vimeo" title="Vimeo"></i>
              <i class="fab fa-facebook" title="Facebook"></i>
              <i class="fab fa-instagram" title="Instagram"></i>
              <i class="fab fa-dailymotion" title="Dailymotion"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="online_right">
        <div class="video_player_wrapper" id="videoPlayerWrapper">
          <div class="no_video_placeholder" id="noVideoPlaceholder">
            <i class="fas fa-video"></i>
            <h3>Pega un enlace para comenzar</h3>
            <p>Soportamos YouTube, TikTok, Facebook, Vimeo, Instagram y Dailymotion</p>
            <div class="shortcuts_hint">
              <small><kbd>Ctrl+V</kbd> Pegar | <kbd>Enter</kbd> Cargar | <kbd>Esc</kbd> Limpiar</small>
            </div>
          </div>

          <div class="video_player_container" id="videoPlayerContainer" style="display:none;">
            <div id="videoPlayer"></div>
          </div>
        </div>

        <div class="video_controls" id="videoControls" style="display:none;">
          <button class="control_btn" id="btnPlayPause" title="Play/Pause"><i class="fas fa-play"></i></button>
          <button class="control_btn" id="btnAspectRatio" title="Cambiar aspecto">
            <i class="fas fa-expand-arrows-alt"></i>
          </button>
          <select id="aspectRatioSelect">
            <option value="16/9">16:9 (Horizontal)</option>
            <option value="9/16">9:16 (Vertical)</option>
          </select>
        </div>
      </div>
    </section>
  </div>
`,D=()=>{console.log(`✅ Online de ${P} cargado`);let l=null;o("#urlDropZone").on({dragover:e=>{e.preventDefault(),o(e.currentTarget).addClass("dragover")},dragleave:e=>o(e.currentTarget).removeClass("dragover"),drop:e=>{e.preventDefault(),o(e.currentTarget).removeClass("dragover");const a=e.originalEvent.dataTransfer.getData("text/plain");a&&(o("#videoUrl").val(a),s(a))},dblclick:()=>o("#videoUrl").trigger("focus")}),o(document).on("paste",e=>{if(!o("#videoUrl").is(":focus")){const a=(e.originalEvent.clipboardData||window.clipboardData).getData("text");a?.match(/^https?:\/\//)&&(o("#videoUrl").val(a),s(a))}}),o(document).on("keydown",e=>{e.key==="Escape"&&o("#videoPlayerContainer").is(":visible")&&k(),e.key==="Enter"&&o("#videoUrl").is(":focus")&&o("#btnLoadVideo").click(),e.key===" "&&o("#videoPlayerContainer").is(":visible")&&!o("#videoUrl").is(":focus")&&(e.preventDefault(),o("#btnPlayPause").click())}),o(document).on("click","#btnLoadVideo",()=>{const e=o("#videoUrl").val().trim();e?s(e):i("Por favor ingresa un enlace","warning",2e3)}),o(document).on("click",".example_card",function(){const e=o(this).data("url");e&&(o("#videoUrl").val(e),s(e),o(".example_card").removeClass("active"),o(this).addClass("active"))}),o(document).on("change","#aspectRatioSelect",function(){const e=o(this).val();n(e),i(`Aspecto cambiado a ${e} 📐`,"info",1500)});function s(e){const a=r(e);if(!a){i("❌ Plataforma no soportada o URL inválida","error",3e3),w(e);return}l=a,d(a),p(a,e);const t=m(e,a);if(!t){i("No se pudo generar el código de inserción","error",3e3);return}o("#noVideoPlaceholder").hide(),o("#videoPlayerContainer, #videoControls, #videoInfoStats").show(),o("#videoPlayer").html(t),g(a.type),i(`¡Video de ${a.name} cargado! 🎬`,"success",2e3)}function r(e){const a={youtube:{name:"YouTube",icon:"fab fa-youtube",color:"#FF0000",patterns:[/youtube\.com\/watch\?v=/,/youtu\.be\//,/youtube\.com\/embed\//,/youtube\.com\/shorts\//]},tiktok:{name:"TikTok",icon:"fab fa-tiktok",color:"#000000",patterns:[/tiktok\.com\/@.*\/video\//,/vm\.tiktok\.com\//,/tiktok\.com\/.*\/video\//]},vimeo:{name:"Vimeo",icon:"fab fa-vimeo",color:"#1AB7EA",patterns:[/vimeo\.com\/\d+/]},dailymotion:{name:"Dailymotion",icon:"fab fa-dailymotion",color:"#0066DC",patterns:[/dailymotion\.com\/video\//]},facebook:{name:"Facebook",icon:"fab fa-facebook",color:"#1877F2",patterns:[/facebook\.com\/.*\/videos\//,/fb\.watch\//]},instagram:{name:"Instagram",icon:"fab fa-instagram",color:"#E4405F",patterns:[/instagram\.com\/(?:p|reel|reels)\//]}};for(const[t,c]of Object.entries(a))if(c.patterns.some(_=>_.test(e)))return{...c,type:t};return null}function d(e){o("#platformDetected").html(`<i class="${e.icon}"></i><span>${e.name} detectado</span>`).css("background",e.color).fadeIn()}function p(e,a){o("#infoPlatform").text(e.name),o("#infoFormat").text(o("#aspectRatioSelect").val()),o("#infoUrl").text(a).attr("title",a)}function m(e,a){return{youtube:f,tiktok:u,vimeo:v,dailymotion:b,facebook:y,instagram:h}[a.type]?.(e)||null}function f(e){let a="";return e.includes("youtube.com/watch?v=")?a=e.split("v=")[1]?.split("&")[0]:e.includes("youtu.be/")?a=e.split("youtu.be/")[1]?.split("?")[0]:e.includes("youtube.com/embed/")?a=e.split("embed/")[1]?.split("?")[0]:e.includes("youtube.com/shorts/")&&(a=e.split("shorts/")[1]?.split("?")[0]),a?`<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${a}?autoplay=1&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`:null}function u(e){const a=e.match(/video\/(\d+)/)?.[1];return a?`<blockquote class="tiktok-embed" cite="${e}" data-video-id="${a}" style="max-width: 605px;min-width: 325px;margin:0 auto;"><section></section></blockquote><script async src="https://www.tiktok.com/embed.js"><\/script>`:null}function v(e){const a=e.split("vimeo.com/")[1]?.split("?")[0];return a?`<iframe src="https://player.vimeo.com/video/${a}?autoplay=1&title=0&byline=0" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`:null}function b(e){const a=e.split("video/")[1]?.split("?")[0];return a?`<iframe frameborder="0" width="100%" height="100%" src="https://www.dailymotion.com/embed/video/${a}?autoplay=1&ui-logo=0" allowfullscreen allow="autoplay"></iframe>`:null}function y(e){return`<iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(e)}&show_text=false&autoplay=1&mute=0" width="100%" height="100%" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`}function h(e){const a=e.match(/\/(p|reel|reels)\/([^\/\?]+)/)?.[2];return a?`<iframe src="https://www.instagram.com/p/${a}/embed/" width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`:null}function g(e){const a=["tiktok","instagram"].includes(e);n(a?"9/16":"16/9"),o("#aspectRatioSelect").val(a?"9/16":"16/9")}function n(e){const a=o("#videoPlayerWrapper");a.css("aspect-ratio",e),e==="9/16"?(a.addClass("modo_vertical"),l?.type==="instagram"&&a.addClass("modo_ig")):a.removeClass("modo_vertical modo_ig")}function w(e){const a=[];e.match(/^https?:\/\//)||a.push("La URL debe comenzar con http:// o https://"),e.includes("instagram")&&a.push("Para Instagram, usa el enlace directo del post o reel"),e.includes("tiktok")&&a.push("Asegúrate de usar el enlace completo del video de TikTok"),a.length&&setTimeout(()=>C(`💡 Sugerencias:
${a.join(`
`)}`,"info"),500)}function k(){o("#videoPlayerContainer, #videoControls, #platformDetected, #videoInfoStats").hide(),o("#noVideoPlaceholder").show(),o("#videoPlayer").empty(),o("#videoUrl").val(""),o("#videoPlayerWrapper").removeClass("modo_vertical modo_ig").css("aspect-ratio","16/9"),o("#aspectRatioSelect").val("16/9"),o(".example_card").removeClass("active"),l=null,i("Reproductor reiniciado","info",1500)}},I=()=>{console.log("🧹 Online limpiado"),o(document).off("paste keydown"),o("#urlDropZone, #btnLoadVideo, .example_card, #aspectRatioSelect, #btnPlayPause").off(),o("#videoPlayer").empty()};export{I as cleanup,D as init,T as render};
