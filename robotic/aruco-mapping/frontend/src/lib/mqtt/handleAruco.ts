import { Render } from "@/components/visualizer/Render"
import { useVisualizerStore } from "@/components/visualizer/store"
import { Vector3 } from "three"

const MARKER_MAT = Render.createMaterial("#f87171")
const MARKER_SIZE = new Vector3(0.09, 0.01, 0.09)

type RecogMarkers = {
  time: number
  markers: Marker[]
}

type _Vector = {
  x: number
  y: number
  z: number
}

type Marker = {
  pos: _Vector
  rot: _Vector
}

export function handleAruco(message: string) {
  const data = JSON.parse(message) as RecogMarkers

  const viz = useVisualizerStore.getState().visualizerRef
  if (!viz) return

  data.markers.forEach((marker) => {
    const pos = new Vector3(marker.pos.x, marker.pos.y, marker.pos.z)
    const box = Render.createBox(MARKER_SIZE, MARKER_MAT)
    box.position.copy(pos)
    viz.scene.add(box)
  })
}
