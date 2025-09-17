import { PerformanceMetrics } from '../types/shader.js';

export class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = 0;
  private frameTimeSamples: number[] = [];
  private maxSamples = 60;
  
  public metrics: PerformanceMetrics = {
    fps: 60,
    frameTime: 16.67,
    avgFrameTime: 16.67,
    worstFrameTime: 16.67
  };

  update(): void {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    
    if (this.lastTime > 0) {
      this.frameTimeSamples.push(deltaTime);
      
      if (this.frameTimeSamples.length > this.maxSamples) {
        this.frameTimeSamples.shift();
      }
      
      this.metrics.frameTime = deltaTime;
      this.metrics.fps = Math.round(1000 / deltaTime);
      
      // Calculate averages
      const sum = this.frameTimeSamples.reduce((a, b) => a + b, 0);
      this.metrics.avgFrameTime = sum / this.frameTimeSamples.length;
      this.metrics.worstFrameTime = Math.max(...this.frameTimeSamples);
    }
    
    this.lastTime = currentTime;
    this.frameCount++;
  }

  getQualityRecommendation(): 'high' | 'medium' | 'low' {
    if (this.metrics.fps >= 55) return 'high';
    if (this.metrics.fps >= 30) return 'medium';
    return 'low';
  }

  shouldReduceQuality(): boolean {
    return this.metrics.fps < 30 || this.metrics.avgFrameTime > 33.33;
  }
}