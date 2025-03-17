# Three.js Floor Grid Template

A customizable floor grid implementation using Three.js, featuring a shader-based grid with configurable parameters via Tweakpane. The project creates an interactive 3D scene with a customizable floor grid and cross patterns, perfect for use in 3D visualization projects.

## Features

- WebGL renderer with antialiasing and optimized performance
- Dual-layer visualization:
  - Base layer: Shader-based infinite grid with customizable parameters
  - Cross layer: Procedurally generated cross patterns with adjustable density
- Interactive camera controls with orbit functionality
- Real-time parameter adjustment via Tweakpane debug interface
- Responsive design that adapts to window resizing

## Technical Implementation

### Grid System
- Primary grid implemented using custom GLSL shaders
- Grid properties:
  - Scale: Controls grid cell size
  - Thickness: Adjusts line width
  - Offset: Shifts grid position
  - Color: Customizable grid color with transparency

### Cross Pattern System
- Secondary layer of cross markers
- Features:
  - Dynamic density control
  - Size scaling relative to grid cells
  - Customizable thickness and color
  - Offset adjustment for pattern variation
- Implemented using THREE.LineSegments for optimal performance
- Multi-line rendering for cross thickness

### Scene Management
- Organized using a World class architecture
- Components:
  - Camera system with orbit controls
  - Lighting setup (ambient + directional)
  - Floor system with grid and crosses
  - Debug panel for real-time adjustments

## Dependencies

- three.js: ^0.162.0 - Core 3D rendering
- tweakpane: ^4.0.5 - Debug interface
- three.meshline: ^1.4.0 - Enhanced line rendering
- vite: ^5.1.4 - Build tool and development server

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Controls

### Debug Interface (Tweakpane)
Grid Controls:
- Scale: Adjust grid cell size
- Thickness: Control line width
- Offset: Shift grid position
- Color: Change grid line color

Cross Pattern Controls:
- Scale: Adjust cross size relative to grid
- Thickness: Control cross line width
- Density: Adjust number of crosses per grid cell
- Offset: Shift cross pattern position
- Color: Change cross color

Camera Controls:
- Left mouse: Rotate camera
- Right mouse: Pan view
- Mouse wheel: Zoom in/out

## Performance Considerations

- Optimized shader-based grid rendering
- Efficient cross pattern generation using line segments
- Fixed pixel ratio for consistent performance
- Transparent material handling for proper rendering order
- Memory management for cross pattern updates
