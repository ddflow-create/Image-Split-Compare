import React, { useState, useEffect, useRef } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Lock, 
  Unlock, 
  ArrowLeftRight, 
  Grid3X3, 
  Check, 
  Sparkles,
  Crosshair,
  Play,
  Pause,
  Contrast,
  Layers,
  Smartphone,
  PanelLeftClose,
  PanelLeft,
  MoreVertical
} from 'lucide-react';
import { 
  CompareMode, 
  AlignmentPreset, 
  TransformState, 
  AppLanguage, 
  AppTheme 
} from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { THEMES } from '../utils/theme';
import { ALIGNMENT_OPTIONS } from '../utils/imageUtils';

interface ViewportToolbarProps {
  mode: CompareMode;
  transform: TransformState;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onSetZoomScale: (scale: number) => void;
  syncPanZoom: boolean;
  onToggleSync: () => void;
  onSwapImages: () => void;
  hasAspectMismatch: boolean;
  alignment: AlignmentPreset;
  onSelectAlignment: (alignment: AlignmentPreset) => void;
  checkerboard: boolean;
  onToggleCheckerboard: () => void;
  pixelatedZoom: boolean;
  onTogglePixelatedZoom: () => void;
  showInspector: boolean;
  onToggleInspector: () => void;
  sliderPos: number;
  onChangeSliderPos: (pos: number) => void;
  onionOpacity: number;
  onChangeOnionOpacity: (opacity: number) => void;
  diffThreshold: number;
  onChangeDiffThreshold: (threshold: number) => void;
  diffInvert: boolean;
  onToggleDiffInvert: () => void;
  toggleSpeedHz: number;
  onChangeToggleSpeedHz: (speed: number) => void;
  smoothBlink: boolean;
  onToggleSmoothBlink: () => void;
  activeToggle: 'A' | 'B';
  onToggleSlot: () => void;
  isAutoBlinking: boolean;
  onToggleAutoBlink: () => void;
  isOrientationLocked?: boolean;
  onToggleOrientationLock?: () => void;
  currentOrientation?: 'landscape' | 'portrait';
  areSidebarsCollapsed?: boolean;
  onToggleSidebars?: () => void;
  language: AppLanguage;
  theme: AppTheme;
}

export const ViewportToolbar: React.FC<ViewportToolbarProps> = ({
  mode,
  transform,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onSetZoomScale,
  syncPanZoom,
  onToggleSync,
  onSwapImages,
  hasAspectMismatch,
  alignment,
  onSelectAlignment,
  checkerboard,
  onToggleCheckerboard,
  pixelatedZoom,
  onTogglePixelatedZoom,
  showInspector,
  onToggleInspector,
  sliderPos,
  onChangeSliderPos,
  onionOpacity,
  onChangeOnionOpacity,
  diffThreshold,
  onChangeDiffThreshold,
  diffInvert,
  onToggleDiffInvert,
  toggleSpeedHz,
  onChangeToggleSpeedHz,
  smoothBlink,
  onToggleSmoothBlink,
  activeToggle,
  onToggleSlot,
  isAutoBlinking,
  onToggleAutoBlink,
  isOrientationLocked = false,
  onToggleOrientationLock,
  currentOrientation = 'landscape',
  areSidebarsCollapsed = false,
  onToggleSidebars,
  language,
  theme,
}) => {
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);

  const zoomRef = useRef<HTMLDivElement>(null);
  const alignRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[language];
  const themeStyles = THEMES[theme];

  const zoomPercent = Math.round(transform.scale * 100);
  const zoomPresets = [25, 50, 75, 100, 150, 200, 300, 500, 1000];

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (zoomRef.current && !zoomRef.current.contains(e.target as Node)) {
        setShowZoomMenu(false);
      }
      if (alignRef.current && !alignRef.current.contains(e.target as Node)) {
        setShowAlignMenu(false);
      }
      if (overflowRef.current && !overflowRef.current.contains(e.target as Node)) {
        setShowOverflowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`h-11 ${themeStyles.panel} border-b ${themeStyles.border} px-2 md:px-3 flex items-center justify-between gap-1.5 md:gap-2 shrink-0 z-20 select-none text-xs`}>
      {/* Left Group: Sidebars Toggle, Zoom Stepper & Presets, Sync, Swap */}
      <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
        {/* Toggle Sidebars (S) */}
        {onToggleSidebars && (
          <button
            onClick={onToggleSidebars}
            title={areSidebarsCollapsed 
              ? (language === 'ru' ? 'Раскрыть боковые панели (S)' : 'Expand sidebars (S)') 
              : (language === 'ru' ? 'Свернуть боковые панели (S)' : 'Collapse sidebars (S)')}
            className={`p-1.5 rounded-lg border text-xs transition-colors shrink-0 ${
              areSidebarsCollapsed
                ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 font-bold'
                : `${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
            }`}
          >
            {areSidebarsCollapsed ? <PanelLeft className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
          </button>
        )}

        {/* Zoom Stepper & Presets */}
        <div className={`flex items-center ${themeStyles.panelSub} border ${themeStyles.border} rounded-lg p-0.5 shadow-sm shrink-0`}>
          <button
            onClick={onZoomOut}
            disabled={transform.scale <= 0.25}
            title={t.toolbar.zoomOut}
            className={`p-1.5 ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:bg-black/10 dark:hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors`}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          {/* Zoom % Selector */}
          <div className="relative" ref={zoomRef}>
            <button
              onClick={() => {
                setShowZoomMenu(!showZoomMenu);
                setShowAlignMenu(false);
                setShowOverflowMenu(false);
              }}
              title={t.toolbar.zoom}
              className={`px-1.5 sm:px-2 py-1 text-xs font-mono font-semibold ${themeStyles.textPrimary} hover:bg-black/10 dark:hover:bg-white/10 rounded min-w-10 sm:min-w-12 text-center transition-colors`}
            >
              {zoomPercent}%
            </button>

            {showZoomMenu && (
              <div 
                className={`absolute left-0 top-full mt-1.5 w-36 ${themeStyles.modalCard} rounded-xl py-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 border ${themeStyles.border}`}
              >
                <div className={`text-[10px] uppercase font-bold tracking-wider ${themeStyles.textMuted} px-3 py-1 border-b ${themeStyles.border}`}>
                  {t.toolbar.zoom}
                </div>
                {zoomPresets.map((pct) => (
                  <button
                    key={pct}
                    onClick={() => {
                      onSetZoomScale(pct / 100);
                      setShowZoomMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-mono text-left transition-colors ${
                      zoomPercent === pct
                        ? `${themeStyles.buttonActive}`
                        : `${themeStyles.textPrimary} hover:bg-black/10 dark:hover:bg-white/10`
                    }`}
                  >
                    <span>{pct}%</span>
                    {pct === 100 && (
                      <span className="text-[10px] opacity-75 font-sans">
                        {t.toolbar.fit}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onZoomIn}
            disabled={transform.scale >= 10.0}
            title={t.toolbar.zoomIn}
            className={`p-1.5 ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:bg-black/10 dark:hover:bg-white/10 rounded disabled:opacity-30 disabled:hover:bg-transparent transition-colors`}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onResetZoom}
            title={t.toolbar.resetZoom}
            className={`p-1.5 ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:bg-black/10 dark:hover:bg-white/10 rounded ml-0.5 border-l ${themeStyles.border} pl-1.5 transition-colors`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sync Pan/Zoom Toggle */}
        <button
          onClick={onToggleSync}
          title={syncPanZoom ? t.toolbar.syncOn : t.toolbar.syncOff}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-mono transition-all shrink-0 ${
            syncPanZoom
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-semibold shadow-sm'
              : `${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textMuted} hover:${themeStyles.textSecondary}`
          }`}
        >
          {syncPanZoom ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{syncPanZoom ? 'SYNC' : 'FREE'}</span>
        </button>

        {/* Swap A ↔ B Button */}
        <button
          onClick={onSwapImages}
          title={t.toolbar.swapTooltip + ' (X)'}
          className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border ${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:border-blue-500/40 transition-colors shrink-0`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span className="hidden md:inline">{t.toolbar.swap}</span>
        </button>

        {/* Alignment Preset Dropdown (Visible on md+ screens, in overflow menu on small screens) */}
        <div className="relative shrink-0 hidden md:block" ref={alignRef}>
          <button
            onClick={() => {
              setShowAlignMenu(!showAlignMenu);
              setShowZoomMenu(false);
              setShowOverflowMenu(false);
            }}
            title={t.toolbar.alignTitle}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
              showAlignMenu || hasAspectMismatch
                ? 'bg-blue-600/15 border-blue-500/40 text-blue-400 font-semibold shadow-sm'
                : `${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.toolbar.alignment}:</span>
            <span className="font-semibold">
              {t.alignments[alignment]?.short || alignment}
            </span>
          </button>

          {showAlignMenu && (
            <div 
              className={`absolute left-0 top-full mt-1.5 w-64 ${themeStyles.modalCard} rounded-xl p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 border ${themeStyles.border}`}
            >
              <div className={`text-[10px] font-bold uppercase tracking-wider ${themeStyles.textMuted} px-2 py-1 border-b ${themeStyles.border} mb-2`}>
                {t.toolbar.alignTitle}
              </div>
              <div className={`grid grid-cols-3 gap-1 p-1.5 ${themeStyles.panelSub} rounded-lg border ${themeStyles.border} mb-2`}>
                {ALIGNMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onSelectAlignment(opt.id);
                      setShowAlignMenu(false);
                    }}
                    className={`p-1 rounded text-center transition-colors flex flex-col items-center justify-center min-h-[36px] ${
                      alignment === opt.id
                        ? 'bg-blue-600 text-white font-bold shadow-sm'
                        : `${themeStyles.textSecondary} hover:bg-black/10 dark:hover:bg-white/10 hover:${themeStyles.textPrimary}`
                    }`}
                    title={t.alignments[opt.id]?.label || opt.id}
                  >
                    <span className="text-xs">{t.alignments[opt.id]?.arrow || '•'}</span>
                    <span className="text-[9px] leading-tight truncate max-w-full px-0.5">{t.alignments[opt.id]?.short || opt.id}</span>
                  </button>
                ))}
              </div>
              <div className="space-y-0.5 max-h-48 overflow-y-auto">
                {ALIGNMENT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onSelectAlignment(opt.id);
                      setShowAlignMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                      alignment === opt.id
                        ? 'bg-blue-600/15 text-blue-400 font-semibold'
                        : `${themeStyles.textPrimary} hover:bg-black/10 dark:hover:bg-white/10`
                    }`}
                  >
                    <span>{t.alignments[opt.id]?.label || opt.id}</span>
                    {alignment === opt.id && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Group: Mode Controls, Desktop Quick Tools & Mobile Burger Menu */}
      <div className="flex items-center gap-1 md:gap-1.5 shrink-0">
        {/* Slider Controls */}
        {(mode === 'slider' || mode === 'slider-horizontal') && (
          <div className={`flex items-center gap-1 sm:gap-2 px-1.5 sm:px-2 py-1 rounded-lg ${themeStyles.panelSub} border ${themeStyles.border} shrink-0`}>
            <span className={`text-[11px] font-mono ${themeStyles.textSecondary}`}>
              {Math.round(sliderPos)}%
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => onChangeSliderPos(Number(e.target.value))}
              className="w-14 sm:w-20 md:w-28 h-1.5 bg-black/30 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="hidden lg:flex items-center gap-1">
              {[25, 50, 75].map((pos) => (
                <button
                  key={pos}
                  onClick={() => onChangeSliderPos(pos)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    Math.round(sliderPos) === pos
                      ? 'bg-blue-600 text-white font-bold'
                      : `${themeStyles.textMuted} hover:${themeStyles.textPrimary}`
                  }`}
                >
                  {pos}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Difference Mode Controls */}
        {mode === 'difference' && (
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-lg ${themeStyles.panelSub} border ${themeStyles.border} shrink-0`}>
            <span className={`text-[11px] ${themeStyles.textSecondary} hidden sm:inline`}>
              {t.toolbar.differenceThreshold}:
            </span>
            <input
              type="range"
              min="1"
              max="10"
              value={diffThreshold}
              onChange={(e) => onChangeDiffThreshold(Number(e.target.value))}
              className="w-14 sm:w-18 h-1.5 bg-black/30 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="font-mono text-[11px] font-bold text-blue-400">
              {diffThreshold}x
            </span>
            <button
              onClick={onToggleDiffInvert}
              title={t.toolbar.invert}
              className={`px-1.5 sm:px-2 py-0.5 rounded text-[11px] border font-medium transition-colors ${
                diffInvert
                  ? 'bg-blue-600/20 border-blue-500/40 text-blue-400'
                  : `${themeStyles.border} ${themeStyles.textSecondary}`
              }`}
            >
              <Contrast className="w-3.5 h-3.5 inline sm:mr-1" />
              <span className="hidden sm:inline">{t.toolbar.invert}</span>
            </button>
          </div>
        )}

        {/* Onion Skin Mode Controls */}
        {mode === 'onion' && (
          <div className={`flex items-center gap-1.5 sm:gap-2 px-2 py-1 rounded-lg ${themeStyles.panelSub} border ${themeStyles.border} shrink-0`}>
            <span className="text-[11px] text-blue-400 font-bold">A</span>
            <input
              type="range"
              min="0"
              max="100"
              value={onionOpacity}
              onChange={(e) => onChangeOnionOpacity(Number(e.target.value))}
              className="w-16 sm:w-24 h-1.5 bg-black/30 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-[11px] text-emerald-400 font-bold">B</span>
            <span className="font-mono text-[11px] text-zinc-400">
              {onionOpacity}%
            </span>
          </div>
        )}

        {/* Toggle Blink Mode Controls */}
        {mode === 'toggle' && (
          <div className={`flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-1 rounded-lg ${themeStyles.panelSub} border ${themeStyles.border} shrink-0`}>
            <button
              onClick={onToggleAutoBlink}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-1 rounded-md font-semibold text-[11px] transition-colors ${
                isAutoBlinking
                  ? 'bg-amber-500 text-black shadow-sm animate-pulse'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {isAutoBlinking ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="hidden xs:inline">{isAutoBlinking ? t.toolbar.stopBlink : t.toolbar.autoBlink}</span>
            </button>

            {/* Blink Frequency Speed (Hz) */}
            <div className="flex items-center gap-1 pl-1 border-l border-zinc-700/40" title={`${t.toolbar.speedHz}: ${toggleSpeedHz} Hz`}>
              <span className={`text-[10px] ${themeStyles.textMuted} hidden md:inline`}>
                {t.toolbar.speedHz}:
              </span>
              <input
                type="range"
                min="1"
                max="16"
                step="1"
                value={toggleSpeedHz}
                onChange={(e) => onChangeToggleSpeedHz(Number(e.target.value))}
                className="w-12 sm:w-16 h-1.5 bg-black/30 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="font-mono text-[11px] font-bold text-blue-400 min-w-[32px]">
                {toggleSpeedHz}Hz
              </span>
            </div>

            {/* Smooth Blink Toggle */}
            <button
              onClick={onToggleSmoothBlink}
              title={language === 'ru' ? 'Плавное мигание' : 'Smooth blink'}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors shadow-sm ${
                smoothBlink
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : `${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onToggleSlot}
              disabled={isAutoBlinking}
              className={`px-1.5 sm:px-2 py-1 rounded-md text-xs font-mono font-bold border transition-all ${
                activeToggle === 'A'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
              }`}
            >
              Slot {activeToggle}
            </button>
          </div>
        )}

        {/* Desktop View Helpers (Hidden on screens < lg, accessible via Burger Menu) */}
        <div className="hidden lg:flex items-center gap-1 pl-1.5 border-l border-zinc-800/40 shrink-0">
          {/* Transparency Checkerboard */}
          <button
            onClick={onToggleCheckerboard}
            title={checkerboard ? t.toolbar.checkerboardOn + ' (C)' : t.toolbar.checkerboardOff + ' (C)'}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs transition-colors shrink-0 ${
              checkerboard
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 font-semibold'
                : `${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textMuted} hover:${themeStyles.textSecondary}`
            }`}
          >
            <div className="w-3.5 h-3.5 rounded-[2px] overflow-hidden grid grid-cols-2 grid-rows-2 border border-zinc-500/40 shadow-sm shrink-0">
              <div className="bg-zinc-300 dark:bg-zinc-200" />
              <div className="bg-zinc-500 dark:bg-zinc-600" />
              <div className="bg-zinc-500 dark:bg-zinc-600" />
              <div className="bg-zinc-300 dark:bg-zinc-200" />
            </div>
            <span className="hidden xl:inline">{t.toolbar.checkerboard}</span>
          </button>

          {/* Soft / Pixelated Zoom toggle button */}
          <button
            onClick={onTogglePixelatedZoom}
            title={pixelatedZoom 
              ? (language === 'ru' ? 'Пикселизация включена. Нажмите для сглаживания (SOFT)' : 'Pixelated zoom active. Click for bilinear filtering (SOFT)') 
              : (language === 'ru' ? 'Сглаживание включено. Нажмите для пикселизации (PIXEL)' : 'Smooth filtering active. Click for pixelated zoom (PIXEL)')}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs font-mono transition-colors shrink-0 ${
              pixelatedZoom
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 font-bold shadow-sm'
                : `${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
            }`}
          >
            {pixelatedZoom ? (
              <>
                <Grid3X3 className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold">PIXEL</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>SOFT</span>
              </>
            )}
          </button>

          {/* Cursor Inspector button */}
          <button
            onClick={onToggleInspector}
            title={t.toolbar.inspectorTooltip}
            className={`flex items-center gap-1 px-2 py-1.5 rounded-lg border text-xs transition-colors shrink-0 ${
              showInspector
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 font-semibold'
                : `${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textMuted} hover:${themeStyles.textSecondary}`
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">{t.toolbar.inspector}</span>
          </button>

          {/* Gyroscope / Orientation Lock Toggle */}
          {onToggleOrientationLock && (
            <button
              onClick={onToggleOrientationLock}
              title={isOrientationLocked ? t.orientation.lockTooltip : t.orientation.unlockTooltip}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg border text-xs font-mono transition-all shrink-0 ${
                isOrientationLocked
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-400 font-semibold shadow-sm'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-400 font-semibold'
              }`}
            >
              {isOrientationLocked ? <Lock className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
              <span className="hidden xl:inline">
                {isOrientationLocked 
                  ? (language === 'ru' ? 'БЛОК' : 'LOCKED') 
                  : (language === 'ru' ? 'ГИРО' : 'GYRO')}
              </span>
            </button>
          )}
        </div>

        {/* Responsive Overflow Burger Menu for Mobile / Small Screens */}
        <div className="relative shrink-0" ref={overflowRef}>
          <button
            onClick={() => {
              setShowOverflowMenu(!showOverflowMenu);
              setShowZoomMenu(false);
              setShowAlignMenu(false);
            }}
            title={language === 'ru' ? 'Дополнительные инструменты' : 'More tools'}
            className={`p-1.5 rounded-lg border transition-colors ${
              showOverflowMenu
                ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm'
                : `${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
            }`}
          >
            <MoreVertical className="w-3.5 h-3.5" />
          </button>

          {showOverflowMenu && (
            <div 
              className={`absolute right-0 top-full mt-1.5 w-64 ${themeStyles.modalCard} rounded-xl p-2.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 border ${themeStyles.border} space-y-2`}
            >
              {/* Alignment Controls in Menu */}
              <div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${themeStyles.textMuted} px-1 mb-1.5 flex items-center justify-between`}>
                  <span>{t.toolbar.alignment}</span>
                  <span className="text-blue-400 font-mono">{t.alignments[alignment]?.short || alignment}</span>
                </div>
                <div className={`grid grid-cols-3 gap-1 p-1.5 ${themeStyles.panelSub} rounded-lg border ${themeStyles.border}`}>
                  {ALIGNMENT_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onSelectAlignment(opt.id);
                      }}
                      className={`p-1 rounded text-center transition-colors flex flex-col items-center justify-center min-h-[32px] ${
                        alignment === opt.id
                          ? 'bg-blue-600 text-white font-bold shadow-sm'
                          : `${themeStyles.textSecondary} hover:bg-black/10 dark:hover:bg-white/10 hover:${themeStyles.textPrimary}`
                      }`}
                      title={t.alignments[opt.id]?.label || opt.id}
                    >
                      <span className="text-xs">{t.alignments[opt.id]?.arrow || '•'}</span>
                      <span className="text-[9px] leading-tight truncate max-w-full px-0.5">{t.alignments[opt.id]?.short || opt.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Blink Speed Setting in Overflow Menu when in Toggle mode */}
              {mode === 'toggle' && (
                <div className={`p-2 rounded-lg ${themeStyles.panelSub} border ${themeStyles.border} space-y-1.5`}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className={themeStyles.textMuted}>{t.toolbar.speedHz}</span>
                    <span className="font-mono font-bold text-blue-400">{toggleSpeedHz} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    step="1"
                    value={toggleSpeedHz}
                    onChange={(e) => onChangeToggleSpeedHz(Number(e.target.value))}
                    className="w-full h-1.5 bg-black/30 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <button
                    onClick={onToggleSmoothBlink}
                    className={`w-full flex items-center justify-between p-1.5 rounded-lg border ${themeStyles.border} text-[11px] transition-colors mt-2 ${
                      smoothBlink
                        ? 'bg-blue-600/20 border-blue-500/50 text-blue-500'
                        : `${themeStyles.textSecondary} hover:bg-black/10 dark:hover:bg-white/10`
                    }`}
                  >
                    <span>{language === 'ru' ? 'Плавное мигание' : 'Smooth blink'}</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className={`border-t ${themeStyles.border} pt-1.5 space-y-1`}>
                {/* Checkerboard toggle in menu */}
                <button
                  onClick={() => {
                    onToggleCheckerboard();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    checkerboard 
                      ? 'bg-blue-500/10 text-blue-400 font-semibold' 
                      : `${themeStyles.textPrimary} hover:bg-black/10 dark:hover:bg-white/10`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-3.5 h-3.5 rounded-[2px] overflow-hidden grid grid-cols-2 grid-rows-2 border border-zinc-500/40">
                      <div className="bg-zinc-300 dark:bg-zinc-200" />
                      <div className="bg-zinc-500 dark:bg-zinc-600" />
                      <div className="bg-zinc-500 dark:bg-zinc-600" />
                      <div className="bg-zinc-300 dark:bg-zinc-200" />
                    </div>
                    <span>{t.toolbar.checkerboard} (C)</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">{checkerboard ? 'ON' : 'OFF'}</span>
                </button>

                {/* Pixelated / Soft Zoom toggle in menu */}
                <button
                  onClick={() => {
                    onTogglePixelatedZoom();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    pixelatedZoom 
                      ? 'bg-amber-500/15 text-amber-400 font-bold' 
                      : `${themeStyles.textPrimary} hover:bg-black/10 dark:hover:bg-white/10`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {pixelatedZoom ? <Grid3X3 className="w-3.5 h-3.5 text-amber-400" /> : <Sparkles className="w-3.5 h-3.5 text-blue-400" />}
                    <span>{pixelatedZoom ? 'Pixelated (PIXEL)' : 'Smooth (SOFT)'}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">{pixelatedZoom ? 'PIXEL' : 'SOFT'}</span>
                </button>

                {/* Inspector toggle in menu */}
                <button
                  onClick={() => {
                    onToggleInspector();
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    showInspector 
                      ? 'bg-blue-500/10 text-blue-400 font-semibold' 
                      : `${themeStyles.textPrimary} hover:bg-black/10 dark:hover:bg-white/10`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>{t.toolbar.inspector}</span>
                  </div>
                  <span className="text-[10px] font-mono opacity-80">{showInspector ? 'ON' : 'OFF'}</span>
                </button>

                {/* Gyro toggle in menu */}
                {onToggleOrientationLock && (
                  <button
                    onClick={() => {
                      onToggleOrientationLock();
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                      isOrientationLocked 
                        ? 'bg-amber-500/15 text-amber-400 font-semibold' 
                        : `${themeStyles.textPrimary} hover:bg-black/10 dark:hover:bg-white/10`
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isOrientationLocked ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Smartphone className="w-3.5 h-3.5 text-blue-400" />}
                      <span>{language === 'ru' ? 'Гироскоп / Поворот' : 'Gyro / Orientation'}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-80">{isOrientationLocked ? 'LOCKED' : 'GYRO'}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
