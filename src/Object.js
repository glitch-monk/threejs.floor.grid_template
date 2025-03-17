import * as THREE from 'three/webgpu';

export default class Object3D {
    constructor(scene) {
        this.scene = scene;
        this.params = {
            position: {
                x: 0,
                y: 0.1, // Half the object's height (0.2 scale) to rest on floor
                z: 0
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0
            },
            scale: 0.2,
            color: '#ffffff'
        };
        
        this.createObject();
    }
    
    createObject() {
        // Create a simple cube
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshStandardMaterial({ 
            color: this.params.color,
            roughness: 0.7,
            metalness: 0.3
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // Apply initial transform
        this.updateTransform();
        
        // Add to scene
        this.scene.add(this.mesh);
    }
    
    updateTransform() {
        if (!this.mesh) return;
        
        // Update position
        this.mesh.position.set(
            this.params.position.x,
            this.params.position.y,
            this.params.position.z
        );
        
        // Update rotation (in radians)
        this.mesh.rotation.set(
            THREE.MathUtils.degToRad(this.params.rotation.x),
            THREE.MathUtils.degToRad(this.params.rotation.y),
            THREE.MathUtils.degToRad(this.params.rotation.z)
        );
        
        // Update scale
        this.mesh.scale.setScalar(this.params.scale);
    }
    
    updateParameters(params) {
        // Update local parameters
        if (params.position) Object.assign(this.params.position, params.position);
        if (params.rotation) Object.assign(this.params.rotation, params.rotation);
        if (params.scale !== undefined) this.params.scale = params.scale;
        if (params.color !== undefined) {
            this.params.color = params.color;
            this.mesh.material.color.set(params.color);
        }
        
        // Update transform
        this.updateTransform();
    }
}
