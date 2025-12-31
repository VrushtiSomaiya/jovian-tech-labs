/**
 * Jovian Tech Labs - Scroll Mapping Controller
 * Maps vertical scroll to horizontal card movement
 */

class ScrollMapper {
  constructor(containerId, cardsContainerId) {
    this.container = document.getElementById(containerId);
    this.cardsContainer = document.getElementById(cardsContainerId);
    if (!this.container || !this.cardsContainer) return;
    
    this.cards = Array.from(this.cardsContainer.querySelectorAll('.service-card'));
    this.totalCards = this.cards.length;
    
    this.scrollStart = 0;
    this.scrollEnd = 0;
    this.scrollRange = 0;
    this.currentProgress = 0;
    this.currentCardIndex = 0;
    
    this.setupIntersectionObserver();
    this.init();
  }
  
  setupIntersectionObserver() {
    const updateBounds = () => {
      const rect = this.container.getBoundingClientRect();
      this.scrollStart = window.pageYOffset + rect.top - window.innerHeight * 0.5;
      this.scrollEnd = window.pageYOffset + rect.top + rect.height + window.innerHeight * 0.5;
      this.scrollRange = this.scrollEnd - this.scrollStart;
    };
    
    updateBounds();
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateBounds();
        }
      });
    }, {
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });
    
    observer.observe(this.container);
    window.addEventListener('resize', updateBounds);
  }
  
  init() {
    // Wait for layout to stabilize
    requestAnimationFrame(() => {
      // Calculate card positions
      this.cardWidth = this.cards[0]?.offsetWidth || 400;
      this.cardSpacing = 100;
      
      // Setup initial positions
      this.updateCardPositions(0);
      
      // Bind scroll handler
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
      window.addEventListener('resize', () => {
        this.handleResize();
        // Recalculate scroll bounds on resize
        const rect = this.container.getBoundingClientRect();
        this.scrollStart = window.pageYOffset + rect.top - window.innerHeight * 0.5;
        this.scrollEnd = window.pageYOffset + rect.top + rect.height + window.innerHeight * 0.5;
        this.scrollRange = this.scrollEnd - this.scrollStart;
        this.handleScroll();
      });
      
      // Initial calculation
      this.handleScroll();
    });
  }
  
  handleResize() {
    this.cardWidth = this.cards[0]?.offsetWidth || 400;
    this.updateCardPositions(this.currentProgress);
  }
  
  handleScroll() {
    const scrollY = window.pageYOffset || window.scrollY;
    const rect = this.container.getBoundingClientRect();
    
    // Recalculate bounds if needed
    if (this.scrollRange === undefined || this.scrollRange <= 0) {
      this.scrollStart = scrollY + rect.top - window.innerHeight * 0.5;
      this.scrollEnd = scrollY + rect.top + rect.height + window.innerHeight * 0.5;
      this.scrollRange = this.scrollEnd - this.scrollStart;
    }
    
    if (scrollY < this.scrollStart) {
      this.currentProgress = 0;
    } else if (scrollY > this.scrollEnd) {
      this.currentProgress = 1;
    } else {
      this.currentProgress = (scrollY - this.scrollStart) / this.scrollRange;
      this.currentProgress = Math.max(0, Math.min(1, this.currentProgress));
    }
    
    // Calculate which card should be active
    const newCardIndex = Math.min(
      Math.floor(this.currentProgress * (this.totalCards - 1)),
      this.totalCards - 1
    );
    this.currentCardIndex = Math.max(0, newCardIndex);
    
    // Update card positions
    this.updateCardPositions(this.currentProgress);
    
    // Dispatch custom event for other systems
    this.dispatchUpdateEvent();
  }
  
  updateCardPositions(progress) {
    const wrapperWidth = this.cardsContainer.parentElement.offsetWidth;
    const totalWidth = this.cardWidth * this.totalCards + this.cardSpacing * (this.totalCards - 1);
    const maxOffset = Math.max(0, totalWidth - wrapperWidth);
    
    // Calculate base offset (scrolls left to right)
    const offset = progress * maxOffset;
    
    // Calculate active card position (center it)
    const activeCardIndex = Math.floor(progress * (this.totalCards - 1));
    const targetCenterX = wrapperWidth / 2 - this.cardWidth / 2;
    const cardCenterX = activeCardIndex * (this.cardWidth + this.cardSpacing) + this.cardWidth / 2;
    
    // Apply transform
    this.cards.forEach((card, index) => {
      const cardX = index * (this.cardWidth + this.cardSpacing);
      const translateX = -cardX + targetCenterX;
      
      // Smooth transition to active state
      const distanceFromActive = Math.abs(index - activeCardIndex);
      const isActive = distanceFromActive === 0;
      const scale = isActive ? 1 : 0.9;
      const opacity = isActive ? 1 : 0.6;
      
      card.style.transform = `translateX(${translateX}px) scale(${scale})`;
      card.style.opacity = opacity;
      card.classList.toggle('active', isActive);
    });
  }
  
  dispatchUpdateEvent() {
    const event = new CustomEvent('servicescroll', {
      detail: {
        progress: this.currentProgress,
        cardIndex: this.currentCardIndex,
        totalCards: this.totalCards
      }
    });
    window.dispatchEvent(event);
  }
  
  getCurrentCardIndex() {
    return this.currentCardIndex;
  }
  
  getProgress() {
    return this.currentProgress;
  }
}

if (typeof window !== 'undefined') {
  window.ScrollMapper = ScrollMapper;
}

