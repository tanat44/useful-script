import type { Object3D } from "three"
import { onPlayerAruco } from "./eventhandler/onPlayerAruco"
import { MqttClient } from "./mqtt/MqttClient"
import { Visualizer } from "./visualizer/Visualizer"

export class Context {
  // components
  mqtt: MqttClient
  visualizer: Visualizer

  // data
  markers: Map<number, Object3D> = new Map()

  constructor(container: HTMLDivElement) {
    this.visualizer = new Visualizer(container)
    this.mqtt = new MqttClient(this)
    this.init()
  }

  async init() {
    await this.mqtt.waitForConnection()
    console.log("connected")
    this.mqtt.subscribe("player/aruco", "object", (payload) =>
      onPlayerAruco(this, payload)
    )
  }
}
