import { useState, useCallback, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { ArrowLeft, Heart, MessageCircle, Repeat2, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostDetailSkeleton } from "@/components/sns/PostDetailSkeleton"
import { CommentCard } from "@/components/sns/CommentCard"
import { useLanguage } from "@/contexts/LanguageContext"
import { useDelay } from "@/contexts/DelayContext"
import { useDelayedOperation } from "@/hooks/useDelayedOperation"
import { useDelayedNavigation } from "@/hooks/useDelayedNavigation"
import { POSTS, generateCommentsForPost } from "@/data/posts"
import type { Post, Comment } from "@/types"

interface PostDetailPageProps {
  id: string
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

export function PostDetailPage({ id }: PostDetailPageProps) {
  const { lang, t } = useLanguage()
  const { delay, setIsLoading } = useDelay()
  const location = useLocation()
  const { navigate, isNavigating } = useDelayedNavigation()

  const [isPageLoading, setIsPageLoading] = useState(true)
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLiking, setIsLiking] = useState(false)
  const [isRetweeting, setIsRetweeting] = useState(false)
  const [likingCommentId, setLikingCommentId] = useState<number | null>(null)

  // Initial load
  const initialLoadOperation = useDelayedOperation<void>(delay)

  useEffect(() => {
    const fromNavigation = location.state?.fromDelayedNavigation === true

    const performInitialLoad = async () => {
      const loadData = () => {
        const foundPost = POSTS.find((p) => p.id === parseInt(id, 10))
        setPost(foundPost || null)
        if (foundPost) {
          setComments(generateCommentsForPost(foundPost.id, foundPost.comments > 0 ? Math.min(foundPost.comments, 5) : 0))
        }
      }

      if (!fromNavigation) {
        setIsLoading(true)
        await initialLoadOperation.execute(loadData)
      } else {
        loadData()
      }
      setIsPageLoading(false)
      if (!fromNavigation) setIsLoading(false)

      if (fromNavigation) {
        window.history.replaceState({}, document.title)
      }
    }
    performInitialLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Like post
  const likeOperation = useDelayedOperation<void>(delay)

  const handleLikePost = useCallback(async () => {
    if (!post) return
    setIsLiking(true)
    setIsLoading(true)
    await likeOperation.execute(() => {
      setPost((prev) =>
        prev
          ? {
              ...prev,
              likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
              isLiked: !prev.isLiked,
            }
          : null
      )
    })
    setIsLiking(false)
    setIsLoading(false)
  }, [post, likeOperation, setIsLoading])

  // Retweet
  const retweetOperation = useDelayedOperation<void>(delay)

  const handleRetweet = useCallback(async () => {
    if (!post) return
    setIsRetweeting(true)
    setIsLoading(true)
    await retweetOperation.execute(() => {
      setPost((prev) =>
        prev
          ? {
              ...prev,
              retweets: prev.retweets + 1,
            }
          : null
      )
    })
    setIsRetweeting(false)
    setIsLoading(false)
  }, [post, retweetOperation, setIsLoading])

  // Like comment
  const likeCommentOperation = useDelayedOperation<void>(delay)

  const handleLikeComment = useCallback(
    async (commentId: number) => {
      setLikingCommentId(commentId)
      setIsLoading(true)
      await likeCommentOperation.execute(() => {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
                  isLiked: !comment.isLiked,
                }
              : comment
          )
        )
      })
      setLikingCommentId(null)
      setIsLoading(false)
    },
    [likeCommentOperation, setIsLoading]
  )

  // Back navigation
  const handleBack = useCallback(() => {
    navigate(`/${lang}/sns${location.search}`)
  }, [navigate, lang, location.search])

  if (isPageLoading || isNavigating) {
    return <PostDetailSkeleton />
  }

  if (!post) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t("common.back")}
        </Button>
        <div className="py-8 text-center text-muted-foreground">
          {t("common.notFound")}
        </div>
      </div>
    )
  }

  const userName = lang === "jp" ? post.user.name.ja : post.user.name.en
  const content = lang === "jp" ? post.content.ja : post.content.en
  const relativeTime = formatRelativeTime(post.createdAt, lang)

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("common.back")}
      </Button>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={post.user.avatar} alt={userName} />
              <AvatarFallback>{userName[0]}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg">{userName}</span>
                <span className="text-muted-foreground">{post.user.handle}</span>
              </div>
              <p className="text-muted-foreground text-sm">{relativeTime}</p>
            </div>
          </div>

          <p className="text-lg whitespace-pre-wrap">{content}</p>

          <div className="flex gap-6 pt-4 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleLikePost}
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

            <Button variant="ghost" size="sm" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleRetweet}
              disabled={isRetweeting}
            >
              {isRetweeting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Repeat2 className="h-4 w-4" />
              )}
              <span>{post.retweets}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">{t("sns.comments")}</h3>
          {comments.length > 0 ? (
            <div>
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onLike={handleLikeComment}
                  isLiking={likingCommentId === comment.id}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {t("sns.noComments")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
