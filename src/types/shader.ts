export interface ShaderTemplate {
  id: string;
  name: string;
  description: string;
  vertexShader: string;
  fragmentShader: string;
  uniforms: Record<string, ShaderUniform>;
}

export interface ShaderUniform {
  type: 'float' | 'vec2' | 'vec3' | 'vec4' | 'int' | 'bool' | 'sampler2D';
  value: number | number[] | boolean | WebGLTexture;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

export interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  avgFrameTime: number;
  worstFrameTime: number;
}

export interface WebGLContextOptions {
  antialias: boolean;
  alpha: boolean;
  premultipliedAlpha: boolean;
  preserveDrawingBuffer: boolean;
  powerPreference: 'default' | 'high-performance' | 'low-power';
}