import { ShoppingCart, Loader2, Check } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Product } from "@/types"

interface ProductCardProps {
  product: Product
  onAddToCart: (productId: number) => void
  isAddingToCart: boolean
  isInCart: boolean
  onViewDetail?: (productId: number) => void
}

export function ProductCard({
  product,
  onAddToCart,
  isAddingToCart,
  isInCart,
  onViewDetail,
}: ProductCardProps) {
  const { lang, t } = useLanguage()

  const name = lang === "jp" ? product.name.ja : product.name.en
  const formattedPrice = product.price.toLocaleString()

  const handleCardClick = () => {
    if (onViewDetail) {
      onViewDetail(product.id)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product.id)
  }

  return (
    <Card
      className={`overflow-hidden py-0 gap-0 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${onViewDetail ? "cursor-pointer" : ""}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square bg-muted">
          <img
            src={product.image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </CardContent>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="line-clamp-2 text-sm">{name}</CardTitle>
      </CardHeader>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="font-semibold">
          {lang === "jp" ? `¥${formattedPrice}` : `$${Math.floor(product.price / 100)}`}
        </span>
        <Button
          size="sm"
          variant={isInCart ? "secondary" : "default"}
          disabled={isAddingToCart || isInCart}
          onClick={handleAddToCart}
        >
          {isAddingToCart ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : isInCart ? (
            <>
              <Check className="mr-1 h-4 w-4" />
              {t("ec.addedToCart")}
            </>
          ) : (
            <>
              <ShoppingCart className="mr-1 h-4 w-4" />
              {t("ec.addToCart")}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
