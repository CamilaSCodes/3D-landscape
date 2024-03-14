import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Initialize scene, camera, renderer and configura them
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector('#base') });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(-10, 15, 5);

// Show loading indicator and text
document.getElementById('loading-overlay').style.display = 'flex';

const loader = new GLTFLoader();

loader.load('/scene.gltf', function (gltf) {
    document.getElementById('loading-overlay').style.display = 'none'; // Hide loading indicator once model is loaded

    // Modify the scene to better accommodate the model
    const box = new THREE.Box3().setFromObject(gltf.scene);
    camera.position.z -= Math.max(box.max.x - box.min.x, box.max.y - box.min.y, box.max.z - box.min.z) * 0.7;
    scene.add(gltf.scene);

    // Allow movements
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // Add rotation
    function animate() {
        requestAnimationFrame(animate);
        gltf.scene.rotation.y -= 0.002;
        renderer.render(scene, camera);
    }
    animate();
});

// Add lights to the scene
const topLight = new THREE.DirectionalLight(0xffccaa, 5);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
const directionalLight = new THREE.DirectionalLight(0xadd8e6, 1);
directionalLight.position.set(0, 1, 1);
const ambientLight = new THREE.AmbientLight(0xadd8e6, 0.5);
scene.add(topLight, directionalLight, ambientLight);

// Generate random little white spheres to emulate stars
function stars() {
    const geometry = new THREE.SphereGeometry(0.08, 24, 24);
    const material = new THREE.PointsMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}

Array(150).fill().forEach(stars);

// Set background
const space = new THREE.TextureLoader().load('/background2.png');
scene.background = space;
