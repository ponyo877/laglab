import { Moon, Sun, Settings2 } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTheme } from "@/contexts/ThemeContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { useDelay } from "@/contexts/DelayContext"
import { useElapsedTime } from "@/hooks/useElapsedTime"
import { Slider } from "@/components/ui/slider"
import { DELAY_PRESET_VALUES, type DelayPreset } from "@/types"

const presets: { key: DelayPreset; label: string }[] = [
  { key: "instant", label: "0" },
  { key: "fast", label: "0.1s" },
  { key: "normal", label: "0.5s" },
  { key: "slow", label: "2s" },
  { key: "verySlow", label: "5s" },
]

export function Header() {
  const { setTheme } = useTheme()
  const { t } = useLanguage()
  const { delay, setDelay, isLoading } = useDelay()
  const elapsed = useElapsedTime(isLoading)

  const activePreset = presets.find((p) => DELAY_PRESET_VALUES[p.key] === delay)

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-2 bg-background/80 backdrop-blur-md shadow-sm px-4">
      <SidebarTrigger className="-ml-2" />
      <Separator orientation="vertical" className="h-6" />

      <div className="flex-1">
        <h1 className="text-lg font-semibold">{t("sidebar.title")}</h1>
      </div>

      {/* Preset buttons */}
      <div className="flex items-center gap-1">
        {presets.map((preset) => (
          <Button
            key={preset.key}
            variant={activePreset?.key === preset.key ? "default" : "outline"}
            size="sm"
            className="h-7 px-3 text-xs rounded-full"
            onClick={() => setDelay(DELAY_PRESET_VALUES[preset.key])}
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {/* Elapsed time */}
      <div className="min-w-[70px] text-right font-mono text-sm tabular-nums bg-muted rounded-full px-3 py-1">
        {isLoading ? (
          <span className="text-primary">{elapsed.toLocaleString()}ms</span>
        ) : (
          <span className="text-muted-foreground">{delay}ms</span>
        )}
      </div>

      {/* Slider popover */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings2 className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="end">
          <div className="space-y-3">
            <div className="text-sm font-medium">{t("delayPanel.title")}</div>
            <div className="flex items-center gap-3">
              <Slider
                value={[delay]}
                onValueChange={([value]) => value !== undefined && setDelay(value)}
                min={0}
                max={10000}
                step={100}
                className="flex-1"
              />
              <span className="min-w-[50px] text-right font-mono text-sm">
                {delay}ms
              </span>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
