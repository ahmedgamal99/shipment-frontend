import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import { Navigate } from "react-router"
import { AppSidebar } from "~/components/app-sidebar"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import Loading from "~/components/ui/loading"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { AuthContext } from "~/contexts/AuthContext"
import api from "~/lib/api"



export default function AccountPage() {

  const { token, user, logout } = useContext(AuthContext)
  if (!token) {
    return <Navigate to="/" />
  }

  const { isLoading, isError, data } = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const getUserProfile = user === "seller" ? api.seller.getSeller : api.partner.getDeliveryPartner
      const { data } = await getUserProfile()
      return data
    }
  })

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">Error loading account details</h1>
      </div>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar currentRoute="Account" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h2>Account</h2>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {
            isLoading ? <Loading /> : (
              <div className="max-w-3xl space-y-6">
                <div className="space-y-1">
                  <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                  <Input id="name" value = {data?.name ?? "..."} readOnly/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input id="email" value = {data?.email ?? "..."} readOnly/>
                </div>
                <div className="flex justify-end">
                  <Button onClick={logout}>Log Out</Button>
                </div>
              </div>
            )
          }
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}