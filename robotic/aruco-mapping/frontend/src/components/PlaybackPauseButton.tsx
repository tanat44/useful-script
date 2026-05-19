import { useVanillaContextStore } from "@/vanilla"
import { Button } from "./ui/button"

export function PlaybackPauseButton() {
  function handleClick() {
    useVanillaContextStore.getState().getMqttClient()?.sendPlaybackPause()
  }

  return (
    <Button onClick={handleClick} variant="outline">
      Pause
    </Button>
  )
}
