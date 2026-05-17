import { create } from "zustand"
import { Context } from "./Context"
import type { MqttClient } from "./mqtt/MqttClient"
import type { Visualizer } from "./visualizer/Visualizer"

interface State {
  context?: Context
  connected: boolean
  createContext: (canvas: HTMLCanvasElement) => void
  getVisualizer: () => Visualizer | undefined
  getMqttClient: () => MqttClient | undefined
}

const initState = {
  context: undefined,
  connected: false,
}

export const useVanillaContextStore = create<State>()((set, get) => ({
  ...initState,
  createContext: (canvas: HTMLCanvasElement) =>
    set(() => {
      return { context: new Context(canvas) }
    }),
  getVisualizer: () => get().context?.visualizer,
  getMqttClient: () => get().context?.mqtt,
}))
