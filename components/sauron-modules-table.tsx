"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Code2, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { SauronModule } from "@/lib/api";

interface SauronModulesTableProps {
  modules: SauronModule[];
}

export function SauronModulesTable({ modules }: SauronModulesTableProps) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            Módulos do SAURON v2
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Sistema de autenticação centralizado do Governo de Rondônia
          </p>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Módulo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Versão .NET</TableHead>
              <TableHead>EF Core</TableHead>
              <TableHead>Pacotes NuGet</TableHead>
              <TableHead>Impacto</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module) => (
              <TableRow key={module.id} className="group hover:bg-primary/5">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse-slow" />
                    <Link
                      href={`/sauron/${module.id}`}
                      className="font-mono text-sm font-medium hover:text-primary hover:underline"
                    >
                      {module.nome}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {module.tipo_projeto}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {module.versao_dotnet}
                  </Badge>
                </TableCell>
                <TableCell>
                  {module.ef_core ? (
                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">
                      {module.ef_core_versao}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">N/A</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">
                    {module.pacotes_nuget_qtd}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive" className="animate-glow">
                    {module.impacto}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/sauron/${module.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
