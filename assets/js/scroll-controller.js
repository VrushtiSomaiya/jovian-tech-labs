/**
 * Jovian Tech Labs - Scroll Controller
 * Maps vertical scroll to horizontal service movement (AntimatterAI style)
 */

class ScrollController {
  constructor(container, services, particleSystem) {
    this.container = container;
    this.services = services;
    this.particleSystem = particleSystem;
    this.currentServiceIndex = 0;
    this.scrollProgress = 0;
    this.isScrolling = false;
    this.scrollVelocity = 0;
    
    this.setup();
  }
  
  setup() {
    // Calculate scroll boundaries
    this.containerHeight = this.container.offsetHeight;
    this.servicesWidth = Array.from(this.services).reduce((sum, service) => {
      return sum + service.offsetWidth + parseInt(getComputedStyle(service).marginRight) * 2;
    }, 0);
    
    // Set container width for horizontal scrolling
    const servicesContainer = this.container.querySelector('.services-container');
    if (servicesContainer) {
      servicesContainer.style.width = `${this.servicesWidth}px`;
    }
    
    this.bindEvents();
    this.update();
  }
  
  bindEvents() {
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const containerTop = this.container.offsetTop;
          const containerBottom = containerTop + this.containerHeight;
          const viewportHeight = window.innerHeight;
          
          // Check if we're in the services section
          if (scrollY + viewportHeight >= containerTop && scrollY <= containerBottom) {
            // Calculate scroll progress within this section
            const sectionStart = containerTop - viewportHeight;
            const sectionEnd = containerBottom;
            const scrollRange = sectionEnd - sectionStart;
            const scrollPosition = scrollY - sectionStart;
            
            this.scrollProgress = Math.max(0, Math.min(1, scrollPosition / scrollRange));
            
            // Map to service index
            const serviceCount = this.services.length;
            const targetIndex = Math.floor(this.scrollProgress * (serviceCount - 1));
            
            // Update service visibility and particle system
            this.updateServiceIndex(targetIndex);
            this.updateParticleMorph();
            this.updateServiceTransforms();
          }
          
          lastScrollY = scrollY;
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => {
      this.setup();
      this.update();
    });
    
    // Initial update
    handleScroll();
  }
  
  updateServiceIndex(targetIndex) {
    if (targetIndex !== this.currentServiceIndex && targetIndex >= 0 && targetIndex < this.services.length) {
      this.currentServiceIndex = targetIndex;
      
      // Update active state
      this.services.forEach((service, index) => {
        if (index === targetIndex) {
          service.classList.add('active');
        } else {
          service.classList.remove('active');
        }
      });
      
      // Update particle system
      if (this.particleSystem) {
        this.particleSystem.setService(targetIndex);
      }
    }
  }
  
  updateParticleMorph() {
    if (!this.particleSystem) return;
    
    // Calculate morph progress between services
    const serviceCount = this.services.length;
    const serviceSegment = 1 / (serviceCount - 1);
    const currentSegment = Math.floor(this.scrollProgress / serviceSegment);
    const segmentProgress = (this.scrollProgress % serviceSegment) / serviceSegment;
    
    this.particleSystem.updateMorphProgress(segmentProgress);
  }
  
  updateServiceTransforms() {
    // Calculate horizontal offset
    const maxOffset = this.servicesWidth - window.innerWidth;
    const offset = this.scrollProgress * maxOffset;
    
    // Apply transform to services container
    const servicesContainer = this.container.querySelector('.services-container');
    if (servicesContainer) {
      servicesContainer.style.transform = `translateX(-${offset}px)`;
    }
    
    // Fade services based on position
    this.services.forEach((service, index) => {
      const serviceSegment = 1 / (this.services.length - 1);
      const serviceCenter = index * serviceSegment;
      const distance = Math.abs(this.scrollProgress - serviceCenter) / serviceSegment;
      const opacity = Math.max(0.3, 1 - distance * 0.7);
      
      service.style.opacity = opacity;
      service.style.transform = `scale(${0.95 + (1 - distance) * 0.05})`;
    });
  }
  
  update() {
    this.updateServiceIndex(this.currentServiceIndex);
    this.updateParticleMorph();
    this.updateServiceTransforms();
  }
}

// Intersection Observer for lazy initialization
class ServiceSectionObserver {
  constructor(initCallback) {
    this.initCallback = initCallback;
    this.initialized = false;
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.initialized) {
          this.initialized = true;
          if (this.initCallback) {
            this.initCallback();
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '100px'
    });
  }
  
  observe(element) {
    this.observer.observe(element);
  }
}

// Export for use in other files
if (typeof window !== 'undefined') {
  window.ScrollController = ScrollController;
  window.ServiceSectionObserver = ServiceSectionObserver;
}

