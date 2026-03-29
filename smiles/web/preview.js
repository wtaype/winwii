import './preview.css';
import $ from 'jquery';
import { app } from '../wii.js';
import { wiVista, Notificacion } from '../widev.js';

const platformSpecs = {
  tiktok: { name: 'TikTok', maxDuration: 180, aspectRatio: '9:16', recommended: '1080x1920', formats: ['MP4', 'MOV'], maxSize: 287 },
  youtube: { name: 'YouTube Shorts', maxDuration: 60, aspectRatio: '9:16', recommended: '1080x1920', formats: ['MP4', 'MOV', 'WEBM'], maxSize: 256 },
  facebook: { name: 'Facebook Reels', maxDuration: 90, aspectRatio: '9:16', recommended: '1080x1920', formats: ['MP4', 'MOV'], maxSize: 4000 }
};

export const render = () => `
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
            ${['tiktok', 'youtube', 'facebook'].map((p, i) => `<button class="platform_btn${i === 0 ? ' active' : ''}" data-platform="${p}"><i class="fab fa-${p}"></i><span>${platformSpecs[p].name.split(' ')[0]}</span></button>`).join('')}
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
`;

export const init = () => {
  console.log(`✅ Preview de ${app} cargado`);
  let currentVideo = null, videoMetadata = {}, isLoadingVideo = false;

  const handleVideoUpload = (file) => {
    if (isLoadingVideo) return console.log('Ya hay un video cargándose...');
    if (!file.type.startsWith('video/')) return Notificacion('Por favor selecciona un archivo de video válido', 'error', 3000);

    isLoadingVideo = true;
    currentVideo = file;
    const url = URL.createObjectURL(file);
    const video = $('#previewVideo')[0];
    
    video.onloadedmetadata = video.onerror = null;
    video.src = url;

    video.onloadedmetadata = () => {
      isLoadingVideo = false;
      videoMetadata = {
        duration: video.duration, 
        width: video.videoWidth, 
        height: video.videoHeight,
        size: file.size, 
        format: file.type.split('/')[1].toUpperCase(), 
        name: file.name
      };

      $('#noVideoPlaceholder').hide();
      $('#previewVideo').show();
      $('#videoDuration').text(formatDuration(video.duration));
      $('#videoResolution').text(`${video.videoWidth}x${video.videoHeight}`);
      $('#videoSize').text(formatFileSize(file.size));
      $('#videoFormat').text(videoMetadata.format);
      $('#videoBitrate').text(calculateBitrate(file.size, video.duration));
      $('#uploadZone').hide();
      $('#videoInfoPanel').fadeIn();
      
      updateMockup();
      updatePlatformUI();
      checkCompatibility();
      Notificacion('¡Video cargado exitosamente! 🎬', 'success', 2000);
    };

    video.onerror = () => {
      console.error('Error al cargar video');
      isLoadingVideo = false;
      if (currentVideo) {
        Notificacion('Error al cargar el video. Intenta con otro archivo.', 'error', 3000);
        resetPreview();
      }
    };
  };

  const resetPreview = () => {
    const video = $('#previewVideo')[0];
    if (video) {
      video.onloadedmetadata = video.onerror = null;
      video.pause();
      if (video.src) URL.revokeObjectURL(video.src);
      video.src = '';
      video.load();
    }
    $('#previewVideo').hide();
    $('#noVideoPlaceholder').show();
    $('#videoInfoPanel').hide();
    $('#uploadZone').show();
    $('#videoInput').val('');
    $('#platformUI').html('');
    currentVideo = null;
    videoMetadata = {};
    isLoadingVideo = false;
  };

  const updateMockup = () => {
    const platform = $('.platform_btn.active').data('platform');
    const orientation = $('.orientation_btn.active').data('orientation');
    $('#deviceMockup').removeClass('tiktok youtube facebook vertical horizontal').addClass(`${platform} ${orientation}`);
  };

  const updatePlatformUI = () => {
    const platform = $('.platform_btn.active').data('platform');
    if (!currentVideo) return $('#platformUI').html('');

    const platformUIs = {
      tiktok: `<div class="tiktok_ui"><div class="tiktok_sidebar"><div class="tiktok_action"><i class="fas fa-heart"></i><span>125K</span></div><div class="tiktok_action"><i class="fas fa-comment"></i><span>1.2K</span></div><div class="tiktok_action"><i class="fas fa-share"></i><span>856</span></div></div><div class="tiktok_bottom"><div class="tiktok_user">@${app.toLowerCase()}</div><div class="tiktok_desc">Tu descripción aquí... #viral #fyp</div></div></div>`,
      youtube: `<div class="youtube_ui"><div class="youtube_top"><i class="fab fa-youtube"></i><span>Shorts</span></div><div class="youtube_sidebar"><div class="youtube_action"><i class="fas fa-thumbs-up"></i><span>12K</span></div><div class="youtube_action"><i class="fas fa-thumbs-down"></i></div><div class="youtube_action"><i class="fas fa-comment"></i><span>234</span></div><div class="youtube_action"><i class="fas fa-share"></i></div></div></div>`,
      facebook: `<div class="facebook_ui"><div class="facebook_top"><div class="facebook_user"><div class="facebook_avatar" style="background-image: url('${import.meta.env.BASE_URL}smile.avif'); background-size: cover; background-position: center;"></div><span>${app}</span></div></div><div class="facebook_bottom"><div class="facebook_actions"><div class="facebook_action"><i class="fas fa-thumbs-up"></i> Me gusta</div><div class="facebook_action"><i class="fas fa-comment"></i> Comentar</div><div class="facebook_action"><i class="fas fa-share"></i> Compartir</div></div></div></div>`
    };

    $('#platformUI').html(platformUIs[platform] || '');
  };

  const checkCompatibility = () => {
    const platform = $('.platform_btn.active').data('platform');
    const specs = platformSpecs[platform];
    if (!videoMetadata.duration) return $('#compatibilityList').html('');

    const checks = [
      { label: 'Duración:', pass: videoMetadata.duration <= specs.maxDuration, current: formatDuration(videoMetadata.duration), max: formatDuration(specs.maxDuration) },
      { label: 'Tamaño:', pass: (videoMetadata.size / 1024 / 1024) <= specs.maxSize, current: formatFileSize(videoMetadata.size), max: `${specs.maxSize}MB` },
      { label: 'Formato:', pass: specs.formats.includes(videoMetadata.format), current: videoMetadata.format, max: specs.formats.join(', ') },
      { label: 'Relación:', pass: checkAspectRatio(videoMetadata.width, videoMetadata.height, specs.aspectRatio), current: `${videoMetadata.width}:${videoMetadata.height}`, max: specs.aspectRatio }
    ];

    $('#compatibilityList').html(checks.map(c => `<div class="compat_item ${c.pass ? 'pass' : 'fail'}"><i class="fas fa-${c.pass ? 'check' : 'times'}-circle"></i><div class="compat_content"><span class="compat_label">${c.label}</span><span class="compat_value">${c.current} / ${c.max}</span></div></div>`).join(''));
  };

  const checkAspectRatio = (w, h, target) => {
    const [tw, th] = target.split(':').map(Number);
    return Math.abs((w / h) - (tw / th)) < 0.1;
  };

  const formatDuration = (s) => `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  const formatFileSize = (b) => b < 1024 ? b + ' B' : b < 1024 * 1024 ? (b / 1024).toFixed(2) + ' KB' : (b / (1024 * 1024)).toFixed(2) + ' MB';
  const calculateBitrate = (size, duration) => {
    if (!duration) return '--';
    const bitrate = (size * 8) / duration / 1000;
    return bitrate > 1000 ? (bitrate / 1000).toFixed(2) + ' Mbps' : bitrate.toFixed(0) + ' kbps';
  };

  $('#uploadZone').on('dblclick', () => $('#videoInput').click())
    .on('dragover', (e) => { e.preventDefault(); $(e.currentTarget).addClass('dragover'); })
    .on('dragleave', (e) => $(e.currentTarget).removeClass('dragover'))
    .on('drop', (e) => { e.preventDefault(); $(e.currentTarget).removeClass('dragover'); const files = e.originalEvent.dataTransfer.files; if (files.length) handleVideoUpload(files[0]); });

  $('#videoInput').on('change', (e) => { const file = e.target.files[0]; if (file) handleVideoUpload(file); });
  $('.platform_btn').on('click', function() { $('.platform_btn').removeClass('active'); $(this).addClass('active'); updateMockup(); updatePlatformUI(); checkCompatibility(); });
  $('.orientation_btn').on('click', function() { $('.orientation_btn').removeClass('active'); $(this).addClass('active'); updateMockup(); });
  $(document).on('click', '#btnSelect', () => $('#videoInput').click());
  $(document).on('click', '#btnDelete', () => { if (confirm('¿Estás seguro de eliminar este video?')) { resetPreview(); Notificacion('Video eliminado', 'success', 2000); } });

  wiVista('.preview_hero', () => $('.preview_hero').addClass('visible'));
};

export const cleanup = () => {
  console.log('🧹 Preview limpiado');
  const video = $('#previewVideo')[0];
  if (video) {
    video.onloadedmetadata = video.onerror = null;
    video.pause();
    if (video.src) URL.revokeObjectURL(video.src);
    video.src = '';
  }
  $('#uploadZone, #videoInput, .platform_btn, .orientation_btn, #btnSelect, #btnDelete').off();
};