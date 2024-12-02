// @ts-ignore
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PerspectiveCamera, Raycaster, Scene, WebGLRenderer } from "three";
import Stats from "three/examples/jsm/libs/stats.module";
import * as THREE from "three";

export class Manager {
  scene: Scene;
  camera: PerspectiveCamera;
  raycaster: Raycaster;
  renderer: WebGLRenderer;
  orbitControl: OrbitControls;
  stats: Stats;

  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.stats = new Stats();
    this.setupScene();
    this.setupLighting();
    this.setupOrbitControl();
    this.addTestObject();
    this.animate();
  }

  addTestObject() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    const SPACE = 10;
    const SIZE = 0.1;
    for (let i = 0; i < 10000; ++i) {
      const object = cube.clone();
      object.position.set(
        Math.random() * SPACE,
        Math.random() * SPACE,
        Math.random() * SPACE
      );
      object.scale.set(SIZE, SIZE, SIZE);
      this.scene.add(object);
    }
  }

  setupLighting() {
    this.scene.add(new THREE.AmbientLight(0xf0f0f0));
    const light = new THREE.SpotLight(0xffffff, 1.0);
    light.position.set(0, 1500, 200);
    light.angle = Math.PI * 0.2;
    light.castShadow = true;
    light.shadow.camera.near = 200;
    light.shadow.camera.far = 2000;
    light.shadow.bias = -0.000222;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    this.scene.add(light);
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(30, 30, 30);
    this.scene.add(this.camera);

    const gridHelper = new THREE.GridHelper(10, 10);
    this.scene.add(gridHelper);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    document.body.appendChild(this.renderer.domElement);

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);

    window.addEventListener("resize", () => this.onWindowResize(this));
  }

  setupOrbitControl() {
    this.orbitControl = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.orbitControl.damping = 0.2;
    this.orbitControl.addEventListener("change", () => this.render());
  }

  onWindowResize(manager: Manager) {
    manager.camera.aspect = window.innerWidth / window.innerHeight;
    manager.camera.updateProjectionMatrix();
    manager.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    this.render();
    this.stats.update();
  }
}
