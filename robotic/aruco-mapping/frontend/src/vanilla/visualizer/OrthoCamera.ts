import { OrthographicCamera } from "three"
import { OrthoOrbit } from "./OrthoOrbit"
import type { Visualizer } from "./Visualizer"

export class OrthoCamera {
  camera: OrthographicCamera
  orbit: OrthoOrbit

  constructor(visualizer: Visualizer) {
    // camera
    this.camera = new OrthographicCamera()
    this.camera.position.set(-1, -2, 1)
    this.camera.up.set(0, 0, 1)
    this.camera.lookAt(0, 0, 0)
    this.camera.position.z += 3

    // orbit
    this.orbit = new OrthoOrbit(this.camera, visualizer)
  }
}
