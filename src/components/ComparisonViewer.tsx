import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  TransformState, 
  CompareMode, 
  ImageItem, 
  AlignmentPreset, 
  AppLanguage, 
  AppTheme 
} from '../types';
import { calculateFitBounds } from '../utils/imageUtils';
import { TRANSLATIONS } from '../utils/i18n';
import { THEMES } from '../utils/theme';
import { 
  Layers, 
  Crosshair, 
  Upload
} from 'lucide-react';

interface ComparisonViewerProps {
  imageA: ImageItem | null;
  imageB: ImageItem | null;
  mode: CompareMode;
  alignment: AlignmentPreset;
  transform: TransformState;
  onUpdateTransform: (transform: TransformState | ((prev: TransformState) => TransformState)) => void;
  syncPanZoom: boolean;
  sliderPos: number;
  onChangeSliderPos: (pos: number) => void;
  onionOpacity: number;
  onChangeOnionOpacity: (val: number) => void;
  diffThreshold: number;
  onChangeDiffThreshold: (val: number) => void;
  diffInvert: boolean;
  onToggleDiffInvert: () => void;
  checkerboard: boolean;
  onToggleCheckerboard: () => void;
  pixelatedZoom: boolean;
  onTogglePixelatedZoom: () => void;
  activeToggle: 'A' | 'B';
  onToggleActive: (active: 'A' | 'B') => void;
  toggleSpeedHz: number;
  onChangeToggleSpeedHz: (hz: number) => void;
  smoothBlink: boolean;
  onUploadA: (file: File) => void;
  onUploadB: (file: File) => void;
  showInspector: boolean;
  language: AppLanguage;
  theme: AppTheme;
}

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({
  imageA,
  imageB,
  mode,
  alignment,
  transform,
  onUpdateTransform,
  syncPanZoom,
  sliderPos,
  onChangeSliderPos,
  onionOpacity,
  onChangeOnionOpacity,
  diffThreshold,
  onChangeDiffThreshold,
  diffInvert,
  onToggleDiffInvert,
  checkerboard,
  onToggleCheckerboard,
  pixelatedZoom,
  onTogglePixelatedZoom,
  activeToggle,
  onToggleActive,
  toggleSpeedHz,
  onChangeToggleSpeedHz,
  smoothBlink,
  onUploadA,
  onUploadB,
  showInspector,
  language,
  theme,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [isPinching, setIsPinching] = useState(false);
  const [pinchStart, setPinchStart] = useState({ dist: 0, scale: 0, cx: 0, cy: 0, transformX: 0, transformY: 0 });
  const [panStart, setPanStart] = useState({ mouseX: 0, mouseY: 0, startX: 0, startY: 0 });
  const [spacePressed, setSpacePressed] = useState(false);
  const [inspectorData, setInspectorData] = useState<{
    x: number;
    y: number;
    imgAx: number;
    imgAy: number;
    imgBx: number;
    imgBy: number;
  } | null>(null);

  const t = TRANSLATIONS[language];
  const themeStyles = THEMES[theme];

  // ResizeObserver on the container to get true fluid viewport dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setContainerSize({
            width: Math.max(100, Math.floor(entry.contentRect.width)),
            height: Math.max(100, Math.floor(entry.contentRect.height)),
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Track spacebar for quick peep/pan
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && (e.target as HTMLElement).tagName !== 'INPUT') {
        setSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Compute base fitted geometry for Image A and Image B
  const boundsA = imageA ? calculateFitBounds(imageA.width, imageA.height, containerSize.width, containerSize.height, alignment) : { baseX: 0, baseY: 0, fittedWidth: 0, fittedHeight: 0 };
  const boundsB = imageB ? calculateFitBounds(imageB.width, imageB.height, containerSize.width, containerSize.height, alignment) : { baseX: 0, baseY: 0, fittedWidth: 0, fittedHeight: 0 };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.15 : 1 / 1.15;

    onUpdateTransform((prev) => {
      const newScale = Math.min(10.0, Math.max(0.25, Number((prev.scale * zoomFactor).toFixed(4))));
      if (newScale === prev.scale) return prev;

      const cx = (mouseX - prev.x) / prev.scale;
      const cy = (mouseY - prev.y) / prev.scale;

      const newX = mouseX - cx * newScale;
      const newY = mouseY - cy * newScale;

      return { x: newX, y: newY, scale: newScale };
    });
  }, [onUpdateTransform]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const isRightClick = e.button === 2;
    const isMiddleClick = e.button === 1;
    const isLeftWithSpace = e.button === 0 && spacePressed;

    if (isRightClick || isMiddleClick || isLeftWithSpace) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({
        mouseX: e.clientX,
        mouseY: e.clientY,
        startX: transform.x,
        startY: transform.y,
      });
    }
  }, [spacePressed, transform.x, transform.y]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const cx = (touch1.clientX + touch2.clientX) / 2;
      const cy = (touch1.clientY + touch2.clientY) / 2;
      
      setIsPinching(true);
      setIsPanning(false);
      setPinchStart({
        dist,
        scale: transform.scale,
        cx,
        cy,
        transformX: transform.x,
        transformY: transform.y
      });
    } else if (e.touches.length === 1) {
      setIsPanning(true);
      setPanStart({
        mouseX: e.touches[0].clientX,
        mouseY: e.touches[0].clientY,
        startX: transform.x,
        startY: transform.y,
      });
    }
  }, [transform.x, transform.y, transform.scale]);

  // Local mouse move for inspector data
  const handleMouseMoveLocal = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const imgAx = (mouseX - transform.x) / transform.scale - boundsA.baseX;
    const imgAy = (mouseY - transform.y) / transform.scale - boundsA.baseY;

    const imgBx = (mouseX - transform.x) / transform.scale - boundsB.baseX;
    const imgBy = (mouseY - transform.y) / transform.scale - boundsB.baseY;

    setInspectorData({
      x: Math.round(mouseX),
      y: Math.round(mouseY),
      imgAx: Math.round(imgAx),
      imgAy: Math.round(imgAy),
      imgBx: Math.round(imgBx),
      imgBy: Math.round(imgBy),
    });
  }, [transform.scale, transform.x, transform.y, boundsA.baseX, boundsA.baseY, boundsB.baseX, boundsB.baseY]);

  // Global mouse & touch events for Slider dragging & Panning & Pinching
  useEffect(() => {
    if (!isDraggingSlider && !isPanning && !isPinching) return;

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current) return;
      
      let clientX, clientY;
      
      if ('touches' in e) {
        if (e.touches.length === 0) return;
        
        if (isPinching && e.touches.length === 2) {
          const touch1 = e.touches[0];
          const touch2 = e.touches[1];
          const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
          const cx = (touch1.clientX + touch2.clientX) / 2;
          const cy = (touch1.clientY + touch2.clientY) / 2;
          
          const scaleDiff = dist / pinchStart.dist;
          const newScale = Math.min(10.0, Math.max(0.25, Number((pinchStart.scale * scaleDiff).toFixed(4))));
          
          if (newScale !== transform.scale || cx !== pinchStart.cx || cy !== pinchStart.cy) {
            const rect = containerRef.current.getBoundingClientRect();
            
            // Current center of pinch in viewport coordinates
            const mouseX = cx - rect.left;
            const mouseY = cy - rect.top;
            
            // Original center of pinch in viewport coordinates
            const startMouseX = pinchStart.cx - rect.left;
            const startMouseY = pinchStart.cy - rect.top;
            
            // The coordinate on the image that was originally under the pinch center
            const imageX = (startMouseX - pinchStart.transformX) / pinchStart.scale;
            const imageY = (startMouseY - pinchStart.transformY) / pinchStart.scale;
            
            // We want the new transform X/Y such that 'imageX/Y' is now at 'mouseX/mouseY'
            const newX = mouseX - imageX * newScale;
            const newY = mouseY - imageY * newScale;
            
            onUpdateTransform({
              x: newX,
              y: newY,
              scale: newScale
            });
          }
          if (e.cancelable) e.preventDefault();
          return;
        } else if (e.touches.length === 1) {
           clientX = e.touches[0].clientX;
           clientY = e.touches[0].clientY;
           // If we are just panning the canvas (not slider), we want to prevent default to stop page pull-to-refresh
           if (isPanning && e.cancelable) e.preventDefault();
           if (isDraggingSlider && e.cancelable) e.preventDefault();
        } else {
           return;
        }
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const currentMouseX = clientX - rect.left;
      const currentMouseY = clientY - rect.top;

      // 1. Handle Panning
      if (isPanning) {
        const dx = clientX - panStart.mouseX;
        const dy = clientY - panStart.mouseY;
        onUpdateTransform((prev) => ({
          ...prev,
          x: panStart.startX + dx,
          y: panStart.startY + dy,
        }));
        return;
      }

      // 2. Handle Slider Dragging
      if (isDraggingSlider) {
        if (mode === 'slider') {
          const pct = Math.min(100, Math.max(0, (currentMouseX / rect.width) * 100));
          onChangeSliderPos(Number(pct.toFixed(2)));
        } else if (mode === 'slider-horizontal') {
          const pct = Math.min(100, Math.max(0, (currentMouseY / rect.height) * 100));
          onChangeSliderPos(Number(pct.toFixed(2)));
        }
      }
    };

    const handleGlobalUp = () => {
      setIsPanning(false);
      setIsDraggingSlider(false);
      setIsPinching(false);
    };

    window.addEventListener('mousemove', handleGlobalMove);
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchmove', handleGlobalMove, { passive: false });
    window.addEventListener('touchend', handleGlobalUp);
    window.addEventListener('touchcancel', handleGlobalUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalUp);
      window.removeEventListener('touchcancel', handleGlobalUp);
    };
  }, [isDraggingSlider, isPanning, isPinching, panStart, pinchStart, mode, onUpdateTransform, onChangeSliderPos, transform.scale]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // Helper render for Empty State if no images loaded
  if (!imageA && !imageB) {
    return (
      <div 
        ref={containerRef}
        className={`flex-1 w-full h-full relative flex items-center justify-center p-8 ${themeStyles.canvas} overflow-hidden`}
      >
        <div className={`max-w-md w-full p-8 rounded-2xl border ${themeStyles.border} ${themeStyles.panelCard} text-center shadow-2xl`}>
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-4">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className={`text-xl font-bold ${themeStyles.textPrimary} mb-2 tracking-tight`}>
            {t.emptyState.title}
          </h2>
          <p className={`text-xs ${themeStyles.textSecondary} mb-6 leading-relaxed`}>
            {t.emptyState.description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer shadow-md transition-all flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              <span>{t.emptyState.chooseSlotA}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && onUploadA(e.target.files[0])}
                className="hidden"
              />
            </label>
            <label className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer shadow-md transition-all flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              <span>{t.emptyState.chooseSlotB}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && onUploadB(e.target.files[0])}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    );
  }

  // Calculate transform styles
  const transformStyle: React.CSSProperties = {
    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
    transformOrigin: '0 0',
    imageRendering: pixelatedZoom && transform.scale > 1.5 ? 'pixelated' : 'auto',
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-hidden select-none">
      {/* Main Canvas Viewport Area */}
      <div
        ref={containerRef}
        id="comparison-viewer-frame"
        className={`flex-1 w-full h-full relative overflow-hidden outline-none ${
          checkerboard ? themeStyles.checkeredClass : themeStyles.canvas
        } ${isPanning ? 'cursor-grabbing' : spacePressed ? 'cursor-grab' : 'cursor-default'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseMove={handleMouseMoveLocal}
        onContextMenu={handleContextMenu}
      >
        {/* Subtle dot grid pattern */}
        <div className={`absolute inset-0 opacity-20 pointer-events-none ${themeStyles.dotGridClass}`} />

        {/* 1. SLIDER OVERLAY MODE (Вертикальная шторка / Ползунок наложения) */}
        {mode === 'slider' && (
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Top Badge Source A */}
            <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-black/70 backdrop-blur rounded text-[10px] font-bold border border-white/10 uppercase tracking-widest text-[#E0E0E0]">
              Source A
            </div>
            {/* Top Badge Source B */}
            <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-black/70 backdrop-blur rounded text-[10px] font-bold border border-white/10 uppercase tracking-widest text-[#E0E0E0]">
              Source B
            </div>

            {/* Layer A (Strictly clipped to the LEFT side of slider: 0% to sliderPos%) */}
            {imageA && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                }}
              >
                <div className="absolute inset-0 pointer-events-none" style={transformStyle}>
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: boundsA.baseX,
                      top: boundsA.baseY,
                      width: boundsA.fittedWidth,
                      height: boundsA.fittedHeight,
                    }}
                  >
                    <img
                      src={imageA.url}
                      alt={imageA.name}
                      className="w-full h-full object-contain block"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Layer B (Strictly clipped to the RIGHT side of slider: sliderPos% to 100%) */}
            {imageB && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`,
                }}
              >
                <div className="absolute inset-0 pointer-events-none" style={transformStyle}>
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: boundsB.baseX,
                      top: boundsB.baseY,
                      width: boundsB.fittedWidth,
                      height: boundsB.fittedHeight,
                    }}
                  >
                    <img
                      src={imageB.url}
                      alt={imageB.name}
                      className="w-full h-full object-contain block"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Vertical Split Line & Slim Handle (1/3 width, 1/2 height) */}
            <div
              className="absolute top-0 bottom-0 pointer-events-auto cursor-ew-resize z-20 group"
              style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDraggingSlider(true);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                setIsDraggingSlider(true);
              }}
            >
              {/* Split vertical line */}
              <div className="w-[2px] h-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.7)] mx-auto" />

              {/* Split Handle Knob - 10px wide x 24px high */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-6 bg-[#161616] border border-blue-500 rounded-sm flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <div className="w-[1.5px] h-3 bg-blue-400 rounded-full" />
              </div>

              {/* Percentage pill above handle */}
              <div className="absolute top-3 -translate-x-1/2 left-1/2 px-1.5 py-0.5 rounded bg-[#161616]/90 border border-[#2A2A2A] text-[9px] font-mono font-bold text-[#E0E0E0] shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {Math.round(sliderPos)}%
              </div>
            </div>
          </div>
        )}

        {/* 2. HORIZONTAL SLIDER MODE */}
        {mode === 'slider-horizontal' && (
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Top Badge Source A */}
            <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-black/70 backdrop-blur rounded text-[10px] font-bold border border-white/10 uppercase tracking-widest text-[#E0E0E0]">
              Source A
            </div>
            {/* Top Badge Source B */}
            <div className="absolute bottom-4 left-4 z-10 px-2 py-1 bg-black/70 backdrop-blur rounded text-[10px] font-bold border border-white/10 uppercase tracking-widest text-[#E0E0E0]">
              Source B
            </div>

            {/* Layer A (Top side clipped: 0% to sliderPos%) */}
            {imageA && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: `polygon(0 0, 100% 0, 100% ${sliderPos}%, 0 ${sliderPos}%)`,
                }}
              >
                <div className="absolute inset-0 pointer-events-none" style={transformStyle}>
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: boundsA.baseX,
                      top: boundsA.baseY,
                      width: boundsA.fittedWidth,
                      height: boundsA.fittedHeight,
                    }}
                  >
                    <img
                      src={imageA.url}
                      alt={imageA.name}
                      className="w-full h-full object-contain block"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Layer B (Bottom side clipped: sliderPos% to 100%) */}
            {imageB && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  clipPath: `polygon(0 ${sliderPos}%, 100% ${sliderPos}%, 100% 100%, 0 100%)`,
                }}
              >
                <div className="absolute inset-0 pointer-events-none" style={transformStyle}>
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: boundsB.baseX,
                      top: boundsB.baseY,
                      width: boundsB.fittedWidth,
                      height: boundsB.fittedHeight,
                    }}
                  >
                    <img
                      src={imageB.url}
                      alt={imageB.name}
                      className="w-full h-full object-contain block"
                      draggable={false}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Horizontal Split Line & Slim Handle (24px wide x 10px high) */}
            <div
              className="absolute left-0 right-0 pointer-events-auto cursor-ns-resize z-20 group"
              style={{ top: `${sliderPos}%`, transform: 'translateY(-50%)' }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setIsDraggingSlider(true);
              }}
              onTouchStart={(e) => {
                e.stopPropagation();
                setIsDraggingSlider(true);
              }}
            >
              <div className="h-[2px] w-full bg-blue-500 shadow-[0_0_8px_rgba(37,99,235,0.7)] my-auto" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-2.5 bg-[#161616] border border-blue-500 rounded-sm flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <div className="h-[1.5px] w-3 bg-blue-400 rounded-full" />
              </div>
              <div className="absolute left-3 -translate-y-1/2 top-1/2 px-1.5 py-0.5 rounded bg-[#161616]/90 border border-[#2A2A2A] text-[9px] font-mono font-bold text-[#E0E0E0] shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {Math.round(sliderPos)}%
              </div>
            </div>
          </div>
        )}

        {/* 3. SIDE-BY-SIDE MODE (Синхронное сравнение 2-Up Horizontal) */}
        {mode === 'side-by-side' && (
          <div className="absolute inset-0 w-full h-full grid grid-cols-2 divide-x divide-black/20 dark:divide-[#2A2A2A] pointer-events-none">
            {/* Left Sub-Viewport A */}
            <div className="relative w-full h-full overflow-hidden border-r border-blue-500/30">
              <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-black/70 backdrop-blur rounded text-[10px] font-bold border border-white/10 uppercase tracking-widest text-[#E0E0E0]">
                Source A
              </div>
              {imageA && (
                <div className="absolute inset-0 pointer-events-none" style={transformStyle}>
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: boundsA.baseX / 2,
                      top: boundsA.baseY,
                      width: boundsA.fittedWidth,
                      height: boundsA.fittedHeight,
                    }}
                  >
                    <img
                      src={imageA.url}
                      alt={imageA.name}
                      className="w-full h-full object-contain block"
                      draggable={false}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Sub-Viewport B */}
            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-black/70 backdrop-blur rounded text-[10px] font-bold border border-white/10 uppercase tracking-widest text-[#E0E0E0]">
                Source B
              </div>
              {imageB && (
                <div className="absolute inset-0 pointer-events-none" style={transformStyle}>
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: boundsB.baseX / 2,
                      top: boundsB.baseY,
                      width: boundsB.fittedWidth,
                      height: boundsB.fittedHeight,
                    }}
                  >
                    <img
                      src={imageB.url}
                      alt={imageB.name}
                      className="w-full h-full object-contain block"
                      draggable={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. VERTICAL SPLIT MODE (2-Up Vertical) */}
        {mode === 'side-vertical' && (
          <div className="absolute inset-0 w-full h-full grid grid-rows-2 divide-y divide-black/20 dark:divide-[#2A2A2A] pointer-events-none">
            <div className="relative w-full h-full overflow-hidden border-b border-blue-500/30">
              <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-black/70 backdrop-blur rounded text-[10px] font-bold border border-white/10 uppercase tracking-widest text-[#E0E0E0]">
                Source A
              </div>
              {imageA && (
                <div className="absolute inset-0 pointer-events-none" style={transformStyle}>
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: boundsA.baseX,
                      top: boundsA.baseY / 2,
                      width: boundsA.fittedWidth,
                      height: boundsA.fittedHeight,
                    }}
                  >
                    <img
                      src={imageA.url}
                      alt={imageA.name}
                      className="w-full h-full object-contain block"
                      draggable={false}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="relative w-full h-full overflow-hidden">
              <div className="absolute top-4 right-4 z-10 px-2 py-1 bg-black/70 backdrop-blur rounded text-[10px] font-bold border border-white/10 uppercase tracking-widest text-[#E0E0E0]">
                Source B
              </div>
              {imageB && (
                <div className="absolute inset-0 pointer-events-none" style={transformStyle}>
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: boundsB.baseX,
                      top: boundsB.baseY / 2,
                      width: boundsB.fittedWidth,
                      height: boundsB.fittedHeight,
                    }}
                  >
                    <img
                      src={imageB.url}
                      alt={imageB.name}
                      className="w-full h-full object-contain block"
                      draggable={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. DIFFERENCE MODE (Разность пикселей) */}
        {mode === 'difference' && (
          <div className="absolute inset-0 w-full h-full pointer-events-none" style={transformStyle}>
            {imageA && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: boundsA.baseX,
                  top: boundsA.baseY,
                  width: boundsA.fittedWidth,
                  height: boundsA.fittedHeight,
                }}
              >
                <img
                  src={imageA.url}
                  alt={imageA.name}
                  className="w-full h-full object-contain block"
                  draggable={false}
                />
              </div>
            )}

            {imageB && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: boundsB.baseX,
                  top: boundsB.baseY,
                  width: boundsB.fittedWidth,
                  height: boundsB.fittedHeight,
                  mixBlendMode: 'difference',
                  filter: diffInvert ? 'invert(1)' : `contrast(${1 + diffThreshold / 20}) brightness(${1 + diffThreshold / 30})`,
                }}
              >
                <img
                  src={imageB.url}
                  alt={imageB.name}
                  className="w-full h-full object-contain block"
                  draggable={false}
                />
              </div>
            )}
          </div>
        )}

        {/* 6. ONION SKIN / OPACITY MODE (Плавное наложение / Multiplied Alpha Blend) */}
        {mode === 'onion' && (
          <div className="absolute inset-0 w-full h-full pointer-events-none" style={transformStyle}>
            {/* Layer A (Base layer: full solid alpha to prevent intermediate transparency bleed) */}
            {imageA && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: boundsA.baseX,
                  top: boundsA.baseY,
                  width: boundsA.fittedWidth,
                  height: boundsA.fittedHeight,
                }}
              >
                <img
                  src={imageA.url}
                  alt={imageA.name}
                  className="w-full h-full object-contain block"
                  draggable={false}
                />
              </div>
            )}

            {/* Layer B (Overlay layer: blended with alpha coefficient onionOpacity / 100) */}
            {imageB && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: boundsB.baseX,
                  top: boundsB.baseY,
                  width: boundsB.fittedWidth,
                  height: boundsB.fittedHeight,
                  opacity: onionOpacity / 100,
                }}
              >
                <img
                  src={imageB.url}
                  alt={imageB.name}
                  className="w-full h-full object-contain block"
                  draggable={false}
                />
              </div>
            )}
          </div>
        )}

        {/* 7. TOGGLE / BLINK MODE (Быстрое A/B переключение) */}
        {mode === 'toggle' && (
          <div className="absolute inset-0 w-full h-full pointer-events-none" style={transformStyle}>
            {/* Slot A (Base layer when smoothBlink is on) */}
            {imageA && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: boundsA.baseX,
                  top: boundsA.baseY,
                  width: boundsA.fittedWidth,
                  height: boundsA.fittedHeight,
                  opacity: smoothBlink ? 1 : (activeToggle === 'A' ? 1 : 0),
                  transition: smoothBlink ? `opacity ${Math.floor((1000 / toggleSpeedHz) * 0.8)}ms ease-in-out` : 'none',
                }}
              >
                <img
                  src={imageA.url}
                  alt={imageA.name}
                  className="w-full h-full object-contain block"
                  draggable={false}
                />
              </div>
            )}

            {/* Slot B */}
            {imageB && (
              <div
                className="absolute pointer-events-none"
                style={{
                  left: boundsB.baseX,
                  top: boundsB.baseY,
                  width: boundsB.fittedWidth,
                  height: boundsB.fittedHeight,
                  opacity: activeToggle === 'B' ? 1 : 0,
                  transition: smoothBlink ? `opacity ${Math.floor((1000 / toggleSpeedHz) * 0.8)}ms ease-in-out` : 'none',
                }}
              >
                <img
                  src={imageB.url}
                  alt={imageB.name}
                  className="w-full h-full object-contain block"
                  draggable={false}
                />
              </div>
            )}
          </div>
        )}

        {/* Inspector coordinates overlay */}
        {showInspector && inspectorData && (
          <div className={`absolute bottom-4 left-4 z-20 ${themeStyles.modalCard} rounded-xl px-3.5 py-2.5 backdrop-blur shadow-2xl space-y-1 font-mono text-[11px]`}>
            <div className="text-blue-500 font-bold flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5" />
              <span>{t.inspector.title}</span>
            </div>
            <div className={themeStyles.textSecondary}>
              {t.inspector.viewportCoords}: <span className={themeStyles.textPrimary}>{inspectorData.x}, {inspectorData.y}</span>
            </div>
            {imageA && (
              <div className="text-blue-400">
                A ({imageA.width}×{imageA.height}): <span className="font-bold">{inspectorData.imgAx}, {inspectorData.imgAy} px</span>
              </div>
            )}
            {imageB && (
              <div className="text-emerald-400">
                B ({imageB.width}×{imageB.height}): <span className="font-bold">{inspectorData.imgBx}, {inspectorData.imgBy} px</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Themed Bottom Status Bar */}
      <footer className={`h-8 ${themeStyles.statusBg} border-t ${themeStyles.border} flex items-center justify-between px-4 shrink-0 z-30 select-none text-xs`}>
        <div className="flex gap-5 items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold opacity-60">ZOOM</span>
            <span className={`text-[11px] font-mono font-semibold ${themeStyles.textPrimary}`}>
              {(transform.scale * 100).toFixed(1)}%
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono font-bold opacity-60">PAN</span>
            <span className={`text-[11px] font-mono ${themeStyles.textPrimary}`}>
              X: {Math.round(transform.x)} Y: {Math.round(transform.y)}
            </span>
          </div>
          {imageA && imageB && (
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold opacity-60">FORMAT</span>
              <span className={`text-[11px] font-mono uppercase ${themeStyles.textPrimary}`}>
                {imageA.format} / {imageB.format}
              </span>
            </div>
          )}
        </div>
        <div className="flex gap-4 items-center">
          <div className={`text-[10px] ${themeStyles.textSecondary} flex gap-3 items-center`}>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded border ${themeStyles.panelSub} ${themeStyles.border} font-mono text-[10px]`}>RMB</kbd> Pan
            </span>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded border ${themeStyles.panelSub} ${themeStyles.border} font-mono text-[10px]`}>Wheel</kbd> Zoom
            </span>
            <span className="flex items-center gap-1">
              <kbd className={`px-1.5 py-0.5 rounded border ${themeStyles.panelSub} ${themeStyles.border} font-mono text-[10px]`}>Space</kbd> Fast Pan
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
