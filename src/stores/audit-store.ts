import { create } from "zustand";

export type AuditEventAction =
  | "criação"
  | "edição"
  | "exclusão"
  | "outros";

export type AuditEventModule =
  | "projects"
  | "forms"
  | "users"
  | "profiles"
  | "system";

export interface AuditEvent {
  id: string;
  userId: string;
  userName: string;
  action: AuditEventAction;
  module: AuditEventModule;
  entityId: string;
  entityName: string;
  timestamp: string;
  details?: string;
}

type AuditStore = {
  events: AuditEvent[];
  addEvent: (event: Omit<AuditEvent, "id" | "timestamp">) => void;
};

export const useAuditStore = create<AuditStore>((set) => ({
  events: (() => {
    const saved = localStorage.getItem("audit-events");
    if (!saved) return [];

    try {
      return JSON.parse(saved) as AuditEvent[];
    } catch {
      return [];
    }
  })(),
  addEvent: (event) => {
    const newEvent: AuditEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };

    set((state) => {
      const events = [newEvent, ...state.events];
      localStorage.setItem("audit-events", JSON.stringify(events));
      return { events };
    });
  },
}));
