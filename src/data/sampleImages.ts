import { ImageItem } from '../types';

// High-quality SVG and base64 canvas/curated photo pairs for instant side-by-side and slider testing
export interface SamplePair {
  id: string;
  title: string;
  description: string;
  imageA: ImageItem;
  imageB: ImageItem;
}

// Generate realistic SVG poster for video samples
const createVideoPosterSvg = (title: string, durationStr: string, color: string): string => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <rect width="1280" height="720" fill="#090e17"/>
    <circle cx="640" cy="360" r="220" fill="${color}" opacity="0.12"/>
    <circle cx="640" cy="360" r="70" fill="${color}" opacity="0.8"/>
    <polygon points="625,325 625,395 675,360" fill="#ffffff"/>
    <text x="640" y="490" font-family="sans-serif" font-size="34" font-weight="bold" fill="#ffffff" text-anchor="middle">${title}</text>
    <text x="640" y="535" font-family="monospace" font-size="22" fill="#94a3b8" text-anchor="middle">Duration: ${durationStr} • MP4 / WebM</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Generate sample SVGs with realistic details (Landscape, City, Pixel Art, Texture)
const createSampleSvg = (
  type: 'photo-raw' | 'photo-retouch' | 'upscale-low' | 'upscale-high' | 'game-night' | 'game-day',
  width: number,
  height: number
): string => {
  let innerContent = '';

  if (type === 'photo-raw') {
    // Flat, muted colors, slight noise, original photo
    innerContent = `
      <defs>
        <linearGradient id="skyRaw" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#94a3b8" />
          <stop offset="60%" stop-color="#cbd5e1" />
          <stop offset="100%" stop-color="#e2e8f0" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#skyRaw)"/>
      <circle cx="${width * 0.75}" cy="${height * 0.35}" r="${Math.min(width, height) * 0.12}" fill="#fde68a" opacity="0.6"/>
      <polygon points="0,${height * 0.8} ${width * 0.35},${height * 0.35} ${width * 0.7},${height * 0.8}" fill="#64748b"/>
      <polygon points="${width * 0.3},${height * 0.85} ${width * 0.65},${height * 0.28} ${width},${height * 0.85}" fill="#475569"/>
      <path d="M0,${height * 0.75} Q${width * 0.5},${height * 0.65} ${width},${height * 0.78} L${width},${height} L0,${height} Z" fill="#334155"/>
      <text x="${width * 0.05}" y="${height * 0.12}" font-family="sans-serif" font-size="28" font-weight="bold" fill="#334155">RAW Original (Unedited)</text>
      <text x="${width * 0.05}" y="${height * 0.18}" font-family="sans-serif" font-size="16" fill="#64748b">ISO 100 • 1/500s • f/4.0 • Flat Color Profile</text>
    `;
  } else if (type === 'photo-retouch') {
    // Vibrant sunset, warm shadows, sharp contrast
    innerContent = `
      <defs>
        <linearGradient id="skyRetouch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3b82f6" />
          <stop offset="40%" stop-color="#8b5cf6" />
          <stop offset="75%" stop-color="#f97316" />
          <stop offset="100%" stop-color="#fef08a" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#skyRetouch)"/>
      <circle cx="${width * 0.75}" cy="${height * 0.35}" r="${Math.min(width, height) * 0.12}" fill="#ffedd5" />
      <polygon points="0,${height * 0.8} ${width * 0.35},${height * 0.35} ${width * 0.7},${height * 0.8}" fill="#4338ca"/>
      <polygon points="${width * 0.3},${height * 0.85} ${width * 0.65},${height * 0.28} ${width},${height * 0.85}" fill="#1e1b4b"/>
      <polygon points="${width * 0.35},${height * 0.35} ${width * 0.32},${height * 0.42} ${width * 0.35},${height * 0.4} ${width * 0.38},${height * 0.43}" fill="#ffffff"/>
      <polygon points="${width * 0.65},${height * 0.28} ${width * 0.61},${height * 0.36} ${width * 0.65},${height * 0.34} ${width * 0.69},${height * 0.37}" fill="#ffffff"/>
      <path d="M0,${height * 0.75} Q${width * 0.5},${height * 0.65} ${width},${height * 0.78} L${width},${height} L0,${height} Z" fill="#064e3b"/>
      <text x="${width * 0.05}" y="${height * 0.12}" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff">Color Graded (Pro Retouch)</text>
      <text x="${width * 0.05}" y="${height * 0.18}" font-family="sans-serif" font-size="16" fill="#fde68a">HDR Boost • Warm Shadows • Clarity +45</text>
    `;
  } else if (type === 'upscale-low') {
    // 720p blurry/pixelated artwork
    innerContent = `
      <rect width="${width}" height="${height}" fill="#0f172a"/>
      <g filter="blur(4px)">
        <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${Math.min(width, height) * 0.3}" fill="#ec4899" />
        <rect x="${width * 0.25}" y="${height * 0.25}" width="${width * 0.5}" height="${height * 0.5}" rx="30" fill="none" stroke="#06b6d4" stroke-width="20"/>
        <line x1="${width * 0.1}" y1="${height * 0.9}" x2="${width * 0.9}" y2="${height * 0.1}" stroke="#eab308" stroke-width="12" />
      </g>
      <text x="${width * 0.05}" y="${height * 0.12}" font-family="sans-serif" font-size="24" font-weight="bold" fill="#94a3b8">720p Compressed (Low Res)</text>
      <text x="${width * 0.05}" y="${height * 0.18}" font-family="sans-serif" font-size="14" fill="#64748b">JPEG 45% Quality • High Compression Artifacts</text>
    `;
  } else if (type === 'upscale-high') {
    // 4K razor sharp artwork
    innerContent = `
      <rect width="${width}" height="${height}" fill="#0f172a"/>
      <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${Math.min(width, height) * 0.3}" fill="#ec4899" />
      <rect x="${width * 0.25}" y="${height * 0.25}" width="${width * 0.5}" height="${height * 0.5}" rx="30" fill="none" stroke="#06b6d4" stroke-width="10"/>
      <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${Math.min(width, height) * 0.15}" fill="#a855f7" />
      <line x1="${width * 0.1}" y1="${height * 0.9}" x2="${width * 0.9}" y2="${height * 0.1}" stroke="#eab308" stroke-width="6" />
      <text x="${width * 0.05}" y="${height * 0.12}" font-family="sans-serif" font-size="28" font-weight="bold" fill="#38bdf8">4K AI Upscaled (Ultra Sharp)</text>
      <text x="${width * 0.05}" y="${height * 0.18}" font-family="sans-serif" font-size="16" fill="#4ade80">Lossless WebP • 4x Super-Resolution • Crisp Edges</text>
    `;
  } else if (type === 'game-night') {
    // Cyberpunk night scene with transparency/neon
    innerContent = `
      <rect width="${width}" height="${height}" fill="#090d16"/>
      <circle cx="${width * 0.3}" cy="${height * 0.4}" r="${Math.min(width, height) * 0.18}" fill="#06b6d4" opacity="0.3"/>
      <circle cx="${width * 0.7}" cy="${height * 0.5}" r="${Math.min(width, height) * 0.22}" fill="#d946ef" opacity="0.25"/>
      <polygon points="0,${height} ${width * 0.2},${height * 0.45} ${width * 0.4},${height}" fill="#1e1b4b"/>
      <polygon points="${width * 0.3},${height} ${width * 0.6},${height * 0.35} ${width * 0.85},${height}" fill="#172554"/>
      <polygon points="${width * 0.7},${height} ${width * 0.9},${height * 0.55} ${width},${height}" fill="#0f172a"/>
      <line x1="0" y1="${height * 0.85}" x2="${width}" y2="${height * 0.85}" stroke="#ec4899" stroke-width="4" />
      <text x="${width * 0.05}" y="${height * 0.12}" font-family="sans-serif" font-size="28" font-weight="bold" fill="#38bdf8">Night Neon Render (DirectX 12)</text>
      <text x="${width * 0.05}" y="${height * 0.18}" font-family="sans-serif" font-size="16" fill="#a855f7">Ray Tracing ON • Ambient Occlusion • Volumetric Fog</text>
    `;
  } else if (type === 'game-day') {
    // Daylight clear scene
    innerContent = `
      <rect width="${width}" height="${height}" fill="#38bdf8"/>
      <circle cx="${width * 0.8}" cy="${height * 0.25}" r="${Math.min(width, height) * 0.1}" fill="#fde047" />
      <polygon points="0,${height} ${width * 0.2},${height * 0.45} ${width * 0.4},${height}" fill="#64748b"/>
      <polygon points="${width * 0.3},${height} ${width * 0.6},${height * 0.35} ${width * 0.85},${height}" fill="#475569"/>
      <polygon points="${width * 0.7},${height} ${width * 0.9},${height * 0.55} ${width},${height}" fill="#334155"/>
      <line x1="0" y1="${height * 0.85}" x2="${width}" y2="${height * 0.85}" stroke="#22c55e" stroke-width="4" />
      <text x="${width * 0.05}" y="${height * 0.12}" font-family="sans-serif" font-size="28" font-weight="bold" fill="#0f172a">Daylight Rasterized (Standard)</text>
      <text x="${width * 0.05}" y="${height * 0.18}" font-family="sans-serif" font-size="16" fill="#1e293b">Baked Shadows • Fixed Lighting • Diffuse Only</text>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${innerContent}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

export const SAMPLE_PAIRS: SamplePair[] = [
  {
    id: 'photo-grade',
    title: 'RAW vs Цветокоррекция (Landscape)',
    description: 'Сравнение исходного плоского RAW-снимка и финальной HDR-обработки.',
    imageA: {
      id: 'sample-raw-1',
      name: 'Landscape_RAW_Original.jpg',
      url: createSampleSvg('photo-raw', 1920, 1080),
      width: 1920,
      height: 1080,
      aspectRatio: 1920 / 1080,
      size: 4850000,
      format: 'JPEG',
      timestamp: Date.now() - 100000,
    },
    imageB: {
      id: 'sample-retouch-1',
      name: 'Landscape_HDR_Graded.webp',
      url: createSampleSvg('photo-retouch', 3840, 2160), // Different resolution, same 16:9 aspect ratio!
      width: 3840,
      height: 2160,
      aspectRatio: 3840 / 2160,
      size: 2140000,
      format: 'WebP',
      timestamp: Date.now() - 50000,
    },
  },
  {
    id: 'ai-upscale',
    title: 'Сжатие vs 4K AI Upscaling',
    description: 'Демонстрация работы алгоритма сверхвысокого разрешения и резкости.',
    imageA: {
      id: 'sample-low-1',
      name: 'Vector_LowRes_Compressed.jpg',
      url: createSampleSvg('upscale-low', 1280, 720),
      width: 1280,
      height: 720,
      aspectRatio: 1280 / 720,
      size: 145000,
      format: 'JPEG',
      timestamp: Date.now() - 80000,
    },
    imageB: {
      id: 'sample-high-1',
      name: 'Vector_4K_SuperResolution.png',
      url: createSampleSvg('upscale-high', 1280, 720),
      width: 1280,
      height: 720,
      aspectRatio: 1280 / 720,
      size: 3890000,
      format: 'PNG',
      timestamp: Date.now() - 20000,
    },
  },
  {
    id: 'game-render',
    title: 'Дневной свет vs RTX Ночь',
    description: 'Сравнение запеченного дневного освещения и ночного Ray Tracing.',
    imageA: {
      id: 'sample-day-1',
      name: 'Scene_Daylight_Baked.png',
      url: createSampleSvg('game-day', 1920, 1080),
      width: 1920,
      height: 1080,
      aspectRatio: 1920 / 1080,
      size: 2750000,
      format: 'PNG',
      timestamp: Date.now() - 120000,
    },
    imageB: {
      id: 'sample-night-1',
      name: 'Scene_RTX_CyberNight.png',
      url: createSampleSvg('game-night', 1920, 1080),
      width: 1920,
      height: 1080,
      aspectRatio: 1920 / 1080,
      size: 3420000,
      format: 'PNG',
      timestamp: Date.now() - 60000,
    },
  },
  {
    id: 'video-sync-compare',
    title: 'Video: Sync Compare (5s vs 10s)',
    description: 'Synchronous side-by-side video playback with auto-looping to shortest (5s) and start offset for longer video.',
    imageA: {
      id: 'sample-vid-a',
      name: 'Render_SourceA_5s.mp4',
      url: createVideoPosterSvg('Render Source A (5.0s)', '5.00s', '#3b82f6'),
      width: 1280,
      height: 720,
      aspectRatio: 1280 / 720,
      size: 350000,
      format: 'MP4',
      mediaType: 'video',
      duration: 5.0,
      timestamp: Date.now() - 30000,
    },
    imageB: {
      id: 'sample-vid-b',
      name: 'Render_SourceB_10s.mp4',
      url: createVideoPosterSvg('Render Source B (10.0s)', '10.00s', '#8b5cf6'),
      width: 1280,
      height: 720,
      aspectRatio: 1280 / 720,
      size: 720000,
      format: 'MP4',
      mediaType: 'video',
      duration: 10.0,
      timestamp: Date.now() - 10000,
    },
  },
];
