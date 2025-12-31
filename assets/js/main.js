/**
 * Jovian Tech Labs - Main JavaScript
 * Three.js 3D visuals, vanilla JS animations, and interactions
 * 
 * PERFORMANCE-SAFE ANIMATIONS:
 * - Content is visible by default (no hidden states)
 * - Animations are progressive enhancement only
 * - Uses IntersectionObserver with fallbacks
 * - Works reliably on mobile, desktop, and page reload
 */

// ============================================
// Navigation
// ============================================
(function initNavigation() {
  const nav = document.getElementById('main-nav');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  
  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
  
  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
  
  // Close mobile menu on link click
  const links = navLinks.querySelectorAll('.nav-link, .nav-cta');
  links.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
  
  // Smooth scroll for anchor links
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const navHeight = nav.offsetHeight;
          const targetPosition = target.offsetTop - navHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
})();

// ============================================
// Three.js - Hero 3D Background
// ============================================
(function initHero3D() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Create particle system (cosmic particles)
  const particleCount = 1000;
  const particles = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  
  const color1 = new THREE.Color(0x00d4ff); // Primary blue
  const color2 = new THREE.Color(0x7b2cf7); // Secondary purple
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    // Position
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 20;
    
    // Color (mix between blue and purple)
    const color = Math.random() > 0.5 ? color1 : color2;
    colors[i] = color.r;
    colors[i + 1] = color.g;
    colors[i + 2] = color.b;
  }
  
  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  
  const particleMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
  });
  
  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);
  
  // Create central glowing sphere (Jovian planet reference)
  const sphereGeometry = new THREE.SphereGeometry(0.8, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x00d4ff,
    transparent: true,
    opacity: 0.3,
    blending: THREE.AdditiveBlending
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphere);
  
  // Add glow effect with additional spheres
  const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x7b2cf7,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  scene.add(glow);
  
  // Animation
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.005;
    
    // Rotate particles
    particleSystem.rotation.y = time * 0.2;
    particleSystem.rotation.x = Math.sin(time * 0.1) * 0.2;
    
    // Pulsing sphere
    const scale = 1 + Math.sin(time * 2) * 0.1;
    sphere.scale.set(scale, scale, scale);
    glow.scale.set(scale * 1.5, scale * 1.5, scale * 1.5);
    
    // Rotate sphere
    sphere.rotation.y = time * 0.5;
    glow.rotation.y = -time * 0.3;
    
    // Move particles in wave pattern
    const positions = particleSystem.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] += Math.sin(time + positions[i] * 0.1) * 0.001;
    }
    particleSystem.geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
  }
  
  // Handle resize
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  window.addEventListener('resize', handleResize);
  animate();
})();

// ============================================
// Three.js - Research Section 3D Visualization
// ============================================
(function initResearch3D() {
  const container = document.getElementById('research-visual');
  if (!container) return;
  
  const width = container.offsetWidth;
  const height = container.offsetHeight;
  
  // Scene setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
  camera.position.set(0, 0, 8);
  
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  // Create neural network-like structure
  const nodes = [];
  const nodeCount = 20;
  
  // Create nodes
  for (let i = 0; i < nodeCount; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 16, 16);
    const material = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x00d4ff : 0x7b2cf7,
      transparent: true,
      opacity: 0.8
    });
    const node = new THREE.Mesh(geometry, material);
    
    // Random position in sphere
    const radius = 2 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    node.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi)
    );
    
    scene.add(node);
    nodes.push(node);
  }
  
  // Create connections (edges)
  const edges = [];
  nodes.forEach((node, i) => {
    // Connect to a few random other nodes
    const connections = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < connections; j++) {
      const targetIndex = Math.floor(Math.random() * nodeCount);
      if (targetIndex !== i) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          node.position,
          nodes[targetIndex].position
        ]);
        const material = new THREE.LineBasicMaterial({
          color: 0x00d4ff,
          transparent: true,
          opacity: 0.2
        });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        edges.push(line);
      }
    }
  });
  
  // Animation
  let time = 0;
  function animate() {
    requestAnimationFrame(animate);
    time += 0.01;
    
    // Animate nodes
    nodes.forEach((node, i) => {
      const radius = 2 + Math.sin(time + i) * 0.5;
      const theta = (time * 0.1 + i) * 0.5;
      const phi = (time * 0.1 + i) * 0.3;
      node.position.set(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi)
      );
      
      // Pulsing effect
      const scale = 1 + Math.sin(time * 2 + i) * 0.3;
      node.scale.set(scale, scale, scale);
    });
    
    // Update edges
    edges.forEach((edge, i) => {
      edge.material.opacity = 0.1 + Math.sin(time + i) * 0.1;
    });
    
    // Rotate camera slightly
    camera.position.x = Math.sin(time * 0.1) * 1;
    camera.position.y = Math.cos(time * 0.1) * 1;
    camera.lookAt(0, 0, 0);
    
    renderer.render(scene, camera);
  }
  
  // Handle resize
  function handleResize() {
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  
  window.addEventListener('resize', handleResize);
  
  // Only animate when section is visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate();
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(container);
})();

// ============================================
// Hero Section - Step-Based Narrative Animation
// ============================================
(function initHeroTextAnimation() {
  const heroTagline = document.getElementById('hero-tagline');
  if (!heroTagline) return;
  
  // Exact text flow as specified
  const textSequence = [
    "We imagine what others ignore.",
    "We build what others won't.",
    "We test. We break. We learn.",
    "Expect the Unthinkable."
  ];
  
  let currentIndex = 0;
  let isAnimating = false;
  let sequenceTimeout = null;
  
  function showNextText() {
    if (isAnimating) return;
    isAnimating = true;
    
    // Fade out current text
    heroTagline.classList.add('fade-out');
    
    setTimeout(() => {
      // Update text
      heroTagline.textContent = textSequence[currentIndex];
      heroTagline.classList.remove('fade-out');
      heroTagline.classList.add('animating');
      
      // Move to next index for next iteration
      currentIndex = (currentIndex + 1) % textSequence.length;
      
      // Wait before next transition (pause as specified)
      setTimeout(() => {
        isAnimating = false;
        // Continue sequence (pause between transitions)
        sequenceTimeout = setTimeout(showNextText, 2000); // 2 second pause
      }, 1500);
    }, 600);
  }
  
  // Initialize with first text immediately (content visible by default)
  heroTagline.textContent = textSequence[0];
  currentIndex = 1;
  
  // Start sequence after initial delay
  setTimeout(() => {
    showNextText();
  }, 3000); // Start sequence after 3 seconds
})();

// ============================================
// Scroll Reveal Animations - Progressive Enhancement Only
// ============================================
(function initScrollAnimations() {
  'use strict';
  
  // CRITICAL FIX: Content is ALWAYS visible by default
  // This IntersectionObserver only adds visual enhancement, never hides content
  
  // Check if IntersectionObserver is supported
  const hasIntersectionObserver = 'IntersectionObserver' in window;
  
  /**
   * Main IntersectionObserver implementation
   * Only adds animation class - content is already visible
   */
  function initIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add animation class for visual effect
          // Content is already visible - this is enhancement only
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
    
    // Find all elements that should animate
    const elementsToAnimate = document.querySelectorAll('.fade-in-up');
    
    if (elementsToAnimate.length === 0) {
      return;
    }
    
    // Observe each element
    // Content is already visible - we're just adding animation class
    elementsToAnimate.forEach(el => {
      observer.observe(el);
      
      // Immediately add animate-in for elements already in viewport
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      if (rect.top < viewportHeight && rect.bottom > 0) {
        el.classList.add('animate-in');
      }
    });
  }
  
  /**
   * Initialize scroll animations
   */
  function init() {
    if (hasIntersectionObserver) {
      try {
        initIntersectionObserver();
      } catch (error) {
        console.warn('IntersectionObserver failed:', error);
        // Content remains visible - no action needed
      }
    }
    // If no IntersectionObserver, content is still fully visible
  }
  
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// ============================================
// Contact Form Handling
// ============================================
(function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Create mailto link
    const mailtoLink = `mailto:joviantechlabs@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message (optional)
    const button = form.querySelector('button[type="submit"]');
    const originalText = button.textContent;
    button.textContent = 'Opening Email Client...';
    button.disabled = true;
    
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
    }, 2000);
  });
})();

// ============================================
// Cursor Effects - Premium Glow & Follow
// ============================================
(function initCursorEffects() {
  // Only on desktop (mobile doesn't need cursor effects)
  if (window.innerWidth < 768) return;
  
  // Create cursor dot
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);
  
  // Create cursor glow
  const cursorGlow = document.createElement('div');
  cursorGlow.className = 'cursor-glow';
  document.body.appendChild(cursorGlow);
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let glowX = 0;
  let glowY = 0;
  
  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorGlow.classList.add('active');
  });
  
  // Smooth cursor follow (premium feel)
  function animateCursor() {
    // Cursor dot follows with slight delay for smoothness
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    // Glow follows more slowly for diffusion effect
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  
  // Hover effects on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .service-card, .btn, .nav-link, .research-statement');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
    });
  });
  
  // Hide cursor when mouse leaves window
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorGlow.classList.remove('active');
  });
  
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
  });
})();

// ============================================
// Performance Optimization
// ============================================
// Throttle scroll events
(function initScrollThrottle() {
  let ticking = false;
  
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        // Scroll-based logic here
        ticking = false;
      });
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
})();


// ============================================
// Approach Section - Terminal Typing Animation
// ============================================
(function initTerminalAnimation() {
  'use strict';
  
  const terminalCommand = document.getElementById('terminal-command');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalCursor = document.getElementById('terminal-cursor');
  
  if (!terminalCommand || !terminalOutput) return;
  
  // Terminal commands and outputs
  const terminalScript = [
    {
      command: 'cat how-we-think.txt',
      output: [
        { text: 'It\'s not a tagline. It\'s a mindset.', type: 'highlight' },
        { text: '', type: 'normal' },
        { text: 'Most companies deliver what you expect.', type: 'normal' },
        { text: 'We deliver what you didn\'t.', type: 'success' }
      ],
      delay: 500
    },
    {
      command: 'how-we-think --explore',
      output: [
        { text: 'We challenge assumptions.', type: 'normal' },
        { text: 'We question the status quo.', type: 'normal' },
        { text: 'We don\'t accept "that\'s how it\'s always been done."', type: 'highlight' }
      ],
      delay: 600
    },
    {
      command: 'how-we-think --build',
      output: [
        { text: 'We see problems as opportunities.', type: 'normal' },
        { text: 'We transform ideas into reality.', type: 'success' },
        { text: 'We build what you didn\'t know was possible.', type: 'highlight' }
      ],
      delay: 600
    },
    {
      command: 'how-we-think --innovate',
      output: [
        { text: 'We\'re comfortable with uncertainty.', type: 'normal' },
        { text: 'We thrive in ambiguity.', type: 'normal' },
        { text: 'We\'re not afraid to fail. Failure teaches.', type: 'highlight' }
      ],
      delay: 600
    },
    {
      command: 'how-we-think --deliver',
      output: [
        { text: 'When you work with us, you\'re partnering with explorers.', type: 'normal' },
        { text: 'With researchers. With builders.', type: 'normal' },
        { text: 'Expect results that exceed your imagination.', type: 'success' }
      ],
      delay: 600
    },
    {
      command: 'echo "Expect the Unthinkable"',
      output: [
        { text: 'Expect the Unthinkable', type: 'highlight' },
        { text: '', type: 'normal' },
        { text: '# Ready to explore what\'s possible?', type: 'comment' }
      ],
      delay: 800
    }
  ];
  
  let currentIndex = 0;
  let isTyping = false;
  let typingTimeout = null;
  
  /**
   * Type text character by character
   */
  function typeText(element, text, callback, speed = 50) {
    let index = 0;
    element.textContent = '';
    
    function type() {
      if (index < text.length) {
        element.textContent += text[index];
        index++;
        typingTimeout = setTimeout(type, speed);
      } else {
        if (callback) callback();
      }
    }
    
    type();
  }
  
  /**
   * Add output line to terminal
   */
  function addOutputLine(text, type = 'normal') {
    const line = document.createElement('div');
    // Map type to CSS class
    const classMap = {
      'normal': 'terminal-output-line',
      'highlight': 'terminal-output-line highlight',
      'success': 'terminal-output-line success',
      'comment': 'terminal-output-line comment',
      'error': 'terminal-output-line error'
    };
    line.className = classMap[type] || 'terminal-output-line';
    line.textContent = text;
    terminalOutput.appendChild(line);
    
    // Auto-scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
  
  /**
   * Execute next command in sequence
   */
  function executeNextCommand() {
    if (currentIndex >= terminalScript.length) {
      // Loop back to start
      currentIndex = 0;
      terminalOutput.innerHTML = '';
      terminalCommand.textContent = '';
    }
    
    const script = terminalScript[currentIndex];
    isTyping = true;
    
    // Hide cursor while typing command
    terminalCursor.style.opacity = '0';
    
    // Type command
    typeText(terminalCommand, script.command, () => {
      // Show cursor
      terminalCursor.style.opacity = '1';
      
      // Wait before showing output
      setTimeout(() => {
        // Hide cursor
        terminalCursor.style.opacity = '0';
        
        // Clear command
        terminalCommand.textContent = '';
        
        // Add output lines
        script.output.forEach((line, lineIndex) => {
          setTimeout(() => {
            if (line.text) {
              addOutputLine(line.text, line.type);
            } else {
              // Empty line
              addOutputLine(' ', 'normal');
            }
          }, lineIndex * 200);
        });
        
        // Wait for output to finish, then move to next command
        const totalOutputTime = script.output.length * 200 + script.delay;
        setTimeout(() => {
          isTyping = false;
          currentIndex++;
          
          // Show cursor before next command
          terminalCursor.style.opacity = '1';
          
          // Execute next command
          setTimeout(() => {
            executeNextCommand();
          }, 1000);
        }, totalOutputTime);
      }, 800);
    }, 30);
  }
  
  /**
   * Initialize terminal animation
   */
  function init() {
    // Wait for section to be visible
    const terminalContainer = document.querySelector('.terminal-container');
    if (!terminalContainer) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !isTyping && currentIndex === 0) {
          // Start animation
          setTimeout(() => {
            executeNextCommand();
          }, 1000);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(terminalContainer);
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

console.log('🚀 Jovian Tech Labs - Expect the Unthinkable');
