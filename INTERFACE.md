# SplitCompare — Interface and Functionality Specification

This document outlines the architecture, interface components, comparison modes, synchronized video playback engine, and control system of the **SplitCompare (v1.4)** web application.

---

## 1. General Architecture and Concept

**SplitCompare** is a high-performance web tool for pixel-by-pixel comparative analysis of images and synchronized side-by-side comparison of videos (Slot A and Slot B).
The application is designed for designers, video editors, 3D/VFX artists, frontend developers, QA engineers, and computer vision developers.

- **Technology Stack**: React 18+, TypeScript, Tailwind CSS, Lucide Icons, Vite.
- **Supported Media Formats**:
  - **Images**: JPEG, PNG, WebP, GIF, AVIF, SVG (preserving alpha transparency).
  - **Videos**: MP4, WebM, OGG, MOV (HTML5 video container playback).
- **Supported Platforms**: Modern Web Browsers (Desktop, Tablet, Mobile), Windows Local (.BAT / Standalone EXE).

---

## 2. Themes and Localization

### 2.1. Color Themes (`AppTheme`)
1. **Dark**: Deep graphite and high-contrast dark tones (`#0A0A0A`) engineered to minimize eye fatigue during extended workflows.
2. **Silver (Cool Gray)**: A metallic palette of cool gray tones (`#18191B` / `#222428`) with soft contrast.
3. **Daylight (Light)**: Clean off-white and neutral tones optimized for well-lit office environments.

### 2.2. Interface Languages (`AppLanguage`)
- **English (`en`)**: Complete translation of the interface, controls, video playback bar, and settings.
- **Russian (`ru`)**: Full localized translation of all elements, menus, hotkeys, and tooltips.
- Theme and language preferences persist across browser sessions in `localStorage`.

---

## 3. Interface Layout

The workspace is structured into 5 cohesive functional regions:

```
+-----------------------------------------------------------------------------+
| 1. Main Header: Comparison Modes | Samples | Modals (Help, Hotkeys, Config) |
+-----------------------------------------------------------------------------+
| 2. Secondary Toolbar: Zoom | Sync | Alignment | Mode-Specific Controllers   |
+-----------------------------------------------------------------------------+
| 3. Ribbon A (Left)|  4. Comparison Canvas (ComparisonViewer) | 3. Ribbon B  |
|    - Upload / D&D |     - Slider / Side-by-Side / Diff / ... |    (Right)   |
|    - Media Info   |     - Synchronized Video Playback Bar    |              |
+-----------------------------------------------------------------------------+
| 5. Status Bar: Zoom Ratio | Cursor Coordinates | File Specs | Hotkey Hints  |
+-----------------------------------------------------------------------------+
```

---

## 4. Component Details

### 4.1. Main Header (`Header`)
- **Brand & Version**: Application title with version tag `v1.4`.
- **Comparison Mode Selector (7 Modes)**:
  1. `Slider (Vertical)` — classic vertical split wipe slider.
  2. `Slider (Horizontal)` — horizontal split wipe slider.
  3. `Side-by-Side (2-Up Horizontal)` — dual side-by-side synchronized viewports.
  4. `Side-by-Side (2-Up Vertical)` — top-and-bottom synchronized viewports.
  5. `Difference` — pixel-by-pixel color channel subtraction (`|A - B|`).
  6. `Onion Skin` — alpha transparency overlay blend with opacity slider.
  7. `Toggle / Blink` — rapid alternating A/B visual flicker comparison.
- **Samples Menu**: Pre-configured test pairs for instant evaluation, including RAW vs Retouch, 4K Upscaling, Day vs Night RTX, and **Synchronized 5s vs 10s Video Comparison**.
- **Control Actions**:
  - `Hotkeys (?)`: opens the keyboard shortcuts reference sheet.
  - `Help / Windows Launch`: local launch scripts, LAN access, and desktop packaging guide.
  - `Settings`: UI language and theme configuration.
  - `Fullscreen (F)`: browser fullscreen toggle.

---

### 4.2. Secondary Toolbar (`ViewportToolbar`)
- **Sidebar Toggle (`S`)**: collapse or expand history sidebars to maximize viewport area.
- **Zoom Controls**:
  - Step buttons (`-` / `+`) spanning from 25% to 1000%.
  - Preset dropdown: `25%`, `50%`, `75%`, `100% (Fit)`, `150%`, `200%`, `300%`, `500%`, `1000%`.
  - Reset scale and position (`0` / `R`).
- **Pan/Zoom Synchronization (`SYNC` / `FREE`)**: locks or unlocks unified viewport panning and scaling.
- **Swap Slots (`A ↔ B`)**: swaps media items between Slot A and Slot B (`X`).
- **9-Point Alignment Grid**: aligns media items of mismatched resolutions or aspect ratios (Top-Left, Center, Bottom-Right, etc.).
- **Mode-Specific Controls**:
  - *Sliders*: position scrubbers (`0-100%`) and quick presets (`25%`, `50%`, `75%`).
  - *Difference*: signal boost multiplier (`1x - 10x`) and color inversion toggle.
  - *Onion Skin*: opacity blend ratio slider.
  - *Toggle / Blink*: auto-blink toggle, frequency control (`1 - 16 Hz`), smooth crossfade toggle, manual slot selector.
- **Utility Toggles**:
  - `Checkerboard` (`C`): background pattern for inspecting transparent alpha regions.
  - `Pixelated / Smooth`: interpolation toggle between Nearest Neighbor and Bilinear filtering.
  - `Inspector`: coordinates overlay with live cursor sampling.

---

### 4.3. Synchronized Video Comparison System

When one or both slots contain video media, the application unlocks the synchronized video comparison engine:

- **Single Master Control**: One click or keypress (`Space` / `KeyK`) plays and pauses both videos in perfect synchronization.
- **Default Auto-Looping**: Looping is active by default, ensuring uninterrupted iterative review.
- **Shortest Video Constraint**: Playback loops automatically at the duration of the shortest video:
  $$\text{Loop Duration} = \min(\text{Duration}_A, \text{Duration}_B)$$
- **Start Time Offset for Longer Video**:
  - When video lengths differ, the user can slide the **Start Offset** to choose where the longer video starts relative to the shorter video.
  - The maximum allowable offset is automatically clamped to guarantee that the remaining clip is at least as long as the shortest video:
    $$\text{Max Offset} = \text{Duration}_{\text{longer}} - \text{Duration}_{\text{shortest}}$$
- **Sub-Frame Drift Correction**:
  - A `requestAnimationFrame` monitor observes the playback time and automatically realigns the slave video if drift exceeds 60ms.
- **Frame-by-Frame Stepping**:
  - Step backward (`Comma` / `,`) and step forward (`Period` / `.`) by single frames ($\approx 33\text{ms}$ at 30fps).
- **Variable Playback Speeds**:
  - Speed presets: `0.25x`, `0.5x`, `1.0x`, `1.5x`, `2.0x`.
- **Audio Control**:
  - Global mute/unmute button preventing audio overlap during dual-stream playback.

---

### 4.4. Vertical History Sidebars (`VerticalHistorySidebar`)
- Located on the left (Slot A) and right (Slot B).
- **Resizable Width**: drag-to-resize divider with constraints.
- **File Ingestion**: supports file selection button or direct drag-and-drop.
- **Metadata Badges**: preview thumbnail, dimensions (`W × H`), file size, format, duration (for video), and aspect ratio matching indicator.

---

### 4.5. Comparison Canvas (`ComparisonViewer`)
- Hardware-accelerated CSS transforms for smooth 60fps panning and zooming.
- Interactive split dividers with grab handles and location badges.
- Cross-hair pixel inspector HUD displaying viewport and image-space coordinates.

---

### 4.6. Drag & Drop Overlay (`DropZoneOverlay`)
- Activates automatically when files are dragged over the window.
- Dual drop targets:
  - Drop on left half to load Slot A.
  - Drop on right half to load Slot B.
  - Drop two files simultaneously to auto-distribute file 1 to Slot A and file 2 to Slot B.

---

## 5. Keyboard Shortcuts Reference

| Shortcut | Description |
| :--- | :--- |
| **Mouse Wheel** | Zoom focused on mouse cursor |
| **RMB / MMB / Space + LMB** | Pan canvas |
| **+ / -** | Zoom in / Zoom out |
| **0 / R** | Reset zoom to Fit |
| **N** | Native 1:1 pixel scale |
| **X** | Swap Slot A and Slot B |
| **S** | Toggle history sidebars |
| **M / Tab** | Cycle comparison modes |
| **D** | Quick toggle Difference mode |
| **L** | Lock / unlock synchronized pan & zoom |
| **C** | Toggle alpha checkerboard background |
| **F** | Toggle browser fullscreen |
| **Space / K** | Play / Pause synchronized videos (or pan canvas if images only) |
| **, / .** | Step video backward / forward 1 frame |
| **J / L or ← / →** | Seek video backward / forward 1 second |
| **Ctrl + V / Cmd + V** | Paste image from system clipboard |
| **H / ?** | Open keyboard shortcuts help modal |
| **Esc** | Close open modals / cancel active drag |

---

## 6. Local Launch and Deployment Guide

1. **Windows Local Script (`start.bat`)**:
   - Double-click `start.bat` on Windows.
   - Automatically checks for Node.js, launches the browser at `http://localhost:3000`, and starts the development server.
2. **Local Network Access (LAN)**:
   - Run `npm run dev -- --host` to expose the app on your local Wi-Fi network for testing on mobile devices and secondary monitors.
3. **Production Build**:
   - Execute `npm run build` to create optimized, tree-shaken static assets in `dist/`.
   - Preview production builds locally using `npm run preview`.
