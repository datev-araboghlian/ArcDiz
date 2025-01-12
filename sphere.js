// Initialize scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const canvas = document.getElementById('background');

if (!canvas) {
    console.error('Canvas not found');
    throw new Error('Canvas not found');
}

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
});

// Setup renderer
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

// Position camera
camera.position.z = 25;

// Create background group
const backgroundGroup = new THREE.Group();
scene.add(backgroundGroup);

// Create spheres
const spheres = [];
for (let i = 0; i < 35; i++) {
    const radius = Math.random() * 1.2 + 0.3;
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const material = new THREE.MeshBasicMaterial({
        color: "#333333",
        transparent: true,
        opacity: 0.25,
        wireframe: true
    });
    const sphere = new THREE.Mesh(geometry, material);
    
    // Random position in a large sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = Math.random() * 40 + 10;
    
    sphere.position.x = r * Math.sin(phi) * Math.cos(theta);
    sphere.position.y = r * Math.sin(phi) * Math.sin(theta);
    sphere.position.z = r * Math.cos(phi) - 20;
    
    backgroundGroup.add(sphere);
    
    spheres.push({
        mesh: sphere,
        initialPosition: {
            x: sphere.position.x,
            y: sphere.position.y,
            z: sphere.position.z
        },
        speed: {
            rotation: {
                x: (Math.random() - 0.5) * 0.002,
                y: (Math.random() - 0.5) * 0.002,
                z: (Math.random() - 0.5) * 0.002
            },
            movement: {
                x: (Math.random() - 0.5) * 0.001,
                y: (Math.random() - 0.5) * 0.001,
                z: (Math.random() - 0.5) * 0.001
            }
        },
        phase: Math.random() * Math.PI * 2
    });
}

// Create medium spheres
for (let i = 0; i < 15; i++) {
    const radius = Math.random() * 1.5 + 0.8;
    const geometry = new THREE.SphereGeometry(radius, 20, 20);
    const material = new THREE.MeshBasicMaterial({
        color: "#333333",
        transparent: true,
        opacity: 0.3,
        wireframe: true
    });
    const sphere = new THREE.Mesh(geometry, material);
    
    // Random position closer to center
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const r = Math.random() * 25 + 8;
    
    sphere.position.x = r * Math.sin(phi) * Math.cos(theta);
    sphere.position.y = r * Math.sin(phi) * Math.sin(theta);
    sphere.position.z = r * Math.cos(phi) - 15;
    
    backgroundGroup.add(sphere);
    
    spheres.push({
        mesh: sphere,
        initialPosition: {
            x: sphere.position.x,
            y: sphere.position.y,
            z: sphere.position.z
        },
        speed: {
            rotation: {
                x: (Math.random() - 0.5) * 0.001,
                y: (Math.random() - 0.5) * 0.001,
                z: (Math.random() - 0.5) * 0.001
            },
            movement: {
                x: (Math.random() - 0.5) * 0.0008,
                y: (Math.random() - 0.5) * 0.0008,
                z: (Math.random() - 0.5) * 0.0008
            }
        },
        phase: Math.random() * Math.PI * 2
    });
}

// Create main sphere
const mainGeometry = new THREE.SphereGeometry(2.5, 32, 32);
const mainMaterial = new THREE.MeshBasicMaterial({
    color: "#333333",
    transparent: true,
    opacity: 0.5,
    wireframe: true
});
const mainSphere = new THREE.Mesh(mainGeometry, mainMaterial);
scene.add(mainSphere);

// Animation
let time = 0;
function animate() {
    requestAnimationFrame(animate);
    time += 0.002;
    
    // Animate spheres
    spheres.forEach(function(obj) {
        // Rotation
        obj.mesh.rotation.x += obj.speed.rotation.x;
        obj.mesh.rotation.y += obj.speed.rotation.y;
        obj.mesh.rotation.z += obj.speed.rotation.z;
        
        // Floating movement
        obj.mesh.position.x = obj.initialPosition.x + Math.sin(time + obj.phase) * 2;
        obj.mesh.position.y = obj.initialPosition.y + Math.cos(time + obj.phase) * 2;
        obj.mesh.position.z = obj.initialPosition.z + Math.sin(time * 0.5 + obj.phase) * 2;
    });
    
    // Rotate main sphere
    mainSphere.rotation.x += 0.001;
    mainSphere.rotation.y += 0.002;
    
    // Rotate entire background
    backgroundGroup.rotation.x += 0.0002;
    backgroundGroup.rotation.y += 0.0003;
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

// Start animation
animate();
