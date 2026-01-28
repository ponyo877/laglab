import { useState, useCallback, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft, ShoppingCart, Loader2, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductDetailSkeleton } from "@/components/ec/ProductDetailSkeleton"
import { useLanguage } from "@/contexts/LanguageContext"
import { useDelay } from "@/contexts/DelayContext"
import { useDelayedOperation } from "@/hooks/useDelayedOperation"
import { useDelayedNavigation } from "@/hooks/useDelayedNavigation"
import { PRODUCTS } from "@/data/products"

interface ProductDetailPageProps {
  id: string
}

export function ProductDetailPage({ id }: ProductDetailPageProps) {
  const { lang, t } = useLanguage()
  const { delay, setIsLoading } = useDelay()
  const location = useLocation()
  const navigate = useNavigate()
  const { isNavigating } = useDelayedNavigation()

  const [isPageLoading, setIsPageLoading] = useState(true)
  const [isInCart, setIsInCart] = useState(false)

  const product = PRODUCTS.find((p) => p.id === parseInt(id, 10))

  // Initial load
  const initialLoadOperation = useDelayedOperation<void>(delay)

  useEffect(() => {
    const skipInitialLoad = location.state?.skipInitialLoad === true

    const performInitialLoad = async () => {
      if (!skipInitialLoad) {
        setIsLoading(true)
        await initialLoadOperation.execute(() => {})
      }
      setIsPageLoading(false)
      if (!skipInitialLoad) setIsLoading(false)

      if (location.state?.fromDelayedNavigation) {
        window.history.replaceState({}, document.title)
      }
    }
    performInitialLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Add to cart
  const addToCartOperation = useDelayedOperation<void>(delay)

  const handleAddToCart = useCallback(async () => {
    setIsLoading(true)
    await addToCartOperation.execute(() => {
      setIsInCart(true)
    })
    setIsLoading(false)
  }, [addToCartOperation, setIsLoading])

  // Back navigation - use direct navigate to avoid navigation delay
  const handleBack = useCallback(() => {
    navigate(`/${lang}/ec${location.search}`, {
      state: { fromDelayedNavigation: true, skipInitialLoad: false }
    })
  }, [navigate, lang, location.search])

  if (isPageLoading || isNavigating) {
    return <ProductDetailSkeleton />
  }

  if (!product) {
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

  const name = lang === "jp" ? product.name.ja : product.name.en
  const formattedPrice = product.price.toLocaleString()
  const price = lang === "jp" ? `¥${formattedPrice}` : `$${Math.floor(product.price / 100)}`

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("common.back")}
      </Button>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-0">
            <div className="aspect-square bg-muted">
              <img
                src={product.image}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{name}</h1>
          <p className="text-3xl font-semibold text-primary">{price}</p>

          <div className="prose dark:prose-invert">
            <h3>{t("common.description")}</h3>
            <p className="text-muted-foreground">
              {t("ec.productDescription")}
            </p>
          </div>

          <Button
            size="lg"
            variant={isInCart ? "secondary" : "default"}
            disabled={addToCartOperation.isLoading || isInCart}
            onClick={handleAddToCart}
          >
            {addToCartOperation.isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : isInCart ? (
              <>
                <Check className="mr-2 h-5 w-5" />
                {t("ec.addedToCart")}
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {t("ec.addToCart")}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
