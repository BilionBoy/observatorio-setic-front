"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Network, Maximize2, Minimize2, RefreshCw } from "lucide-react";

interface NetworkNode {
  id: string;
  label: string;
  type: "sauron" | "app" | "dependency" | "migration";
  x: number;
  y: number;
  connections: string[];
  risk?: string;
  status?: string;
}

export function NetworkMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);

  // Simulated network data - will be replaced with real API data
  const [nodes] = useState<NetworkNode[]>([
    // SAURON Core modules
    {
      id: "sauron-api",
      label: "Sauron.Api",
      type: "sauron",
      x: 400,
      y: 300,
      connections: ["sauron-app", "sauron-core"],
      risk: "Alto",
    },
    {
      id: "sauron-auth",
      label: "Sauron.Auth",
      type: "sauron",
      x: 600,
      y: 300,
      connections: ["sauron-api", "sauron-core"],
      risk: "Alto",
    },
    {
      id: "sauron-core",
      label: "Sauron.Core",
      type: "sauron",
      x: 500,
      y: 200,
      connections: ["sauron-domain"],
      risk: "Alto",
    },
    {
      id: "sauron-app",
      label: "Sauron.Application",
      type: "sauron",
      x: 300,
      y: 200,
      connections: ["sauron-core"],
      risk: "Alto",
    },
    {
      id: "sauron-domain",
      label: "Sauron.Dominio",
      type: "sauron",
      x: 500,
      y: 100,
      connections: [],
      risk: "Alto",
    },
    {
      id: "sauron-infra",
      label: "Sauron.Infra",
      type: "sauron",
      x: 700,
      y: 200,
      connections: ["sauron-core"],
      risk: "Alto",
    },

    // Connected applications
    {
      id: "app-protocolo",
      label: "sistema-protocolo",
      type: "app",
      x: 200,
      y: 400,
      connections: ["sauron-auth"],
      risk: "Baixo",
      status: "90%",
    },
    {
      id: "app-financeiro",
      label: "sistema-financeiro",
      type: "app",
      x: 350,
      y: 450,
      connections: ["sauron-auth"],
      risk: "Baixo",
      status: "95%",
    },
    {
      id: "app-educacao",
      label: "gestao-educacao",
      type: "app",
      x: 500,
      y: 500,
      connections: ["sauron-api"],
      risk: "Médio",
      status: "75%",
    },
    {
      id: "app-ouvidoria",
      label: "sistema-ouvidoria",
      type: "app",
      x: 650,
      y: 450,
      connections: ["sauron-auth"],
      risk: "Baixo",
      status: "80%",
    },
    {
      id: "app-cidadao",
      label: "portal-cidadao",
      type: "app",
      x: 800,
      y: 400,
      connections: ["sauron-api"],
      risk: "Médio",
      status: "60%",
    },

    // Critical dependencies
    {
      id: "dep-bouncycastle",
      label: "BouncyCastle",
      type: "dependency",
      x: 850,
      y: 250,
      connections: ["sauron-infra"],
      risk: "Crítico",
    },
    {
      id: "dep-ldap",
      label: "Novell.LDAP",
      type: "dependency",
      x: 850,
      y: 150,
      connections: ["sauron-infra"],
      risk: "Alto",
    },
    {
      id: "dep-restsharp",
      label: "RestSharp",
      type: "dependency",
      x: 750,
      y: 100,
      connections: ["sauron-infra"],
      risk: "Alto",
    },

    // Migration targets
    {
      id: "migration-net8",
      label: ".NET 8 LTS",
      type: "migration",
      x: 400,
      y: 50,
      connections: ["sauron-core", "sauron-api"],
      status: "Planejado",
    },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.strokeStyle = "rgba(147, 117, 254, 0.2)";
      ctx.lineWidth = 1;
      nodes.forEach((node) => {
        node.connections.forEach((targetId) => {
          const target = nodes.find((n) => n.id === targetId);
          if (target) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach((node) => {
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode?.id === node.id;

        // Node glow effect
        if (isHovered || isSelected) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = getNodeColor(node.type);
        } else {
          ctx.shadowBlur = 5;
          ctx.shadowColor = getNodeColor(node.type);
        }

        // Draw node circle
        ctx.beginPath();
        ctx.arc(
          node.x,
          node.y,
          isHovered || isSelected ? 10 : 8,
          0,
          Math.PI * 2
        );
        ctx.fillStyle = getNodeColor(node.type);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw node label
        if (isHovered || isSelected) {
          ctx.font = "12px Geist";
          ctx.fillStyle = "#ffffff";
          ctx.textAlign = "center";
          ctx.fillText(node.label, node.x, node.y - 15);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const hovered = nodes.find((node) => {
        const dx = x - node.x;
        const dy = y - node.y;
        return Math.sqrt(dx * dx + dy * dy) < 10;
      });

      setHoveredNode(hovered || null);
      canvas.style.cursor = hovered ? "pointer" : "default";
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const clicked = nodes.find((node) => {
        const dx = x - node.x;
        const dy = y - node.y;
        return Math.sqrt(dx * dx + dy * dy) < 10;
      });

      setSelectedNode(clicked || null);
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, [nodes, hoveredNode, selectedNode]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case "sauron":
        return "#9375fe";
      case "app":
        return "#3dd68c";
      case "dependency":
        return "#f43f5e";
      case "migration":
        return "#fbbf24";
      default:
        return "#6b7280";
    }
  };

  const getRiskBadge = (risk?: string) => {
    if (!risk) return null;

    switch (risk) {
      case "Crítico":
        return <Badge variant="destructive">Crítico</Badge>;
      case "Alto":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600">Alto</Badge>
        );
      case "Médio":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">Médio</Badge>
        );
      case "Baixo":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">Baixo</Badge>
        );
      default:
        return <Badge variant="outline">{risk}</Badge>;
    }
  };

  return (
    <Card
      className={`relative overflow-hidden ${
        isFullscreen ? "fixed inset-4 z-50" : ""
      }`}
    >
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <div className="flex items-center gap-2 rounded-lg bg-card/95 backdrop-blur-sm p-3 border">
          <Network className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-semibold">Mapa de Conexões Imersivo</p>
            <p className="text-xs text-muted-foreground">
              {nodes.length} nós • Tempo real
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="rounded-lg bg-card/95 backdrop-blur-sm p-3 border space-y-2">
          <p className="text-xs font-semibold mb-2">Legenda</p>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: "#9375fe" }}
            />
            <span className="text-xs">Módulos SAURON</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: "#3dd68c" }}
            />
            <span className="text-xs">Aplicações</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: "#f43f5e" }}
            />
            <span className="text-xs">Dependências</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: "#fbbf24" }}
            />
            <span className="text-xs">Migrações</span>
          </div>
        </div>

        {/* Selected Node Info */}
        {selectedNode && (
          <div className="rounded-lg bg-card/95 backdrop-blur-sm p-3 border space-y-2 max-w-xs">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {selectedNode.label}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {selectedNode.type}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => setSelectedNode(null)}
              >
                ×
              </Button>
            </div>
            {selectedNode.risk && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Risco:</span>
                {getRiskBadge(selectedNode.risk)}
              </div>
            )}
            {selectedNode.status && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Status:</span>
                <Badge variant="outline">{selectedNode.status}</Badge>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              {selectedNode.connections.length} conexões
            </div>
          </div>
        )}
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-card/95 backdrop-blur-sm"
          onClick={() => window.location.reload()}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="bg-card/95 backdrop-blur-sm"
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      </div>

      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        className="w-full h-[600px] bg-background/50"
      />
    </Card>
  );
}
