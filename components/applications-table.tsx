"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowUpDown, ExternalLink, Filter, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { fetchAplicacoes, type Aplicacao } from "@/lib/api"

type SortField = "nome" | "versao_dotnet" | "prontidao_migracao" | "risco" | "linguagem"
type SortDirection = "asc" | "desc"

export function ApplicationsTable() {
  const [applications, setApplications] = useState<Aplicacao[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [riskFilter, setRiskFilter] = useState<string>("all")
  const [versionFilter, setVersionFilter] = useState<string>("all")
  const [languageFilter, setLanguageFilter] = useState<string>("all")
  const [readinessMin, setReadinessMin] = useState<string>("0")
  const [sortField, setSortField] = useState<SortField>("nome")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  useEffect(() => {
    fetchAplicacoes()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])
  // </CHANGE>

  // Extract unique versions and languages for filters
  const { versions, languages } = useMemo(() => {
    const uniqueVersions = [...new Set(applications.map((app) => app.versao_dotnet).filter(Boolean))].sort()
    const uniqueLanguages = [...new Set(applications.map((app) => app.linguagem))].sort()
    return { versions: uniqueVersions, languages: uniqueLanguages }
  }, [applications])

  // Filter and sort applications
  const filteredApplications = useMemo(() => {
    const filtered = applications.filter((app) => {
      const matchesSearch = app.nome.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRisk = riskFilter === "all" || app.risco === riskFilter
      const matchesVersion = versionFilter === "all" || app.versao_dotnet === versionFilter
      const matchesLanguage = languageFilter === "all" || app.linguagem === languageFilter
      const matchesReadiness = readinessMin === "" || app.prontidao_migracao >= Number.parseInt(readinessMin)

      return matchesSearch && matchesRisk && matchesVersion && matchesLanguage && matchesReadiness
    })

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0

      if (sortField === "nome") {
        comparison = a.nome.localeCompare(b.nome)
      } else if (sortField === "versao_dotnet") {
        comparison = (a.versao_dotnet || "").localeCompare(b.versao_dotnet || "")
      } else if (sortField === "prontidao_migracao") {
        comparison = a.prontidao_migracao - b.prontidao_migracao
      } else if (sortField === "linguagem") {
        comparison = a.linguagem.localeCompare(b.linguagem)
      } else if (sortField === "risco") {
        const riskOrder = { Baixo: 1, Médio: 2, Alto: 3, Crítico: 4 }
        comparison = riskOrder[a.risco as keyof typeof riskOrder] - riskOrder[b.risco as keyof typeof riskOrder]
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    return filtered
  }, [searchQuery, riskFilter, versionFilter, languageFilter, readinessMin, sortField, sortDirection, applications])

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage)
  const paginatedApplications = filteredApplications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setRiskFilter("all")
    setVersionFilter("all")
    setLanguageFilter("all")
    setReadinessMin("0")
    setCurrentPage(1)
  }

  const hasActiveFilters =
    searchQuery || riskFilter !== "all" || versionFilter !== "all" || languageFilter !== "all" || readinessMin !== "0"

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "Crítico":
        return (
          <Badge variant="destructive" className="font-medium">
            {risk}
          </Badge>
        )
      case "Alto":
        return <Badge className="bg-orange-500 hover:bg-orange-600 font-medium text-white">{risk}</Badge>
      case "Médio":
        return <Badge className="bg-yellow-600 hover:bg-yellow-700 font-medium text-white">{risk}</Badge>
      case "Baixo":
        return <Badge className="bg-emerald-600 hover:bg-emerald-700 font-medium text-white">{risk}</Badge>
      default:
        return <Badge>{risk}</Badge>
    }
  }

  const getReadinessColor = (readiness: number) => {
    if (readiness >= 80) return "text-emerald-400 font-bold"
    if (readiness >= 60) return "text-yellow-400 font-bold"
    if (readiness >= 40) return "text-orange-400 font-bold"
    return "text-red-400 font-bold"
  }

  if (loading) {
    return (
      <Card className="p-6 border-border/50">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6 border-border/50">
      {/* Filters Section */}
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-semibold">Filtros</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto">
              <X className="mr-1 h-4 w-4" />
              Limpar filtros
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar aplicação..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Risk Filter */}
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por risco" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os riscos</SelectItem>
              <SelectItem value="Baixo">Baixo</SelectItem>
              <SelectItem value="Médio">Médio</SelectItem>
              <SelectItem value="Alto">Alto</SelectItem>
              <SelectItem value="Crítico">Crítico</SelectItem>
            </SelectContent>
          </Select>

          {/* Language Filter */}
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por linguagem" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as linguagens</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Version Filter */}
          <Select value={versionFilter} onValueChange={setVersionFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por versão" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as versões</SelectItem>
              {versions.map((version) => (
                <SelectItem key={version} value={version}>
                  {version}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Readiness Filter */}
          <Select value={readinessMin} onValueChange={setReadinessMin}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Prontidão mínima" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Todas</SelectItem>
              <SelectItem value="80">≥ 80 (Excelente)</SelectItem>
              <SelectItem value="60">≥ 60 (Bom)</SelectItem>
              <SelectItem value="40">≥ 40 (Regular)</SelectItem>
              <SelectItem value="20">≥ 20 (Crítico)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Mostrando{" "}
            <span className="font-semibold text-foreground">
              {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredApplications.length)}
            </span>{" "}
            de <span className="font-semibold text-foreground">{filteredApplications.length}</span> aplicações
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("nome")} className="-ml-3 h-8 gap-1">
                  Nome
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("versao_dotnet")}
                  className="-ml-3 h-8 gap-1"
                >
                  Versão
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("linguagem")} className="-ml-3 h-8 gap-1">
                  Linguagem
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("prontidao_migracao")}
                  className="-ml-3 h-8 gap-1"
                >
                  Prontidão
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" size="sm" onClick={() => handleSort("risco")} className="-ml-3 h-8 gap-1">
                  Risco
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Search className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Nenhuma aplicação encontrada com os filtros selecionados
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedApplications.map((app) => (
                <TableRow key={app.id} className="hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <Link
                      href={`/applications/${encodeURIComponent(app.nome)}`}
                      className="hover:text-primary hover:underline transition-colors"
                    >
                      {app.nome}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-xs">
                      {app.versao_dotnet || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">{app.linguagem}</span>
                  </TableCell>
                  <TableCell>
                    <span className={getReadinessColor(app.prontidao_migracao)}>{app.prontidao_migracao}/100</span>
                  </TableCell>
                  <TableCell>{getRiskBadge(app.risco)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/applications/${encodeURIComponent(app.nome)}`}>
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}
    </Card>
  )
}
