import { useEffect } from "react"
import { VisualizerComponent } from "./components/visualizer/VisualizerComponent"
import { useMqtt } from "./lib/mqtt/store"

export function App() {
  const { connect } = useMqtt()

  useEffect(() => {
    connect()
  }, [])

  return (
    <>
      <VisualizerComponent />
    </>
  )
}

export default App
