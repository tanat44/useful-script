import { ConnectionStatus } from "./ConnectionStatus"
import { PlaybackLiveButton } from "./PlaybackLiveButton"
import { PlaybackPauseButton } from "./PlaybackPauseButton"
import { PlaybackStartButton } from "./PlaybackStartButton"
import { PlaybackUnpauseButton } from "./PlaybackUnpauseButton"

export function OverlayUi() {
  return (
    <div className="absolute top-0 left-0 flex flex-row gap-1 p-2">
      <ConnectionStatus />
      <PlaybackLiveButton />
      <PlaybackStartButton />
      <PlaybackPauseButton />
      <PlaybackUnpauseButton />
    </div>
  )
}
