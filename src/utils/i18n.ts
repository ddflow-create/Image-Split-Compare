import { AppLanguage, CompareMode, AlignmentPreset, AppTheme } from '../types';

export interface Translations {
  appName: string;
  version: string;
  modes: Record<CompareMode, { label: string; tooltip: string }>;
  alignments: Record<AlignmentPreset, { label: string; short: string; arrow: string }>;
  header: {
    samples: string;
    shortcuts: string;
    windowsBat: string;
    settings: string;
    fullscreen: string;
    exitFullscreen: string;
  };
  toolbar: {
    zoom: string;
    zoomIn: string;
    zoomOut: string;
    fit: string;
    resetZoom: string;
    sync: string;
    syncOn: string;
    syncOff: string;
    swap: string;
    swapTooltip: string;
    alignment: string;
    alignTitle: string;
    checkerboard: string;
    checkerboardOn: string;
    checkerboardOff: string;
    pixelated: string;
    smooth: string;
    pixelatedTooltip: string;
    inspector: string;
    inspectorTooltip: string;
    differenceThreshold: string;
    invert: string;
    opacityA: string;
    opacityB: string;
    speedHz: string;
    autoBlink: string;
    stopBlink: string;
    toggleSlotA: string;
    toggleSlotB: string;
  };
  history: {
    sourceA: string;
    sourceB: string;
    historyA: string;
    historyB: string;
    upload: string;
    uploadTooltip: string;
    noImages: string;
    clear: string;
    clearTooltip: string;
    deleteTooltip: string;
    aspectMatch: string;
    aspectMismatch: string;
    collapseSidebar: string;
    expandSidebar: string;
    currentActive: string;
    dimensions: string;
    size: string;
    dragDropHere: string;
  };
  settingsModal: {
    title: string;
    subtitle: string;
    language: string;
    languageDesc: string;
    theme: string;
    themeDesc: string;
    themes: Record<AppTheme, { name: string; desc: string }>;
    close: string;
  };
  hotkeys: {
    title: string;
    subtitle: string;
    groupNavigation: string;
    groupModes: string;
    groupFiles: string;
    wheelZoom: string;
    rmbPan: string;
    spacePan: string;
    plusZoom: string;
    minusZoom: string;
    resetZoom: string;
    nativeZoom: string;
    spacePeep: string;
    toggleSidebarsKey: string;
    swapKey: string;
    cycleModeKey: string;
    diffKey: string;
    syncKey: string;
    checkerboardKey: string;
    fullscreenKey: string;
    dropDesc: string;
    pasteDesc: string;
    helpKey: string;
    escKey: string;
  };
  orientation: {
    autoRotate: string;
    locked: string;
    unlocked: string;
    lockTooltip: string;
    unlockTooltip: string;
    landscape: string;
    portrait: string;
  };
  windowsModal: {
    title: string;
    subtitle: string;
    tabBat: string;
    tabExe: string;
    tabUpdate: string;
    close: string;
  };
  dropzone: {
    leftTitle: string;
    rightTitle: string;
    leftDesc: string;
    rightDesc: string;
    formats: string;
  };
  statusBar: {
    zoom: string;
    coords: string;
    sourceA: string;
    sourceB: string;
    empty: string;
    hints: {
      pan: string;
      zoom: string;
      slider: string;
      space: string;
    };
  };
  inspector: {
    title: string;
    viewportCoords: string;
    imageCoords: string;
  };
  emptyState: {
    title: string;
    description: string;
    chooseSlotA: string;
    chooseSlotB: string;
    orDragDrop: string;
  };
  video: {
    play: string;
    pause: string;
    loop: string;
    loopOn: string;
    loopOff: string;
    speed: string;
    mute: string;
    unmute: string;
    stepPrev: string;
    stepNext: string;
    shortestLoop: string;
    startOffset: string;
    offsetDesc: string;
    resetOffset: string;
    maxOffset: string;
    sideBySide: string;
    audioSource: string;
    audioSlotA: string;
    audioSlotB: string;
    audioMuted: string;
    syncLocked: string;
    syncAdjusting: string;
  };
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  ru: {
    appName: 'SplitCompare',
    version: 'v1.3',
    modes: {
      slider: { label: 'Слайдер', tooltip: 'Ползунок наложения (шторка)' },
      'slider-horizontal': { label: 'Гориз. шторка', tooltip: 'Горизонтальный ползунок наложения' },
      'side-by-side': { label: 'Бок-о-бок', tooltip: 'Синхронное сравнение 2-Up (горизонтальное)' },
      'side-vertical': { label: 'Сверху/Снизу', tooltip: 'Вертикальное разделение 2-Up' },
      difference: { label: 'Разность', tooltip: 'Пиксельная разность (Difference blend)' },
      onion: { label: 'Наложение', tooltip: 'Плавное наложение прозрачности (Onion skin)' },
      toggle: { label: 'A/B Мигание', tooltip: 'Быстрое переключение A/B (Blink / Peep)' },
    },
    alignments: {
      'top-left': { label: 'Сверху-слева (↖)', short: 'Сверху-слева', arrow: '↖' },
      top: { label: 'Сверху (↑)', short: 'Сверху', arrow: '↑' },
      'top-right': { label: 'Сверху-справа (↗)', short: 'Сверху-справа', arrow: '↗' },
      left: { label: 'Слева (←)', short: 'Слева', arrow: '←' },
      center: { label: 'По центру (•)', short: 'По центру', arrow: '•' },
      right: { label: 'Справа (→)', short: 'Справа', arrow: '→' },
      'bottom-left': { label: 'Снизу-слева (↙)', short: 'Снизу-слева', arrow: '↙' },
      bottom: { label: 'Снизу (↓)', short: 'Снизу', arrow: '↓' },
      'bottom-right': { label: 'Снизу-справа (↘)', short: 'Снизу-справа', arrow: '↘' },
    },
    header: {
      samples: 'Примеры',
      shortcuts: 'Горячие клавиши',
      windowsBat: 'Windows / .BAT',
      settings: 'Настройки',
      fullscreen: 'Полноэкранный режим (F)',
      exitFullscreen: 'Выйти из полноэкранного режима (F)',
    },
    toolbar: {
      zoom: 'Масштаб',
      zoomIn: 'Увеличить (+ / Колесо мыши)',
      zoomOut: 'Уменьшить (- / Колесо мыши)',
      fit: 'Вписать (100%)',
      resetZoom: 'Сброс масштаба и позиции (0 / R)',
      sync: 'Синхронизация',
      syncOn: 'СИНХР ВКЛ (L)',
      syncOff: 'СИНХР ВЫКЛ (L)',
      swap: 'Поменять A ↔ B',
      swapTooltip: 'Поменять местами Изображение A и B (S)',
      alignment: 'Выравнивание',
      alignTitle: 'Выравнивание при разных пропорциях',
      checkerboard: 'Шахматка',
      checkerboardOn: 'Шахматный фон для прозрачности (C) — ВКЛ',
      checkerboardOff: 'Шахматный фон для прозрачности (C) — ВЫКЛ',
      pixelated: 'Pixelated',
      smooth: 'Smooth',
      pixelatedTooltip: 'Переключение режима сглаживания (Nearest Neighbor / Bilinear)',
      inspector: 'Инспектор',
      inspectorTooltip: 'Инспектор координат и пикселей курсора',
      differenceThreshold: 'Усиление разности',
      invert: 'Инверсия',
      opacityA: 'Прозрачность A',
      opacityB: 'Прозрачность B',
      speedHz: 'Гц',
      autoBlink: 'Авто-мигание',
      stopBlink: 'Остановить',
      toggleSlotA: 'Source A',
      toggleSlotB: 'Source B',
    },
    history: {
      sourceA: 'Source A',
      sourceB: 'Source B',
      historyA: 'История A',
      historyB: 'История B',
      upload: 'Загрузить',
      uploadTooltip: 'Загрузить новое изображение (JPEG, PNG, WebP)',
      noImages: 'Нет файлов в истории',
      clear: 'Очистить',
      clearTooltip: 'Очистить историю',
      deleteTooltip: 'Удалить из истории',
      aspectMatch: '1:1 Пропорции совпадают',
      aspectMismatch: 'Разные пропорции',
      collapseSidebar: 'Свернуть панель',
      expandSidebar: 'Развернуть панель',
      currentActive: 'Активное',
      dimensions: 'Разрешение',
      size: 'Размер',
      dragDropHere: 'Или перетащите файл сюда',
    },
    settingsModal: {
      title: 'Настройки приложения',
      subtitle: 'Персонализация языка интерфейса и цветовой темы',
      language: 'Язык интерфейса',
      languageDesc: 'Выберите язык отображения всех элементов',
      theme: 'Цветовая тема',
      themeDesc: 'Выберите визуальный стиль оформления рабочей среды',
      themes: {
        dark: {
          name: 'Тёмная (Dark)',
          desc: 'Глубокие графитовые и контрастные темные оттенки (#0A0A0A)',
        },
        silver: {
          name: 'Silver (Холодный серый)',
          desc: 'Сбалансированные металлические оттенки серого с мягким контрастом',
        },
        light: {
          name: 'Светлая (Daylight)',
          desc: 'Чистые молочно-белые дневные тона для комфортной работы при свете',
        },
      },
      close: 'Закрыть',
    },
    hotkeys: {
      title: 'Горячие клавиши SplitCompare',
      subtitle: 'Быстрый доступ и управление просмотром с клавиатуры',
      groupNavigation: 'Навигация и масштаб',
      groupModes: 'Режимы сравнения',
      groupFiles: 'Файлы и управление',
      wheelZoom: 'Плавный зум (центрирован на курсор)',
      rmbPan: 'Панорамирование (ПКМ + перетаскивание)',
      spacePan: 'Быстрое перемещение (Пробел + ЛКМ)',
      plusZoom: 'Приблизить изображение',
      minusZoom: 'Отдалить изображение',
      resetZoom: 'Сбросить масштаб и положение (100% Fit)',
      nativeZoom: 'Натуральный масштаб 1:1 (Native)',
      spacePeep: 'Переключение A/B в режиме мигания',
      toggleSidebarsKey: 'Свернуть / раскрыть боковые панели',
      swapKey: 'Поменять местами слоты A ↔ B',
      cycleModeKey: 'Переключить следующий режим сравнения',
      diffKey: 'Быстрое переключение режима «Разность»',
      syncKey: 'Синхронизация панорамы и зума (SYNC)',
      checkerboardKey: 'Шахматка прозрачности альфа-канала',
      fullscreenKey: 'Полноэкранный режим',
      dropDesc: 'Перетаскивание файлов прямо на экран',
      pasteDesc: 'Вставка из буфера обмена',
      helpKey: 'Открыть данную справку горячих клавиш',
      escKey: 'Закрыть любое активное модальное окно',
    },
    orientation: {
      autoRotate: 'Автоповорот (Гироскоп)',
      locked: 'Ориентация заблокирована',
      unlocked: 'Автоповорот включен',
      lockTooltip: 'Заблокировать ориентацию в текущем положении',
      unlockTooltip: 'Включить автоподстройку по гироскопу',
      landscape: 'Альбомная',
      portrait: 'Портретная',
    },
    windowsModal: {
      title: 'Локальный запуск на Windows & Обновления',
      subtitle: 'Батники для запуска, сборка EXE установщика и автообновление',
      tabBat: 'Локальный сервер (.BAT)',
      tabExe: 'Сборка EXE Installer',
      tabUpdate: 'Автообновление',
      close: 'Закрыть',
    },
    dropzone: {
      leftTitle: 'Слот A (Изображение 1)',
      rightTitle: 'Слот B (Изображение 2)',
      leftDesc: 'Отпустите файл здесь, чтобы загрузить его в качестве первого (исходного) изображения',
      rightDesc: 'Отпустите файл здесь, чтобы загрузить его в качестве второго (измененного) изображения',
      formats: 'JPEG • PNG • WebP',
    },
    statusBar: {
      zoom: 'Масштаб',
      coords: 'Координаты',
      sourceA: 'A',
      sourceB: 'B',
      empty: 'Пусто',
      hints: {
        pan: 'Панорама: ПКМ / Колесико / Пробел+ЛКМ',
        zoom: 'Масштаб: Колесо мыши',
        slider: 'Слайдер: Перетаскивание ЛКМ',
        space: 'Пробел: Быстрый захват',
      },
    },
    inspector: {
      title: 'Инспектор курсора',
      viewportCoords: 'Экран',
      imageCoords: 'Пиксели',
    },
    emptyState: {
      title: 'Перетащите изображения для сравнения',
      description: 'Поддерживаются форматы JPEG, PNG, WebP и видео MP4, WebM любого разрешения.',
      chooseSlotA: 'Выбрать для Слота A',
      chooseSlotB: 'Выбрать для Слота B',
      orDragDrop: 'Или выберите пару из меню «Примеры» сверху',
    },
    video: {
      play: 'Синхронный запуск',
      pause: 'Пауза',
      loop: 'Зацикливание',
      loopOn: 'Зацикливание ВКЛ (по умолчанию)',
      loopOff: 'Зацикливание ВЫКЛ',
      speed: 'Скорость',
      mute: 'Выключить звук',
      unmute: 'Включить звук',
      stepPrev: 'Кадр назад (,)',
      stepNext: 'Кадр вперед (.)',
      shortestLoop: 'Цикл по короткому ролику',
      startOffset: 'Смещение старта длинного',
      offsetDesc: 'Смещение начального времени длинного видео с сохранением длины короткого',
      resetOffset: 'Сбросить смещение',
      maxOffset: 'Макс. смещение',
      sideBySide: 'Бок-о-бок',
      audioSource: 'Звук',
      audioSlotA: 'Звук: Слот A',
      audioSlotB: 'Звук: Слот B',
      audioMuted: 'Звук выключен',
      syncLocked: 'Синхронизировано',
      syncAdjusting: 'Авто-подгонка скорости',
    },
  },

  en: {
    appName: 'SplitCompare',
    version: 'v1.3',
    modes: {
      slider: { label: 'Slider', tooltip: 'Split curtain overlay slider' },
      'slider-horizontal': { label: 'Horiz. Slider', tooltip: 'Horizontal split slider' },
      'side-by-side': { label: 'Side-by-Side', tooltip: 'Synchronous 2-Up Horizontal comparison' },
      'side-vertical': { label: 'Top / Bottom', tooltip: '2-Up Vertical split' },
      difference: { label: 'Difference', tooltip: 'Pixel difference blend mode' },
      onion: { label: 'Onion Skin', tooltip: 'Smooth opacity blending' },
      toggle: { label: 'A/B Blink', tooltip: 'Rapid A/B toggle & auto-blinking' },
    },
    alignments: {
      'top-left': { label: 'Top-Left (↖)', short: 'Top-Left', arrow: '↖' },
      top: { label: 'Top (↑)', short: 'Top', arrow: '↑' },
      'top-right': { label: 'Top-Right (↗)', short: 'Top-Right', arrow: '↗' },
      left: { label: 'Left (←)', short: 'Left', arrow: '←' },
      center: { label: 'Center (•)', short: 'Center', arrow: '•' },
      right: { label: 'Right (→)', short: 'Right', arrow: '→' },
      'bottom-left': { label: 'Bottom-Left (↙)', short: 'Bottom-Left', arrow: '↙' },
      bottom: { label: 'Bottom (↓)', short: 'Bottom', arrow: '↓' },
      'bottom-right': { label: 'Bottom-Right (↘)', short: 'Bottom-Right', arrow: '↘' },
    },
    header: {
      samples: 'Samples',
      shortcuts: 'Shortcuts',
      windowsBat: 'Windows / .BAT',
      settings: 'Settings',
      fullscreen: 'Fullscreen (F)',
      exitFullscreen: 'Exit Fullscreen (F)',
    },
    toolbar: {
      zoom: 'Zoom',
      zoomIn: 'Zoom In (+ / Mouse Wheel)',
      zoomOut: 'Zoom Out (- / Mouse Wheel)',
      fit: 'Fit (100%)',
      resetZoom: 'Reset Zoom & Pan (0 / R)',
      sync: 'Sync',
      syncOn: 'SYNC ON (L)',
      syncOff: 'SYNC OFF (L)',
      swap: 'Swap A ↔ B',
      swapTooltip: 'Swap Image A and Image B (S)',
      alignment: 'Alignment',
      alignTitle: 'Alignment for mismatched aspect ratios',
      checkerboard: 'Checkerboard',
      checkerboardOn: 'Transparency Checkerboard (C) — ON',
      checkerboardOff: 'Transparency Checkerboard (C) — OFF',
      pixelated: 'Pixelated',
      smooth: 'Smooth',
      pixelatedTooltip: 'Toggle interpolation filter (Nearest Neighbor / Bilinear)',
      inspector: 'Inspector',
      inspectorTooltip: 'Cursor coordinates and pixel inspector',
      differenceThreshold: 'Difference Boost',
      invert: 'Invert',
      opacityA: 'Opacity A',
      opacityB: 'Opacity B',
      speedHz: 'Hz',
      autoBlink: 'Auto-Blink',
      stopBlink: 'Stop',
      toggleSlotA: 'Source A',
      toggleSlotB: 'Source B',
    },
    history: {
      sourceA: 'Source A',
      sourceB: 'Source B',
      historyA: 'History A',
      historyB: 'History B',
      upload: 'Upload',
      uploadTooltip: 'Upload new image (JPEG, PNG, WebP)',
      noImages: 'No images in history',
      clear: 'Clear',
      clearTooltip: 'Clear history list',
      deleteTooltip: 'Delete from history',
      aspectMatch: '1:1 Aspect matched',
      aspectMismatch: 'Aspect mismatch',
      collapseSidebar: 'Collapse sidebar',
      expandSidebar: 'Expand sidebar',
      currentActive: 'Active',
      dimensions: 'Resolution',
      size: 'Size',
      dragDropHere: 'Or drop file here',
    },
    settingsModal: {
      title: 'App Settings',
      subtitle: 'Customize interface language and visual theme',
      language: 'Language',
      languageDesc: 'Choose display language across the app',
      theme: 'Color Theme',
      themeDesc: 'Select visual workspace theme',
      themes: {
        dark: {
          name: 'Dark',
          desc: 'Deep graphite and high-contrast dark tones (#0A0A0A)',
        },
        silver: {
          name: 'Silver (Cool Grey)',
          desc: 'Refined cool metallic grey palette with subtle gradients & contrast',
        },
        light: {
          name: 'Daylight (Warm Light)',
          desc: 'Clean milk-white daylight tones for high ambient light environments',
        },
      },
      close: 'Close',
    },
    hotkeys: {
      title: 'SplitCompare Keyboard Shortcuts',
      subtitle: 'Fast workflow navigation and keyboard controls',
      groupNavigation: 'Navigation & Zoom',
      groupModes: 'Comparison Modes',
      groupFiles: 'Files & Window Controls',
      wheelZoom: 'Smooth mouse cursor centered zoom',
      rmbPan: 'Pan viewport (RMB + Drag)',
      spacePan: 'Quick pan (Space + LMB Drag)',
      plusZoom: 'Zoom in viewport',
      minusZoom: 'Zoom out viewport',
      resetZoom: 'Reset Zoom & Center (100% Fit)',
      nativeZoom: 'Native 1:1 Pixel Zoom',
      spacePeep: 'Toggle active slot in Blink mode',
      toggleSidebarsKey: 'Collapse / Expand side history panels',
      swapKey: 'Swap slot images A ↔ B',
      cycleModeKey: 'Cycle next comparison mode',
      diffKey: 'Quick toggle Difference mode',
      syncKey: 'Toggle Sync Pan/Zoom lock',
      checkerboardKey: 'Toggle Alpha Transparency checkerboard',
      fullscreenKey: 'Toggle Fullscreen display',
      dropDesc: 'Drag & drop image files anywhere',
      pasteDesc: 'Paste clipboard image',
      helpKey: 'Open shortcuts cheat sheet',
      escKey: 'Close active modal / dialog',
    },
    orientation: {
      autoRotate: 'Auto-Rotate (Gyroscope)',
      locked: 'Orientation Locked',
      unlocked: 'Auto-Rotate Active',
      lockTooltip: 'Lock orientation to current state',
      unlockTooltip: 'Enable gyroscope auto-adaptation',
      landscape: 'Landscape',
      portrait: 'Portrait',
    },
    windowsModal: {
      title: 'Windows Local Launch & Updates',
      subtitle: 'Batch scripts, EXE installer generation, and auto-updater',
      tabBat: 'Local Server (.BAT)',
      tabExe: 'EXE Installer Build',
      tabUpdate: 'Auto-Updater',
      close: 'Close',
    },
    dropzone: {
      leftTitle: 'Slot A (Image 1)',
      rightTitle: 'Slot B (Image 2)',
      leftDesc: 'Drop image here to load into Source A',
      rightDesc: 'Drop image here to load into Source B',
      formats: 'JPEG • PNG • WebP',
    },
    statusBar: {
      zoom: 'Zoom',
      coords: 'Coordinates',
      sourceA: 'A',
      sourceB: 'B',
      empty: 'Empty',
      hints: {
        pan: 'Pan: RMB / Wheel / Space+LMB',
        zoom: 'Zoom: Mouse Wheel',
        slider: 'Slider: Drag LMB',
        space: 'Space: Quick Pan',
      },
    },
    inspector: {
      title: 'Cursor Inspector',
      viewportCoords: 'Screen',
      imageCoords: 'Pixels',
    },
    emptyState: {
      title: 'Drop images or videos here to start comparing',
      description: 'Supports high-res JPEG, PNG, WebP, and MP4/WebM videos with synchronous playback.',
      chooseSlotA: 'Select for Slot A',
      chooseSlotB: 'Select for Slot B',
      orDragDrop: 'Or choose a sample pair from the top menu',
    },
    video: {
      play: 'Synchronous Play',
      pause: 'Pause',
      loop: 'Loop',
      loopOn: 'Looping ON (Default)',
      loopOff: 'Looping OFF',
      speed: 'Speed',
      mute: 'Mute Audio',
      unmute: 'Unmute Audio',
      stepPrev: 'Frame backward (,)',
      stepNext: 'Frame forward (.)',
      shortestLoop: 'Loop by shortest video',
      startOffset: 'Longer video start offset',
      offsetDesc: 'Shift the starting point of the longer video while maintaining the shortest duration loop',
      resetOffset: 'Reset offset',
      maxOffset: 'Max offset',
      sideBySide: 'Side-by-Side',
      audioSource: 'Audio',
      audioSlotA: 'Audio: Slot A',
      audioSlotB: 'Audio: Slot B',
      audioMuted: 'Audio Muted',
      syncLocked: 'Synced',
      syncAdjusting: 'Auto-rate Syncing',
    },
  },
};
