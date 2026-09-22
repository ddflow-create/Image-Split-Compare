import { ImageItem } from '../types';

/**
 * Creates an animated video blob using HTML5 Canvas and MediaRecorder.
 * Generates a crisp video with timecodes, frame counters, and visual test patterns.
 */
export async function createProceduralVideoBlob({
  durationSec,
  width = 960,
  height = 540,
  title,
  subtitle,
  fps = 30,
  themeColor = '#3b82f6',
  accentColor = '#60a5fa',
  isCompressed = false,
}: {
  durationSec: number;
  width?: number;
  height?: number;
  title: string;
  subtitle: string;
  fps?: number;
  themeColor?: string;
  accentColor?: string;
  isCompressed?: boolean;
}): Promise<string> {
  // Check if MediaRecorder and HTMLCanvasElement.captureStream are supported
  if (
    typeof window === 'undefined' ||
    typeof HTMLCanvasElement === 'undefined' ||
    !('captureStream' in HTMLCanvasElement.prototype) ||
    typeof MediaRecorder === 'undefined'
  ) {
    throw new Error('MediaRecorder is not supported in this environment');
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create 2D canvas context');

  const stream = canvas.captureStream(fps);
  
  // Pick supported MIME type
  let mimeType = 'video/webm';
  if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
    mimeType = 'video/webm;codecs=vp9';
  } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
    mimeType = 'video/webm;codecs=vp8';
  } else if (MediaRecorder.isTypeSupported('video/mp4')) {
    mimeType = 'video/mp4';
  }

  const recordedChunks: Blob[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: isCompressed ? 800000 : 4000000,
  });

  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  const totalFrames = Math.round(durationSec * fps);

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      resolve(url);
    };

    recorder.onerror = (err) => {
      reject(err);
    };

    recorder.start();

    // Render each frame in a tight synchronous loop or fast requestAnimationFrame
    let currentFrame = 0;

    function renderFrame() {
      if (currentFrame >= totalFrames) {
        recorder.stop();
        return;
      }

      const currentTime = currentFrame / fps;
      const progress = currentFrame / totalFrames;

      // 1. Background
      ctx.fillStyle = isCompressed ? '#090d16' : '#0a0e1a';
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle grid pattern
      ctx.strokeStyle = isCompressed ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 3. Central rotating calibration radar & geometry
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(width, height) * 0.28;

      ctx.save();
      ctx.translate(centerX, centerY);

      // Circular ring
      ctx.strokeStyle = themeColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner dashed ring
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.65, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Rotating sweeper arm (1 rotation per 2 seconds)
      const angle = (currentTime * Math.PI) % (Math.PI * 2);
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
      ctx.stroke();

      // Sweeper sweep head dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(Math.cos(angle) * radius, Math.sin(angle) * radius, 5, 0, Math.PI * 2);
      ctx.fill();

      // Sweeper tail shadow / pie slice
      ctx.fillStyle = isCompressed ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle - 0.4, angle);
      ctx.closePath();
      ctx.fill();

      // Bouncing dynamic orb
      const bouncePeriod = 1.5;
      const bouncePhase = (currentTime % bouncePeriod) / bouncePeriod;
      const bounceY = Math.sin(bouncePhase * Math.PI) * (radius * 0.7);
      const bounceX = Math.cos(bouncePhase * Math.PI * 2) * (radius * 0.7);

      ctx.fillStyle = isCompressed ? '#f59e0b' : '#38bdf8';
      ctx.beginPath();
      ctx.arc(bounceX, bounceY, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 4. Progress Timeline Bar at Bottom
      const barHeight = 8;
      const barY = height - 28;
      const barPadding = 36;
      const barWidth = width - barPadding * 2;

      // Track background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(barPadding, barY, barWidth, barHeight);

      // Filled progress
      ctx.fillStyle = themeColor;
      ctx.fillRect(barPadding, barY, barWidth * progress, barHeight);

      // Playhead dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(barPadding + barWidth * progress, barY + barHeight / 2, 6, 0, Math.PI * 2);
      ctx.fill();

      // 5. Digital Timecode Display
      const minutes = Math.floor(currentTime / 60);
      const seconds = Math.floor(currentTime % 60);
      const centis = Math.floor((currentTime % 1) * 100);
      const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
      const totalFormatted = `00:${String(Math.floor(durationSec)).padStart(2, '0')}.00`;

      ctx.font = 'bold 26px "JetBrains Mono", monospace, sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.fillText(`${formattedTime} / ${totalFormatted}`, 36, 68);

      // Frame counter
      ctx.font = '14px "JetBrains Mono", monospace, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText(`FRAME ${currentFrame + 1} / ${totalFrames} (${fps} FPS)`, 36, 94);

      // 6. Header Badge and Title
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = themeColor;
      ctx.textAlign = 'right';
      ctx.fillText(title, width - 36, 66);

      ctx.font = '13px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText(subtitle, width - 36, 90);

      // 7. Simulated artifacts for compressed stream
      if (isCompressed) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
        for (let b = 0; b < 12; b++) {
          const bx = Math.random() * width;
          const by = Math.random() * height;
          ctx.fillRect(bx, by, 32, 16);
        }
      }

      currentFrame++;
      // Fast setTimeout to give MediaRecorder time to capture frames
      setTimeout(renderFrame, 1000 / fps);
    }

    renderFrame();
  });
}

/**
 * Creates the sample video pair:
 * Slot A: 5.0 seconds duration (60 FPS Master)
 * Slot B: 10.0 seconds duration (Extended / Compressed clip)
 */
let cachedVideoA: string | null = null;
let cachedVideoB: string | null = null;

export async function getSampleVideoPair(): Promise<{ videoA: ImageItem; videoB: ImageItem }> {
  try {
    if (!cachedVideoA) {
      cachedVideoA = await createProceduralVideoBlob({
        durationSec: 5.0,
        title: 'MASTER CLIP (5.0s)',
        subtitle: 'Source 1080p60 • Lossless ProRes 422',
        themeColor: '#3b82f6',
        accentColor: '#60a5fa',
        isCompressed: false,
      });
    }

    if (!cachedVideoB) {
      cachedVideoB = await createProceduralVideoBlob({
        durationSec: 10.0,
        title: 'EXTENDED CLIP (10.0s)',
        subtitle: 'H.265 Transcode • Offset Capable',
        themeColor: '#10b981',
        accentColor: '#34d399',
        isCompressed: true,
      });
    }

    return {
      videoA: {
        id: 'sample-video-a',
        name: 'Master_Clip_1080p60_5s.mp4',
        url: cachedVideoA,
        width: 1920,
        height: 1080,
        aspectRatio: 16 / 9,
        size: 3450000,
        format: 'MP4',
        timestamp: Date.now() - 60000,
        mediaType: 'video',
        duration: 5.0,
      },
      videoB: {
        id: 'sample-video-b',
        name: 'Extended_Clip_H265_10s.mp4',
        url: cachedVideoB,
        width: 1920,
        height: 1080,
        aspectRatio: 16 / 9,
        size: 5890000,
        format: 'MP4',
        timestamp: Date.now() - 30000,
        mediaType: 'video',
        duration: 10.0,
      },
    };
  } catch (err) {
    // If MediaRecorder is not available, provide clean fallback video data
    console.warn('Procedural video generation fallback:', err);
    // Reliable lightweight sample videos
    const fallbackUrlA = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    const fallbackUrlB = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4';

    return {
      videoA: {
        id: 'sample-video-a-fb',
        name: 'Video_A_Short_5s.mp4',
        url: fallbackUrlA,
        width: 1920,
        height: 1080,
        aspectRatio: 16 / 9,
        size: 2500000,
        format: 'MP4',
        timestamp: Date.now() - 60000,
        mediaType: 'video',
        duration: 5.0,
      },
      videoB: {
        id: 'sample-video-b-fb',
        name: 'Video_B_Long_10s.mp4',
        url: fallbackUrlB,
        width: 1920,
        height: 1080,
        aspectRatio: 16 / 9,
        size: 5200000,
        format: 'MP4',
        timestamp: Date.now() - 30000,
        mediaType: 'video',
        duration: 10.0,
      },
    };
  }
}
