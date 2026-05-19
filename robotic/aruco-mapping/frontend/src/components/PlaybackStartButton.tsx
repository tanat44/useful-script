import { useVanillaContextStore } from "@/vanilla"
import { Button } from "./ui/button"

export function PlaybackStartButton() {
  function handleClick() {
    useVanillaContextStore.getState().getMqttClient()?.sendPlaybackStart()
  }

  return (
    <Button onClick={handleClick} variant="outline">
      Start
    </Button>
  )
}
