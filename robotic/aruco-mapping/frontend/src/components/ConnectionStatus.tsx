import { cn } from "@/lib/utils"
import { useVanillaContextStore } from "@/vanilla"
import { Button } from "./ui/button"

export function ConnectionStatus() {
  const { connected } = useVanillaContextStore()

  return (
    <Button
      variant="outline"
      disabled
      className={cn(
        connected ? "bg-green-200" : "bg-amber-700",
        "disabled:opacity-100"
      )}
    >
      {connected ? "Connected" : "Disconnected"}
    </Button>
  )
}
