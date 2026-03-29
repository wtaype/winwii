import './tools.css';
import $ from 'jquery';
import { app, ipdev } from '../wii.js';
import { Notificacion } from '../widev.js';

const API = (() => {
  if (typeof window === 'undefined') return '';
  const h = window.location.hostname;
  const locales = new Set(['localhost', ipdev]);
  return locales.has(h) ? `http://${h}:3000` : window.location.origin;
})();

export const render = () => `
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
`;

export const init = () => {
  console.log(`✅ Watermark manual-smart de ${app} cargado`);
  let currentVideo = null;
  let videoAnalysis = null;
  let isProcessing = false;
  let selection = null;
  let isDragging = false;
  let startPoint = null;

  const formatDuration = (seconds) => `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;
  const formatFileSize = (bytes) => bytes < 1024 ? `${bytes.toFixed(2)} B` : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(2)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

  const updateProgress = (percent) => {
    $('#progressFillInline').css('width', `${percent}%`);
    $('#progressText').text(`${percent}%`);
  };

  const getRenderMetrics = () => {
    const video = $('#watermarkVideo')[0];
    if (!video) return null;
    const rect = video.getBoundingClientRect();
    const sourceW = video.videoWidth || videoAnalysis?.width || 0;
    const sourceH = video.videoHeight || videoAnalysis?.height || 0;
    if (!sourceW || !sourceH || !rect.width || !rect.height) return null;
    const scale = Math.min(rect.width / sourceW, rect.height / sourceH);
    const renderWidth = sourceW * scale;
    const renderHeight = sourceH * scale;
    const offsetX = (rect.width - renderWidth) / 2;
    const offsetY = (rect.height - renderHeight) / 2;
    return {
      rect,
      offsetX,
      offsetY,
      renderLeft: rect.left + offsetX,
      renderTop: rect.top + offsetY,
      renderWidth,
      renderHeight
    };
  };

  const normalizeSelection = (x1, y1, x2, y2, metrics) => {
    const left = Math.max(metrics.renderLeft, Math.min(x1, x2));
    const top = Math.max(metrics.renderTop, Math.min(y1, y2));
    const right = Math.min(metrics.renderLeft + metrics.renderWidth, Math.max(x1, x2));
    const bottom = Math.min(metrics.renderTop + metrics.renderHeight, Math.max(y1, y2));
    const w = Math.max(6, right - left);
    const h = Math.max(6, bottom - top);
    return {
      x: ((left - metrics.renderLeft) / metrics.renderWidth) * 100,
      y: ((top - metrics.renderTop) / metrics.renderHeight) * 100,
      width: (w / metrics.renderWidth) * 100,
      height: (h / metrics.renderHeight) * 100
    };
  };

  const applyOverlay = () => {
    const overlay = $('#wmOverlay');
    if (!selection) return overlay.hide();
    const metrics = getRenderMetrics();
    if (!metrics) return overlay.hide();
    const left = metrics.offsetX + (selection.x / 100) * metrics.renderWidth;
    const top = metrics.offsetY + (selection.y / 100) * metrics.renderHeight;
    const width = (selection.width / 100) * metrics.renderWidth;
    const height = (selection.height / 100) * metrics.renderHeight;
    overlay.show().css({
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`
    });
    $('#zoneState').text(`${selection.width.toFixed(1)}x${selection.height.toFixed(1)}%`);
  };

  const onPointerDown = (e) => {
    if (!videoAnalysis || isProcessing) return;
    const metrics = getRenderMetrics();
    if (!metrics) return;
    const inX = e.clientX >= metrics.renderLeft && e.clientX <= metrics.renderLeft + metrics.renderWidth;
    const inY = e.clientY >= metrics.renderTop && e.clientY <= metrics.renderTop + metrics.renderHeight;
    if (!inX || !inY) return;
    isDragging = true;
    startPoint = { x: e.clientX, y: e.clientY, metrics };
    selection = normalizeSelection(e.clientX, e.clientY, e.clientX + 8, e.clientY + 8, metrics);
    applyOverlay();
  };

  const onPointerMove = (e) => {
    if (!isDragging || !startPoint) return;
    selection = normalizeSelection(startPoint.x, startPoint.y, e.clientX, e.clientY, startPoint.metrics);
    applyOverlay();
  };

  const onPointerUp = () => {
    if (!isDragging) return;
    isDragging = false;
    if (selection && (selection.width < 1.2 || selection.height < 1.2)) {
      selection = null;
      applyOverlay();
      Notificacion('Selecciona un área más grande', 'warning', 1800);
      $('#zoneState').text('--');
    }
  };

  const estimateProcessing = () => {
    if (!videoAnalysis) return;
    $('#previewOriginal').text(formatFileSize(videoAnalysis.size));
    $('#previewEstimated').text(formatFileSize(videoAnalysis.size * 1.01));
    $('#watermarkPreview').fadeIn();
  };

  const handleVideoUpload = (file) => {
    if (!file.type.startsWith('video/')) return Notificacion('Por favor selecciona un archivo de video válido', 'error', 3000);
    currentVideo = file;
    const video = $('#watermarkVideo')[0];
    const url = URL.createObjectURL(file);
    video.onloadedmetadata = video.onerror = null;
    video.src = url;

    video.onloadedmetadata = () => {
      const duration = video.duration;
      const size = file.size;
      videoAnalysis = {
        duration,
        size,
        bitrateMbps: ((size * 8) / Math.max(1, duration) / 1000 / 1000),
        width: video.videoWidth,
        height: video.videoHeight,
        format: file.name.split('.').pop().toUpperCase()
      };
      $('#noVideoPlaceholder').hide();
      $('#videoPlayerContainer, #watermarkControls, #watermarkPreview, #videoStatsGrid, #fileInfoLeft').show();
      $('#fileNameDisplay').text(file.name).attr('title', file.name);
      $('#videoDuration').text(formatDuration(duration));
      $('#videoResolution').text(`${video.videoWidth}x${video.videoHeight}`);
      $('#videoSize').text(formatFileSize(size));
      $('#videoFormat').text(videoAnalysis.format);
      $('#videoBitrate').text(`${videoAnalysis.bitrateMbps.toFixed(2)} Mbps`);
      selection = { x: 70, y: 80, width: 30, height: 20 };
      $('#zoneState').text('30.0x20.0%');
      $('#smartResult').text('Smart');
      applyOverlay();
      estimateProcessing();
      Notificacion('✅ Video listo. Zona por defecto: right-bottom 30x20. Puedes arrastrar para cambiar.', 'success', 3400);
    };
    video.onerror = () => {
      if (currentVideo) {
        Notificacion('Error al cargar el video. Intenta con otro archivo.', 'error', 3000);
        resetWatermark();
      }
    };
  };

  const resetWatermark = () => {
    const video = $('#watermarkVideo')[0];
    if (video) {
      video.onloadedmetadata = video.onerror = null;
      video.pause();
      if (video.src) URL.revokeObjectURL(video.src);
      video.src = '';
      video.load();
    }
    $('#videoPlayerContainer, #watermarkControls, #watermarkPreview, #videoStatsGrid, #fileInfoLeft').hide();
    $('#noVideoPlaceholder').show();
    $('#videoInput').val('');
    $('#progressWrapper').hide();
    selection = null;
    applyOverlay();
    currentVideo = null;
    videoAnalysis = null;
    isProcessing = false;
  };

  const processWatermark = async () => {
    if (!currentVideo) return Notificacion('No hay video para procesar', 'warning', 2000);
    if (!selection) return Notificacion('Primero selecciona una zona arrastrando sobre el video', 'warning', 2200);
    if (isProcessing) return Notificacion('Ya hay un procesamiento en progreso', 'warning', 2000);

    const setProcessingState = (active, text = 'Analizando zona...') => {
      if (active) {
        $('#btnWatermark').prop('disabled', true).html(`<i class="fas fa-spinner fa-spin"></i> ${text}`);
        $('#progressWrapper').fadeIn();
      } else {
        $('#progressWrapper').fadeOut();
        $('#btnWatermark').prop('disabled', false).html('<i class="fas fa-eraser"></i> Procesar');
      }
    };

    const requestWatermark = async ({ mode = 'smart-manual', method = '', color = '' } = {}) => {
      const formData = new FormData();
      formData.append('video', currentVideo);
      formData.append('mode', mode);
      if (method) formData.append('method', method);
      if (color) formData.append('color', color);
      formData.append('x', selection.x.toFixed(3));
      formData.append('y', selection.y.toFixed(3));
      formData.append('width', selection.width.toFixed(3));
      formData.append('height', selection.height.toFixed(3));

      const response = await fetch(`${API}/watermark`, { method: 'POST', body: formData });
      const payload = await response.json().catch(() => null);
      if (!response.ok) throw new Error(payload?.error || `Error del servidor (${response.status})`);
      if (!payload?.success) throw new Error(payload?.error || 'Error desconocido');
      return payload;
    };

    try {
      isProcessing = true;
      setProcessingState(true, 'Analizando zona...');
      updateProgress(10);
      let result;
      try {
        result = await requestWatermark({ mode: 'smart-manual' });
      } catch (smartError) {
        console.warn('⚠️ Smart falló, intentando fallback cover:', smartError.message);
        setProcessingState(true, 'Aplicando fallback...');
        result = await requestWatermark({ mode: 'manual', method: 'cover', color: 'black@0.70' });
      }
      updateProgress(60);

      $('#methodState').text(result.methodUsed || 'Smart');
      $('#smartResult').text(result.methodUsed || 'Smart');
      if (result.zone) {
        selection = result.zone;
        applyOverlay();
      }

      updateProgress(82);
      const downloadResponse = await fetch(`${API}${result.downloadUrl}`);
      const blob = await downloadResponse.blob();
      const outUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = outUrl;
      a.download = `clean_manual_${currentVideo.name}`;
      a.click();
      URL.revokeObjectURL(outUrl);

      updateProgress(100);
      $('#previewTitle').text('Resultado');
      $('#previewLabel').text('Procesado:');
      $('#previewEstimated').text(formatFileSize(blob.size));

      setTimeout(() => {
        setProcessingState(false);
        Notificacion(`✅ Listo: método ${result.methodUsed || 'smart'}`, 'success', 3200);
      }, 700);
    } catch (error) {
      console.error('❌ Error watermark manual-smart:', error);
      setProcessingState(false);
      Notificacion(`Error al procesar: ${error.message}`, 'error', 4000);
    } finally {
      isProcessing = false;
    }
  };

  $('#uploadZone').on('dblclick', () => $('#videoInput').click())
    .on('dragover', (e) => { e.preventDefault(); $(e.currentTarget).addClass('dragover'); })
    .on('dragleave', (e) => $(e.currentTarget).removeClass('dragover'))
    .on('drop', (e) => {
      e.preventDefault();
      $(e.currentTarget).removeClass('dragover');
      const files = e.originalEvent.dataTransfer.files;
      if (files.length) handleVideoUpload(files[0]);
    });

  $('#videoInput').on('change', (e) => {
    const file = e.target.files[0];
    if (file) handleVideoUpload(file);
  });

  const wrapper = $('#videoWrapper');
  wrapper.on('pointerdown', '#watermarkVideo, #wmOverlay', onPointerDown);
  $(document).on('pointermove', onPointerMove);
  $(document).on('pointerup', onPointerUp);
  $(window).on('resize.watermark', applyOverlay);

  $(document).on('click', '#btnSelect', () => !isProcessing && $('#videoInput').click());
  $(document).on('click', '#btnDelete', () => {
    if (isProcessing) return Notificacion('No puedes eliminar mientras se procesa', 'warning', 2000);
    if (confirm('¿Estás seguro de eliminar este video?')) {
      resetWatermark();
      Notificacion('Video eliminado', 'success', 2000);
    }
  });
  $(document).on('click', '#btnWatermark', processWatermark);
};

export const cleanup = () => {
  console.log('🧹 Watermark manual-smart limpiado');
  $('#uploadZone, #videoInput, #btnSelect, #btnDelete, #btnWatermark, #videoWrapper').off();
  $(document).off('pointermove').off('pointerup');
  $(window).off('resize.watermark');
  const video = $('#watermarkVideo')[0];
  if (video?.src) URL.revokeObjectURL(video.src);
};
