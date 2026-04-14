import { useState, useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  type CollectionRoute,
  type RouteExecution,
  type RouteWaypoint,
  collectionRoutes as routesMock,
} from "../../data/routes-mock";
import { forms } from "@/features/forms/data/forms-mock";
import { projects as allProjectsMock } from "../../data/projects-mock";
import { useLiabilitiesStore } from "@/stores/passives-store";
import { users } from "@/features/users/data/users";

export type ViewMode = "list" | "create" | "detail" | "execution";

const DEFAULT_CENTER: [number, number] = [-2.4491, -54.7432];

export function useRoutesState(projectId?: string) {
  const { liabilities } = useLiabilitiesStore();

  const [routes, setRoutes] = useState<CollectionRoute[]>(() =>
    projectId
      ? routesMock.filter((r) => r.projectId === projectId)
      : [...routesMock],
  );
  const [projectFilter, setProjectFilter] = useState<string>(
    projectId ?? "all",
  );
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedRoute, setSelectedRoute] = useState<CollectionRoute | null>(
    null,
  );
  const [selectedExecution, setSelectedExecution] =
    useState<RouteExecution | null>(null);

  // create/edit form state
  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [routeProjectId, setRouteProjectId] = useState(projectId ?? "");
  const [selectedPassiveIds, setSelectedPassiveIds] = useState<string[]>([]);
  const [selectedCollectorIds, setSelectedCollectorIds] = useState<string[]>(
    [],
  );
  const [selectedFormIds, setSelectedFormIds] = useState<string[]>([]);
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);

  // ─── derived values ────────────────────────────────────────────────────────

  const syncRoutes = () =>
    setRoutes(
      projectId
        ? routesMock.filter((r) => r.projectId === projectId)
        : [...routesMock],
    );

  const visibleRoutes =
    projectId || projectFilter === "all"
      ? routes
      : routes.filter((r) => r.projectId === projectFilter);

  const availableForms = routeProjectId
    ? forms.filter((f) => f.projectId === routeProjectId)
    : [];

  const availableCollectors = useMemo(() => {
    const pid =
      viewMode === "create"
        ? routeProjectId
        : (selectedRoute?.projectId ?? projectId);
    if (!pid) return [];
    const project = allProjectsMock.find((p) => p.id === pid);
    if (!project) return [];
    return users
      .filter((u) => {
        const projectRole = project.memberRoles?.[u.id];
        const displayRole = projectRole ?? u.roles[0];
        return project.members.includes(u.id) && displayRole === "collector";
      })
      .map((u) => ({ id: u.id, label: `${u.firstName} ${u.lastName}` }));
  }, [viewMode, routeProjectId, selectedRoute, projectId]);

  const availablePassives = liabilities.filter(
    (l) => l.lat != null && l.lng != null,
  );

  const resolveWaypoints = useCallback(
    (ids: string[]): RouteWaypoint[] =>
      ids
        .map((id) => {
          const p = liabilities.find((l) => l.id === id);
          if (!p || p.lat == null || p.lng == null) return null;
          return { lat: p.lat, lng: p.lng, label: p.nome } as RouteWaypoint;
        })
        .filter(Boolean) as RouteWaypoint[],
    [liabilities],
  );

  const mapWaypoints: RouteWaypoint[] =
    viewMode === "create"
      ? resolveWaypoints(selectedPassiveIds)
      : (viewMode === "detail" || viewMode === "execution") && selectedRoute
        ? selectedRoute.passiveIds.length > 0
          ? resolveWaypoints(selectedRoute.passiveIds)
          : (selectedRoute.waypoints ?? [])
        : [];

  const mapCenter: [number, number] =
    mapWaypoints.length > 0
      ? [mapWaypoints[0].lat, mapWaypoints[0].lng]
      : DEFAULT_CENTER;

  // ─── navigation ────────────────────────────────────────────────────────────

  const startCreate = () => {
    setRouteName("");
    setRouteDescription("");
    setRouteProjectId(projectId ?? "");
    setSelectedPassiveIds([]);
    setSelectedCollectorIds([]);
    setSelectedFormIds([]);
    setEditingRouteId(null);
    setViewMode("create");
  };

  const startEdit = (route: CollectionRoute) => {
    setRouteName(route.name);
    setRouteDescription(route.description ?? "");
    setRouteProjectId(route.projectId);
    setSelectedPassiveIds([...(route.passiveIds ?? [])]);
    setSelectedCollectorIds([...(route.collectorIds ?? [])]);
    setSelectedFormIds([...route.formIds]);
    setEditingRouteId(route.id);
    setViewMode("create");
  };

  const goToDetail = (route: CollectionRoute) => {
    setSelectedRoute(route);
    setViewMode("detail");
  };

  const goToExecution = (execution: RouteExecution) => {
    setSelectedExecution(execution);
    setViewMode("execution");
  };

  const goToList = () => {
    setSelectedRoute(null);
    setViewMode("list");
  };

  const goBackFromCreate = () => {
    const wasEditing = !!editingRouteId;
    setEditingRouteId(null);
    setViewMode(wasEditing ? "detail" : "list");
  };

  const goBackFromExecution = () => {
    setSelectedExecution(null);
    setViewMode("detail");
  };

  // ─── passive handlers ──────────────────────────────────────────────────────

  const togglePassive = (passiveId: string) => {
    setSelectedPassiveIds((prev) =>
      prev.includes(passiveId)
        ? prev.filter((id) => id !== passiveId)
        : [...prev, passiveId],
    );
  };

  const movePassiveUp = (index: number) => {
    if (index === 0) return;
    setSelectedPassiveIds((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const movePassiveDown = (index: number) => {
    setSelectedPassiveIds((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const removePassiveFromRoute = (passiveId: string) => {
    setSelectedPassiveIds((prev) => prev.filter((id) => id !== passiveId));
  };

  // ─── collector handlers ────────────────────────────────────────────────────

  const toggleCollector = (collectorId: string) => {
    setSelectedCollectorIds((prev) =>
      prev.includes(collectorId)
        ? prev.filter((id) => id !== collectorId)
        : [...prev, collectorId],
    );
  };

  // ─── form handlers ─────────────────────────────────────────────────────────

  const toggleForm = (formId: string) => {
    setSelectedFormIds((prev) =>
      prev.includes(formId)
        ? prev.filter((id) => id !== formId)
        : [...prev, formId],
    );
  };

  // ─── route CRUD ────────────────────────────────────────────────────────────

  const handleSaveRoute = () => {
    if (!routeName.trim()) {
      toast.error("Informe um nome para a rota.");
      return;
    }
    if (!routeProjectId) {
      toast.error("Selecione um projeto para a rota.");
      return;
    }
    if (selectedPassiveIds.length < 2) {
      toast.error("Selecione pelo menos 2 passivos para a rota.");
      return;
    }

    if (editingRouteId) {
      const idx = routesMock.findIndex((r) => r.id === editingRouteId);
      if (idx !== -1) {
        routesMock[idx] = {
          ...routesMock[idx],
          name: routeName.trim(),
          description: routeDescription.trim() || undefined,
          projectId: routeProjectId,
          passiveIds: selectedPassiveIds,
          collectorIds: selectedCollectorIds,
          formIds: selectedFormIds,
        };
      }
      syncRoutes();
      const updated = routesMock.find((r) => r.id === editingRouteId);
      if (updated) setSelectedRoute(updated);
      toast.success("Rota atualizada com sucesso!");
      setEditingRouteId(null);
      setViewMode("detail");
      return;
    }

    const newRoute: CollectionRoute = {
      id: `route-${Date.now()}`,
      name: routeName.trim(),
      description: routeDescription.trim() || undefined,
      projectId: routeProjectId,
      passiveIds: selectedPassiveIds,
      collectorIds: selectedCollectorIds,
      formIds: selectedFormIds,
      createdAt: new Date().toISOString().split("T")[0],
      executions: [],
    };
    routesMock.push(newRoute);
    syncRoutes();
    toast.success("Rota cadastrada com sucesso!");
    setViewMode("list");
  };

  const handleDeleteRoute = (routeId: string) => {
    const idx = routesMock.findIndex((r) => r.id === routeId);
    if (idx !== -1) routesMock.splice(idx, 1);
    syncRoutes();
    toast.success("Rota removida.");
    if (selectedRoute?.id === routeId) {
      setSelectedRoute(null);
      setViewMode("list");
    }
  };

  return {
    allProjects: allProjectsMock,
    availableForms,
    availablePassives,
    availableCollectors,
    visibleRoutes,
    mapWaypoints,
    mapCenter,
    resolveWaypoints,
    viewMode,
    selectedRoute,
    selectedExecution,
    projectFilter,
    routeName,
    routeDescription,
    routeProjectId,
    selectedPassiveIds,
    selectedCollectorIds,
    selectedFormIds,
    editingRouteId,
    setProjectFilter,
    setRouteName,
    setRouteDescription,
    setRouteProjectId,
    startCreate,
    startEdit,
    goToDetail,
    goToList,
    goBackFromCreate,
    goToExecution,
    goBackFromExecution,
    togglePassive,
    movePassiveUp,
    movePassiveDown,
    removePassiveFromRoute,
    toggleCollector,
    toggleForm,
    handleSaveRoute,
    handleDeleteRoute,
  };
}

export type RoutesState = ReturnType<typeof useRoutesState>;
