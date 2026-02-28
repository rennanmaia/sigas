import { faker } from '@faker-js/faker';
import type { 
  Liability, 
  LiabilityType, 
  RiskLevel, 
  ImpactLevel, 
  StatusPlan 
} from './schema';
import { users } from '@/features/users/data/users';

// Configurações de domínio ESG para maior verossimilhança
export const ENVIROMENT_CATEGORIES = [
  'Recursos Hídricos', 'Biodiversidade', 'Emissões Atmosféricas', 
  'Resíduos Perigosos', 'Contaminação de Solo', 'Licenciamento'
];

export const SOCIAL_CATEGORIES = [
  'Direitos Humanos', 'Comunidades Tradicionais', 'Saúde e Segurança', 
  'Mão de Obra Terceirizada', 'Impacto de Vizinhança', 'Patrimônio Cultural'
];

export const RISKS: RiskLevel[] = ['Baixo', 'Médio', 'Alto', 'Crítico'];
export const IMPACTS: ImpactLevel[] = ['Leve', 'Moderado', 'Significativo', 'Severo'];
export const STATUS_PLANS: StatusPlan[] = ['Não Definido', 'Em Planejamento', 'Em Execução', 'Atrasado', 'Concluído'];

export function generateRandomLiablility(): Liability {
  const tipo = faker.helpers.arrayElement<LiabilityType>(['Ambiental', 'Social']);
  const categoria = faker.helpers.arrayElement(
    tipo === 'Ambiental' ? ENVIROMENT_CATEGORIES : SOCIAL_CATEGORIES
  );

  const risco = faker.helpers.arrayElement(RISKS);
  
  // Lógica de negócio mockada: se o risco é crítico, há maior chance de não conformidade
  const naoConformidade = risco === 'Crítico' ? faker.datatype.boolean(0.8) : faker.datatype.boolean(0.2);

  return {
    id: faker.string.uuid(),
    codigo: `PAS-${tipo.substring(0, 3).toUpperCase()}-${faker.string.numeric(4)}`,
    nome: `${faker.helpers.arrayElement(['Vazamento', 'Impacto', 'Irregularidade', 'Ocupação', 'Multa'])} - ${faker.location.streetAddress()}`,
    tipo,
    categoria,
    risco,
    impactoAmbiental: faker.helpers.arrayElement(IMPACTS),
    impactoSocial: faker.helpers.arrayElement(IMPACTS),
    statusPlano: faker.helpers.arrayElement(STATUS_PLANS),
    dataIdentificacao: faker.date.past({ years: 2 }).toISOString(),
    responsavel: faker.helpers.arrayElement(users.map(u => u.firstName)),
    proximaAcao: faker.lorem.sentence(),
    recorrente: faker.datatype.boolean(0.15), // 15% de chance de ser recorrente
    auditado: faker.datatype.boolean(0.80),
    naoConformidade,
    documentos: [],
    acoes: [],
    tendencia: faker.helpers.arrayElement(['subindo', 'descendo', 'estavel']),
    recorrenciaContagem: naoConformidade ? faker.number.int({ min: 1, max: 5 }) : 0,
    ultimaAtualizacao: faker.date.recent({ days: 30 }).toISOString(),
  };
}

export function generateLiabilityList(count: number = 50): Liability[] {
  return Array.from({ length: count }, () => generateRandomLiablility());
}

export const liabilities = generateLiabilityList(100);