import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductSkeletonProps {
  count?: number
}

export function ProductSkeleton({ count = 20 }: ProductSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-0">
            <Skeleton className="aspect-square w-full" />
          </CardContent>
          <CardHeader className="p-4 pb-2">
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardFooter className="flex items-center justify-between p-4 pt-0">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-9 w-24" />
          </CardFooter>
        </Card>
      ))}
    </>
  )
}
