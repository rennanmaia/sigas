import { useRef, useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import * as L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import { Locate, Route as RouteIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { type RouteWaypoint } from "../../data/routes-mock";
import { type ViewMode } from "./use-routes-state";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DEFAULT_ZOOM = 13;

function makeNumberedIcon(index: number, isFirst: boolean, isLast: boolean) {
  const bg = isFirst ? "#22c55e" : isLast ? "#ef4444" : "#3b82f6";
  const svg = `
    <div style="
      background:${bg};color:white;width:28px;height:28px;
      border-radius:50% 50% 50% 0;transform:rotate(-45deg);
      display:flex;align-items:center;justify-content:center;
      border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,.35);
    ">
      <span style="transform:rotate(45deg);font-size:11px;font-weight:700;">${index + 1}</span>
    </div>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

function ResetViewButton({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  const centerRef = useRef(center);
  const zoomRef = useRef(zoom);

  useEffect(() => {
    centerRef.current = center;
  }, [center]);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    const LocateIcon = renderToStaticMarkup(
      <Locate size={16} strokeWidth={2} />,
    );

    const ResetControl = L.Control.extend({
      options: { position: "topleft" as L.ControlPosition },
      onAdd() {
        const btn = L.DomUtil.create("button");
        btn.innerHTML = LocateIcon;
        btn.title = "Centralizar mapa";
        btn.style.cssText = [
          "display:flex",
          "align-items:center",
          "justify-content:center",
          "width:30px",
          "height:30px",
          "background:white",
          "border:2px solid rgba(0,0,0,0.3)",
          "border-radius:4px",
          "cursor:pointer",
          "margin-top:10px",
          "margin-left:10px",
          "color:#333",
        ].join(";");
        L.DomEvent.on(btn, "click", (e) => {
          L.DomEvent.stopPropagation(e);
          map.flyTo(centerRef.current, zoomRef.current, { duration: 0.8 });
        });
        L.DomEvent.disableClickPropagation(btn);
        return btn;
      },
    });

    const control = new ResetControl();
    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map]);

  return null;
}

function FitBoundsToWaypoints({ waypoints }: { waypoints: RouteWaypoint[] }) {
  const map = useMap();
  const prev = useRef<string>("");

  useEffect(() => {
    if (waypoints.length < 2) return;
    const key = waypoints.map((w) => `${w.lat},${w.lng}`).join("|");
    if (key === prev.current) return;
    prev.current = key;
    const bounds = L.latLngBounds(waypoints.map((w) => [w.lat, w.lng]));
    map.fitBounds(bounds, { padding: [40, 40], duration: 0.6 });
  }, [waypoints, map]);

  return null;
}

interface RouteMapPanelProps {
  viewMode: ViewMode;
  visibleRoutes: { id: string }[];
  mapWaypoints: RouteWaypoint[];
  mapCenter: [number, number];
}

export function RouteMapPanel({
  viewMode,
  visibleRoutes,
  mapWaypoints,
  mapCenter,
}: RouteMapPanelProps) {
  return (
    <div className="lg:col-span-3 relative rounded-xl overflow-hidden border shadow-sm h-[300px] sm:h-[400px] lg:h-full">
      {viewMode === "list" && visibleRoutes.length === 0 && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-background/70 backdrop-blur-sm">
          <RouteIcon size={40} className="text-muted-foreground opacity-40" />
          <p className="text-sm text-muted-foreground">
            Crie uma rota para visualizar no mapa.
          </p>
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
        className={cn("h-full w-full")}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        <ResetViewButton center={mapCenter} zoom={DEFAULT_ZOOM} />
        <FitBoundsToWaypoints waypoints={mapWaypoints} />

        {mapWaypoints.length >= 2 && (
          <Polyline
            positions={mapWaypoints.map((w) => [w.lat, w.lng])}
            pathOptions={{ color: "#3b82f6", weight: 3, dashArray: "8 4" }}
          />
        )}

        {mapWaypoints.map((wp, i) => (
          <Marker
            key={i}
            position={[wp.lat, wp.lng]}
            icon={makeNumberedIcon(i, i === 0, i === mapWaypoints.length - 1)}
          >
            <Popup>
              <div className="text-xs space-y-0.5">
                <p className="font-semibold">{wp.label || `Ponto ${i + 1}`}</p>
                <p className="text-muted-foreground">
                  {wp.lat.toFixed(5)}, {wp.lng.toFixed(5)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
