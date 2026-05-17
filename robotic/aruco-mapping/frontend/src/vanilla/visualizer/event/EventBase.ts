import type { EventType } from "./types"

export abstract class EventBase {
  readonly type: EventType

  constructor(type: EventType = "undefined") {
    this.type = type
  }
}
