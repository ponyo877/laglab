import type { Post, Comment } from "@/types"

const POST_TEMPLATES_JA = [
  "今日は素晴らしい天気ですね！ #日常",
  "プロジェクトが順調に進んでいます #仕事 #開発",
  "新しいカフェを見つけました #カフェ巡り",
  "週末の予定を立てています #休日",
  "読書の時間が最高です #読書",
  "ランチは美味しいラーメン #グルメ",
  "新しい技術を学んでいます #勉強",
  "映画を見てきました #映画",
  "散歩が気持ちいい季節になりました #散歩",
  "コーヒーブレイク中 #休憩",
]

const POST_TEMPLATES_EN = [
  "What a beautiful day today! #daily",
  "Project is progressing well #work #development",
  "Found a new cafe #cafehunt",
  "Planning for the weekend #holiday",
  "Reading time is the best #reading",
  "Delicious ramen for lunch #food",
  "Learning new technologies #study",
  "Just watched a movie #movies",
  "Perfect weather for a walk #walk",
  "Coffee break time #break",
]

const USER_NAMES_JA = [
  "山田太郎",
  "佐藤花子",
  "鈴木一郎",
  "高橋美咲",
  "田中健太",
  "伊藤さくら",
  "渡辺大輔",
  "中村愛",
  "小林翔",
  "加藤恵",
]

const USER_NAMES_EN = [
  "Taro Yamada",
  "Hanako Sato",
  "Ichiro Suzuki",
  "Misaki Takahashi",
  "Kenta Tanaka",
  "Sakura Ito",
  "Daisuke Watanabe",
  "Ai Nakamura",
  "Sho Kobayashi",
  "Megumi Kato",
]

const HANDLES = [
  "taro_y",
  "hanako_s",
  "ichiro_sz",
  "misaki_t",
  "kenta_tnk",
  "sakura_ito",
  "daisuke_w",
  "ai_nakamura",
  "sho_k",
  "megumi_kato",
]

// Seeded random number generator for consistent data
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generatePosts(count: number = 200): Post[] {
  const posts: Post[] = []
  const now = Date.now()
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000

  for (let i = 1; i <= count; i++) {
    const userIndex = Math.floor(seededRandom(i * 13) * USER_NAMES_JA.length)
    const templateIndex = Math.floor(seededRandom(i * 17) * POST_TEMPLATES_JA.length)
    const timeOffset = Math.floor(seededRandom(i * 23) * sevenDaysMs)

    posts.push({
      id: i,
      user: {
        name: {
          ja: USER_NAMES_JA[userIndex] || "ユーザー",
          en: USER_NAMES_EN[userIndex] || "User",
        },
        handle: `@${HANDLES[userIndex]}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      },
      content: {
        ja: `${POST_TEMPLATES_JA[templateIndex]} (投稿 #${i})`,
        en: `${POST_TEMPLATES_EN[templateIndex]} (Post #${i})`,
      },
      createdAt: new Date(now - timeOffset),
      likes: Math.floor(seededRandom(i * 29) * 101),
      comments: Math.floor(seededRandom(i * 31) * 21),
      retweets: Math.floor(seededRandom(i * 37) * 11),
      isLiked: false,
    })
  }

  // Sort by date descending (newest first)
  return posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export const POSTS: Post[] = generatePosts(200)

// Comment templates
const COMMENT_TEMPLATES_JA = [
  "素敵ですね！",
  "いいね！",
  "同感です！",
  "参考になります！",
  "ありがとうございます！",
  "なるほど！",
  "面白いですね！",
  "共感します！",
]

const COMMENT_TEMPLATES_EN = [
  "That's great!",
  "Nice!",
  "I agree!",
  "Very helpful!",
  "Thank you!",
  "I see!",
  "Interesting!",
  "I feel the same!",
]

export function generateCommentsForPost(postId: number, count: number = 5): Comment[] {
  const comments: Comment[] = []
  const baseTime = Date.now()

  for (let i = 1; i <= count; i++) {
    const seed = postId * 100 + i
    const userIndex = Math.floor(seededRandom(seed * 13) * USER_NAMES_JA.length)
    const templateIndex = Math.floor(seededRandom(seed * 17) * COMMENT_TEMPLATES_JA.length)
    const timeOffset = Math.floor(seededRandom(seed * 23) * 24 * 60 * 60 * 1000)

    comments.push({
      id: seed,
      user: {
        name: {
          ja: USER_NAMES_JA[userIndex] || "ユーザー",
          en: USER_NAMES_EN[userIndex] || "User",
        },
        handle: `@${HANDLES[userIndex]}`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`,
      },
      content: {
        ja: COMMENT_TEMPLATES_JA[templateIndex] || "素敵ですね！",
        en: COMMENT_TEMPLATES_EN[templateIndex] || "That's great!",
      },
      createdAt: new Date(baseTime - timeOffset),
      likes: Math.floor(seededRandom(seed * 29) * 20),
      isLiked: false,
    })
  }

  return comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}
