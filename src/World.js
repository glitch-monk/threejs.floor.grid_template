import * as THREE from 'three';
import Camera from './Camera.js';
import Floor from './Floor.js';
import Debug from './Debug.js';
import Object3D from './Object.js';

export default class World {
    constructor() {
        console.log('Initializing World...');
        
        // Bind animate method
        this.animate = this.animate.bind(this);
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1b191f); // Dark background
        console.log('Scene created with background color:', this.scene.background);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false
        });
        
        // Set renderer properties
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(1); // Use 1 for better performance
        this.renderer.setClearColor(0x1b191f, 1);
        
        // Add canvas to DOM
        document.body.appendChild(this.renderer.domElement);
        
        // Log initialization
        console.log('Renderer created:', {
            size: {
                width: this.renderer.domElement.width,
                height: this.renderer.domElement.height
            },
            pixelRatio: this.renderer.getPixelRatio()
        });
        
        // Initialize components
        this.camera = new Camera(this.scene, this.renderer);
        this.setupLights();
        this.floor = new Floor(this.scene);
        this.object = new Object3D(this.scene);
        
        // Debug panel
        this.debug = new Debug();
        this.setupDebug();
        
        // Start animation loop
        this.animate();
    }
    
    setupLights() {
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        // Add directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
    }
    
    setupDebug() {
        // Setup grid and line controls
        this.debug.setupGridControls(this.floor, this.floor);
        
        try {
            if (!this.debug.pane) return;
            
            // Setup object controls
            const objectFolder = this.debug.pane.addFolder({ title: 'Object' });
            
            // Position controls
            const posFolder = objectFolder.addFolder({ title: 'Position' });
            posFolder.addBinding(this.object.params.position, 'x', {
                min: -5,
                max: 5,
                step: 0.1,
                label: 'X'
            }).on('change', ({ value }) => this.object.updateTransform());
            
            posFolder.addBinding(this.object.params.position, 'y', {
                min: 0,
                max: 5,
                step: 0.1,
                label: 'Y'
            }).on('change', ({ value }) => this.object.updateTransform());
            
            posFolder.addBinding(this.object.params.position, 'z', {
                min: -5,
                max: 5,
                step: 0.1,
                label: 'Z'
            }).on('change', ({ value }) => this.object.updateTransform());
            
            // Rotation controls
            const rotFolder = objectFolder.addFolder({ title: 'Rotation' });
            rotFolder.addBinding(this.object.params.rotation, 'x', {
                min: 0,
                max: 360,
                step: 1,
                label: 'X'
            }).on('change', ({ value }) => this.object.updateTransform());
            
            rotFolder.addBinding(this.object.params.rotation, 'y', {
                min: 0,
                max: 360,
                step: 1,
                label: 'Y'
            }).on('change', ({ value }) => this.object.updateTransform());
            
            rotFolder.addBinding(this.object.params.rotation, 'z', {
                min: 0,
                max: 360,
                step: 1,
                label: 'Z'
            }).on('change', ({ value }) => this.object.updateTransform());
            
            // Scale and color controls
            objectFolder.addBinding(this.object.params, 'scale', {
                min: 0.1,
                max: 3,
                step: 0.1,
                label: 'SCALE'
            }).on('change', ({ value }) => this.object.updateTransform());
            
            objectFolder.addBinding(this.object.params, 'color', {
                view: 'color',
                label: 'COLOR',
                format: 'hex'
            }).on('change', (ev) => this.object.updateParameters({ color: ev.value }));
            
        } catch (error) {
            console.error('Failed to setup object controls:', error);
        }
    }
    
    animate() {
        // Request next frame first
        requestAnimationFrame(this.animate);
        
        try {
            // Update controls
            this.camera.update();
            
            // Clear the renderer
            this.renderer.clear();
            
            // Render scene
            this.renderer.render(this.scene, this.camera.instance);
            
            // Log first frame for debugging
            if (!this.hasLoggedFirstFrame) {
                console.log('First frame rendered successfully');
                console.log('Scene:', this.scene);
                console.log('Camera position:', this.camera.instance.position);
                console.log('Camera rotation:', this.camera.instance.rotation);
                console.log('Grid visible:', this.floor.grid.visible);
                console.log('Renderer size:', {
                    width: this.renderer.domElement.width,
                    height: this.renderer.domElement.height
                });
                this.hasLoggedFirstFrame = true;
            }
        } catch (error) {
            console.error('Error in animation loop:', error);
        }
    }
}
