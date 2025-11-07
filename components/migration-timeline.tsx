"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react"

const milestones = [
  {
    quarter: "Q4 2024",
    status: "in-progress",
    title: "Fase de Inventário",
    description: "Catalogação e análise de todas as aplicações",
    progress: 85,
    items: ["Identificação de aplicações", "Análise de dependências", "Avaliação de riscos"],
  },
  {
    quarter: "Q1 2025",
    status: "pending",
    title: "Migração Piloto",
    description: "Primeiras aplicações de baixa complexidade",
    progress: 0,
    items: ["10 aplicações net6.0+", "Testes de compatibilidade", "Validação de processos"],
  },
  {
    quarter: "Q2-Q3 2025",
    status: "pending",
    title: "Migração em Larga Escala",
    description: "Aplicações de média complexidade",
    progress: 0,
    items: ["50 aplicações prioritárias", "Refatoração necessária", "Treinamento de equipes"],
  },
  {
    quarter: "Q4 2025 - Q2 2026",
    status: "pending",
    title: "Aplicações Críticas",
    description: "Sistemas legados e complexos",
    progress: 0,
    items: ["Reescrita parcial", "Migração gradual", "Testes extensivos"],
  },
]

export function MigrationTimeline() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold text-lg">Cronograma de Migração</h3>
          <p className="text-sm text-muted-foreground">Planejamento estratégico para .NET 9+</p>
        </div>
      </div>

      <div className="space-y-6">
        {milestones.map((milestone, index) => (
          <div key={index} className="relative pl-8">
            {/* Timeline line */}
            {index !== milestones.length - 1 && (
              <div className="absolute left-[11px] top-8 h-[calc(100%+1rem)] w-0.5 bg-border" />
            )}

            {/* Status icon */}
            <div className="absolute left-0 top-1">
              {milestone.status === "in-progress" ? (
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                </div>
              ) : milestone.status === "completed" ? (
                <div className="h-6 w-6 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                  <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="pb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={milestone.status === "in-progress" ? "default" : "secondary"} className="text-xs">
                  {milestone.quarter}
                </Badge>
                {milestone.status === "in-progress" && (
                  <Badge variant="outline" className="text-xs">
                    Em andamento
                  </Badge>
                )}
              </div>

              <h4 className="font-semibold mb-1">{milestone.title}</h4>
              <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>

              {milestone.progress > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">{milestone.progress}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${milestone.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <ul className="space-y-1">
                {milestone.items.map((item, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
