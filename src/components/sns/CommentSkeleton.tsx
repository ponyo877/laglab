import { Skeleton } from "@/components/ui/skeleton"

interface CommentSkeletonProps {
  count?: number
}

export function CommentSkeleton({ count = 5 }: CommentSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-3 py-3 border-b last:border-b-0">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      ))}
    </>
  )
}
