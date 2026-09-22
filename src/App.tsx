import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  CompareMode, 
  AlignmentPreset, 
  ImageItem, 
  TransformState,
  AppLanguage,
  AppTheme
} from './types';
import { SAMPLE_PAIRS, SamplePair } from './data/sampleImages';
import { processImageFile } from './utils/imageUtils';
import { getSampleVideoPair } from './utils/videoSampleUtils';
import { THEMES } from './utils/theme';
import { Header } from './components/Header';
import { ViewportToolbar } from './components/ViewportToolbar';
import { VerticalHistorySidebar } from './components/VerticalHistorySidebar';
import { ComparisonViewer } from './components/ComparisonViewer';
import { DropZoneOverlay } from './components/DropZoneOverlay';
import { HotkeysModal } from './components/HotkeysModal';
import { WindowsLaunchModal } from './components/WindowsLaunchModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  // Theme & Language settings
  const [theme, setTheme] = useState<AppTheme>(() => {
    return (localStorage.getItem('splitcompare_theme') as AppTheme) || 'dark';
  });
  const [language, setLanguage] = useState<AppLanguage>(() => {
    return (localStorage.getItem('splitcompare_lang') as AppLanguage) || 'ru';
  });

  // Save settings on change
  const handleChangeTheme = useCallback((newTheme: AppTheme) => {
    setTheme(newTheme);
    localStorage.setItem('splitcompare_theme', newTheme);
  }, []);

  const handleChangeLanguage = useCallback((newLang: AppLanguage) => {
    setLanguage(newLang);
    localStorage.setItem('splitcompare_lang', newLang);
  }, []);

  // Primary image states (Initialized safely with sample pair)
  const [imageA, setImageA] = useState<ImageItem | null>(SAMPLE_PAIRS[0]?.imageA || null);
  const [imageB, setImageB] = useState<ImageItem | null>(SAMPLE_PAIRS[0]?.imageB || null);

  // History states (vertical ribbons left & right)
  const [historyA, setHistoryA] = useState<ImageItem[]>(() =>
    SAMPLE_PAIRS.map((p) => p.imageA).filter(Boolean)
  );
  const [historyB, setHistoryB] = useState<ImageItem[]>(() =>
    SAMPLE_PAIRS.map((p) => p.imageB).filter(Boolean)
  );

  // Sidebar collapsed states
  const [isHistoryACollapsed, setIsHistoryACollapsed] = useState(false);
  const [isHistoryBCollapsed, setIsHistoryBCollapsed] = useState(false);
  const [areSidebarsCollapsed, setAreSidebarsCollapsed] = useState(false);

  // Resizable sidebar widths (reduced by 25% from old default, max 25% of viewport width)
  const [sidebarWidthA, setSidebarWidthA] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Math.min(200, Math.floor(window.innerWidth * 0.20));
    }
    return 200;
  });
  const [sidebarWidthB, setSidebarWidthB] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return Math.min(200, Math.floor(window.innerWidth * 0.20));
    }
    return 200;
  });

  // Screen orientation & mobile layout state
  const [isPortrait, setIsPortrait] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerHeight > window.innerWidth || window.innerWidth < 768;
    }
    return false;
  });

  // Gyroscope / Orientation Lock
  const [isOrientationLocked, setIsOrientationLocked] = useState<boolean>(false);
  const [deviceOrientation, setDeviceOrientation] = useState<'landscape' | 'portrait'>('landscape');

  // Comparison mode & alignment
  const [mode, setMode] = useState<CompareMode>('slider');
  const [alignment, setAlignment] = useState<AlignmentPreset>('center');

  // Zoom & Pan Transform State (Min scale 0.25 (25%), Max 10.0 (1000%))
  const [transform, setTransform] = useState<TransformState>({
    scale: 1.0,
    x: 0,
    y: 0,
  });

  // Controls & Settings
  const [syncPanZoom, setSyncPanZoom] = useState(true);
  const [sliderPos, setSliderPos] = useState(50);
  const [onionOpacity, setOnionOpacity] = useState(50);
  const [diffThreshold, setDiffThreshold] = useState(3);
  const [diffInvert, setDiffInvert] = useState(false);
  const [checkerboard, setCheckerboard] = useState(true);
  const [pixelatedZoom, setPixelatedZoom] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [activeToggle, setActiveToggle] = useState<'A' | 'B'>('A');
  const [toggleSpeedHz, setToggleSpeedHz] = useState(2);
  const [smoothBlink, setSmoothBlink] = useState(false);
  const [isAutoBlinking, setIsAutoBlinking] = useState(false);

  // Modals & UI state
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [isHotkeysOpen, setIsHotkeysOpen] = useState(false);
  const [isWindowsModalOpen, setIsWindowsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const themeStyles = THEMES[theme];

  // Auto-Blink timer for Toggle mode
  useEffect(() => {
    if (mode !== 'toggle' || !isAutoBlinking) return;
    const intervalMs = Math.max(100, Math.floor(1000 / toggleSpeedHz));
    const timer = setInterval(() => {
      setActiveToggle((prev) => (prev === 'A' ? 'B' : 'A'));
    }, intervalMs);
    return () => clearInterval(timer);
  }, [mode, isAutoBlinking, toggleSpeedHz]);

  // Window resize & orientation observer (limits sidebars to <= 25% of viewport width)
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const maxAllowed = Math.max(120, Math.floor(w * 0.25));

      setSidebarWidthA((prev) => Math.min(prev, maxAllowed));
      setSidebarWidthB((prev) => Math.min(prev, maxAllowed));

      if (!isOrientationLocked) {
        setIsPortrait(h > w || w < 768);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOrientationLocked]);

  // Gyroscope / Device orientation sensor support
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (isOrientationLocked) return;

      // gamma is left-to-right tilt in degrees [-90, 90]
      // beta is front-to-back tilt in degrees [-180, 180]
      const gamma = e.gamma;
      const beta = e.beta;

      if (gamma !== null && beta !== null) {
        const isHorizontalTilt = Math.abs(gamma) > 40 && Math.abs(beta) < 50;
        const newOrientation = isHorizontalTilt ? 'landscape' : (window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
        
        if (newOrientation !== deviceOrientation) {
          setDeviceOrientation(newOrientation);
          if (newOrientation === 'landscape' && isPortrait) {
            setIsPortrait(false);
            setTransform({ scale: 1.0, x: 0, y: 0 });
          } else if (newOrientation === 'portrait' && !isPortrait && window.innerHeight > window.innerWidth) {
            setIsPortrait(true);
            setTransform({ scale: 1.0, x: 0, y: 0 });
          }
        }
      }
    };

    const handleScreenOrientationChange = () => {
      if (isOrientationLocked) return;
      const isLandscape = window.screen.orientation 
        ? window.screen.orientation.type.includes('landscape') 
        : window.innerWidth > window.innerHeight;
      
      setIsPortrait(!isLandscape);
      setTransform({ scale: 1.0, x: 0, y: 0 });
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }
    if (window.screen?.orientation) {
      window.screen.orientation.addEventListener('change', handleScreenOrientationChange);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (window.screen?.orientation) {
        window.screen.orientation.removeEventListener('change', handleScreenOrientationChange);
      }
    };
  }, [isOrientationLocked, deviceOrientation, isPortrait]);

  // Sidebar drag resizing handlers (max 25% of viewport width)
  const handleResizeStartA = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const maxWidth = Math.floor(window.innerWidth * 0.25);
      const newWidth = Math.max(120, Math.min(moveEvent.clientX, maxWidth));
      setSidebarWidthA(newWidth);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  const handleResizeStartB = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const maxWidth = Math.floor(window.innerWidth * 0.25);
      const newWidth = Math.max(120, Math.min(window.innerWidth - moveEvent.clientX, maxWidth));
      setSidebarWidthB(newWidth);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, []);

  // Check if aspect ratio mismatch exists between Image A and B (> 1% diff)
  const hasAspectMismatch = Boolean(
    imageA && imageB && Math.abs(imageA.aspectRatio - imageB.aspectRatio) > 0.01
  );

  // Reset zoom & pan to 100% Fit
  const handleResetZoom = useCallback(() => {
    setTransform({ scale: 1.0, x: 0, y: 0 });
  }, []);

  const handleZoomIn = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(10.0, Number((prev.scale * 1.25).toFixed(2))),
    }));
  }, []);

  const handleZoomOut = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.25, Number((prev.scale / 1.25).toFixed(2))),
    }));
  }, []);

  const handleSetZoomScale = useCallback((scale: number) => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(10.0, Math.max(0.25, scale)),
      x: 0,
      y: 0,
    }));
  }, []);

  // Swap Left and Right images
  const handleSwapImages = useCallback(() => {
    setImageA(imageB);
    setImageB(imageA);
  }, [imageA, imageB]);

  // Upload image to Slot A
  const handleUploadA = useCallback(async (file: File) => {
    try {
      const item = await processImageFile(file);
      setImageA(item);
      setHistoryA((prev) => {
        const filtered = prev.filter((i) => i.name !== item.name && i.size !== item.size);
        return [item, ...filtered].slice(0, 15);
      });
      handleResetZoom();
    } catch (err: any) {
      alert(err.message || 'Ошибка загрузки изображения A');
    }
  }, [handleResetZoom]);

  // Upload image to Slot B
  const handleUploadB = useCallback(async (file: File) => {
    try {
      const item = await processImageFile(file);
      setImageB(item);
      setHistoryB((prev) => {
        const filtered = prev.filter((i) => i.name !== item.name && i.size !== item.size);
        return [item, ...filtered].slice(0, 15);
      });
      handleResetZoom();
    } catch (err: any) {
      alert(err.message || 'Ошибка загрузки изображения B');
    }
  }, [handleResetZoom]);

  // Upload from file input change event
  const handleFileInputA = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleUploadA(e.target.files[0]);
    }
  };

  const handleFileInputB = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleUploadB(e.target.files[0]);
    }
  };

  // Load sample preset pair
  const handleSelectSample = async (sample: SamplePair) => {
    if (sample.id === 'video-sync-compare' || sample.imageA.mediaType === 'video') {
      try {
        const { videoA, videoB } = await getSampleVideoPair();
        setImageA(videoA);
        setImageB(videoB);
        setHistoryA((prev) => [videoA, ...prev.filter((i) => i.id !== videoA.id)].slice(0, 15));
        setHistoryB((prev) => [videoB, ...prev.filter((i) => i.id !== videoB.id)].slice(0, 15));
        setMode('side-by-side');
        handleResetZoom();
        return;
      } catch (err) {
        console.error('Error generating sample videos:', err);
      }
    }

    setImageA(sample.imageA);
    setImageB(sample.imageB);
    setHistoryA((prev) => {
      const filtered = prev.filter((i) => i.id !== sample.imageA.id);
      return [sample.imageA, ...filtered].slice(0, 15);
    });
    setHistoryB((prev) => {
      const filtered = prev.filter((i) => i.id !== sample.imageB.id);
      return [sample.imageB, ...filtered].slice(0, 15);
    });
    handleResetZoom();
  };

  // Drag & drop whole files anywhere on window
  const handleDropFiles = useCallback(
    async (files: FileList | File[], targetSide: 'A' | 'B' | 'both' = 'both') => {
      setIsDraggingFiles(false);
      const fileArray = Array.from(files);
      if (fileArray.length === 0) return;

      if (fileArray.length >= 2 || targetSide === 'both') {
        if (fileArray[0]) await handleUploadA(fileArray[0]);
        if (fileArray[1]) await handleUploadB(fileArray[1]);
      } else if (targetSide === 'B') {
        await handleUploadB(fileArray[0]);
      } else {
        await handleUploadA(fileArray[0]);
      }
    },
    [handleUploadA, handleUploadB]
  );

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Global Keyboard Shortcuts (Layout-independent via e.code & e.key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      const code = e.code;
      const key = e.key ? e.key.toLowerCase() : '';

      // Toggle sidebars (S / KeyS / 'ы')
      if (code === 'KeyS' || key === 's' || key === 'ы') {
        e.preventDefault();
        setAreSidebarsCollapsed((prev) => !prev);
        return;
      }

      // Swap images Left <-> Right (X / KeyX / 'ч')
      if (code === 'KeyX' || key === 'x' || key === 'ч') {
        e.preventDefault();
        handleSwapImages();
        return;
      }

      // Cycle comparison mode (M / Tab / KeyM / 'ь')
      if (code === 'KeyM' || code === 'Tab' || key === 'm' || key === 'ь' || key === 'tab') {
        e.preventDefault();
        setMode((prev) => {
          const modes: CompareMode[] = [
            'slider',
            'slider-horizontal',
            'side-by-side',
            'difference',
            'onion',
            'toggle',
          ];
          const nextIdx = (modes.indexOf(prev) + 1) % modes.length;
          return modes[nextIdx];
        });
        return;
      }

      // Toggle Difference mode (D / KeyD / 'в')
      if (code === 'KeyD' || key === 'd' || key === 'в') {
        e.preventDefault();
        setMode((prev) => (prev === 'difference' ? 'slider' : 'difference'));
        return;
      }

      // Toggle Checkerboard (C / KeyC / 'с')
      if (code === 'KeyC' || key === 'c' || key === 'с') {
        e.preventDefault();
        setCheckerboard((prev) => !prev);
        return;
      }

      // Toggle Sync pan/zoom (L / KeyL / 'д')
      if (code === 'KeyL' || key === 'l' || key === 'д') {
        e.preventDefault();
        setSyncPanZoom((prev) => !prev);
        return;
      }

      // Reset zoom (R / KeyR / 0 / Digit0 / 'к')
      if (code === 'KeyR' || code === 'Digit0' || key === 'r' || key === 'к' || key === '0') {
        e.preventDefault();
        handleResetZoom();
        return;
      }

      // 100% zoom (1 / Digit1 / Numpad1)
      if (code === 'Digit1' || code === 'Numpad1' || key === '1') {
        e.preventDefault();
        handleSetZoomScale(1.0);
        return;
      }

      // 200% zoom (2 / Digit2 / Numpad2)
      if (code === 'Digit2' || code === 'Numpad2' || key === '2') {
        e.preventDefault();
        handleSetZoomScale(2.0);
        return;
      }

      // Zoom In (+ / = / Equal / NumpadAdd)
      if (code === 'Equal' || code === 'NumpadAdd' || key === '+' || key === '=') {
        e.preventDefault();
        handleZoomIn();
        return;
      }

      // Zoom Out (- / _ / Minus / NumpadSubtract)
      if (code === 'Minus' || code === 'NumpadSubtract' || key === '-' || key === '_') {
        e.preventDefault();
        handleZoomOut();
        return;
      }

      // Space peep / Blink slot toggle in Toggle mode
      if (code === 'Space' || key === ' ') {
        if (mode === 'toggle') {
          e.preventDefault();
          setActiveToggle((prev) => (prev === 'A' ? 'B' : 'A'));
        }
        return;
      }

      // Fullscreen (F / KeyF / 'а')
      if (code === 'KeyF' || key === 'f' || key === 'а') {
        e.preventDefault();
        handleToggleFullscreen();
        return;
      }

      // Hotkeys help (? / H / KeyH / Slash / 'р')
      if (code === 'Slash' || code === 'KeyH' || key === '?' || key === 'h' || key === 'р') {
        e.preventDefault();
        setIsHotkeysOpen((prev) => !prev);
        return;
      }

      // Escape to close modals
      if (code === 'Escape' || key === 'escape') {
        setIsHotkeysOpen(false);
        setIsWindowsModalOpen(false);
        setIsSettingsOpen(false);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    mode,
    handleSwapImages,
    handleResetZoom,
    handleSetZoomScale,
    handleZoomIn,
    handleZoomOut,
  ]);

  // Window drag enter / leave detection
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      // Check if dragged items contain Files
      if (e.dataTransfer && Array.from(e.dataTransfer.types).includes('Files')) {
        setIsDraggingFiles(true);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDraggingFiles(false);
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  return (
    <div className={`flex flex-col h-screen w-screen ${themeStyles.bg} ${themeStyles.textPrimary} overflow-hidden select-none font-sans`}>
      {/* 1. Header (Mode Switcher, Sample Presets, Settings, Windows Launch & Hotkeys) */}
      <Header
        mode={mode}
        onSelectMode={setMode}
        onLoadSample={handleSelectSample}
        onOpenHotkeys={() => setIsHotkeysOpen(true)}
        onOpenWindowsModal={() => setIsWindowsModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        areSidebarsCollapsed={areSidebarsCollapsed}
        onToggleSidebars={() => setAreSidebarsCollapsed((prev) => !prev)}
        language={language}
        theme={theme}
      />

      {/* 2. Viewport Secondary Toolbar */}
      <ViewportToolbar
        mode={mode}
        transform={transform}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onSetZoomScale={handleSetZoomScale}
        syncPanZoom={syncPanZoom}
        onToggleSync={() => setSyncPanZoom(!syncPanZoom)}
        onSwapImages={handleSwapImages}
        hasAspectMismatch={hasAspectMismatch}
        alignment={alignment}
        onSelectAlignment={setAlignment}
        checkerboard={checkerboard}
        onToggleCheckerboard={() => setCheckerboard(!checkerboard)}
        pixelatedZoom={pixelatedZoom}
        onTogglePixelatedZoom={() => setPixelatedZoom(!pixelatedZoom)}
        showInspector={showInspector}
        onToggleInspector={() => setShowInspector(!showInspector)}
        sliderPos={sliderPos}
        onChangeSliderPos={setSliderPos}
        onionOpacity={onionOpacity}
        onChangeOnionOpacity={setOnionOpacity}
        diffThreshold={diffThreshold}
        onChangeDiffThreshold={setDiffThreshold}
        diffInvert={diffInvert}
        onToggleDiffInvert={() => setDiffInvert(!diffInvert)}
        toggleSpeedHz={toggleSpeedHz}
        onChangeToggleSpeedHz={setToggleSpeedHz}
        smoothBlink={smoothBlink}
        onToggleSmoothBlink={() => setSmoothBlink(!smoothBlink)}
        activeToggle={activeToggle}
        onToggleSlot={() => setActiveToggle(activeToggle === 'A' ? 'B' : 'A')}
        isAutoBlinking={isAutoBlinking}
        onToggleAutoBlink={() => setIsAutoBlinking(!isAutoBlinking)}
        isOrientationLocked={isOrientationLocked}
        onToggleOrientationLock={() => setIsOrientationLocked(!isOrientationLocked)}
        currentOrientation={deviceOrientation}
        areSidebarsCollapsed={areSidebarsCollapsed}
        onToggleSidebars={() => setAreSidebarsCollapsed((prev) => !prev)}
        language={language}
        theme={theme}
      />

      {/* 3. Main Workspace Layout */}
      {isPortrait ? (
        /* Portrait / Smartphone Mode: Viewport on Top, Dual History Columns on Bottom */
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Comparison Viewport (Takes full height if sidebars are collapsed, else top 2/3) */}
          <div className={`${areSidebarsCollapsed ? 'h-full' : 'h-[67%]'} relative overflow-hidden border-b border-[#2A2A2A] transition-all duration-150`}>
            <ComparisonViewer
              imageA={imageA}
              imageB={imageB}
              mode={mode}
              alignment={alignment}
              transform={transform}
              onUpdateTransform={setTransform}
              syncPanZoom={syncPanZoom}
              sliderPos={sliderPos}
              onChangeSliderPos={setSliderPos}
              onionOpacity={onionOpacity}
              onChangeOnionOpacity={setOnionOpacity}
              diffThreshold={diffThreshold}
              onChangeDiffThreshold={setDiffThreshold}
              diffInvert={diffInvert}
              onToggleDiffInvert={() => setDiffInvert(!diffInvert)}
              checkerboard={checkerboard}
              onToggleCheckerboard={() => setCheckerboard(!checkerboard)}
              pixelatedZoom={pixelatedZoom}
              onTogglePixelatedZoom={() => setPixelatedZoom(!pixelatedZoom)}
              activeToggle={activeToggle}
              onToggleActive={setActiveToggle}
              toggleSpeedHz={toggleSpeedHz}
              onChangeToggleSpeedHz={setToggleSpeedHz}
              smoothBlink={smoothBlink}
              onUploadA={handleUploadA}
              onUploadB={handleUploadB}
              showInspector={showInspector}
              onSelectMode={setMode}
              language={language}
              theme={theme}
            />
          </div>

          {/* Lower 1/3: History Sidebars side-by-side (Slot A left 50%, Slot B right 50%) */}
          {!areSidebarsCollapsed && (
            <div className="h-[33%] flex overflow-hidden">
              <VerticalHistorySidebar
                side="A"
                currentImage={imageA}
                history={historyA}
                onSelectImage={setImageA}
                onUploadFile={handleFileInputA}
                onClearHistory={() => setHistoryA([])}
                onDeleteImage={(id, e) => {
                  e.stopPropagation();
                  setHistoryA((prev) => prev.filter((item) => item.id !== id));
                }}
                isCollapsed={false}
                onToggleCollapse={() => {}}
                isMobileBottomView={true}
                language={language}
                theme={theme}
              />
              <VerticalHistorySidebar
                side="B"
                currentImage={imageB}
                history={historyB}
                onSelectImage={setImageB}
                onUploadFile={handleFileInputB}
                onClearHistory={() => setHistoryB([])}
                onDeleteImage={(id, e) => {
                  e.stopPropagation();
                  setHistoryB((prev) => prev.filter((item) => item.id !== id));
                }}
                isCollapsed={false}
                onToggleCollapse={() => {}}
                isMobileBottomView={true}
                language={language}
                theme={theme}
              />
            </div>
          )}
        </div>
      ) : (
        /* Landscape / Desktop Mode: Left Ribbon A | Main Viewport | Right Ribbon B */
        <div className="flex-1 flex overflow-hidden relative">
          {/* Left History Vertical Ribbon (Slot A) */}
          {!areSidebarsCollapsed && (
            <VerticalHistorySidebar
              side="A"
              currentImage={imageA}
              history={historyA}
              onSelectImage={setImageA}
              onUploadFile={handleFileInputA}
              onClearHistory={() => setHistoryA([])}
              onDeleteImage={(id, e) => {
                e.stopPropagation();
                setHistoryA((prev) => prev.filter((item) => item.id !== id));
              }}
              isCollapsed={isHistoryACollapsed}
              onToggleCollapse={() => setIsHistoryACollapsed(!isHistoryACollapsed)}
              width={sidebarWidthA}
              onResizeStart={handleResizeStartA}
              language={language}
              theme={theme}
            />
          )}

          {/* Center Main Canvas Comparison Viewer */}
          <ComparisonViewer
            imageA={imageA}
            imageB={imageB}
            mode={mode}
            alignment={alignment}
            transform={transform}
            onUpdateTransform={setTransform}
            syncPanZoom={syncPanZoom}
            sliderPos={sliderPos}
            onChangeSliderPos={setSliderPos}
            onionOpacity={onionOpacity}
            onChangeOnionOpacity={setOnionOpacity}
            diffThreshold={diffThreshold}
            onChangeDiffThreshold={setDiffThreshold}
            diffInvert={diffInvert}
            onToggleDiffInvert={() => setDiffInvert(!diffInvert)}
            checkerboard={checkerboard}
            onToggleCheckerboard={() => setCheckerboard(!checkerboard)}
            pixelatedZoom={pixelatedZoom}
            onTogglePixelatedZoom={() => setPixelatedZoom(!pixelatedZoom)}
            activeToggle={activeToggle}
            onToggleActive={setActiveToggle}
            toggleSpeedHz={toggleSpeedHz}
            onChangeToggleSpeedHz={setToggleSpeedHz}
            smoothBlink={smoothBlink}
            onUploadA={handleUploadA}
            onUploadB={handleUploadB}
            showInspector={showInspector}
            onSelectMode={setMode}
            language={language}
            theme={theme}
          />

          {/* Right History Vertical Ribbon (Slot B) */}
          {!areSidebarsCollapsed && (
            <VerticalHistorySidebar
              side="B"
              currentImage={imageB}
              history={historyB}
              onSelectImage={setImageB}
              onUploadFile={handleFileInputB}
              onClearHistory={() => setHistoryB([])}
              onDeleteImage={(id, e) => {
                e.stopPropagation();
                setHistoryB((prev) => prev.filter((item) => item.id !== id));
              }}
              isCollapsed={isHistoryBCollapsed}
              onToggleCollapse={() => setIsHistoryBCollapsed(!isHistoryBCollapsed)}
              width={sidebarWidthB}
              onResizeStart={handleResizeStartB}
              language={language}
              theme={theme}
            />
          )}
        </div>
      )}

      {/* 4. Global Modals & Overlays */}
      <DropZoneOverlay
        isDraggingOver={isDraggingFiles}
        onDropFiles={handleDropFiles}
        onCancelDrag={() => setIsDraggingFiles(false)}
        language={language}
        theme={theme}
      />

      <HotkeysModal
        isOpen={isHotkeysOpen}
        onClose={() => setIsHotkeysOpen(false)}
        language={language}
        theme={theme}
      />

      <WindowsLaunchModal
        isOpen={isWindowsModalOpen}
        onClose={() => setIsWindowsModalOpen(false)}
        language={language}
        theme={theme}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        onChangeTheme={handleChangeTheme}
        language={language}
        onChangeLanguage={handleChangeLanguage}
      />
    </div>
  );
}
