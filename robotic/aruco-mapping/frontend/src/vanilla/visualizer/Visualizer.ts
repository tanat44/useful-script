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
import { PCamera } from "./PCamera"
import { Render } from "./Render"

// unit in meters
export class Visualizer {
  private time: number = 0
  private lastTime: Date = new Date()
  private event: Event
  private renderer!: WebGLRenderer
  private speed!: number
  private pausing: boolean

  container: HTMLDivElement
  canvas: HTMLCanvasElement
  camera!: PCamera
  scene!: Scene

  constructor(container: HTMLDivElement) {
    this.container = container
    this.canvas = document.createElement("canvas")
    this.container.appendChild(this.canvas)
    this.setupScene()
    this.setupLighting()

    this.event = new Event(this.canvas)
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
    const gridHelper = Render.gridHelper()
    gridHelper.position.set(0, 0, -0.01)
    this.scene.add(...origin.objects, gridHelper)
  }

  private setupLighting() {
    const ambientLight = new AmbientLight(0xffffff, 0.5)
    this.scene.add(ambientLight)

    const directionalLight = new DirectionalLight(0xffffff, 2)
    directionalLight.position.set(-5, -5, 5)
    directionalLight.castShadow = true
    this.scene.add(directionalLight)
  }

  private setupScene() {
    // scene
    this.scene = new Scene()
    this.scene.background = new Color(0xf0f0f0)
    this.renderer = new WebGLRenderer({ antialias: true, canvas: this.canvas })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.shadowMap.enabled = true
    this.canvas.addEventListener("contextmenu", (e) => e.preventDefault())
    window.addEventListener("resize", this.onWindowResize.bind(this))

    // camera
    this.camera = new PCamera(this)

    this.onWindowResize()
  }

  private onWindowResize(): void {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    this.canvas.width = w
    this.canvas.height = h
    this.renderer.setSize(w, h)
    this.camera.onWindowResize(w, h)
  }

  public render() {
    this.renderer.render(this.scene, this.camera.camera)
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
