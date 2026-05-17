import { MqttClient } from "./mqtt/MqttClient"
import { Visualizer } from "./visualizer/Visualizer"

export class Context {
  mqtt: MqttClient
  visualizer: Visualizer

  constructor(container: HTMLDivElement) {
    this.visualizer = new Visualizer(container)
    this.mqtt = new MqttClient(this)
  }
}
