import { ProductCard } from "./ProductCard"
import { ProductSkeleton } from "./ProductSkeleton"
import type { Product } from "@/types"

interface ProductGridProps {
  products: Product[]
  isLoading: boolean
  onAddToCart: (productId: number) => void
  loadingCartId: number | null
  cartIds: Set<number>
  onViewDetail?: (productId: number) => void
}

export function ProductGrid({
  products,
  isLoading,
  onAddToCart,
  loadingCartId,
  cartIds,
  onViewDetail,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {isLoading ? (
        <ProductSkeleton count={20} />
      ) : (
        products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            isAddingToCart={loadingCartId === product.id}
            isInCart={cartIds.has(product.id)}
            onViewDetail={onViewDetail}
          />
        ))
      )}
    </div>
  )
}
