import * as THREE from 'three/webgpu';
import { MeshGridMaterial, MeshGridMaterialLine } from './materials/MeshGridMaterial.js';
import { MeshCrossMaterial } from './materials/MeshCrossMaterial.js';

export default class Floor {
    constructor(scene) {
        this.scene = scene;
        this.params = {
            grid: {
                scale: 1,
                thickness: 0.7,
                color: '#ffffff'
            },
            crosses: {
                scale: 0.022,
                offset: 0,
                color: '#8f1fff',
                thickness: 0.087,
                density: 33
            }
        };
        this.createFloor();
    }
    
    createFloor() {
        console.log('Creating floor with params:', JSON.stringify(this.params, null, 2));
        console.log('MeshGridMaterial:', MeshGridMaterial);
        console.log('MeshGridMaterialLine:', MeshGridMaterialLine);
        console.log('MeshCrossMaterial:', MeshCrossMaterial);
        
        try {
            const gridMaterial = new MeshGridMaterial({
                color: new THREE.Color(this.params.grid.color),
                scale: this.params.grid.scale,
                lines: [
                    new MeshGridMaterialLine(
                        new THREE.Color(this.params.grid.color),
                        1,  // frequency
                        this.params.grid.thickness * 0.02,  // thickness
                        1.0  // opacity
                    )
                ]
            });
            
            // Create grid mesh
            const gridGeometry = new THREE.PlaneGeometry(10, 10);
            this.grid = new THREE.Mesh(gridGeometry, gridMaterial);
            this.grid.rotation.x = -Math.PI / 2;
            this.grid.position.y = 0;
            this.scene.add(this.grid);
            console.log('Grid added to scene:', {
                position: this.grid.position.toArray(),
                rotation: [this.grid.rotation.x, this.grid.rotation.y, this.grid.rotation.z],
                visible: this.grid.visible,
                material: this.grid.material.type
            });
            
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
        
        // Create new material with updated parameters
        const material = new MeshGridMaterial({
            color: new THREE.Color(this.params.grid.color),
            scale: this.params.grid.scale,
            lines: [
                new MeshGridMaterialLine(
                    new THREE.Color(this.params.grid.color),
                    1,  // frequency
                    this.params.grid.thickness * 0.02,  // thickness
                    1.0  // opacity
                )
            ]
        });
        this.grid.material.dispose();
        this.grid.material = material;
    }
    
    updateCrossParameters(params) {
        // Update local parameters
        Object.assign(this.params.crosses, params);
        
        // For mesh-based crosses (if they exist)
        if (this.crosses) {
            // Create new material with updated parameters
            const material = new MeshCrossMaterial({
                color: new THREE.Color(this.params.crosses.color),
                scale: this.params.crosses.scale,
                thickness: this.params.crosses.thickness,
                density: this.params.crosses.density,
                offset: this.params.crosses.offset
            });
            this.crosses.material.dispose();
            this.crosses.material = material;
        }
        
        // For line-based crosses, recreate them with new parameters
        if (this.crossLines) {
            // Remove existing cross lines
            this.scene.remove(this.crossLines);
            this.crossLines = null;
            
            // Create new cross lines with updated parameters
            this.createCrossLines();
        }
    }
    
    createCrossLines() {
        // Remove previous cross lines if they exist
        if (this.crossLines) {
            this.scene.remove(this.crossLines);
            this.crossLines = null;
        }
        
        const crossColor = new THREE.Color(this.params.crosses.color);
        const crossDensity = this.params.crosses.density;
        const crossSize = this.params.crosses.scale;
        const crossOffset = this.params.crosses.offset;
        
        // Create a group to hold all the cross lines
        this.crossLines = new THREE.Group();
        
        // Calculate the grid size and spacing
        const gridSize = 10; // Same as the plane size
        const spacing = gridSize / crossDensity;
        
        // Apply thickness to lines by using LineBasicMaterial with linewidth
        // Note: linewidth is not supported in WebGLRenderer on most platforms
        // So we'll create thicker lines by using multiple lines side by side
        
        // Calculate how many lines to create based on thickness
        const thickness = Math.max(1, Math.round(this.params.crosses.thickness * 20));
        const lineStep = 0.005; // Space between adjacent lines
        
        // Create crosses across the grid with offset
        const offsetX = crossOffset * spacing;
        const offsetZ = crossOffset * spacing;
        
        for (let x = -gridSize/2 + spacing/2 + offsetX; x < gridSize/2; x += spacing) {
            for (let z = -gridSize/2 + spacing/2 + offsetZ; z < gridSize/2; z += spacing) {
                // Create multiple lines for thickness
                for (let t = -Math.floor(thickness/2); t <= Math.floor(thickness/2); t++) {
                    // Create horizontal line of the cross with thickness
                    const horizontalGeometry = new THREE.BufferGeometry();
                    const horizontalPoints = [
                        new THREE.Vector3(x - crossSize, 0.002, z + t * lineStep),
                        new THREE.Vector3(x + crossSize, 0.002, z + t * lineStep)
                    ];
                    horizontalGeometry.setFromPoints(horizontalPoints);
                    
                    // Create vertical line of the cross with thickness
                    const verticalGeometry = new THREE.BufferGeometry();
                    const verticalPoints = [
                        new THREE.Vector3(x + t * lineStep, 0.002, z - crossSize),
                        new THREE.Vector3(x + t * lineStep, 0.002, z + crossSize)
                    ];
                    verticalGeometry.setFromPoints(verticalPoints);
                    
                    // Create materials for each line
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: crossColor,
                        transparent: true,
                        opacity: 1.0
                    });
                    
                    const horizontalLine = new THREE.Line(horizontalGeometry, lineMaterial);
                    const verticalLine = new THREE.Line(verticalGeometry, lineMaterial);
                    
                    // Add lines to the group
                    this.crossLines.add(horizontalLine);
                    this.crossLines.add(verticalLine);
                }
            }
        }
        
        // Add the cross lines group to the scene
        this.scene.add(this.crossLines);
        console.log('Cross lines added to scene');
    }
    
    updateCrosses() {
        // Remove previous crosses if they exist
        if (this.crosses) {
            this.scene.remove(this.crosses);
            if (this.crosses.geometry) this.crosses.geometry.dispose();
            if (this.crosses.material) this.crosses.material.dispose();
        }
        
        // Remove previous cross lines
        if (this.crossLines) {
            this.scene.remove(this.crossLines);
            this.crossLines = null;
        }
        
        // Create line-based crosses
        this.createCrossLines();
        
        // Optionally create mesh-based crosses (disabled by default)
        const useMeshCrosses = false; // Set to true to use mesh-based crosses instead
        
        if (useMeshCrosses) {
            // Create cross material with TSL shader
            const crossMaterial = new MeshCrossMaterial({
                color: new THREE.Color(this.params.crosses.color),
                scale: this.params.crosses.scale,
                thickness: this.params.crosses.thickness,
                density: this.params.crosses.density,
                offset: this.params.crosses.offset
            });
            
            // Create plane for crosses
            const geometry = new THREE.PlaneGeometry(10, 10);
            this.crosses = new THREE.Mesh(geometry, crossMaterial);
            this.crosses.rotation.x = -Math.PI / 2;
            this.crosses.position.y = 0.001; // Slightly above the grid to avoid z-fighting
            this.scene.add(this.crosses);
            console.log('Mesh crosses added to scene');
        }
    }
}
