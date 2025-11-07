import { DashboardHeader } from "@/components/dashboard-header"
import { ApplicationDetail } from "@/components/application-detail"
import { notFound } from "next/navigation"
import { fetchAplicacoes } from "@/lib/api"

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const applicationName = decodeURIComponent(id)

  // Fetch all applications and find the one matching the name
  const applications = await fetchAplicacoes()
  const application = applications.find((app) => app.nome === applicationName)

  if (!application) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <ApplicationDetail application={application} />
    </div>
  )
}
