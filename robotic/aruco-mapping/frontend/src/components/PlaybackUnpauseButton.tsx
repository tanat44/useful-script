import { useVanillaContextStore } from "@/vanilla"
import { Button } from "./ui/button"

export function PlaybackUnpauseButton() {
  function handleClick() {
    useVanillaContextStore.getState().getMqttClient()?.sendPlaybackUnpause()
  }

  return (
    <Button onClick={handleClick} variant="outline">
      Unpause
    </Button>
  )
}
