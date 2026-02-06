import { Search, Loader2, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  isLoading?: boolean
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function SearchBar({
  placeholder,
  value,
  onChange,
  onSearch,
  isLoading = false,
  onRefresh,
  isRefreshing = false,
}: SearchBarProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading && !isRefreshing) {
      onSearch()
    }
  }

  const isDisabled = isLoading || isRefreshing

  return (
    <div className="flex gap-2 bg-card rounded-2xl p-2 shadow-sm">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9"
          disabled={isDisabled}
        />
      </div>
      <Button onClick={onSearch} disabled={isDisabled}>
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Search className="h-4 w-4" />
        )}
      </Button>
      {onRefresh && (
        <Button onClick={onRefresh} disabled={isDisabled} variant="outline">
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
}
