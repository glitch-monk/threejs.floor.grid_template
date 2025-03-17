import * as THREE from 'three';
import { gridVertexShader, gridFragmentShader } from './materials/shaders/gridShader.js';
import { crossVertexShader, crossFragmentShader } from './materials/shaders/crossShader.js';

export default class Floor {
    constructor(scene) {
        this.scene = scene;
        this.params = {
            grid: {
                scale: 1,
                thickness: 2.0,
                color: '#D3D3D3'
            },
            crosses: {
                scale: 0.106,
                offset: 0,
                color: '#ff5f1f',
                thickness: 0.178,
                density: 18
            }
        };
        this.createFloor();
    }
    
    createFloor() {
        console.log('Creating floor...');
        
        try {
            const gridMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    uGridColor: { value: new THREE.Color(this.params.grid.color) },
                    uGridThickness: { value: this.params.grid.thickness },
                    uGridScale: { value: this.params.grid.scale }
                },
                vertexShader: gridVertexShader,
                fragmentShader: gridFragmentShader,
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
        if (params.scale !== undefined) {
            material.uniforms.uGridScale.value = params.scale;
        }
    }
    
    updateCrossParameters(params) {
        // Update local parameters
        Object.assign(this.params.crosses, params);
        
        if (!this.crosses) return;
        
        const material = this.crosses.material;
        if (params.color !== undefined) {
            material.uniforms.uCrossColor.value = new THREE.Color(params.color);
            material.needsUpdate = true;
        }
        if (params.thickness !== undefined) {
            material.uniforms.uCrossThickness.value = params.thickness;
        }
        if (params.scale !== undefined) {
            material.uniforms.uCrossScale.value = params.scale;
        }
        if (params.density !== undefined) {
            material.uniforms.uCrossDensity.value = params.density;
        }
        if (params.offset !== undefined) {
            material.uniforms.uCrossOffset.value = params.offset;
        }
    }
    
    updateCrosses() {
        // Remove previous crosses if they exist
        if (this.crosses) {
            this.scene.remove(this.crosses);
            this.crosses.geometry.dispose();
            this.crosses.material.dispose();
        }
        
        // Create cross material with shader
        const crossMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uCrossColor: { value: new THREE.Color(this.params.crosses.color) },
                uCrossThickness: { value: this.params.crosses.thickness },
                uCrossScale: { value: this.params.crosses.scale },
                uCrossDensity: { value: this.params.crosses.density },
                uCrossOffset: { value: this.params.crosses.offset }
            },
            vertexShader: crossVertexShader,
            fragmentShader: crossFragmentShader,
            transparent: true,
            side: THREE.DoubleSide
        });
        
        // Create plane for crosses
        const geometry = new THREE.PlaneGeometry(10, 10);
        this.crosses = new THREE.Mesh(geometry, crossMaterial);
        this.crosses.rotation.x = -Math.PI / 2;
        this.crosses.position.y = 0.001; // Slightly above the grid to avoid z-fighting
        this.scene.add(this.crosses);
    }
}
