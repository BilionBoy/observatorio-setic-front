import { DashboardHeader } from "@/components/dashboard-header"
import { ApplicationsTable } from "@/components/applications-table"

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Aplicações</h1>
          <p className="text-muted-foreground mt-2">Visualize e gerencie todas as aplicações do estado</p>
        </div>

        <ApplicationsTable />
      </main>
    </div>
  )
}
