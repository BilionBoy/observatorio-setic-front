"use client";

import { ScanResult } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import * as XLSX from "xlsx";

export function ExportScanButtons({ data }: { data: ScanResult[] }) {
  // ---------------------------------------------
  // EXPORTAR EXCEL
  // ---------------------------------------------
  const exportExcel = () => {
    const rows = data.map((s) => ({
      ID: s.id,
      Scan: s.scan_name,
      Crítico: s.critical,
      Alto: s.high,
      Médio: s.medium,
      Baixo: s.low,
      Total: s.total,
      Aplicação: s.aplicacao_nome || "-",
      Linguagem: s.linguagem || "-",
      "CVSS Máx": s.cvssv3_base_score_max || s.cvss_base_score_max || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vulnerabilidades");

    XLSX.writeFile(workbook, "observatorio_vulnerabilidades.xlsx");
  };

  // ---------------------------------------------
  // EXPORTAR PDF
  // ---------------------------------------------
  const exportPDF = () => {
    const content = window.document.getElementById("scan-table-export");

    if (content) {
      const printWindow = window.open("", "", "width=1200,height=900");
      printWindow!.document.write(`
        <html>
          <head>
            <title>Observatório de Vulnerabilidades</title>
            <style>
              body { font-family: Arial; padding: 20px; }
              table { width: 100%; border-collapse: collapse; font-size: 12px; }
              th, td { border: 1px solid #222; padding: 6px; text-align: left; }
              th { background: #f4f4f4; font-weight: bold; }
            </style>
          </head>
          <body>
            <h2>Observatório de Vulnerabilidades</h2>
            ${content.outerHTML}
          </body>
        </html>
      `);
      printWindow!.document.close();
      printWindow!.print();
    }
  };

  return (
    <div className="flex gap-3 mb-4">
      <Button
        onClick={exportExcel}
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        Exportar Excel
      </Button>

      <Button
        onClick={exportPDF}
        className="bg-rose-600 hover:bg-rose-700 text-white"
      >
        <FileText className="mr-2 h-4 w-4" />
        Exportar PDF
      </Button>
    </div>
  );
}
