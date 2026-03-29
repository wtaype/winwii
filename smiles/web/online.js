import './online.css';
import $ from 'jquery';
import { app } from '../wii.js';
import { Notificacion, Mensaje } from '../widev.js';

export const render = () => `
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
`;

export const init = () => {
  console.log(`✅ Online de ${app} cargado`);

  let currentPlatform = null, currentUrl = '';

  // Drag & Drop + Paste
  $('#urlDropZone').on({
    dragover: (e) => { e.preventDefault(); $(e.currentTarget).addClass('dragover'); },
    dragleave: (e) => $(e.currentTarget).removeClass('dragover'),
    drop: (e) => {
      e.preventDefault();
      $(e.currentTarget).removeClass('dragover');
      const url = e.originalEvent.dataTransfer.getData('text/plain');
      url && ($('#videoUrl').val(url), loadVideo(url));
    },
    dblclick: () => $('#videoUrl').trigger('focus')
  });

  $(document).on('paste', (e) => {
    if (!$('#videoUrl').is(':focus')) {
      const url = (e.originalEvent.clipboardData || window.clipboardData).getData('text');
      url?.match(/^https?:\/\//) && ($('#videoUrl').val(url), loadVideo(url));
    }
  });

  // Keyboard shortcuts
  $(document).on('keydown', (e) => {
    if (e.key === 'Escape' && $('#videoPlayerContainer').is(':visible')) resetPlayer();
    if (e.key === 'Enter' && $('#videoUrl').is(':focus')) $('#btnLoadVideo').click();
    if (e.key === ' ' && $('#videoPlayerContainer').is(':visible') && !$('#videoUrl').is(':focus')) {
      e.preventDefault();
      $('#btnPlayPause').click();
    }
  });

  // Event handlers
  $(document).on('click', '#btnLoadVideo', () => {
    const url = $('#videoUrl').val().trim();
    url ? loadVideo(url) : Notificacion('Por favor ingresa un enlace', 'warning', 2000);
  });

  $(document).on('click', '.example_card', function() {
    const url = $(this).data('url');
    if (url) {
      $('#videoUrl').val(url);
      loadVideo(url);
      $('.example_card').removeClass('active');
      $(this).addClass('active');
    }
  });

  $(document).on('change', '#aspectRatioSelect', function() {
    const ratio = $(this).val();
    applyAspectRatio(ratio);
    Notificacion(`Aspecto cambiado a ${ratio} 📐`, 'info', 1500);
  });

  function loadVideo(url) {
    const platform = detectPlatform(url);
    
    if (!platform) {
      Notificacion('❌ Plataforma no soportada o URL inválida', 'error', 3000);
      showSuggestions(url);
      return;
    }

    currentPlatform = platform;
    currentUrl = url;
    
    updatePlatformBadge(platform);
    updateVideoInfo(platform, url);
    
    const embedCode = generateEmbedCode(url, platform);
    
    if (!embedCode) {
      Notificacion('No se pudo generar el código de inserción', 'error', 3000);
      return;
    }

    $('#noVideoPlaceholder').hide();
    $('#videoPlayerContainer, #videoControls, #videoInfoStats').show();
    $('#videoPlayer').html(embedCode);
    
    detectAspectRatio(platform.type);
    
    Notificacion(`¡Video de ${platform.name} cargado! 🎬`, 'success', 2000);
  }

  function detectPlatform(url) {
    const platforms = {
      youtube: { name: 'YouTube', icon: 'fab fa-youtube', color: '#FF0000', patterns: [/youtube\.com\/watch\?v=/, /youtu\.be\//, /youtube\.com\/embed\//, /youtube\.com\/shorts\//] },
      tiktok: { name: 'TikTok', icon: 'fab fa-tiktok', color: '#000000', patterns: [/tiktok\.com\/@.*\/video\//, /vm\.tiktok\.com\//, /tiktok\.com\/.*\/video\//] },
      vimeo: { name: 'Vimeo', icon: 'fab fa-vimeo', color: '#1AB7EA', patterns: [/vimeo\.com\/\d+/] },
      dailymotion: { name: 'Dailymotion', icon: 'fab fa-dailymotion', color: '#0066DC', patterns: [/dailymotion\.com\/video\//] },
      facebook: { name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2', patterns: [/facebook\.com\/.*\/videos\//, /fb\.watch\//] },
      instagram: { name: 'Instagram', icon: 'fab fa-instagram', color: '#E4405F', patterns: [/instagram\.com\/(?:p|reel|reels)\//] }
    };

    for (const [key, platform] of Object.entries(platforms)) {
      if (platform.patterns.some(pattern => pattern.test(url))) {
        return { ...platform, type: key };
      }
    }
    return null;
  }

  function updatePlatformBadge(platform) {
    $('#platformDetected').html(`<i class="${platform.icon}"></i><span>${platform.name} detectado</span>`).css('background', platform.color).fadeIn();
  }

  function updateVideoInfo(platform, url) {
    $('#infoPlatform').text(platform.name);
    $('#infoFormat').text($('#aspectRatioSelect').val());
    $('#infoUrl').text(url).attr('title', url);
  }

  function generateEmbedCode(url, platform) {
    const generators = {
      youtube: generateYouTubeEmbed,
      tiktok: generateTikTokEmbed,
      vimeo: generateVimeoEmbed,
      dailymotion: generateDailymotionEmbed,
      facebook: generateFacebookEmbed,
      instagram: generateInstagramEmbed
    };
    return generators[platform.type]?.(url) || null;
  }

  function generateYouTubeEmbed(url) {
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) videoId = url.split('v=')[1]?.split('&')[0];
    else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0];
    else if (url.includes('youtube.com/embed/')) videoId = url.split('embed/')[1]?.split('?')[0];
    else if (url.includes('youtube.com/shorts/')) videoId = url.split('shorts/')[1]?.split('?')[0];

    return videoId ? `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` : null;
  }

  function generateTikTokEmbed(url) {
    const videoId = url.match(/video\/(\d+)/)?.[1];
    return videoId ? `<blockquote class="tiktok-embed" cite="${url}" data-video-id="${videoId}" style="max-width: 605px;min-width: 325px;margin:0 auto;"><section></section></blockquote><script async src="https://www.tiktok.com/embed.js"><\/script>` : null;
  }

  function generateVimeoEmbed(url) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return videoId ? `<iframe src="https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>` : null;
  }

  function generateDailymotionEmbed(url) {
    const videoId = url.split('video/')[1]?.split('?')[0];
    return videoId ? `<iframe frameborder="0" width="100%" height="100%" src="https://www.dailymotion.com/embed/video/${videoId}?autoplay=1&ui-logo=0" allowfullscreen allow="autoplay"></iframe>` : null;
  }

  function generateFacebookEmbed(url) {
    return `<iframe src="https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=1&mute=0" width="100%" height="100%" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`;
  }

  function generateInstagramEmbed(url) {
    const postId = url.match(/\/(p|reel|reels)\/([^\/\?]+)/)?.[2];
    return postId ? `<iframe src="https://www.instagram.com/p/${postId}/embed/" width="100%" height="100%" frameborder="0" scrolling="no" allowtransparency="true"></iframe>` : null;
  }

  function detectAspectRatio(platformType) {
    const isVertical = ['tiktok', 'instagram'].includes(platformType);
    applyAspectRatio(isVertical ? '9/16' : '16/9');
    $('#aspectRatioSelect').val(isVertical ? '9/16' : '16/9');
  }

  function applyAspectRatio(ratio) {
    const $wrapper = $('#videoPlayerWrapper');
    $wrapper.css('aspect-ratio', ratio);
    
    if (ratio === '9/16') {
      $wrapper.addClass('modo_vertical');
      if (currentPlatform?.type === 'instagram') $wrapper.addClass('modo_ig');
    } else {
      $wrapper.removeClass('modo_vertical modo_ig');
    }
  }

  function showSuggestions(url) {
    const suggestions = [];
    if (!url.match(/^https?:\/\//)) suggestions.push('La URL debe comenzar con http:// o https://');
    if (url.includes('instagram')) suggestions.push('Para Instagram, usa el enlace directo del post o reel');
    if (url.includes('tiktok')) suggestions.push('Asegúrate de usar el enlace completo del video de TikTok');
    suggestions.length && setTimeout(() => Mensaje(`💡 Sugerencias:\n${suggestions.join('\n')}`, 'info'), 500);
  }

  function resetPlayer() {
    $('#videoPlayerContainer, #videoControls, #platformDetected, #videoInfoStats').hide();
    $('#noVideoPlaceholder').show();
    $('#videoPlayer').empty();
    $('#videoUrl').val('');
    $('#videoPlayerWrapper').removeClass('modo_vertical modo_ig').css('aspect-ratio', '16/9');
    $('#aspectRatioSelect').val('16/9');
    $('.example_card').removeClass('active');
    currentUrl = '';
    currentPlatform = null;
    Notificacion('Reproductor reiniciado', 'info', 1500);
  }
};

export const cleanup = () => {
  console.log('🧹 Online limpiado');
  $(document).off('paste keydown');
  $('#urlDropZone, #btnLoadVideo, .example_card, #aspectRatioSelect, #btnPlayPause').off();
  $('#videoPlayer').empty();
};