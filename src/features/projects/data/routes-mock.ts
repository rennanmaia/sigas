export interface RouteWaypoint {
  lat: number;
  lng: number;
  label?: string;
}

export interface CollectionRoute {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  waypoints: RouteWaypoint[];
  formIds: string[];
  createdAt: string;
}

export const collectionRoutes: CollectionRoute[] = [
  {
    id: "route-001",
    name: "Rota Ribeirinha Norte",
    description:
      "Percurso ao longo da margem norte do rio para coleta de dados de fauna aquática.",
    projectId: "proj-001",
    waypoints: [
      { lat: -2.4491, lng: -54.7432, label: "Ponto de Partida" },
      { lat: -2.4415, lng: -54.728, label: "Margem Norte P1" },
      { lat: -2.438, lng: -54.712, label: "Margem Norte P2" },
      { lat: -2.431, lng: -54.695, label: "Ponto Final" },
    ],
    formIds: ["frm-1"],
    createdAt: "2025-11-01",
  },
];
