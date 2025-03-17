// Based on "The Best Darn Grid Shader (Yet)" by Ben Golus
// https://bgolus.medium.com/the-best-darn-grid-shader-yet-727f9278b9d8

export const gridVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const gridFragmentShader = `
uniform vec3 uGridColor;
uniform vec3 uCrossColor;
uniform float uLineWidth;
uniform float uCrossWidth;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vPosition;

float getGrid(vec2 position, float width) {
    vec2 grid = abs(fract(position - 0.5) - 0.5) / fwidth(position);
    float line = min(grid.x, grid.y);
    return 1.0 - min(line, 1.0);
}

float getCross(vec2 position, float width, float size) {
    // Find the nearest grid intersection point
    vec2 gp = floor(position) + 0.5;
    
    // Distance to the intersection point
    float dist = distance(position, gp);
    
    // Only draw crosses near intersection points
    if (dist > size) return 0.0;
    
    // Calculate cross pattern
    vec2 p = position - gp;
    float crossPattern = min(
        smoothstep(width * 0.5, 0.0, abs(p.x)),
        smoothstep(width * 0.5, 0.0, abs(p.y))
    );
    
    return crossPattern;
}

void main() {
    // Scale UVs to create grid cells
    vec2 scaledUv = vPosition.xz * 0.1;
    
    // Get grid lines
    float gridLines = getGrid(scaledUv, uLineWidth);
    
    // Get crosses at intersections
    float crosses = getCross(scaledUv, uCrossWidth, 0.05);
    
    // Background color
    vec3 backgroundColor = vec3(0.1, 0.1, 0.12);
    
    // Combine grid and crosses
    vec3 color = backgroundColor;
    color = mix(color, uGridColor, gridLines * uLineWidth * 10.0);
    color = mix(color, uCrossColor, crosses * uCrossWidth * 10.0);
    
    gl_FragColor = vec4(color, 1.0);
}
`;
