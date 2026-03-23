import { createContext, useContext, useState } from "react";
import { getCookie, setCookie } from "@/lib/cookies";
import type { MapViewMode } from "@/features/forms/components/form-builder/heatmap";

const COOKIE_NAME = "form_view_preferences";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

interface ViewPreferences {
  // can be: "bar-view" | "pie-view" | "line-view" | "radar-view"
  chartTabs: Record<string, string>;
  // can de: "heatmap" | "pins" | "highlight"
  mapModes: Record<string, MapViewMode>;
}

interface ResponseContextValue {
  chartTabs: Record<string, string>;
  mapModes: Record<string, MapViewMode>;
  saveChartTab: (questionId: string, tab: string) => void;
  saveMapMode: (questionId: string, mode: MapViewMode) => void;
}

const ResponseContext = createContext<ResponseContextValue | null>(null);

function loadPreferences(): ViewPreferences {
  try {
    const raw = getCookie(COOKIE_NAME);
    if (raw) return JSON.parse(decodeURIComponent(raw));
  } catch {
    // ignore malformed cookie
  }
  return { chartTabs: {}, mapModes: {} };
}

function persistPreferences(prefs: ViewPreferences) {
  setCookie(
    COOKIE_NAME,
    encodeURIComponent(JSON.stringify(prefs)),
    COOKIE_MAX_AGE,
  );
}

export function ResponseProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<ViewPreferences>(loadPreferences);

  const saveChartTab = (questionId: string, tab: string) => {
    setPrefs((prev) => {
      const next = {
        ...prev,
        chartTabs: { ...prev.chartTabs, [questionId]: tab },
      };
      persistPreferences(next);
      return next;
    });
  };

  const saveMapMode = (questionId: string, mode: MapViewMode) => {
    setPrefs((prev) => {
      const next = {
        ...prev,
        mapModes: { ...prev.mapModes, [questionId]: mode },
      };
      persistPreferences(next);
      return next;
    });
  };

  return (
    <ResponseContext.Provider
      value={{
        chartTabs: prefs.chartTabs,
        mapModes: prefs.mapModes,
        saveChartTab,
        saveMapMode,
      }}
    >
      {children}
    </ResponseContext.Provider>
  );
}

export function useResponsePreferences() {
  const ctx = useContext(ResponseContext);
  if (!ctx) {
    throw new Error(
      "useResponsePreferences must be used inside ResponseProvider",
    );
  }
  return ctx;
}
