export class PerformanceMonitor {
    private frameCount: number = 0;
    private lastTime: number = 0;
    private fpsUpdateCallback: ((fps: number) => void) | null = null;
    private frameStartTime: number = 0;
    private frameTimes: number[] = [];
    private readonly maxFrameTimesSamples = 60;

    constructor() {
        this.lastTime = performance.now();
    }

    startFrame(): void {
        this.frameStartTime = performance.now();
    }

    endFrame(): void {
        const now = performance.now();
        const frameTime = now - this.frameStartTime;
        
        // Store frame time for analysis
        this.frameTimes.push(frameTime);
        if (this.frameTimes.length > this.maxFrameTimesSamples) {
            this.frameTimes.shift();
        }

        this.frameCount++;
        
        // Update FPS every second
        if (now - this.lastTime >= 1000) {
            const fps = this.frameCount * 1000 / (now - this.lastTime);
            this.fpsUpdateCallback?.(fps);
            
            this.frameCount = 0;
            this.lastTime = now;
            
            // Log performance warnings if needed
            this.checkPerformanceIssues();
        }
    }

    private checkPerformanceIssues(): void {
        if (this.frameTimes.length < 30) return;

        const avgFrameTime = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
        const avgFPS = 1000 / avgFrameTime;

        if (avgFPS < 30) {
            console.warn(`Performance warning: Average FPS is ${avgFPS.toFixed(1)}`);
        }

        // Check for frame time spikes
        const maxFrameTime = Math.max(...this.frameTimes);
        if (maxFrameTime > 50) { // More than 50ms for a frame
            console.warn(`Performance warning: Frame time spike detected: ${maxFrameTime.toFixed(1)}ms`);
        }
    }

    onFPSUpdate(callback: (fps: number) => void): void {
        this.fpsUpdateCallback = callback;
    }

    getAverageFrameTime(): number {
        if (this.frameTimes.length === 0) return 0;
        return this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    }

    getFrameTimePercentile(percentile: number): number {
        if (this.frameTimes.length === 0) return 0;
        
        const sorted = [...this.frameTimes].sort((a, b) => a - b);
        const index = Math.floor((percentile / 100) * sorted.length);
        return sorted[Math.min(index, sorted.length - 1)];
    }

    // Static method to check WebGL capabilities
    static checkWebGLCapabilities(gl: WebGL2RenderingContext): void {
        console.log('WebGL Capabilities:');
        console.log('  Vendor:', gl.getParameter(gl.VENDOR));
        console.log('  Renderer:', gl.getParameter(gl.RENDERER));
        console.log('  Version:', gl.getParameter(gl.VERSION));
        console.log('  GLSL Version:', gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
        
        // Check for important extensions
        const extensions = [
            'EXT_color_buffer_float',
            'EXT_float_blend',
            'OES_texture_float_linear',
            'WEBGL_debug_renderer_info'
        ];

        extensions.forEach(ext => {
            const supported = gl.getExtension(ext) !== null;
            console.log(`  ${ext}: ${supported ? 'Supported' : 'Not supported'}`);
        });

        // Check limits
        console.log('  Max Texture Size:', gl.getParameter(gl.MAX_TEXTURE_SIZE));
        console.log('  Max Viewport Dims:', gl.getParameter(gl.MAX_VIEWPORT_DIMS));
        console.log('  Max Fragment Uniform Vectors:', gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS));
    }
}