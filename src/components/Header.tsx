import React, { useState } from 'react';
import { 
  Columns, 
  SplitSquareVertical, 
  Rows, 
  Layers, 
  SlidersHorizontal, 
  Flame, 
  Maximize, 
  Minimize, 
  HelpCircle, 
  Monitor, 
  Sparkles,
  Settings,
  MoreVertical,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { CompareMode, AppLanguage, AppTheme } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { THEMES } from '../utils/theme';
import { SAMPLE_PAIRS, SamplePair } from '../data/sampleImages';

interface HeaderProps {
  mode: CompareMode;
  onSelectMode: (mode: CompareMode) => void;
  onLoadSample: (sample: SamplePair) => void;
  onOpenHotkeys: () => void;
  onOpenWindowsModal: () => void;
  onOpenSettings: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  areSidebarsCollapsed?: boolean;
  onToggleSidebars?: () => void;
  language: AppLanguage;
  theme: AppTheme;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onSelectMode,
  onLoadSample,
  onOpenHotkeys,
  onOpenWindowsModal,
  onOpenSettings,
  isFullscreen,
  onToggleFullscreen,
  areSidebarsCollapsed = false,
  onToggleSidebars,
  language,
  theme,
}) => {
  const [showSamplesMenu, setShowSamplesMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const t = TRANSLATIONS[language];
  const themeStyles = THEMES[theme];

  const modes: { id: CompareMode; icon: React.ReactNode }[] = [
    { id: 'slider', icon: <SplitSquareVertical className="w-3.5 h-3.5" /> },
    { id: 'side-by-side', icon: <Columns className="w-3.5 h-3.5" /> },
    { id: 'side-vertical', icon: <Rows className="w-3.5 h-3.5" /> },
    { id: 'difference', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'onion', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'toggle', icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className={`h-14 ${themeStyles.panel} border-b ${themeStyles.border} px-3 md:px-4 flex items-center justify-between gap-2 md:gap-3 shrink-0 z-30 select-none relative`}>
      {/* Brand & Sidebar Toggle */}
      <div className="flex items-center gap-2 md:gap-2.5 min-w-fit shrink-0">
        {onToggleSidebars && (
          <button
            onClick={onToggleSidebars}
            title={areSidebarsCollapsed 
              ? (language === 'ru' ? 'Раскрыть боковые панели (S)' : 'Expand sidebars (S)')
              : (language === 'ru' ? 'Свернуть боковые панели (S)' : 'Collapse sidebars (S)')}
            className={`p-1.5 rounded-lg border transition-colors ${
              areSidebarsCollapsed
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-400 font-bold'
                : `${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary}`
            }`}
          >
            {areSidebarsCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        )}

        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg overflow-hidden border ${themeStyles.border} ${themeStyles.panelSub} flex items-center justify-center shadow-sm shrink-0`}>
          <img src="/favicon.svg" alt="SplitCompare" className="w-full h-full object-cover" />
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className={`font-bold text-sm md:text-base tracking-tight ${themeStyles.textPrimary}`}>
            {t.appName}
          </span>
          <span className={`text-[9px] md:text-[10px] font-mono font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${themeStyles.panelSub} ${themeStyles.textMuted} border ${themeStyles.border}`}>
            {t.version}
          </span>
        </div>
      </div>

      {/* Comparison Modes Tabs (Scrollable on small screens) */}
      <div className={`flex items-center ${themeStyles.panelSub} p-0.5 md:p-1 rounded-xl border ${themeStyles.border} overflow-x-auto max-w-full shadow-inner scrollbar-none`}>
        {modes.map((m) => {
          const isActive = mode === m.id;
          const modeInfo = t.modes[m.id];
          return (
            <button
              key={m.id}
              onClick={() => onSelectMode(m.id)}
              title={modeInfo.tooltip}
              className={`flex items-center gap-1 md:gap-1.5 px-2 md:px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? `${themeStyles.buttonActive} shadow-sm font-semibold`
                  : `${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:bg-black/10 dark:hover:bg-white/10`
              }`}
            >
              {m.icon}
              <span className="hidden md:inline font-medium">{modeInfo.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Action Tools: Desktop actions + Mobile 3-Dots Menu */}
      <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
        {/* Sample Pairs Dropdown (Desktop & Tablet) */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowSamplesMenu(!showSamplesMenu)}
            title={t.header.samples}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:border-blue-500/40 text-xs font-medium transition-colors shadow-sm`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">{t.header.samples}</span>
          </button>

          {showSamplesMenu && (
            <div 
              className={`absolute right-0 top-full mt-1.5 w-72 ${themeStyles.modalCard} rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100`}
              onMouseLeave={() => setShowSamplesMenu(false)}
            >
              <div className={`text-[10px] font-bold ${themeStyles.textMuted} px-2 py-1 uppercase tracking-wider`}>
                {language === 'ru' ? 'Тестовые пары изображений' : 'Sample image pairs'}
              </div>
              <div className="space-y-1 mt-1">
                {SAMPLE_PAIRS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      onLoadSample(sample);
                      setShowSamplesMenu(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg ${themeStyles.panelSub} hover:bg-blue-500/10 border ${themeStyles.border} hover:border-blue-500/30 transition-colors group`}
                  >
                    <div className={`text-xs font-semibold ${themeStyles.textPrimary} group-hover:text-blue-500`}>
                      {sample.title}
                    </div>
                    <div className={`text-[11px] ${themeStyles.textSecondary} line-clamp-1 mt-0.5`}>
                      {sample.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Windows / Bat & Update Modal (Desktop) */}
        <button
          onClick={onOpenWindowsModal}
          title={t.header.windowsBat}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-xs font-medium shadow-sm"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">{t.header.windowsBat}</span>
        </button>

        {/* Hotkeys modal trigger (Desktop) */}
        <button
          onClick={onOpenHotkeys}
          title={t.header.shortcuts}
          className={`hidden sm:flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border ${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} transition-colors shadow-sm`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">{t.header.shortcuts}</span>
        </button>

        {/* Settings button (Desktop) */}
        <button
          onClick={onOpenSettings}
          title={t.header.settings}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:border-blue-500/40 text-xs font-medium transition-colors shadow-sm`}
        >
          <Settings className="w-3.5 h-3.5 text-blue-400" />
        </button>

        {/* Fullscreen toggle (Desktop) */}
        <button
          onClick={onToggleFullscreen}
          title={isFullscreen ? t.header.exitFullscreen : t.header.fullscreen}
          className={`hidden sm:flex p-1.5 rounded-lg border ${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} transition-colors shadow-sm`}
        >
          {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
        </button>

        {/* Mobile / Compact Three-Dots Menu Button */}
        <div className="relative sm:hidden">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            title={language === 'ru' ? 'Меню и опции' : 'Menu & options'}
            className={`p-1.5 rounded-lg border ${themeStyles.panelSub} ${themeStyles.border} ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} transition-colors`}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMobileMenu && (
            <div 
              className={`absolute right-0 top-full mt-2 w-60 ${themeStyles.modalCard} rounded-xl p-2 shadow-2xl z-50 border ${themeStyles.border} animate-in fade-in zoom-in-95 duration-100`}
            >
              <div className="space-y-1">
                {onToggleSidebars && (
                  <button
                    onClick={() => {
                      onToggleSidebars();
                      setShowMobileMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg ${themeStyles.panelSub} hover:bg-blue-500/10 border ${themeStyles.border} text-xs font-medium transition-colors`}
                  >
                    <span className="flex items-center gap-2">
                      <PanelLeft className="w-4 h-4 text-blue-400" />
                      <span>{language === 'ru' ? 'Боковые панели' : 'Sidebars'}</span>
                    </span>
                    <span className="font-mono text-[10px] text-zinc-400">(S)</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onOpenWindowsModal();
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg ${themeStyles.panelSub} hover:bg-blue-500/10 border ${themeStyles.border} text-xs font-medium transition-colors`}
                >
                  <Monitor className="w-4 h-4 text-blue-400" />
                  <span>{t.header.windowsBat}</span>
                </button>

                <button
                  onClick={() => {
                    onOpenHotkeys();
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg ${themeStyles.panelSub} hover:bg-blue-500/10 border ${themeStyles.border} text-xs font-medium transition-colors`}
                >
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span>{t.header.shortcuts}</span>
                </button>

                <button
                  onClick={() => {
                    onOpenSettings();
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg ${themeStyles.panelSub} hover:bg-blue-500/10 border ${themeStyles.border} text-xs font-medium transition-colors`}
                >
                  <Settings className="w-4 h-4 text-blue-400" />
                  <span>{t.header.settings}</span>
                </button>

                <button
                  onClick={() => {
                    onToggleFullscreen();
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg ${themeStyles.panelSub} hover:bg-blue-500/10 border ${themeStyles.border} text-xs font-medium transition-colors`}
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  <span>{isFullscreen ? t.header.exitFullscreen : t.header.fullscreen}</span>
                </button>

                {/* Samples inside mobile menu */}
                <div className={`pt-2 mt-1 border-t ${themeStyles.border}`}>
                  <div className={`text-[10px] font-bold ${themeStyles.textMuted} px-2 py-0.5 uppercase tracking-wider`}>
                    {t.header.samples}
                  </div>
                  <div className="space-y-1 mt-1">
                    {SAMPLE_PAIRS.slice(0, 3).map((sample) => (
                      <button
                        key={sample.id}
                        onClick={() => {
                          onLoadSample(sample);
                          setShowMobileMenu(false);
                        }}
                        className={`w-full text-left p-1.5 rounded ${themeStyles.panelSub} hover:bg-blue-500/10 text-[11px] font-medium transition-colors truncate block`}
                      >
                        {sample.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
