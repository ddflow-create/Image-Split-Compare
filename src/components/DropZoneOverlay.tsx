import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles } from 'lucide-react';
import { AppLanguage, AppTheme } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { THEMES } from '../utils/theme';

interface DropZoneOverlayProps {
  isDraggingOver: boolean;
  onDropFiles: (files: FileList | File[], targetSide?: 'A' | 'B' | 'both') => void;
  onCancelDrag: () => void;
  language: AppLanguage;
  theme: AppTheme;
}

export const DropZoneOverlay: React.FC<DropZoneOverlayProps> = ({
  isDraggingOver,
  onDropFiles,
  onCancelDrag,
  language,
  theme,
}) => {
  const [hoveredSide, setHoveredSide] = useState<'A' | 'B' | 'both' | null>(null);

  if (!isDraggingOver) return null;

  const t = TRANSLATIONS[language];
  const themeStyles = THEMES[theme];

  const handleGlobalDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (hoveredSide === 'A') {
        onDropFiles(e.dataTransfer.files, 'A');
      } else if (hoveredSide === 'B') {
        onDropFiles(e.dataTransfer.files, 'B');
      } else {
        onDropFiles(e.dataTransfer.files, 'both');
      }
    }
    onCancelDrag();
  };

  return (
    <div
      className={`fixed inset-0 z-50 ${themeStyles.modalBackdrop} flex p-6 gap-6 items-stretch justify-center animate-in fade-in duration-150 select-none`}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.currentTarget === e.target) {
          setHoveredSide(null);
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) {
          e.dataTransfer.dropEffect = 'copy';
        }
        if (e.currentTarget === e.target && hoveredSide !== null) {
          setHoveredSide(null);
        }
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Check if we actually left the overlay (and not just entered a child element)
        const relatedTarget = e.relatedTarget as Node | null;
        if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
          onCancelDrag();
        }
      }}
      onDrop={handleGlobalDrop}
    >
      {/* Target Zone A (Left) */}
      <div
        className={`flex-1 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer ${
          hoveredSide === 'A'
            ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30 shadow-2xl scale-[1.01]'
            : `${themeStyles.border} ${themeStyles.panelCard} hover:border-blue-500/50`
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setHoveredSide('A');
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
          setHoveredSide('A');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            if (e.dataTransfer.files.length > 1) {
              onDropFiles(e.dataTransfer.files, 'both');
            } else {
              onDropFiles(e.dataTransfer.files, 'A');
            }
          }
          onCancelDrag();
        }}
      >
        <div className="pointer-events-none flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 mb-4 shadow-lg">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-500 border border-blue-500/30 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
            {t.history.sourceA}
          </div>
          <h3 className={`text-lg font-bold ${themeStyles.textPrimary} mb-1`}>
            {t.emptyState.chooseSlotA}
          </h3>
          <p className={`text-xs ${themeStyles.textSecondary} max-w-[240px]`}>
            {t.history.dragDropHere}
          </p>
        </div>
      </div>

      {/* Target Zone B (Right) */}
      <div
        className={`flex-1 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer ${
          hoveredSide === 'B'
            ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30 shadow-2xl scale-[1.01]'
            : `${themeStyles.border} ${themeStyles.panelCard} hover:border-emerald-500/50`
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setHoveredSide('B');
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
          setHoveredSide('B');
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            if (e.dataTransfer.files.length > 1) {
              onDropFiles(e.dataTransfer.files, 'both');
            } else {
              onDropFiles(e.dataTransfer.files, 'B');
            }
          }
          onCancelDrag();
        }}
      >
        <div className="pointer-events-none flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-4 shadow-lg">
            <UploadCloud className="w-8 h-8" />
          </div>
          <div className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 text-xs font-mono font-bold mb-3 uppercase tracking-wider">
            {t.history.sourceB}
          </div>
          <h3 className={`text-lg font-bold ${themeStyles.textPrimary} mb-1`}>
            {t.emptyState.chooseSlotB}
          </h3>
          <p className={`text-xs ${themeStyles.textSecondary} max-w-[240px]`}>
            {t.history.dragDropHere}
          </p>
        </div>
      </div>
    </div>
  );
};
