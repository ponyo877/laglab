import { useState, useMemo, useCallback, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { SearchBar } from "@/components/common/SearchBar"
import { PostForm } from "@/components/sns/PostForm"
import { Timeline } from "@/components/sns/Timeline"
import { useLanguage } from "@/contexts/LanguageContext"
import { useDelay } from "@/contexts/DelayContext"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { useDelayedOperation } from "@/hooks/useDelayedOperation"
import { useDelayedNavigation } from "@/hooks/useDelayedNavigation"
import { POSTS } from "@/data/posts"
import type { Post } from "@/types"

const INITIAL_LOAD = 20
const LOAD_MORE = 20

export function SNSPage() {
  const { lang, t } = useLanguage()
  const { delay, setIsLoading } = useDelay()
  const location = useLocation()
  const { navigate: delayedNavigate } = useDelayedNavigation()

  // State
  const [posts, setPosts] = useState<Post[]>(POSTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("")
  const [newPostContent, setNewPostContent] = useState("")
  const [likingPostId, setLikingPostId] = useState<number | null>(null)
  const [isSearching, setIsSearching] = useState(true)

  // Filter posts based on applied search
  const filteredPosts = useMemo(() => {
    if (!appliedSearchQuery.trim()) return posts

    const query = appliedSearchQuery.toLowerCase()
    return posts.filter((post) => {
      const userName = lang === "jp" ? post.user.name.ja : post.user.name.en
      const content = lang === "jp" ? post.content.ja : post.content.en
      return (
        userName.toLowerCase().includes(query) ||
        post.user.handle.toLowerCase().includes(query) ||
        content.toLowerCase().includes(query)
      )
    })
  }, [posts, appliedSearchQuery, lang])

  // Infinite scroll
  const infiniteScroll = useInfiniteScroll(filteredPosts, {
    initialLoadCount: INITIAL_LOAD,
    loadMoreCount: LOAD_MORE,
    totalItems: filteredPosts.length,
    delay,
  })

  // Initial load operation
  const initialLoadOperation = useDelayedOperation<void>(delay)

  useEffect(() => {
    const skipInitialLoad = location.state?.skipInitialLoad === true

    const performInitialLoad = async () => {
      if (!skipInitialLoad) {
        setIsLoading(true)
        await initialLoadOperation.execute(() => {})
      }
      setIsSearching(false)
      if (!skipInitialLoad) setIsLoading(false)

      if (location.state?.fromDelayedNavigation) {
        window.history.replaceState({}, document.title)
      }
    }
    performInitialLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Search operation with delay
  const searchOperation = useDelayedOperation<void>(delay)

  const handleSearch = useCallback(async () => {
    setIsSearching(true)
    setIsLoading(true)
    await searchOperation.execute(() => {
      setAppliedSearchQuery(searchQuery)
      infiniteScroll.reset()
    })
    setIsSearching(false)
    setIsLoading(false)
  }, [searchQuery, searchOperation, infiniteScroll, setIsLoading])

  // Create post with delay
  const createPostOperation = useDelayedOperation<void>(delay)

  const handleCreatePost = useCallback(async () => {
    if (!newPostContent.trim()) return

    setIsLoading(true)
    await createPostOperation.execute(() => {
      const newPost: Post = {
        id: Date.now(),
        user: {
          name: { ja: "あなた", en: "You" },
          handle: "@you",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=you",
        },
        content: {
          ja: newPostContent,
          en: newPostContent,
        },
        createdAt: new Date(),
        likes: 0,
        comments: 0,
        retweets: 0,
        isLiked: false,
      }

      setPosts((prev) => [newPost, ...prev])
      setNewPostContent("")
    })
    setIsLoading(false)
  }, [newPostContent, createPostOperation, setIsLoading])

  // Like post with delay
  const likePostOperation = useDelayedOperation<void>(delay)

  const handleLikePost = useCallback(
    async (postId: number) => {
      setLikingPostId(postId)
      setIsLoading(true)

      await likePostOperation.execute(() => {
        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !post.isLiked,
              }
            }
            return post
          })
        )
      })

      setLikingPostId(null)
      setIsLoading(false)
    },
    [likePostOperation, setIsLoading]
  )

  // Refresh operation
  const refreshOperation = useDelayedOperation<void>(delay)

  const handleRefresh = useCallback(async () => {
    setIsSearching(true)
    setIsLoading(true)
    await refreshOperation.execute(() => {
      setSearchQuery("")
      setAppliedSearchQuery("")
      infiniteScroll.reset()
    })
    setIsSearching(false)
    setIsLoading(false)
  }, [refreshOperation, setIsLoading, infiniteScroll])

  // View detail
  const handleViewDetail = useCallback(
    (postId: number) => {
      delayedNavigate(`/${lang}/sns/post/${postId}${location.search}`)
    },
    [delayedNavigate, lang, location.search]
  )

  return (
    <div className="space-y-4">
      <SearchBar
        placeholder={t("sns.searchPlaceholder")}
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearch}
        isLoading={searchOperation.isLoading}
        onRefresh={handleRefresh}
        isRefreshing={refreshOperation.isLoading}
      />

      <PostForm
        value={newPostContent}
        onChange={setNewPostContent}
        onSubmit={handleCreatePost}
        isSubmitting={createPostOperation.isLoading}
      />

      <Timeline
        posts={infiniteScroll.displayedItems}
        isLoading={isSearching}
        isLoadingMore={infiniteScroll.isLoadingMore}
        hasMore={infiniteScroll.hasMore}
        onLike={handleLikePost}
        likingPostId={likingPostId}
        sentinelRef={infiniteScroll.sentinelRef}
        onViewDetail={handleViewDetail}
      />
    </div>
  )
}
