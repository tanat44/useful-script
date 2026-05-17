import { ConnectionStatus } from "./ConnectionStatus"
import { VideoRestartButton } from "./VideoRestartButton"

export function OverlayUi() {
  return (
    <div className="absolute top-0 left-0 flex flex-row gap-2 p-2">
      <ConnectionStatus />
      <VideoRestartButton />
    </div>
  )
}
