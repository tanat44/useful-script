import type { EventBase } from "./EventBase"

export type EmitFunc = (e: EventBase) => void

export type EventType = "undefined" | "animate" | "cameramove"
