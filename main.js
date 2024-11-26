import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@latest/examples/jsm/loaders/GLTFLoader.js';
import * as SMITH from './smithing.js';

//Creating scene and camera objects
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Creating UI object specifiers
const left_arrow_ui = document.getElementById("left-arrow");
const right_arrow_ui  = document.getElementById("right-arrow");
const up_arrow_ui = document.getElementById("up-arrow");

//Creating renderer object and adding DOM element to page
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//Configuring scene and renderer
renderer.setClearColor(0xfcba03);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
scene.background = new THREE.Color("#fcba03");

//Creating clock object
const clock = new THREE.Clock();

//Creating model loader object
const model_loader = new GLTFLoader();

//Creating game objects
const sun_light = new THREE.DirectionalLight(0xffffff, 5);
const ambient_light = new THREE.AmbientLight(0xffffff, 1);

const floor_geo = new THREE.PlaneGeometry(30, 30);
const floor_mat = new THREE.MeshStandardMaterial({color: 0x757573, side: THREE.DoubleSide});
const floor_plane = new THREE.Mesh(floor_geo, floor_mat);

const forge_light_geo = new THREE.BoxGeometry(3, 1.5, 4);
const forge_light_mat = new THREE.MeshStandardMaterial({emissive: new THREE.Color(0xff8400), emissiveIntensity: 1.0, transparent: true, opacity: 0.8, color: 0x000000});
const forge_light = new THREE.Mesh(forge_light_geo, forge_light_mat);

const quench_oil_geo = new THREE.CircleGeometry(1.5, 32);
const quench_oil_mat = new THREE.MeshStandardMaterial({color: 0x875b08, transparent: true, opacity: 0.85, side: THREE.DoubleSide});
const quench_oil = new THREE.Mesh(quench_oil_geo, quench_oil_mat);

const grinder_table_geo = new THREE.BoxGeometry(5, 2.25, 5);
const grinder_table = new THREE.Mesh(grinder_table_geo, floor_mat);

const hammer = new THREE.Object3D();
const anvil = new THREE.Object3D();
const forge = new THREE.Object3D();
const bucket = new THREE.Object3D();
const grinder = new THREE.Object3D();

//Configuring and positioning game objects
sun_light.position.set(0, 20, 0);
sun_light.rotation.set(0, 0, 0);
sun_light.castShadow = true;
sun_light.shadow.mapSize.width = 512;
sun_light.shadow.mapSize.height = 512;
sun_light.shadow.camera.near = 0.5;
sun_light.shadow.camera.left = -20;
sun_light.shadow.camera.right = 20;
sun_light.shadow.camera.top = 20;
sun_light.shadow.camera.bottom = -20;
sun_light.shadow.camera.far = 300;

floor_plane.position.set(0, -6, 0);
floor_plane.rotation.x = Math.PI / 2;
floor_plane.receiveShadow = true;

forge_light.position.set(0, -1.25, 7.1);

quench_oil.position.set(6, -3.2, 0);
quench_oil.rotation.x = Math.PI / 2;

grinder_table.receiveShadow = true;
grinder_table.position.set(-5, -4, 0);

hammer.castShadow = true;
hammer.position.set(-2, -2, -4);
hammer.rotation.set(-Math.PI / 12, 0, Math.PI);

anvil.castShadow = true;
anvil.position.set(0, -5, -5);
anvil.rotation.set(0, Math.PI / 2, 0);

forge.castShadow = true;
forge.position.set(0, -7, 7);

bucket.castShadow = true;
bucket.position.set(6, -6.3, 0);

grinder.castShadow = true;
grinder.position.set(-5, -2, 0);
grinder.rotation.set(0, -Math.PI / 2, 0);

//Configure, position, and rotate camera
camera.rotation.order = "YXZ";
camera.rotation.set(-0.2, 0, 0);

//Loading models and parenting them to their corresponding objects
LoadModel("models/hammer.glb", hammer);
LoadModel("models/anvil.glb", anvil);
LoadModel("models/forge.glb", forge);
LoadModel("models/bucket.glb", bucket);
LoadModel("models/grinder.glb", grinder);

//Adding game objects to the scene
scene.add(sun_light);
scene.add(ambient_light);
scene.add(forge_light);
scene.add(quench_oil);
scene.add(grinder_table);
scene.add(floor_plane);
scene.add(hammer);
scene.add(anvil);
scene.add(forge);
scene.add(bucket);
scene.add(grinder);

//Creating variables for tracking current view and animation state
const workstation = {id: 0, focused: false, lerp_alpha: 0, rot_lerp_alpha: 0, rot_start: 0, rot_end: 0};

//Creating a raycaster and mouse position vector
const mouse_pos = new THREE.Vector2(0, 0);
const raycaster = new THREE.Raycaster();

//Click event listener
document.addEventListener("click", (e) => {
    //Translate screen pixel coords to normalized viewport coords
    mouse_pos.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse_pos.y = -(e.clientY / window.innerHeight) * 2 + 1;

    //Check if user clicked left navigation button
    if(mouse_pos.x <= -0.8 && mouse_pos.x >= -1 && !workstation.focused && workstation.lerp_alpha == 0 && workstation.rot_lerp_alpha == 1)
    {
        //Update workstation view object properties
        workstation.rot_start = workstation.id * (Math.PI / 2);
        workstation.id++;
        workstation.rot_end = workstation.id * (Math.PI / 2);
        if(workstation.id > 3) workstation.id = 0;
        workstation.rot_lerp_alpha = 0;
    }
    //Check if user clicked right navigation button
    else if(mouse_pos.x >= 0.8 && mouse_pos.x <= 1 && !workstation.focused && workstation.lerp_alpha == 0 && workstation.rot_lerp_alpha == 1)
    {
        //Update workstation view object properties
        workstation.rot_start = workstation.id * (Math.PI / 2);
        workstation.id--;
        workstation.rot_end = workstation.id * (Math.PI / 2);
        if(workstation.id < 0) workstation.id = 3;
        workstation.rot_lerp_alpha = 0;
    }
    //Check if user clicked bottom navigation button
    else if(mouse_pos.y <= -0.5 && mouse_pos.y >= -1)
    {
        //Update workstation view object focus state
        workstation.focused = !workstation.focused;

        //Toggle left and right navigation buttons based on workstation view focus state
        if(workstation.focused)
        {
            left_arrow_ui.style.visibility = "hidden";
            right_arrow_ui.style.visibility = "hidden";
            up_arrow_ui.innerHTML = "&dArr;";
        }
        else
        {
            left_arrow_ui.style.visibility = "visible";
            right_arrow_ui.style.visibility = "visible";
            up_arrow_ui.innerHTML = "&uArr;";
        }
    }
});

//Update loop
function update()
{
    //Get deltatime
    const deltatime = clock.getDelta();

    //Update and clamp lerp alpha
    workstation.lerp_alpha += 0.9 * deltatime * (workstation.focused ? 1 : -1);
    workstation.lerp_alpha = Math.min(Math.max(workstation.lerp_alpha, 0), 1);

    //Update and clamp rotation lerp alpha
    workstation.rot_lerp_alpha += 0.9 * deltatime;
    workstation.rot_lerp_alpha = Math.min(Math.max(workstation.rot_lerp_alpha, 0), 1);

    //Lerp position and rotation of camera based on currently viewed workstation
    const workstation_pos = new THREE.Vector3(0, 0, 0);
    const workstation_rot = new THREE.Vector3(0, 0, 0);
    switch(workstation.id)
    {
        case 0:
            workstation_pos.set(0, 0, -2);
            break;
        case 1:
            workstation_pos.set(-2, 0, 0);
            break;
        case 2:
            workstation_pos.set(0, 0, 2);
            break;
        case 3:
            workstation_pos.set(2, 0, 0);
            break;
    }
    workstation_rot.lerpVectors(new THREE.Vector3(-0.2, 0, 0), new THREE.Vector3(-0.8, 0, 0), workstation.lerp_alpha);
    camera.rotation.x = workstation_rot.x;
    workstation_rot.lerpVectors(new THREE.Vector3(0, workstation.rot_start, 0), new THREE.Vector3(0, workstation.rot_end, 0), workstation.rot_lerp_alpha);
    camera.rotation.y = workstation_rot.y;
    camera.position.lerpVectors(new THREE.Vector3(0, 0, 0), workstation_pos, workstation.lerp_alpha);

    //Render the scene to the camera
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(update);

//Model loading and parenting function
function LoadModel(model_path, parent)
{
    model_loader.load(model_path,
        (gltf) => {
            let model = gltf.scene;
            model.traverse((child) => {
                if(child.isMesh) child.castShadow = true;
            });
            parent.add(model);
        },
        undefined,
        (error) => {
            console.log("Error: " + error);
        }
    );
}