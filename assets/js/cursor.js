/**
 * Jovian Tech Labs - Custom Cursor
 */

class CustomCursor {
  constructor() {
    if (window.innerWidth < 768) return; // Only on desktop
    
    this.cursor = document.createElement('div');
    this.cursor.className = 'custom-cursor';
    document.body.appendChild(this.cursor);
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    
    this.init();
  }
  
  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.cursor.style.display = 'block';
    });
    
    document.addEventListener('mouseleave', () => {
      this.cursor.style.display = 'none';
    });
    
    // Track hover states
    const interactiveElements = document.querySelectorAll('a, button, .service-card, canvas');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.cursor.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('hover');
      });
    });
    
    // Canvas specific
    const canvas = document.getElementById('services-canvas');
    if (canvas) {
      canvas.addEventListener('mouseenter', () => {
        this.cursor.classList.add('canvas-hover');
      });
      canvas.addEventListener('mouseleave', () => {
        this.cursor.classList.remove('canvas-hover');
      });
    }
    
    this.animate();
  }
  
  animate() {
    // Smooth follow
    this.cursorX += (this.mouseX - this.cursorX) * 0.15;
    this.cursorY += (this.mouseY - this.cursorY) * 0.15;
    
    this.cursor.style.left = this.cursorX + 'px';
    this.cursor.style.top = this.cursorY + 'px';
    
    requestAnimationFrame(() => this.animate());
  }
}

if (typeof window !== 'undefined') {
  window.CustomCursor = CustomCursor;
}

