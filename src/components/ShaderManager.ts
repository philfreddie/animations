import { shaderTemplates } from '../shaders/templates_simple';

export interface ShaderUniforms {
    u_time: number;
    u_resolution: [number, number];
    u_color1: [number, number, number];
    u_color2: [number, number, number];
    u_zoom: number;
    u_speed: number;
    u_intensity: number;
    u_complexity: number;
}

export class ShaderManager {
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram | null = null;
    private uniformLocations: { [key: string]: WebGLUniformLocation } = {};
    private uniforms: ShaderUniforms;
    private vertexBuffer: WebGLBuffer;
    private currentTemplateId: number = 0;

    // Vertex shader (same for all fragments)
    private vertexShaderSource = `#version 300 es
        in vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0);
        }
    `;

    constructor(gl: WebGL2RenderingContext) {
        this.gl = gl;
        this.uniforms = {
            u_time: 0,
            u_resolution: [gl.canvas.width, gl.canvas.height],
            u_color1: [0.392, 1.0, 0.855], // #64ffda
            u_color2: [0.4, 0.49, 0.918],  // #667eea
            u_zoom: 1.0,
            u_speed: 1.0,
            u_intensity: 1.0,
            u_complexity: 1.0
        };

        this.setupVertexBuffer();
        this.loadTemplate(0); // Load first template
    }

    private setupVertexBuffer(): void {
        // Create a full-screen quad
        const vertices = new Float32Array([
            -1.0, -1.0,
             1.0, -1.0,
            -1.0,  1.0,
             1.0,  1.0
        ]);

        this.vertexBuffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, vertices, this.gl.STATIC_DRAW);
    }

    private createShader(type: number, source: string): WebGLShader | null {
        const shader = this.gl.createShader(type);
        if (!shader) return null;

        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', this.gl.getShaderInfoLog(shader));
            this.gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
        const program = this.gl.createProgram();
        if (!program) return null;

        this.gl.attachShader(program, vertexShader);
        this.gl.attachShader(program, fragmentShader);
        this.gl.linkProgram(program);

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            console.error('Program linking error:', this.gl.getProgramInfoLog(program));
            this.gl.deleteProgram(program);
            return null;
        }

        return program;
    }

    private setupUniforms(program: WebGLProgram): void {
        this.uniformLocations = {};
        const uniformNames = ['u_time', 'u_resolution', 'u_color1', 'u_color2', 'u_zoom', 'u_speed', 'u_intensity', 'u_complexity'];
        
        uniformNames.forEach(name => {
            const location = this.gl.getUniformLocation(program, name);
            if (location) {
                this.uniformLocations[name] = location;
            }
        });
    }

    loadTemplate(templateId: number): void {
        if (templateId < 0 || templateId >= shaderTemplates.length) {
            console.error('Invalid template ID:', templateId);
            return;
        }

        this.currentTemplateId = templateId;
        const template = shaderTemplates[templateId];

        // Clean up previous program
        if (this.program) {
            this.gl.deleteProgram(this.program);
        }

        // Create shaders
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, this.vertexShaderSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, template.fragmentShader);

        if (!vertexShader || !fragmentShader) {
            console.error('Failed to create shaders for template:', template.name);
            return;
        }

        // Create program
        this.program = this.createProgram(vertexShader, fragmentShader);
        
        // Clean up shaders (no longer needed)
        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);

        if (!this.program) {
            console.error('Failed to create program for template:', template.name);
            return;
        }

        this.setupUniforms(this.program);
        console.log('Loaded shader template:', template.name);
    }

    updateParameter(parameter: string, value: any): void {
        switch (parameter) {
            case 'color1':
                this.uniforms.u_color1 = this.hexToRgb(value);
                break;
            case 'color2':
                this.uniforms.u_color2 = this.hexToRgb(value);
                break;
            case 'zoom':
                this.uniforms.u_zoom = parseFloat(value);
                break;
            case 'speed':
                this.uniforms.u_speed = parseFloat(value);
                break;
            case 'intensity':
                this.uniforms.u_intensity = parseFloat(value);
                break;
            case 'complexity':
                this.uniforms.u_complexity = parseFloat(value);
                break;
        }
    }

    updateTime(time: number): void {
        this.uniforms.u_time = time;
    }

    updateResolution(width: number, height: number): void {
        this.uniforms.u_resolution = [width, height];
    }

    render(): void {
        if (!this.program) return;

        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clearColor(0, 0, 0, 1);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        this.gl.useProgram(this.program);

        // Bind vertex buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        const positionLocation = this.gl.getAttribLocation(this.program, 'a_position');
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);

        // Set uniforms
        this.setUniforms();

        // Draw
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }

    private setUniforms(): void {
        Object.entries(this.uniformLocations).forEach(([name, location]) => {
            const key = name as keyof ShaderUniforms;
            const value = this.uniforms[key];

            switch (name) {
                case 'u_time':
                case 'u_zoom':
                case 'u_speed':
                case 'u_intensity':
                case 'u_complexity':
                    this.gl.uniform1f(location, value as number);
                    break;
                case 'u_resolution':
                    const res = value as [number, number];
                    this.gl.uniform2f(location, res[0], res[1]);
                    break;
                case 'u_color1':
                case 'u_color2':
                    const color = value as [number, number, number];
                    this.gl.uniform3f(location, color[0], color[1], color[2]);
                    break;
            }
        });
    }

    private hexToRgb(hex: string): [number, number, number] {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result 
            ? [
                parseInt(result[1], 16) / 255,
                parseInt(result[2], 16) / 255,
                parseInt(result[3], 16) / 255
              ]
            : [1, 1, 1];
    }

    getCurrentTemplateId(): number {
        return this.currentTemplateId;
    }
}