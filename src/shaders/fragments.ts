// Basic vertex shader for full-screen quad
export const basicVertexShader = `
attribute vec2 a_position;
attribute vec2 a_uv;
varying vec2 v_uv;

void main() {
    v_uv = a_uv;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

// Fractal - Mandelbrot Set
export const mandelbrotFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_zoom;
uniform vec2 u_center;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform int u_iterations;

void main() {
    vec2 c = (v_uv - 0.5) * u_zoom + u_center;
    vec2 z = vec2(0.0);
    
    int iterations = 0;
    for (int i = 0; i < 100; i++) {
        if (i >= u_iterations) break;
        if (dot(z, z) > 4.0) break;
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        iterations = i;
    }
    
    float t = float(iterations) / float(u_iterations);
    vec3 color = mix(u_color1, u_color2, t);
    
    // Add some animation
    color *= 1.0 + 0.1 * sin(u_time + t * 10.0);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Julia Set
export const juliaFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_zoom;
uniform vec2 u_c;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform int u_iterations;

void main() {
    vec2 z = (v_uv - 0.5) * u_zoom;
    vec2 c = u_c + vec2(sin(u_time * 0.2), cos(u_time * 0.3)) * 0.3;
    
    int iterations = 0;
    for (int i = 0; i < 100; i++) {
        if (i >= u_iterations) break;
        if (dot(z, z) > 4.0) break;
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
        iterations = i;
    }
    
    float t = float(iterations) / float(u_iterations);
    vec3 color = mix(u_color1, u_color2, t);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Particle System
export const particleFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_speed;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_density;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = v_uv;
    vec3 color = vec3(0.0);
    
    for (float i = 0.0; i < 50.0; i++) {
        if (i >= u_density) break;
        
        vec2 seed = vec2(i * 0.1, i * 0.2);
        vec2 pos = vec2(
            random(seed) + sin(u_time * u_speed + i) * 0.3,
            random(seed + 1.0) + cos(u_time * u_speed * 0.8 + i) * 0.3
        );
        pos = mod(pos, 1.0);
        
        float dist = distance(uv, pos);
        float particle = 1.0 - smoothstep(0.0, 0.02, dist);
        
        vec3 particleColor = mix(u_color1, u_color2, sin(u_time + i) * 0.5 + 0.5);
        color += particle * particleColor;
    }
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Geometric Patterns
export const geometricFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_rotation;

mat2 rotate(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = (v_uv - 0.5) * u_scale;
    uv = rotate(u_rotation + u_time * 0.1) * uv;
    
    // Create hexagonal pattern
    vec2 hex = vec2(uv.x * 2.0 / sqrt(3.0), uv.y + uv.x / sqrt(3.0));
    vec2 hexId = floor(hex);
    vec2 hexLocal = fract(hex) - 0.5;
    
    float d1 = abs(hexLocal.x);
    float d2 = abs(hexLocal.y * sqrt(3.0) + hexLocal.x) / 2.0;
    float d3 = abs(hexLocal.y * sqrt(3.0) - hexLocal.x) / 2.0;
    float dist = max(d1, max(d2, d3));
    
    float pattern = 1.0 - smoothstep(0.4, 0.45, dist);
    pattern += 0.5 * (1.0 - smoothstep(0.35, 0.4, dist));
    
    vec3 color = mix(u_color1, u_color2, pattern);
    color *= 1.0 + 0.2 * sin(u_time + length(hexId) * 2.0);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Wave Patterns
export const waveFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_frequency;
uniform float u_amplitude;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_speed;

void main() {
    vec2 uv = v_uv;
    
    // Create multiple wave layers
    float wave1 = sin(uv.x * u_frequency + u_time * u_speed) * u_amplitude;
    float wave2 = sin(uv.y * u_frequency * 0.7 + u_time * u_speed * 1.3) * u_amplitude * 0.8;
    float wave3 = sin((uv.x + uv.y) * u_frequency * 0.5 + u_time * u_speed * 0.8) * u_amplitude * 0.6;
    
    float combined = wave1 + wave2 + wave3;
    float dist = abs(uv.y - 0.5 - combined);
    
    float intensity = 1.0 - smoothstep(0.0, 0.1, dist);
    intensity += 0.5 * (1.0 - smoothstep(0.1, 0.2, dist));
    
    vec3 color = mix(u_color1, u_color2, intensity);
    color *= 1.0 + 0.3 * sin(u_time * 2.0 + uv.x * 10.0);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Noise Pattern
export const noiseFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_octaves;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    
    for (int i = 0; i < 6; i++) {
        if (float(i) >= u_octaves) break;
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    
    return value;
}

void main() {
    vec2 uv = v_uv * u_scale;
    
    float n = fbm(uv + u_time * 0.1);
    n = sin(n * 6.28318 + u_time);
    
    vec3 color = mix(u_color1, u_color2, n * 0.5 + 0.5);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Kaleidoscope
export const kaleidoscopeFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_segments;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_zoom;

mat2 rotate(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = (v_uv - 0.5) * u_zoom;
    
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    
    // Create kaleidoscope effect
    float segmentAngle = 6.28318 / u_segments;
    angle = mod(angle, segmentAngle);
    if (mod(floor(atan(uv.y, uv.x) / segmentAngle), 2.0) == 1.0) {
        angle = segmentAngle - angle;
    }
    
    uv = vec2(cos(angle), sin(angle)) * radius;
    uv = rotate(u_time * 0.1) * uv;
    
    // Create pattern
    float pattern = sin(uv.x * 10.0 + u_time) * cos(uv.y * 10.0 + u_time);
    pattern += sin(length(uv) * 20.0 - u_time * 5.0);
    
    vec3 color = mix(u_color1, u_color2, pattern * 0.5 + 0.5);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Spiral
export const spiralFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_spirals;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_speed;

void main() {
    vec2 uv = v_uv - 0.5;
    
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    
    float spiral = sin(radius * 20.0 - angle * u_spirals + u_time * u_speed);
    spiral = smoothstep(-0.1, 0.1, spiral);
    
    vec3 color = mix(u_color1, u_color2, spiral);
    color *= 1.0 - radius * 1.5; // Fade out at edges
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Plasma
export const plasmaFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_frequency;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;

void main() {
    vec2 uv = v_uv;
    
    float plasma = sin(uv.x * u_frequency + u_time);
    plasma += sin(uv.y * u_frequency + u_time * 1.2);
    plasma += sin((uv.x + uv.y) * u_frequency * 0.5 + u_time * 0.8);
    plasma += sin(sqrt(uv.x * uv.x + uv.y * uv.y) * u_frequency + u_time * 1.5);
    
    plasma = plasma / 4.0;
    
    vec3 color;
    if (plasma < 0.0) {
        color = mix(u_color1, u_color2, (plasma + 1.0) * 0.5);
    } else {
        color = mix(u_color2, u_color3, plasma);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Ripples
export const rippleFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_frequency;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_speed;
uniform vec2 u_center;

void main() {
    vec2 uv = v_uv;
    
    float dist = distance(uv, u_center);
    float ripple = sin(dist * u_frequency - u_time * u_speed);
    ripple = smoothstep(-0.2, 0.2, ripple);
    
    vec3 color = mix(u_color1, u_color2, ripple);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Cellular Automata
export const cellularFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_threshold;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = v_uv * u_scale;
    vec2 grid = floor(uv);
    
    float cell = random(grid + floor(u_time * 2.0));
    cell = step(u_threshold, cell);
    
    // Check neighbors for Conway's Game of Life style pattern
    float neighbors = 0.0;
    for (float x = -1.0; x <= 1.0; x++) {
        for (float y = -1.0; y <= 1.0; y++) {
            if (x == 0.0 && y == 0.0) continue;
            neighbors += step(u_threshold, random(grid + vec2(x, y) + floor(u_time * 2.0)));
        }
    }
    
    // Simple cellular automata rule
    if (cell > 0.5 && (neighbors < 2.0 || neighbors > 3.0)) {
        cell = 0.0;
    } else if (cell < 0.5 && neighbors == 3.0) {
        cell = 1.0;
    }
    
    vec3 color = mix(u_color1, u_color2, cell);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Voronoi
export const voronoiFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_speed;

vec2 random2(vec2 st) {
    st = vec2(dot(st, vec2(127.1, 311.7)), dot(st, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(st) * 43758.5453123);
}

void main() {
    vec2 uv = v_uv * u_scale;
    vec2 i_st = floor(uv);
    vec2 f_st = fract(uv);
    
    float minDist = 1.0;
    
    for (int y = -1; y <= 1; y++) {
        for (int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = random2(i_st + neighbor);
            point = 0.5 + 0.5 * sin(u_time * u_speed + 6.2831 * point);
            vec2 diff = neighbor + point - f_st;
            float dist = length(diff);
            minDist = min(minDist, dist);
        }
    }
    
    vec3 color = mix(u_color1, u_color2, minDist);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Ray Marching - Simple Sphere
export const rayMarchFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_radius;

float sphereSDF(vec3 p, float r) {
    return length(p) - r;
}

vec3 getNormal(vec3 p, float r) {
    float d = sphereSDF(p, r);
    vec2 e = vec2(0.01, 0.0);
    vec3 n = d - vec3(
        sphereSDF(p - e.xyy, r),
        sphereSDF(p - e.yxy, r),
        sphereSDF(p - e.yyx, r)
    );
    return normalize(n);
}

void main() {
    vec2 uv = (v_uv - 0.5) * 2.0;
    
    vec3 ro = vec3(0.0, 0.0, -2.0);
    vec3 rd = normalize(vec3(uv, 1.0));
    
    float t = 0.0;
    for (int i = 0; i < 64; i++) {
        vec3 p = ro + rd * t;
        p.x += sin(u_time) * 0.5;
        p.y += cos(u_time * 1.3) * 0.3;
        
        float d = sphereSDF(p, u_radius);
        if (d < 0.01) break;
        t += d;
        if (t > 10.0) break;
    }
    
    vec3 color = u_color1;
    if (t < 10.0) {
        vec3 p = ro + rd * t;
        p.x += sin(u_time) * 0.5;
        p.y += cos(u_time * 1.3) * 0.3;
        
        vec3 normal = getNormal(p, u_radius);
        float light = dot(normal, normalize(vec3(1.0, 1.0, -1.0)));
        color = mix(u_color1, u_color2, light * 0.5 + 0.5);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Tunnel
export const tunnelFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_speed;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_rings;

void main() {
    vec2 uv = v_uv - 0.5;
    
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);
    
    float tunnel = 1.0 / radius;
    tunnel += u_time * u_speed;
    
    float rings = sin(tunnel * u_rings) * 0.5 + 0.5;
    float spirals = sin(angle * 8.0 + tunnel * 2.0) * 0.5 + 0.5;
    
    float pattern = rings * spirals;
    vec3 color = mix(u_color1, u_color2, pattern);
    
    // Fade out at edges
    color *= 1.0 - smoothstep(0.3, 0.7, radius);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Lightning
export const lightningFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_intensity;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_branches;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    vec2 uv = v_uv;
    
    float lightning = 0.0;
    
    // Main bolt
    float bolt = abs(uv.y - 0.5 - noise(vec2(uv.x * 5.0, u_time * 2.0)) * 0.1);
    bolt = 1.0 - smoothstep(0.0, 0.02, bolt);
    lightning += bolt * u_intensity;
    
    // Branches
    for (float i = 0.0; i < u_branches; i++) {
        float branchX = 0.2 + i * 0.6 / u_branches;
        float branchY = 0.3 + noise(vec2(i, u_time)) * 0.4;
        
        vec2 branchPos = vec2(branchX, branchY);
        float branchDist = distance(uv, branchPos);
        
        float branch = 1.0 - smoothstep(0.0, 0.05, branchDist);
        lightning += branch * u_intensity * 0.5;
    }
    
    vec3 color = mix(u_color1, u_color2, lightning);
    color += lightning * vec3(1.0, 1.0, 0.8) * 2.0; // Bright flash
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// DNA Helix
export const dnaFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_twist;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_speed;

void main() {
    vec2 uv = v_uv;
    uv.x -= 0.5;
    
    float y = uv.y;
    float helix1 = sin(y * u_twist + u_time * u_speed) * 0.2;
    float helix2 = sin(y * u_twist + u_time * u_speed + 3.14159) * 0.2;
    
    float dist1 = abs(uv.x - helix1);
    float dist2 = abs(uv.x - helix2);
    
    float strand1 = 1.0 - smoothstep(0.0, 0.02, dist1);
    float strand2 = 1.0 - smoothstep(0.0, 0.02, dist2);
    
    // Connecting lines
    float connections = 0.0;
    float connectionSpacing = 0.1;
    if (mod(y, connectionSpacing) < 0.01) {
        float connDist = abs(uv.x - mix(helix1, helix2, 0.5));
        connections = 1.0 - smoothstep(0.0, 0.005, connDist);
        connections *= step(min(helix1, helix2), uv.x) * step(uv.x, max(helix1, helix2));
    }
    
    float pattern = strand1 + strand2 + connections;
    vec3 color = mix(u_color1, u_color2, pattern);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Matrix Rain
export const matrixFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_speed;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_columns;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = v_uv;
    
    float column = floor(uv.x * u_columns);
    float time = u_time * u_speed;
    
    float rainY = mod(time + random(vec2(column, 0.0)) * 10.0, 1.2) - 0.2;
    float dist = abs(uv.y - rainY);
    
    float intensity = 1.0 - smoothstep(0.0, 0.1, dist);
    intensity *= smoothstep(0.0, 0.05, rainY) * smoothstep(1.0, 0.95, rainY);
    
    // Add trailing effect
    if (uv.y < rainY) {
        float trail = exp(-(rainY - uv.y) * 10.0);
        intensity += trail * 0.3;
    }
    
    vec3 color = mix(u_color1, u_color2, intensity);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Fluid Dynamics Simulation
export const fluidFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_viscosity;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_flow;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = v_uv;
    
    // Simulate fluid flow
    vec2 flow = vec2(
        sin(uv.x * 5.0 + u_time * u_flow) * cos(uv.y * 3.0),
        cos(uv.y * 5.0 + u_time * u_flow) * sin(uv.x * 3.0)
    ) * u_viscosity;
    
    uv += flow * 0.1;
    
    float fluid = sin(uv.x * 10.0 + u_time) * cos(uv.y * 10.0 + u_time);
    fluid += sin(length(uv - 0.5) * 20.0 - u_time * 3.0) * 0.5;
    
    vec3 color = mix(u_color1, u_color2, fluid * 0.5 + 0.5);
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Fire/Flame Effect
export const fireFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_intensity;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    
    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    
    return value;
}

void main() {
    vec2 uv = v_uv;
    
    // Create flame shape
    float flame = fbm(vec2(uv.x * 3.0, uv.y * 2.0 - u_time * 2.0));
    flame += fbm(vec2(uv.x * 6.0, uv.y * 4.0 - u_time * 3.0)) * 0.5;
    
    // Make flames rise upward
    flame *= (1.0 - uv.y) * u_intensity;
    flame = smoothstep(0.0, 1.0, flame);
    
    // Create flame colors
    vec3 color = vec3(0.0);
    if (flame > 0.7) {
        color = mix(u_color2, u_color3, (flame - 0.7) / 0.3);
    } else if (flame > 0.3) {
        color = mix(u_color1, u_color2, (flame - 0.3) / 0.4);
    } else if (flame > 0.0) {
        color = mix(vec3(0.0), u_color1, flame / 0.3);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
`;

// Marble Texture
export const marbleFragment = `
precision highp float;
varying vec2 v_uv;

uniform float u_time;
uniform vec2 u_resolution;
uniform float u_scale;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    
    for (int i = 0; i < 4; i++) {
        value += amplitude * noise(st);
        st *= 2.0;
        amplitude *= 0.5;
    }
    
    return value;
}

void main() {
    vec2 uv = v_uv * u_scale;
    
    float marble = fbm(uv + fbm(uv + u_time * 0.1));
    marble = sin(marble * 6.28318 + uv.x * 3.0);
    
    vec3 color;
    if (marble < -0.3) {
        color = u_color1;
    } else if (marble < 0.3) {
        color = mix(u_color1, u_color2, (marble + 0.3) / 0.6);
    } else {
        color = mix(u_color2, u_color3, (marble - 0.3) / 0.7);
    }
    
    gl_FragColor = vec4(color, 1.0);
}
`;