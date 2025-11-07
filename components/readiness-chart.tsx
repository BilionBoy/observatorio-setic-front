"use client"

import { Card } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { range: "0-20", count: 45 },
  { range: "21-40", count: 62 },
  { range: "41-60", count: 78 },
  { range: "61-80", count: 58 },
  { range: "81-100", count: 50 },
]

export function ReadinessChart() {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="font-semibold">Prontidão de Migração</h3>
        <p className="text-sm text-muted-foreground">Distribuição de scores</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="readiness" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="range" fontSize={12} />
          <YAxis fontSize={12} />
          <Area type="monotone" dataKey="count" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#readiness)" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  )
}
