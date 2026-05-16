import { Vector3 } from "three"
import { EventBase } from "./EventBase"

export class CameraMoveEvent extends EventBase {
  position: Vector3
  direction: Vector3

  constructor(position: Vector3, direction: Vector3) {
    super("cameramove")
    this.position = position
    this.direction = direction
  }
}
