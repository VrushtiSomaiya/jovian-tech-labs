/**
 * Jovian Tech Labs - Three.js Particle System
 * Morphing particles for services section
 */

class ServiceParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.currentServiceIndex = 0;
    this.targetServiceIndex = 0;
    this.morphProgress = 0;
    this.lastSourceIndex = 0;
    this.mouse = new THREE.Vector2(0, 0);
    this.hoverIntensity = 1;
    
    this.init();
  }
  
  init() {
    // Wait for canvas to be laid out
    requestAnimationFrame(() => {
      const width = this.canvas.offsetWidth || window.innerWidth * 0.5;
      const height = this.canvas.offsetHeight || window.innerHeight;
      
      // Scene setup
      this.scene = new THREE.Scene();
      
      this.camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
      );
      this.camera.position.z = 5;
      
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        alpha: true,
        antialias: true
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      this.initializeParticles();
      this.attachEventListeners();
      this.animate();
    });
  }
  
  initializeParticles() {
    
    // Create particle system
    this.particleCount = 800;
    this.particles = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.particleCount * 3);
    this.colors = new Float32Array(this.particleCount * 3);
    this.sizes = new Float32Array(this.particleCount);
    
    // Target positions for each service
    this.targetPositions = {
      0: this.createBracketShape(),      // </> brackets
      1: this.createStarShape(),         // Star/spark
      2: this.createDNAHelix(),          // DNA helix
      3: this.createFlowingCurves()      // Flowing curves
    };
    
    // Current positions (starting from brackets)
    const initialPositions = this.createBracketShape();
    for (let i = 0; i < this.particleCount; i++) {
      const pos = initialPositions[i] || { x: 0, y: 0, z: 0 };
      this.positions[i * 3] = pos.x;
      this.positions[i * 3 + 1] = pos.y;
      this.positions[i * 3 + 2] = pos.z;
      
      // Colors - cyan and purple
      const isCyan = Math.random() > 0.5;
      this.colors[i * 3] = isCyan ? 0.0 : 0.48;
      this.colors[i * 3 + 1] = isCyan ? 0.83 : 0.17;
      this.colors[i * 3 + 2] = isCyan ? 1.0 : 0.97;
      
      this.sizes[i] = 0.03 + Math.random() * 0.02;
    }
    
    this.particles.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.particles.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.particles.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
    
    // Material
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        hoverIntensity: { value: 1.0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z) * (1.0 + sin(time * 2.0) * 0.1);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    
    this.particleSystem = new THREE.Points(this.particles, this.material);
    this.scene.add(this.particleSystem);
  }
  
  attachEventListeners() {
    // Handle resize
    window.addEventListener('resize', () => this.handleResize());
    
    // Mouse tracking
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });
    
    this.canvas.addEventListener('mouseenter', () => {
      this.canvas.style.cursor = 'none';
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.set(0, 0);
    });
  }
  
  createBracketShape() {
    const positions = [];
    const bracketSize = 2.5;
    const thickness = 0.3;
    
    // Left bracket <
    for (let i = 0; i < 100; i++) {
      const t = i / 100;
      const angle = Math.PI * 0.75 + t * Math.PI * 0.5;
      const radius = bracketSize * 0.5;
      positions.push({
        x: -radius * 0.3 + Math.cos(angle) * radius * t,
        y: Math.sin(angle) * radius * t,
        z: (Math.random() - 0.5) * thickness
      });
    }
    
    // Right bracket >
    for (let i = 0; i < 100; i++) {
      const t = i / 100;
      const angle = Math.PI * 0.25 - t * Math.PI * 0.5;
      const radius = bracketSize * 0.5;
      positions.push({
        x: radius * 0.3 + Math.cos(angle) * radius * t,
        y: Math.sin(angle) * radius * t,
        z: (Math.random() - 0.5) * thickness
      });
    }
    
    // Fill to particleCount
    while (positions.length < this.particleCount) {
      const i = positions.length % 200;
      positions.push({ ...positions[i], z: positions[i].z + (Math.random() - 0.5) * 0.5 });
    }
    
    return positions.slice(0, this.particleCount);
  }
  
  createStarShape() {
    const positions = [];
    const arms = 8;
    const radius = 2.0;
    
    for (let i = 0; i < this.particleCount; i++) {
      const angle = (i / this.particleCount) * Math.PI * 2 * arms;
      const r = radius * (0.3 + Math.sin(angle * 2) * 0.7);
      positions.push({
        x: Math.cos(angle) * r * (0.5 + Math.random() * 0.5),
        y: Math.sin(angle) * r * (0.5 + Math.random() * 0.5),
        z: (Math.random() - 0.5) * 0.5
      });
    }
    
    return positions;
  }
  
  createDNAHelix() {
    const positions = [];
    const height = 4.0;
    const radius = 0.8;
    const turns = 3;
    
    for (let i = 0; i < this.particleCount; i++) {
      const t = i / this.particleCount;
      const strand = Math.floor(i / (this.particleCount / 2)) % 2;
      const angle = t * turns * Math.PI * 2 + (strand * Math.PI);
      positions.push({
        x: Math.cos(angle) * radius,
        y: (t - 0.5) * height,
        z: Math.sin(angle) * radius
      });
    }
    
    return positions;
  }
  
  createFlowingCurves() {
    const positions = [];
    const width = 3.0;
    const height = 3.0;
    
    for (let i = 0; i < this.particleCount; i++) {
      const t = i / this.particleCount;
      const x = (t - 0.5) * width * 2;
      const wave = Math.sin(t * Math.PI * 4) * height * 0.3;
      positions.push({
        x: x,
        y: wave + (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.8
      });
    }
    
    return positions;
  }
  
  setServiceIndex(index) {
    if (this.targetServiceIndex !== index) {
      this.lastSourceIndex = this.targetServiceIndex;
      this.targetServiceIndex = index;
      this.morphProgress = 0;
    }
  }
  
  setMorphProgress(progress) {
    this.morphProgress = Math.max(0, Math.min(1, progress));
  }
  
  setHoverIntensity(intensity) {
    this.hoverIntensity = intensity;
    this.material.uniforms.hoverIntensity.value = intensity;
  }
  
  handleResize() {
    const width = this.canvas.offsetWidth;
    const height = this.canvas.offsetHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  
  animate() {
    requestAnimationFrame(() => this.animate());
    
    const time = performance.now() * 0.001;
    this.material.uniforms.time.value = time;
    
    // Morph between shapes
    const sourceIndex = this.lastSourceIndex;
    const targetIndex = this.targetServiceIndex;
    const sourceShape = this.targetPositions[sourceIndex] || this.createBracketShape();
    const targetShape = this.targetPositions[targetIndex] || this.createBracketShape();
    
    const positions = this.particles.attributes.position.array;
    
    for (let i = 0; i < this.particleCount; i++) {
      const source = sourceShape[i] || { x: 0, y: 0, z: 0 };
      const target = targetShape[i] || { x: 0, y: 0, z: 0 };
      
      // Ease function
      const easeT = this.easeInOutCubic(this.morphProgress);
      
      let x = source.x + (target.x - source.x) * easeT;
      let y = source.y + (target.y - source.y) * easeT;
      let z = source.z + (target.z - source.z) * easeT;
      
      // Mouse repulsion
      const mouseInfluence = 2.0;
      const dx = this.mouse.x * 5 - x;
      const dy = this.mouse.y * 5 - y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < mouseInfluence && dist > 0) {
        const force = (1 - dist / mouseInfluence) * 0.5;
        x -= (dx / dist) * force;
        y -= (dy / dist) * force;
      }
      
      // Constant drift
      x += Math.sin(time * 0.5 + i * 0.01) * 0.01;
      y += Math.cos(time * 0.3 + i * 0.01) * 0.01;
      
      // Jitter for bracket shape
      if (this.targetServiceIndex === 0 && this.morphProgress > 0.8) {
        x += (Math.random() - 0.5) * 0.05;
        y += (Math.random() - 0.5) * 0.05;
      }
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }
    
    this.particles.attributes.position.needsUpdate = true;
    
    // Update current service index gradually (for rotation effects)
    if (Math.abs(this.currentServiceIndex - this.targetServiceIndex) > 0.01) {
      this.currentServiceIndex += (this.targetServiceIndex - this.currentServiceIndex) * 0.1;
    } else {
      this.currentServiceIndex = this.targetServiceIndex;
      this.lastSourceIndex = this.targetServiceIndex;
    }
    
    // Rotate particle system slightly
    this.particleSystem.rotation.y = time * 0.1;
    this.particleSystem.rotation.x = Math.sin(time * 0.05) * 0.1;
    
    this.renderer.render(this.scene, this.camera);
  }
  
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}

if (typeof window !== 'undefined') {
  window.ServiceParticleSystem = ServiceParticleSystem;
}
