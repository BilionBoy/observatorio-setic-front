"use client";

import { Card } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Database,
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchEstatisticas, type Estatisticas } from "@/lib/api";

export function StatsOverview() {
  const [stats, setStats] = useState<Estatisticas | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEstatisticas()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6 animate-pulse border-primary/20">
            <div className="h-20 bg-muted rounded" />
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      label: "Total de Aplicações",
      value: stats.total_aplicacoes.toString(),
      icon: Database,
      description: "Aplicações mapeadas",
      variant: "primary" as const,
    },
    {
      label: "Aplicações Críticas",
      value: "",
      percentage: ``,
      icon: AlertTriangle,
      variant: "destructive" as const,
    },
    {
      label: "Prontidão Média",
      value: stats.media_prontidao.toFixed(2),
      suffix: "/100",
      icon: TrendingUp,
      variant: "primary" as const,
    },
    {
      label: "Usando SAURON",
      value: "-",
      percentage: "%",
      icon: CheckCircle2,
      variant: "success" as const,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statsData.map((stat, index) => (
        <Card
          key={index}
          className="p-6 border-primary/20 bg-card hover:border-primary/40 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <h3
                  className={`text-3xl font-bold tracking-tight ${
                    stat.variant === "primary" ? "text-primary" : ""
                  }`}
                >
                  {stat.value}
                </h3>
                {stat.suffix && (
                  <span className="text-sm text-muted-foreground">
                    {stat.suffix}
                  </span>
                )}
                {stat.percentage && (
                  <span className="text-sm font-medium text-muted-foreground">
                    ({stat.percentage})
                  </span>
                )}
              </div>
              {stat.description && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              )}
            </div>
            <div
              className={`p-3 rounded-lg ${
                stat.variant === "destructive"
                  ? "bg-red-500/10 text-red-500"
                  : stat.variant === "success"
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
