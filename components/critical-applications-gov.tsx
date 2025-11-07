import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertTriangle, ChevronRight, Clock, Shield } from "lucide-react"

const criticalApps = [
  {
    id: "5",
    name: "alpha-solicitacoes-carta-de-servico-api",
    version: "net5.0",
    readiness: 20,
    risk: "Crítico",
    department: "SETIC",
    lastUpdate: "Dez 2022",
    issues: ["EOL iminente", "Vulnerabilidades críticas", "Dependências obsoletas"],
  },
  {
    id: "2",
    name: "agendamento-ppe",
    version: "netcoreapp3.1",
    readiness: 40,
    risk: "Crítico",
    department: "SESAU",
    lastUpdate: "Jun 2023",
    issues: ["Suporte encerrado", "Alto acoplamento", "JWT manual"],
  },
  {
    id: "6",
    name: "sistema-rh-legado",
    version: "netcoreapp2.1",
    readiness: 15,
    risk: "Crítico",
    department: "SEGEP",
    lastUpdate: "Mar 2021",
    issues: ["Versão descontinuada", "Código legado", "8 vulnerabilidades"],
  },
]

export function CriticalApplications() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">Aplicações Críticas</h3>
          <p className="text-sm text-muted-foreground">Sistemas que requerem ação imediata</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/applications">
            Ver todas <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {criticalApps.map((app) => (
          <Link key={app.id} href={`/applications/${app.id}`}>
            <div className="group rounded-lg border border-border p-4 transition-all hover:border-destructive/50 hover:bg-accent/50">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
                    <h4 className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                      {app.name}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      {app.version}
                    </span>
                    <span>•</span>
                    <span>{app.department}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {app.lastUpdate}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {app.issues.map((issue, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs font-normal">
                        {issue}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-secondary rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-destructive rounded-full transition-all"
                        style={{ width: `${app.readiness}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {app.readiness}% pronto
                    </span>
                  </div>
                </div>

                <Badge variant="destructive" className="ml-4 shrink-0">
                  {app.risk}
                </Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
