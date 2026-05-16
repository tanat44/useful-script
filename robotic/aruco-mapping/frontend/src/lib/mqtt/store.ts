import mqtt from "mqtt"
import { create } from "zustand"
import { handleAruco } from "./handleAruco"

interface State {
  mqtt?: any
  connect: () => void
}

const initState = {
  mqtt: undefined,
}

export const useMqtt = create<State>()((set) => ({
  ...initState,
  connect: () =>
    set((state) => {
      if (state.mqtt) return state

      const client = mqtt.connect("mqtt://localhost:9001", {
        clientId: "web-viewer",
        username: "hello",
        password: "test",
      })

      client.subscribe("aruco")
      client.on("message", (topic, message) => {
        const enc = new TextDecoder("utf-8")
        const text = enc.decode(message)
        if (topic === "aruco") handleAruco(text)
      })

      return { mqtt: client }
    }),
}))
