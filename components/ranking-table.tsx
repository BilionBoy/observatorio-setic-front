"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, TrendingUp, AlertTriangle, CheckCircle2, Target, Users, Clock } from "lucide-react"
import Link from "next/link"

// Sample ranking data with strategic scoring
const rankingData = [
  {
    id: 1,
    rank: 1,
    name: "sistema-protocolo",
    version: "net8.0",
    readiness: 90,
    risk: "Baixo",
    strategicScore: 95,
    userBase: "Alto",
    businessImpact: "Crítico",
    complexity: "Média",
    estimatedEffort: "2 semanas",
    recommendation: "Migrar Imediatamente",
  },
  {
    id: 2,
    rank: 2,
    name: "sistema-financeiro-web",
    version: "net8.0",
    readiness: 95,
    risk: "Baixo",
    strategicScore: 92,
    userBase: "Muito Alto",
    businessImpact: "Crítico",
    complexity: "Baixa",
    estimatedEffort: "1 semana",
    recommendation: "Migrar Imediatamente",
  },
  {
    id: 3,
    rank: 3,
    name: "gestao-educacao-api",
    version: "net7.0",
    readiness: 85,
    risk: "Baixo",
    strategicScore: 88,
    userBase: "Alto",
    businessImpact: "Alto",
    complexity: "Média",
    estimatedEffort: "3 semanas",
    recommendation: "Prioridade Alta",
  },
  {
    id: 4,
    rank: 4,
    name: "sistema-ouvidoria",
    version: "net7.0",
    readiness: 80,
    risk: "Baixo",
    strategicScore: 82,
    userBase: "Médio",
    businessImpact: "Alto",
    complexity: "Baixa",
    estimatedEffort: "2 semanas",
    recommendation: "Prioridade Alta",
  },
  {
    id: 5,
    rank: 5,
    name: "portal-cidadao",
    version: "net6.0",
    readiness: 75,
    risk: "Médio",
    strategicScore: 78,
    userBase: "Muito Alto",
    businessImpact: "Crítico",
    complexity: "Alta",
    estimatedEffort: "6 semanas",
    recommendation: "Prioridade Alta",
  },
  {
    id: 6,
    rank: 6,
    name: "api-transparencia",
    version: "net6.0",
    readiness: 70,
    risk: "Médio",
    strategicScore: 75,
    userBase: "Alto",
    businessImpact: "Alto",
    complexity: "Média",
    estimatedEffort: "4 semanas",
    recommendation: "Prioridade Média",
  },
  {
    id: 7,
    rank: 7,
    name: "portal-compras",
    version: "net6.0",
    readiness: 65,
    risk: "Médio",
    strategicScore: 70,
    userBase: "Médio",
    businessImpact: "Alto",
    complexity: "Alta",
    estimatedEffort: "5 semanas",
    recommendation: "Prioridade Média",
  },
  {
    id: 8,
    rank: 8,
    name: "gestao-almoxarifado",
    version: "netcoreapp3.1",
    readiness: 55,
    risk: "Médio",
    strategicScore: 65,
    userBase: "Baixo",
    businessImpact: "Médio",
    complexity: "Média",
    estimatedEffort: "4 semanas",
    recommendation: "Prioridade Média",
  },
  {
    id: 9,
    rank: 9,
    name: "portal-servidor",
    version: "netcoreapp3.1",
    readiness: 50,
    risk: "Alto",
    strategicScore: 60,
    userBase: "Alto",
    businessImpact: "Alto",
    complexity: "Alta",
    estimatedEffort: "8 semanas",
    recommendation: "Planejamento Necessário",
  },
  {
    id: 10,
    rank: 10,
    name: "gestao-frotas",
    version: "net5.0",
    readiness: 45,
    risk: "Alto",
    strategicScore: 55,
    userBase: "Médio",
    businessImpact: "Médio",
    complexity: "Alta",
    estimatedEffort: "7 semanas",
    recommendation: "Planejamento Necessário",
  },
  {
    id: 11,
    rank: 11,
    name: "agendamento-ppe",
    version: "netcoreapp3.1",
    readiness: 40,
    risk: "Crítico",
    strategicScore: 50,
    userBase: "Alto",
    businessImpact: "Crítico",
    complexity: "Muito Alta",
    estimatedEffort: "12 semanas",
    recommendation: "Reescrita Recomendada",
  },
  {
    id: 12,
    rank: 12,
    name: "api-processos-juridicos",
    version: "net5.0",
    readiness: 35,
    risk: "Alto",
    strategicScore: 45,
    userBase: "Médio",
    businessImpact: "Alto",
    complexity: "Muito Alta",
    estimatedEffort: "10 semanas",
    recommendation: "Reescrita Recomendada",
  },
  {
    id: 13,
    rank: 13,
    name: "api-gestao-contratos",
    version: "netcoreapp2.2",
    readiness: 35,
    risk: "Crítico",
    strategicScore: 40,
    userBase: "Médio",
    businessImpact: "Alto",
    complexity: "Muito Alta",
    estimatedEffort: "14 semanas",
    recommendation: "Reescrita Recomendada",
  },
  {
    id: 14,
    rank: 14,
    name: "alpha-solicitacoes-carta-de-servico-api",
    version: "net5.0",
    readiness: 20,
    risk: "Crítico",
    strategicScore: 30,
    userBase: "Baixo",
    businessImpact: "Médio",
    complexity: "Muito Alta",
    estimatedEffort: "16 semanas",
    recommendation: "Reescrita Recomendada",
  },
  {
    id: 15,
    rank: 15,
    name: "sistema-rh-legado",
    version: "netcoreapp2.1",
    readiness: 15,
    risk: "Crítico",
    strategicScore: 25,
    userBase: "Alto",
    businessImpact: "Crítico",
    complexity: "Muito Alta",
    estimatedEffort: "20 semanas",
    recommendation: "Substituir Sistema",
  },
]

export function RankingTable() {
  const [filterRecommendation, setFilterRecommendation] = useState<string>("all")

  // Calculate summary stats
  const stats = {
    readyToMigrate: rankingData.filter((app) => app.readiness >= 80).length,
    highPriority: rankingData.filter(
      (app) => app.recommendation.includes("Alta") || app.recommendation.includes("Imediatamente"),
    ).length,
    needsRewrite: rankingData.filter(
      (app) => app.recommendation.includes("Reescrita") || app.recommendation.includes("Substituir"),
    ).length,
    avgReadiness: Math.round(rankingData.reduce((sum, app) => sum + app.readiness, 0) / rankingData.length),
  }

  // Filter applications
  const filteredApps = useMemo(() => {
    if (filterRecommendation === "all") return rankingData
    return rankingData.filter((app) => app.recommendation === filterRecommendation)
  }, [filterRecommendation])

  const getRecommendationBadge = (recommendation: string) => {
    if (recommendation.includes("Imediatamente")) {
      return <Badge className="bg-emerald-500 hover:bg-emerald-600">{recommendation}</Badge>
    }
    if (recommendation.includes("Alta")) {
      return <Badge className="bg-blue-500 hover:bg-blue-600">{recommendation}</Badge>
    }
    if (recommendation.includes("Média")) {
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">{recommendation}</Badge>
    }
    if (recommendation.includes("Planejamento")) {
      return <Badge className="bg-orange-500 hover:bg-orange-600">{recommendation}</Badge>
    }
    return <Badge variant="destructive">{recommendation}</Badge>
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Trophy className="h-5 w-5 text-amber-600" />
    return <span className="text-lg font-bold text-muted-foreground">{rank}</span>
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Prontas para Migrar</p>
              <p className="text-2xl font-semibold">{stats.readyToMigrate}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Target className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Alta Prioridade</p>
              <p className="text-2xl font-semibold">{stats.highPriority}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Necessitam Reescrita</p>
              <p className="text-2xl font-semibold">{stats.needsRewrite}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Prontidão Média</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{stats.avgReadiness}</p>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Methodology Card */}
      <Card className="p-6">
        <h3 className="font-semibold mb-3">Metodologia de Ranking</h3>
        <p className="text-sm text-muted-foreground mb-4">
          O ranking é calculado usando um algoritmo que considera múltiplos fatores estratégicos:
        </p>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Prontidão Técnica</p>
              <p className="text-xs text-muted-foreground">40% do peso</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Impacto no Negócio</p>
              <p className="text-xs text-muted-foreground">30% do peso</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Nível de Risco</p>
              <p className="text-xs text-muted-foreground">20% do peso</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Complexidade</p>
              <p className="text-xs text-muted-foreground">10% do peso</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Ranking Table */}
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold">Ranking Completo</h3>
          <Select value={filterRecommendation} onValueChange={setFilterRecommendation}>
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Filtrar por recomendação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as recomendações</SelectItem>
              <SelectItem value="Migrar Imediatamente">Migrar Imediatamente</SelectItem>
              <SelectItem value="Prioridade Alta">Prioridade Alta</SelectItem>
              <SelectItem value="Prioridade Média">Prioridade Média</SelectItem>
              <SelectItem value="Planejamento Necessário">Planejamento Necessário</SelectItem>
              <SelectItem value="Reescrita Recomendada">Reescrita Recomendada</SelectItem>
              <SelectItem value="Substituir Sistema">Substituir Sistema</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Aplicação</TableHead>
                <TableHead>Score Estratégico</TableHead>
                <TableHead>Prontidão</TableHead>
                <TableHead>Impacto</TableHead>
                <TableHead>Usuários</TableHead>
                <TableHead>Esforço</TableHead>
                <TableHead>Recomendação</TableHead>
                <TableHead className="w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="flex items-center justify-center">{getRankIcon(app.rank)}</div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Link href={`/applications/${app.id}`} className="font-medium hover:text-primary hover:underline">
                        {app.name}
                      </Link>
                      <div>
                        <Badge variant="outline" className="text-xs">
                          {app.version}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-[140px]">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">{app.strategicScore}/100</span>
                      </div>
                      <Progress value={app.strategicScore} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-[120px]">
                      <span className="text-sm font-medium">{app.readiness}/100</span>
                      <Progress value={app.readiness} className="h-1.5" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{app.businessImpact}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{app.userBase}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{app.estimatedEffort}</TableCell>
                  <TableCell>{getRecommendationBadge(app.recommendation)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/applications/${app.id}`}>Ver</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  )
}
