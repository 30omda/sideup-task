import { NavMain } from "@/components/nav-main"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

import { Skeleton } from "@/components/ui/skeleton" 
import useGetCategories from "@/hooks/useGetCategories"

export function AppSidebar(props) {
  const { categories, isLoading, isError } = useGetCategories()

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      { name: "SIDEUP", plan: "Pro Plan" },
      { name: "Acme Corp.", plan: "Startup" },
      { name: "Evil Corp.", plan: "Free" },
    ],
    navMain: [
      {
        title: "Categories",
        url: "#",
        isActive: true,
        items: categories.map((cat) => ({
          title: cat,
          url: `/category/${cat}`,
        })),
      },
    ],
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full p-4 space-y-4">
        {/* Header Skeleton */}
        <div className="p-4 flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>

        {/* Categories Skeleton */}
        <div className="flex flex-col space-y-2 p-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-14" />
        </div>

        {/* Footer Skeleton */}
        <div className="mt-auto p-4 flex items-center space-x-2">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    )
  }


  if (isError) return <p>Failed to load categories</p>

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
