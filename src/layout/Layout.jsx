
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useLocation } from "react-router-dom";
import NotificationsCart from "@/components/Notifications";
const Layout = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex max-w-screen h-16 shrink-0 items-center gap-2 border-b justify-between px-3">
            {/* Left side (sidebar + breadcrumb) */}
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  {pathSegments.map((segment, index) => (
                    <BreadcrumbItem key={index}>
                      {index < pathSegments.length - 1 ? (
                        <>
                          <BreadcrumbLink href={`/${pathSegments.slice(0, index + 1).join('/')}`}>
                            {segment}
                          </BreadcrumbLink>
                          <BreadcrumbSeparator />
                        </>
                      ) : (
                        <BreadcrumbPage>{segment}</BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>


            <div className="flex items-center mr-8">
              <NotificationsCart />
            </div>
          </header>

          <div className="mx-5">{<Outlet />}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

export default Layout