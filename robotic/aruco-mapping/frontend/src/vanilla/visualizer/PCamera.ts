import {
  Box3,
  PerspectiveCamera,
  Plane,
  Raycaster,
  Vector2,
  Vector3,
} from "three"
import type { Visualizer } from "./Visualizer"

export class PCamera {
  visualizer: Visualizer
  camera: PerspectiveCamera
  rayCaster: Raycaster = new Raycaster()
  cameraStartWorld: Vector3 = new Vector3()
  mouseDownScreen?: Vector2
  viewCenterWorld?: Vector3
  zoom: number = 1

  constructor(visualizer: Visualizer) {
    this.visualizer = visualizer
    // camera
    this.camera = new PerspectiveCamera(50)
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
    this.viewCenterWorld = this.findGroundIntersection(new Vector2())
    this.cameraStartWorld = this.camera.position.clone()
  }

  private onMouseMove(event: MouseEvent): void {
    // if (!this.mouseDownPos) return
    // const newScreenPos = this.getMouseScreenPosition(event)
    // const newWorldPos = this.unproject(newScreenPos)
    // if (!newWorldPos) return
    // const button = event.buttons
    // let moved = false
    // // left click = rotate
    // if (button == 1) {
    //   const screenMove = newScreenPos.clone().sub(this.mouseDownPos)
    //   // yaw
    //   const YAW_SPEED = 5
    //   const rotYaw = new Quaternion()
    //   rotYaw.setFromAxisAngle(new Vector3(0, 0, 1), -screenMove.x * YAW_SPEED)
    //   const newPos = this.cameraStartPos.clone().applyQuaternion(rotYaw)
    //   // pitch
    //   const PITCH_SPEED = 40
    //   newPos.z += (-screenMove.y * PITCH_SPEED) / Math.sqrt(this.zoom)
    //   // apply
    //   this.camera.position.copy(newPos)
    //   if (this.viewCenter) {
    //     this.camera.lookAt(this.viewCenter)
    //   } else this.camera.lookAt(new Vector3())
    //   moved = true
    //   // right click = pan
    // } else if (button == 2) {
    //   const move = newWorldPos
    //     .clone()
    //     .sub(this.unproject(this.mouseDownPos))
    //     .multiplyScalar(2)
    //   const newCamera = this.cameraStartPos
    //     .clone()
    //     .sub(move)
    //     .normalize()
    //     .multiplyScalar(ORBIT_RADIUS)
    //   this.camera.position.set(newCamera.x, newCamera.y, newCamera.z)
    //   moved = true
    // }
    // this.updateNearFar()
    // this.camera.updateProjectionMatrix()
    // if (moved) {
    //   const direction = new Vector3(0, 0, -1).applyQuaternion(
    //     this.camera.quaternion
    //   )
    //   this.visualizer.emit(
    //     new CameraMoveEvent(this.camera.position.clone(), direction)
    //   )
    // }
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

  private unproject(screenPos: Vector2): Vector3 {
    return new Vector3(screenPos.x, screenPos.y, 1).unproject(this.camera)
  }

  private getMouseScreenPosition(event: MouseEvent | WheelEvent): Vector2 {
    const mousePosition = new Vector2()
    const canvas = this.visualizer.canvas

    mousePosition.x =
      (event.clientX - canvas.offsetLeft) / canvas.offsetWidth - 1
    mousePosition.y =
      -((event.clientY - canvas.offsetTop) / canvas.offsetHeight) + 1
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

  updateZoom(zoom: number, center?: Vector2): void {
    const aspect = window.innerWidth / window.innerHeight

    // if (center) {
    //   const oldPos = this.getMouseWorldPosition(center);
    //   if (!oldPos) return;
    //   const newCenter = center.multiplyScalar(zoom / this.zoom);
    //   const newPos = this.getMouseWorldPosition(newCenter);
    //   if (!newPos) return;
    //   const move = newPos.sub(oldPos);
    //   const newCameraPos = this.camera.position
    //     .clone()
    //     .sub(move)
    //     .normalize()
    //     .multiplyScalar(ORBIT_RADIUS);
    //   this.camera.position.set(newCameraPos.x, newCameraPos.y, newCameraPos.z);
    // }
    this.zoom = zoom
    this.updateNearFar()
    this.camera.updateProjectionMatrix()
  }

  onWindowResize(width: number, height: number): void {
    console.log("a", width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }
}
