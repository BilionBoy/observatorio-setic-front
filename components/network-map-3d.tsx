"use client";

import { useRef, useMemo, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Html,
  Stars,
  PerspectiveCamera,
  Sphere,
} from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Maximize2,
  Minimize2,
  Search,
  Filter,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import * as THREE from "three";
import { Aplicacao, SauronModule } from "@/lib/api";

interface Node3D {
  id: string;
  name: string;
  type: "sauron" | "app" | "dependency" | "package";
  position: [number, number, number];
  connections: string[];
  data: any;
  risco?: string;
  criticidade?: string;
  prontidao?: number;
  impacto?: string;
}

interface NetworkMap3DProps {
  sauronModules: SauronModule[];
  applications: Aplicacao[];
  dependencies?: any[];
}

function generateGalaxyLayout(
  sauronModules: SauronModule[],
  applications: Aplicacao[],
  dependencies: any[] = []
): Node3D[] {
  const nodes: Node3D[] = [];

  // Core SAURON modules in center (like a star system core)
  sauronModules.forEach((module, index) => {
    const angle = (index / sauronModules.length) * Math.PI * 2;
    const radius = 8;
    const height = Math.sin(angle * 3) * 2;

    nodes.push({
      id: `sauron-${module.id}`,
      name: module.nome,
      type: "sauron",
      position: [Math.cos(angle) * radius, height, Math.sin(angle) * radius],
      connections: [],
      data: module,
      impacto: module.impacto,
    });
  });

  // Applications distributed in spiral arms (galaxy arms)
  applications.forEach((app, index) => {
    const spiralIndex = index / applications.length;
    const angle = spiralIndex * Math.PI * 8; // Multiple rotations
    const radius = 15 + spiralIndex * 25; // Expanding radius
    const armOffset = (index % 4) * (Math.PI / 2); // 4 spiral arms
    const finalAngle = angle + armOffset;

    // Random connected SAURON module
    const connectedSauron =
      sauronModules[Math.floor(Math.random() * sauronModules.length)];

    nodes.push({
      id: `app-${app.id}`,
      name: app.nome,
      type: "app",
      position: [
        Math.cos(finalAngle) * radius,
        (Math.random() - 0.5) * 10 + Math.sin(spiralIndex * Math.PI * 4) * 5,
        Math.sin(finalAngle) * radius,
      ],
      connections: [`sauron-${connectedSauron.id}`],
      data: app,
      risco: app.risco,
      prontidao: app.prontidao_migracao,
    });
  });

  // Package dependencies as smaller nodes clustered around apps
  const criticalPackages = [
    "Portable.BouncyCastle",
    "Novell.Directory.Ldap",
    "RestSharp",
    "Entity Framework",
    "IdentityServer4",
    "JWT",
    "Swagger",
  ];

  criticalPackages.forEach((pkg, index) => {
    const angle = (index / criticalPackages.length) * Math.PI * 2;
    const radius = 35;

    // Connect to random apps
    const connectedApps = applications
      .slice(index * 3, index * 3 + 3)
      .map((app) => `app-${app.id}`);

    nodes.push({
      id: `pkg-${index}`,
      name: pkg,
      type: "package",
      position: [
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 8,
        Math.sin(angle) * radius,
      ],
      connections: connectedApps,
      data: { nome: pkg, tipo: "package" },
      criticidade: index < 3 ? "high" : "medium",
    });
  });

  return nodes;
}

function Node3DComponent({
  node,
  isSelected,
  onSelect,
  isHighlighted,
}: {
  node: Node3D;
  isSelected: boolean;
  onSelect: () => void;
  isHighlighted: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { color, size, emissiveIntensity } = useMemo(() => {
    let baseColor = "#6b7280";
    let baseSize = 0.3;
    let intensity = 0.3;

    switch (node.type) {
      case "sauron":
        baseColor = "#8b5cf6"; // Purple
        baseSize = 0.8;
        intensity = 0.6;
        break;
      case "app":
        // Color by risk
        if (node.risco === "Alto") baseColor = "#ef4444"; // Red
        else if (node.risco === "Médio") baseColor = "#f59e0b"; // Amber
        else baseColor = "#10b981"; // Green
        baseSize = 0.4;
        intensity = 0.4;
        break;
      case "package":
        baseColor = node.criticidade === "high" ? "#ec4899" : "#06b6d4"; // Pink or Cyan
        baseSize = 0.25;
        intensity = 0.5;
        break;
    }

    return { color: baseColor, size: baseSize, emissiveIntensity: intensity };
  }, [node.type, node.risco, node.criticidade]);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();

      // Rotation
      meshRef.current.rotation.y += 0.005;

      // Scale animation
      const targetScale = hovered || isSelected ? 1.8 : isHighlighted ? 1.3 : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );

      // Pulse effect for critical nodes
      if (
        node.type === "sauron" ||
        node.criticidade === "high" ||
        node.risco === "Alto"
      ) {
        const pulse = 1 + Math.sin(time * 2) * 0.15;
        meshRef.current.scale.multiplyScalar(pulse);
      }
    }

    // Glow rotation
    if (glowRef.current) {
      glowRef.current.rotation.z += 0.02;
    }
  });

  return (
    <group position={node.position}>
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
      >
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered || isSelected ? 1 : emissiveIntensity}
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Glow ring */}
      <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[size * 1.2, size * 1.5, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={hovered || isSelected ? 0.8 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Particle ring for SAURON modules */}
      {node.type === "sauron" && (
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[size * 1.8, size * 2, 32]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.3}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Label on hover/select */}
      {(hovered || isSelected) && (
        <Html distanceFactor={15} center>
          <div className="bg-black/95 text-white px-4 py-3 rounded-lg border-2 border-purple-500/70 backdrop-blur-md shadow-2xl whitespace-nowrap pointer-events-none min-w-[200px]">
            <div className="font-bold text-sm mb-1 text-purple-300">
              {node.name}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary" className="text-xs capitalize">
                {node.type}
              </Badge>
              {node.risco && (
                <Badge
                  variant={node.risco === "Alto" ? "destructive" : "default"}
                  className="text-xs"
                >
                  {node.risco}
                </Badge>
              )}
            </div>
            {node.prontidao !== undefined && (
              <div className="text-xs text-gray-400">
                Prontidão: {node.prontidao.toFixed(1)}/100
              </div>
            )}
            {node.impacto && (
              <div className="text-xs text-gray-400">
                Impacto: {node.impacto}
              </div>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}

function ConnectionLine({
  start,
  end,
  active,
  critical,
}: {
  start: [number, number, number];
  end: [number, number, number];
  active: boolean;
  critical?: boolean;
}) {
  const lineRef = useRef<THREE.Line>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  const curve = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const midPoint = new THREE.Vector3().lerpVectors(startVec, endVec, 0.5);
    midPoint.y += Math.random() * 3 - 1.5; // Add some curve

    return new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
  }, [start, end]);

  const points = useMemo(() => curve.getPoints(50), [curve]);

  useFrame((state) => {
    if (materialRef.current) {
      const time = state.clock.getElapsedTime();
      // Pulsing effect
      const pulse = active ? 0.4 + Math.sin(time * 3) * 0.3 : 0.2;
      materialRef.current.opacity = pulse;
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        ref={materialRef}
        color={critical ? "#ec4899" : active ? "#8b5cf6" : "#4b5563"}
        transparent
        opacity={active ? 0.7 : 0.25}
        linewidth={critical ? 3 : 2}
      />
    </line>
  );
}

function CosmicParticles() {
  const count = 2000;
  const particlesRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0002;
      particlesRef.current.rotation.x += 0.0001;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Scene({
  nodes,
  selectedNode,
  onNodeSelect,
}: {
  nodes: Node3D[];
  selectedNode: string | null;
  onNodeSelect: (id: string) => void;
}) {
  const { camera } = useThree();

  // Calculate highlighted nodes (connected to selected)
  const highlightedNodes = useMemo(() => {
    if (!selectedNode) return new Set<string>();
    const node = nodes.find((n) => n.id === selectedNode);
    if (!node) return new Set<string>();
    return new Set([...node.connections, selectedNode]);
  }, [selectedNode, nodes]);

  return (
    <>
      <color attach="background" args={["#000000"]} />

      {/* Lighting setup for dramatic effect */}
      <ambientLight intensity={0.2} />
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        color="#8b5cf6"
        distance={50}
      />
      <pointLight position={[20, 20, 20]} intensity={1} color="#10b981" />
      <pointLight position={[-20, -20, -20]} intensity={0.8} color="#ef4444" />
      <spotLight
        position={[0, 50, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#8b5cf6"
        castShadow
      />

      {/* Cosmic background */}
      <Stars
        radius={150}
        depth={80}
        count={8000}
        factor={6}
        saturation={0}
        fade
        speed={0.5}
      />
      <CosmicParticles />

      {/* All nodes */}
      {nodes.map((node) => (
        <Node3DComponent
          key={node.id}
          node={node}
          isSelected={selectedNode === node.id}
          isHighlighted={highlightedNodes.has(node.id)}
          onSelect={() => onNodeSelect(node.id)}
        />
      ))}

      {/* Connection lines */}
      {nodes.flatMap((node) =>
        node.connections.map((connId) => {
          const targetNode = nodes.find((n) => n.id === connId);
          if (!targetNode) return null;

          const isActive = selectedNode === node.id || selectedNode === connId;
          const isCritical =
            node.criticidade === "high" || node.risco === "Alto";

          return (
            <ConnectionLine
              key={`${node.id}-${connId}`}
              start={node.position}
              end={targetNode.position}
              active={isActive}
              critical={isCritical}
            />
          );
        })
      )}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={10}
        maxDistance={100}
        autoRotate
        autoRotateSpeed={0.3}
        zoomSpeed={1.2}
      />
    </>
  );
}

export function NetworkMap3D({
  sauronModules,
  applications,
  dependencies = [],
}: NetworkMap3DProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nodes = useMemo(
    () => generateGalaxyLayout(sauronModules, applications, dependencies),
    [sauronModules, applications, dependencies]
  );

  // Filter nodes by search
  const filteredNodes = useMemo(() => {
    let filtered = nodes;

    if (searchQuery) {
      filtered = filtered.filter((node) =>
        node.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter((node) => node.type === filterType);
    }

    return filtered;
  }, [nodes, searchQuery, filterType]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Stats for legend
  const stats = useMemo(
    () => ({
      sauron: nodes.filter((n) => n.type === "sauron").length,
      apps: nodes.filter((n) => n.type === "app").length,
      packages: nodes.filter((n) => n.type === "package").length,
      connections: nodes.reduce((acc, n) => acc + n.connections.length, 0),
    }),
    [nodes]
  );

  return (
    <Card className="relative overflow-hidden bg-black border-purple-500/30 shadow-2xl">
      <div
        ref={containerRef}
        className={isFullscreen ? "w-screen h-screen" : "w-full h-[700px]"}
      >
        {/* Legend Panel */}
        <div className="absolute top-4 left-4 z-10 bg-black/90 backdrop-blur-md rounded-xl p-5 border-2 border-purple-500/40 shadow-2xl max-w-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50" />
            <h3 className="text-sm font-bold text-white">Galáxia SAURON</h3>
          </div>

          <div className="space-y-2 text-xs mb-4">
            <div className="flex items-center justify-between text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50" />
                <span>Módulos SAURON</span>
              </div>
              <span className="font-mono text-purple-400">{stats.sauron}</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gradient-to-r from-green-500 via-amber-500 to-red-500 rounded-full" />
                <span>Aplicações</span>
              </div>
              <span className="font-mono text-green-400">{stats.apps}</span>
            </div>
            <div className="flex items-center justify-between text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-500 rounded-full shadow-lg shadow-pink-500/50" />
                <span>Pacotes Críticos</span>
              </div>
              <span className="font-mono text-pink-400">{stats.packages}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-purple-500/30">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Conexões totais</span>
              <span className="font-mono text-purple-400">
                {stats.connections}
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span>Tempo real</span>
            </div>
          </div>

          {/* Quick filters */}
          <div className="mt-4 pt-3 border-t border-purple-500/30">
            <div className="text-xs text-gray-400 mb-2">Filtros</div>
            <div className="flex flex-wrap gap-1">
              {["sauron", "app", "package"].map((type) => (
                <Button
                  key={type}
                  size="sm"
                  variant={filterType === type ? "default" : "outline"}
                  className="text-xs h-6 px-2"
                  onClick={() =>
                    setFilterType(filterType === type ? null : type)
                  }
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <div className="bg-black/90 backdrop-blur-md rounded-lg p-2 border border-purple-500/40 flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-purple-500/20 hover:text-purple-400"
              onClick={() => setSelectedNode(null)}
              title="Reset selection"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 hover:bg-purple-500/20 hover:text-purple-400"
              onClick={toggleFullscreen}
              title="Toggle fullscreen"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Search */}
          <div className="bg-black/90 backdrop-blur-md rounded-lg p-2 border border-purple-500/40">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-7 text-xs bg-transparent border-0 focus-visible:ring-1 focus-visible:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Selected node details */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 right-4 z-10 bg-black/95 backdrop-blur-md rounded-xl p-4 border-2 border-purple-500/50 shadow-2xl max-w-md mx-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {(() => {
                  const node = nodes.find((n) => n.id === selectedNode);
                  if (!node) return null;

                  return (
                    <>
                      <div className="font-bold text-white mb-2">
                        {node.name}
                      </div>
                      <div className="flex gap-2 mb-3">
                        <Badge
                          variant="secondary"
                          className="text-xs capitalize"
                        >
                          {node.type}
                        </Badge>
                        {node.risco && (
                          <Badge
                            variant={
                              node.risco === "Alto" ? "destructive" : "default"
                            }
                            className="text-xs"
                          >
                            {node.risco}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 space-y-1">
                        {node.prontidao !== undefined && (
                          <div>Prontidão: {node.prontidao.toFixed(1)}/100</div>
                        )}
                        {node.impacto && <div>Impacto: {node.impacto}</div>}
                        <div>Conexões: {node.connections.length}</div>
                      </div>
                    </>
                  );
                })()}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        {/* 3D Canvas */}
        <Canvas camera={{ position: [0, 20, 50], fov: 60 }}>
          <Suspense fallback={null}>
            <Scene
              nodes={filteredNodes}
              selectedNode={selectedNode}
              onNodeSelect={setSelectedNode}
            />
          </Suspense>
        </Canvas>
      </div>
    </Card>
  );
}
