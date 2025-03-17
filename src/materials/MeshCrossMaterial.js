import * as THREE from 'three/webgpu';
import { 
    uniform, uv, positionLocal, vec2, vec3, vec4, float, 
    mix, dFdx, dFdy, length, abs, fract, smoothstep, floor, max, color, sin, time
} from 'three/tsl';

/**
 * A material for rendering customizable crosses using TSL
 */
export class MeshCrossMaterial extends THREE.MeshBasicNodeMaterial {
    /**
     * Create a new cross material
     * @param {Object} options - Material options
     * @param {THREE.Color} options.color - Cross color
     * @param {number} options.scale - Cross scale factor
     * @param {number} options.thickness - Cross line thickness
     * @param {number} options.density - Cross density (number of crosses)
     * @param {THREE.Vector2|number[]} options.offset - Cross pattern offset
     * @param {boolean} options.antialiased - Whether to apply anti-aliasing
     * @param {string} options.reference - Reference coordinate system ('uv' or 'world')
     */
    constructor(options = {}) {
        const defaults = {
            color: new THREE.Color(0xffffff),
            scale: 0.1,
            thickness: 0.1,
            density: 5,
            offset: new THREE.Vector2(0, 0),
            antialiased: true,
            reference: 'uv'
        };

        const params = { ...defaults, ...options };
        
        super();
        
        this.side = THREE.DoubleSide;
        this.transparent = true;
        this.depthWrite = false;
        this.blending = THREE.NormalBlending;
        this.toneMapped = false;

        this.crossScale = params.scale;
        this.crossThickness = params.thickness;
        this.crossDensity = params.density;
        this.crossOffset = params.offset instanceof THREE.Vector2 
            ? params.offset 
            : new THREE.Vector2(
                Array.isArray(params.offset) ? params.offset[0] || 0 : params.offset || 0,
                Array.isArray(params.offset) ? params.offset[1] || 0 : params.offset || 0
            );
        this.color = params.color;
        this.antialiased = params.antialiased;
        this.reference = params.reference;

        this._setupTSL();
    }

    _setupTSL() {
        // Define uniforms
        const crossScale = uniform(this.crossScale);
        const crossThickness = uniform(this.crossThickness);
        const crossDensity = uniform(this.crossDensity);
        const crossColor = color(this.color);
        const crossOffset = uniform(this.crossOffset);
        
        // Get position and UV coordinates
        const position = positionLocal;
        const texCoord = uv();
        
        // Choose coordinate system based on reference
        const coord = this.reference === 'world' ? position : texCoord;
        
        // Scale UVs based on density
        const scaledUV = coord.mul(crossDensity.mul(2.0));
        
        // Apply offset
        const offsetUV = scaledUV.add(crossOffset.mul(0.5));
        
        // Calculate cell coordinates
        const cellCoord = floor(offsetUV);
        const cellUV = offsetUV.sub(cellCoord); // Local UV within cell (0-1)
        
        // Center coordinates within cell
        const centeredUV = cellUV.sub(0.5);
        
        // Calculate derivatives for proper anti-aliasing
        const uvDeriv = this.antialiased 
            ? vec2(length(dFdx(centeredUV)), length(dFdy(centeredUV)))
            : vec2(0.001, 0.001);
        
        // Calculate cross size with density adjustment
        const densityFactor = float(5.0).div(crossDensity).min(1.0);
        const crossSizeAdjusted = crossScale.mul(0.5).mul(densityFactor);
        
        // Calculate line width with thickness adjustment
        const thicknessFactor = float(3.0).div(crossDensity).min(1.0);
        const lineWidth = crossThickness.mul(0.02).mul(thicknessFactor);
        
        // Apply anti-aliasing using derivatives
        const lineAA = uvDeriv.mul(1.5); // 1.5 pixel wide smoothstep for better AA
        
        // Draw horizontal line of cross
        const horizontalLine = smoothstep(
            lineWidth.add(lineAA.y),
            lineWidth.sub(lineAA.y),
            abs(centeredUV.y)
        );
        
        // Draw vertical line of cross
        const verticalLine = smoothstep(
            lineWidth.add(lineAA.x),
            lineWidth.sub(lineAA.x),
            abs(centeredUV.x)
        );
        
        // Limit cross size with inverted masks
        const horizontalMask = float(1.0).sub(smoothstep(
            crossSizeAdjusted.sub(lineAA.x),
            crossSizeAdjusted.add(lineAA.x),
            abs(centeredUV.x)
        ));
        
        const verticalMask = float(1.0).sub(smoothstep(
            crossSizeAdjusted.sub(lineAA.y),
            crossSizeAdjusted.add(lineAA.y),
            abs(centeredUV.y)
        ));
        
        // Combine horizontal and vertical lines with masks
        const horizontalCross = horizontalLine.mul(horizontalMask);
        const verticalCross = verticalLine.mul(verticalMask);
        
        // Combine using max to create the cross pattern
        const crossPattern = max(horizontalCross, verticalCross);
        
        // Set the output color and opacity
        this.colorNode = vec4(
            crossColor.r, 
            crossColor.g, 
            crossColor.b, 
            crossPattern
        );
    }
}
