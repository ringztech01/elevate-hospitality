# Hero Section — Scroll-Driven Video Scrubbing

## How it works

### 1. Scroll Capture
Wheel and touch events on the container feed scroll deltas into `accumulateScroll()`. Deltas are normalized by viewport height (`delta / window.innerHeight`).

### 2. Raw Progress
`rawProgressRef` accumulates the normalized delta, clamped 0–1.

### 3. Smooth Interpolation
A `requestAnimationFrame` loop lerps the display value toward the raw target each frame:
```
smoothProgress += (rawProgress - smoothProgress) * 0.1
```
The 0.1 factor creates natural easing — catches up quickly then settles smoothly.

### 4. Video Scrubbing
`video.currentTime = progress * video.duration` on each tick. A seek deadzone (0.015s) avoids redundant decoder calls.

### 5. Key requirements for smoothness
- **Short-GOP video** — keyframe every 3 frames (0.125s) so max 2-frame decode per seek
- **H.264 MP4** — hardware-decoded on all devices
- **requestAnimationFrame** — syncs to display refresh
- **passive: false** — prevents page scroll while scrubbing

## Hero video files
Two versions, auto-switched via `matchMedia("(max-width: 767px)")`:
- **Desktop** (`public/hero-desktop.mp4`): 11.7 MB, H.264 CRF 27, g=3 (0.125s keyframes)
- **Mobile** (`public/hero-mobile.mp4`): 4.9 MB, H.264 CRF 36, g=3 (0.125s keyframes)
- **Fallback** (`public/hero.mp4`): copy of desktop version
All: 1920×1080, 24 fps, ~15s duration

## Text animation triggers
Text groups fade in/out at specific `displayProgress` thresholds:
- Left text: fades out by progress 0.279
- Right text (1): enters 0.279–0.488, exits at ≥0.488
- Center text: enters 0.510–0.665, exits at ≥0.665
- Top-right text: enters at ≥0.798
- Scroll indicator: fades out by progress 0.125
