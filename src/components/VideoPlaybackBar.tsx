import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Repeat, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward, 
  Clock, 
  Sliders, 
  RotateCcw,
  Film,
  Columns
} from 'lucide-react';
import { AppLanguage, AppTheme, CompareMode } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { THEMES } from '../utils/theme';

interface VideoPlaybackBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number; // 0 to shortestDuration
  shortestDuration: number;
  onSeekStart?: () => void;
  onSeek: (time: number) => void;
  onSeekEnd?: (time?: number) => void;
  isLooping: boolean;
  onToggleLoop: () => void;
  playbackRate: number;
  onChangePlaybackRate: (rate: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  activeAudioSide?: 'A' | 'B';
  onToggleAudioSide?: () => void;
  onStepFrame: (direction: 'prev' | 'next') => void;
  durationA: number;
  durationB: number;
  longerSide: 'A' | 'B' | null;
  maxOffset: number;
  startOffset: number;
  onChangeStartOffset: (offset: number) => void;
  mode: CompareMode;
  onSelectMode: (mode: CompareMode) => void;
  language: AppLanguage;
  theme: AppTheme;
}

export const VideoPlaybackBar: React.FC<VideoPlaybackBarProps> = ({
  isPlaying,
  onTogglePlay,
  currentTime,
  shortestDuration,
  onSeekStart,
  onSeek,
  onSeekEnd,
  isLooping,
  onToggleLoop,
  playbackRate,
  onChangePlaybackRate,
  isMuted,
  onToggleMute,
  activeAudioSide = 'A',
  onToggleAudioSide,
  onStepFrame,
  durationA,
  durationB,
  longerSide,
  maxOffset,
  startOffset,
  onChangeStartOffset,
  mode,
  onSelectMode,
  language,
  theme,
}) => {
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [localScrubTime, setLocalScrubTime] = useState<number | null>(null);

  const t = TRANSLATIONS[language];
  const themeStyles = THEMES[theme];

  const displayTime = isDragging && localScrubTime !== null ? localScrubTime : currentTime;

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00.00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  const progressPercent = shortestDuration > 0 ? Math.min(100, Math.max(0, (displayTime / shortestDuration) * 100)) : 0;
  const speeds = [0.25, 0.5, 1.0, 1.5, 2.0];

  const handlePointerDown = () => {
    setIsDragging(true);
    setLocalScrubTime(currentTime);
    onSeekStart?.();
  };

  const handlePointerUp = () => {
    const finalVal = localScrubTime !== null ? localScrubTime : currentTime;
    setIsDragging(false);
    setLocalScrubTime(null);
    onSeekEnd?.(finalVal);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setLocalScrubTime(val);
    onSeek(val);
  };

  return (
    <div className={`w-full ${themeStyles.panel} border-t ${themeStyles.border} px-3 py-2 shrink-0 z-30 select-none shadow-lg transition-all`}>
      {/* 1. Main Scrubber & Timeline Row */}
      <div className="flex items-center gap-3 mb-1.5">
        {/* Current Time Display */}
        <div className="flex items-center gap-1 font-mono text-[11px] font-bold shrink-0">
          <span className={themeStyles.textPrimary}>
            {formatTime(displayTime)}
          </span>
          <span className={themeStyles.textSecondary}>/</span>
          <span className="text-blue-400">
            {formatTime(shortestDuration)}
          </span>
        </div>

        {/* Scrubber Range Input */}
        <div className="relative flex-1 flex items-center group/scrubber h-5 cursor-pointer">
          {/* Track background */}
          <div className={`w-full h-1.5 rounded-full ${themeStyles.panelSub} overflow-hidden relative`}>
            <div 
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* HTML range input for seamless drag and click */}
          <input
            type="range"
            min={0}
            max={shortestDuration || 1}
            step={0.001}
            value={displayTime || 0}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onTouchStart={handlePointerDown}
            onTouchEnd={handlePointerUp}
            onChange={handleChange}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full z-10"
            title={language === 'ru' ? 'Перемотка видео' : 'Seek video'}
          />

          {/* Scrubber thumb handle */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-md pointer-events-none border border-black/20 group-hover/scrubber:scale-125 transition-transform"
            style={{ left: `calc(${progressPercent}% - 7px)` }}
          />
        </div>

        {/* Shortest duration badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/30 text-[10px] font-mono font-semibold text-blue-400 shrink-0">
          <Film className="w-3 h-3" />
          <span>
            {language === 'ru' ? 'Цикл по короткому:' : 'Loop length:'} {shortestDuration.toFixed(2)}s
          </span>
        </div>

        {/* Quick jump to Side by Side if in another mode */}
        {mode !== 'side-by-side' && (
          <button
            onClick={() => onSelectMode('side-by-side')}
            className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${themeStyles.buttonDefault} text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 transition-colors`}
            title={language === 'ru' ? 'Переключить в режим Бок-о-бок' : 'Switch to Side-by-Side mode'}
          >
            <Columns className="w-3 h-3" />
            <span>{language === 'ru' ? 'Бок-о-бок' : 'Side-by-Side'}</span>
          </button>
        )}
      </div>

      {/* 2. Controls Row: Play/Pause, Step, Loop, Speed, Audio, and Offset */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Playback controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Main Synced Play/Pause button */}
          <button
            onClick={onTogglePlay}
            title={isPlaying 
              ? (language === 'ru' ? 'Пауза (Пробел / K)' : 'Pause (Space / K)') 
              : (language === 'ru' ? 'Синхронный запуск (Пробел / K)' : 'Synchronous Play (Space / K)')}
            className={`flex items-center justify-center w-8 h-8 rounded-lg font-bold shadow-md transition-all ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/20'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Frame Step Backward (-1 frame / -0.05s) */}
          <button
            onClick={() => onStepFrame('prev')}
            title={language === 'ru' ? 'Кадр назад (,)' : 'Frame backward (,)'}
            className={`p-1.5 rounded-md ${themeStyles.buttonDefault} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} transition-colors`}
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          {/* Frame Step Forward (+1 frame / +0.05s) */}
          <button
            onClick={() => onStepFrame('next')}
            title={language === 'ru' ? 'Кадр вперед (.)' : 'Frame forward (.)'}
            className={`p-1.5 rounded-md ${themeStyles.buttonDefault} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} transition-colors`}
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          {/* Loop toggle (Default: ON) */}
          <button
            onClick={onToggleLoop}
            title={isLooping 
              ? (language === 'ru' ? 'Зацикливание включено (по умолчанию)' : 'Looping enabled (default)') 
              : (language === 'ru' ? 'Зацикливание выключено' : 'Looping disabled')}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold border transition-colors ${
              isLooping
                ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-sm'
                : `${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textMuted} hover:${themeStyles.textPrimary}`
            }`}
          >
            <Repeat className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {language === 'ru' ? 'Цикл' : 'Loop'}
            </span>
          </button>

          {/* Playback speed selector */}
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              title={language === 'ru' ? 'Скорость воспроизведения' : 'Playback speed'}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-mono font-semibold border ${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} transition-colors`}
            >
              <Clock className="w-3 h-3 text-zinc-400" />
              <span>{playbackRate}x</span>
            </button>

            {showSpeedMenu && (
              <div 
                className={`absolute bottom-full left-0 mb-1 z-40 ${themeStyles.modalCard} border ${themeStyles.border} rounded-lg shadow-xl py-1 min-w-[70px] backdrop-blur`}
                onMouseLeave={() => setShowSpeedMenu(false)}
              >
                {speeds.map((rate) => (
                  <button
                    key={rate}
                    onClick={() => {
                      onChangePlaybackRate(rate);
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1 text-[11px] font-mono transition-colors flex items-center justify-between ${
                      playbackRate === rate
                        ? 'text-blue-400 font-bold bg-blue-500/10'
                        : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:bg-white/5`
                    }`}
                  >
                    <span>{rate}x</span>
                    {playbackRate === rate && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mute / Audio Source Toggle */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleMute}
              title={isMuted 
                ? (language === 'ru' ? 'Включить звук' : 'Unmute audio') 
                : (language === 'ru' ? 'Выключить звук' : 'Mute audio')}
              className={`p-1.5 rounded-md ${themeStyles.buttonDefault} ${
                isMuted ? themeStyles.textSecondary : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              } transition-colors`}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            {!isMuted && onToggleAudioSide && (
              <button
                onClick={onToggleAudioSide}
                title={language === 'ru' 
                  ? `Звук из Слота ${activeAudioSide}. Нажмите, чтобы переключить на ${activeAudioSide === 'A' ? 'B' : 'A'}` 
                  : `Audio from Slot ${activeAudioSide}. Click to switch to ${activeAudioSide === 'A' ? 'B' : 'A'}`}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                  activeAudioSide === 'A'
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                }`}
              >
                {activeAudioSide}
              </button>
            )}
          </div>
        </div>

        {/* Right: Start Offset for Longer Video (Strict user constraint!) */}
        {longerSide && maxOffset > 0.05 && (
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg border ${
            longerSide === 'A' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <div className="flex items-center gap-1 shrink-0">
              <Sliders className="w-3.5 h-3.5 text-zinc-400" />
              <span className={`text-[11px] font-bold ${
                longerSide === 'A' ? 'text-blue-400' : 'text-emerald-400'
              }`}>
                {language === 'ru' 
                  ? `Смещение старта (Слот ${longerSide}):` 
                  : `Start offset (Slot ${longerSide}):`}
              </span>
            </div>

            {/* Range slider for offset */}
            <div className="flex items-center gap-1.5">
              <input
                type="range"
                min={0}
                max={maxOffset}
                step={0.01}
                value={startOffset}
                onChange={(e) => onChangeStartOffset(parseFloat(e.target.value))}
                className="w-20 sm:w-28 accent-blue-500 cursor-pointer h-1.5 rounded-lg"
                title={language === 'ru'
                  ? `Смещение старта более длинного ролика от 0.00с до ${maxOffset.toFixed(2)}с. Длина зацикленного фрагмента остается ровно ${shortestDuration.toFixed(2)}с.`
                  : `Start offset for longer video from 0.00s to ${maxOffset.toFixed(2)}s. The looped slice length remains exactly ${shortestDuration.toFixed(2)}s.`}
              />
              <span className="font-mono text-[11px] font-bold w-12 text-right">
                +{startOffset.toFixed(2)}s
              </span>

              {startOffset > 0 && (
                <button
                  onClick={() => onChangeStartOffset(0)}
                  title={language === 'ru' ? 'Сбросить смещение на 0.00с' : 'Reset offset to 0.00s'}
                  className={`p-0.5 rounded text-zinc-400 hover:text-zinc-200 transition-colors`}
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>

            <span className="hidden lg:inline text-[10px] text-zinc-400 font-mono">
              (макс: +{maxOffset.toFixed(2)}s)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
