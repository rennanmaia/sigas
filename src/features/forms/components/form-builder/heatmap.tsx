import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Locate } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

import * as L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const redPinSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="42" height="62">
  <path d="M12 0C7.589 0 4 3.589 4 8c0 5.535 7.154 16.323 7.46 16.77a.75.75 0 0 0 1.08 0C12.846 24.323 20 13.535 20 8c0-4.411-3.589-8-8-8z" fill="#ef4444" stroke="#b91c1c" stroke-width="1"/>
  <circle cx="12" cy="8" r="3" fill="white"/>
</svg>`;

const selectedIcon = L.divIcon({
  html: redPinSvg,
  className: "",
  iconSize: [42, 62],
  iconAnchor: [21, 62],
  popupAnchor: [0, -62],
});

const Leaflet = L as typeof L & {
  heatLayer: (
    latlngs: [number, number, number][],
    options?: Record<string, unknown>,
  ) => L.Layer;
};

export interface Point {
  lat: number;
  lng: number;
  label?: string;
}

export type MapViewMode = "heatmap" | "pins" | "highlight";

const HeatmapLayer = ({ points }: { points: Point[] }) => {
  const map = useMap();

  useEffect(() => {
    const heatData = points
      .filter((p) => p.lat !== undefined && p.lng !== undefined)
      .map((p) => [p.lat, p.lng, 1.0] as [number, number, number]);

    if (heatData.length === 0) return;

    const heatLayer = Leaflet.heatLayer(heatData, {
      radius: 35,
      blur: 20,
      max: 0.6,
      gradient: {
        0.2: "blue",
        0.4: "cyan",
        0.6: "lime",
        0.8: "yellow",
        1.0: "red",
      },
    });
    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [points, map]);

  return null;
};

const PinsLayer = ({
  points,
  selectedIndex,
}: {
  points: Point[];
  selectedIndex?: number;
}) => {
  return (
    <>
      {points.map((p, i) => {
        const isSelected = selectedIndex === i;
        return (
          <Marker
            key={i}
            position={[p.lat, p.lng]}
            icon={isSelected ? selectedIcon : new L.Icon.Default()}
          >
            {p.label && (
              <Popup>
                <span className="text-xs">{p.label}</span>
              </Popup>
            )}
          </Marker>
        );
      })}
    </>
  );
};

const ResetViewButton = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();

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
          map.flyTo(center, zoom, { duration: 0.8 });
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
  }, [map, center, zoom]);

  return null;
};

const FlyToPoint = ({ point }: { point: Point | null }) => {
  const map = useMap();
  useEffect(() => {
    if (point) {
      map.flyTo([point.lat, point.lng], Math.max(map.getZoom(), 14), {
        duration: 0.8,
      });
    }
  }, [point, map]);
  return null;
};

interface HeatmapMapProps {
  points: Point[];
  className?: string;
  mode?: MapViewMode;
  selectedIndex?: number;
}

export default function HeatMap({
  points,
  className,
  mode = "heatmap",
  selectedIndex,
}: HeatmapMapProps) {
  const validPoints = points.filter(
    (p) => p.lat !== undefined && p.lng !== undefined,
  );

  if (validPoints.length === 0) {
    return <div>Sem dados de localização válidos para mostrar no mapa.</div>;
  }

  const center: [number, number] = [validPoints[0].lat, validPoints[0].lng];
  const selectedPoint =
    selectedIndex !== undefined ? (validPoints[selectedIndex] ?? null) : null;

  return (
    <MapContainer
      center={center}
      zoom={16}
      style={{ height: "100%", width: "100%", minHeight: "200px" }}
      className={className}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {mode === "heatmap" && <HeatmapLayer points={validPoints} />}
      {(mode === "pins" || mode === "highlight") && (
        <PinsLayer
          points={validPoints}
          selectedIndex={mode === "pins" ? selectedIndex : undefined}
        />
      )}
      {mode === "pins" && <FlyToPoint point={selectedPoint} />}
      <ResetViewButton center={center} zoom={16} />
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
      />
    </MapContainer>
  );
}
