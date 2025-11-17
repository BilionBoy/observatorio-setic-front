import { DashboardHeader } from "@/components/dashboard-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Code2,
  Database,
  Package,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { fetchSauronModuleDetail } from "@/lib/api";

export default async function SauronModuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const module = await fetchSauronModuleDetail(parseInt(id));

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/sauron" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Módulos SAURON
          </Link>
        </Button>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight font-mono">
                {module.nome}
              </h1>
              <p className="text-muted-foreground mt-1">
                Detalhes do módulo SAURON v2
              </p>
            </div>
          </div>

          <Badge
            variant="destructive"
            className="text-lg px-4 py-2 animate-glow"
          >
            Impacto: {module.impacto}
          </Badge>
        </div>

        {/* Main Info Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Tecnologia</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Linguagem:
                </span>
                <Badge variant="outline">{module.linguagem}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Versão .NET:
                </span>
                <Badge variant="secondary">{module.versao_dotnet}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tipo:</span>
                <Badge>{module.tipo_projeto}</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-5 w-5 text-accent" />
              <h3 className="font-semibold">Banco de Dados</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tipo:</span>
                <Badge variant="outline">{module.tipo_banco}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">EF Core:</span>
                {module.ef_core ? (
                  <Badge className="bg-emerald-500/10 text-emerald-500">
                    {module.ef_core_versao}
                  </Badge>
                ) : (
                  <Badge variant="secondary">Não usa</Badge>
                )}
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Migrations:
                </span>
                <span className="text-sm font-medium">
                  {module.qtde_migrations} arquivos
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold">Pacotes NuGet</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  {module.pacotes_nuget_qtd}
                </span>
              </div>
              <Separator />
              <div className="text-xs text-muted-foreground">
                Ver lista completa abaixo
              </div>
            </div>
          </Card>
        </div>

        {/* Authentication Features */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Recursos de Autenticação
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3 p-3 rounded-lg border">
              {module.usa_identityserver ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium">IdentityServer</p>
                <p className="text-xs text-muted-foreground">
                  {module.usa_identityserver ? "Implementado" : "Não usa"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border">
              {module.usa_ldap ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium">LDAP</p>
                <p className="text-xs text-muted-foreground">
                  {module.usa_ldap ? "Integrado" : "Não usa"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border">
              {module.usa_jwt_manual ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              <div>
                <p className="text-sm font-medium">JWT Manual</p>
                <p className="text-xs text-muted-foreground">
                  {module.usa_jwt_manual ? "Implementado" : "Não usa"}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Controllers & API */}
        {module.controllers && (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Controllers/Endpoints</h3>
            <div className="bg-muted rounded-lg p-4 font-mono text-sm">
              <pre className="whitespace-pre-wrap">{module.controllers}</pre>
            </div>
          </Card>
        )}

        {/* NuGet Packages List */}
        <Card className="p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-orange-500" />
            Pacotes NuGet ({module.pacotes_nuget_qtd})
          </h3>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap">
              {module.pacotes_nuget_lista}
            </pre>
          </div>
        </Card>

        {/* Internal Dependencies */}
        {module.dependencias_internas &&
          module.dependencias_internas.length > 0 && (
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Dependências Internas Críticas
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {module.dependencias_internas.map((dep, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      dep.critica
                        ? "bg-destructive/5 border-destructive/30"
                        : "bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {dep.critica && (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{dep.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          v{dep.versao}
                        </p>
                      </div>
                    </div>
                    {dep.critica && (
                      <Badge variant="destructive" className="text-xs">
                        Crítica
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

        {/* Recommended Action */}
        <Card className="p-6 bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Ação Recomendada
          </h3>
          <p className="text-sm leading-relaxed">{module.acao_recomendada}</p>

          {module.observacao && (
            <>
              <Separator className="my-4" />
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Observação:</strong> {module.observacao}
                </p>
              </div>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
