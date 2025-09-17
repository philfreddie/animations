# WebGL Shader Playground

An ultra-modern, ultra-performant WebGL shader website featuring 20 premade shader templates with customizable options. Built with liquid glass design aesthetics and optimized for 60fps performance across all browsers.

![Mandelbrot Fractal](https://github.com/user-attachments/assets/30d8b605-51f9-408f-be8a-682f81b7c7ef)
![Plasma Effect](https://github.com/user-attachments/assets/f6ce3f80-86ed-42ca-a555-b3fe106c2231)
![Matrix Rain](https://github.com/user-attachments/assets/2c1ac181-d121-436b-b362-9a025f5d7e94)
![Fire Effect](https://github.com/user-attachments/assets/add0390c-d429-4a29-8a1c-7aa6c11cbc4f)

## Features

### 🎨 20 Stunning Shader Templates
- **Fractals**: Mandelbrot Set, Julia Set
- **Particles & Physics**: Particle Systems, Fluid Dynamics
- **Geometric**: Hexagonal Patterns, Voronoi Diagrams, Cellular Automata
- **Effects**: Plasma, Lightning, Fire, Matrix Rain, DNA Helix
- **Patterns**: Kaleidoscope, Spiral, Waves, Noise, Marble, Tunnel
- **3D**: Ray Marching, Ripples

### 🎛️ Real-time Customization
- **Color Controls**: Interactive color pickers for all shader parameters
- **Dynamic Parameters**: Zoom, scale, speed, intensity, and pattern-specific controls
- **Live Updates**: All changes applied in real-time without interruption

### 🚀 Performance Optimized
- **60fps Target**: Built for smooth animations across all devices
- **WebGL2/WebGL1**: Automatic fallback for maximum compatibility
- **Memory Efficient**: Optimized shader compilation and resource management
- **Frame Rate Monitoring**: Real-time FPS and frame time display

### 💎 Liquid Glass UI
- **Glassmorphism Design**: Modern translucent panels with backdrop blur
- **Responsive Layout**: Works perfectly on desktop and mobile
- **Smooth Animations**: Butter-smooth transitions and interactions

## Quick Start

### Prerequisites
- Node.js 16+ 
- Modern browser with WebGL support

### Installation

```bash
# Clone the repository
git clone https://github.com/philfreddie/animations.git
cd animations

# Install dependencies
npm install

# Start development server
npm run dev
```

The website will be available at `http://localhost:3000`

### Building for Production

```bash
# Build optimized version
npm run build

# Preview production build
npm run preview
```

## Usage

1. **Select a Template**: Click any shader template from the left panel
2. **Customize Parameters**: Use the controls panel to adjust colors, speeds, and effects
3. **Real-time Feedback**: Watch changes apply instantly with live FPS monitoring
4. **Experiment**: Try different combinations for unique visual effects

## Shader Templates

| Template | Description | Key Features |
|----------|-------------|--------------|
| Mandelbrot | Classic fractal pattern | Zoom, iterations, color mapping |
| Julia Set | Animated Julia fractal | Dynamic parameters, smooth animation |
| Particles | Animated particle system | Density, speed, color transitions |
| Geometric | Hexagonal tessellations | Scale, rotation, pattern density |
| Waves | Sine wave patterns | Frequency, amplitude, multi-layer |
| Noise | Perlin noise generator | Octaves, scale, fractal details |
| Kaleidoscope | Kaleidoscopic patterns | Segments, zoom, symmetry |
| Spiral | Spinning spiral effects | Spiral count, rotation speed |
| Plasma | Colorful plasma effects | Multi-color gradients, frequency |
| Ripples | Water ripple effects | Center point, wave frequency |
| Cellular | Cellular automata | Threshold, evolution rules |
| Voronoi | Voronoi diagrams | Scale, animation speed |
| Ray March | 3D sphere rendering | Radius, lighting, movement |
| Tunnel | Infinite tunnel effect | Speed, ring patterns |
| Lightning | Electric lightning bolts | Intensity, branching |
| DNA Helix | Double helix structure | Twist rate, colors |
| Matrix Rain | Digital rain effect | Speed, column density |
| Fluid | Fluid dynamics simulation | Viscosity, flow patterns |
| Marble | Marble texture patterns | Scale, color layering |
| Fire | Realistic fire effects | Intensity, flame colors |

## Technical Architecture

### Core Components
- **WebGL Manager**: Handles context creation, shader compilation, and rendering
- **Performance Monitor**: Tracks FPS and frame times for optimization
- **Shader Templates**: Modular system for easy addition of new effects
- **UI System**: Reactive controls that update shader uniforms in real-time

### Performance Features
- Efficient shader compilation with error handling
- Automatic quality scaling based on performance
- Memory-conscious resource management
- Cross-browser WebGL compatibility layer

## Browser Support

- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers with WebGL support

## Development

### Project Structure
```
src/
├── components/     # React-like components
├── shaders/        # Shader templates and fragments
├── utils/          # WebGL utilities and helpers
├── types/          # TypeScript type definitions
└── main.ts         # Application entry point
```

### Adding New Shaders
1. Create fragment shader in `src/shaders/fragments.ts`
2. Add template definition in `src/shaders/templates.ts`
3. Define uniforms and controls
4. Test across different browsers

### Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript checks
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-shader`)
3. Commit your changes (`git commit -m 'Add amazing shader'`)
4. Push to the branch (`git push origin feature/amazing-shader`)
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning, commercial, or personal projects.

## Acknowledgments

- WebGL community for shader inspirations
- Modern web development tools (Vite, TypeScript)
- Mathematical foundations from fractal and computer graphics research