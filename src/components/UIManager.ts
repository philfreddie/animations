import { shaderTemplates } from '../shaders/templates_simple';

export class UIManager {
    private parameterChangeCallback: ((parameter: string, value: any) => void) | null = null;
    private templateChangeCallback: ((templateId: number) => void) | null = null;
    private sidebarToggle: HTMLElement;
    private sidebar: HTMLElement;
    private templatesContainer: HTMLElement;
    private fpsCounter: HTMLElement;

    constructor() {
        this.sidebarToggle = document.getElementById('sidebar-toggle')!;
        this.sidebar = document.getElementById('sidebar')!;
        this.templatesContainer = document.getElementById('templates-container')!;
        this.fpsCounter = document.getElementById('fps-counter')!;

        this.setupEventListeners();
        this.generateTemplateCards();
        this.initializeControls();
    }

    private setupEventListeners(): void {
        // Sidebar toggle
        this.sidebarToggle.addEventListener('click', () => {
            this.sidebar.classList.toggle('active');
        });

        // Control inputs
        this.setupControlListeners();
    }

    private setupControlListeners(): void {
        // Color controls
        const color1Input = document.getElementById('color1') as HTMLInputElement;
        const color2Input = document.getElementById('color2') as HTMLInputElement;

        color1Input.addEventListener('input', (e) => {
            this.parameterChangeCallback?.('color1', (e.target as HTMLInputElement).value);
        });

        color2Input.addEventListener('input', (e) => {
            this.parameterChangeCallback?.('color2', (e.target as HTMLInputElement).value);
        });

        // Slider controls
        const sliders = ['zoom', 'speed', 'intensity', 'complexity'];
        sliders.forEach(sliderId => {
            const slider = document.getElementById(sliderId) as HTMLInputElement;
            const valueDisplay = document.getElementById(`${sliderId}-value`)!;

            slider.addEventListener('input', (e) => {
                const value = (e.target as HTMLInputElement).value;
                valueDisplay.textContent = parseFloat(value).toFixed(1);
                this.parameterChangeCallback?.(sliderId, value);
            });
        });
    }

    private generateTemplateCards(): void {
        this.templatesContainer.innerHTML = '';

        shaderTemplates.forEach((template, index) => {
            const card = document.createElement('div');
            card.className = 'template-card';
            if (index === 0) card.classList.add('active');

            const preview = document.createElement('div');
            preview.className = 'template-preview';
            preview.style.background = template.previewGradient;

            const name = document.createElement('div');
            name.className = 'template-name';
            name.textContent = template.name;

            preview.appendChild(name);
            card.appendChild(preview);

            card.addEventListener('click', () => {
                // Remove active class from all cards
                document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
                // Add active class to clicked card
                card.classList.add('active');
                
                this.templateChangeCallback?.(index);
            });

            this.templatesContainer.appendChild(card);
        });
    }

    private initializeControls(): void {
        // Set initial values for sliders
        const sliders = [
            { id: 'zoom', value: 1.0 },
            { id: 'speed', value: 1.0 },
            { id: 'intensity', value: 1.0 },
            { id: 'complexity', value: 1.0 }
        ];

        sliders.forEach(({ id, value }) => {
            const slider = document.getElementById(id) as HTMLInputElement;
            const valueDisplay = document.getElementById(`${id}-value`)!;
            
            slider.value = value.toString();
            valueDisplay.textContent = value.toFixed(1);
        });
    }

    onParameterChange(callback: (parameter: string, value: any) => void): void {
        this.parameterChangeCallback = callback;
    }

    onTemplateChange(callback: (templateId: number) => void): void {
        this.templateChangeCallback = callback;
    }

    updateFPS(fps: number): void {
        this.fpsCounter.textContent = `${Math.round(fps)} FPS`;
        
        // Update FPS indicator color
        this.fpsCounter.className = 'fps-counter';
        if (fps >= 55) {
            this.fpsCounter.classList.add('fps-good');
        } else if (fps >= 30) {
            this.fpsCounter.classList.add('fps-ok');
        } else {
            this.fpsCounter.classList.add('fps-poor');
        }
    }

    showExportDialog(): void {
        // TODO: Implement export functionality
        alert('Export functionality coming soon!');
    }

    showAboutDialog(): void {
        const about = `
WebGL Shader Studio v1.0

An ultra-modern, high-performance shader editor featuring:
• 20 premade shader templates
• Real-time customizable parameters
• 60 FPS performance optimization
• Cross-browser WebGL2 compatibility
• Liquid glass UI design

Built with modern web technologies and optimized for all devices.
        `.trim();
        
        alert(about);
    }
}