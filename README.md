# Three.js Floor Grid Template

> Customizable floor grid system with shader-based rendering and interactive controls.

## Screenshots

![Grid System Screenshot](./Screenshot%202025-03-17%20at%208.20.24%20AM.png)

*Interactive grid system with customizable parameters*

## Quick Start
```bash
npm install   # Install dependencies
npm run dev   # Start dev server
```

## Stack
- three.js ^0.162.0
- tweakpane ^4.0.5
- vite ^5.1.4

## Features
```yaml
Grid:
  - Shader-based infinite grid with anti-aliasing
  - Distance-based fading
  - Customizable scale/thickness/color
  - Shader-based cross pattern overlay
  - Real-time parameter controls

Controls:
  camera:
    rotate: LMB
    pan: RMB
    zoom: wheel
  parameters:
    grid:
      - scale [0-1]
      - thickness [0-0.2]
      - offset [0-1]
      - color [hex]
    crosses:
      - scale [0-1]
      - thickness [0-0.2]
      - density [1-50]
      - offset [0-1]
      - color [hex]
```

## Architecture
```
src/
├── materials/
│   └── shaders/      # GLSL shaders
├── Camera.js         # Orbit controls
├── Debug.js          # Tweakpane interface
├── Floor.js          # Grid + cross system
├── Object.js         # 3D object handling
├── World.js          # Scene management
└── main.js          # Entry point
```

## Performance
- Fixed pixel ratio
- GPU-accelerated shader rendering
- Derivative-based anti-aliasing
- High-density cross support
- Memory-efficient (single plane geometry)
- Based on Ben Golus's grid shader techniques

## License
MIT
