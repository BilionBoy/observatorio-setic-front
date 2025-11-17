"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package } from "lucide-react";
import type { CriticalDependency } from "@/lib/api";

interface CriticalDependenciesCardProps {
  dependencies: CriticalDependency[];
}

export function CriticalDependenciesCard({
  dependencies,
}: CriticalDependenciesCardProps) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h3 className="font-semibold">Dependências Críticas</h3>
          <p className="text-sm text-muted-foreground">
            Requerem atenção imediata para migração
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {dependencies.map((dep, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border p-4 bg-destructive/5 hover:bg-destructive/10 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <Package className="h-4 w-4 text-destructive shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-sm font-medium truncate">
                  {dep.nome}
                </p>
                <p className="text-xs text-muted-foreground">
                  Usado em: {dep.modulo}
                </p>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-xs shrink-0">
              v{dep.versao}
            </Badge>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-lg bg-muted p-4">
        <p className="text-sm">
          <AlertTriangle className="inline h-4 w-4 mr-2 text-orange-500" />
          <span className="font-medium">Atenção:</span> Estas dependências
          possuem vulnerabilidades conhecidas ou estão obsoletas. Atualize-as
          antes de migrar para .NET 8.
        </p>
      </div>
    </Card>
  );
}
