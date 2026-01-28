import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"

interface PostFormProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}

export function PostForm({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: PostFormProps) {
  const { t } = useLanguage()

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey && !isSubmitting && value.trim()) {
      onSubmit()
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Textarea
          placeholder={t("sns.postPlaceholder")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          className="resize-none"
        />
        <div className="mt-2 flex justify-end">
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || !value.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              t("sns.post")
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
