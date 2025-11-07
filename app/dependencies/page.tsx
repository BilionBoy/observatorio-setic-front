import { DashboardHeader } from "@/components/dashboard-header"
import { DependenciesOverview } from "@/components/dependencies-overview"

export default function DependenciesPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Dependências e Análise de Risco</h1>
          <p className="text-muted-foreground mt-2">Monitoramento de pacotes NuGet e vulnerabilidades de segurança</p>
        </div>

        <DependenciesOverview />
      </main>
    </div>
  )
}
