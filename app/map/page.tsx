"use client";

import { DashboardHeader } from "@/components/dashboard-header";
import { ApplicationsMap3D } from "@/components/applications-map-3d";

export default function MapPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-primary">
            Mapa 3D Imersivo
          </h1>
          <p className="text-muted-foreground mt-2">
            Visualização tridimensional interativa de todas as{" "}
            <span className="font-semibold text-primary">293 aplicações</span>{" "}
            do Governo de Rondônia
          </p>
        </div>

        <ApplicationsMap3D />
      </main>
    </div>
  );
}
