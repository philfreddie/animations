import { WebGLManager } from '../utils/webgl.js';
import { PerformanceMonitor } from '../utils/performance.js';
import { ShaderTemplate } from '../types/shader.js';
import { shaderTemplates } from '../shaders/templates.js';

export class ShaderApp {
  private canvas: HTMLCanvasElement;
  private webgl: WebGLManager;
  private performance: PerformanceMonitor;
  private currentTemplate: ShaderTemplate;
  private currentProgram: WebGLProgram | null = null;
  private startTime: number;
  private animationId: number | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.webgl = new WebGLManager(canvas);
    this.performance = new PerformanceMonitor();
    this.currentTemplate = shaderTemplates[0];
    this.startTime = Date.now();

    this.setupEventListeners();
    this.initializeUI();
    this.loadShader(this.currentTemplate);
    this.startRenderLoop();
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', () => {
      this.webgl.resize();
    });
  }

  private initializeUI(): void {
    this.createTemplateButtons();
    this.createControls();
  }

  private createTemplateButtons(): void {
    const grid = document.getElementById('template-grid');
    if (!grid) return;

    grid.innerHTML = '';
    
    shaderTemplates.forEach((template, index) => {
      const button = document.createElement('div');
      button.className = `template-button ${index === 0 ? 'active' : ''}`;
      button.textContent = template.name;
      button.onclick = () => this.selectTemplate(template, button);
      grid.appendChild(button);
    });
  }

  private createControls(): void {
    const controls = document.getElementById('controls');
    if (!controls) return;

    this.updateControls();
  }

  private updateControls(): void {
    const controls = document.getElementById('controls');
    if (!controls) return;

    controls.innerHTML = '';

    Object.entries(this.currentTemplate.uniforms).forEach(([name, uniform]) => {
      const group = document.createElement('div');
      group.className = 'control-group';

      const label = document.createElement('label');
      label.textContent = uniform.label || name;
      group.appendChild(label);

      if (uniform.type === 'float' || uniform.type === 'int') {
        const input = document.createElement('input');
        input.type = 'range';
        input.min = (uniform.min || 0).toString();
        input.max = (uniform.max || 100).toString();
        input.step = (uniform.step || 0.1).toString();
        input.value = uniform.value.toString();
        
        const valueDisplay = document.createElement('span');
        valueDisplay.textContent = uniform.value.toString();
        
        input.addEventListener('input', () => {
          const value = uniform.type === 'int' ? parseInt(input.value) : parseFloat(input.value);
          uniform.value = value;
          valueDisplay.textContent = value.toString();
        });

        group.appendChild(input);
        group.appendChild(valueDisplay);
      } else if (uniform.type === 'vec3' && uniform.label?.includes('Color')) {
        // Color picker for vec3 colors
        const input = document.createElement('input');
        input.type = 'color';
        
        const vec3 = uniform.value as number[];
        const hex = this.vec3ToHex(vec3);
        input.value = hex;
        
        input.addEventListener('input', () => {
          const rgb = this.hexToVec3(input.value);
          uniform.value = rgb;
        });

        group.appendChild(input);
      }

      controls.appendChild(group);
    });
  }

  private vec3ToHex(vec3: number[]): string {
    const r = Math.round(vec3[0] * 255);
    const g = Math.round(vec3[1] * 255);
    const b = Math.round(vec3[2] * 255);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  private hexToVec3(hex: string): number[] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  }

  private selectTemplate(template: ShaderTemplate, button: HTMLElement): void {
    // Update active button
    document.querySelectorAll('.template-button').forEach(btn => {
      btn.classList.remove('active');
    });
    button.classList.add('active');

    this.currentTemplate = template;
    this.loadShader(template);
    this.updateControls();
  }

  private loadShader(template: ShaderTemplate): void {
    try {
      this.currentProgram = this.webgl.createProgram(
        template.vertexShader,
        template.fragmentShader
      );
    } catch (error) {
      console.error('Failed to load shader:', error);
    }
  }

  private updateUniforms(): void {
    if (!this.currentProgram) return;

    const gl = this.webgl.getContext();
    const time = (Date.now() - this.startTime) / 1000;
    
    // Use the program before setting uniforms
    this.webgl.useProgram(this.currentProgram);
    
    // Set time uniform
    const timeLocation = gl.getUniformLocation(this.currentProgram, 'u_time');
    if (timeLocation) {
      gl.uniform1f(timeLocation, time);
    }

    // Set resolution uniform
    const resolutionLocation = gl.getUniformLocation(this.currentProgram, 'u_resolution');
    if (resolutionLocation) {
      gl.uniform2f(resolutionLocation, this.canvas.width, this.canvas.height);
    }

    // Set custom uniforms
    Object.entries(this.currentTemplate.uniforms).forEach(([name, uniform]) => {
      this.webgl.setUniform(this.currentProgram!, name, uniform.type, uniform.value);
    });
  }

  private render(): void {
    this.performance.update();
    this.updateFPSDisplay();

    this.webgl.setupViewport();
    this.webgl.clear();

    if (this.currentProgram) {
      this.updateUniforms();
      this.webgl.drawQuad(this.currentProgram);
    }
  }

  private updateFPSDisplay(): void {
    const fpsElement = document.getElementById('fps');
    const frameTimeElement = document.getElementById('frame-time');
    
    if (fpsElement) {
      fpsElement.textContent = this.performance.metrics.fps.toString();
    }
    
    if (frameTimeElement) {
      frameTimeElement.textContent = `${this.performance.metrics.frameTime.toFixed(2)}ms`;
    }
  }

  private startRenderLoop(): void {
    const loop = () => {
      this.render();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  public destroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}