export const crossVertexShader = `
varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const crossFragmentShader = `
uniform vec3 uCrossColor;
uniform float uCrossThickness;
uniform float uCrossScale;
uniform float uCrossDensity;
uniform float uCrossOffset;
varying vec2 vUv;
varying vec3 vViewPosition;

// Get cross pattern
float getCross(vec2 p) {
    // Scale UVs to create cell grid based on density
    float cellSize = 1.0 / uCrossDensity;
    vec2 cell = floor(p / cellSize);
    vec2 cellUv = fract(p / cellSize);
    
    // Apply offset within cell
    cellUv = (cellUv - 0.5) + (uCrossOffset * 0.5);
    
    // Scale for cross size
    vec2 crossUv = cellUv / uCrossScale;
    
    // Compute derivatives for proper anti-aliasing
    vec2 ddx = dFdx(crossUv);
    vec2 ddy = dFdy(crossUv);
    vec2 fw = max(abs(ddx), abs(ddy)) * 2.0;
    
    // Create cross shape using multiple parallel lines
    vec2 absUv = abs(crossUv);
    float thickness = uCrossThickness * 0.5;
    
    // Create 5 parallel lines for thickness
    float lines = 0.0;
    for(float i = -2.0; i <= 2.0; i++) {
        // Vertical line
        float vLine = 1.0 - smoothstep(thickness - fw.x, thickness + fw.x, abs(absUv.x + i * thickness * 0.5));
        vLine *= step(absUv.y, 1.0); // Limit length
        
        // Horizontal line
        float hLine = 1.0 - smoothstep(thickness - fw.y, thickness + fw.y, abs(absUv.y + i * thickness * 0.5));
        hLine *= step(absUv.x, 1.0); // Limit length
        
        lines = max(lines, max(vLine, hLine));
    }
    
    return lines;
}

void main() {
    vec2 scaledUv = vUv * 10.0;
    
    // Get cross pattern
    float cross = getCross(scaledUv);
    
    // Distance fade
    float dist = length(vViewPosition);
    float fade = 1.0 - smoothstep(20.0, 40.0, dist);
    
    // Output final color with transparency
    vec3 baseColor = vec3(0.0);
    vec3 finalColor = mix(baseColor, uCrossColor, cross * fade);
    gl_FragColor = vec4(finalColor, cross * fade);
}
`;
