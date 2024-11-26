import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Creating scene and camera objects
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Creating renderer object and adding DOM element to page
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Creating model loader object
const model_loader = new GLTFLoader();

//Creating game objects
const floor_plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), new THREE.MeshBasicMaterial({color: "#d199c4"}));
const hammer = new THREE.Object3D();
const anvil = new THREE.Object3D();

//Configuring and positioning game objects
floor_plane.position.y = -1.0;
hammer.castShadow = true;
hammer.position.z = -1.0;
anvil.castShadow = true;
anvil.position.z = 1.0;

//Position and rotate camera
camera.position.y = 1.0;
camera.position.x = -1.0;
camera.rotation.z = 0.5;

//Loading models and parenting them to their corresponding objects
LoadModel("models/hammer.glb", hammer);
LoadModel("models/anvil.glb", anvil);

//Adding game objects to the scene
scene.add(floor_plane);
scene.add(hammer);
scene.add(anvil);

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