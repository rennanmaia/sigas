import { useRoutesState } from "./routes/use-routes-state";
import { RouteMapPanel } from "./routes/route-map-panel";
import { RouteListPanel } from "./routes/route-list-panel";
import { RouteCreatePanel } from "./routes/route-create-panel";
import { RouteDetailPanel } from "./routes/route-detail-panel";

interface RoutesTabProps {
  projectId?: string;
}

export function RoutesTab({ projectId }: RoutesTabProps) {
  const state = useRoutesState(projectId);

  return (
    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-5 lg:h-[calc(100vh-280px)]">
      <div className="lg:col-span-2 flex flex-col gap-3 lg:min-h-0">
        {state.viewMode === "list" && (
          <RouteListPanel
            projectId={projectId}
            visibleRoutes={state.visibleRoutes}
            selectedRoute={state.selectedRoute}
            projectFilter={state.projectFilter}
            allProjects={state.allProjects}
            onFilterChange={state.setProjectFilter}
            onSelectRoute={state.goToDetail}
            onCreateRoute={state.startCreate}
          />
        )}

        {state.viewMode === "create" && (
          <RouteCreatePanel
            projectId={projectId}
            editingRouteId={state.editingRouteId}
            allProjects={state.allProjects}
            routeProjectId={state.routeProjectId}
            routeName={state.routeName}
            routeDescription={state.routeDescription}
            waypoints={state.waypoints}
            isAddingPoint={state.isAddingPoint}
            availableForms={state.availableForms}
            selectedFormIds={state.selectedFormIds}
            editingWaypointIndex={state.editingWaypointIndex}
            editingLabel={state.editingLabel}
            onProjectChange={state.setRouteProjectId}
            onNameChange={state.setRouteName}
            onDescriptionChange={state.setRouteDescription}
            onToggleAddPoint={() => state.setIsAddingPoint((v) => !v)}
            onRemoveWaypoint={state.handleRemoveWaypoint}
            onStartEditWaypoint={(i) => {
              state.setEditingWaypointIndex(i);
              state.setEditingLabel(state.waypoints[i]?.label ?? "");
            }}
            onEditLabelChange={state.setEditingLabel}
            onSaveLabel={state.handleSaveLabel}
            onCancelEditWaypoint={() => {
              state.setEditingWaypointIndex(null);
              state.setEditingLabel("");
            }}
            onToggleForm={state.toggleForm}
            onSave={state.handleSaveRoute}
            onBack={state.goBackFromCreate}
          />
        )}

        {state.viewMode === "detail" && state.selectedRoute && (
          <RouteDetailPanel
            projectId={projectId}
            selectedRoute={state.selectedRoute}
            allProjects={state.allProjects}
            onEdit={state.startEdit}
            onDelete={state.handleDeleteRoute}
            onBack={state.goToList}
          />
        )}
      </div>

      <RouteMapPanel
        viewMode={state.viewMode}
        visibleRoutes={state.visibleRoutes}
        mapWaypoints={state.mapWaypoints}
        mapCenter={state.mapCenter}
        isAddingPoint={state.isAddingPoint}
        onAddWaypoint={state.handleAddWaypoint}
      />
    </div>
  );
}
