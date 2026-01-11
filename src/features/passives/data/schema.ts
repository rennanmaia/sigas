import { z } from "zod";

export const RiscoNivelEnum = z.enum(["Baixo", "Médio", "Alto", "Crítico"]);
export const ImpactoNivelEnum = z.enum(["Leve", "Moderado", "Significativo", "Severo"]);
export const PassivoTipoEnum = z.enum(["Ambiental", "Social"]);
export const StatusPlanoEnum = z.enum([
  "Não Definido", 
  "Em Planejamento", 
  "Em Execução", 
  "Atrasado", 
  "Concluído"
]);

export const Tendencia = z.enum(["subindo", "descendo", "estavel"]);      

export const passivoSchema = z.object({
  id: z.string().uuid({ message: "ID inválido" }),
  
  codigo: z.string().min(1, "Código identificador é obrigatório")
    .regex(/^PAS-(ENV|SOC)-\d+$/, "Formato de código inválido (Ex: PAS-ENV-001)"),
  
  nome: z.string().min(5, "O nome deve ter pelo menos 5 caracteres")
    .max(255, "Nome muito longo"),
  
  tipo: PassivoTipoEnum,
  
  categoria: z.string().min(2, "Categoria é obrigatória"),
  
  risco: RiscoNivelEnum,
  
  impactoAmbiental: ImpactoNivelEnum,
  
  impactoSocial: ImpactoNivelEnum,
  
  statusPlano: StatusPlanoEnum,
  
  dataIdentificacao: z.string().datetime({ message: "Data de identificação inválida" }),
  
  responsavel: z.string().min(2, "Nome do responsável é obrigatório"),
  
  proximaAcao: z.string().min(5, "Descreva a próxima ação prevista"),
  
  recorrente: z.boolean().default(false),
  
  auditado: z.boolean().default(false),
  
  naoConformidade: z.boolean().default(false),
  tendencia: Tendencia,
  recorrenciaContagem: z.number().min(0),
  ultimaAtualizacao: z.iso.datetime(),
  documentosAnexadas: z.number().min(0),
});

export const passivoListSchema = z.array(passivoSchema);

export type Passivo = z.infer<typeof passivoSchema>;
export type RiscoNivel = z.infer<typeof RiscoNivelEnum>;
export type ImpactoNivel = z.infer<typeof ImpactoNivelEnum>;
export type PassivoTipo = z.infer<typeof PassivoTipoEnum>;
export type StatusPlano = z.infer<typeof StatusPlanoEnum>;

export interface EventoRecente {
  id: string;
  tipo: 'status' | 'documento' | 'risco' | 'plano';
  descricao: string;
  data: string;
  usuario: string;
}

export type PassiveStats = {
  total: number;
  criticos: number;
  semPlano: number;
  comPlano: number;
  atrasados: number;
  ambiental: number;
  social: number;
  comResponsavel: number;
  comEvidencias: number;
}