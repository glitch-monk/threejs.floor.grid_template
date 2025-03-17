import * as THREE from 'three/webgpu';
import { 
    uniform, uv, positionLocal, vec2, vec3, vec4, float, 
    mix, dFdx, dFdy, length, abs, fract, smoothstep, color, sin, time
} from 'three/tsl';

/**
 * Represents a line in the grid material
 */
export class MeshGridMaterialLine {
    /**
     * Create a new grid line
     * @param {THREE.Color} color - Line color
     * @param {number} frequency - Line frequency (1 = main lines, higher values = secondary lines)
     * @param {number} thickness - Line thickness
     * @param {number} opacity - Line opacity
     */
    constructor(color, frequency = 1, thickness = 0.02, opacity = 1.0) {
        this.color = color;
        this.frequency = frequency;
        this.thickness = thickness;
        this.opacity = opacity;
    }
}

/**
 * A material for rendering customizable grids using TSL
 */
export class MeshGridMaterial extends THREE.MeshBasicNodeMaterial {
    /**
     * Create a new grid material
     * @param {Object} options - Material options
     * @param {THREE.Color} options.color - Base color
     * @param {number} options.scale - Grid scale factor
     * @param {boolean} options.antialiased - Whether to apply anti-aliasing
     * @param {string} options.reference - Reference coordinate system ('uv' or 'world')
     * @param {MeshGridMaterialLine[]} options.lines - Array of grid lines
     */
    constructor(options = {}) {
        const defaults = {
            color: new THREE.Color(0xffffff),
            scale: 1.0,
            antialiased: true,
            reference: 'uv',
            lines: [
                new MeshGridMaterialLine(new THREE.Color(0xffffff), 1, 0.02, 1.0)
            ]
        };

        const params = { ...defaults, ...options };
        
        super();
        
        this.side = THREE.DoubleSide;
        this.transparent = true;
        this.depthWrite = false;
        this.blending = THREE.NormalBlending;
        this.toneMapped = false;

        this.scale = params.scale;
        this.color = params.color;
        this.antialiased = params.antialiased;
        this.reference = params.reference;
        this.lines = params.lines;

        this._setupTSL();
    }

    _setupTSL() {
        // Get the line parameters from the first line
        const line = this.lines[0];
        const lineThickness = uniform(line.thickness);
        const lineFrequency = uniform(line.frequency);
        const lineOpacity = uniform(line.opacity);
        const lineColor = color(line.color);
        
        // Get UV coordinates
        const uvCoord = uv();
        
        // Scale the UVs based on scale and frequency
        const scale = uniform(this.scale);
        const scaledUV = uvCoord.mul(scale.mul(10));
        
        // Create a grid pattern using fract
        const grid = fract(scaledUV);
        
        // Calculate line width based on thickness parameter
        // This directly controls the thickness of the lines
        // Scale the thickness to be more responsive (0.01-0.2 range)
        const lineWidth = lineThickness.mul(0.2);
        
        // Create lines where grid values are near 0 or 1
        // This creates grid lines at the edges of each cell
        const lines = float(1.0).sub(
            smoothstep(0.0, lineWidth, grid.x).mul(
                smoothstep(0.0, lineWidth, float(1.0).sub(grid.x))
            ).mul(
                smoothstep(0.0, lineWidth, grid.y)
            ).mul(
                smoothstep(0.0, lineWidth, float(1.0).sub(grid.y))
            )
        );
        
        // Apply opacity
        const finalOpacity = lines.mul(lineOpacity);
        
        // Set the output color with the grid pattern
        this.colorNode = vec4(
            lineColor.r,
            lineColor.g,
            lineColor.b,
            finalOpacity
        );
    }
}
