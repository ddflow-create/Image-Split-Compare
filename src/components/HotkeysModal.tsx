import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { AppLanguage, AppTheme } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { THEMES } from '../utils/theme';

interface HotkeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  theme: AppTheme;
}

export const HotkeysModal: React.FC<HotkeysModalProps> = ({ 
  isOpen, 
  onClose,
  language,
  theme,
}) => {
  if (!isOpen) return null;

  const t = TRANSLATIONS[language];
  const themeStyles = THEMES[theme];

  const hotkeyGroups = [
    {
      category: t.hotkeys.groupNavigation,
      items: [
        { keys: ['Wheel'], desc: t.hotkeys.wheelZoom },
        { keys: ['RMB + Drag'], desc: t.hotkeys.rmbPan },
        { keys: ['Space + Drag'], desc: t.hotkeys.spacePan },
        { keys: ['+', '='], desc: t.hotkeys.plusZoom },
        { keys: ['-'], desc: t.hotkeys.minusZoom },
        { keys: ['0', 'R'], desc: t.hotkeys.resetZoom },
        { keys: ['N'], desc: t.hotkeys.nativeZoom },
      ],
    },
    {
      category: t.hotkeys.groupModes,
      items: [
        { keys: ['Space'], desc: t.hotkeys.spacePeep },
        { keys: ['S'], desc: t.hotkeys.toggleSidebarsKey },
        { keys: ['X'], desc: t.hotkeys.swapKey },
        { keys: ['M', 'Tab'], desc: t.hotkeys.cycleModeKey },
        { keys: ['D'], desc: t.hotkeys.diffKey },
        { keys: ['L'], desc: t.hotkeys.syncKey },
        { keys: ['C'], desc: t.hotkeys.checkerboardKey },
        { keys: ['F'], desc: t.hotkeys.fullscreenKey },
      ],
    },
    {
      category: t.hotkeys.groupFiles,
      items: [
        { keys: ['Drag & Drop'], desc: t.hotkeys.dropDesc },
        { keys: ['Ctrl + V'], desc: t.hotkeys.pasteDesc },
        { keys: ['H', '?'], desc: t.hotkeys.helpKey },
        { keys: ['Esc'], desc: t.hotkeys.escKey },
      ],
    },
  ];

  return (
    <div className={`fixed inset-0 z-50 ${themeStyles.modalBackdrop} flex items-center justify-center p-4 select-none animate-in fade-in duration-150`}>
      <div 
        className={`${themeStyles.modalCard} rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-1.5 rounded-lg ${themeStyles.buttonDefault} transition-colors`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-lg font-bold ${themeStyles.textPrimary} tracking-tight`}>
              {t.hotkeys.title}
            </h2>
            <p className={`text-xs ${themeStyles.textSecondary}`}>
              {t.hotkeys.subtitle}
            </p>
          </div>
        </div>

        {/* Groups */}
        <div className="space-y-5">
          {hotkeyGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="text-xs uppercase font-bold tracking-wider text-blue-500 mb-2 px-1">
                {group.category}
              </h3>
              <div className={`space-y-1 ${themeStyles.panelSub} rounded-xl p-2 border ${themeStyles.border}`}>
                {group.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    className={`flex items-center justify-between p-2 rounded-lg ${themeStyles.panelCard} transition-colors`}
                  >
                    <span className={`text-xs ${themeStyles.textPrimary} font-medium`}>
                      {item.desc}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0 ml-3">
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          className={`px-2 py-1 text-[11px] font-mono font-bold ${themeStyles.textPrimary} ${themeStyles.panelSub} border ${themeStyles.border} rounded-md shadow-sm`}
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
