import { MqttClient } from "./mqtt/MqttClient"
import { Visualizer } from "./visualizer/Visualizer"

export class Context {
  mqtt: MqttClient
  visualizer: Visualizer

  constructor(canvas: HTMLCanvasElement) {
    this.visualizer = new Visualizer(canvas)
    this.mqtt = new MqttClient(this)
  }
}
