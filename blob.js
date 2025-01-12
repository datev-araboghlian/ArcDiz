const vertexShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;
uniform float time;

//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  // Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
    vUv = uv;
    vNormal = normal;
    vPosition = position;
    
    vec3 pos = position;
    float noiseFreq = 1.5;
    float noiseAmp = 0.4;
    vec3 noisePos = vec3(pos.x * noiseFreq + time, pos.y, pos.z);
    pos.z += snoise(noisePos) * noiseAmp;
    
    vDisplacement = pos.z;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying float vDisplacement;

void main() {
    // Glossy off-white base color
    vec3 baseColor = vec3(0.95, 0.95, 0.93);
    
    // Primary light
    vec3 lightPos = vec3(2.0, 2.0, 2.0);
    vec3 lightDir = normalize(lightPos - vPosition);
    float diffuse = max(0.0, dot(vNormal, lightDir));
    
    // Enhanced specular highlight
    vec3 viewDir = normalize(-vPosition);
    vec3 halfwayDir = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfwayDir), 0.0), 256.0); // Very sharp highlights
    
    // Soft rim light
    float rimPower = 2.0;
    float rim = pow(1.0 - max(dot(viewDir, vNormal), 0.0), rimPower);
    
    // Enhanced environment reflection
    vec3 reflectDir = reflect(-viewDir, vNormal);
    float fresnel = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0);
    
    // Subtle color variation for reflection
    vec3 reflectionTint = vec3(0.98, 0.98, 0.96);
    
    // Combine all lighting effects
    vec3 color = baseColor * (0.3 + diffuse * 0.7)        // Base color with soft diffuse
                 + reflectionTint * spec * 1.0             // Sharp specular highlights
                 + vec3(1.0) * rim * 0.3                   // Subtle rim lighting
                 + reflectionTint * fresnel * 0.8;         // Soft fresnel reflection
    
    // Add very subtle displacement variation
    color += vec3(0.02) * vDisplacement;
    
    gl_FragColor = vec4(color, 0.95);
}
`;

// Set up scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('blob-canvas'),
    alpha: true,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0); // Make background transparent

// Adjust camera and scene
camera.position.z = 12;
scene.fog = null;

// Create blobs with constrained movement
class Blob {
    constructor(size, speed, startPos) {
        this.geometry = new THREE.SphereGeometry(size, 128, 128);
        this.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                time: { value: 0 }
            },
            transparent: true
        });
        
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(...startPos);
        this.speed = speed;
        this.time = Math.random() * 1000;
        this.size = size;
        
        // Movement boundaries
        this.bounds = {
            x: 4 - size,
            y: 3 - size,
            z: 2 - size
        };
        
        scene.add(this.mesh);
    }
    
    update() {
        this.time += this.speed;
        this.material.uniforms.time.value = this.time * 0.01;
        
        // Calculate new position
        let newX = this.mesh.position.x + Math.sin(this.time * 0.001) * 0.01 * this.speed;
        let newY = this.mesh.position.y + Math.cos(this.time * 0.002) * 0.01 * this.speed;
        let newZ = Math.sin(this.time * 0.001) * 0.5;
        
        // Constrain within bounds
        this.mesh.position.x = Math.max(-this.bounds.x, Math.min(this.bounds.x, newX));
        this.mesh.position.y = Math.max(-this.bounds.y, Math.min(this.bounds.y, newY));
        this.mesh.position.z = Math.max(-this.bounds.z, Math.min(this.bounds.z, newZ));
        
        // Bounce if hitting bounds
        if (Math.abs(this.mesh.position.x) >= this.bounds.x) {
            this.speed *= -0.8;
        }
        if (Math.abs(this.mesh.position.y) >= this.bounds.y) {
            this.speed *= -0.8;
        }
        
        // Rotation
        this.mesh.rotation.x += 0.001 * this.speed;
        this.mesh.rotation.y += 0.001 * this.speed;
    }
}

// Create multiple smaller blobs around the edges
const blobs = [];
const numBlobs = 20; // More blobs

// Helper function to get random edge position
function getRandomEdgePosition() {
    const edge = Math.floor(Math.random() * 4);
    const size = 0.2 + Math.random() * 0.3; // Smaller size range
    let x, y;
    
    const margin = 2; // Distance from edge
    const spread = 16; // How far along the edge they spread
    
    switch(edge) {
        case 0: // top
            x = (Math.random() * spread) - spread/2;
            y = 5;
            break;
        case 1: // right
            x = spread/2;
            y = (Math.random() * 10) - 5;
            break;
        case 2: // bottom
            x = (Math.random() * spread) - spread/2;
            y = -5;
            break;
        case 3: // left
            x = -spread/2;
            y = (Math.random() * 10) - 5;
            break;
    }
    
    return { x, y, size };
}

// Create blobs around the edges
for (let i = 0; i < numBlobs; i++) {
    const pos = getRandomEdgePosition();
    const speed = 0.3 + Math.random() * 0.4; // Slower speed range
    blobs.push(new Blob(pos.size, speed, [pos.x, pos.y, -2]));
}

// Animation
function animate() {
    requestAnimationFrame(animate);
    
    // Update all blobs
    blobs.forEach(blob => blob.update());
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
