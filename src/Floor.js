import * as THREE from 'three';
import { gridVertexShader, gridFragmentShader } from './materials/shaders/gridShader.js';

export default class Floor {
    constructor(scene) {
        this.scene = scene;
        this.params = {
            grid: {
                scale: 1,
                thickness: 0.007,
                offset: 0.000,
                color: '#D3D3D3'
            },
            crosses: {
                scale: 0.022,
                offset: 1,
                color: '#ff5f1f',
                thickness: 0.028,
                density: 45
            }
        };
        this.createFloor();
    }
    
    createFloor() {
        console.log('Creating floor...');
        
        try {
            // Create grid material with custom shader for lines
            const gridMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uGridColor: { value: new THREE.Color(this.params.grid.color) },
                    uGridThickness: { value: this.params.grid.thickness },
                    uGridOffset: { value: this.params.grid.offset },
                    uGridScale: { value: this.params.grid.scale }
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform vec3 uGridColor;
                    uniform float uGridThickness;
                    uniform float uGridOffset;
                    uniform float uGridScale;
                    varying vec2 vUv;
                    
                    float getGrid(vec2 uv, float scale, float thickness, float offset) {
                        vec2 grid = fract(uv * scale - offset);
                        float lineX = abs(grid.x - 0.5);
                        float lineY = abs(grid.y - 0.5);
                        return smoothstep(thickness, 0.0, min(lineX, lineY));
                    }
                    
                    void main() {
                        vec2 scaledUv = vUv * 10.0;
                        float grid = getGrid(scaledUv, uGridScale, uGridThickness, uGridOffset);
                        gl_FragColor = vec4(uGridColor, grid);
                    }
                `,
                transparent: true,
                side: THREE.DoubleSide
            });
            
            // Create grid mesh
            const gridGeometry = new THREE.PlaneGeometry(10, 10);
            this.grid = new THREE.Mesh(gridGeometry, gridMaterial);
            this.grid.rotation.x = -Math.PI / 2;
            this.grid.position.y = 0;
            this.scene.add(this.grid);
            
            // Create crosses
            this.updateCrosses();
            
            console.log('Floor created successfully');
        } catch (error) {
            console.error('Failed to create floor:', error);
        }
    }
    
    updateGridParameters(params) {
        if (!this.grid) return;
        
        // Update local parameters
        Object.assign(this.params.grid, params);
        
        // Update shader uniforms
        const material = this.grid.material;
        if (params.color !== undefined) {
            material.uniforms.uGridColor.value = new THREE.Color(params.color);
            material.needsUpdate = true;
        }
        if (params.thickness !== undefined) {
            material.uniforms.uGridThickness.value = params.thickness;
        }
        if (params.offset !== undefined) {
            material.uniforms.uGridOffset.value = params.offset;
        }
        if (params.scale !== undefined) {
            material.uniforms.uGridScale.value = params.scale;
        }
    }
    
    updateCrossParameters(params) {
        // Update local parameters
        Object.assign(this.params.crosses, params);
        
        if (params.color !== undefined && this.crosses) {
            this.crosses.material.color = new THREE.Color(params.color);
            this.crosses.material.needsUpdate = true;
        }
        
        // Update crosses if needed
        if (params.scale !== undefined || params.offset !== undefined || params.density !== undefined) {
            this.updateCrosses();
        }
    }
    
    updateCrosses() {
        // Remove previous crosses if they exist
        if (this.crosses) {
            this.scene.remove(this.crosses);
            this.crosses.geometry.dispose();
            this.crosses.material.dispose();
        }
        
        // Create material for crosses
        const material = new THREE.LineBasicMaterial({ 
            color: new THREE.Color(this.params.crosses.color),
            transparent: true,
            opacity: 0.8
        });
        
        // Create geometry for all crosses
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        
        // Calculate grid parameters based on the shader grid
        const gridSize = 10; // Total size of the floor
        const divisions = Math.floor(10 / this.params.grid.scale); // Match shader grid scale
        const cellSize = gridSize / divisions;
        const halfGridSize = gridSize / 2;
        
        // Calculate cross parameters
        const crossSize = this.params.crosses.scale * cellSize * 0.5; // Scale relative to cell size
        const density = Math.max(1, Math.floor(this.params.crosses.density));
        const crossesPerCell = Math.ceil(Math.sqrt(density));
        const crossSpacing = cellSize / crossesPerCell;
        
        // Create crosses for each grid cell
        for (let x = -halfGridSize; x < halfGridSize; x += cellSize) {
            for (let z = -halfGridSize; z < halfGridSize; z += cellSize) {
                // Add crosses based on density
                for (let dx = 0; dx < crossesPerCell; dx++) {
                    for (let dz = 0; dz < crossesPerCell; dz++) {
                        const crossX = x + (dx * crossSpacing) + crossSpacing/2 + (this.params.crosses.offset * crossSpacing);
                        const crossZ = z + (dz * crossSpacing) + crossSpacing/2 + (this.params.crosses.offset * crossSpacing);
                        
                        // Add multiple parallel lines for thickness
                        const numLines = 5; // Number of parallel lines for thickness
                        const spacing = (this.params.crosses.thickness * cellSize * 0.1) / numLines;
                        
                        for (let i = -numLines/2; i < numLines/2; i++) {
                            // Horizontal lines
                            positions.push(
                                crossX - crossSize, 0.002, crossZ + i * spacing,
                                crossX + crossSize, 0.002, crossZ + i * spacing
                            );
                            
                            // Vertical lines
                            positions.push(
                                crossX + i * spacing, 0.002, crossZ - crossSize,
                                crossX + i * spacing, 0.002, crossZ + crossSize
                            );
                        }
                    }
                }
            }
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        
        // Create and add crosses to scene
        this.crosses = new THREE.LineSegments(geometry, material);
        this.scene.add(this.crosses);
    }
}
