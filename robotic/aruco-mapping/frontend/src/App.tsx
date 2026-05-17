import { OverlayUi } from "./components/OverlayUi"
import { CanvasComponent } from "./vanilla"

export function App() {
  return (
    <div className="flex size-full flex-col">
      <CanvasComponent />
      <OverlayUi />
    </div>
  )
}

export default App
