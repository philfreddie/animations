export interface ShapeAPI {
  name: string;
  url: string;
  format: 'svg' | 'json';
  apiKey?: string;
}

// Free shape APIs
export const shapeAPIs: ShapeAPI[] = [
  {
    name: 'OpenShapes',
    url: 'https://api.openshapes.org/v1/shapes',
    format: 'svg'
  },
  {
    name: 'SVG Repo',
    url: 'https://www.svgrepo.com/api/icons',
    format: 'svg'
  }
];

export class ShapeImporter {
  private cache: Map<string, string> = new Map();

  async fetchShape(apiName: string, shapeId: string): Promise<string | null> {
    const cacheKey = `${apiName}-${shapeId}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const api = shapeAPIs.find(a => a.name === apiName);
    if (!api) {
      throw new Error(`Unknown API: ${apiName}`);
    }

    try {
      const response = await fetch(`${api.url}/${shapeId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const shapeData = await response.text();
      this.cache.set(cacheKey, shapeData);
      return shapeData;
    } catch (error) {
      console.error(`Failed to fetch shape from ${apiName}:`, error);
      return null;
    }
  }

  svgToShaderPath(svgString: string): Float32Array {
    // Simple SVG path extraction and conversion to shader-friendly format
    // This is a basic implementation - in production you'd want a more robust SVG parser
    const pathMatch = svgString.match(/d="([^"]+)"/);
    if (!pathMatch) {
      return new Float32Array([]);
    }

    const pathData = pathMatch[1];
    const coords: number[] = [];
    
    // Extract coordinate pairs (simplified)
    const matches = pathData.match(/[\d.-]+/g);
    if (matches) {
      for (let i = 0; i < matches.length - 1; i += 2) {
        coords.push(parseFloat(matches[i]));
        coords.push(parseFloat(matches[i + 1]));
      }
    }

    return new Float32Array(coords);
  }

  createCustomShapeTexture(gl: WebGLRenderingContext, pathData: Float32Array): WebGLTexture | null {
    // Create a texture from path data for use in shaders
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;

    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 512, 512);

    // Draw path
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < pathData.length - 1; i += 2) {
      const x = (pathData[i] / 100) * 512; // Normalize to canvas size
      const y = (pathData[i + 1] / 100) * 512;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();

    // Create WebGL texture
    const texture = gl.createTexture();
    if (!texture) return null;

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    return texture;
  }
}