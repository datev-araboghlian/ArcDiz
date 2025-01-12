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
    time += 0.01;
    
    updateRotationSpeeds();
    
    // Apply rotations
    mainGroup.rotation.x += rotationSpeeds.x;
    mainGroup.rotation.y += rotationSpeeds.y;
    mainGroup.rotation.z += rotationSpeeds.z;
    
    // Add some floating movement
    mainGroup.position.y = Math.sin(time * 0.5) * 0.2;
    mainGroup.position.x = Math.cos(time * 0.3) * 0.2;
    
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
