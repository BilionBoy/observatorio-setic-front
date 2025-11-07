"use client"

import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, AlertTriangle, Package, Shield, TrendingDown, TrendingUp, X } from "lucide-react"

// Sample dependencies data
const dependenciesData = [
  {
    id: 1,
    name: "Newtonsoft.Json",
    latestVersion: "13.0.3",
    usageCount: 145,
    vulnerableApps: 12,
    outdatedApps: 68,
    severity: "Medium",
    category: "Serialization",
  },
  {
    id: 2,
    name: "RestSharp",
    latestVersion: "110.2.0",
    usageCount: 87,
    vulnerableApps: 42,
    outdatedApps: 71,
    severity: "High",
    category: "HTTP Client",
  },
  {
    id: 3,
    name: "Microsoft.AspNetCore.App",
    latestVersion: "8.0.0",
    usageCount: 293,
    vulnerableApps: 0,
    outdatedApps: 227,
    severity: "Low",
    category: "Framework",
  },
  {
    id: 4,
    name: "Swashbuckle.AspNetCore",
    latestVersion: "6.5.0",
    usageCount: 156,
    vulnerableApps: 3,
    outdatedApps: 98,
    severity: "Low",
    category: "Documentation",
  },
  {
    id: 5,
    name: "AutoMapper",
    latestVersion: "12.0.1",
    usageCount: 134,
    vulnerableApps: 0,
    outdatedApps: 45,
    severity: "Low",
    category: "Mapping",
  },
  {
    id: 6,
    name: "Dapper",
    latestVersion: "2.1.24",
    usageCount: 98,
    vulnerableApps: 0,
    outdatedApps: 32,
    severity: "Low",
    category: "Data Access",
  },
  {
    id: 7,
    name: "BouncyCastle",
    latestVersion: "2.2.1",
    usageCount: 67,
    vulnerableApps: 28,
    outdatedApps: 52,
    severity: "Critical",
    category: "Cryptography",
  },
  {
    id: 8,
    name: "Serilog",
    latestVersion: "3.1.1",
    usageCount: 189,
    vulnerableApps: 0,
    outdatedApps: 67,
    severity: "Low",
    category: "Logging",
  },
  {
    id: 9,
    name: "Novell.Directory.Ldap",
    latestVersion: "3.6.0",
    usageCount: 45,
    vulnerableApps: 18,
    outdatedApps: 38,
    severity: "High",
    category: "Authentication",
  },
  {
    id: 10,
    name: "FluentValidation",
    latestVersion: "11.9.0",
    usageCount: 123,
    vulnerableApps: 0,
    outdatedApps: 41,
    severity: "Low",
    category: "Validation",
  },
]

const riskPatternsData = [
  {
    pattern: "Uso de versões EOL do .NET",
    affected: 227,
    severity: "Critical",
    recommendation: "Migrar para .NET 8 LTS",
  },
  {
    pattern: "Dependências com vulnerabilidades conhecidas",
    affected: 103,
    severity: "High",
    recommendation: "Atualizar pacotes vulneráveis imediatamente",
  },
  {
    pattern: "Pacotes desatualizados (>2 anos)",
    affected: 156,
    severity: "Medium",
    recommendation: "Planejar atualização gradual",
  },
  {
    pattern: "Falta de autenticação moderna (OAuth/OIDC)",
    affected: 89,
    severity: "High",
    recommendation: "Implementar padrões modernos de autenticação",
  },
  {
    pattern: "Uso de bibliotecas de criptografia legadas",
    affected: 67,
    severity: "Critical",
    recommendation: "Migrar para bibliotecas modernas e certificadas",
  },
]

export function DependenciesOverview() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")

  // Calculate stats
  const stats = {
    totalDependencies: dependenciesData.length,
    vulnerableDependencies: dependenciesData.filter((d) => d.vulnerableApps > 0).length,
    totalVulnerableApps: dependenciesData.reduce((sum, d) => sum + d.vulnerableApps, 0),
    totalOutdatedApps: dependenciesData.reduce((sum, d) => sum + d.outdatedApps, 0),
  }

  // Extract unique categories
  const categories = useMemo(() => {
    return [...new Set(dependenciesData.map((d) => d.category))].sort()
  }, [])

  // Filter dependencies
  const filteredDependencies = useMemo(() => {
    return dependenciesData.filter((dep) => {
      const matchesSearch = dep.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = categoryFilter === "all" || dep.category === categoryFilter
      const matchesSeverity = severityFilter === "all" || dep.severity === severityFilter

      return matchesSearch && matchesCategory && matchesSeverity
    })
  }, [searchQuery, categoryFilter, severityFilter])

  const clearFilters = () => {
    setSearchQuery("")
    setCategoryFilter("all")
    setSeverityFilter("all")
  }

  const hasActiveFilters = searchQuery || categoryFilter !== "all" || severityFilter !== "all"

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <Badge variant="destructive">Crítica</Badge>
      case "High":
        return <Badge className="bg-orange-500 hover:bg-orange-600">Alta</Badge>
      case "Medium":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Média</Badge>
      case "Low":
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Baixa</Badge>
      default:
        return <Badge variant="secondary">{severity}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Total de Pacotes</p>
              <p className="text-2xl font-semibold">{stats.totalDependencies}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Pacotes Vulneráveis</p>
              <p className="text-2xl font-semibold">{stats.vulnerableDependencies}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Shield className="h-5 w-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Apps Vulneráveis</p>
              <p className="text-2xl font-semibold">{stats.totalVulnerableApps}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <TrendingDown className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Apps Desatualizados</p>
              <p className="text-2xl font-semibold">{stats.totalOutdatedApps}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="dependencies" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dependencies">Dependências</TabsTrigger>
          <TabsTrigger value="patterns">Padrões de Risco</TabsTrigger>
        </TabsList>

        <TabsContent value="dependencies" className="space-y-4">
          <Card className="p-6">
            {/* Filters */}
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Pacotes NuGet Utilizados</h3>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="mr-1 h-4 w-4" />
                    Limpar filtros
                  </Button>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar pacote..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Category Filter */}
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filtrar por categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Severity Filter */}
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filtrar por severidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as severidades</SelectItem>
                    <SelectItem value="Critical">Crítica</SelectItem>
                    <SelectItem value="High">Alta</SelectItem>
                    <SelectItem value="Medium">Média</SelectItem>
                    <SelectItem value="Low">Baixa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-muted-foreground">
                Mostrando <span className="font-medium text-foreground">{filteredDependencies.length}</span> de{" "}
                <span className="font-medium text-foreground">{dependenciesData.length}</span> pacotes
              </div>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pacote</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Versão Atual</TableHead>
                    <TableHead>Uso Total</TableHead>
                    <TableHead>Apps Vulneráveis</TableHead>
                    <TableHead>Apps Desatualizados</TableHead>
                    <TableHead>Severidade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDependencies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Search className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Nenhum pacote encontrado com os filtros selecionados
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDependencies.map((dep) => (
                      <TableRow key={dep.id}>
                        <TableCell className="font-medium">{dep.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{dep.category}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{dep.latestVersion}</TableCell>
                        <TableCell>{dep.usageCount} apps</TableCell>
                        <TableCell>
                          {dep.vulnerableApps > 0 ? (
                            <span className="text-red-500 font-medium">{dep.vulnerableApps}</span>
                          ) : (
                            <span className="text-emerald-500">0</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {dep.outdatedApps > 0 ? (
                            <span className="text-orange-500 font-medium">{dep.outdatedApps}</span>
                          ) : (
                            <span className="text-emerald-500">0</span>
                          )}
                        </TableCell>
                        <TableCell>{getSeverityBadge(dep.severity)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Padrões de Risco Identificados</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Análise de padrões comuns que representam riscos de segurança e manutenção
            </p>

            <div className="space-y-4">
              {riskPatternsData.map((pattern, index) => (
                <div key={index} className="rounded-lg border p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{pattern.pattern}</h4>
                        {getSeverityBadge(pattern.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground">{pattern.affected} aplicações afetadas</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 rounded-md bg-muted p-3">
                    <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Recomendação</p>
                      <p className="text-sm text-muted-foreground">{pattern.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Risk Matrix */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Matriz de Risco</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1"></div>
                <div className="text-center text-sm font-medium text-muted-foreground">Impacto Baixo</div>
                <div className="text-center text-sm font-medium text-muted-foreground">Impacto Alto</div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center justify-end pr-2 text-sm font-medium text-muted-foreground">
                  Probabilidade Alta
                </div>
                <div className="h-20 rounded-lg bg-yellow-500/20 border-2 border-yellow-500 flex items-center justify-center">
                  <span className="text-sm font-medium">Médio</span>
                </div>
                <div className="h-20 rounded-lg bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                  <span className="text-sm font-medium">Crítico</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center justify-end pr-2 text-sm font-medium text-muted-foreground">
                  Probabilidade Baixa
                </div>
                <div className="h-20 rounded-lg bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                  <span className="text-sm font-medium">Baixo</span>
                </div>
                <div className="h-20 rounded-lg bg-orange-500/20 border-2 border-orange-500 flex items-center justify-center">
                  <span className="text-sm font-medium">Alto</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-muted">
              <p className="text-sm">
                <span className="font-medium">Análise:</span> A maioria dos riscos identificados tem alta probabilidade
                devido ao uso extensivo de versões EOL e dependências desatualizadas. Recomenda-se priorizar a
                atualização de pacotes críticos e a migração de aplicações em .NET 3.1 e anteriores.
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
