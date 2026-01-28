import { Routes, Route, Navigate, useParams, useSearchParams } from "react-router-dom"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { LanguageProvider } from "@/contexts/LanguageContext"
import { DelayProvider } from "@/contexts/DelayContext"
import { MainLayout } from "@/components/layout/MainLayout"
import { ECPage } from "@/pages/ECPage"
import { AdminPage } from "@/pages/AdminPage"
import { SNSPage } from "@/pages/SNSPage"
import { ProductDetailPage } from "@/pages/ProductDetailPage"
import { UserDetailPage } from "@/pages/UserDetailPage"
import { PostDetailPage } from "@/pages/PostDetailPage"
import { VALID_LANGS, DEFAULT_DELAY, type Lang } from "@/types"

function PageRouter() {
  const { lang, page } = useParams<{ lang: string; page: string }>()
  const [searchParams] = useSearchParams()

  const validLang = VALID_LANGS.includes(lang as Lang) ? (lang as Lang) : "jp"
  const validPages = ["ec", "admin", "sns"] as const
  const validPage = validPages.includes(page as typeof validPages[number])
    ? (page as typeof validPages[number])
    : "ec"

  const delayParam = searchParams.get("delay")
  const delay = delayParam !== null ? parseInt(delayParam, 10) : DEFAULT_DELAY

  if (lang !== validLang || page !== validPage) {
    return <Navigate to={`/${validLang}/${validPage}?delay=${delay}`} replace />
  }

  const PageComponent = {
    ec: ECPage,
    admin: AdminPage,
    sns: SNSPage,
  }[validPage]

  return (
    <LanguageProvider lang={validLang}>
      <DelayProvider>
        <MainLayout>
          <PageComponent />
        </MainLayout>
      </DelayProvider>
    </LanguageProvider>
  )
}

interface DetailPageRouterProps {
  type: "ec" | "admin" | "sns"
}

function DetailPageRouter({ type }: DetailPageRouterProps) {
  const { lang, id } = useParams<{ lang: string; id: string }>()
  const [searchParams] = useSearchParams()

  const validLang = VALID_LANGS.includes(lang as Lang) ? (lang as Lang) : "jp"
  const delayParam = searchParams.get("delay")
  const delay = delayParam !== null ? parseInt(delayParam, 10) : DEFAULT_DELAY

  if (lang !== validLang) {
    const pathMap = {
      ec: `/${validLang}/ec/product/${id}`,
      admin: `/${validLang}/admin/user/${id}`,
      sns: `/${validLang}/sns/post/${id}`,
    }
    return <Navigate to={`${pathMap[type]}?delay=${delay}`} replace />
  }

  const PageComponent = {
    ec: ProductDetailPage,
    admin: UserDetailPage,
    sns: PostDetailPage,
  }[type]

  return (
    <LanguageProvider lang={validLang}>
      <DelayProvider>
        <MainLayout>
          <PageComponent id={id!} />
        </MainLayout>
      </DelayProvider>
    </LanguageProvider>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* Detail pages (more specific routes first) */}
        <Route path="/:lang/ec/product/:id" element={<DetailPageRouter type="ec" />} />
        <Route path="/:lang/admin/user/:id" element={<DetailPageRouter type="admin" />} />
        <Route path="/:lang/sns/post/:id" element={<DetailPageRouter type="sns" />} />

        {/* List pages */}
        <Route path="/:lang/:page" element={<PageRouter />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/jp/ec?delay=500" replace />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
