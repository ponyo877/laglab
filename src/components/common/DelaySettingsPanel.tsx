import { Eye, EyeOff } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useDelay } from "@/contexts/DelayContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { useElapsedTime } from "@/hooks/useElapsedTime"
import { cn } from "@/lib/utils"
import { DELAY_PRESET_VALUES, type DelayPreset } from "@/types"

const presets: DelayPreset[] = ["instant", "fast", "normal", "slow", "verySlow"]

interface DelaySettingsPanelProps {
  className?: string
}

export function DelaySettingsPanel({ className }: DelaySettingsPanelProps) {
  const { delay, setDelay, isLoading, showElapsedTime, setShowElapsedTime } = useDelay()
  const { t } = useLanguage()
  const elapsed = useElapsedTime(isLoading)

  // Check if current delay matches a preset
  const activePreset = presets.find((p) => DELAY_PRESET_VALUES[p] === delay)

  return (
    <Card className={cn("", className)}>
      <CardContent className="pt-6">
        {/* Preset buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {presets.map((preset) => (
            <Button
              key={preset}
              variant={activePreset === preset ? "default" : "outline"}
              size="sm"
              onClick={() => setDelay(DELAY_PRESET_VALUES[preset])}
            >
              {t(`delayPanel.presets.${preset}`)}
            </Button>
          ))}
        </div>

        {/* Slider */}
        <div className="flex items-center gap-4 mb-4">
          <Slider
            value={[delay]}
            onValueChange={([value]) => value !== undefined && setDelay(value)}
            min={0}
            max={10000}
            step={100}
            className="flex-1"
          />
          <span className="min-w-[80px] text-right font-mono text-sm">
            {delay}ms
          </span>
        </div>

        {/* Elapsed time display */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {showElapsedTime && (
              <span className="font-mono text-sm text-muted-foreground">
                {t("delayPanel.elapsed")}: {elapsed.toLocaleString()}
                {t("delayPanel.ms")}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowElapsedTime(!showElapsedTime)}
          >
            {showElapsedTime ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
