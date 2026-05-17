import { create } from "zustand"
import { Context } from "./Context"
import type { MqttClient } from "./mqtt/MqttClient"
import type { Visualizer } from "./visualizer/Visualizer"

interface State {
  context?: Context
  connected: boolean
  createContext: (container: HTMLDivElement) => void
  getVisualizer: () => Visualizer | undefined
  getMqttClient: () => MqttClient | undefined
}

const initState = {
  context: undefined,
  connected: false,
}

export const useVanillaContextStore = create<State>()((set, get) => ({
  ...initState,
  createContext: (container: HTMLDivElement) =>
    set(() => {
      return { context: new Context(container) }
    }),
  getVisualizer: () => get().context?.visualizer,
  getMqttClient: () => get().context?.mqtt,
}))
