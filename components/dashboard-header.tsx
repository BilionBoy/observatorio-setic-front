import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Layers } from "lucide-react";

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-primary/20 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            {/* ✅ Logo SETIC */}
            <Image
              src="/sauron.svg"
              alt="Logo SETIC"
              width={50}
              height={50}
              className="rounded-lg object-contain"
              priority
            />

            <div className="flex flex-col">
              <span className="text-sm font-bold leading-none text-primary">
                Observatório Estadual
              </span>
              <span className="text-xs text-muted-foreground">SETIC/RO</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-foreground hover:text-primary hover:bg-primary/10"
            >
              <Link href="/">Dashboard</Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-foreground hover:text-primary hover:bg-primary/10"
            >
              <Link href="/applications">Aplicações</Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-foreground hover:text-primary hover:bg-primary/10"
            >
              <Link href="/dependencies">Dependências</Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-foreground hover:text-primary hover:bg-primary/10"
            >
              <Link href="/ranking">Ranking</Link>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-foreground hover:text-primary hover:bg-primary/10"
            >
              <Link href="/map">
                <Layers className="mr-2 h-4 w-4" />
                Mapa 3D
              </Link>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary/30 hover:bg-primary/10 text-primary bg-transparent"
          >
            <Shield className="mr-2 h-4 w-4" />
            SAURON v2
          </Button>

          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <FileText className="mr-2 h-4 w-4" />
            Relatório
          </Button>
        </div>
      </div>
    </header>
  );
}
