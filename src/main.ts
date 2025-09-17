import { ShaderApp } from './components/ShaderApp.js';

function main() {
  const canvas = document.getElementById('shader-canvas') as HTMLCanvasElement;
  
  if (!canvas) {
    console.error('Canvas element not found');
    return;
  }

  try {
    new ShaderApp(canvas);
    console.log('WebGL Shader Playground initialized successfully');
  } catch (error) {
    console.error('Failed to initialize WebGL:', error);
    
    // Show error message to user
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      z-index: 10000;
    `;
    errorDiv.innerHTML = `
      <h3>WebGL Error</h3>
      <p>Failed to initialize WebGL. Please ensure your browser supports WebGL.</p>
      <p>Error: ${error}</p>
    `;
    document.body.appendChild(errorDiv);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', main);
} else {
  main();
}