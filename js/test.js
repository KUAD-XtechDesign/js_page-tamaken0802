import * as THREE from './build/three.module.js';
import { OrbitControls } from './jsm/controls/OrbitControls.js';
import { GLTFLoader } from './jsm/loaders/GLTFLoader.js';
import { VRButton } from './jsm/webxr/VRButton.js';

init();

async function init() {
  const canvas = document.createElement('canvas');

  document.body.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  const scene = new THREE.Scene();
  const width = window.innerWidth;
  const height = window.innerHeight;

  renderer.setPixelRatio(1);
  renderer.setSize(width, height);

  const camera = new THREE.PerspectiveCamera(45, width / height, 1, 100);

  camera.position.set(0, 1, 10);

  const controls = new OrbitControls(camera, renderer.domElement);

  const light = new THREE.AmbientLight(0xFFFFFF, 1.0);

  scene.add(light);

  const loader = new GLTFLoader();
  const url = '/glass_circles_copy.glb';

  const model = await (() => {
    return new Promise((resolve) => {
      loader.load(
        url,
        (gltf) => {
          resolve(gltf.scene);
        },
        (err) => {
          console.error(err);
        }
      );
    });
  })();

  model.traverse((object) => {
    if (object.isMesh) {
      object.material.color.r = 1;
      object.material.color.g = 0;
      object.material.color.b = 0;
      object.material.transparent = true;
      object.material.opacity = .8;
    }
  });

  model.position.set(0, 0, 0);
  scene.add(model);

  renderer.setAnimationLoop(tick);
  document.body.appendChild(VRButton.createButton(renderer));

  function tick() {
    controls.update();

    if (model) {
      model.rotation.y += .01;
    }

    renderer.render(scene, camera);
  }
}