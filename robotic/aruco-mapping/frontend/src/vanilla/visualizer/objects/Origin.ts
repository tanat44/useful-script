import { Object3D, Vector3 } from "three"
import { Render } from "../Render"

export class Origin {
  objects: Object3D[]

  constructor() {
    this.objects = []
    const xLine = Render.createPath(
      [new Vector3(), new Vector3(1, 0, 0)],
      "red"
    )

    const yLine = Render.createPath(
      [new Vector3(), new Vector3(0, 1, 0)],
      "green"
    )
    const zLine = Render.createPath(
      [new Vector3(), new Vector3(0, 0, 1)],
      "blue"
    )
    const originDot = Render.createSphere(new Vector3(), 0.1, "black")

    this.objects.push(xLine, yLine, zLine, originDot)
  }
}
