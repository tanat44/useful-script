import mqtt from "mqtt"
import type { Context } from "../Context"
import { useVanillaContextStore } from "../store"

type CallbackType = "object" | "text" | "raw"
type Callback = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  f: (payload: any) => void
  type: CallbackType
}

export class MqttClient {
  context: Context
  client: mqtt.MqttClient
  topicCallbacks: Map<string, Callback[]> = new Map()

  constructor(context: Context) {
    this.context = context
    this.client = mqtt.connect("mqtt://localhost:9001", {
      clientId: "web-viewer",
      username: "hello",
      password: "test",
    })

    this.client.on("message", this.onMessage.bind(this))
    this.client.on("connect", () => {
      useVanillaContextStore.setState({ connected: true })
    })
    this.client.on("disconnect", () => {
      useVanillaContextStore.setState({ connected: false })
    })
  }

  sendPlaybackStart() {
    console.log("send")
    this.client.publish("playback/start", "")
  }

  sendPlaybackPause() {
    this.client.publish("playback/pause", "")
  }

  sendPlaybackUnpause() {
    this.client.publish("playback/unpause", "")
  }

  sendPlaybackLive() {
    this.client.publish("playback/live", "")
  }

  private onMessage(topic: string, payload: Buffer<ArrayBufferLike>) {
    const callbacks = this.topicCallbacks.get(topic)
    if (!callbacks) {
      console.warn("no callback for topic", topic)
      return
    }

    for (const callback of callbacks) {
      if (callback.type === "raw") callback.f(payload)
      else {
        const enc = new TextDecoder("utf-8")
        const text = enc.decode(payload)
        if (callback.type === "text") {
          callback.f(text)
        } else {
          callback.f(JSON.parse(text))
        }
      }
    }
  }

  subscribe(
    topic: string,
    messageType: CallbackType,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onMessage: (payload: any) => void
  ) {
    if (!this.topicCallbacks.has(topic)) {
      this.client.subscribe(topic)
      this.topicCallbacks.set(topic, [])
    }

    const callbacks = this.topicCallbacks.get(topic)!
    callbacks.push({
      f: onMessage,
      type: messageType,
    })
  }

  async waitForConnection(): Promise<void> {
    return new Promise((resolve) => {
      function onTimer() {
        if (useVanillaContextStore.getState().connected) {
          resolve()
          clearInterval(timer)
        } else {
          console.log("waiting for connection")
        }
      }

      const timer = setInterval(onTimer, 1000)
    })
  }
}
