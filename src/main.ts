import { ShaderManager } from './components/ShaderManager';
import { UIManager } from './components/UIManager';
import { PerformanceMonitor } from './utils/PerformanceMonitor';

class ShaderStudio {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;
    private shaderManager: ShaderManager;
    private uiManager: UIManager;
    private performanceMonitor: PerformanceMonitor;
    private animationId: number = 0;

    constructor() {
        this.canvas = document.getElementById('shader-canvas') as HTMLCanvasElement;
        this.setupCanvas();
        this.gl = this.getWebGLContext();
        
        // Initialize managers
        this.shaderManager = new ShaderManager(this.gl);
        this.uiManager = new UIManager();
        this.performanceMonitor = new PerformanceMonitor();

        // Setup event listeners
        this.setupEventListeners();
        
        // Start render loop
        this.startRenderLoop();
        
        console.log('WebGL Shader Studio initialized successfully');
    }

    private setupCanvas(): void {
        const updateCanvasSize = () => {
            const devicePixelRatio = window.devicePixelRatio || 1;
            this.canvas.width = window.innerWidth * devicePixelRatio;
            this.canvas.height = window.innerHeight * devicePixelRatio;
            this.canvas.style.width = window.innerWidth + 'px';
            this.canvas.style.height = window.innerHeight + 'px';
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
    }

    private getWebGLContext(): WebGL2RenderingContext {
        const gl = this.canvas.getContext('webgl2', {
            antialias: true,
            alpha: false,
            depth: false,
            stencil: false,
            premultipliedAlpha: false,
            preserveDrawingBuffer: false,
            powerPreference: 'high-performance'
        });

        if (!gl) {
            throw new Error('WebGL2 not supported. Please use a modern browser.');
        }

        return gl;
    }

    private setupEventListeners(): void {
        // UI controls
        this.uiManager.onParameterChange((parameter, value) => {
            this.shaderManager.updateParameter(parameter, value);
        });

        this.uiManager.onTemplateChange((templateId) => {
            this.shaderManager.loadTemplate(templateId);
        });

        // Performance monitoring
        this.performanceMonitor.onFPSUpdate((fps) => {
            this.uiManager.updateFPS(fps);
        });

        // Handle window visibility for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(this.animationId);
            } else {
                this.startRenderLoop();
            }
        });
    }

    private startRenderLoop(): void {
        const render = (timestamp: number) => {
            this.performanceMonitor.startFrame();
            
            // Update shader time uniform
            this.shaderManager.updateTime(timestamp * 0.001);
            
            // Render current shader
            this.shaderManager.render();
            
            this.performanceMonitor.endFrame();
            this.animationId = requestAnimationFrame(render);
        };

        this.animationId = requestAnimationFrame(render);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ShaderStudio();
    } catch (error) {
        console.error('Failed to initialize WebGL Shader Studio:', error);
        // Show fallback message
        document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column; text-align: center; padding: 20px;">
                <h1 style="color: #ef4444; margin-bottom: 20px;">WebGL Not Supported</h1>
                <p style="color: #fff; font-size: 18px; margin-bottom: 10px;">Your browser doesn't support WebGL2.</p>
                <p style="color: #rgba(255,255,255,0.7);">Please use a modern browser like Chrome, Firefox, or Safari.</p>
            </div>
        `;
    }
});