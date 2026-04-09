import { useState, useCallback } from "react";
import * as L from "leaflet";
import { toast } from "sonner";
import {
  type CollectionRoute,
  type RouteWaypoint,
  collectionRoutes as routesMock,
} from "../../data/routes-mock";
import { forms } from "@/features/forms/data/forms-mock";
import { projects as allProjectsMock } from "../../data/projects-mock";

export type ViewMode = "list" | "create" | "detail";

// can be other location to view or will based on user location
const DEFAULT_CENTER: [number, number] = [-2.4491, -54.7432];

export function useRoutesState(projectId?: string) {
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

  const [routeName, setRouteName] = useState("");
  const [routeDescription, setRouteDescription] = useState("");
  const [routeProjectId, setRouteProjectId] = useState(projectId ?? "");
  const [waypoints, setWaypoints] = useState<RouteWaypoint[]>([]);
  const [isAddingPoint, setIsAddingPoint] = useState(false);
  const [selectedFormIds, setSelectedFormIds] = useState<string[]>([]);
  const [editingWaypointIndex, setEditingWaypointIndex] = useState<
    number | null
  >(null);
  const [editingLabel, setEditingLabel] = useState("");
  const [editingRouteId, setEditingRouteId] = useState<string | null>(null);

  // derived values
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

  const mapWaypoints =
    viewMode === "create"
      ? waypoints
      : viewMode === "detail" && selectedRoute
        ? selectedRoute.waypoints
        : [];

  const mapCenter: [number, number] =
    mapWaypoints.length > 0
      ? [mapWaypoints[0].lat, mapWaypoints[0].lng]
      : DEFAULT_CENTER;

  // navigation helpers
  const startCreate = () => {
    setRouteName("");
    setRouteDescription("");
    setRouteProjectId(projectId ?? "");
    setWaypoints([]);
    setIsAddingPoint(false);
    setSelectedFormIds([]);
    setEditingRouteId(null);
    setViewMode("create");
  };

  const startEdit = (route: CollectionRoute) => {
    setRouteName(route.name);
    setRouteDescription(route.description ?? "");
    setRouteProjectId(route.projectId);
    setWaypoints([...route.waypoints]);
    setIsAddingPoint(false);
    setSelectedFormIds([...route.formIds]);
    setEditingRouteId(route.id);
    setEditingWaypointIndex(null);
    setEditingLabel("");
    setViewMode("create");
  };

  const goToDetail = (route: CollectionRoute) => {
    setSelectedRoute(route);
    setViewMode("detail");
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

  // waypoint(wp) handlers
  const handleAddWaypoint = useCallback((latlng: L.LatLng) => {
    setWaypoints((prev) => [...prev, { lat: latlng.lat, lng: latlng.lng }]);
    setIsAddingPoint(false);
  }, []);

  const handleRemoveWaypoint = (index: number) => {
    setWaypoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveLabel = (index: number) => {
    setWaypoints((prev) =>
      prev.map((w, i) => (i === index ? { ...w, label: editingLabel } : w)),
    );
    setEditingWaypointIndex(null);
    setEditingLabel("");
  };

  // route crud
  const toggleForm = (formId: string) => {
    setSelectedFormIds((prev) =>
      prev.includes(formId)
        ? prev.filter((id) => id !== formId)
        : [...prev, formId],
    );
  };

  const handleSaveRoute = () => {
    if (!routeName.trim()) {
      toast.error("Informe um nome para a rota.");
      return;
    }
    if (!routeProjectId) {
      toast.error("Selecione um projeto para a rota.");
      return;
    }
    if (waypoints.length < 2) {
      toast.error("Adicione pelo menos 2 pontos na rota.");
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
          waypoints,
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
      waypoints,
      formIds: selectedFormIds,
      createdAt: new Date().toISOString().split("T")[0],
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
    // general data
    allProjects: allProjectsMock,
    availableForms,
    visibleRoutes,
    mapWaypoints,
    mapCenter,
    // view states
    viewMode,
    selectedRoute,
    projectFilter,
    // form states
    routeName,
    routeDescription,
    routeProjectId,
    waypoints,
    isAddingPoint,
    selectedFormIds,
    editingWaypointIndex,
    editingLabel,
    editingRouteId,
    // setters
    setProjectFilter,
    setRouteName,
    setRouteDescription,
    setRouteProjectId,
    setIsAddingPoint,
    setEditingWaypointIndex,
    setEditingLabel,
    // navigation
    startCreate,
    startEdit,
    goToDetail,
    goToList,
    goBackFromCreate,
    // handlers
    handleAddWaypoint,
    handleRemoveWaypoint,
    handleSaveLabel,
    toggleForm,
    handleSaveRoute,
    handleDeleteRoute,
  };
}

export type RoutesState = ReturnType<typeof useRoutesState>;
