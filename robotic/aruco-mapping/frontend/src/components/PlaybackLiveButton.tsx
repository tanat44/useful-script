import { useVanillaContextStore } from "@/vanilla"
import { Button } from "./ui/button"

export function PlaybackLiveButton() {
  function handleClick() {
    useVanillaContextStore.getState().getMqttClient()?.sendPlaybackLive()
  }

  return <Button onClick={handleClick}>Live</Button>
}
