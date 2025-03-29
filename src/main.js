import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0f0f0f');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 50);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
console.log('Renderer initialized');

// Controls configuration - modified for better user experience
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = true; // Enable zoom for user interaction
controls.zoomSpeed = 0.5; // Slow down zoom speed for better control
controls.autoRotate = false; // Disable auto-rotate to give user more control
controls.minDistance = 20; // Set minimum zoom distance
controls.maxDistance = 100; // Set maximum zoom distance
controls.enablePan = false; // Disable panning for simpler interaction

// Resize handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1.0);
pointLight.position.set(10, 10, 10);
scene.add(pointLight);

// Add spotlight for dramatic effect
const spotlight = new THREE.SpotLight(0x6e56cf, 2.0);
spotlight.position.set(0, 30, 30);
spotlight.angle = Math.PI / 8;
spotlight.penumbra = 0.2;
spotlight.decay = 2;
spotlight.distance = 200;
scene.add(spotlight);

// Mobile detection
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Adjust particle count and quality for mobile
if (isMobile) {
  // Reduce particle count for better performance
  const particleSystem = scene.getObjectByName('particleSystem');
  if (particleSystem) {
    const particleCount = Math.floor(particleSystem.geometry.attributes.position.count / 3);
    console.log('Reducing particles for mobile:', particleCount);
  }

  // Set lower pixel ratio for mobile devices
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio));
}

// Enhanced Neural Network visualization
function createNeuralNetwork() {
  const group = new THREE.Group();
  const layers = [4, 8, 12, 8, 4];
  const layerDistance = 10;
  const nodeSize = 0.8;
  
  // Create nodes
  const nodes = [];
  for (let l = 0; l < layers.length; l++) {
    const layerNodes = [];
    const nodesCount = layers[l];
    
    for (let n = 0; n < nodesCount; n++) {
      const geometry = new THREE.SphereGeometry(nodeSize, 24, 24);
      const material = new THREE.MeshPhysicalMaterial({
        color: 0x6e56cf,
        metalness: 0.7,
        roughness: 0.2,
        emissive: 0x6e56cf,
        emissiveIntensity: 0.3,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        envMapIntensity: 1.0
      });
      
      const node = new THREE.Mesh(geometry, material);
      const y = (n - (nodesCount - 1) / 2) * 5;
      node.position.set(l * layerDistance - 20, y, 0);
      
      // Add enhanced glow effect
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x6e56cf,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending
      });
      const glowSphere = new THREE.Mesh(
        new THREE.SphereGeometry(nodeSize * 1.6, 16, 16),
        glowMaterial
      );
      node.add(glowSphere);
      
      group.add(node);
      layerNodes.push({
        node,
        glow: glowSphere,
        initialY: y,
        pulseOffset: Math.random() * Math.PI * 2
      });
    }
    
    nodes.push(layerNodes);
  }
  
  // Create connections with animated signals
  const connections = [];
  for (let l = 0; l < layers.length - 1; l++) {
    const currentLayer = nodes[l];
    const nextLayer = nodes[l + 1];
    
    for (let i = 0; i < currentLayer.length; i++) {
      for (let j = 0; j < nextLayer.length; j++) {
        // Only connect some nodes for cleaner look
        if (Math.random() > 0.3) {
          const startPos = currentLayer[i].node.position;
          const endPos = nextLayer[j].node.position;
          
          const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            startPos,
            endPos
          ]);
          
          const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x31c4be,
            transparent: true,
            opacity: 0.4
          });
          
          const line = new THREE.Line(lineGeometry, lineMaterial);
          group.add(line);
          
          // Add signal that travels along connection
          const signalGeometry = new THREE.SphereGeometry(0.3, 12, 12);
          const signalMaterial = new THREE.MeshPhysicalMaterial({
            color: 0x31c4be,
            emissive: 0x31c4be,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0,
            metalness: 0.5,
            roughness: 0.2
          });
          const signal = new THREE.Mesh(signalGeometry, signalMaterial);
          
          // Add glow effect to signal
          const signalGlow = new THREE.Mesh(
            new THREE.SphereGeometry(0.4, 8, 8),
            new THREE.MeshBasicMaterial({
              color: 0x31c4be,
              transparent: true,
              opacity: 0,
              blending: THREE.AdditiveBlending
            })
          );
          signal.add(signalGlow);
          
          group.add(signal);
          
          connections.push({
            line,
            signal,
            start: startPos,
            end: endPos,
            progress: Math.random(), // Random starting point
            speed: 0.005 + Math.random() * 0.01,
            active: false,
            activationTime: Math.random() * 100,
            material: lineMaterial
          });
        }
      }
    }
  }
  
  // Extended animation method
  group.update = function(time, scrollY) {
    // Pulse effect for nodes with variable heights based on scroll
    nodes.forEach((layer, layerIndex) => {
      layer.forEach((nodeObj, nodeIndex) => {
        // Basic pulse animation
        const pulse = Math.sin(time * 2 + nodeObj.pulseOffset) * 0.1 + 0.9;
        nodeObj.node.scale.set(pulse, pulse, pulse);
        
        // Update emissive intensity
        nodeObj.node.material.emissiveIntensity = 0.1 + Math.abs(Math.sin(time + nodeIndex)) * 0.3;
        
        // Modify Y position based on scroll - creates wave effect
        const scrollWave = Math.sin(time + nodeObj.pulseOffset + (scrollY * 0.001)) * 2;
        nodeObj.node.position.y = nodeObj.initialY + scrollWave;
        
        // Glow pulse effect
        nodeObj.glow.material.opacity = 0.1 + Math.abs(Math.sin(time * 0.5 + nodeObj.pulseOffset)) * 0.2;
        const glowPulse = 1 + Math.sin(time + nodeObj.pulseOffset) * 0.2;
        nodeObj.glow.scale.set(glowPulse, glowPulse, glowPulse);
      });
    });
    
    // Animate connections and signals
    connections.forEach(conn => {
      conn.activationTime -= 0.1;
      
      // Periodically activate signals
      if (conn.activationTime <= 0 && !conn.active) {
        conn.active = true;
        conn.progress = 0;
        conn.activationTime = 50 + Math.random() * 100;
        conn.material.opacity = 0.6;
      }
      
      // Update active signals
      if (conn.active) {
        conn.progress += conn.speed;
        
        if (conn.progress >= 1) {
          conn.active = false;
          conn.signal.material.opacity = 0;
          conn.signal.children[0].material.opacity = 0; // Reset glow opacity
          conn.material.opacity = 0.4;
        } else {
          // Move signal along line
          conn.signal.position.lerpVectors(conn.start, conn.end, conn.progress);
          
          // Fade in at start, fade out at end
          let opacity = 0;
          if (conn.progress < 0.1) {
            opacity = conn.progress * 10; // Fade in
          } else if (conn.progress > 0.9) {
            opacity = (1 - conn.progress) * 10; // Fade out
          } else {
            opacity = 1;
          }
          conn.signal.material.opacity = opacity;
          
          // Update glow effect with higher opacity for better visibility
          const glowOpacity = opacity * 0.7;
          conn.signal.children[0].material.opacity = glowOpacity;
          
          // Pulse animation for signal size
          const pulseScale = 1 + Math.sin(time * 10) * 0.2;
          conn.signal.scale.set(pulseScale, pulseScale, pulseScale);
          
          // Pulse connection when signal is traveling
          conn.material.opacity = 0.4 + Math.sin(time * 10) * 0.2;
        }
      }
    });
  };
  
  return group;
}

// Enhanced particle system
function createParticleSystem() {
  // Adjust particle count based on device
  const particleCount = isMobile ? 50 : 150;
  
  // Create instanced mesh for spheres
  const sphereGeometry = new THREE.SphereGeometry(0.2, 8, 8);
  const sphereMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x6e56cf,
    metalness: 0.7,
    roughness: 0.2,
    emissive: 0x6e56cf,
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.8
  });
  
  // Create instanced mesh
  const instancedMesh = new THREE.InstancedMesh(
    sphereGeometry,
    sphereMaterial,
    particleCount
  );
  instancedMesh.name = 'particleSystem';
  
  // Matrix for position and scale
  const matrix = new THREE.Matrix4();
  const positions = [];
  const sizes = [];
  const colors = [];
  
  // Set initial positions and store data
  for (let i = 0; i < particleCount; i++) {
    // Create a sphere of particles
    const radius = 25 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    // Size variation
    const size = 0.1 + Math.random() * 0.9;
    
    // Color gradient from blue to purple
    const color = new THREE.Color();
    color.setHSL(0.6 + Math.random() * 0.1, 0.9, 0.6);
    
    // Store positions for animation
    positions.push(x, y, z);
    sizes.push(size);
    colors.push(color.r, color.g, color.b);
    
    // Set instance matrix
    matrix.makeTranslation(x, y, z);
    matrix.scale(new THREE.Vector3(size, size, size));
    instancedMesh.setMatrixAt(i, matrix);
    instancedMesh.setColorAt(i, color);
  }
  
  instancedMesh.instanceMatrix.needsUpdate = true;
  if (instancedMesh.instanceColor) instancedMesh.instanceColor.needsUpdate = true;
  
  // Add update method
  instancedMesh.userData = {
    positions: positions,
    sizes: sizes,
    colors: colors,
    originalPositions: [...positions]
  };
  
  instancedMesh.update = function(time, scrollY) {
    // Update frequency - less frequent on mobile for better performance
    const updateFrequency = isMobile ? 3 : 1;
    if (isMobile && Math.floor(time * 10) % updateFrequency !== 0) {
      return; // Skip some updates on mobile
    }
    
    const matrix = new THREE.Matrix4();
    
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      
      // Get original position
      const origX = this.userData.originalPositions[idx];
      const origY = this.userData.originalPositions[idx + 1];
      const origZ = this.userData.originalPositions[idx + 2];
      
      // Create flowing motion
      const x = origX + Math.cos(time + i * 0.1) * 0.5;
      const y = origY + Math.sin(time + i * 0.1) * 0.5;
      const z = origZ;
      
      // Scale based on scroll
      const scrollFactor = 1 + (scrollY * 0.0002);
      const size = this.userData.sizes[i] * (1 + Math.sin(time + i) * 0.2) * scrollFactor;
      
      // Update instance matrix
      matrix.makeTranslation(x, y, z);
      matrix.scale(new THREE.Vector3(size, size, size));
      this.setMatrixAt(i, matrix);
      
      // Pulsating color
      const color = new THREE.Color();
      const hue = (0.6 + Math.sin(time * 0.2 + i * 0.05) * 0.1) % 1;
      color.setHSL(hue, 0.9, 0.6);
      this.setColorAt(i, color);
    }
    
    this.instanceMatrix.needsUpdate = true;
    if (this.instanceColor) this.instanceColor.needsUpdate = true;
  };
  
  return instancedMesh;
}

// Enhanced grid
function createGrid() {
  const group = new THREE.Group();
  
  // Main grid
  const gridHelper = new THREE.GridHelper(50, 20, 0x6e56cf, 0x222222);
  gridHelper.position.y = -20;
  group.add(gridHelper);
  
  // Create abstract wireframe planes
  for (let i = 0; i < 5; i++) {
    const planeGeometry = new THREE.PlaneGeometry(50, 50, 10, 10);
    const edges = new THREE.EdgesGeometry(planeGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x31c4be,
      transparent: true,
      opacity: 0.2
    });
    const wireframe = new THREE.LineSegments(edges, lineMaterial);
    
    // Position planes at different angles
    wireframe.rotation.x = Math.PI / 2 + (i * Math.PI / 8);
    wireframe.rotation.z = i * Math.PI / 10;
    wireframe.position.y = -19 + i * 2;
    
    group.add(wireframe);
  }
  
  // Add update method
  group.update = function(time, scrollY) {
    // Rotate based on time and scroll
    group.rotation.z = time * 0.05;
    
    // Shift position based on scroll
    const scrollOffset = scrollY * 0.0005;
    gridHelper.position.y = -20 + scrollOffset * 5;
    
    // Pulse opacity for wireframe elements
    group.children.forEach((child, index) => {
      if (child.type === 'LineSegments') {
        child.material.opacity = 0.1 + Math.abs(Math.sin(time + index * 0.5)) * 0.15;
      }
    });
  };
  
  return group;
}

// Interactive torus
function createTorus() {
  const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
  
  // Create wireframe material
  const material = new THREE.MeshPhysicalMaterial({ 
    color: 0xff6347,
    metalness: 0.7,
    roughness: 0.2,
    clearcoat: 1.0,
    clearcoatRoughness: 0.2,
    wireframe: true, // Make it wireframe
    wireframeLinewidth: 1
  });
  
  const torus = new THREE.Mesh(geometry, material);
  
  // Add a second torus with different wireframe for effect
  const innerGeometry = new THREE.TorusKnotGeometry(9.5, 2.8, 80, 16);
  const innerMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  });
  
  const innerTorus = new THREE.Mesh(innerGeometry, innerMaterial);
  torus.add(innerTorus);
  
  // Add update method
  torus.update = function(time, scrollY) {
    // Complex rotation based on time
    torus.rotation.x = time * 0.3;
    torus.rotation.y = time * 0.2;
    
    // Opposite rotation for inner torus
    innerTorus.rotation.x = -time * 0.1;
    innerTorus.rotation.z = time * 0.15;
    
    // Scale based on scroll
    const scrollFactor = 1 + Math.sin(scrollY * 0.001) * 0.2;
    torus.scale.set(scrollFactor, scrollFactor, scrollFactor);
    
    // Change material hue based on scroll and time
    const hue = (time * 0.05 + scrollY * 0.0005) % 1;
    const color = new THREE.Color().setHSL(hue, 0.8, 0.5);
    torus.material.color = color;
    
    // Complementary color for inner torus
    const innerHue = (hue + 0.5) % 1;
    innerTorus.material.color = new THREE.Color().setHSL(innerHue, 0.7, 0.6);
  };
  
  return torus;
}

// Create objects
const neuralNetwork = createNeuralNetwork();
scene.add(neuralNetwork);

// Initialize positions
neuralNetwork.position.set(0, 0, 0);
neuralNetwork.scale.set(1, 1, 1);

const particleSystem = createParticleSystem();
scene.add(particleSystem);

const grid = createGrid();
scene.add(grid);

const torus = createTorus();
scene.add(torus);

// Animation and section management variables - modified for smoother transitions
let scrollY = 0;
let currentSection = 0;
let prevSection = 0;
let scrolling = false;
let totalSections = 4;
const sectionIds = ['about', 'projects', 'skills', 'contact'];

// Camera targets for smooth transitions
let targetCameraZ = 50;
let targetCameraY = 0;
let targetCameraX = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let targetRotationZ = 0;

// Neural network position targets
let networkTargetX = 0;
let networkTargetY = 0;
let networkTargetZ = 0;
let networkTargetScale = 1;
let networkTargetRotationY = 0;

function getCurrentSectionIndex() {
  const sections = document.querySelectorAll('.section');
  let currentIndex = 0;
  let minDistance = Infinity;
  
  sections.forEach((section, index) => {
    const rect = section.getBoundingClientRect();
    const distance = Math.abs(rect.top);
    if (distance < minDistance) {
      minDistance = distance;
      currentIndex = index;
    }
  });
  
  return currentIndex;
}

function updateSceneForSection(sectionIndex) {
  console.log(`Updating scene for section ${sectionIndex}`);
  
  // Track previous section for transition direction
  prevSection = currentSection;
  
  // Animate profile image if entering About section
  const profileImage = document.querySelector('.profile-image-container');
  if (profileImage) {
    if (sectionIndex === 0) {
      // Entering About section - fade in and animate profile image
      profileImage.style.opacity = '0';
      profileImage.style.transform = 'translate(-50%, -30%)';
      
      setTimeout(() => {
        profileImage.style.transition = 'opacity 0.8s ease, transform 1s ease';
        profileImage.style.opacity = '1';
        profileImage.style.transform = 'translate(-50%, -50%)';
      }, 100);
    } else {
      // Leaving About section - fade out profile image
      profileImage.style.transition = 'opacity 0.5s ease';
      profileImage.style.opacity = '0';
    }
  }
  
  // Update visibility based on section
  switch(sectionIndex) {
    case 0: // About
      neuralNetwork.visible = true;
      particleSystem.visible = true;
      grid.visible = true;
      torus.visible = false;
      
      // Camera positions for this section - center view
      targetCameraX = 0;
      targetCameraY = 0;
      targetCameraZ = 50;
      targetRotationX = 0;
      targetRotationY = 0;
      targetRotationZ = 0;
      
      // Neural network positioned further left and back to make room for profile image
      networkTargetX = -30;  // Move further left
      networkTargetY = 0;
      networkTargetZ = -10;  // Push it back somewhat
      networkTargetScale = 1.2;
      networkTargetRotationY = Math.PI * 0.15;
      
      // Controls settings
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
      break;
      
    case 1: // Projects
      neuralNetwork.visible = true;
      particleSystem.visible = true;
      grid.visible = true;
      torus.visible = false;
      
      // Camera positions for this section - view from above
      targetCameraX = 0;
      targetCameraY = 10;
      targetCameraZ = 45;
      targetRotationX = -Math.PI * 0.1;
      targetRotationY = 0;
      targetRotationZ = 0;
      
      // Neural network positioned below text, pushed further back
      networkTargetX = 0;
      networkTargetY = -25;  // Move even further down
      networkTargetZ = -15;  // Push further back
      networkTargetScale = 0.8;  // Make it smaller to fit better
      networkTargetRotationY = 0;
      
      // Controls settings
      controls.autoRotate = false;
      break;
      
    case 2: // Skills
      neuralNetwork.visible = true;
      particleSystem.visible = true;
      grid.visible = true;
      torus.visible = true;
      
      // Camera positions for this section - close-up detailed view
      targetCameraX = 10;
      targetCameraY = 0;
      targetCameraZ = 30;
      targetRotationX = 0;
      targetRotationY = -Math.PI * 0.1;
      targetRotationZ = 0;
      
      // Neural network positioned to the right
      networkTargetX = 20;
      networkTargetY = 0;
      networkTargetZ = 0;
      networkTargetScale = 1.8;
      networkTargetRotationY = -Math.PI * 0.3;
      
      // Controls settings
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.2;
      break;
      
    case 3: // Contact
      neuralNetwork.visible = true;
      particleSystem.visible = true;
      grid.visible = false;
      torus.visible = true;
      
      // Camera positions for this section - wide angle view
      targetCameraX = -5;
      targetCameraY = 10;
      targetCameraZ = 35;
      targetRotationX = Math.PI * 0.05;
      targetRotationY = Math.PI * 0.05;
      targetRotationZ = 0;
      
      // Neural network positioned centered and far behind
      networkTargetX = 0;
      networkTargetY = 0;
      networkTargetZ = -15;
      networkTargetScale = 0.9;
      networkTargetRotationY = Math.PI * 1.5;
      
      // Controls settings
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;
      break;
  }
}

// Smooth section transition handler
function smoothScrollToSection(targetSection) {
  if (scrolling) return;
  
  scrolling = true;
  
  const targetElement = document.getElementById(sectionIds[targetSection]);
  if (targetElement) {
    // First update the scene for visual transition
    updateSceneForSection(targetSection);
    updateActiveNavAndIndicators(targetSection);
    
    // Then scroll to the section
    targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Update current section
    currentSection = targetSection;
  }
  
  // Reset scrolling flag after animation completes
  setTimeout(() => {
    scrolling = false;
  }, 1000);
}

// Updated wheel handler for direct section navigation
function smoothScroll(e) {
  e.preventDefault();
  
  if (scrolling) return;
  
  const delta = e.deltaY;
  const direction = delta > 0 ? 1 : -1;
  const targetSection = Math.max(0, Math.min(totalSections - 1, currentSection + direction));
  
  // Only proceed if we're moving to a different section
  if (targetSection !== currentSection) {
    smoothScrollToSection(targetSection);
  }
}

// Handle keyboard navigation
function handleKeyNavigation(e) {
  if (scrolling) return;
  
  let targetSection = currentSection;
  
  // Arrow keys or Page Up/Down for navigation
  switch(e.key) {
    case 'ArrowDown':
    case 'PageDown':
      targetSection = Math.min(totalSections - 1, currentSection + 1);
      break;
    case 'ArrowUp':
    case 'PageUp':
      targetSection = Math.max(0, currentSection - 1);
      break;
    default:
      return; // Exit if not navigation key
  }
  
  // Only proceed if we're moving to a different section
  if (targetSection !== currentSection) {
    e.preventDefault();
    smoothScrollToSection(targetSection);
  }
}

window.addEventListener('wheel', smoothScroll, { passive: false });
window.addEventListener('keydown', handleKeyNavigation);
window.addEventListener('scroll', handleScroll);

// Updated scroll handler for animation purposes only
function handleScroll(e) {
  // Store raw scroll position for animations
  scrollY = window.scrollY;
  
  // Regular section detection for navigation
  if (!scrolling) {
    currentSection = getCurrentSectionIndex();
    updateSceneForSection(currentSection);
    updateActiveNavAndIndicators(currentSection);
  }
}

function updateActiveNavAndIndicators(sectionIndex) {
  // Update indicators only
  document.querySelectorAll('.indicator').forEach((indicator) => {
    indicator.classList.remove('active');
  });
  const activeIndicator = document.querySelector(`.indicator[data-section="${sectionIndex}"]`);
  if (activeIndicator) activeIndicator.classList.add('active');
}

// Update section indicator click handlers
document.querySelectorAll('.indicator').forEach((indicator) => {
  indicator.addEventListener('click', () => {
    const sectionIndex = parseInt(indicator.getAttribute('data-section'));
    smoothScrollToSection(sectionIndex);
  });
});

// Initialize with a small delay to ensure sections are properly positioned
window.addEventListener('load', () => {
  console.log('Window loaded');
  
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    currentSection = getCurrentSectionIndex();
    updateSceneForSection(currentSection);
    updateActiveNavAndIndicators(currentSection);
    
    // Force scroll to current section to ensure proper positioning
    const currentElement = document.getElementById(sectionIds[currentSection]);
    if (currentElement) {
      currentElement.scrollIntoView({ behavior: 'auto', block: 'start' });
    }
    
    // Initial scroll position
    scrollY = window.scrollY;
    
    // Initialize profile image visibility based on current section
    const profileImage = document.querySelector('.profile-image-container');
    if (profileImage) {
      if (currentSection === 0) {
        profileImage.style.opacity = '1';
        profileImage.style.transition = 'opacity 0.8s ease, transform 1s ease';
      } else {
        profileImage.style.opacity = '0';
      }
    }
  }, 200);
});

// Enhanced Animation Loop
function animate() {
  requestAnimationFrame(animate);
  
  try {
    const time = Date.now() * 0.001;
    
    // Reduced animation complexity on mobile
    const easeFactor = isMobile ? 0.1 : 0.05; // Faster transitions on mobile
    
    // Smoothly move camera to target position with easing
    camera.position.x += (targetCameraX - camera.position.x) * easeFactor;
    camera.position.y += (targetCameraY - camera.position.y) * easeFactor;
    camera.position.z += (targetCameraZ - camera.position.z) * easeFactor;
    
    // Only apply rotation if not using orbit controls
    if (!controls.enabled) {
      camera.rotation.x += (targetRotationX - camera.rotation.x) * easeFactor;
      camera.rotation.y += (targetRotationY - camera.rotation.y) * easeFactor;
      camera.rotation.z += (targetRotationZ - camera.rotation.z) * easeFactor;
    }
    
    // Smoothly move neural network to target position
    if (neuralNetwork) {
      neuralNetwork.position.x += (networkTargetX - neuralNetwork.position.x) * easeFactor;
      neuralNetwork.position.y += (networkTargetY - neuralNetwork.position.y) * easeFactor;
      neuralNetwork.position.z += (networkTargetZ - neuralNetwork.position.z) * easeFactor;
      
      // Smooth scale transition
      const currentScale = neuralNetwork.scale.x;
      const newScale = currentScale + (networkTargetScale - currentScale) * easeFactor;
      neuralNetwork.scale.set(newScale, newScale, newScale);
      
      // Smooth rotation
      neuralNetwork.rotation.y += (networkTargetRotationY - neuralNetwork.rotation.y) * easeFactor;
    }
    
    // Update controls
    controls.update();
    
    // Update spotlight to follow camera slightly
    spotlight.position.x = camera.position.x * 0.5;
    spotlight.position.y = camera.position.y * 0.5 + 20;
    spotlight.position.z = camera.position.z * 0.5;
    
    // Skip some updates on mobile for better performance
    const shouldUpdateAll = !isMobile || Math.floor(time * 2) % 2 === 0;
    
    // Update all objects with time and scroll
    if (neuralNetwork && typeof neuralNetwork.update === 'function') {
      neuralNetwork.update(time, scrollY);
    }
    
    if (particleSystem && typeof particleSystem.update === 'function' && shouldUpdateAll) {
      particleSystem.update(time, scrollY);
    }
    
    if (grid && typeof grid.update === 'function' && shouldUpdateAll) {
      grid.update(time, scrollY);
    }
    
    if (torus && typeof torus.update === 'function' && shouldUpdateAll) {
      torus.update(time, scrollY);
    }
    
    renderer.render(scene, camera);
  } catch (error) {
    console.error('Error in animation loop:', error);
  }
}

console.log('Starting animation loop');
animate();

// Function to toggle user control of camera
function toggleUserControl(enabled) {
  controls.enabled = enabled;
  controls.enableZoom = enabled;
  controls.enableRotate = enabled;
  controls.autoRotate = !enabled;
}

// Add key listeners for manual zoom control with Z key
window.addEventListener('keydown', (e) => {
  if (e.key === 'z' || e.key === 'Z') {
    toggleUserControl(true);
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'z' || e.key === 'Z') {
    toggleUserControl(false);
    // Reset to target positions when user lets go
    updateSceneForSection(currentSection);
  }
});