import {
  AmbientLight,
  Color,
  DirectionalLight,
  Scene,
  WebGLRenderer,
} from "three"
import { Event } from "./event/Event"
import type { EventBase } from "./event/EventBase"
import type { EventType } from "./event/types"
import { Origin } from "./objects/Origin"
import { OrthoCamera } from "./OrthoCamera"

// unit in meters
export class Visualizer {
  private time: number = 0
  private lastTime: Date = new Date()
  private event: Event
  private renderer!: WebGLRenderer
  private speed!: number
  private pausing: boolean

  canvas: HTMLCanvasElement
  orthoCamera!: OrthoCamera
  scene!: Scene
  text: Text

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.setupScene()
    this.setupLighting()

    this.event = new Event(this.canvas)
    this.text = new Text(this)
    this.pausing = false

    this.createObjects()
    this.animate()
  }

  onEvent<T extends EventBase>(eventType: EventType, callback: (e: T) => void) {
    this.event.on(eventType, callback)
  }

  offEvent<T extends EventBase>(
    eventType: EventType,
    callback: (e: T) => void
  ) {
    this.event.off(eventType, callback)
  }

  emit(event: EventBase) {
    this.event.emit(event)
  }

  private async createObjects() {
    // await this.text.load()
    const origin = new Origin()
    this.scene.add(...origin.objects)
  }

  private setupLighting() {
    const ambientLight = new AmbientLight(0xffffff, 0.5)
    this.scene.add(ambientLight)

    const directionalLight = new DirectionalLight(0xffffff, 2)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    this.scene.add(directionalLight)
  }

  private setupScene() {
    // scene
    this.scene = new Scene()
    this.scene.background = new Color(0xf0f0f0)

    // const gridHelper = new GridHelper(100, 10);
    // gridHelper.rotateX(Math.PI / 2);
    // this.scene.add(gridHelper);

    this.renderer = new WebGLRenderer({ antialias: true, canvas: this.canvas })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.shadowMap.enabled = true

    // camera
    this.orthoCamera = new OrthoCamera(this)
    this.scene.add(this.orthoCamera.camera)
  }

  public render() {
    this.renderer.render(this.scene, this.orthoCamera.camera)
  }

  private animate() {
    requestAnimationFrame(() => this.animate())
    this.render()

    const now = new Date()
    let deltaTime =
      ((now.getTime() - this.lastTime.getTime()) / 1000) * this.speed
    this.lastTime = now

    if (isNaN(deltaTime)) deltaTime = 0
    if (!this.pausing) {
      this.time += deltaTime
      this.event.emit({
        type: "animate",
        deltaTime,
      })
    }
  }
}
