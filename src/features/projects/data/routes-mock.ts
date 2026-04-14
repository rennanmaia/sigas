import { users } from "@/features/users/data/users";
import { liabilities } from "@/features/passives/data/passives";

export interface RouteWaypoint {
  lat: number;
  lng: number;
  label?: string;
}

export interface FormApplicationRecord {
  formId: string;
  answeredAt: string;
}

export interface PassiveVisitRecord {
  passiveId: string;
  visitedAt: string;
  formApplications: FormApplicationRecord[];
}

export interface RouteExecution {
  id: string;
  collectorId: string;
  collectorName: string;
  startedAt: string;
  finishedAt?: string;
  status: "em_andamento" | "concluida" | "cancelada";
  visitedPassiveIds: string[];
  visitDetails?: PassiveVisitRecord[];
  notes?: string;
}

export interface CollectionRoute {
  id: string;
  name: string;
  description?: string;
  projectId: string;
  passiveIds: string[];
  collectorIds: string[];
  formIds: string[];
  createdAt: string;
  executions: RouteExecution[];
  waypoints?: RouteWaypoint[];
}

export const collectionRoutes: CollectionRoute[] = (() => {
  const activeCollectors = users.filter(
    (u) => u.status === "active" && u.roles.includes("collector"),
  );

  const locatedPassiveIds = liabilities
    .filter((l) => l.lat != null && l.lng != null)
    .slice(0, 4)
    .map((l) => l.id)
    .filter((id): id is string => id !== undefined);

  const collectorA = activeCollectors[0] ?? null;
  const collectorB = activeCollectors[1] ?? null;

  const nameOf = (u: (typeof users)[0] | null | undefined) =>
    u ? `${u.firstName} ${u.lastName}` : "Coletor";

  return [
    {
      id: "route-001",
      name: "Rota Ribeirinha Norte",
      description:
        "Percurso ao longo da margem norte do rio para coleta de dados de fauna aquática.",
      projectId: "proj-001",
      passiveIds: [],
      collectorIds: [],
      formIds: ["frm-1"],
      createdAt: "2025-11-01",
      executions: [],
      waypoints: [
        { lat: -2.4491, lng: -54.7432, label: "Ponto de Partida" },
        { lat: -2.4415, lng: -54.728, label: "Margem Norte P1" },
        { lat: -2.438, lng: -54.712, label: "Margem Norte P2" },
        { lat: -2.431, lng: -54.695, label: "Ponto Final" },
      ],
    },
    {
      id: "route-002",
      name: "Rota Zona Sul – Fauna Terrestre",
      description:
        "Monitoramento de mamíferos e répteis na zona sul do trecho de intervenção.",
      projectId: "proj-001",
      passiveIds: locatedPassiveIds,
      collectorIds: [collectorA?.id, collectorB?.id].filter(
        (id): id is string => !!id,
      ),
      formIds: ["frm-1", "frm-2"],
      createdAt: "2026-01-15",
      executions: [
        {
          id: "exec-001",
          collectorId: collectorA?.id ?? "",
          collectorName: nameOf(collectorA),
          startedAt: "2026-02-10T08:30:00.000Z",
          finishedAt: "2026-02-10T14:45:00.000Z",
          status: "concluida",
          visitedPassiveIds: locatedPassiveIds,
          visitDetails: locatedPassiveIds.map((id, i) => ({
            passiveId: id,
            visitedAt: new Date(
              new Date("2026-02-10T08:30:00.000Z").getTime() +
                (i + 1) * 75 * 60 * 1000,
            ).toISOString(),
            formApplications: [
              {
                formId: "frm-1",
                answeredAt: new Date(
                  new Date("2026-02-10T08:30:00.000Z").getTime() +
                    (i + 1) * 75 * 60 * 1000 +
                    8 * 60 * 1000,
                ).toISOString(),
              },
              ...(locatedPassiveIds.indexOf(id) % 2 === 0
                ? [
                    {
                      formId: "frm-2",
                      answeredAt: new Date(
                        new Date("2026-02-10T08:30:00.000Z").getTime() +
                          (i + 1) * 75 * 60 * 1000 +
                          20 * 60 * 1000,
                      ).toISOString(),
                    },
                  ]
                : []),
            ],
          })),
          notes:
            "Todos os pontos visitados com sucesso. Registradas 3 espécies de aves ameaçadas no ponto 2.",
        },
        {
          id: "exec-002",
          collectorId: collectorB?.id ?? collectorA?.id ?? "",
          collectorName: nameOf(collectorB ?? collectorA),
          startedAt: "2026-02-17T07:00:00.000Z",
          finishedAt: "2026-02-17T12:20:00.000Z",
          status: "concluida",
          visitedPassiveIds: locatedPassiveIds.slice(0, 3),
          visitDetails: locatedPassiveIds.slice(0, 3).map((id, i) => ({
            passiveId: id,
            visitedAt: new Date(
              new Date("2026-02-17T07:00:00.000Z").getTime() +
                (i + 1) * 65 * 60 * 1000,
            ).toISOString(),
            formApplications: [
              {
                formId: "frm-1",
                answeredAt: new Date(
                  new Date("2026-02-17T07:00:00.000Z").getTime() +
                    (i + 1) * 65 * 60 * 1000 +
                    10 * 60 * 1000,
                ).toISOString(),
              },
            ],
          })),
          notes:
            "Ponto 4 inacessível devido a alagamento na área. Demais pontos registrados normalmente.",
        },
        {
          id: "exec-003",
          collectorId: collectorA?.id ?? "",
          collectorName: nameOf(collectorA),
          startedAt: new Date().toISOString(),
          status: "em_andamento",
          visitedPassiveIds: locatedPassiveIds.slice(0, 1),
          visitDetails: locatedPassiveIds.slice(0, 1).map((id) => ({
            passiveId: id,
            visitedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
            formApplications: [
              {
                formId: "frm-1",
                answeredAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
              },
            ],
          })),
        },
      ],
    },
  ];
})();
