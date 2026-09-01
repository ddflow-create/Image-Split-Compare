import React from 'react';
import { X, Settings, Globe, Palette, Check, Moon, Sun, Sliders } from 'lucide-react';
import { AppLanguage, AppTheme } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { THEMES } from '../utils/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onChangeLanguage: (lang: AppLanguage) => void;
  theme: AppTheme;
  onChangeTheme: (theme: AppTheme) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onChangeLanguage,
  theme,
  onChangeTheme,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language];
  const themeStyles = THEMES[theme];

  const languages: { id: AppLanguage; label: string; flag: string; nativeName: string }[] = [
    { id: 'ru', label: 'Русский', flag: '🇷🇺', nativeName: 'Русский (RU)' },
    { id: 'en', label: 'English', flag: '🇺🇸', nativeName: 'English (US)' },
  ];

  const themeOptions: { id: AppTheme; icon: React.ReactNode; previewBg: string; previewAccent: string }[] = [
    {
      id: 'dark',
      icon: <Moon className="w-4 h-4 text-blue-400" />,
      previewBg: 'bg-[#0A0A0A] border-[#2A2A2A]',
      previewAccent: 'bg-blue-600',
    },
    {
      id: 'silver',
      icon: <Sliders className="w-4 h-4 text-blue-300" />,
      previewBg: 'bg-[#1C2026] border-[#384150]',
      previewAccent: 'bg-blue-500',
    },
    {
      id: 'light',
      icon: <Sun className="w-4 h-4 text-amber-500" />,
      previewBg: 'bg-[#F4F5F7] border-[#DCE0E6]',
      previewAccent: 'bg-blue-600',
    },
  ];

  return (
    <div 
      className={`fixed inset-0 z-50 ${themeStyles.modalBg} backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-150`}
      onClick={onClose}
    >
      <div 
        className={`${themeStyles.modalCard} rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-1.5 rounded-lg ${themeStyles.textSecondary} hover:${themeStyles.textPrimary} hover:bg-black/10 dark:hover:bg-white/10 transition-colors`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-lg font-bold ${themeStyles.textPrimary} tracking-tight`}>
              {t.settingsModal.title}
            </h2>
            <p className={`text-xs ${themeStyles.textSecondary}`}>
              {t.settingsModal.subtitle}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Language Selector */}
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <Globe className="w-4 h-4 text-blue-400" />
              <h3 className={`text-xs uppercase font-bold tracking-wider ${themeStyles.textPrimary}`}>
                {t.settingsModal.language}
              </h3>
            </div>
            <p className={`text-xs ${themeStyles.textSecondary} mb-3 px-1`}>
              {t.settingsModal.languageDesc}
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {languages.map((lang) => {
                const isSelected = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    onClick={() => onChangeLanguage(lang.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `${themeStyles.panelCardActive} shadow-sm`
                        : `${themeStyles.panelCard}`
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{lang.flag}</span>
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-blue-500 font-bold' : themeStyles.textPrimary}`}>
                          {lang.label}
                        </div>
                        <div className={`text-[11px] ${themeStyles.textMuted}`}>
                          {lang.nativeName}
                        </div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <Palette className="w-4 h-4 text-blue-400" />
              <h3 className={`text-xs uppercase font-bold tracking-wider ${themeStyles.textPrimary}`}>
                {t.settingsModal.theme}
              </h3>
            </div>
            <p className={`text-xs ${themeStyles.textSecondary} mb-3 px-1`}>
              {t.settingsModal.themeDesc}
            </p>

            <div className="space-y-2.5">
              {themeOptions.map((th) => {
                const isSelected = theme === th.id;
                const info = t.settingsModal.themes[th.id];
                return (
                  <button
                    key={th.id}
                    onClick={() => onChangeTheme(th.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? `${themeStyles.panelCardActive} shadow-sm`
                        : `${themeStyles.panelCard}`
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${th.previewBg}`}>
                        {th.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isSelected ? 'text-blue-500' : themeStyles.textPrimary}`}>
                            {info.name}
                          </span>
                          {isSelected && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-semibold border border-blue-500/20">
                              Active
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] ${themeStyles.textSecondary} mt-0.5 max-w-sm`}>
                          {info.desc}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${th.previewAccent}`} />
                      {isSelected && <Check className="w-4 h-4 text-blue-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-6 pt-4 border-t ${themeStyles.border} flex justify-end`}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            {t.settingsModal.close}
          </button>
        </div>
      </div>
    </div>
  );
};
