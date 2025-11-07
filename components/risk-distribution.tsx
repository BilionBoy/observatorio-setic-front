"use client"

import { Card } from "@/components/ui/card"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Crítico", value: 227, color: "hsl(var(--chart-1))" },
  { name: "Baixo", value: 66, color: "hsl(var(--chart-2))" },
]

export function RiskDistribution() {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="font-semibold">Distribuição de Risco</h3>
        <p className="text-sm text-muted-foreground">Por nível de criticidade</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => `${value}: ${entry.payload.value}`}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
