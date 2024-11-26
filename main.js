import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/loaders/GLTFLoader.js';

//Creating scene and camera objects
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Creating renderer object and adding DOM element to page
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Configuring scene and renderer
renderer.setClearColor(0xfcba03);
scene.background = new THREE.Color("#fcba03");

//Creating model loader object
const model_loader = new GLTFLoader();

//Creating game objects
const light = new THREE.DirectionalLight(0xffffff, 0.5);

const floor_geo = new THREE.PlaneGeometry(10, 10);
const floor_mat = new THREE.MeshBasicMaterial({color: "#fcba03"});
const floor_plane = new THREE.Mesh(floor_geo, floor_mat);

const hammer = new THREE.Object3D();
const anvil = new THREE.Object3D();

//Configuring and positioning game objects
floor_plane.position.y = -1.0;
hammer.castShadow = true;
hammer.position.x = -1.0;
anvil.castShadow = true;
anvil.position.x = 1.0;

//Position camera
camera.position.y = 5.0;
camera.position.z = 2.0;

//Loading models and parenting them to their corresponding objects
LoadModel("models/hammer.glb", hammer);
LoadModel("models/anvil.glb", anvil);

//Adding game objects to the scene
scene.add(light);
scene.add(floor_plane);
scene.add(hammer);
scene.add(anvil);

//Debug key events for camera rotation
document.addEventListener("keydown", (e) => {
    switch(e.key)
    {
        case " ":
            console.log("x: " + camera.rotation.x + " ,y: " + camera.rotation.y);
            break;
        case "ArrowUp":
            camera.rotation.x += 0.5;
            break;
        case "ArrowDown":
            camera.rotation.x -= 0.5;
            break;
        case "ArrowLeft":
            camera.rotation.y += 0.5;
            break;
        case "ArrowRight":
            camera.rotation.y -= 0.5;
            break;
    }
});

//Update loop
function update()
{
    //Render the scene to the camera
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(update);

//Model loading and parenting function
function LoadModel(model_path, parent)
{
    model_loader.load(model_path,
        (gltf) => {
            parent.add(gltf.scene);
        },
        undefined,
        (error) => {
            console.log("Error: " + error);
        }
    );
}