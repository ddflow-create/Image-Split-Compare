# SplitCompare — Interface and Functionality Specification

This document outlines the current architecture, interface elements, operational modes, and control system of the **SplitCompare (v1.3)** web application.

---

## 1. General Architecture and Concept

**SplitCompare** is a professional web tool for pixel-by-pixel comparative analysis of two images (Slot A and Slot B).
The application is targeted at designers, 3D/VFX artists, frontend developers, QA engineers, and computer vision developers.

- **Stack**: React 18+, TypeScript, Tailwind CSS, Lucide Icons.
- **Supported Formats**: JPEG, PNG, WebP, GIF, AVIF, SVG (preserving alpha transparency).
- **Platforms**: Web (Desktop, Tablet, Mobile), Windows Local (.BAT / Standalone EXE).

---

## 2. Themes and Localization

### 2.1. Color Themes (`AppTheme`)
1. **Dark**: Deep graphite and high-contrast dark shades (`#0A0A0A`) that reduce eye strain during prolonged use.
2. **Silver (Cool Gray)**: A balanced metallic palette of cool gray tones (`#18191B` / `#222428`) with soft contrast.
3. **Daylight (Light)**: Clean milky-white tones for working in bright ambient lighting.

### 2.2. Interface Languages (`AppLanguage`)
- **Russian (`ru`)**: Full translation of all elements, menus, hotkeys, and tooltips.
- **English (`en`)**: Full translation of the interface, including dropdown menus, modes, and alignment presets.
- Theme and language states are saved in `localStorage`.

---

## 3. Interface Layout (Layout)

The interface is divided into 5 functional areas:

```
+-----------------------------------------------------------------------------+
| 1. Main Header: Comparison Modes | Samples | Modal Windows                  |
+-----------------------------------------------------------------------------+
| 2. ViewportToolbar: Zoom | Sync | Alignment | Options                       |
+-----------------------------------------------------------------------------+
| 3. Ribbon A (Left)|  4. Comparison Canvas (ComparisonViewer) | 3. Ribbon B  |
|    - Upload / D&D |     - Slider / Side-by-Side / Diff       |    (Right)   |
|    - Preview info |     - Zoom, pan, checkerboard, loupe     |              |
+-----------------------------------------------------------------------------+
| 5. Status Bar (StatusBar): Zoom | Coordinates | Files | Tooltips            |
+-----------------------------------------------------------------------------+
```

---

## 4. Description of Interface Components

### 4.1. Main Header (`Header`)
- **Logo & Name**: Version indicator `v1.3`.
- **Comparison Mode Selector (7 modes)**:
  1. `Slider` — vertical split slider.
  2. `Slider-Horizontal` — horizontal split slider.
  3. `Side-by-Side` — 2-Up horizontal layout.
  4. `Side-Vertical` — 2-Up vertical layout.
  5. `Difference` — pixel-by-pixel channel subtraction (`|A - B|`).
  6. `Onion Skin` — smooth overlay with transparency adjustment.
  7. `Toggle / Blink` — timer-based or manual key switching.
- **Samples**: Ready-made test pairs (UI redesign, Pixel Art, 3D Render).
- **Control Buttons**:
  - `Hotkeys (?)`: opens the keyboard shortcuts cheat sheet.
  - `Windows / .BAT`: local launch scripts and EXE build instructions.
  - `Settings`: language and theme switching.
  - `Fullscreen (F)`: enter/exit fullscreen mode.
  - `Mobile Sidebar Menu`: responsive menu for narrow screens.

---

### 4.2. Secondary Toolbar (`ViewportToolbar`)
- **Collapse Sidebars (`S`)**: `PanelLeft` button to maximize the workspace.
- **Zoom Controls**:
  - `-` / `+` buttons (scaling steps from 25% to 1000%).
  - Zoom preset dropdown: `25%`, `50%`, `75%`, `100% (Fit)`, `150%`, `200%`, `300%`, `500%`, `1000%`.
  - Reset zoom and position (`0` / `R`).
- **Pan/Zoom Synchronization (`SYNC` / `FREE`)**: forced or separate transformation.
- **Swap (`A ↔ B`)**: quick swap of images in slots (`X`).
- **Alignment Preset (for different aspect ratios)**:
  - 9 reference points: `Top-Left`, `Top`, `Top-Right`, `Left`, `Center`, `Right`, `Bottom-Left`, `Bottom`, `Bottom-Right`.
  - 3×3 grid with graphical arrows and localized names.
- **Dynamic Mode Controllers**:
  - *For Sliders*: position slider `0-100%` + quick buttons `25%`, `50%`, `75%`.
  - *For Difference*: signal boost `1x - 10x` and `Invert` button.
  - *For Onion Skin*: A ↔ B transparency balance slider.
  - *For Toggle/Blink*: `Auto-blink (Play/Pause)` button, **blink frequency slider (`1 - 16 Hz`)**, `Smooth Blink` toggle with crossfade, manual slot switch `Slot A` / `Slot B`.
- **Quick Tools**:
  - `Checkerboard` (`C`): background for checking alpha transparency.
  - `PIXEL / SOFT`: interpolation filter toggle (Nearest Neighbor / Bilinear).
  - `Inspector`: crosshair of screen and pixel coordinates with RGB color detection.
  - `Gyro / Locked`: device orientation adaptation.
- **Adaptive Overflow Menu (`...`)**: compact dropdown list for tablets and mobile devices.

---

### 4.3. Vertical History Sidebars (`VerticalHistorySidebar`)
- Located on the left (Slot A) and right (Slot B).
- **Width**: adjustable (by dragging the splitter, defaults to 20% of screen width, max 25%).
- **Upload Button**: opens the system file explorer or accepts Drag & Drop.
- **Indicators**:
  - Preview thumbnail.
  - Resolution (`W × H px`), file size (`KB / MB`), format (`PNG`, `JPEG`, `WEBP`).
  - Active image badge.
  - Aspect ratio match or mismatch badge (`1:1 Match` / `Mismatch`).
- **Controls**: clear list, delete individual item.

---

### 4.4. Comparison Canvas (`ComparisonViewer`)
- Supports hardware-accelerated CSS transforms.
- **Gestures and Mouse**:
  - Mouse wheel zoom focused on the cursor position.
  - Panning via holding Right Mouse Button, Middle Mouse Button, or `Space + Left Mouse Button`.
  - Touch gestures: two-finger pinch-to-zoom, one-finger panning.
- **Slider Divider Line**: interactive divider with neon glow and A / B badges.
- **Pixel Inspector**: popup card with cursor coordinates, original pixels, and a color sampler.

---

### 4.5. Fullscreen Drag & Drop Overlay (`DropZoneOverlay`)
- Activated when dragging files from the OS file explorer.
- Divided into 2 interactive zones:
  - **Left Zone**: upload to Slot A (Source Image).
  - **Right Zone**: upload to Slot B (Modified Image).
  - **Dropping Two Files**: automatically distributes file 1 to Slot A and file 2 to Slot B.
- Prevents false flickering when hovering over child elements.

---

### 4.6. Bottom Status Bar (`StatusBar`)
- Displays current zoom scale in percentage.
- Displays cursor coordinates `(X, Y)`.
- Names of active files in slots A and B.
- Hotkey navigation tips.

---

## 5. Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| **Mouse Wheel** | Smooth zoom to cursor point |
| **RMB / MMB / Space+LMB** | Pan canvas |
| **+ / -** | Zoom in / Zoom out |
| **0 / R** | Reset scale and center (100% Fit) |
| **1** | Native 1:1 scale (Pixel-to-Pixel) |
| **X** | Swap images A ↔ B |
| **S** | Collapse / expand history sidebars |
| **Tab / 1..7** | Cycle comparison modes |
| **D** | Quick toggle Difference mode |
| **L** | Toggle Pan/Zoom synchronization (SYNC) lock |
| **C** | Toggle checkerboard background |
| **F** | Toggle Fullscreen mode |
| **Space** | Toggle A/B in Blink mode |
| **Ctrl+V / Cmd+V** | Paste image from clipboard |
| **?** | Open keyboard shortcuts help |
| **Esc** | Close modal window / cancel drag |

---

## 6. Local Launch, Build, and Deploy

The application includes a Help window (Help: Run & Compile) which contains deployment instructions:

1. **Local (Scripts)**: Quick launch on Windows (`.bat`) and macOS/Linux (`.sh`) without manual terminal commands.
2. **Electron (EXE/DMG)**: Instructions on installing packages and building a desktop app (`electron-builder`).
3. **Build & LAN**: Instructions for production build, preview server, and sharing the app over the local network (`npm run dev -- --host`) for testing on mobile devices.
4. **Deploy & Update**: Instructions for hosting code on Github, web deployment (Vercel/Netlify), and configuring automatic updates for Electron builds (via Github Releases and electron-updater).
