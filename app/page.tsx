import { DashboardHeader } from "@/components/dashboard-header";
import { StatsOverview } from "@/components/stats-overview";
import { RiskDistribution } from "@/components/risk-distribution";
import { TechStackOverview } from "@/components/tech-stack-overview";
import { ReadinessDistribution } from "@/components/readiness-distribution";
import { CriticalApplications } from "@/components/critical-applications-gov";
import { MigrationTimeline } from "@/components/migration-timeline";

export default function ObservatoryDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8 space-y-8">
        <div className="text-center space-y-2 py-6">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Observatório Estadual de Aplicações
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mapeamento e análise de prontidão das 293 aplicações do Governo de
            Rondônia para migração ao SAURON v2
          </p>
        </div>
        <StatsOverview />
        <div className="grid gap-6 lg:grid-cols-3">
          <RiskDistribution />
          <TechStackOverview />
          <ReadinessDistribution />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <CriticalApplications />
          <MigrationTimeline />
        </div>
      </main>
    </div>
  );
}
