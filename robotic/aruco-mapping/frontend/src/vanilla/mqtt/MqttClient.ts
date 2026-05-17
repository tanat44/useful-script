import mqtt from "mqtt"
import type { Context } from "../Context"
import { useVanillaContextStore } from "../store"
import { handleAruco } from "./handleAruco"

export class MqttClient {
  context: Context
  client: mqtt.MqttClient

  constructor(context: Context) {
    this.context = context
    this.client = mqtt.connect("mqtt://localhost:9001", {
      clientId: "web-viewer",
      username: "hello",
      password: "test",
    })

    this.client.subscribe("aruco")
    this.client.on("message", (topic, message) => {
      const enc = new TextDecoder("utf-8")
      const text = enc.decode(message)
      if (topic === "aruco") handleAruco(this.context, text)
    })
    this.client.on("connect", () => {
      useVanillaContextStore.setState({ connected: true })
    })
    this.client.on("disconnect", () => {
      useVanillaContextStore.setState({ connected: false })
    })
  }

  sendVideoRestart() {
    this.client.publish("/video/restart", "")
  }
}
