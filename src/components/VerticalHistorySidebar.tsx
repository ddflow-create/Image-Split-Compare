import React, { useRef, useState } from 'react';
import { 
  Upload, 
  Trash2, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Check, 
  Layers, 
  Plus
} from 'lucide-react';
import { ImageItem, AppLanguage, AppTheme } from '../types';
import { TRANSLATIONS } from '../utils/i18n';
import { THEMES } from '../utils/theme';
import { formatBytes } from '../utils/imageUtils';

interface VerticalHistorySidebarProps {
  side: 'A' | 'B';
  currentImage: ImageItem | null;
  history: ImageItem[];
  onSelectImage: (item: ImageItem) => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearHistory: () => void;
  onDeleteImage: (id: string, e: React.MouseEvent) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  width?: number;
  onResizeStart?: (e: React.MouseEvent) => void;
  isMobileBottomView?: boolean;
  language: AppLanguage;
  theme: AppTheme;
}

export const VerticalHistorySidebar: React.FC<VerticalHistorySidebarProps> = ({
  side,
  currentImage,
  history,
  onSelectImage,
  onUploadFile,
  onClearHistory,
  onDeleteImage,
  isCollapsed,
  onToggleCollapse,
  width = 200,
  onResizeStart,
  isMobileBottomView = false,
  language,
  theme,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const t = TRANSLATIONS[language];
  const themeStyles = THEMES[theme];

  const isSlotA = side === 'A';
  const accentColor = isSlotA ? 'text-blue-400' : 'text-emerald-400';
  const badgeBg = isSlotA ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
  const activeRing = isSlotA 
    ? 'ring-2 ring-blue-500 border-blue-500 shadow-md shadow-blue-500/10' 
    : 'ring-2 ring-emerald-500 border-emerald-500 shadow-md shadow-emerald-500/10';

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const fakeEvent = {
        target: {
          files: [file]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      onUploadFile(fakeEvent);
    }
  };

  // Mobile bottom dual-column layout (когда экран вертикальный/смартфон)
  if (isMobileBottomView) {
    return (
      <div 
        className={`flex-1 h-full ${themeStyles.panel} flex flex-col select-none overflow-hidden ${
          isSlotA ? `border-r ${themeStyles.border}` : ''
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        {/* Mobile Header */}
        <div className={`p-2 border-b ${themeStyles.border} flex items-center justify-between shrink-0`}>
          <div className="flex items-center gap-1.5 min-w-0">
            <div className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-mono border ${badgeBg}`}>
              {side}
            </div>
            <span className={`text-xs font-bold ${themeStyles.textPrimary} truncate`}>
              {isSlotA ? t.history.sourceA : t.history.sourceB}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              title={t.history.uploadTooltip}
              className={`p-1 rounded-md bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 ${accentColor} transition-colors`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUploadFile}
            />
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                title={t.history.clearTooltip}
                className={`p-1 rounded-md ${themeStyles.textSecondary} hover:text-red-400 transition-colors`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Vertical scroll list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {history.length === 0 ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`p-3 rounded-lg border border-dashed ${themeStyles.border} flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500`}
            >
              <Upload className="w-4 h-4 opacity-50 mb-1" />
              <span className={`text-[10px] ${themeStyles.textSecondary}`}>
                {t.history.upload}
              </span>
            </div>
          ) : (
            history.map((item) => {
              const isActive = currentImage?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectImage(item)}
                  className={`group relative rounded-lg border p-1.5 cursor-pointer transition-all ${
                    isActive
                      ? `${activeRing} ${themeStyles.panelCardActive}`
                      : `${themeStyles.panelCard}`
                  }`}
                >
                  <div className={`relative w-full h-16 rounded overflow-hidden ${themeStyles.canvas} ${themeStyles.checkeredClass} flex items-center justify-center border ${themeStyles.border}`}>
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-contain pointer-events-none"
                      loading="lazy"
                    />
                    {isActive && (
                      <div className="absolute top-1 left-1 px-1 py-0.2 rounded bg-blue-600 text-white text-[8px] font-bold shadow flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                    <button
                      onClick={(e) => onDeleteImage(item.id, e)}
                      className="absolute bottom-1 right-1 p-1 rounded bg-black/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all shadow"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                    </button>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[9px] font-mono">
                    <span className={`truncate max-w-[80px] font-semibold ${isActive ? (isSlotA ? 'text-blue-400' : 'text-emerald-400') : themeStyles.textPrimary}`}>
                      {item.name}
                    </span>
                    <span className={themeStyles.textSecondary}>
                      {item.width}×{item.height}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // Desktop Collapsed Sidebar
  if (isCollapsed) {
    return (
      <aside 
        className={`w-11 shrink-0 ${themeStyles.panel} border-y-0 ${
          isSlotA ? 'border-r border-l-0' : 'border-l border-r-0'
        } flex flex-col items-center py-3 select-none transition-all z-20`}
      >
        <button
          onClick={onToggleCollapse}
          title={t.history.expandSidebar}
          className={`p-1.5 rounded-lg ${themeStyles.buttonDefault} mb-3`}
        >
          {isSlotA ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={`p-1 rounded-md text-[11px] font-bold ${badgeBg} mb-4`}>
          {side}
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          title={t.history.uploadTooltip}
          className={`p-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 ${accentColor} mb-4 transition-colors`}
        >
          <Plus className="w-4 h-4" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUploadFile}
        />

        <div className="mt-auto flex flex-col items-center gap-1 text-[10px] text-zinc-500">
          <Layers className="w-3.5 h-3.5" />
          <span>{history.length}</span>
        </div>
      </aside>
    );
  }

  // Desktop Resizable Sidebar (с ручкой ресайза и лимитом не более 25% ширины экрана)
  return (
    <aside 
      style={{ width: `${width}px` }}
      className={`relative shrink-0 ${themeStyles.panel} border-y-0 ${
        isSlotA ? 'border-r border-l-0' : 'border-l border-r-0'
      } flex flex-col select-none z-20 overflow-hidden group/sidebar`}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      {/* Resizer Handle Bar */}
      {onResizeStart && (
        <div
          onMouseDown={onResizeStart}
          title={language === 'ru' ? 'Потяните для изменения ширины (макс. 25%)' : 'Drag to resize (max 25%)'}
          className={`absolute top-0 bottom-0 ${
            isSlotA ? 'right-0 cursor-ew-resize' : 'left-0 cursor-ew-resize'
          } w-2 z-30 hover:bg-blue-500/40 active:bg-blue-500/80 transition-colors flex items-center justify-center`}
        >
          <div className="w-[1px] h-8 bg-zinc-500/40 group-hover/sidebar:bg-blue-500/70" />
        </div>
      )}

      {/* Sidebar Header */}
      <div className={`p-2.5 border-b ${themeStyles.border} flex items-center justify-between gap-1.5 shrink-0`}>
        <div className="flex items-center gap-1.5 min-w-0">
          <div className={`px-1.5 py-0.5 rounded text-xs font-bold font-mono border ${badgeBg}`}>
            {side}
          </div>
          <div className="min-w-0">
            <h3 className={`text-xs font-bold ${themeStyles.textPrimary} truncate tracking-tight`}>
              {isSlotA ? t.history.sourceA : t.history.sourceB}
            </h3>
            <span className={`text-[10px] ${themeStyles.textSecondary}`}>
              {history.length} {language === 'ru' ? 'кадров' : 'shots'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              title={t.history.clearTooltip}
              className={`p-1 rounded-md ${themeStyles.textSecondary} hover:text-red-400 hover:bg-red-500/10 transition-colors`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onToggleCollapse}
            title={t.history.collapseSidebar}
            className={`p-1 rounded-md ${themeStyles.buttonDefault} transition-colors`}
          >
            {isSlotA ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Upload button area */}
      <div className="p-2.5 shrink-0">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onUploadFile}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`w-full flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl border border-dashed transition-all ${
            isDragOver
              ? 'border-blue-500 bg-blue-500/10 text-blue-400 scale-[1.01]'
              : isSlotA
              ? 'border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 hover:border-blue-500'
              : 'border-emerald-500/40 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 hover:border-emerald-500'
          }`}
        >
          <Upload className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[11px] font-semibold truncate">
            {t.history.upload} {side}
          </span>
        </button>
      </div>

      {/* Thumbnails vertical list */}
      <div className="flex-1 overflow-y-auto px-2.5 pb-2.5 space-y-2.5">
        {history.length === 0 ? (
          <div className={`p-4 rounded-xl border border-dashed ${themeStyles.border} flex flex-col items-center justify-center text-center mt-2`}>
            <div className={`w-8 h-8 rounded-lg ${themeStyles.panelSub} flex items-center justify-center ${themeStyles.textSecondary} mb-2`}>
              <ImageIcon className="w-4 h-4 opacity-60" />
            </div>
            <p className={`text-xs font-semibold ${themeStyles.textPrimary} mb-0.5`}>
              {t.history.noImages}
            </p>
            <p className={`text-[10px] ${themeStyles.textSecondary} max-w-[140px]`}>
              {t.history.dragDropHere}
            </p>
          </div>
        ) : (
          history.map((item) => {
            const isActive = currentImage?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectImage(item)}
                className={`group relative rounded-xl border p-1.5 cursor-pointer transition-all ${
                  isActive
                    ? `${activeRing} ${themeStyles.panelCardActive}`
                    : `${themeStyles.panelCard}`
                }`}
              >
                {/* Large Thumbnail Image */}
                <div className={`relative w-full h-24 rounded-lg overflow-hidden ${themeStyles.canvas} ${themeStyles.checkeredClass} flex items-center justify-center border ${themeStyles.border}`}>
                  <img
                    src={item.url}
                    alt={item.name}
                    className="w-full h-full object-contain pointer-events-none"
                    loading="lazy"
                  />
                  {isActive && (
                    <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold shadow-md flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>{t.history.currentActive}</span>
                    </div>
                  )}

                  <div className="absolute top-1.5 right-1.5 px-1 py-0.5 rounded bg-black/70 backdrop-blur-sm text-white font-mono text-[9px] font-semibold">
                    {item.format}
                  </div>

                  <button
                    onClick={(e) => onDeleteImage(item.id, e)}
                    title={t.history.deleteTooltip}
                    className="absolute bottom-1.5 right-1.5 p-1 rounded bg-black/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {/* Details info */}
                <div className="mt-1.5 space-y-0.5">
                  <div className={`text-[11px] font-semibold ${isActive ? (isSlotA ? 'text-blue-500' : 'text-emerald-500') : themeStyles.textPrimary} truncate`} title={item.name}>
                    {item.name}
                  </div>
                  <div className={`flex items-center justify-between text-[9px] ${themeStyles.textSecondary} font-mono`}>
                    <span>{item.width} × {item.height}</span>
                    {item.size && <span>{formatBytes(item.size)}</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
