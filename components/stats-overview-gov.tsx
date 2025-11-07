"use client"

import { Card } from "@/components/ui/card"
import { Package, AlertTriangle, TrendingUp, Clock } from "lucide-react"

export function StatsOverview() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total de Aplicações</p>
            <h3 className="text-3xl font-bold mt-2">293</h3>
            <p className="text-xs text-muted-foreground mt-1">Inventariadas no estado</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Package className="h-6 w-6 text-primary" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Aplicações Críticas</p>
            <h3 className="text-3xl font-bold mt-2">227</h3>
            <p className="text-xs text-destructive mt-1">Requerem atenção urgente</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Prontidão Média</p>
            <h3 className="text-3xl font-bold mt-2">52%</h3>
            <p className="text-xs text-warning-foreground mt-1">Score de migração</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-warning-foreground" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Prazo Médio</p>
            <h3 className="text-3xl font-bold mt-2">18m</h3>
            <p className="text-xs text-muted-foreground mt-1">Tempo estimado de migração</p>
          </div>
          <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-accent" />
          </div>
        </div>
      </Card>
    </div>
  )
}
