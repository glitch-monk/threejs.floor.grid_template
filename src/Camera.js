import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera {
    constructor(scene, renderer) {
        this.scene = scene;
        this.renderer = renderer;
        
        // Create camera
        this.instance = new THREE.PerspectiveCamera(
            45, // Reduced FOV for better perspective
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        
        // Set initial position
        this.instance.position.set(10, 10, 10);
        this.instance.lookAt(0, 0, 0);
        console.log('Camera created with position:', this.instance.position, 'and FOV:', this.instance.fov);
        
        // Setup controls
        this.controls = new OrbitControls(this.instance, this.renderer.domElement);
        this.controls.enableDamping = true;
        
        // Setup resize handler
        this.setupResizeHandler();
    }
    
    setupResizeHandler() {
        window.addEventListener('resize', () => {
            // Update camera aspect ratio
            this.instance.aspect = window.innerWidth / window.innerHeight;
            this.instance.updateProjectionMatrix();
            
            // Update renderer size
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    update() {
        // Update controls
        this.controls.update();
    }
}
