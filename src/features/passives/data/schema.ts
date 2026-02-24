import { z } from "zod";

export const RiskLevelEnum = z.enum(["Baixo", "Médio", "Alto", "Crítico"]);
export const ImpactLevelEnum = z.enum(["Leve", "Moderado", "Significativo", "Severo"]);
export const LiabilityTypeEnum = z.enum(["Ambiental", "Social"]);
export const StatusPlanEnum = z.enum([
  "Não Definido", 
  "Em Planejamento", 
  "Em Execução", 
  "Atrasado", 
  "Concluído"
]);

export const Tendencia = z.enum(["subindo", "descendo", "estavel"]);      

export const LiabilitySchema = z.object({
  id: z.string().optional(),
  codigo: z.string().min(1, "Código identificador é obrigatório")
    .regex(/^PAS-(ENV|SOC)-\d+$/, "Formato de código inválido (Ex: PAS-ENV-001)"),
  nome: z.string().min(5, "O nome deve ter pelo menos 5 caracteres")
    .max(255, "Nome muito longo"),
  tipo: LiabilityTypeEnum,
  categoria: z.string().min(2, "Categoria é obrigatória"),
  dataIdentificacao: z.iso.datetime({ message: "Data de identificação inválida" }),
  responsavel: z.string().min(2, "Responsável é obrigatório"),
  
  
  risco: RiskLevelEnum,
  impactoAmbiental: ImpactLevelEnum,
  impactoSocial: ImpactLevelEnum,
  recorrente: z.boolean(),
  tendencia: Tendencia,
  naoConformidade: z.boolean(),
  recorrenciaContagem: z.number().min(0),
  
  
  proximaAcao: z.string().min(5, "Descreva a próxima ação prevista"),
  statusPlano: StatusPlanEnum,
  acoes: z.array(z.object({
    id: z.string(),
    descricao: z.string(),
    responsavel: z.string(),
    dataPrevista: z.string(),
    prioridade: z.enum(['baixa', 'média', 'alta', 'crítica']),
  })),
  
  
  auditado: z.boolean(),
  documentos: z.array(z.object({
    id: z.string(),
    nome: z.string(),
    tipo: z.enum(['evidencia', 'plano', 'auditoria', 'outro']),
  })),

  
  ultimaAtualizacao: z.iso.datetime(),
  // auditorias: z.array(z.any()).default([]),
});

export const LiabilityListSchema = z.array(LiabilitySchema);

export type Liability = z.infer<typeof LiabilitySchema>;
export type RiskLevel = z.infer<typeof RiskLevelEnum>;
export type ImpactLevel = z.infer<typeof ImpactLevelEnum>;
export type LiabilityType = z.infer<typeof LiabilityTypeEnum>;
export type StatusPlan = z.infer<typeof StatusPlanEnum>;

export interface RecentEvent {
  id: string;
  tipo: 'status' | 'documento' | 'risco' | 'plano' | 'auditoria';
  descricao: string;
  data: string;
  usuario: string;
}

export interface LiabilityDocument {
  id: string;
  nome: string;
  tipo: 'evidencia' | 'plano' | 'auditoria' | 'outro';
  dataUpload: string;
  tamanho: number;
  url: string;
  upladoPor: string;
}

export interface ActionPlan {
  id: string;
  descricao: string;
  responsavel: string;
  dataPrevista: string;
  dataEntrega?: string;
  status: 'pendente' | 'em-andamento' | 'concluida' | 'atrasada';
  prioridade: 'baixa' | 'média' | 'alta' | 'crítica';
  documentos: LiabilityDocument[];
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
  criticos: number;
  semPlano: number;
  comPlano: number;
  atrasados: number;
  ambiental: number;
  social: number;
  comResponsavel: number;
  comEvidencias: number;
  distribuicao: {
    critico: number;
    alto: number;
    medio: number;
    baixo: number;
  }
}