import type { User } from "@/types"

const LAST_NAMES_JA = [
  "田中",
  "鈴木",
  "佐藤",
  "高橋",
  "伊藤",
  "渡辺",
  "山本",
  "中村",
  "小林",
  "加藤",
]
const FIRST_NAMES_JA = [
  "太郎",
  "花子",
  "次郎",
  "美咲",
  "健一",
  "陽子",
  "大輔",
  "由美",
  "翔太",
  "愛",
]

const LAST_NAMES_EN = [
  "Tanaka",
  "Suzuki",
  "Sato",
  "Takahashi",
  "Ito",
  "Watanabe",
  "Yamamoto",
  "Nakamura",
  "Kobayashi",
  "Kato",
]
const FIRST_NAMES_EN = [
  "Taro",
  "Hanako",
  "Jiro",
  "Misaki",
  "Kenichi",
  "Yoko",
  "Daisuke",
  "Yumi",
  "Shota",
  "Ai",
]

const EMAIL_DOMAINS = ["example.com", "test.com", "demo.com"]

// Seeded random number generator for consistent data
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function generateUsers(count: number = 200): User[] {
  const users: User[] = []

  for (let i = 1; i <= count; i++) {
    const lastNameIndex = Math.floor(seededRandom(i * 13) * LAST_NAMES_JA.length)
    const firstNameIndex = Math.floor(seededRandom(i * 17) * FIRST_NAMES_JA.length)
    const domainIndex = Math.floor(seededRandom(i * 23) * EMAIL_DOMAINS.length)

    const emailBase = `${LAST_NAMES_EN[lastNameIndex]?.toLowerCase()}${i}`

    users.push({
      id: i,
      name: {
        ja: `${LAST_NAMES_JA[lastNameIndex]} ${FIRST_NAMES_JA[firstNameIndex]}`,
        en: `${FIRST_NAMES_EN[firstNameIndex]} ${LAST_NAMES_EN[lastNameIndex]}`,
      },
      email: `${emailBase}@${EMAIL_DOMAINS[domainIndex]}`,
      role: seededRandom(i * 29) < 0.1 ? "admin" : "user", // 10% are admins
      status: seededRandom(i * 31) < 0.8 ? "active" : "inactive", // 80% are active
    })
  }

  return users
}

export const USERS: User[] = generateUsers(200)
