import { Pane } from 'tweakpane';
import * as THREE from 'three/webgpu';

export default class Debug {
    constructor() {
        try {
            this.pane = new Pane();
            console.log('Debug panel initialized:', this.pane);
        } catch (error) {
            console.error('Failed to initialize debug panel:', error);
            this.pane = null;
        }
    }
    
    setupGridControls(floor) {
        if (!this.pane) return;
        
        try {
            // Grid controls
            const gridFolder = this.pane.addFolder({ title: 'Grid' });
            gridFolder.addBinding(floor.params.grid, 'scale', {
                min: 0,
                max: 1,
                step: 0.001,
                label: 'SCALE'
            }).on('change', ({ value }) => {
                floor.updateGridParameters({ scale: value });
                floor.updateCrosses();
            });
            
            gridFolder.addBinding(floor.params.grid, 'thickness', {
                min: 0.1,
                max: 10.0,
                step: 0.1,
                label: 'THICKNESS'
            }).on('change', ({ value }) => {
                floor.updateGridParameters({ thickness: value });
            });
            
            gridFolder.addBinding(floor.params.grid, 'color', {
                view: 'color',
                label: 'COLOR',
                format: 'hex'
            }).on('change', (ev) => {
                floor.updateGridParameters({ color: ev.value });
            });
            
            // Cross controls
            const crossFolder = this.pane.addFolder({ title: 'Cross' });
            
            crossFolder.addBinding(floor.params.crosses, 'scale', {
                min: 0,
                max: 1,
                step: 0.001,
                label: 'SCALE'
            }).on('change', ({ value }) => {
                floor.updateCrossParameters({ scale: value });
            });
            
            crossFolder.addBinding(floor.params.crosses, 'thickness', {
                min: 0,
                max: 0.2,
                step: 0.001,
                label: 'THICKNESS'
            }).on('change', ({ value }) => {
                floor.updateCrossParameters({ thickness: value });
            });
            
            crossFolder.addBinding(floor.params.crosses, 'offset', {
                min: 0,
                max: 1,
                step: 0.001,
                label: 'OFFSET'
            }).on('change', ({ value }) => {
                floor.updateCrossParameters({ offset: value });
            });
            
            crossFolder.addBinding(floor.params.crosses, 'density', {
                min: 1,
                max: 50,
                step: 1,
                label: 'DENSITY'
            }).on('change', ({ value }) => {
                floor.updateCrossParameters({ density: value });
            });
            
            crossFolder.addBinding(floor.params.crosses, 'color', {
                view: 'color',
                label: 'COLOR',
                format: 'hex'
            }).on('change', (ev) => {
                floor.updateCrossParameters({ color: ev.value });
            });
            
        } catch (error) {
            console.error('Failed to setup controls:', error);
        }
    }
    
    updateGridColor(floor, rgb) {
        const color = new THREE.Color(rgb.r/255, rgb.g/255, rgb.b/255);
        floor.updateGridParameters({ color });
    }
    
    updateCrossColor(floor, rgb) {
        const color = new THREE.Color(rgb.r/255, rgb.g/255, rgb.b/255);
        floor.updateCrossParameters({ color });
    }
    
    setupObjectControls(object) {
        if (!this.pane) return;
        
        try {
            const objectFolder = this.pane.addFolder({ title: 'Object' });
            
            // Position controls
            const posFolder = objectFolder.addFolder({ title: 'Position' });
            
            posFolder.addBinding(object.params.position, 'x', {
                min: -5,
                max: 5,
                step: 0.1,
                label: 'X'
            }).on('change', ({ value }) => {
                object.updateParameters({ position: { x: value } });
            });
            
            posFolder.addBinding(object.params.position, 'z', {
                min: -5,
                max: 5,
                step: 0.1,
                label: 'Z'
            }).on('change', ({ value }) => {
                object.updateParameters({ position: { z: value } });
            });
            
            // Rotation controls
            const rotFolder = objectFolder.addFolder({ title: 'Rotation' });
            
            rotFolder.addBinding(object.params.rotation, 'y', {
                min: -180,
                max: 180,
                step: 1,
                label: 'Y'
            }).on('change', ({ value }) => {
                object.updateParameters({ rotation: { y: value } });
            });
            
            // Color control
            objectFolder.addBinding(object.params, 'color', {
                view: 'color',
                label: 'COLOR',
                format: 'hex'
            }).on('change', (ev) => {
                object.updateParameters({ color: ev.value });
            });
            
        } catch (error) {
            console.error('Failed to setup object controls:', error);
        }
    }
}
