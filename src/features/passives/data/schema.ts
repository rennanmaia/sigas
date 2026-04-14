import { z } from "zod";

export const PassiveStatusEnum = z.enum(["Ativo", "Inativo", "Indisponível"]);

export const LiabilitySchema = z.object({
  id: z.string().optional(),
  codigo: z
    .string()
    .min(1, "Código identificador é obrigatório")
    .regex(/^PAS-\d+$/, "Formato de código inválido (Ex: PAS-001)"),
  nome: z
    .string()
    .min(5, "O nome deve ter pelo menos 5 caracteres")
    .max(255, "Nome muito longo"),
  tipo: z.array(z.string()).max(3, "Máximo de 3 tags"),
  descricao: z.string().optional(),
  categoria: z.string().optional().default(""),
  status: PassiveStatusEnum,
  dataIdentificacao: z.iso.datetime({
    message: "Data de identificação inválida",
  }),
  responsavel: z.string().optional().default(""),

  auditado: z.boolean(),
  documentos: z.array(
    z.object({
      id: z.string(),
      nome: z.string(),
      tipo: z.enum(["evidencia", "plano", "auditoria", "outro"]),
    }),
  ),
  customFields: z
    .array(
      z.object({
        label: z.string().min(1, "Rótulo é obrigatório"),
        value: z.string().min(1, "Valor é obrigatório"),
      }),
    )
    .optional()
    .default([]),

  lat: z.number().optional(),
  lng: z.number().optional(),

  ultimaAtualizacao: z.iso.datetime(),
});

export const LiabilityListSchema = z.array(LiabilitySchema);

export type Liability = z.infer<typeof LiabilitySchema>;
export type PassiveStatus = z.infer<typeof PassiveStatusEnum>;

export interface RecentEvent {
  id: string;
  tipo: "status" | "documento" | "auditoria";
  descricao: string;
  data: string;
  usuario: string;
}

export interface LiabilityDocument {
  id: string;
  nome: string;
  tipo: "evidencia" | "plano" | "auditoria" | "outro";
  dataUpload: string;
  tamanho: number;
  url: string;
  upladoPor: string;
}

export interface LiabilityAudit {
  id: string;
  data: string;
  auditor: string;
  observacoes: string;
  conformidade: boolean;
  documentos: LiabilityDocument[];
}

export type LiabilityStats = {
  total: number;
  ativos: number;
  inativos: number;
  indisponiveis: number;
  comResponsavel: number;
  comEvidencias: number;
};
