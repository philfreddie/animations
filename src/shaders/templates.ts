import { ShaderTemplate } from '../types/shader.js';
import { 
  basicVertexShader, 
  mandelbrotFragment,
  juliaFragment,
  particleFragment,
  geometricFragment,
  waveFragment,
  noiseFragment,
  kaleidoscopeFragment,
  spiralFragment,
  plasmaFragment,
  rippleFragment,
  cellularFragment,
  voronoiFragment,
  rayMarchFragment,
  tunnelFragment,
  lightningFragment,
  dnaFragment,
  matrixFragment,
  fluidFragment,
  marbleFragment
} from './fragments.js';

export const shaderTemplates: ShaderTemplate[] = [
  {
    id: 'mandelbrot',
    name: 'Mandelbrot',
    description: 'Classic fractal pattern',
    vertexShader: basicVertexShader,
    fragmentShader: mandelbrotFragment,
    uniforms: {
      u_zoom: { type: 'float', value: 3.0, min: 0.1, max: 10.0, step: 0.1, label: 'Zoom' },
      u_center: { type: 'vec2', value: [-0.7, 0.0], label: 'Center' },
      u_color1: { type: 'vec3', value: [0.1, 0.2, 0.8], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [1.0, 0.5, 0.2], label: 'Color 2' },
      u_iterations: { type: 'int', value: 50, min: 10, max: 100, step: 1, label: 'Iterations' }
    }
  },
  {
    id: 'julia',
    name: 'Julia Set',
    description: 'Animated Julia fractal',
    vertexShader: basicVertexShader,
    fragmentShader: juliaFragment,
    uniforms: {
      u_zoom: { type: 'float', value: 2.0, min: 0.1, max: 5.0, step: 0.1, label: 'Zoom' },
      u_c: { type: 'vec2', value: [-0.8, 0.156], label: 'C Parameter' },
      u_color1: { type: 'vec3', value: [0.3, 0.1, 0.8], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [1.0, 0.8, 0.2], label: 'Color 2' },
      u_iterations: { type: 'int', value: 50, min: 10, max: 100, step: 1, label: 'Iterations' }
    }
  },
  {
    id: 'particles',
    name: 'Particles',
    description: 'Animated particle system',
    vertexShader: basicVertexShader,
    fragmentShader: particleFragment,
    uniforms: {
      u_speed: { type: 'float', value: 1.0, min: 0.1, max: 5.0, step: 0.1, label: 'Speed' },
      u_density: { type: 'float', value: 30.0, min: 5.0, max: 50.0, step: 1.0, label: 'Density' },
      u_color1: { type: 'vec3', value: [0.2, 0.8, 1.0], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [1.0, 0.3, 0.8], label: 'Color 2' }
    }
  },
  {
    id: 'geometric',
    name: 'Geometric',
    description: 'Hexagonal patterns',
    vertexShader: basicVertexShader,
    fragmentShader: geometricFragment,
    uniforms: {
      u_scale: { type: 'float', value: 5.0, min: 1.0, max: 20.0, step: 0.5, label: 'Scale' },
      u_rotation: { type: 'float', value: 0.0, min: 0.0, max: 6.28, step: 0.1, label: 'Rotation' },
      u_color1: { type: 'vec3', value: [0.1, 0.1, 0.3], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [0.9, 0.7, 0.2], label: 'Color 2' }
    }
  },
  {
    id: 'waves',
    name: 'Waves',
    description: 'Sine wave patterns',
    vertexShader: basicVertexShader,
    fragmentShader: waveFragment,
    uniforms: {
      u_frequency: { type: 'float', value: 10.0, min: 1.0, max: 50.0, step: 1.0, label: 'Frequency' },
      u_amplitude: { type: 'float', value: 0.1, min: 0.01, max: 0.5, step: 0.01, label: 'Amplitude' },
      u_speed: { type: 'float', value: 2.0, min: 0.1, max: 10.0, step: 0.1, label: 'Speed' },
      u_color1: { type: 'vec3', value: [0.0, 0.3, 0.8], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [0.8, 1.0, 0.3], label: 'Color 2' }
    }
  },
  {
    id: 'noise',
    name: 'Noise',
    description: 'Perlin noise patterns',
    vertexShader: basicVertexShader,
    fragmentShader: noiseFragment,
    uniforms: {
      u_scale: { type: 'float', value: 5.0, min: 1.0, max: 20.0, step: 0.5, label: 'Scale' },
      u_octaves: { type: 'float', value: 4.0, min: 1.0, max: 6.0, step: 1.0, label: 'Octaves' },
      u_color1: { type: 'vec3', value: [0.2, 0.1, 0.4], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [1.0, 0.8, 0.4], label: 'Color 2' }
    }
  },
  {
    id: 'kaleidoscope',
    name: 'Kaleidoscope',
    description: 'Kaleidoscopic patterns',
    vertexShader: basicVertexShader,
    fragmentShader: kaleidoscopeFragment,
    uniforms: {
      u_segments: { type: 'float', value: 6.0, min: 3.0, max: 12.0, step: 1.0, label: 'Segments' },
      u_zoom: { type: 'float', value: 2.0, min: 0.5, max: 5.0, step: 0.1, label: 'Zoom' },
      u_color1: { type: 'vec3', value: [1.0, 0.2, 0.8], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [0.2, 0.8, 1.0], label: 'Color 2' }
    }
  },
  {
    id: 'spiral',
    name: 'Spiral',
    description: 'Spinning spiral patterns',
    vertexShader: basicVertexShader,
    fragmentShader: spiralFragment,
    uniforms: {
      u_spirals: { type: 'float', value: 3.0, min: 1.0, max: 10.0, step: 0.5, label: 'Spirals' },
      u_speed: { type: 'float', value: 2.0, min: 0.1, max: 10.0, step: 0.1, label: 'Speed' },
      u_color1: { type: 'vec3', value: [0.8, 0.1, 0.3], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [0.1, 0.8, 0.9], label: 'Color 2' }
    }
  },
  {
    id: 'plasma',
    name: 'Plasma',
    description: 'Colorful plasma effect',
    vertexShader: basicVertexShader,
    fragmentShader: plasmaFragment,
    uniforms: {
      u_frequency: { type: 'float', value: 5.0, min: 1.0, max: 20.0, step: 0.5, label: 'Frequency' },
      u_color1: { type: 'vec3', value: [1.0, 0.0, 0.5], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [0.0, 1.0, 0.5], label: 'Color 2' },
      u_color3: { type: 'vec3', value: [0.5, 0.0, 1.0], label: 'Color 3' }
    }
  },
  {
    id: 'ripples',
    name: 'Ripples',
    description: 'Water ripple effects',
    vertexShader: basicVertexShader,
    fragmentShader: rippleFragment,
    uniforms: {
      u_frequency: { type: 'float', value: 15.0, min: 5.0, max: 50.0, step: 1.0, label: 'Frequency' },
      u_speed: { type: 'float', value: 3.0, min: 0.5, max: 10.0, step: 0.1, label: 'Speed' },
      u_center: { type: 'vec2', value: [0.5, 0.5], label: 'Center' },
      u_color1: { type: 'vec3', value: [0.1, 0.3, 0.8], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [0.8, 0.9, 1.0], label: 'Color 2' }
    }
  },
  {
    id: 'cellular',
    name: 'Cellular',
    description: 'Cellular automata patterns',
    vertexShader: basicVertexShader,
    fragmentShader: cellularFragment,
    uniforms: {
      u_scale: { type: 'float', value: 20.0, min: 5.0, max: 50.0, step: 1.0, label: 'Scale' },
      u_threshold: { type: 'float', value: 0.5, min: 0.1, max: 0.9, step: 0.01, label: 'Threshold' },
      u_color1: { type: 'vec3', value: [0.0, 0.0, 0.0], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [1.0, 1.0, 1.0], label: 'Color 2' }
    }
  },
  {
    id: 'voronoi',
    name: 'Voronoi',
    description: 'Voronoi diagrams',
    vertexShader: basicVertexShader,
    fragmentShader: voronoiFragment,
    uniforms: {
      u_scale: { type: 'float', value: 5.0, min: 1.0, max: 20.0, step: 0.5, label: 'Scale' },
      u_speed: { type: 'float', value: 1.0, min: 0.1, max: 5.0, step: 0.1, label: 'Speed' },
      u_color1: { type: 'vec3', value: [0.2, 0.1, 0.8], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [0.9, 0.8, 0.1], label: 'Color 2' }
    }
  },
  {
    id: 'raymarch',
    name: 'Ray March',
    description: '3D sphere ray marching',
    vertexShader: basicVertexShader,
    fragmentShader: rayMarchFragment,
    uniforms: {
      u_radius: { type: 'float', value: 0.5, min: 0.1, max: 2.0, step: 0.1, label: 'Radius' },
      u_color1: { type: 'vec3', value: [0.1, 0.1, 0.1], label: 'Background' },
      u_color2: { type: 'vec3', value: [1.0, 0.5, 0.2], label: 'Sphere' }
    }
  },
  {
    id: 'tunnel',
    name: 'Tunnel',
    description: 'Infinite tunnel effect',
    vertexShader: basicVertexShader,
    fragmentShader: tunnelFragment,
    uniforms: {
      u_speed: { type: 'float', value: 2.0, min: 0.1, max: 10.0, step: 0.1, label: 'Speed' },
      u_rings: { type: 'float', value: 10.0, min: 2.0, max: 50.0, step: 1.0, label: 'Rings' },
      u_color1: { type: 'vec3', value: [0.8, 0.2, 0.9], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [0.1, 0.9, 0.8], label: 'Color 2' }
    }
  },
  {
    id: 'lightning',
    name: 'Lightning',
    description: 'Electric lightning bolts',
    vertexShader: basicVertexShader,
    fragmentShader: lightningFragment,
    uniforms: {
      u_intensity: { type: 'float', value: 2.0, min: 0.5, max: 5.0, step: 0.1, label: 'Intensity' },
      u_branches: { type: 'float', value: 5.0, min: 1.0, max: 10.0, step: 1.0, label: 'Branches' },
      u_color1: { type: 'vec3', value: [0.1, 0.0, 0.2], label: 'Background' },
      u_color2: { type: 'vec3', value: [0.8, 0.9, 1.0], label: 'Lightning' }
    }
  },
  {
    id: 'dna',
    name: 'DNA Helix',
    description: 'Double helix structure',
    vertexShader: basicVertexShader,
    fragmentShader: dnaFragment,
    uniforms: {
      u_twist: { type: 'float', value: 15.0, min: 5.0, max: 30.0, step: 1.0, label: 'Twist' },
      u_speed: { type: 'float', value: 1.0, min: 0.1, max: 5.0, step: 0.1, label: 'Speed' },
      u_color1: { type: 'vec3', value: [0.1, 0.8, 0.3], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [0.8, 0.3, 0.1], label: 'Color 2' }
    }
  },
  {
    id: 'matrix',
    name: 'Matrix Rain',
    description: 'Digital rain effect',
    vertexShader: basicVertexShader,
    fragmentShader: matrixFragment,
    uniforms: {
      u_speed: { type: 'float', value: 1.0, min: 0.1, max: 5.0, step: 0.1, label: 'Speed' },
      u_columns: { type: 'float', value: 40.0, min: 10.0, max: 100.0, step: 1.0, label: 'Columns' },
      u_color1: { type: 'vec3', value: [0.0, 0.0, 0.0], label: 'Background' },
      u_color2: { type: 'vec3', value: [0.0, 1.0, 0.0], label: 'Rain' }
    }
  },
  {
    id: 'fluid',
    name: 'Fluid',
    description: 'Fluid dynamics simulation',
    vertexShader: basicVertexShader,
    fragmentShader: fluidFragment,
    uniforms: {
      u_viscosity: { type: 'float', value: 1.0, min: 0.1, max: 5.0, step: 0.1, label: 'Viscosity' },
      u_flow: { type: 'float', value: 1.0, min: 0.1, max: 5.0, step: 0.1, label: 'Flow' },
      u_color1: { type: 'vec3', value: [0.2, 0.4, 0.8], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [0.8, 0.6, 0.2], label: 'Color 2' }
    }
  },
  {
    id: 'marble',
    name: 'Marble',
    description: 'Marble texture patterns',
    vertexShader: basicVertexShader,
    fragmentShader: marbleFragment,
    uniforms: {
      u_scale: { type: 'float', value: 3.0, min: 1.0, max: 10.0, step: 0.5, label: 'Scale' },
      u_color1: { type: 'vec3', value: [0.9, 0.9, 0.9], label: 'Color 1' },
      u_color2: { type: 'vec3', value: [0.6, 0.6, 0.6], label: 'Color 2' },
      u_color3: { type: 'vec3', value: [0.3, 0.3, 0.3], label: 'Color 3' }
    }
  }
];