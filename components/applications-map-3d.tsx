"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Environment,
  PerspectiveCamera,
} from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchAplicacoes, type Aplicacao } from "@/lib/api";
import {
  Loader2,
  Maximize2,
  Minimize2,
  Info,
  Search,
  Layers,
  Eye,
  EyeOff,
} from "lucide-react";
import * as THREE from "three";
import Link from "next/link";

// Application node component with 3D sphere
function ApplicationNode({
  app,
  position,
  onClick,
  isSelected,
  showLabels,
}: {
  app: Aplicacao;
  position: [number, number, number];
  onClick: () => void;
  isSelected: boolean;
  showLabels: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle pulsing animation for critical apps
      if (app.risco === "Crítico") {
        meshRef.current.scale.setScalar(
          1 + Math.sin(state.clock.elapsedTime * 2) * 0.1
        );
      }

      // Hover effect
      if (hovered || isSelected) {
        meshRef.current.scale.lerp(new THREE.Vector3(1.5, 1.5, 1.5), 0.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  // Color based on risk level
  const getColor = () => {
    switch (app.risco) {
      case "Crítico":
        return "#ef4444";
      case "Alto":
        return "#f97316";
      case "Médio":
        return "#eab308";
      case "Baixo":
        return "#10b981";
      default:
        return "#3b82f6";
    }
  };

  // Size based on readiness (larger = more ready)
  const size = 0.3 + (app.prontidao_migracao / 100) * 0.7;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={hovered || isSelected ? 0.5 : 0.2}
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Outer glow ring for critical apps */}
      {app.risco === "Crítico" && (
        <mesh>
          <torusGeometry args={[size * 1.3, 0.05, 16, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.3} />
        </mesh>
      )}

      {/* Label */}
      {(showLabels || hovered || isSelected) && (
        <Html distanceFactor={10} position={[0, size + 0.5, 0]}>
          <div className="bg-black/90 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shadow-lg border border-white/20">
            <div className="font-semibold">{app.nome}</div>
            <div className="text-gray-300 text-[10px]">
              {app.prontidao_migracao}/100 • {app.risco}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

// Connection line between nodes
function ConnectionLine({
  start,
  end,
  strength,
}: {
  start: [number, number, number];
  end: [number, number, number];
  strength: number;
}) {
  const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);

  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color="#3b82f6"
        transparent
        opacity={0.15 * strength}
        linewidth={1}
      />
    </line>
  );
}

// Main 3D Scene
function Scene({
  applications,
  selectedApp,
  onSelectApp,
  showConnections,
  showLabels,
  riskFilter,
}: {
  applications: Aplicacao[];
  selectedApp: Aplicacao | null;
  onSelectApp: (app: Aplicacao | null) => void;
  showConnections: boolean;
  showLabels: boolean;
  riskFilter: string;
}) {
  const { camera } = useThree();

  // Filter applications
  const filteredApps = applications.filter(
    (app) => riskFilter === "all" || app.risco === riskFilter
  );

  // Position nodes in 3D space using force-directed layout simulation
  const nodes = filteredApps.map((app, i) => {
    // Create spherical distribution
    const phi = Math.acos(-1 + (2 * i) / filteredApps.length);
    const theta = Math.sqrt(filteredApps.length * Math.PI) * phi;

    // Radius based on readiness (higher readiness = further from center)
    const radius = 15 + (app.prontidao_migracao / 100) * 15;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    return { app, position: [x, y, z] as [number, number, number] };
  });

  // Generate connections based on similar technologies or risk levels
  const connections = [];
  if (showConnections) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const node1 = nodes[i];
        const node2 = nodes[j];

        // Connect if same language or similar risk level
        const sameTech = node1.app.linguagem === node2.app.linguagem;
        const sameRisk = node1.app.risco === node2.app.risco;
        const similarReadiness =
          Math.abs(
            node1.app.prontidao_migracao - node2.app.prontidao_migracao
          ) < 20;

        if (sameTech || (sameRisk && similarReadiness)) {
          const strength = sameTech ? 1 : 0.5;
          connections.push({
            start: node1.position,
            end: node2.position,
            strength,
          });
        }
      }
    }
  }

  useEffect(() => {
    // Set initial camera position
    camera.position.set(40, 40, 40);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />

      {/* Environment for reflections */}
      <Environment preset="night" />

      {/* Render connections */}
      {connections.map((conn, i) => (
        <ConnectionLine
          key={i}
          start={conn.start}
          end={conn.end}
          strength={conn.strength}
        />
      ))}

      {/* Render application nodes */}
      {nodes.map(({ app, position }) => (
        <ApplicationNode
          key={app.id}
          app={app}
          position={position}
          onClick={() => onSelectApp(app)}
          isSelected={selectedApp?.id === app.id}
          showLabels={showLabels}
        />
      ))}

      {/* Center reference sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color="#3b82f6"
          wireframe
          opacity={0.3}
          transparent
        />
      </mesh>

      {/* Grid helper */}
      <gridHelper
        args={[100, 20, "#3b82f6", "#1e293b"]}
        position={[0, -30, 0]}
      />

      {/* Orbit controls for interaction */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        minDistance={20}
        maxDistance={100}
      />
    </>
  );
}

export function ApplicationsMap3D() {
  const [applications, setApplications] = useState<Aplicacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Aplicacao | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [showConnections, setShowConnections] = useState(true);
  const [showLabels, setShowLabels] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAplicacoes()
      .then(setApplications)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = app.nome
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === "all" || app.risco === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const stats = {
    total: filteredApplications.length,
    critical: filteredApplications.filter((a) => a.risco === "Crítico").length,
    high: filteredApplications.filter((a) => a.risco === "Alto").length,
    medium: filteredApplications.filter((a) => a.risco === "Médio").length,
    low: filteredApplications.filter((a) => a.risco === "Baixo").length,
    avgReadiness: Math.round(
      filteredApplications.reduce((sum, a) => sum + a.prontidao_migracao, 0) /
        filteredApplications.length
    ),
  };

  if (loading) {
    return (
      <Card className="p-6 border-primary/20">
        <div className="flex items-center justify-center h-[600px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <Card className="p-4 border-primary/20">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Controles do Mapa</h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showConnections ? "default" : "outline"}
                size="sm"
                onClick={() => setShowConnections(!showConnections)}
                className={showConnections ? "bg-primary" : ""}
              >
                Conexões
              </Button>
              <Button
                variant={showLabels ? "default" : "outline"}
                size="sm"
                onClick={() => setShowLabels(!showLabels)}
                className={showLabels ? "bg-primary" : ""}
              >
                {showLabels ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar aplicação..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por risco" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os riscos</SelectItem>
                <SelectItem value="Crítico">Crítico</SelectItem>
                <SelectItem value="Alto">Alto</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Baixo">Baixo</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center justify-between px-3 bg-muted rounded-md">
              <span className="text-sm text-muted-foreground">
                Visualizando:
              </span>
              <span className="text-sm font-semibold text-primary">
                {filteredApplications.length} apps
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2 border-t border-border/50">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-primary">{stats.total}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Crítico</p>
              <p className="text-lg font-bold text-red-500">{stats.critical}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Alto</p>
              <p className="text-lg font-bold text-orange-500">{stats.high}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Médio</p>
              <p className="text-lg font-bold text-yellow-600">
                {stats.medium}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Baixo</p>
              <p className="text-lg font-bold text-emerald-600">{stats.low}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Prontidão Média</p>
              <p className="text-lg font-bold text-primary">
                {stats.avgReadiness}%
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* 3D Visualization */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card
          className="lg:col-span-2 border-primary/20 overflow-hidden"
          ref={containerRef}
        >
          <div className="w-full h-[700px] bg-gradient-to-b from-slate-950 to-slate-900">
            <Canvas shadows>
              <PerspectiveCamera makeDefault position={[40, 40, 40]} />
              <Suspense fallback={null}>
                <Scene
                  applications={filteredApplications}
                  selectedApp={selectedApp}
                  onSelectApp={setSelectedApp}
                  showConnections={showConnections}
                  showLabels={showLabels}
                  riskFilter={riskFilter}
                />
              </Suspense>
            </Canvas>
          </div>
        </Card>

        {/* Details Panel */}
        <Card className="p-6 border-primary/20">
          <h3 className="font-semibold mb-4 text-primary">
            Detalhes da Aplicação
          </h3>
          {selectedApp ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Nome</p>
                <p className="font-semibold text-lg">{selectedApp.nome}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Linguagem
                  </p>
                  <Badge
                    variant="outline"
                    className="font-mono border-primary/30"
                  >
                    {selectedApp.linguagem}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Versão .NET
                  </p>
                  <Badge
                    variant="outline"
                    className="font-mono border-primary/30"
                  >
                    {selectedApp.versao_dotnet || "N/A"}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Prontidão de Migração
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        selectedApp.prontidao_migracao >= 80
                          ? "bg-emerald-500"
                          : selectedApp.prontidao_migracao >= 60
                          ? "bg-yellow-500"
                          : selectedApp.prontidao_migracao >= 40
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${selectedApp.prontidao_migracao}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {selectedApp.prontidao_migracao}/100
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Nível de Risco
                </p>
                <Badge
                  className={`${
                    selectedApp.risco === "Crítico"
                      ? "bg-red-500"
                      : selectedApp.risco === "Alto"
                      ? "bg-orange-500"
                      : selectedApp.risco === "Médio"
                      ? "bg-yellow-600"
                      : "bg-emerald-600"
                  } text-white font-medium`}
                >
                  {selectedApp.risco}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Ação Recomendada
                </p>
                <p className="text-sm">{selectedApp.acao}</p>
              </div>

              {selectedApp.justificativa_prontidao && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Justificativa
                  </p>
                  <p className="text-xs leading-relaxed">
                    {selectedApp.justificativa_prontidao}
                  </p>
                </div>
              )}

              <div className="pt-4 space-y-2">
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  asChild
                >
                  <Link
                    href={`/applications/${encodeURIComponent(
                      selectedApp.nome
                    )}`}
                  >
                    Ver Detalhes Completos
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => setSelectedApp(null)}
                >
                  Limpar Seleção
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-center">
              <Info className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground mb-2">
                Clique em uma aplicação no mapa 3D para ver seus detalhes
              </p>
              <p className="text-xs text-muted-foreground">
                Use o mouse para rotacionar, scroll para zoom
              </p>
            </div>
          )}
        </Card>
      </div>

      {/* Instructions */}
      <Card className="p-4 border-primary/20 bg-primary/5">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="flex-1 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-2">
              Como usar o Mapa 3D Imersivo:
            </p>
            <ul className="space-y-1 text-xs">
              <li>
                • <strong>Rotacionar:</strong> Clique e arraste para girar o
                mapa
              </li>
              <li>
                • <strong>Zoom:</strong> Use o scroll do mouse ou pinch no
                touchpad
              </li>
              <li>
                • <strong>Selecionar:</strong> Clique em qualquer esfera para
                ver detalhes
              </li>
              <li>
                • <strong>Cores:</strong> Vermelho = Crítico, Laranja = Alto,
                Amarelo = Médio, Verde = Baixo
              </li>
              <li>
                • <strong>Tamanho:</strong> Esferas maiores = maior prontidão de
                migração
              </li>
              <li>
                • <strong>Conexões:</strong> Linhas azuis conectam aplicações
                com tecnologias similares
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
