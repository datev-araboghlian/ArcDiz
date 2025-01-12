// Set up scene
const bgScene = new THREE.Scene();
const bgCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const bgRenderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('background-canvas'),
    antialias: true,
    alpha: true
});

bgRenderer.setSize(window.innerWidth, window.innerHeight);
bgRenderer.setClearColor(0xf5f5f5, 0.3); // Semi-transparent light gray

// Camera position
bgCamera.position.z = 15;

// Line material
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x333333,
    transparent: true,
    opacity: 0.3,
    linewidth: 1
});

// Store all lines and their target positions
const lines = [];
const GRID_SIZE = 20;
const LINE_COUNT = 30;

class ArchLine {
    constructor() {
        // Random start and end points
        this.startPoint = new THREE.Vector3(
            (Math.random() - 0.5) * GRID_SIZE,
            (Math.random() - 0.5) * GRID_SIZE,
            0
        );
        
        this.endPoint = new THREE.Vector3(
            (Math.random() - 0.5) * GRID_SIZE,
            (Math.random() - 0.5) * GRID_SIZE,
            0
        );
        
        // Create the line
        const geometry = new THREE.BufferGeometry().setFromPoints([
            this.startPoint,
            this.endPoint
        ]);
        
        this.line = new THREE.Line(geometry, lineMaterial);
        bgScene.add(this.line);
        
        // Set new target after random interval
        this.setNewTarget();
    }
    
    setNewTarget() {
        this.targetStart = new THREE.Vector3(
            (Math.random() - 0.5) * GRID_SIZE,
            (Math.random() - 0.5) * GRID_SIZE,
            0
        );
        
        this.targetEnd = new THREE.Vector3(
            (Math.random() - 0.5) * GRID_SIZE,
            (Math.random() - 0.5) * GRID_SIZE,
            0
        );
        
        // Random transition duration between 5 and 10 seconds
        this.transitionDuration = 5000 + Math.random() * 5000;
        this.transitionStartTime = Date.now();
    }
    
    update() {
        const now = Date.now();
        const elapsed = now - this.transitionStartTime;
        const progress = Math.min(elapsed / this.transitionDuration, 1);
        
        // Smooth easing function
        const eased = progress < .5 ? 
            4 * progress * progress * progress : 
            1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        // Update start point
        this.startPoint.lerp(this.targetStart, 0.02);
        
        // Update end point
        this.endPoint.lerp(this.targetEnd, 0.02);
        
        // Update line geometry
        this.line.geometry.setFromPoints([this.startPoint, this.endPoint]);
        this.line.geometry.verticesNeedUpdate = true;
        
        // Set new target if transition is complete
        if (progress >= 1) {
            this.setNewTarget();
        }
    }
}

// Create initial lines
for (let i = 0; i < LINE_COUNT; i++) {
    lines.push(new ArchLine());
}

// Animation loop
function animateBackground() {
    requestAnimationFrame(animateBackground);
    
    // Update all lines
    lines.forEach(line => line.update());
    
    bgRenderer.render(bgScene, bgCamera);
}

// Handle window resize
window.addEventListener('resize', () => {
    bgCamera.aspect = window.innerWidth / window.innerHeight;
    bgCamera.updateProjectionMatrix();
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animateBackground();
