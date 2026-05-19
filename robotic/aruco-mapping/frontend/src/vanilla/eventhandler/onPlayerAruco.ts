import { floatToHex } from "@/lib/utils"
import { Render } from "@/vanilla/visualizer/Render"
import { Vector3 } from "three"
import type { Context } from "../Context"

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
  id: number
  pos: _Vector
  rot: _Vector
}

export function onPlayerAruco(context: Context, payload: object) {
  const viz = context.visualizer
  if (!viz) return

  const data = payload as RecogMarkers
  const idsToKeep: Set<number> = new Set()

  for (const marker of data.markers) {
    if (!context.markers.has(marker.id)) {
      const color = floatToHex((marker.id % 10) / 10)
      const box = Render.createBox(MARKER_SIZE, color)
      box.name = marker.id.toString()
      viz.scene.add(box)
      context.markers.set(marker.id, box)
    }

    const object = context.markers.get(marker.id)!
    object.position.copy(new Vector3(marker.pos.x, marker.pos.y, marker.pos.z))
    idsToKeep.add(marker.id)
  }

  for (const [id, object] of context.markers.entries()) {
    if (idsToKeep.has(id)) continue

    context.markers.delete(id)
    context.visualizer.scene.remove(object)
  }
}
