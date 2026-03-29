import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// ==================== CONFIGURACIÓN GENERAL ====================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Directorios
const uploadsDir = path.join(__dirname, 'uploads');
const outputDir = path.join(__dirname, 'outputs');
[uploadsDir, outputDir].forEach(d => !fs.existsSync(d) && fs.mkdirSync(d));

const upload = multer({ dest: uploadsDir, limits: { fileSize: 500 * 1024 * 1024 } });
const QUALITY_MAP = { high: '18', medium: '23', low: '28' };
const FORMAT_CODECS = {
  mp4: { video: 'libx264', audio: 'aac' },
  avi: { video: 'mpeg4', audio: 'mp3' },
  mov: { video: 'libx264', audio: 'aac' },
  mkv: { video: 'libx264', audio: 'aac' },
  webm: { video: 'libvpx', audio: 'libvorbis' },
  flv: { video: 'flv', audio: 'mp3' }
};

// ==================== UTILIDADES ====================
const cleanupFile = (filePath) => fs.existsSync(filePath) && fs.unlinkSync(filePath);
const processVideo = (req, res, ffmpegCommand) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  ffmpegCommand
    .on('end', () => {
      cleanupFile(req.file.path);
      const outputPath = ffmpegCommand._outputs[0].target;
      const stats = fs.statSync(outputPath);
      res.json({
        success: true,
        filename: path.basename(outputPath),
        size: stats.size,
        downloadUrl: `/download/${path.basename(outputPath)}`
      });
    })
    .on('error', (error) => {
      console.error('❌ FFmpeg error:', error);
      cleanupFile(req.file.path);
      res.status(500).json({ error: error.message });
    });
};
const getVideoMetadata = (filePath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(filePath).ffprobe((err, data) => err ? reject(err) : resolve(data));
  });
};

const runRawFilter = (filePath, filter, frameLimit = 8) => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let settled = false;
    const finalize = (fn, value) => {
      if (settled) return;
      settled = true;
      fn(value);
    };
    const command = ffmpeg(filePath)
      .outputOptions([
        '-vf', filter,
        '-frames:v', String(frameLimit),
        '-pix_fmt', 'gray'
      ])
      .format('rawvideo')
      .on('error', (err) => finalize(reject, err));

    const stream = command.pipe();
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => finalize(resolve, Buffer.concat(chunks)));
    stream.on('error', (err) => finalize(reject, err));
  });
};

const variance = (values) => {
  if (!values.length) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return values.reduce((a, b) => a + ((b - mean) ** 2), 0) / values.length;
};

const sampleRegionFeatures = async (filePath, regionPx) => {
  const { x, y, w, h } = regionPx;
  const lumaFilter = `fps=2,crop=${w}:${h}:${x}:${y},scale=1:1:flags=area,format=gray`;
  const lumaBytes = await runRawFilter(filePath, lumaFilter, 8);
  const luma = Array.from(lumaBytes.values());
  const lumaVar = variance(luma);

  const edgeFilter = `crop=${w}:${h}:${x}:${y},edgedetect=low=0.08:high=0.20,scale=1:1:flags=area,format=gray`;
  const edgeBytes = await runRawFilter(filePath, edgeFilter, 1);
  const edge = edgeBytes.length ? edgeBytes[0] : 0;

  return { lumaVar, edge };
};

const pickSmartMethod = async (filePath, regionPx) => {
  const feat = await sampleRegionFeatures(filePath, regionPx);
  if (feat.edge >= 8 || feat.lumaVar >= 14) {
    return { method: 'delogo', color: 'black@0.70', blur: 12, reason: 'text-like-region' };
  }
  if (feat.edge < 8 && feat.lumaVar < 12) {
    return { method: 'cover', color: 'black@0.70', blur: 12, reason: 'low-edge-low-variance' };
  }
  return { method: 'delogo', color: 'black@0.70', blur: 11, reason: 'default-delogo' };
};

const detectAutoZones = async (filePath, width, height) => {
  const presets = [
    { x: 74, y: 3, width: 22, height: 14 },
    { x: 2, y: 3, width: 22, height: 14 },
    { x: 74, y: 82, width: 22, height: 14 },
    { x: 2, y: 82, width: 22, height: 14 },
    { x: 38, y: 3, width: 24, height: 14 },
    { x: 38, y: 82, width: 24, height: 14 },
    { x: 68, y: 10, width: 28, height: 18 },
    { x: 4, y: 10, width: 28, height: 18 },
    { x: 78, y: 86, width: 18, height: 10 },
    { x: 2, y: 86, width: 18, height: 10 },
    { x: 78, y: 2, width: 18, height: 10 },
    { x: 2, y: 2, width: 18, height: 10 }
  ];

  const candidates = presets.map(p => {
    const w = Math.max(2, Math.min(width, Math.round((p.width / 100) * width)));
    const h = Math.max(2, Math.min(height, Math.round((p.height / 100) * height)));
    const x = Math.max(0, Math.min(Math.round((p.x / 100) * width), width - w));
    const y = Math.max(0, Math.min(Math.round((p.y / 100) * height), height - h));
    return { ...p, px: { x, y, w, h } };
  });

  const scored = [];
  for (const candidate of candidates) {
    const feat = await sampleRegionFeatures(filePath, candidate.px);
    const variancePenalty = 1 / (1 + feat.lumaVar / 16);
    const edgeScore = Math.min(feat.edge / 40, 2);
    const cornerBonus = (candidate.x < 10 || candidate.x > 60) ? 1.1 : 1;
    let score = edgeScore * variancePenalty * cornerBonus;
    if (feat.edge < 6) score *= 0.25;
    scored.push({ ...candidate, feat, score });
  }

  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  if (!best) {
    return {
      primary: { x: 76, y: 4, width: 20, height: 12, px: { x: Math.round(width * 0.76), y: Math.round(height * 0.04), w: Math.round(width * 0.2), h: Math.round(height * 0.12) } },
      secondary: null,
      confidence: 0.45
    };
  }

  const overlapRatio = (a, b) => {
    const ax2 = a.x + a.w;
    const ay2 = a.y + a.h;
    const bx2 = b.x + b.w;
    const by2 = b.y + b.h;
    const iw = Math.max(0, Math.min(ax2, bx2) - Math.max(a.x, b.x));
    const ih = Math.max(0, Math.min(ay2, by2) - Math.max(a.y, b.y));
    const inter = iw * ih;
    const minArea = Math.min(a.w * a.h, b.w * b.h);
    return minArea > 0 ? inter / minArea : 0;
  };

  let secondary = null;
  for (const candidate of scored.slice(1)) {
    if (candidate.score < best.score * 0.72) continue;
    if (overlapRatio(best.px, candidate.px) > 0.4) continue;
    secondary = candidate;
    break;
  }

  const confidence = Math.max(0.35, Math.min(0.99, best.score / 1.6));
  return {
    primary: best,
    secondary,
    confidence
  };
};

// ==================== ENDPOINTS GENERALES ====================
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), app: 'VideoWii' });
});
app.get('/download/:filename', (req, res) => {
  const filePath = path.join(outputDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.download(filePath, (err) => {
    if (!err) cleanupFile(filePath); // Auto-cleanup después de descarga
  });
});

// ==================== SECCIÓN: OPTIMIZAR ====================
app.post('/optimize', upload.single('video'), (req, res) => {
  const { quality = '28', resolution = 'original', codec = 'h264' } = req.body;
  const outputPath = path.join(outputDir, `optimized_${Date.now()}.mp4`);

  let command = ffmpeg(req.file.path)
    .videoCodec(codec === 'h265' ? 'libx265' : 'libx264')
    .addOption('-crf', quality)
    .audioCodec('aac')
    .audioBitrate('128k');

  if (resolution !== 'original') command = command.size(`?x${resolution}`);

  console.log('🚀 Optimizando:', { quality, resolution, codec });
  processVideo(req, res, command.save(outputPath));
});

// ==================== SECCIÓN: EDITAR ====================
app.post('/edit', upload.single('video'), (req, res) => {
  const {
    brightness = '100',
    contrast = '100',
    saturation = '100',
    shadow = '0',
    speed = '1',
    quality = 'medium',
    format = 'mp4'
  } = req.body;

  const outputPath = path.join(outputDir, `edited_${Date.now()}.${format}`);
  const b = parseFloat(brightness) / 100;
  const c = parseFloat(contrast) / 100;
  const s = parseFloat(saturation) / 100;
  const sh = parseFloat(shadow);
  const speedVal = parseFloat(speed);
  const crfValue = QUALITY_MAP[quality] || '23';
  const filters = [];
  if (b !== 1 || c !== 1 || s !== 1) {
    const brightnessFFmpeg = (b - 1) * 0.5;
    filters.push(`eq=brightness=${brightnessFFmpeg}:contrast=${c}:saturation=${s}`);
  }
  if (sh > 0) {
    const shadowIntensity = sh / 30;
    filters.push(`unsharp=5:5:${shadowIntensity}:5:5:0.0`);
  }
  if (speedVal !== 1) filters.push(`setpts=${1 / speedVal}*PTS`);
  const codecConfig = FORMAT_CODECS[format] || FORMAT_CODECS.mp4;
  let command = ffmpeg(req.file.path)
    .videoCodec(codecConfig.video)
    .audioCodec(codecConfig.audio)
    .audioBitrate('128k');

  if (['mp4', 'mov', 'mkv'].includes(format)) {
    command = command.addOption('-crf', crfValue);
  }
  if (filters.length) command = command.videoFilters(filters.join(','));
  if (speedVal !== 1) command = command.audioFilters(`atempo=${speedVal}`);
  console.log('🎨 Editando:', { brightness, contrast, saturation, shadow, speed, quality, format });
  processVideo(req, res, command.save(outputPath));
});

// ==================== SECCIÓN: WATERMARK (AUTO LEGAL) ====================
app.post('/watermark', upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const mode = (req.body.mode || 'auto').toLowerCase();
  const method = (req.body.method || 'delogo').toLowerCase();
  const xPct = parseFloat(req.body.x ?? '76');
  const yPct = parseFloat(req.body.y ?? '4');
  const wPct = parseFloat(req.body.width ?? '20');
  const hPct = parseFloat(req.body.height ?? '12');
  const blur = parseInt(req.body.blur ?? '14', 10);
  const colorInput = (req.body.color || 'black@0.75').toLowerCase();

  const validMethods = new Set(['delogo', 'blur', 'cover']);
  if (!validMethods.has(method)) {
    cleanupFile(req.file.path);
    return res.status(400).json({ error: 'Invalid method' });
  }

  if ([xPct, yPct, wPct, hPct].some(Number.isNaN)) {
    cleanupFile(req.file.path);
    return res.status(400).json({ error: 'Invalid zone values' });
  }

  if (wPct <= 0 || hPct <= 0) {
    cleanupFile(req.file.path);
    return res.status(400).json({ error: 'Zone width/height must be greater than 0' });
  }

  if (Number.isNaN(blur) || blur < 3 || blur > 40) {
    cleanupFile(req.file.path);
    return res.status(400).json({ error: 'Blur must be between 3 and 40' });
  }

  const colorMatch = colorInput.match(/^(black|white)@((0(\.\d+)?)|1(\.0+)?)$/);
  if (!colorMatch) {
    cleanupFile(req.file.path);
    return res.status(400).json({ error: 'Invalid cover color format' });
  }

  try {
    const metadata = await getVideoMetadata(req.file.path);
    const vStream = metadata.streams?.find(s => s.codec_type === 'video');
    const width = vStream?.width;
    const height = vStream?.height;

    if (!width || !height) {
      cleanupFile(req.file.path);
      return res.status(400).json({ error: 'Could not read video dimensions' });
    }

    let detectedZone;
    let secondaryZone = null;
    let confidence = 0.8;
    let strategy = 'manual';
    if (mode === 'auto') {
      const auto = await detectAutoZones(req.file.path, width, height);
      detectedZone = auto.primary;
      secondaryZone = auto.secondary;
      confidence = auto.confidence;
      strategy = secondaryZone ? 'auto-dual' : 'auto-single';
    } else {
      const zoneW = Math.max(2, Math.min(width, Math.round((Math.min(100, Math.max(2, wPct)) / 100) * width)));
      const zoneH = Math.max(2, Math.min(height, Math.round((Math.min(100, Math.max(2, hPct)) / 100) * height)));
      const zoneX = Math.round((Math.min(95, Math.max(0, xPct)) / 100) * width);
      const zoneY = Math.round((Math.min(95, Math.max(0, yPct)) / 100) * height);
      detectedZone = {
        x: Math.min(95, Math.max(0, xPct)),
        y: Math.min(95, Math.max(0, yPct)),
        width: Math.min(100, Math.max(2, wPct)),
        height: Math.min(100, Math.max(2, hPct)),
        px: {
          x: Math.max(0, Math.min(zoneX, width - zoneW)),
          y: Math.max(0, Math.min(zoneY, height - zoneH)),
          w: zoneW,
          h: zoneH
        }
      };
    }
    const safeW = Math.max(2, Math.min(width, Math.round(detectedZone.px.w)));
    const safeH = Math.max(2, Math.min(height, Math.round(detectedZone.px.h)));
    const safeX = Math.max(0, Math.min(Math.round(detectedZone.px.x), width - safeW));
    const safeY = Math.max(0, Math.min(Math.round(detectedZone.px.y), height - safeH));
    const zoneW = safeW;
    const zoneH = safeH;

    const outputPath = path.join(outputDir, `clean_${Date.now()}.mp4`);
    let command = ffmpeg(req.file.path)
      .videoCodec('libx264')
      .audioCodec('aac')
      .audioBitrate('128k')
      .addOption('-preset', 'medium')
      .addOption('-crf', '23')
      .addOption('-movflags', '+faststart');

    const effectiveMethod = mode === 'auto' ? 'delogo' : method;
    let methodUsed = effectiveMethod;
    if (mode === 'auto') {
      const blurRadius = confidence < 0.55 ? 16 : 11;
      const primary = `delogo=x=${safeX}:y=${safeY}:w=${zoneW}:h=${zoneH}:show=0`;
      const delogoChain = secondaryZone
        ? `${primary},delogo=x=${secondaryZone.px.x}:y=${secondaryZone.px.y}:w=${secondaryZone.px.w}:h=${secondaryZone.px.h}:show=0`
        : primary;
      const filter = [
        `[0:v]${delogoChain}[clean]`,
        `[clean]split=2[base][wm]`,
        `[wm]crop=w=${zoneW}:h=${zoneH}:x=${safeX}:y=${safeY},boxblur=luma_radius=${blurRadius}:luma_power=1[refined]`,
        `[base][refined]overlay=${safeX}:${safeY}`
      ].join(';');
      command = command.complexFilter(filter);
      strategy = confidence < 0.55 ? `${strategy}-fallback` : strategy;
      methodUsed = 'delogo+refine';
    } else if (mode === 'smart-manual') {
      let smart;
      try {
        smart = await pickSmartMethod(req.file.path, { x: safeX, y: safeY, w: zoneW, h: zoneH });
      } catch (smartError) {
        console.warn('⚠️ Smart análisis falló, aplicando fallback blur:', smartError.message);
        smart = { method: 'delogo', color: 'black@0.70', blur: Math.max(10, Math.min(18, blur)), reason: 'analysis-fallback' };
      }
      if (smart.method === 'cover') {
        command = command.videoFilters(`drawbox=x=${safeX}:y=${safeY}:w=${zoneW}:h=${zoneH}:color=${smart.color}:t=fill`);
      } else if (smart.method === 'delogo') {
        const delogoThenRefine = [
          `[0:v]delogo=x=${safeX}:y=${safeY}:w=${zoneW}:h=${zoneH}:show=0[clean]`,
          '[clean]split=2[base][wm]',
          `[wm]crop=w=${zoneW}:h=${zoneH}:x=${safeX}:y=${safeY},boxblur=luma_radius=${smart.blur}:luma_power=1[refined]`,
          `[base][refined]overlay=${safeX}:${safeY}`
        ].join(';');
        command = command.complexFilter(delogoThenRefine);
      } else {
        const filter = [
          '[0:v]split=2[base][wm]',
          `[wm]crop=w=${zoneW}:h=${zoneH}:x=${safeX}:y=${safeY},boxblur=luma_radius=${smart.blur}:luma_power=1[blurred]`,
          `[base][blurred]overlay=${safeX}:${safeY}`
        ].join(';');
        command = command.complexFilter(filter);
      }
      strategy = `smart-manual-${smart.reason}`;
      methodUsed = smart.method;
    } else if (effectiveMethod === 'delogo') {
      command = command.videoFilters(`delogo=x=${safeX}:y=${safeY}:w=${zoneW}:h=${zoneH}:show=0`);
    } else if (effectiveMethod === 'cover') {
      command = command.videoFilters(`drawbox=x=${safeX}:y=${safeY}:w=${zoneW}:h=${zoneH}:color=${colorInput}:t=fill`);
    } else {
      const filter = [
        '[0:v]split=2[base][wm]',
        `[wm]crop=w=${zoneW}:h=${zoneH}:x=${safeX}:y=${safeY},boxblur=luma_radius=${blur}:luma_power=1[blurred]`,
        `[base][blurred]overlay=${safeX}:${safeY}`
      ].join(';');
      command = command.complexFilter(filter);
    }

    console.log('🧽 Watermark auto:', { mode, strategy, effectiveMethod, safeX, safeY, zoneW, zoneH, confidence });

    const buildSuccess = (usedMethod = methodUsed, usedStrategy = strategy) => {
      const stats = fs.statSync(outputPath);
      return {
        success: true,
        filename: path.basename(outputPath),
        size: stats.size,
        zone: {
          x: Number(detectedZone.x.toFixed(1)),
          y: Number(detectedZone.y.toFixed(1)),
          width: Number(detectedZone.width.toFixed(1)),
          height: Number(detectedZone.height.toFixed(1))
        },
        secondaryZone: secondaryZone ? {
          x: Number(secondaryZone.x.toFixed(1)),
          y: Number(secondaryZone.y.toFixed(1)),
          width: Number(secondaryZone.width.toFixed(1)),
          height: Number(secondaryZone.height.toFixed(1))
        } : null,
        confidence: Number(confidence.toFixed(2)),
        methodUsed: usedMethod,
        strategy: usedStrategy,
        downloadUrl: `/download/${path.basename(outputPath)}`
      };
    };

    const respondSuccess = (usedMethod = methodUsed, usedStrategy = strategy) => {
      cleanupFile(req.file.path);
      res.json(buildSuccess(usedMethod, usedStrategy));
    };

    command
      .save(outputPath)
      .on('end', () => respondSuccess())
      .on('error', async (error) => {
        console.error('❌ FFmpeg watermark error:', error);
        if (mode !== 'smart-manual') {
          cleanupFile(req.file.path);
          return res.status(500).json({ error: error.message });
        }
        try {
          if (fs.existsSync(outputPath)) cleanupFile(outputPath);
          await new Promise((resolve, reject) => {
            ffmpeg(req.file.path)
              .videoCodec('libx264')
              .audioCodec('aac')
              .audioBitrate('128k')
              .addOption('-preset', 'medium')
              .addOption('-crf', '23')
              .addOption('-movflags', '+faststart')
              .videoFilters(`drawbox=x=${safeX}:y=${safeY}:w=${zoneW}:h=${zoneH}:color=black@0.70:t=fill`)
              .on('end', resolve)
              .on('error', reject)
              .save(outputPath);
          });
          console.warn('⚠️ Aplicado fallback hard-cover en smart-manual');
          return respondSuccess('cover', `${strategy}-hard-fallback`);
        } catch (fallbackError) {
          console.error('❌ FFmpeg fallback error:', fallbackError);
          cleanupFile(req.file.path);
          return res.status(500).json({ error: fallbackError.message });
        }
      });
  } catch (error) {
    console.error('❌ Error en watermark:', error);
    cleanupFile(req.file.path);
    res.status(500).json({ error: error.message });
  }
});

// ==================== SECCIÓN: CONVERSOR ====================
app.post('/convert', upload.single('video'), (req, res) => {
  const outputPath = path.join(outputDir, `audio_${Date.now()}.mp3`);
  console.log('🎵 Convirtiendo a MP3');
  processVideo(req, res, ffmpeg(req.file.path).noVideo().audioBitrate('192k').save(outputPath));
});

app.post('/convert-format', upload.single('video'), (req, res) => {
  const { format = 'mp4', quality = 'medium' } = req.body;
  const outputPath = path.join(outputDir, `converted_${Date.now()}.${format}`);
  const codecConfig = FORMAT_CODECS[format] || FORMAT_CODECS.mp4;
  let command = ffmpeg(req.file.path)
    .videoCodec(codecConfig.video)
    .audioCodec(codecConfig.audio)
    .audioBitrate('128k');
  if (['mp4', 'mov', 'mkv'].includes(format)) {
    command = command.addOption('-crf', QUALITY_MAP[quality]);
  }
  console.log('🔄 Convirtiendo formato:', { format, quality });
  processVideo(req, res, command.save(outputPath));
});

// ==================== SECCIÓN: EXTRAER (COMPACTO Y OPTIMIZADO) ====================
app.post('/extract', upload.single('video'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const { type, quality, format, timestamp } = req.body;
  try {
    switch (type) {
      case 'audio': {
        const outputPath = path.join(outputDir, `audio_${Date.now()}.mp3`);
        console.log('🎵 Extrayendo audio:', { quality: quality || '192k' });
        
        await new Promise((resolve, reject) => {
          ffmpeg(req.file.path)
            .noVideo()
            .audioBitrate(quality || '192k')
            .audioCodec('libmp3lame')
            .on('end', () => {
              cleanupFile(req.file.path);
              const stats = fs.statSync(outputPath);
              res.json({
                success: true,
                filename: path.basename(outputPath),
                size: stats.size,
                downloadUrl: `/download/${path.basename(outputPath)}`
              });
              resolve();
            })
            .on('error', reject)
            .save(outputPath);
        });
        break;
      }

      case 'frame-manual': {
        const ext = format || 'jpg';
        const outputPath = path.join(outputDir, `frame_${Date.now()}.${ext}`);
        const qualityOpts = { png: ['-q:v', '1'], webp: ['-q:v', '90'], jpg: ['-q:v', '2'] };
        
        console.log('📸 Extrayendo frame manual:', { timestamp, format: ext });
        
        await new Promise((resolve, reject) => {
          ffmpeg(req.file.path)
            .seekInput(timestamp || 0)
            .frames(1)
            .outputOptions(qualityOpts[ext] || qualityOpts.jpg)
            .on('end', () => {
              cleanupFile(req.file.path);
              const stats = fs.statSync(outputPath);
              res.json({
                success: true,
                filename: path.basename(outputPath),
                size: stats.size,
                downloadUrl: `/download/${path.basename(outputPath)}`
              });
              resolve();
            })
            .on('error', reject)
            .save(outputPath);
        });
        break;
      }

      case 'frame-auto': {
        const metadata = await getVideoMetadata(req.file.path);
        const videoDuration = metadata.format.duration;
        const timestamps = [0.25, 0.50, 0.75].map(t => videoDuration * t);
        const ext = format || 'jpg';
        const qualityOpts = { png: ['-q:v', '1'], webp: ['-q:v', '90'], jpg: ['-q:v', '2'] };
        
        console.log('🖼️ Extrayendo frames automáticos:', { count: 3, format: ext });
        
        const files = [];
        for (let i = 0; i < timestamps.length; i++) {
          const outputPath = path.join(outputDir, `frame_${Date.now()}_${i + 1}.${ext}`);
          
          await new Promise((resolve, reject) => {
            ffmpeg(req.file.path)
              .seekInput(timestamps[i])
              .frames(1)
              .outputOptions(qualityOpts[ext] || qualityOpts.jpg)
              .on('end', () => {
                const stats = fs.statSync(outputPath);
                files.push({
                  filename: path.basename(outputPath),
                  size: stats.size,
                  downloadUrl: `/download/${path.basename(outputPath)}`
                });
                resolve();
              })
              .on('error', reject)
              .save(outputPath);
          });
        }
        
        cleanupFile(req.file.path);
        res.json({ success: true, files });
        break;
      }

      default:
        cleanupFile(req.file.path);
        res.status(400).json({ error: 'Invalid extraction type' });
    }
  } catch (error) {
    console.error('❌ Error en extracción:', error);
    cleanupFile(req.file.path);
    res.status(500).json({ error: error.message });
  }
});

// ==================== PRODUCCIÓN ====================
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.use((req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));
}

// ==================== SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🎬 VideoWii Server v2.0            ║
║   ✅ Running on: http://localhost:${PORT}  ║
║   📁 Uploads: ${uploadsDir}
║   📂 Outputs: ${outputDir}
╚═══════════════════════════════════════╝
  `);
});
