import { useVanillaContextStore } from "@/vanilla"
import { Button } from "./ui/button"

export function VideoRestartButton() {
  function handleClick() {
    useVanillaContextStore.getState().getMqttClient()?.sendVideoRestart()
  }

  return (
    <Button onClick={handleClick} variant="outline">
      Restart Video
    </Button>
  )
}
