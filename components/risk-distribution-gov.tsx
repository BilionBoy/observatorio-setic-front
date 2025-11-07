"use client"

import { Card } from "@/components/ui/card"
import { Pie, PieChart, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Crítico", value: 227, color: "hsl(var(--destructive))" },
  { name: "Alto", value: 38, color: "hsl(var(--warning))" },
  { name: "Médio", value: 18, color: "hsl(var(--chart-3))" },
  { name: "Baixo", value: 10, color: "hsl(var(--success))" },
]

export function RiskDistribution() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">Distribuição de Risco</h3>
        <p className="text-sm text-muted-foreground">Por nível de criticidade de migração</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} aplicações`} />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => (
              <span className="text-sm">
                {value}: <span className="font-medium">{entry.payload.value}</span>
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  )
}
