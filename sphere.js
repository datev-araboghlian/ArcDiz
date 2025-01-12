var scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

var c = document.getElementById('c');
var renderer = new THREE.WebGLRenderer({canvas: c, alpha: true, antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 100);
camera.position.z = 5;
camera.position.x = 2;
camera.position.y = 2;
scene.add(camera);

// Create a group for all shapes
var mainGroup = new THREE.Group();
scene.add(mainGroup);

function Shape(gen, x, y, z, r, dir) {
    this.gen = parseInt(gen);
    this.mesh;
    this.x = x;
    this.y = y;
    this.z = z;
    this.r = r;
    this.vertices = 30/this.gen;
    
    switch(dir){
        case "y0": 
            this.not = "y180";
            break;
        case "y90":
            this.not = "y270";
            break;
        case "y180":
            this.not = "y0";
            break;
        case "y270":
            this.not = "y90";
            break;
        case "z90":
            this.not = "z270";
            break;
        case "z270":
            this.not = "z90";
            break;
        default:
            this.not = 0;
    }
    
    this.geometry = new THREE.SphereGeometry(this.r, this.vertices, this.vertices, 0, Math.PI * 2, 0, Math.PI * 2);
    this.material = new THREE.MeshBasicMaterial({
        color: "#333333", 
        transparent: true, 
        opacity: .75, 
        wireframe: true
    });

    if (this.gen <= 4) {
        this.childr = this.r/2.5;
        var x, y, z, d;

        var y_angles = [0, 90, 180, 270];
        this.children = [];
        for (var a in y_angles) {
            d = (y_angles[a]) * Math.PI / 180;
            x = Math.cos(d)*(this.r+this.childr);
            y = Math.sin(d)*(this.r+this.childr);
            if (this.not != "y"+y_angles[a]) {
                this.children[this.children.length] = new Shape(
                    this.gen+1, 
                    this.x + x, 
                    this.y + y, 
                    this.z, 
                    this.childr, 
                    "y"+y_angles[a]
                );
            }
        }

        var z_angles = [90, 270];
        for (var a in z_angles) {
            d = (z_angles[a]) * Math.PI / 180;
            x = Math.cos(d)*(this.r+this.childr);
            z = Math.sin(d)*(this.r+this.childr);
            if (this.not != "z"+z_angles[a]) {
                this.children[this.children.length] = new Shape(
                    this.gen+1, 
                    this.x + x, 
                    this.y, 
                    this.z + z, 
                    this.childr, 
                    "z"+z_angles[a]
                );
            }
        }
    }  

    this.draw();
}

Shape.prototype.draw = function() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    mainGroup.add(this.mesh);
    this.mesh.position.x = this.x;
    this.mesh.position.y = this.y;
    this.mesh.position.z = this.z;
}

var shape = new Shape(1,0,0,0,1,0);

// Create smaller spheres
class SmallSphere {
    constructor(radius, speed, orbitRadius) {
        this.speed = speed;
        this.orbitRadius = orbitRadius;
        this.angle = Math.random() * Math.PI * 2;
        this.verticalOffset = Math.random() * Math.PI * 2; // Add random phase to vertical movement
        
        // Create geometry and material
        const geometry = new THREE.SphereGeometry(radius, 16, 16, 0, Math.PI * 2, 0, Math.PI * 2);
        const material = new THREE.MeshBasicMaterial({
            color: "#111111", // Darker color
            transparent: true,
            opacity: 0.4,
            wireframe: true
        });
        
        // Create mesh
        this.mesh = new THREE.Mesh(geometry, material);
        scene.add(this.mesh);
        
        // Random rotation speed with wider range
        this.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.02, // Slower rotation
            y: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
        };
        
        // Random orbit tilt
        this.orbitTilt = Math.random() * Math.PI * 0.25; // Up to 45 degrees tilt
    }
    
    update() {
        // Update orbit position with tilt
        this.angle += this.speed;
        
        // Calculate base position
        const x = Math.cos(this.angle) * this.orbitRadius;
        const y = Math.sin(this.angle * 1.5 + this.verticalOffset) * this.orbitRadius * 0.3;
        const z = Math.sin(this.angle) * this.orbitRadius - 2;
        
        // Apply orbit tilt
        this.mesh.position.x = x * Math.cos(this.orbitTilt) - z * Math.sin(this.orbitTilt);
        this.mesh.position.y = y;
        this.mesh.position.z = x * Math.sin(this.orbitTilt) + z * Math.cos(this.orbitTilt);
        
        // Rotate sphere
        this.mesh.rotation.x += this.rotationSpeed.x;
        this.mesh.rotation.y += this.rotationSpeed.y;
        this.mesh.rotation.z += this.rotationSpeed.z;
    }
}

// Create twenty small spheres with different parameters
const smallSpheres = [
    // First set (original)
    new SmallSphere(0.5, 0.005, 8),    // Larger orbit, slower
    new SmallSphere(0.3, 0.007, 6),    // Medium orbit, medium speed
    new SmallSphere(0.2, 0.01, 4),     // Small orbit, faster
    
    // Second set (previous additions)
    new SmallSphere(0.4, 0.006, 7),    // Between large and medium
    new SmallSphere(0.25, 0.008, 5),   // Between medium and small
    new SmallSphere(0.35, 0.007, 6.5), // Unique orbit
    new SmallSphere(0.3, 0.008, 5.5),  // Different speed
    new SmallSphere(0.45, 0.005, 7.5), // Larger with unique orbit
    new SmallSphere(0.2, 0.011, 4.5),  // Fast small one
    new SmallSphere(0.15, 0.012, 3.5), // Smallest and fastest
    
    // Ten new slower spheres
    new SmallSphere(0.4, 0.003, 8.5),  // Very slow, outer orbit
    new SmallSphere(0.35, 0.004, 7.8), // Slow, outer orbit
    new SmallSphere(0.3, 0.003, 7.2),  // Very slow, middle orbit
    new SmallSphere(0.25, 0.004, 6.8), // Slow, middle orbit
    new SmallSphere(0.45, 0.002, 6.2), // Largest, very slow
    new SmallSphere(0.2, 0.005, 5.8),  // Small, moderate speed
    new SmallSphere(0.3, 0.003, 5.2),  // Medium, very slow
    new SmallSphere(0.25, 0.004, 4.8), // Small-medium, slow
    new SmallSphere(0.15, 0.006, 4.2), // Very small, moderate speed
    new SmallSphere(0.2, 0.004, 3.8)   // Small, slow, inner orbit
];

// Add background sphere class with simplified movement
class BackgroundSphere {
    constructor(radius, speed, distance) {
        this.speed = speed;
        this.distance = distance;
        this.angle = Math.random() * Math.PI * 2;
        
        // Create geometry and material
        const geometry = new THREE.SphereGeometry(radius, 8, 8); // Less vertices for better performance
        const material = new THREE.MeshBasicMaterial({
            color: "#111111",
            transparent: true,
            opacity: 0.2, // More transparent
            wireframe: true
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        scene.add(this.mesh);
        
        // Random slow rotation
        this.rotationSpeed = {
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.01
        };
        
        // Set initial position
        this.setPosition();
    }
    
    setPosition() {
        // Random position in a spherical shell
        const phi = Math.random() * Math.PI * 2;
        const theta = Math.random() * Math.PI;
        
        this.mesh.position.x = this.distance * Math.sin(theta) * Math.cos(phi);
        this.mesh.position.y = this.distance * Math.sin(theta) * Math.sin(phi);
        this.mesh.position.z = this.distance * Math.cos(theta) - 10; // Push back
    }
    
    update() {
        // Simple rotation
        this.mesh.rotation.x += this.rotationSpeed.x;
        this.mesh.rotation.y += this.rotationSpeed.y;
        this.mesh.rotation.z += this.rotationSpeed.z;
        
        // Subtle position adjustment
        this.angle += this.speed;
        this.mesh.position.x += Math.sin(this.angle) * 0.01;
        this.mesh.position.y += Math.cos(this.angle) * 0.01;
    }
}

// Create array of background spheres
const backgroundSpheres = [];
const BG_SPHERE_COUNT = 30; // Number of background spheres

// Add background spheres at different distances
for (let i = 0; i < BG_SPHERE_COUNT; i++) {
    const radius = 0.05 + Math.random() * 0.1; // Very small radius
    const speed = 0.001 + Math.random() * 0.002; // Very slow movement
    const distance = 12 + Math.random() * 8; // Place far back
    backgroundSpheres.push(new BackgroundSphere(radius, speed, distance));
}

camera.lookAt(scene.position);
renderer.render(scene, camera);

// Random movement parameters
let rotationSpeeds = {
    x: (Math.random() - 0.5) * 0.02,
    y: (Math.random() - 0.5) * 0.02,
    z: (Math.random() - 0.5) * 0.02
};

let targetRotationSpeeds = {
    x: (Math.random() - 0.5) * 0.02,
    y: (Math.random() - 0.5) * 0.02,
    z: (Math.random() - 0.5) * 0.02
};

let time = 0;
const transitionSpeed = 0.02;

function updateRotationSpeeds() {
    rotationSpeeds.x += (targetRotationSpeeds.x - rotationSpeeds.x) * transitionSpeed;
    rotationSpeeds.y += (targetRotationSpeeds.y - rotationSpeeds.y) * transitionSpeed;
    rotationSpeeds.z += (targetRotationSpeeds.z - rotationSpeeds.z) * transitionSpeed;
    
    // Occasionally set new target speeds
    if (Math.random() < 0.02) {
        targetRotationSpeeds.x = (Math.random() - 0.5) * 0.02;
        targetRotationSpeeds.y = (Math.random() - 0.5) * 0.02;
        targetRotationSpeeds.z = (Math.random() - 0.5) * 0.02;
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // Original animations
    mainGroup.rotation.x += 0.001;
    mainGroup.rotation.y += 0.001;
    mainGroup.position.y = Math.sin(time * 0.5) * 0.2;
    mainGroup.position.x = Math.cos(time * 0.3) * 0.2;
    
    // Update small spheres
    smallSpheres.forEach(sphere => sphere.update());
    
    // Update background spheres
    backgroundSpheres.forEach(sphere => sphere.update());
    
    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', function(ev) {
    var w = window.innerWidth;
    var h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
});
