"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  GitBranch,
  Package,
  Shield,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import type { Aplicacao } from "@/lib/api"
import { fetchDependencias, fetchVulnerabilidades } from "@/lib/api"

export function ApplicationDetail({ application }: { application: Aplicacao }) {
  const [dependencies, setDependencies] = useState<any[]>([])
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchDependencias(application.id).catch(() => []),
      fetchVulnerabilidades(application.id).catch(() => []),
    ])
      .then(([deps, vulns]) => {
        setDependencies(deps)
        setVulnerabilities(vulns)
      })
      .finally(() => setLoading(false))
  }, [application.id])

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "Crítico":
        return (
          <Badge variant="destructive" className="text-sm">
            {risk}
          </Badge>
        )
      case "Alto":
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-sm text-white">{risk}</Badge>
      case "Médio":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700 text-sm text-white">{risk}</Badge>
      case "Baixo":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 text-sm text-white">{risk}</Badge>
      default:
        return <Badge className="text-sm">{risk}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "vulnerable":
        return <Badge variant="destructive">Vulnerável</Badge>
      case "outdated":
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Desatualizado</Badge>
      case "ok":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white">OK</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
      case "Crítica":
        return <Badge variant="destructive">Crítica</Badge>
      case "High":
      case "Alta":
        return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Alta</Badge>
      case "Medium":
      case "Média":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700 text-white">Média</Badge>
      case "Low":
      case "Baixa":
        return <Badge variant="secondary">Baixa</Badge>
      default:
        return <Badge>{severity}</Badge>
    }
  }

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/applications" className="hover:text-foreground flex items-center gap-1">
          <ChevronLeft className="h-4 w-4" />
          Aplicações
        </Link>
        <span>/</span>
        <span className="text-foreground">{application.nome}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{application.nome}</h1>
            {application.risco === "Crítico" && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Crítica
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            {application.justificativa_prontidao || "Aplicação do Governo do Estado de Rondônia"}
          </p>
        </div>
        <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
          <Link href={`https://github.com/setic-ro/${application.nome}`} target="_blank" rel="noopener noreferrer">
            <GitBranch className="mr-2 h-4 w-4" />
            Ver Repositório
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Prontidão</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-semibold">{application.prontidao_migracao}</p>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Shield className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Nível de Risco</p>
              <div className="mt-1">{getRiskBadge(application.risco)}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Linguagem</p>
              <p className="text-lg font-semibold">{application.linguagem}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <AlertTriangle className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Ação</p>
              <p className="text-sm font-medium">{application.acao}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2 border-primary/20">
          <h3 className="font-semibold mb-4 text-primary">Informações Técnicas</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Versão do .NET</span>
              <Badge variant="outline" className="font-mono border-primary/30">
                {application.versao_dotnet || "Não especificado"}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Linguagem</span>
              <span className="text-sm font-medium">{application.linguagem}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Ação Recomendada</span>
              <span className="text-sm font-medium">{application.acao}</span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3 flex items-center justify-between">
              <span>Progresso de Prontidão</span>
              <span className="text-primary font-bold">{application.prontidao_migracao}%</span>
            </h4>
            <Progress value={application.prontidao_migracao} className="h-3" />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-primary/20">
          <h3 className="font-semibold mb-4 text-primary">Recomendações de Migração</h3>
          <div className="space-y-3">
            {application.prontidao_migracao >= 80 ? (
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Pronto para Migrar</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Esta aplicação está pronta para migração para o novo SAURON v2
                  </p>
                </div>
              </div>
            ) : application.prontidao_migracao >= 60 ? (
              <>
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Quase Pronto</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Algumas melhorias são necessárias antes da migração
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Revisar Dependências</p>
                    <p className="text-xs text-muted-foreground mt-1">Verificar compatibilidade de pacotes NuGet</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Atenção Crítica</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Esta aplicação requer trabalho significativo antes da migração
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Atualizar Framework</p>
                    <p className="text-xs text-muted-foreground mt-1">Migrar para versão mais recente do .NET</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Testar Integração</p>
                    <p className="text-xs text-muted-foreground mt-1">Validar integração com SAURON v2</p>
                  </div>
                </div>
              </>
            )}
          </div>

          {application.justificativa_prontidao && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-xs font-medium mb-1">Justificativa:</p>
              <p className="text-xs text-muted-foreground">{application.justificativa_prontidao}</p>
            </div>
          )}
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="dependencies">Dependências</TabsTrigger>
          <TabsTrigger value="migration">Plano de Migração</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card className="p-6 border-primary/20">
            <h3 className="font-semibold mb-4 text-primary">Detalhes da Aplicação</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">ID</p>
                <p className="text-sm font-mono">{application.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Nome</p>
                <p className="text-sm">{application.nome}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Linguagem</p>
                <p className="text-sm">{application.linguagem}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Versão .NET</p>
                <p className="text-sm font-mono">{application.versao_dotnet || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Nível de Risco</p>
                {getRiskBadge(application.risco)}
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Prontidão</p>
                <p className="text-sm font-semibold text-primary">{application.prontidao_migracao}/100</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-4">
          <Card className="p-6 border-primary/20">
            <h3 className="font-semibold mb-4 text-primary">Dependências do Projeto</h3>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : dependencies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Package className="h-12 w-12 text-muted-foreground mb-3" />
                <p className="font-medium">Nenhuma dependência encontrada</p>
                <p className="text-sm text-muted-foreground mt-1">
                  As dependências serão listadas quando disponíveis na API
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dependencies.map((dep: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                    <div className="flex-1">
                      <p className="font-medium">{dep.name || dep.nome}</p>
                      <p className="text-sm text-muted-foreground">Versão: {dep.version || dep.versao || "N/A"}</p>
                    </div>
                    {dep.status && getStatusBadge(dep.status)}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="migration" className="space-y-4">
          <Card className="p-6 border-primary/20">
            <h3 className="font-semibold mb-4 text-primary">Etapas de Migração para SAURON v2</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                  1
                </div>
                <div className="flex-1 pb-4 border-b border-border/50">
                  <h4 className="font-medium mb-1">Análise de Compatibilidade</h4>
                  <p className="text-sm text-muted-foreground">
                    Executar análise de compatibilidade com SAURON v2 e identificar pontos de integração
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                  2
                </div>
                <div className="flex-1 pb-4 border-b border-border/50">
                  <h4 className="font-medium mb-1">Atualização de Autenticação</h4>
                  <p className="text-sm text-muted-foreground">
                    Migrar do sistema de autenticação legado para SAURON v2 OAuth 2.0/OIDC
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                  3
                </div>
                <div className="flex-1 pb-4 border-b border-border/50">
                  <h4 className="font-medium mb-1">Atualização de Dependências</h4>
                  <p className="text-sm text-muted-foreground">
                    Atualizar pacotes NuGet e frameworks para versões compatíveis
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                  4
                </div>
                <div className="flex-1 pb-4 border-b border-border/50">
                  <h4 className="font-medium mb-1">Testes e Validação</h4>
                  <p className="text-sm text-muted-foreground">
                    Executar suite completa de testes e validar integração com SAURON v2
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold shrink-0">
                  5
                </div>
                <div className="flex-1">
                  <h4 className="font-medium mb-1">Deploy em Produção</h4>
                  <p className="text-sm text-muted-foreground">
                    Realizar deploy gradual com monitoramento ativo e rollback planejado
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
