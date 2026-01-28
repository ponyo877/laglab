import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useDelay } from "@/contexts/DelayContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { useElapsedTime } from "@/hooks/useElapsedTime"
import { DELAY_PRESET_VALUES, type DelayPreset } from "@/types"

const presets: DelayPreset[] = ["instant", "fast", "normal", "slow", "verySlow"]

export function DelaySettingsPopover() {
  const { delay, setDelay, isLoading, showElapsedTime, setShowElapsedTime } = useDelay()
  const { t } = useLanguage()
  const elapsed = useElapsedTime(isLoading)

  const activePreset = presets.find((p) => DELAY_PRESET_VALUES[p] === delay)

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h4 className="font-medium text-sm">{t("delayPanel.title")}</h4>
        <p className="text-xs text-muted-foreground">{t("delayPanel.description")}</p>
      </div>

      {/* Preset buttons */}
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <Button
            key={preset}
            variant={activePreset === preset ? "default" : "outline"}
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => setDelay(DELAY_PRESET_VALUES[preset])}
          >
            {t(`delayPanel.presets.${preset}`)}
          </Button>
        ))}
      </div>

      {/* Slider */}
      <div className="flex items-center gap-3">
        <Slider
          value={[delay]}
          onValueChange={([value]) => value !== undefined && setDelay(value)}
          min={0}
          max={10000}
          step={100}
          className="flex-1"
        />
        <span className="min-w-[60px] text-right font-mono text-sm">
          {delay}ms
        </span>
      </div>

      {/* Elapsed time display */}
      <div className="flex items-center justify-between pt-2 border-t">
        <div className="flex items-center gap-2">
          {showElapsedTime && isLoading && (
            <span className="font-mono text-xs text-muted-foreground">
              {t("delayPanel.elapsed")}: {elapsed.toLocaleString()}
              {t("delayPanel.ms")}
            </span>
          )}
          {showElapsedTime && !isLoading && (
            <span className="text-xs text-muted-foreground">
              {t("delayPanel.ready")}
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setShowElapsedTime(!showElapsedTime)}
        >
          {showElapsedTime ? (
            <Eye className="h-3.5 w-3.5" />
          ) : (
            <EyeOff className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
    </div>
  )
}
