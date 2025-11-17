"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Shield,
  AlertTriangle,
  Package,
  Database,
  Network,
} from "lucide-react";

interface SauronStatsProps {
  stats: {
    total_modulos: number;
    por_tipo: Record<string, number>;
    usa_identityserver: number;
    usa_ldap: number;
    com_ef_core: number;
    dependencias_criticas: number;
  };
  risks: {
    alto: number;
    medio: number;
    baixo: number;
  };
}

export function SauronStats({ stats, risks }: SauronStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 animate-pulse-slow">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Módulos SAURON</p>
            <p className="text-3xl font-bold">{stats.total_modulos}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/10">
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Riscos Altos</p>
            <p className="text-3xl font-bold text-red-500">{risks.alto}</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
            <Package className="h-6 w-6 text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Dependências Críticas
            </p>
            <p className="text-3xl font-bold text-orange-500">
              {stats.dependencias_criticas}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
            <Network className="h-6 w-6 text-accent" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">IdentityServer</p>
            <p className="text-3xl font-bold text-accent">
              {stats.usa_identityserver}
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-3/10 to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
            <Database className="h-6 w-6 text-chart-3" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Com EF Core</p>
            <p className="text-3xl font-bold text-chart-3">
              {stats.com_ef_core}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
