"use client"

import { Card } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { range: "0-20%", count: 45, label: "Crítico" },
  { range: "21-40%", count: 62, label: "Baixo" },
  { range: "41-60%", count: 78, label: "Médio" },
  { range: "61-80%", count: 58, label: "Bom" },
  { range: "81-100%", count: 50, label: "Excelente" },
]

export function ReadinessDistribution() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">Prontidão para Migração</h3>
        <p className="text-sm text-muted-foreground">Distribuição dos scores de prontidão</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="readinessGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="range" fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <YAxis fontSize={11} tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-popover p-3 shadow-md">
                    <p className="text-sm font-medium">{payload[0].payload.range}</p>
                    <p className="text-xs text-muted-foreground">
                      {payload[0].value} aplicações • {payload[0].payload.label}
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#readinessGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
