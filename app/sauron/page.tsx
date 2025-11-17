import { DashboardHeader } from "@/components/dashboard-header";
import { NetworkMap3D } from "@/components/network-map-3d";
import { SauronStats } from "@/components/sauron-stats";
import { SauronModulesTable } from "@/components/sauron-modules-table";
import { CriticalDependenciesCard } from "@/components/critical-dependencies-card";
import {
  fetchSauronModules,
  fetchSauronStatistics,
  fetchSauronRisks,
  fetchCriticalDependencies,
  fetchAplicacoes,
} from "@/lib/api";

function generateNetworkData(modules: any[], applications: any[]) {
  const nodes: any[] = [];

  // Add SAURON core modules
  modules.slice(0, 10).forEach((module, index) => {
    const angle = (index / 10) * Math.PI * 2;
    const radius = 5;
    nodes.push({
      id: `sauron-${module.id}`,
      name: module.nome,
      type: "sauron",
      position: [
        Math.cos(angle) * radius,
        Math.sin(angle * 0.5) * 2,
        Math.sin(angle) * radius,
      ],
      connections: [],
      status: module.status,
    });
  });

  // Add connected applications
  applications.forEach((app, index) => {
    const angle = (index / applications.length) * Math.PI * 2;
    const radius = 10;
    const sauronIndex = Math.floor(
      Math.random() * Math.min(10, modules.length)
    );
    nodes.push({
      id: `app-${app.id}`,
      name: app.nome,
      type: "app",
      position: [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 4,
        Math.sin(angle) * radius,
      ],
      connections: [`sauron-${modules[sauronIndex]?.id}`],
      status: "active",
    });
  });

  // Add dependencies
  const depCount = 8;
  for (let i = 0; i < depCount; i++) {
    const angle = (i / depCount) * Math.PI * 2;
    const radius = 13;
    const appIndex = Math.floor(Math.random() * applications.length);
    nodes.push({
      id: `dep-${i}`,
      name: `Dependência-${i + 1}`,
      type: "dependency",
      position: [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 3,
        Math.sin(angle) * radius,
      ],
      connections: [`app-${applications[appIndex]?.id}`],
      critical: i < 3,
    });
  }

  // Add migrations
  const migCount = 5;
  for (let i = 0; i < migCount; i++) {
    const angle = (i / migCount) * Math.PI * 2;
    const radius = 8;
    nodes.push({
      id: `mig-${i}`,
      name: `Migração-${i + 1}`,
      type: "migration",
      position: [
        Math.cos(angle) * radius,
        3 + Math.random() * 2,
        Math.sin(angle) * radius,
      ],
      connections: [],
      status: i < 2 ? "em-andamento" : "planejado",
    });
  }

  // Create bidirectional connections
  nodes.forEach((node) => {
    node.connections.forEach((connId: string) => {
      const targetNode = nodes.find((n) => n.id === connId);
      if (targetNode && !targetNode.connections.includes(node.id)) {
        targetNode.connections.push(node.id);
      }
    });
  });

  return nodes;
}

export default async function SauronPage() {
  const [modules, stats, risks, criticalDeps, applications] = await Promise.all(
    [
      fetchSauronModules(),
      fetchSauronStatistics(),
      fetchSauronRisks(),
      fetchCriticalDependencies(),
      fetchAplicacoes(), // Get all 293 applications
    ]
  );

  const networkData = generateNetworkData(modules, applications);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/50">
              <span className="text-2xl">🌌</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Galáxia SAURON
              </h1>
              <p className="text-muted-foreground mt-1">
                Visualização imersiva em 3D do ecossistema completo de
                autenticação
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <SauronStats stats={stats} risks={risks} />

        {/* Network Map - The immersive 3D galaxy */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                Mapa de Conexões Imersivo
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Explore o universo de {applications.length} aplicações
                conectadas aos {modules.length} módulos SAURON em tempo real
              </p>
            </div>
          </div>

          <NetworkMap3D sauronModules={modules} applications={applications} />
        </div>

        {/* Modules Table */}
        <SauronModulesTable modules={modules} />

        {/* Critical Dependencies */}
        <CriticalDependenciesCard dependencies={criticalDeps} />
      </main>
    </div>
  );
}
