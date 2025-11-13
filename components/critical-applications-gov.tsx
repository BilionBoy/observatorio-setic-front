"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle, ChevronRight } from "lucide-react";

const criticalApps = [
  {
    id: 5,
    name: "alpha-solicitacoes-carta-de-servico-api",
    version: "net5.0",
    readiness: 20,
    risk: "Crítico",
    packages: ["RestSharp", "BouncyCastle"],
  },
  {
    id: 2,
    name: "agendamento-ppe",
    version: "netcoreapp3.1",
    readiness: 40,
    risk: "Crítico",
    packages: ["RestSharp", "JWT Manual"],
  },
  {
    id: 15,
    name: "api-gestao-contratos",
    version: "netcoreapp2.2",
    readiness: 35,
    risk: "Crítico",
    packages: ["Novell.Directory.Ldap"],
  },
];

export function CriticalApplications() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Aplicações Críticas</h3>
          <p className="text-sm text-muted-foreground">
            Sistemas com maior risco de migração
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/applications">
            Ver todas <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {criticalApps.map((app) => (
          <Link
            key={app.id}
            href={`/applications/${app.name}`}
            className="block rounded-lg border border-border p-4 transition-colors hover:bg-accent hover:border-primary"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <h4 className="font-medium">{app.name}</h4>
                </div>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{app.version}</span>
                  <span>•</span>
                  <span>Prontidão: {app.readiness}/100</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {app.packages.map((pkg) => (
                    <Badge key={pkg} variant="secondary" className="text-xs">
                      {pkg}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="ml-4">
                <Badge variant="destructive">{app.risk}</Badge>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
