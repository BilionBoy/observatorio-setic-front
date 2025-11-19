"use client";

import { ScanResult } from "@/lib/api";
import { Card } from "@/components/ui/card";

interface Props {
  data: ScanResult[];
}

export function ScanTable({ data }: Props) {
  return (
    <Card className="p-4">
      <div id="scan-table-export">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-muted text-left">
              <th className="p-2">Scan</th>
              <th className="p-2">Crítico</th>
              <th className="p-2">Alto</th>
              <th className="p-2">Médio</th>
              <th className="p-2">Baixo</th>
              <th className="p-2">Aplicação</th>
              <th className="p-2">Linguagem</th>
              <th className="p-2">CVSS Máx</th>
            </tr>
          </thead>

          <tbody>
            {data.map((s) => (
              <tr key={s.id} className="border-b">
                <td className="p-2">{s.scan_name}</td>
                <td className="p-2 font-bold text-red-600">{s.critical}</td>
                <td className="p-2 text-orange-600">{s.high}</td>
                <td className="p-2 text-yellow-600">{s.medium}</td>
                <td className="p-2 text-green-700">{s.low}</td>

                <td className="p-2">
                  {s.aplicacao_nome || (
                    <span className="text-gray-400">
                      Outra Tecnologia || Outro Órgão
                    </span>
                  )}
                </td>

                <td className="p-2">{s.linguagem || "-"}</td>

                <td className="p-2">
                  {s.cvssv3_base_score_max || s.cvss_base_score_max || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
