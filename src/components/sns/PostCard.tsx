import { Heart, MessageCircle, Repeat2, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Post } from "@/types"

interface PostCardProps {
  post: Post
  onLike: (postId: number) => void
  isLiking: boolean
  onViewDetail?: (postId: number) => void
}

function formatRelativeTime(date: Date, lang: "jp" | "en"): string {
  const now = Date.now()
  const diff = now - date.getTime()

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) {
    return lang === "jp" ? "たった今" : "just now"
  }
  if (minutes < 60) {
    return lang === "jp" ? `${minutes}分前` : `${minutes}m ago`
  }
  if (hours < 24) {
    return lang === "jp" ? `${hours}時間前` : `${hours}h ago`
  }
  return lang === "jp" ? `${days}日前` : `${days}d ago`
}

export function PostCard({ post, onLike, isLiking, onViewDetail }: PostCardProps) {
  const { lang } = useLanguage()

  const userName = lang === "jp" ? post.user.name.ja : post.user.name.en
  const content = lang === "jp" ? post.content.ja : post.content.en
  const relativeTime = formatRelativeTime(post.createdAt, lang)

  const handleCardClick = () => {
    if (onViewDetail) {
      onViewDetail(post.id)
    }
  }

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation()
    action()
  }

  return (
    <Card
      className={onViewDetail ? "cursor-pointer hover:bg-muted/30 transition-all duration-200 hover:shadow-sm" : ""}
      onClick={handleCardClick}
    >
      <CardContent>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src={post.user.avatar} alt={userName} />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{userName}</span>
              <span className="text-muted-foreground">{post.user.handle}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{relativeTime}</span>
            </div>
            <p className="mt-1 whitespace-pre-wrap">{content}</p>
          </div>
        </div>

        <div className="mt-4 flex gap-6">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={(e) => handleButtonClick(e, () => onLike(post.id))}
            disabled={isLiking}
          >
            {isLiking ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Heart
                className={`h-4 w-4 ${
                  post.isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
            )}
            <span>{post.likes}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2" onClick={(e) => e.stopPropagation()}>
            <MessageCircle className="h-4 w-4" />
            <span>{post.comments}</span>
          </Button>

          <Button variant="ghost" size="sm" className="gap-2" onClick={(e) => e.stopPropagation()}>
            <Repeat2 className="h-4 w-4" />
            <span>{post.retweets}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
