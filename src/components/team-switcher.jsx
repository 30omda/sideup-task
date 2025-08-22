import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import SideupImg from "../assets/images/sideup_logo.jpeg";
import { Link } from "react-router-dom";




export function TeamSwitcher({
  teams
}) {

  const [activeTeam,] = React.useState(teams[0])

  if (!activeTeam) {
    return null
  }

  return (
    (<Link to="/" >
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <div
                  className=" text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-lg">
                  <img src={SideupImg} alt='SID-LOGO' />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{activeTeam.name}</span>
                  <span className="truncate text-xs">{activeTeam.plan}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </Link>
    )
  );
}
