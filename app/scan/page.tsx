"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchScanResults, ScanResult } from "@/lib/api";
import { ScanTable } from "@/components/scan-table";
import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet } from "lucide-react";

export default function ScanPage() {
  const [scans, setScans] = useState<ScanResult[]>([]);

  useEffect(() => {
    fetchScanResults().then(setScans);
  }, []);

  // ------------------------
  // EXPORTAR PDF — 100% FUNCIONAL
  // ------------------------
  const exportPDF = useCallback(async () => {
    const jsPDF = (await import("jspdf")).default;
    const autoTable = (await import("jspdf-autotable")).default;

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const columns = [
      { header: "Scan", dataKey: "scan_name" },
      { header: "Crítico", dataKey: "critical" },
      { header: "Alto", dataKey: "high" },
      { header: "Médio", dataKey: "medium" },
      { header: "Baixo", dataKey: "low" },
      { header: "Aplicação", dataKey: "aplicacao_nome" },
      { header: "Linguagem", dataKey: "linguagem" },
      { header: "CVSS Máx", dataKey: "cvss" },
    ];

    const rows = scans.map((s) => ({
      scan_name: s.scan_name,
      critical: s.critical,
      high: s.high,
      medium: s.medium,
      low: s.low,
      aplicacao_nome: s.aplicacao_nome ?? "Outra Tecnologia || Outro Órgão",
      linguagem: s.linguagem ?? "—",
      cvss: s.cvssv3_base_score_max ?? s.cvss_base_score_max ?? "—",
    }));

    pdf.setFontSize(16);
    pdf.text("Observatório de Vulnerabilidades - SETIC/RO", 14, 15);

    autoTable(pdf, {
      startY: 22,
      head: [columns.map((c) => c.header)],
      body: rows.map((r) => Object.values(r)),
      theme: "grid",
      headStyles: {
        fillColor: [52, 73, 94],
        textColor: [255, 255, 255],
      },
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    pdf.save("vulnerabilidades.pdf");
  }, [scans]);

  // ------------------------
  // EXPORTAR EXCEL
  // ------------------------
  const exportExcel = useCallback(async () => {
    const xlsx = await import("xlsx");

    const ws = xlsx.utils.json_to_sheet(scans);
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, "Scans");

    xlsx.writeFile(wb, "vulnerabilidades.xlsx");
  }, [scans]);

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Observatório de Vulnerabilidades</h1>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 cursor-pointer"
            onClick={exportPDF}
          >
            <FileDown className="h-4 w-4" />
            Exportar PDF
          </Button>

          <Button
            className="flex items-center gap-2 cursor-pointer"
            onClick={exportExcel}
          >
            <FileSpreadsheet className="h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </div>

      <ScanTable data={scans} />
    </div>
  );
}
