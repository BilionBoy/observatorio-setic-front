import { DashboardHeader } from "@/components/dashboard-header"
import { RankingTable } from "@/components/ranking-table"

export default function RankingPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Ranking de Prontidão para Migração</h1>
          <p className="text-muted-foreground mt-2">
            Priorização inteligente baseada em prontidão, impacto e criticidade
          </p>
        </div>

        <RankingTable />
      </main>
    </div>
  )
}
