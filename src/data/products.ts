import type { Product } from "@/types"

// Japanese product name components
const PRODUCT_PREFIXES_JA = [
  "プレミアム",
  "エレガント",
  "クラシック",
  "モダン",
  "スタイリッシュ",
  "コンフォート",
  "ナチュラル",
  "デラックス",
  "ベーシック",
  "アドバンス",
]

const PRODUCT_CATEGORIES_JA = [
  "シャツ",
  "パンツ",
  "ジャケット",
  "コート",
  "セーター",
  "Tシャツ",
  "スカート",
  "ドレス",
  "バッグ",
  "シューズ",
]

// English equivalents
const PRODUCT_PREFIXES_EN = [
  "Premium",
  "Elegant",
  "Classic",
  "Modern",
  "Stylish",
  "Comfort",
  "Natural",
  "Deluxe",
  "Basic",
  "Advanced",
]

const PRODUCT_CATEGORIES_EN = [
  "Shirt",
  "Pants",
  "Jacket",
  "Coat",
  "Sweater",
  "T-Shirt",
  "Skirt",
  "Dress",
  "Bag",
  "Shoes",
]

// Seeded random number generator for consistent data
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateProducts(count: number = 200): Product[] {
  const products: Product[] = []

  for (let i = 1; i <= count; i++) {
    const prefixIndex = Math.floor(seededRandom(i * 13) * PRODUCT_PREFIXES_JA.length)
    const categoryIndex = Math.floor(seededRandom(i * 17) * PRODUCT_CATEGORIES_JA.length)
    const price = Math.floor(seededRandom(i * 23) * 490 + 10) * 100 // 1,000 - 50,000

    products.push({
      id: i,
      name: {
        ja: `${PRODUCT_PREFIXES_JA[prefixIndex]}${PRODUCT_CATEGORIES_JA[categoryIndex]} ${i}`,
        en: `${PRODUCT_PREFIXES_EN[prefixIndex]} ${PRODUCT_CATEGORIES_EN[categoryIndex]} ${i}`,
      },
      price,
      image: `https://picsum.photos/seed/${i}/200/200`,
    })
  }

  return products
}

export const PRODUCTS: Product[] = generateProducts(200)
