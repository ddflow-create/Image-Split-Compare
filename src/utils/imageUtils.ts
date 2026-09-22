import { AlignmentPreset, CanvasDimensions, ImageItem } from '../types';

/**
 * Format bytes to readable human string
 */
export function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return '—';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Read a File object and convert it to ImageItem (handles both images and videos)
 */
export async function processImageFile(file: File): Promise<ImageItem> {
  // Check if file is a video
  const isVideo = file.type.startsWith('video/') || Boolean(file.name.match(/\.(mp4|webm|mov|mkv|m4v|ogg)$/i));

  if (isVideo) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.src = url;

      video.onloadedmetadata = () => {
        const ext = file.name.split('.').pop()?.toUpperCase() || 'MP4';
        const width = video.videoWidth || 1920;
        const height = video.videoHeight || 1080;
        resolve({
          id: `vid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          url,
          width,
          height,
          aspectRatio: width / height,
          size: file.size,
          format: ext,
          timestamp: Date.now(),
          mediaType: 'video',
          duration: video.duration || 0,
        });
      };

      video.onerror = () => {
        reject(new Error('Не удалось декодировать видео файл. Поддерживаются MP4, WebM, MOV.'));
      };
    });
  }

  return new Promise((resolve, reject) => {
    // Check supported formats: JPEG, PNG, WebP, GIF, AVIF, SVG
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpe?g|png|webp|gif|avif|svg)$/i)) {
      // Still try to read if image/*
      if (!file.type.startsWith('image/')) {
        return reject(new Error('Неподдерживаемый формат файла. Поддерживаются JPEG, PNG, WebP, MP4, WebM.'));
      }
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const ext = file.name.split('.').pop()?.toUpperCase() || 'IMG';
        const format = ext === 'JPG' ? 'JPEG' : ext;
        resolve({
          id: `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          name: file.name,
          url: dataUrl,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
          aspectRatio: (img.naturalWidth || img.width) / (img.naturalHeight || img.height),
          size: file.size,
          format,
          timestamp: Date.now(),
          mediaType: 'image',
        });
      };
      img.onerror = () => {
        reject(new Error('Не удалось декодировать изображение.'));
      };
      img.src = dataUrl;
    };
    reader.onerror = () => reject(new Error('Ошибка чтения файла.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Calculate fitted dimensions and baseline offsets for an image inside a frame.
 * If both images share the same aspect ratio, fittedWidth and fittedHeight will match the maximum proportional box.
 */
export function calculateFitBounds(
  imgW: number,
  imgH: number,
  frameW: number,
  frameH: number,
  alignment: AlignmentPreset = 'center'
): {
  fittedWidth: number;
  fittedHeight: number;
  baseX: number;
  baseY: number;
  fitScale: number;
} {
  if (!imgW || !imgH || !frameW || !frameH) {
    return { fittedWidth: frameW, fittedHeight: frameH, baseX: 0, baseY: 0, fitScale: 1 };
  }

  const scaleW = frameW / imgW;
  const scaleH = frameH / imgH;
  const fitScale = Math.min(scaleW, scaleH);

  const fittedWidth = imgW * fitScale;
  const fittedHeight = imgH * fitScale;

  let baseX = 0;
  let baseY = 0;

  // Horizontal alignment
  if (alignment === 'left' || alignment === 'top-left' || alignment === 'bottom-left') {
    baseX = 0;
  } else if (alignment === 'right' || alignment === 'top-right' || alignment === 'bottom-right') {
    baseX = frameW - fittedWidth;
  } else {
    // center / top / bottom
    baseX = (frameW - fittedWidth) / 2;
  }

  // Vertical alignment
  if (alignment === 'top' || alignment === 'top-left' || alignment === 'top-right') {
    baseY = 0;
  } else if (alignment === 'bottom' || alignment === 'bottom-left' || alignment === 'bottom-right') {
    baseY = frameH - fittedHeight;
  } else {
    // center / left / right
    baseY = (frameH - fittedHeight) / 2;
  }

  return {
    fittedWidth,
    fittedHeight,
    baseX,
    baseY,
    fitScale,
  };
}

/**
 * Alignment preset presets and grid coordinates
 */
export const ALIGNMENT_PRESETS: { id: AlignmentPreset; iconCoords: [number, number] }[] = [
  { id: 'top-left', iconCoords: [0, 0] },
  { id: 'top', iconCoords: [1, 0] },
  { id: 'top-right', iconCoords: [2, 0] },
  { id: 'left', iconCoords: [0, 1] },
  { id: 'center', iconCoords: [1, 1] },
  { id: 'right', iconCoords: [2, 1] },
  { id: 'bottom-left', iconCoords: [0, 2] },
  { id: 'bottom', iconCoords: [1, 2] },
  { id: 'bottom-right', iconCoords: [2, 2] },
];

export const ALIGNMENT_OPTIONS = ALIGNMENT_PRESETS;

