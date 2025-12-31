/**
 * Jovian Tech Labs - Services Section Controller
 * Coordinates particle system, scroll mapping, and interactions
 */

class ServicesController {
  constructor() {
    this.particleSystem = null;
    this.scrollMapper = null;
    this.init();
  }
  
  init() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }
  
  setup() {
    // Wait a bit for DOM to be ready
    setTimeout(() => {
      // Initialize particle system
      if (typeof ServiceParticleSystem !== 'undefined') {
        const canvas = document.getElementById('services-canvas');
        if (canvas) {
          this.particleSystem = new ServiceParticleSystem('services-canvas');
        }
      }
      
      // Initialize scroll mapper
      if (typeof ScrollMapper !== 'undefined') {
        const section = document.getElementById('what-we-build');
        const container = document.getElementById('services-cards-container');
        if (section && container) {
          this.scrollMapper = new ScrollMapper('what-we-build', 'services-cards-container');
        }
      }
      
      // Listen for scroll updates
      window.addEventListener('servicescroll', (e) => {
        const { cardIndex, progress, totalCards } = e.detail;
        
        if (this.particleSystem) {
          this.particleSystem.setServiceIndex(cardIndex);
          
          // Calculate morph progress within card transition
          if (totalCards > 1) {
            // Map overall progress to per-card progress
            const cardProgress = (progress * (totalCards - 1)) % 1;
            this.particleSystem.setMorphProgress(cardProgress);
          } else {
            this.particleSystem.setMorphProgress(1);
          }
        }
      });
      
      // Card hover interactions
      const cards = document.querySelectorAll('.service-card');
      cards.forEach((card, index) => {
        card.addEventListener('mouseenter', () => {
          if (this.particleSystem) {
            this.particleSystem.setHoverIntensity(1.5);
          }
        });
        
        card.addEventListener('mouseleave', () => {
          if (this.particleSystem) {
            this.particleSystem.setHoverIntensity(1.0);
          }
        });
      });
    }, 100);
  }
}

if (typeof window !== 'undefined') {
  window.ServicesController = ServicesController;
}

