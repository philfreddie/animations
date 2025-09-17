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

    // 4. Perlin Noise Clouds
    {
        name: "Clouds",
        previewGradient: "linear-gradient(45deg, #74b9ff, #0984e3, #fff)",
        description: "Flowing cloud-like patterns using Perlin noise",
        fragmentShader: shaderHeader + `
    vec2 pos = uv * u_complexity;
    float time = u_time * u_speed * 0.1;
    
    pos += vec2(time * 0.5, time * 0.3);
    
    float cloud = fbm(pos);
    cloud += fbm(pos * 2.0 + time) * 0.5;
    cloud += fbm(pos * 4.0 + time * 1.5) * 0.25;
    
    cloud = pow(cloud, u_intensity);
    
    vec3 color = mix(u_color1, u_color2, cloud);
    color = mix(color, vec3(1.0), smoothstep(0.7, 1.0, cloud));
    
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
    },

    // 6. Electric Field
    {
        name: "Electric",
        previewGradient: "linear-gradient(45deg, #00f5ff, #0080ff, #fff)",
        description: "Electric field visualization with flowing lines",
        fragmentShader: shaderHeader + `
    vec2 pos = uv * u_complexity;
    float time = u_time * u_speed;
    
    float field = 0.0;
    
    // Create multiple charge points
    for(int i = 0; i < 4; i++) {
        float fi = float(i);
        vec2 charge = vec2(
            sin(time * 0.5 + fi * 1.57) * 2.0,
            cos(time * 0.3 + fi * 1.57) * 1.5
        );
        
        float dist = distance(pos, charge);
        field += 1.0 / (dist + 0.1);
    }
    
    field = pow(field * 0.1, u_intensity);
    
    // Add electric arcs
    float arc = sin(pos.x * 10.0 + field * 20.0 + time * 5.0);
    arc = pow(abs(arc), 5.0) * field;
    
    vec3 color = mix(u_color1, u_color2, field);
    color += arc * vec3(1.0, 1.0, 0.5);
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 7. Kaleidoscope
    {
        name: "Kaleidoscope",
        previewGradient: "linear-gradient(45deg, #ff9a9e, #fecfef, #fecfef)",
        description: "Symmetrical kaleidoscope patterns",
        fragmentShader: shaderHeader + `
    vec2 pos = uv;
    float time = u_time * u_speed;
    
    // Apply kaleidoscope symmetry
    float angle = atan(pos.y, pos.x);
    float dist = length(pos);
    
    angle = mod(angle, 3.14159 / 3.0);
    angle = abs(angle - 3.14159 / 6.0);
    
    pos = vec2(cos(angle), sin(angle)) * dist;
    pos *= u_complexity;
    
    // Create pattern
    float pattern = 0.0;
    for(int i = 1; i <= 5; i++) {
        float fi = float(i);
        pattern += sin(pos.x * fi + time) * sin(pos.y * fi + time * 1.2) / fi;
    }
    
    pattern = abs(pattern) * u_intensity;
    
    vec3 color = mix(u_color1, u_color2, pattern);
    color = mix(color, vec3(1.0), smoothstep(0.8, 1.0, pattern));
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 8. Water Ripples
    {
        name: "Ripples",
        previewGradient: "linear-gradient(45deg, #1e3c72, #2a5298, #74b9ff)",
        description: "Concentric water ripples with reflections",
        fragmentShader: shaderHeader + `
    vec2 pos = uv * u_complexity;
    float time = u_time * u_speed;
    
    float ripples = 0.0;
    
    // Multiple ripple sources
    vec2 sources[3];
    sources[0] = vec2(sin(time * 0.7) * 0.5, cos(time * 0.5) * 0.3);
    sources[1] = vec2(cos(time * 0.3) * 0.3, sin(time * 0.8) * 0.4);
    sources[2] = vec2(sin(time * 0.9) * 0.2, cos(time * 0.6) * 0.5);
    
    for(int i = 0; i < 3; i++) {
        float dist = distance(pos, sources[i]);
        ripples += sin(dist * 20.0 - time * 8.0) / (dist + 0.5);
    }
    
    ripples *= u_intensity;
    
    vec3 color = mix(u_color1, u_color2, ripples * 0.5 + 0.5);
    
    // Add reflection highlights
    float highlight = pow(max(0.0, ripples), 3.0);
    color += highlight * vec3(1.0, 1.0, 0.9);
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 9. DNA Helix
    {
        name: "DNA Helix",
        previewGradient: "linear-gradient(45deg, #a8edea, #fed6e3)",
        description: "Double helix structure with genetic patterns",
        fragmentShader: shaderHeader + `
    vec2 pos = uv;
    float time = u_time * u_speed;
    
    float y = pos.y * u_complexity;
    float helix1 = sin(y * 5.0 + time) * 0.2;
    float helix2 = sin(y * 5.0 + time + 3.14159) * 0.2;
    
    float dist1 = abs(pos.x - helix1);
    float dist2 = abs(pos.x - helix2);
    
    float strand1 = smoothstep(0.05, 0.0, dist1);
    float strand2 = smoothstep(0.05, 0.0, dist2);
    
    // Base pairs
    float pairs = step(0.1, mod(y + time * 0.5, 0.5));
    float connection = smoothstep(0.02, 0.0, abs(pos.x)) * pairs;
    
    float pattern = (strand1 + strand2 + connection) * u_intensity;
    
    vec3 color = mix(u_color1, u_color2, pattern);
    color = mix(vec3(0.0), color, pattern);
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 10. Matrix Rain
    {
        name: "Matrix",
        previewGradient: "linear-gradient(45deg, #000, #00ff41, #000)",
        description: "Digital rain effect inspired by The Matrix",
        fragmentShader: shaderHeader + `
    vec2 pos = uv * u_complexity * vec2(20.0, 10.0);
    float time = u_time * u_speed;
    
    vec2 grid = floor(pos);
    vec2 fpos = fract(pos);
    
    float rain = 0.0;
    float speed = time * 5.0 + noise(grid.x) * 10.0;
    
    float drop = fract(grid.y / 20.0 + speed);
    drop = smoothstep(0.9, 1.0, drop) * smoothstep(0.0, 0.1, drop);
    
    float char = step(0.5, noise(grid + floor(speed)));
    
    rain = drop * char;
    rain *= (1.0 - fpos.y) * u_intensity;
    
    vec3 color = mix(vec3(0.0), u_color1, rain);
    color += rain * u_color2 * 0.5;
    
    // Add glow
    color += rain * 0.2;
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 11. Geometric Tunnel
    {
        name: "Tunnel",
        previewGradient: "linear-gradient(45deg, #ff512f, #dd2476)",
        description: "Infinite geometric tunnel with perspective",
        fragmentShader: shaderHeader + `
    vec2 pos = uv;
    float time = u_time * u_speed;
    
    float dist = length(pos);
    float angle = atan(pos.y, pos.x);
    
    // Create tunnel effect
    vec2 tunnel = vec2(angle / (2.0 * 3.14159), 1.0 / dist);
    tunnel.y += time;
    tunnel *= u_complexity;
    
    float pattern = sin(tunnel.x * 20.0) * sin(tunnel.y * 10.0);
    pattern = abs(pattern) * u_intensity;
    
    // Add depth fade
    float fade = 1.0 / (1.0 + dist * 2.0);
    pattern *= fade;
    
    vec3 color = mix(u_color1, u_color2, pattern);
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 12. Lava Lamp
    {
        name: "Lava Lamp",
        previewGradient: "linear-gradient(45deg, #ff6b6b, #ee5a24, #ff9ff3)",
        description: "Flowing lava lamp with metaball effects",
        fragmentShader: shaderHeader + `
    vec2 pos = uv * u_complexity;
    float time = u_time * u_speed;
    
    float metaballs = 0.0;
    
    // Create multiple metaballs
    for(int i = 0; i < 5; i++) {
        float fi = float(i);
        vec2 ball = vec2(
            sin(time * 0.5 + fi * 2.0) * 0.8,
            cos(time * 0.3 + fi * 1.5) * 0.6 + sin(time * 0.8 + fi) * 0.2
        );
        
        float dist = distance(pos, ball);
        metaballs += 0.3 / (dist + 0.1);
    }
    
    metaballs = smoothstep(0.5, 1.0, metaballs * u_intensity);
    
    vec3 color = mix(u_color1, u_color2, metaballs);
    color = mix(vec3(0.1), color, metaballs);
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 13. Circuit Board
    {
        name: "Circuit",
        previewGradient: "linear-gradient(45deg, #00c9ff, #92fe9d)",
        description: "Electronic circuit patterns with data flow",
        fragmentShader: shaderHeader + `
    vec2 pos = uv * u_complexity * 10.0;
    float time = u_time * u_speed;
    
    vec2 grid = floor(pos);
    vec2 fpos = fract(pos);
    
    float circuit = 0.0;
    
    // Create grid lines
    circuit += step(0.9, fpos.x) + step(0.9, fpos.y);
    circuit += step(fpos.x, 0.1) + step(fpos.y, 0.1);
    
    // Add circuit nodes
    float node = length(fpos - 0.5);
    circuit += smoothstep(0.3, 0.2, node) * step(0.5, noise(grid));
    
    // Data flow
    float flow = sin(pos.x + pos.y + time * 5.0) * 0.5 + 0.5;
    circuit *= flow * u_intensity;
    
    vec3 color = mix(vec3(0.0), u_color1, circuit);
    color += circuit * u_color2 * 0.5;
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 14. Hexagon Grid
    {
        name: "Hexagons",
        previewGradient: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
        description: "Hexagonal grid with animated patterns",
        fragmentShader: shaderHeader + `
    vec2 pos = uv * u_complexity * 5.0;
    float time = u_time * u_speed;
    
    // Hexagonal coordinates
    vec2 h = vec2(1.0, 1.732);
    vec2 a = mod(pos, h) - h * 0.5;
    vec2 b = mod(pos - h * 0.5, h) - h * 0.5;
    
    vec2 gv = length(a) < length(b) ? a : b;
    float hex = length(gv);
    
    // Create hexagon pattern
    float hexPattern = smoothstep(0.3, 0.4, hex);
    hexPattern += smoothstep(0.1, 0.2, hex) * sin(time * 3.0 + pos.x + pos.y);
    
    hexPattern *= u_intensity;
    
    vec3 color = mix(u_color1, u_color2, hexPattern);
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 15. Plasma Storm
    {
        name: "Storm",
        previewGradient: "linear-gradient(45deg, #8360c3, #2ebf91, #ffd89b)",
        description: "Turbulent plasma storm with lightning",
        fragmentShader: shaderHeader + `
    vec2 pos = uv * u_complexity;
    float time = u_time * u_speed;
    
    // Create turbulent flow
    vec2 flow = vec2(
        fbm(pos + time * 0.1),
        fbm(pos + vec2(100.0) + time * 0.15)
    );
    
    pos += flow * 0.5;
    
    float storm = fbm(pos + time * 0.2);
    storm = pow(storm, 1.0 / u_intensity);
    
    // Add lightning bolts
    float lightning = smoothNoise(pos * 20.0 + time * 10.0);
    lightning = pow(lightning, 8.0) * storm;
    
    vec3 color = mix(u_color1, u_color2, storm);
    color += lightning * vec3(1.0, 1.0, 0.7) * 2.0;
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 16. Particle Field
    {
        name: "Particles",
        previewGradient: "linear-gradient(45deg, #ff9a9e, #fecfef, #00f2fe)",
        description: "Animated particle field with physics",
        fragmentShader: shaderHeader + `
    vec2 pos = uv * u_complexity * 8.0;
    float time = u_time * u_speed;
    
    vec2 grid = floor(pos);
    vec2 fpos = fract(pos);
    
    float particles = 0.0;
    
    for(int y = -1; y <= 1; y++) {
        for(int x = -1; x <= 1; x++) {
            vec2 neighbor = vec2(float(x), float(y));
            vec2 offset = neighbor - fpos;
            
            float particleTime = time + noise(grid + neighbor) * 10.0;
            vec2 particle = 0.5 + 0.3 * vec2(
                sin(particleTime),
                cos(particleTime * 1.2)
            );
            
            float dist = distance(particle, fpos);
            particles += smoothstep(0.2, 0.0, dist);
        }
    }
    
    particles *= u_intensity;
    
    vec3 color = mix(u_color1, u_color2, particles);
    color = mix(vec3(0.0), color, particles);
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 17. Neon Grid
    {
        name: "Neon Grid",
        previewGradient: "linear-gradient(45deg, #ff006e, #00f5ff, #fff)",
        description: "Retro neon grid with perspective",
        fragmentShader: shaderHeader + `
    vec2 pos = uv;
    float time = u_time * u_speed;
    
    // Create perspective effect
    pos.y = pos.y / (1.0 + pos.y * 0.5);
    pos *= u_complexity * 10.0;
    
    // Grid lines
    vec2 grid = abs(fract(pos) - 0.5);
    float lines = min(grid.x, grid.y);
    
    float neonGrid = smoothstep(0.05, 0.0, lines);
    
    // Add glow effect
    float glow = smoothstep(0.2, 0.0, lines) * 0.3;
    neonGrid += glow;
    
    // Add scan lines
    float scan = sin(pos.y * 2.0 + time * 5.0) * 0.1 + 0.9;
    neonGrid *= scan * u_intensity;
    
    vec3 color = mix(u_color1, u_color2, neonGrid);
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 18. Crystal Formation
    {
        name: "Crystals",
        previewGradient: "linear-gradient(45deg, #667eea, #764ba2, #f093fb)",
        description: "Growing crystal structures with facets",
        fragmentShader: shaderHeader + `
    vec2 pos = uv * u_complexity;
    float time = u_time * u_speed;
    
    float crystals = 0.0;
    
    // Create multiple crystal centers
    for(int i = 0; i < 6; i++) {
        float fi = float(i);
        vec2 center = vec2(
            sin(fi * 2.0 + time * 0.1) * 1.5,
            cos(fi * 1.5 + time * 0.15) * 1.2
        );
        
        vec2 delta = pos - center;
        float angle = atan(delta.y, delta.x);
        float dist = length(delta);
        
        // Create crystal facets
        float facets = abs(sin(angle * 6.0)) * 0.5 + 0.5;
        float crystal = smoothstep(0.8, 0.0, dist) * facets;
        
        crystals = max(crystals, crystal);
    }
    
    crystals *= u_intensity;
    
    vec3 color = mix(u_color1, u_color2, crystals);
    color += crystals * 0.3; // Add shine
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 19. Quantum Field
    {
        name: "Quantum",
        previewGradient: "linear-gradient(45deg, #43e97b, #38f9d7, #fff)",
        description: "Quantum field with probability waves",
        fragmentShader: shaderHeader + `
    vec2 pos = uv * u_complexity;
    float time = u_time * u_speed;
    
    float quantum = 0.0;
    
    // Create quantum interference patterns
    for(int i = 0; i < 8; i++) {
        float fi = float(i);
        vec2 source = vec2(
            sin(time * 0.3 + fi * 0.8) * 2.0,
            cos(time * 0.4 + fi * 0.9) * 1.5
        );
        
        float dist = distance(pos, source);
        float wave = sin(dist * 15.0 - time * 8.0);
        quantum += wave / (dist + 1.0);
    }
    
    // Add quantum fluctuations
    float fluctuation = smoothNoise(pos * 10.0 + time);
    quantum += fluctuation * 0.5;
    
    quantum = abs(quantum) * u_intensity * 0.1;
    
    vec3 color = mix(u_color1, u_color2, quantum);
    color += quantum * 0.2;
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    },

    // 20. Fire Simulation
    {
        name: "Fire",
        previewGradient: "linear-gradient(45deg, #ff0000, #ff4500, #ffd700)",
        description: "Realistic fire simulation with heat distortion",
        fragmentShader: shaderHeader + `
    vec2 pos = uv * u_complexity;
    float time = u_time * u_speed;
    
    // Fire movement
    pos.y += time * 0.5;
    
    // Create fire base
    float fire = 0.0;
    
    // Multiple octaves for realistic fire
    fire += fbm(pos * 2.0 + vec2(0.0, time)) * 0.5;
    fire += fbm(pos * 4.0 + vec2(sin(time), time * 2.0)) * 0.3;
    fire += fbm(pos * 8.0 + vec2(sin(time * 2.0), time * 3.0)) * 0.2;
    
    // Fire shape (higher = more flame-like)
    float height = 1.0 - abs(uv.y);
    fire *= height * height;
    
    // Fire intensity
    fire = pow(fire, 1.0 / u_intensity);
    
    // Fire colors (red to yellow to white)
    vec3 fireColor = vec3(1.0, fire * 0.8, fire * fire * 0.3);
    fireColor = mix(u_color1, fireColor, fire);
    fireColor = mix(fireColor, u_color2, fire * 0.5);
    
    vec3 color = fireColor * fire;
    
    fragColor = vec4(color, 1.0);
` + shaderFooter
    }
];

// Export for use in the application
export default shaderTemplates;