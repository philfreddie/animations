export interface ShaderTemplate {
    name: string;
    fragmentShader: string;
    previewGradient: string;
    description: string;
}

const shaderHeader = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform float u_zoom;
uniform float u_speed;
uniform float u_intensity;
uniform float u_complexity;

out vec4 fragColor;

// Common utility functions
float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float smoothNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    
    float a = noise(i);
    float b = noise(i + vec2(1.0, 0.0));
    float c = noise(i + vec2(0.0, 1.0));
    float d = noise(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    vec2 frequency = vec2(1.0);
    
    for(int i = 0; i < 5; i++) {
        value += amplitude * smoothNoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    
    return value;
}

mat2 rotate(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
    uv *= u_zoom;
`;

const shaderFooter = `
}`;

export const shaderTemplates: ShaderTemplate[] = [
    // 1. Plasma Wave
    {
        name: "Plasma Wave",
        previewGradient: "linear-gradient(45deg, #ff006e, #8338ec, #3a86ff)",
        description: "Classic plasma effect with flowing waves",
        fragmentShader: shaderHeader + `
    float time = u_time * u_speed;
    
    float plasma = sin(uv.x * 10.0 + time) * 0.5 + 0.5;
    plasma += sin(uv.y * 10.0 + time * 1.2) * 0.5 + 0.5;
    plasma += sin((uv.x + uv.y) * 8.0 + time * 0.8) * 0.5 + 0.5;
    plasma += sin(length(uv * 8.0) + time * 1.5) * 0.5 + 0.5;
    
    plasma *= u_intensity;
    
    vec3 color = mix(u_color1, u_color2, plasma * 0.25);
    color += sin(plasma * 6.28) * 0.2;
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 2. Fractal Mandelbrot
    {
        name: "Mandelbrot",
        previewGradient: "linear-gradient(45deg, #000, #ff4081, #fff)",
        description: "Classic Mandelbrot fractal with smooth coloring",
        fragmentShader: shaderHeader + `
    vec2 c = uv * u_complexity * 2.0;
    vec2 z = vec2(0.0);
    float n = 0.0;
    
    for(int i = 0; i < 100; i++) {
        if(dot(z, z) > 4.0) break;
        z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c + sin(u_time * u_speed * 0.1) * 0.1;
        n++;
    }
    
    float t = n / 100.0;
    t = pow(t, u_intensity);
    
    vec3 color = mix(u_color1, u_color2, t);
    color = mix(color, vec3(1.0), smoothstep(0.9, 1.0, t));
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 3. Voronoi Cells
    {
        name: "Voronoi",
        previewGradient: "linear-gradient(45deg, #667eea, #764ba2)",
        description: "Animated Voronoi diagram with organic cells",
        fragmentShader: shaderHeader + `
    vec2 pos = uv * u_complexity * 5.0;
    float time = u_time * u_speed;
    
    vec2 grid = floor(pos);
    vec2 fpos = fract(pos);
    
    float minDist = 1.0;
    vec2 closestPoint;
    
    for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 point = 0.5 + 0.5 * sin(time + 6.28 * noise(grid + neighbor));
            vec2 diff = neighbor + point - fpos;
            float dist = length(diff);
            
            if(dist < minDist) {
                minDist = dist;
                closestPoint = grid + neighbor;
            }
        }
    }
    
    float cellValue = noise(closestPoint);
    float edge = smoothstep(0.0, 0.1, minDist);
    
    vec3 color = mix(u_color1, u_color2, cellValue);
    color = mix(vec3(1.0), color, edge);
    color *= u_intensity;
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 4. Simple Gradient Test
    {
        name: "Simple Gradient",
        previewGradient: "linear-gradient(45deg, #74b9ff, #0984e3)",
        description: "Simple gradient test for compatibility",
        fragmentShader: shaderHeader + `
    float gradient = uv.x * 0.5 + 0.5;
    gradient += sin(u_time * u_speed + uv.y * 5.0) * 0.1;
    
    vec3 color = mix(u_color1, u_color2, gradient);
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 5. Spiral Galaxy
    {
        name: "Galaxy",
        previewGradient: "linear-gradient(45deg, #000, #8e44ad, #e74c3c, #fff)",
        description: "Rotating spiral galaxy with star field",
        fragmentShader: shaderHeader + `
    float time = u_time * u_speed;
    vec2 pos = uv;
    
    float dist = length(pos);
    float angle = atan(pos.y, pos.x);
    
    // Create spiral arms
    float spiral = sin(angle * 3.0 - dist * 10.0 + time);
    spiral = pow(abs(spiral), 2.0 - u_intensity);
    
    // Add rotation
    angle += time * 0.2 + dist * 2.0;
    
    // Galaxy brightness falloff
    float brightness = 1.0 / (1.0 + dist * u_complexity);
    
    // Add noise for stars
    float stars = smoothNoise(pos * 50.0 + time * 0.1);
    stars = pow(stars, 8.0);
    
    vec3 color = mix(u_color1, u_color2, spiral);
    color *= brightness;
    color += stars * vec3(1.0, 0.9, 0.8) * 2.0;
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    }
];

// Export for use in the application
export default shaderTemplates;