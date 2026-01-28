// Language types
export type Lang = "jp" | "en"
export type Page = "ec" | "admin" | "sns"

// Bilingual text type
export interface BilingualText {
  ja: string
  en: string
}

// Product type (EC)
export interface Product {
  id: number
  name: BilingualText
  price: number
  image: string
}

// User type (Admin)
export interface User {
  id: number
  name: BilingualText
  email: string
  role: "admin" | "user"
  status: "active" | "inactive"
}

// Post type (SNS)
export interface Post {
  id: number
  user: {
    name: BilingualText
    handle: string
    avatar: string
  }
  content: BilingualText
  createdAt: Date
  likes: number
  comments: number
  retweets: number
  isLiked: boolean
}

// Comment type (SNS Detail)
export interface Comment {
  id: number
  user: {
    name: BilingualText
    handle: string
    avatar: string
  }
  content: BilingualText
  createdAt: Date
  likes: number
  isLiked: boolean
}

// Delay presets
export type DelayPreset = "instant" | "fast" | "normal" | "slow" | "verySlow"

export const DELAY_PRESET_VALUES: Record<DelayPreset, number> = {
  instant: 0,
  fast: 100,
  normal: 500,
  slow: 2000,
  verySlow: 5000,
}

// Valid values
export const VALID_LANGS: readonly Lang[] = ["jp", "en"] as const
export const VALID_PAGES: readonly Page[] = ["ec", "admin", "sns"] as const
export const DEFAULT_DELAY = 500
export const MIN_DELAY = 0
export const MAX_DELAY = 10000
