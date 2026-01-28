import { Link, useLocation } from "react-router-dom"
import { Hourglass, ShoppingCart, LayoutDashboard, MessageCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/LanguageContext"
import type { Page } from "@/types"

const navItems: { page: Page; icon: typeof Hourglass }[] = [
  { page: "ec", icon: ShoppingCart },
  { page: "admin", icon: LayoutDashboard },
  { page: "sns", icon: MessageCircle },
]

export function AppSidebar() {
  const location = useLocation()
  const { lang, setLang, t } = useLanguage()

  // Extract current page from path
  const pathParts = location.pathname.split("/")
  const currentPage = pathParts[2] || "ec"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Hourglass className="h-4 w-4" />
          </div>
          <span className="font-semibold group-data-[collapsible=icon]:hidden">
            {t("sidebar.title")}
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.page}>
                  <SidebarMenuButton
                    asChild
                    isActive={currentPage === item.page}
                    tooltip={t(`sidebar.${item.page}`)}
                  >
                    <Link to={`/${lang}/${item.page}${location.search}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{t(`sidebar.${item.page}`)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Separator className="mb-2" />
        <div className="flex items-center justify-center gap-2 px-2 py-2 group-data-[collapsible=icon]:flex-col">
          <button
            onClick={() => setLang("jp")}
            className={`px-2 py-1 text-sm rounded ${
              lang === "jp"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            JP
          </button>
          <span className="text-muted-foreground group-data-[collapsible=icon]:hidden">/</span>
          <button
            onClick={() => setLang("en")}
            className={`px-2 py-1 text-sm rounded ${
              lang === "en"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-accent"
            }`}
          >
            EN
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
