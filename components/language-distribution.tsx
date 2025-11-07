"use client"

import { Card } from "@/components/ui/card"
import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { name: "C#", value: 238 },
  { name: "Node.js", value: 45 },
  { name: "PHP", value: 8 },
  { name: "Java", value: 2 },
]

export function LanguageDistribution() {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="font-semibold">Linguagens</h3>
        <p className="text-sm text-muted-foreground">Tecnologias em uso</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical">
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" width={70} />
          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
