/**
 * Jovian Tech Labs - Research Section
 * Terminal typing animation and node graph
 */

class ResearchSection {
  constructor() {
    this.init();
  }
  
  init() {
    this.initTerminal();
    this.initNodeGraph();
  }
  
  initTerminal() {
    const terminalText = document.getElementById('terminal-text');
    if (!terminalText) return;
    
    const texts = [
      'python research/main.py',
      '> Testing hypothesis: AI can understand context beyond training data',
      '> Running experiment #1273',
      '> Status: In progress...',
      '> Results: Unexpected pattern detected',
      ''
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const type = () => {
      const currentText = texts[textIndex];
      
      if (isDeleting) {
        terminalText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        
        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
          setTimeout(type, 500);
          return;
        }
      } else {
        terminalText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        
        if (charIndex === currentText.length) {
          if (textIndex === texts.length - 1) {
            // Reset to first text
            setTimeout(() => {
              textIndex = 0;
              isDeleting = true;
              setTimeout(type, 1000);
            }, 2000);
            return;
          }
          isDeleting = true;
          setTimeout(type, 2000);
          return;
        }
      }
      
      setTimeout(type, isDeleting ? 30 : 50);
    };
    
    // Start after a delay
    setTimeout(() => type(), 1000);
  }
  
  initNodeGraph() {
    const container = document.getElementById('research-visual');
    if (!container || typeof THREE === 'undefined') return;
    
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
    
    // Create nodes
    const nodes = [];
    const nodeCount = 30;
    const nodesGeometry = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);
    
    for (let i = 0; i < nodeCount; i++) {
      const radius = 2 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      
      nodePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      nodePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      nodePositions[i * 3 + 2] = radius * Math.cos(phi);
      
      const isPrimary = Math.random() > 0.5;
      nodeColors[i * 3] = isPrimary ? 0.0 : 0.48;
      nodeColors[i * 3 + 1] = isPrimary ? 0.83 : 0.17;
      nodeColors[i * 3 + 2] = isPrimary ? 1.0 : 0.97;
      
      nodes.push({
        index: i,
        x: nodePositions[i * 3],
        y: nodePositions[i * 3 + 1],
        z: nodePositions[i * 3 + 2],
        baseX: nodePositions[i * 3],
        baseY: nodePositions[i * 3 + 1],
        baseZ: nodePositions[i * 3 + 2],
        targetX: nodePositions[i * 3],
        targetY: nodePositions[i * 3 + 1],
        targetZ: nodePositions[i * 3 + 2]
      });
    }
    
    nodesGeometry.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodesGeometry.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));
    
    const nodeMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const nodeSystem = new THREE.Points(nodesGeometry, nodeMaterial);
    scene.add(nodeSystem);
    
    // Create connections
    const connections = [];
    nodes.forEach((node, i) => {
      // Connect to nearby nodes
      nodes.slice(i + 1).forEach((otherNode, j) => {
        const dist = Math.sqrt(
          Math.pow(node.x - otherNode.x, 2) +
          Math.pow(node.y - otherNode.y, 2) +
          Math.pow(node.z - otherNode.z, 2)
        );
        
        if (dist < 1.5 && Math.random() > 0.7) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(node.x, node.y, node.z),
            new THREE.Vector3(otherNode.x, otherNode.y, otherNode.z)
          ]);
          const material = new THREE.LineBasicMaterial({
            color: 0x00d4ff,
            transparent: true,
            opacity: 0.2
          });
          const line = new THREE.Line(geometry, material);
          scene.add(line);
          connections.push({ line, node1: node, node2: otherNode });
        }
      });
    });
    
    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      
      // Animate nodes
      const positions = nodesGeometry.attributes.position.array;
      nodes.forEach((node, i) => {
        const radius = 2 + Math.sin(time * 0.5 + i) * 0.5;
        const theta = (time * 0.1 + i) * 0.5;
        const phi = (time * 0.1 + i) * 0.3;
        
        node.targetX = radius * Math.sin(phi) * Math.cos(theta);
        node.targetY = radius * Math.sin(phi) * Math.sin(theta);
        node.targetZ = radius * Math.cos(phi);
        
        // Smooth interpolation
        node.x += (node.targetX - node.x) * 0.1;
        node.y += (node.targetY - node.y) * 0.1;
        node.z += (node.targetZ - node.z) * 0.1;
        
        positions[i * 3] = node.x;
        positions[i * 3 + 1] = node.y;
        positions[i * 3 + 2] = node.z;
      });
      
      nodesGeometry.attributes.position.needsUpdate = true;
      
      // Update connections
      connections.forEach(conn => {
        conn.line.geometry.setFromPoints([
          new THREE.Vector3(conn.node1.x, conn.node1.y, conn.node1.z),
          new THREE.Vector3(conn.node2.x, conn.node2.y, conn.node2.z)
        ]);
        conn.line.material.opacity = 0.1 + Math.sin(time + conn.node1.index) * 0.1;
      });
      
      // Rotate camera slightly
      camera.position.x = Math.sin(time * 0.1) * 1;
      camera.position.y = Math.cos(time * 0.1) * 1;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
    };
    
    // Only animate when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate();
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(container);
    
    // Initial animation
    animate();
    
    // Handle resize
    window.addEventListener('resize', () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  }
}

if (typeof window !== 'undefined') {
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ResearchSection());
  } else {
    new ResearchSection();
  }
}

