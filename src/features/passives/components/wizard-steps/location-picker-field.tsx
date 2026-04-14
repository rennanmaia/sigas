import { useEffect, useRef } from "react";
import { useController, type Control } from "react-hook-form";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import * as L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import {
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";
import type { Liability } from "../../data/schema";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const DEFAULT_CENTER: [number, number] = [-2.4491, -54.7432];
const DEFAULT_ZOOM = 10;

function ClickToPlace({
  onPlace,
}: {
  onPlace: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click(e) {
      onPlace(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function FlyToCoords({ coords }: { coords: [number, number] | null }) {
  const map = useMap();
  const prevRef = useRef<[number, number] | null>(null);
  useEffect(() => {
    if (
      coords &&
      (!prevRef.current ||
        prevRef.current[0] !== coords[0] ||
        prevRef.current[1] !== coords[1])
    ) {
      map.flyTo(coords, Math.max(map.getZoom(), 13), { duration: 0.6 });
      prevRef.current = coords;
    }
  }, [coords, map]);
  return null;
}

interface LocationPickerFieldProps {
  control: Control<Liability>;
}

export function LocationPickerField({ control }: LocationPickerFieldProps) {
  const {
    field: latField,
    fieldState: { error: latError },
  } = useController({ control, name: "lat" });

  const {
    field: lngField,
    fieldState: { error: lngError },
  } = useController({ control, name: "lng" });

  const lat = typeof latField.value === "number" ? latField.value : null;
  const lng = typeof lngField.value === "number" ? lngField.value : null;
  const hasCoords = lat !== null && lng !== null;

  const handlePlace = (newLat: number, newLng: number) => {
    latField.onChange(parseFloat(newLat.toFixed(6)));
    lngField.onChange(parseFloat(newLng.toFixed(6)));
  };

  const handleClear = () => {
    latField.onChange(undefined);
    lngField.onChange(undefined);
  };

  const flyToCoords: [number, number] | null = hasCoords ? [lat!, lng!] : null;

  return (
    <FormItem>
      <div className="flex items-center justify-between">
        <FormLabel className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" /> Localização no Mapa
        </FormLabel>
        {hasCoords && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-muted-foreground"
            onClick={handleClear}
          >
            <X className="h-3 w-3" /> Limpar
          </Button>
        )}
      </div>
      <FormDescription>
        Clique no mapa para definir a localização do passivo, ou arraste o
        marcador após posicioná-lo.
      </FormDescription>

      <div className="rounded-md overflow-hidden border h-56 cursor-crosshair">
        <MapContainer
          center={hasCoords ? [lat!, lng!] : DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <ClickToPlace onPlace={handlePlace} />
          <FlyToCoords coords={flyToCoords} />
          {hasCoords && (
            <Marker
              position={[lat!, lng!]}
              draggable
              eventHandlers={{
                dragend(e) {
                  const pos = (e.target as L.Marker).getLatLng();
                  handlePlace(pos.lat, pos.lng);
                },
              }}
            />
          )}
        </MapContainer>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-2">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Latitude</label>
          <Input
            type="number"
            step="any"
            placeholder="-2.449100"
            value={lat ?? ""}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              latField.onChange(isNaN(v) ? undefined : v);
            }}
            className="h-8 text-xs"
          />
          {latError && (
            <p className="text-xs text-destructive">{latError.message}</p>
          )}
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Longitude</label>
          <Input
            type="number"
            step="any"
            placeholder="-54.743200"
            value={lng ?? ""}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              lngField.onChange(isNaN(v) ? undefined : v);
            }}
            className="h-8 text-xs"
          />
          {lngError && (
            <p className="text-xs text-destructive">{lngError.message}</p>
          )}
        </div>
      </div>

      <FormMessage />
    </FormItem>
  );
}
