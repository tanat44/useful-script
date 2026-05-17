import {
  Box3,
  Euler,
  Matrix4,
  PerspectiveCamera,
  Plane,
  Quaternion,
  Raycaster,
  Vector2,
  Vector3,
} from "three"
import type { Visualizer } from "./Visualizer"

enum Mode {
  None,
  Drag,
  Orbit,
}

const PAN_SPEED = 10
const ORBIT_SPEED = 1

export class PCamera {
  visualizer: Visualizer
  camera: PerspectiveCamera
  rayCaster: Raycaster = new Raycaster()
  cameraStartPos: Vector3 = new Vector3()
  cameraStartMatrix: Matrix4 = new Matrix4()
  cameraStartQuaternion: Quaternion = new Quaternion()
  mouseDownScreen?: Vector2
  focalPoint?: Vector3
  zoom: number = 1
  currentMode: Mode = Mode.None

  constructor(visualizer: Visualizer) {
    this.visualizer = visualizer
    // camera
    this.camera = new PerspectiveCamera(50, 1, 0.0001, 1000)
    this.camera.position.set(-2, -4, 1.6)
    this.camera.up.set(0, 0, 1)
    this.camera.lookAt(0, 0, 1.6)

    // listen to events
    const domElement = visualizer.canvas
    domElement.addEventListener("mousedown", this.onMouseDown.bind(this))
    domElement.addEventListener("mousemove", this.onMouseMove.bind(this))
    domElement.addEventListener("mouseup", this.onMouseUp.bind(this))
    domElement.addEventListener("wheel", this.onWheel.bind(this), {
      passive: true,
    })

    // add to scene
    visualizer.scene.add(this.camera)
  }

  private onMouseDown(event: MouseEvent): void {
    this.mouseDownScreen = this.getMouseScreenPosition(event)
    this.focalPoint = this.findGroundIntersection(this.mouseDownScreen)
    this.cameraStartPos = this.camera.position.clone()
    this.cameraStartMatrix = this.camera.matrixWorld.clone()
    this.cameraStartQuaternion = this.camera.quaternion.clone()

    const button = event.buttons
    if (button === 0) this.currentMode = Mode.None
    else if (button === 1) this.currentMode = Mode.Drag
    else if (button === 2) this.currentMode = Mode.Orbit
  }

  private onMouseMove(event: MouseEvent): void {
    if (this.currentMode === Mode.None || !this.mouseDownScreen) return

    const screenPos = this.getMouseScreenPosition(event)
    const delta = screenPos.clone().sub(this.mouseDownScreen)

    if (this.currentMode === Mode.Drag && this.focalPoint) {
      // const a = new Vector3(screenPos.x, screenPos.y, 1).unproject(this.camera)
      // const intersect = new Vector3()

      // const found = new Plane(new Vector3(0, 0, 1)).intersectLine(
      //   new Line3(this.camera.position, a),
      //   intersect
      // )
      // if (!found) return
      // const moveWorld = intersect
      //   .clone()
      //   .sub(this.focalPoint)
      //   .multiplyScalar(-1)
      // const cameraPos = this.cameraStartPos
      //   .clone()
      //   .add(moveWorld)
      // this.camera.position.copy(cameraPos)
      const moveRight = new Vector3(1, 0, 0)
        .applyQuaternion(this.cameraStartQuaternion)
        .projectOnPlane(new Vector3(0, 0, 1))
        .normalize()
        .multiplyScalar(delta.x * -1)

      const moveUp = new Vector3(0, 0, 1)
        .applyQuaternion(this.cameraStartQuaternion)
        .projectOnPlane(new Vector3(0, 0, 1))
        .normalize()
        .multiplyScalar(delta.y)

      const moveWorld = moveRight.clone().add(moveUp).multiplyScalar(PAN_SPEED)
      const cameraPos = this.cameraStartPos.clone().add(moveWorld)
      this.camera.position.copy(cameraPos)
    } else if (this.currentMode === Mode.Orbit && this.focalPoint) {
      // rotate
      const euler = new Euler()
      euler.setFromQuaternion(this.cameraStartQuaternion)
      const pitch = delta.y * ORBIT_SPEED + euler.x
      const x = new Vector3(1, 0, 0)
      const qPitch = new Quaternion().setFromAxisAngle(x, pitch)
      const yaw = -delta.x * ORBIT_SPEED + euler.y
      const qYaw = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), yaw)

      const qNew = new Quaternion().multiply(qYaw).multiply(qPitch)
      this.camera.quaternion.copy(qNew)

      // translate
      const dq = qNew
        .clone()
        .multiply(this.cameraStartQuaternion.clone().invert())
      const posNew = this.cameraStartPos.clone().sub(this.focalPoint)
      posNew.applyQuaternion(dq).add(this.focalPoint)
      this.camera.position.copy(posNew)
    }
    this.camera.updateProjectionMatrix()
  }

  private updateNearFar(): void {
    const sceneBox = new Box3().setFromObject(this.visualizer.scene)
    const low = sceneBox.min
    const high = sceneBox.max

    if (sceneBox.isEmpty()) {
      low.set(-10, -10, -10)
      high.set(10, 10, 10)
    }

    const corners: Vector3[] = [
      new Vector3(low.x, low.y, low.z),
      new Vector3(high.x, low.y, low.z),
      new Vector3(low.x, high.y, low.z),
      new Vector3(low.x, low.y, high.z),
      new Vector3(high.x, high.y, low.z),
      new Vector3(high.x, low.y, high.z),
      new Vector3(low.x, high.y, high.z),
      new Vector3(high.x, high.y, high.z),
    ]

    const forward = this.camera.getWorldDirection(new Vector3(0, 0, -1))
    const distances = corners.map((corner) =>
      corner.sub(this.camera.position).dot(forward)
    )
    const minDistance = Math.min(...distances)
    const maxDistance = Math.max(...distances)
    this.camera.near = minDistance
    this.camera.far = maxDistance
  }

  private onMouseUp(_event: MouseEvent): void {
    this.mouseDownScreen = undefined
    this.focalPoint = undefined
  }

  private onWheel(event: WheelEvent): void {
    let y = event.deltaY
    let zoom = this.zoom
    if (y > 0) {
      zoom *= 1.1 // Zoom in
    } else {
      zoom /= 1.1 // Zoom out
    }
    this.updateZoom(zoom, this.getMouseScreenPosition(event))
  }

  private getMouseScreenPosition(event: MouseEvent | WheelEvent): Vector2 {
    const mousePosition = new Vector2()
    const canvas = this.visualizer.canvas

    mousePosition.x =
      ((event.clientX - canvas.offsetLeft) / canvas.clientWidth) * 2 - 1
    mousePosition.y =
      ((event.clientY - canvas.offsetTop) / canvas.clientHeight) * -2 + 1
    return mousePosition
  }

  private findGroundIntersection(screenPosition: Vector2): Vector3 | undefined {
    this.rayCaster.setFromCamera(screenPosition.clone(), this.camera)
    const point = new Vector3()
    if (
      !this.rayCaster.ray.intersectPlane(
        new Plane(new Vector3(0, 0, 1), 0),
        point
      )
    ) {
      console.warn("Raycaster did not intersect with the plane.")
      return undefined
    }

    return point
  }

  updateZoom(zoom: number, center?: Vector2): void {}

  onWindowResize(width: number, height: number): void {
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }
}
