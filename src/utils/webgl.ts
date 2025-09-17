export class WebGLManager {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext;
  private currentProgram: WebGLProgram | null = null;
  private quadVAO: WebGLBuffer | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    // Try to get WebGL2 context first, fallback to WebGL1
    const gl = canvas.getContext('webgl2', {
      antialias: true,
      alpha: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    }) || canvas.getContext('webgl', {
      antialias: true,
      alpha: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    });

    if (!gl) {
      throw new Error('WebGL not supported');
    }

    this.gl = gl as WebGLRenderingContext;
    this.initializeQuad();
    this.setupViewport();
  }

  getContext(): WebGLRenderingContext {
    return this.gl;
  }

  private initializeQuad(): void {
    const gl = this.gl;
    
    // Create full-screen quad
    const vertices = new Float32Array([
      -1, -1,  0, 0,
       1, -1,  1, 0,
      -1,  1,  0, 1,
       1,  1,  1, 1
    ]);

    this.quadVAO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVAO);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  }

  setupViewport(): void {
    const gl = this.gl;
    const canvas = this.canvas;
    
    // Handle high-DPI displays
    const devicePixelRatio = window.devicePixelRatio || 1;
    const displayWidth = Math.floor(canvas.clientWidth * devicePixelRatio);
    const displayHeight = Math.floor(canvas.clientHeight * devicePixelRatio);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
  }

  createShader(source: string, type: number): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type);
    
    if (!shader) {
      throw new Error('Failed to create shader');
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(`Shader compilation error: ${error}`);
    }

    return shader;
  }

  createProgram(vertexSource: string, fragmentSource: string): WebGLProgram {
    const gl = this.gl;
    
    const vertexShader = this.createShader(vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = this.createShader(fragmentSource, gl.FRAGMENT_SHADER);
    
    const program = gl.createProgram();
    if (!program) {
      throw new Error('Failed to create program');
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const error = gl.getProgramInfoLog(program);
      gl.deleteProgram(program);
      throw new Error(`Program linking error: ${error}`);
    }

    // Clean up shaders
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    return program;
  }

  useProgram(program: WebGLProgram): void {
    const gl = this.gl;
    if (this.currentProgram !== program) {
      gl.useProgram(program);
      this.currentProgram = program;
    }
  }

  setUniform(program: WebGLProgram, name: string, type: string, value: any): void {
    const gl = this.gl;
    
    // Ensure we're using the correct program
    this.useProgram(program);
    
    const location = gl.getUniformLocation(program, name);
    
    if (location === null) return;

    switch (type) {
      case 'float':
        gl.uniform1f(location, value);
        break;
      case 'vec2':
        gl.uniform2fv(location, value);
        break;
      case 'vec3':
        gl.uniform3fv(location, value);
        break;
      case 'vec4':
        gl.uniform4fv(location, value);
        break;
      case 'int':
        gl.uniform1i(location, value);
        break;
      case 'bool':
        gl.uniform1i(location, value ? 1 : 0);
        break;
    }
  }

  drawQuad(program: WebGLProgram): void {
    const gl = this.gl;
    
    this.useProgram(program);
    
    // Bind quad buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadVAO);
    
    // Position attribute
    const positionLocation = gl.getAttribLocation(program, 'a_position');
    if (positionLocation >= 0) {
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 16, 0);
    }
    
    // UV attribute
    const uvLocation = gl.getAttribLocation(program, 'a_uv');
    if (uvLocation >= 0) {
      gl.enableVertexAttribArray(uvLocation);
      gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 16, 8);
    }
    
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  clear(): void {
    const gl = this.gl;
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  resize(): void {
    this.setupViewport();
  }
}