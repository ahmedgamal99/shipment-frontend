"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useContext, type FormEvent } from "react"
import { Navigate } from "react-router"
import { toast } from "sonner"

import { AppSidebar } from "~/components/app-sidebar"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Separator } from "~/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import { AuthContext } from "~/contexts/AuthContext"
import api from "~/lib/api"
import type { ShipmentCreate } from "~/lib/client"
import { cn } from "~/lib/utils"

export function SubmitShipmentForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {

  const queryClient = useQueryClient()

  const shipments = useMutation<
    Awaited<ReturnType<typeof api.shipment.createShipment>>,
    AxiosError,
    ShipmentCreate,
    { form: HTMLFormElement }
  >({
    mutationFn: (payload) => api.shipment.createShipment(payload),
    onSuccess: (response, _variables, context) => {
      context?.form?.reset()
      toast(`Shipment is submitted successfully (#${response.data.id})`)
      queryClient.invalidateQueries({ queryKey: ["shipments"] })
    },
    onError: (error) => {
      const apiError = error as AxiosError
      toast.error(
        apiError.response?.status === 406
          ? "No delivery parterns are available"
          : "Failed to submit shipment"
      )
    },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const content = data.get("content")?.toString()
    const weight = data.get("weight")?.toString()
    const destination = data.get("destination")?.toString()
    const clientContactEmail = data.get("client-contact-email")?.toString()

    if (!content || !weight || !destination || !clientContactEmail) {
      return
    }

    const shipment: ShipmentCreate = {
      content: content,
      weight: parseFloat(weight),
      destination: parseInt(destination),
      client_contact_email: clientContactEmail,
      client_contact_phone: data.get("client-contact-phone")?.toString(),
    }
    shipments.mutate(shipment)
  }

  return (
    <form
      {...props}
      onSubmit={handleSubmit}
      className={cn("grid gap-6", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor="content">Contents</Label>
        <Input
          id="content"
          name="content"
          type="text"
          placeholder="Shipment contents"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="weight">Weight</Label>
        <Input
          id="weight"
          name="weight"
          step={0.1}
          type="number"
          max={25}
          placeholder="Weight in kg"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          name="destination"
          type="number"
          placeholder="11001"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="client-contact-email">Client Email</Label>
        <Input
          id="client-contact-email"
          name="client-contact-email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="client-contact-phone">Client Phone</Label>
        <Input
          id="client-contact-phone"
          name="client-contact-phone"
          type="tel"
          placeholder="+1 234 567 890"
        />
      </div>
      <Button type="submit" className="w-full" disabled={shipments.isPending}>
        {shipments.isPending ? "Submitting..." : "Submit"}
      </Button>
    </form>
  )
}

export default function SubmitShipmentPage() {
  const { token, user } = useContext(AuthContext)

  if (!token) {
    return <Navigate to="/" />
  }

  if (user !== "seller") {
    return (
      <SidebarProvider
        style={{ "--sidebar-width": "19rem" } as React.CSSProperties}
      >
        <AppSidebar currentRoute="Submit Shipment" />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <h2>Submit Shipment</h2>
          </header>
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="rounded-lg border bg-background px-6 py-8 text-center">
              <h3 className="text-lg font-semibold">Submit shipment unavailable</h3>
              <p className="text-muted-foreground mt-2">
                Only seller accounts can create new shipments.
              </p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider
      style={{ "--sidebar-width": "19rem" } as React.CSSProperties}
    >
      <AppSidebar currentRoute="Submit Shipment" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <h2>Submit Shipment</h2>
        </header>
        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          <Card className="w-full max-w-3xl">
            <CardHeader>
              <CardTitle>Submit a new shipment</CardTitle>
            </CardHeader>
            <CardContent>
              <SubmitShipmentForm />
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}