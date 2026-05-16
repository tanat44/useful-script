import { useEffect, useRef } from "react"
import { Visualizer } from "./Visualizer"
import { useVisualizerStore } from "./store"

export function VisualizerComponent() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref?.current === null) return

    const state = useVisualizerStore.getState()
    if (state.visualizerRef) return

    const visualizerRef = new Visualizer(ref.current)
    useVisualizerStore.setState({ visualizerRef })
  }, [ref])

  return <canvas ref={ref} className="size-full"></canvas>
}
