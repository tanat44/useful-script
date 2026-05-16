import { create } from "zustand"
import type { Visualizer } from "./Visualizer"

interface State {
  visualizerRef?: Visualizer
}

const initState = {
  visualizerRef: undefined,
}

export const useVisualizerStore = create<State>()(() => ({
  ...initState,
}))
