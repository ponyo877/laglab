import { PostCard } from "./PostCard"
import { PostSkeleton } from "./PostSkeleton"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Post } from "@/types"

interface TimelineProps {
  posts: Post[]
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  onLike: (postId: number) => void
  likingPostId: number | null
  sentinelRef: (node: HTMLElement | null) => void
  onViewDetail?: (postId: number) => void
}

export function Timeline({
  posts,
  isLoading,
  isLoadingMore,
  hasMore,
  onLike,
  likingPostId,
  sentinelRef,
  onViewDetail,
}: TimelineProps) {
  const { t } = useLanguage()

  if (isLoading) {
    return (
      <div className="space-y-4">
        <PostSkeleton count={5} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={onLike}
          isLiking={likingPostId === post.id}
          onViewDetail={onViewDetail}
        />
      ))}

      {isLoadingMore && <PostSkeleton count={3} />}

      {hasMore && !isLoadingMore && (
        <div ref={sentinelRef} className="h-10" />
      )}

      {!hasMore && posts.length > 0 && (
        <div className="py-4 text-center text-muted-foreground">
          {t("sns.noMorePosts")}
        </div>
      )}
    </div>
  )
}
