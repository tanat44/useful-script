import { EventBase } from "./EventBase"

export class AnimateEvent extends EventBase {
  deltaTime: number

  constructor(deltaTime: number) {
    super("animate")
    this.deltaTime = deltaTime
  }
}
