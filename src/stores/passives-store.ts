import { create } from "zustand";
import type {
  Liability,
  RecentEvent,
  LiabilityStats,
} from "@/features/passives/data/schema";
import { liabilities } from "@/features/passives/data/passives";

interface LiabilitiesStore {
  liabilities: Liability[];
  eventos: RecentEvent[];
  setLiabilities: (liabilities: Liability[]) => void;
  addLiability: (liability: Liability) => void;
  updateLiability: (id: string, liability: Partial<Liability>) => void;
  deleteLiability: (id: string) => void;
  addEvent: (event: RecentEvent) => void;
  getStats: () => LiabilityStats;
}

export const useLiabilitiesStore = create<LiabilitiesStore>((set, get) => ({
  liabilities: liabilities,
  eventos: [],

  setLiabilities: (liabilities) => set({ liabilities }),

  addLiability: (liability) =>
    set((state) => {
      return {
        liabilities: [liability, ...state.liabilities],
        eventos: [
          {
            id: `evento-${Date.now()}`,
            tipo: "status" as const,
            descricao: `Novo passivo criado: ${liability.nome}`,
            data: new Date().toISOString(),
            usuario: "Sistema",
          },
          ...state.eventos,
        ],
      };
    }),

  updateLiability: (id, updates) =>
    set((state) => ({
      liabilities: state.liabilities.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    })),

  deleteLiability: (id) =>
    set((state) => ({
      liabilities: state.liabilities.filter((p) => p.id !== id),
    })),

  addEvent: (event) =>
    set((state) => ({
      eventos: [event, ...state.eventos],
    })),

  getStats: () => {
    const { liabilities } = get();
    const total = liabilities.length;
    const ativos = liabilities.filter((p) => p.status === "Ativo").length;
    const inativos = liabilities.filter((p) => p.status === "Inativo").length;
    const indisponiveis = liabilities.filter(
      (p) => p.status === "Indisponível",
    ).length;
    const comResponsavel = liabilities.filter(
      (p) => p.responsavel && p.responsavel.trim() !== "",
    ).length;
    const comEvidencias = liabilities.filter(
      (p) => p.documentos.length > 0,
    ).length;

    return {
      total,
      ativos,
      inativos,
      indisponiveis,
      comEvidencias,
      comResponsavel,
    };
  },
}));
