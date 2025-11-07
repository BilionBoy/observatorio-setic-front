"use client"

import { Card } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts"

const data = [
  { name: "C# / .NET", value: 238, color: "hsl(var(--chart-1))" },
  { name: "Node.js", value: 45, color: "hsl(var(--chart-2))" },
  { name: "PHP", value: 8, color: "hsl(var(--chart-4))" },
  { name: "Java", value: 2, color: "hsl(var(--chart-5))" },
]

export function TechStackOverview() {
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">Stack Tecnológico</h3>
        <p className="text-sm text-muted-foreground">Linguagens e frameworks em uso</p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value) => [`${value} aplicações`, "Quantidade"]}
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
