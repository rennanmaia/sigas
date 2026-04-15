import { useRoutesState } from "./routes/use-routes-state";
import { RouteMapPanel } from "./routes/route-map-panel";
import { RouteListPanel } from "./routes/route-list-panel";
import { RouteCreatePanel } from "./routes/route-create-panel";
import { RouteDetailPanel } from "./routes/route-detail-panel";
import { RouteExecutionPanel } from "./routes/route-execution-panel";

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
            availablePassives={state.availablePassives}
            selectedPassiveIds={state.selectedPassiveIds}
            availableCollectors={state.availableCollectors}
            selectedCollectorIds={state.selectedCollectorIds}
            availableForms={state.availableForms}
            selectedFormIds={state.selectedFormIds}
            onProjectChange={state.setRouteProjectId}
            onNameChange={state.setRouteName}
            onDescriptionChange={state.setRouteDescription}
            onTogglePassive={state.togglePassive}
            onMovePassiveUp={state.movePassiveUp}
            onMovePassiveDown={state.movePassiveDown}
            onRemovePassive={state.removePassiveFromRoute}
            onToggleCollector={state.toggleCollector}
            onToggleForm={state.toggleForm}
            onReorderPassives={state.reorderPassives}
            onSave={state.handleSaveRoute}
            onBack={state.goBackFromCreate}
          />
        )}

        {state.viewMode === "detail" && state.selectedRoute && (
          <RouteDetailPanel
            projectId={projectId}
            selectedRoute={state.selectedRoute}
            allProjects={state.allProjects}
            availableCollectors={state.availableCollectors}
            onEdit={state.startEdit}
            onDelete={state.handleDeleteRoute}
            onBack={state.goToList}
            onViewExecution={state.goToExecution}
          />
        )}

        {state.viewMode === "execution" &&
          state.selectedRoute &&
          state.selectedExecution && (
            <RouteExecutionPanel
              selectedRoute={state.selectedRoute}
              execution={state.selectedExecution}
              onBack={state.goBackFromExecution}
            />
          )}
      </div>

      <RouteMapPanel
        viewMode={state.viewMode}
        visibleRoutes={state.visibleRoutes}
        mapWaypoints={state.mapWaypoints}
        mapCenter={state.mapCenter}
      />
    </div>
  );
}
