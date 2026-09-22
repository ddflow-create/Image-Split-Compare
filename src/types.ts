export type AppTheme = 'dark' | 'silver' | 'light';
export type AppLanguage = 'ru' | 'en';

export type CompareMode = 
  | 'slider'            // Split curtain slider (Вертикальный ползунок)
  | 'slider-horizontal' // Horizontal split slider (Горизонтальный ползунок)
  | 'side-by-side'      // 2-Up Horizontal (Бок-о-бок)
  | 'side-vertical'     // 2-Up Vertical (Сверху-снизу)
  | 'difference'        // Pixel Difference (Разность)
  | 'onion'             // Opacity Blend (Наложение / прозрачность)
  | 'toggle';           // Rapid A/B Blink / Peep (Мерцание A/B)

export type AlignmentPreset = 
  | 'center' 
  | 'top-left' 
  | 'top' 
  | 'top-right' 
  | 'left' 
  | 'right' 
  | 'bottom-left' 
  | 'bottom' 
  | 'bottom-right';

export type MediaType = 'image' | 'video';

export interface ImageItem {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
  aspectRatio: number; // width / height
  size?: number; // bytes
  format: string; // 'JPEG' | 'PNG' | 'WebP' | 'MP4' | 'WEBM' etc.
  timestamp: number;
  mediaType?: MediaType;
  duration?: number; // Duration in seconds for video files
}

export interface VideoPlaybackState {
  isPlaying: boolean;
  isLooping: boolean;
  currentTime: number; // relative time (0 to shortestDuration)
  playbackRate: number;
  isMuted: boolean;
  startOffset: number; // start offset for the longer video in seconds
  durationA: number;
  durationB: number;
  shortestDuration: number;
  longerSide: 'A' | 'B' | null;
  maxOffset: number;
}

export interface TransformState {
  scale: number; // 0.25 (25%) to 10.0 (1000%)
  x: number;
  y: number;
}

export interface CanvasDimensions {
  width: number;
  height: number;
}

export interface AppSettings {
  mode: CompareMode;
  alignment: AlignmentPreset;
  syncPanZoom: boolean;
  sliderPos: number; // 0 to 100 (%)
  onionOpacity: number; // 0 to 100 (%)
  diffThreshold: number; // 0 to 100
  diffInvert: boolean;
  checkerboard: boolean;
  showInspector: boolean;
  showPixelGrid: boolean;
  pixelatedZoom: boolean; // image-rendering: pixelated for > 200%
  toggleSpeedHz: number; // 1 to 16 Hz for auto blink
  smoothBlink: boolean;
  activeToggle: 'A' | 'B';
  theme: AppTheme;
  language: AppLanguage;
}

export interface AppVersionInfo {
  version: string;
  releaseDate: string;
  latestVersion: string;
  hasUpdate: boolean;
  releaseNotes: string[];
  downloadUrl: string;
}
