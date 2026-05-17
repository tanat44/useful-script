import { useEffect, useRef } from "react"
import { useVanillaContextStore } from "./store"

export function CanvasComponent() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (ref?.current === null) return

    const { context } = useVanillaContextStore.getState()
    if (context) return
    useVanillaContextStore.getState().createContext(ref.current)
  }, [ref])

  return <canvas ref={ref} className="size-full"></canvas>
}
