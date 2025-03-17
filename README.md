# Three.js Floor Grid Template

> Customizable floor grid system with shader-based rendering and interactive controls.

## Screenshots

![Grid System Screenshot](https://github.com/glitch-monk/threejs.floor.grid_template/blob/main/screen_shot.png)

## Quick Start
```bash
npm install   # Install dependencies
npm run dev   # Start dev server
```

## Stack
- three.js ^0.174.0 with WebGPU renderer
- Three.js Shader Language (TSL) for shader creation
- tweakpane ^4.0.5
- vite ^5.1.4

## Features
```yaml
Grid:
  - TSL-based infinite grid with anti-aliasing
  - WebGPU-accelerated rendering
  - Distance-based fading
  - Customizable scale/thickness/color
  - Line-based cross pattern overlay
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
│   ├── MeshGridMaterial.js  # TSL-based grid material
│   ├── MeshCrossMaterial.js # TSL-based cross material
│   └── shaders/            # TSL shader components
├── Camera.js               # Orbit controls
├── Debug.js                # Tweakpane interface
├── Floor.js                # Grid + cross system
├── Object.js               # 3D object handling
├── World.js                # Scene management
└── main.js                # Entry point
```

## Performance
- WebGPU rendering for modern GPUs
- TSL (Three.js Shader Language) for efficient shader creation
- Fixed pixel ratio
- GPU-accelerated shader rendering
- Derivative-based anti-aliasing
- High-density cross support with line-based rendering
- Memory-efficient implementation
- Based on Ben Golus's grid shader techniques

## License
MIT
