// Based on "The Best Darn Grid Shader (Yet)" by Ben Golus
// https://bgolus.medium.com/the-best-darn-grid-shader-yet-727f9278b9d8

export const gridVertexShader = `
varying vec2 vUv;
varying vec3 vViewPosition;

void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
}
`;

export const gridFragmentShader = `
uniform vec3 uGridColor;
uniform float uGridThickness;
uniform float uGridScale;
varying vec2 vUv;
varying vec3 vViewPosition;

float getGrid(vec2 uv, float scale, float thickness) {
    // Compute derivatives first to maintain precision
    vec2 coord = uv * scale;
    vec2 ddx = dFdx(coord);
    vec2 ddy = dFdy(coord);
    
    // Get grid lines using absolute value of position
    vec2 grid = abs(fract(coord - 0.5) - 0.5);
    
    // Compute anti-aliased lines using derivatives
    vec2 fw = max(abs(ddx), abs(ddy)) * thickness;
    vec2 lines = smoothstep(fw, vec2(0.0), grid);
    
    // Combine lines using max (OR) operation
    return max(lines.x, lines.y);
}

void main() {
    vec2 scaledUv = vUv * 10.0;
    
    // Fade grid based on distance using view position
    float dist = length(vViewPosition);
    float fade = 1.0 - smoothstep(20.0, 40.0, dist);
    
    float grid = getGrid(scaledUv, uGridScale, uGridThickness);
    
    // Base color (black) with light grey lines
    vec3 baseColor = vec3(0.0);
    vec3 finalColor = mix(baseColor, uGridColor, grid * fade);
    gl_FragColor = vec4(finalColor, 1.0);
}
`;
