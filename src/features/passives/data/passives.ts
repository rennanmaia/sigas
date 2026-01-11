import { faker } from '@faker-js/faker';
import type { 
  Passivo, 
  PassivoTipo, 
  RiscoNivel, 
  ImpactoNivel, 
  StatusPlano 
} from './schema';

// Configurações de domínio ESG para maior verossimilhança
const CATEGORIAS_AMBIENTAIS = [
  'Recursos Hídricos', 'Biodiversidade', 'Emissões Atmosféricas', 
  'Resíduos Perigosos', 'Contaminação de Solo', 'Licenciamento'
];

const CATEGORIAS_SOCIAIS = [
  'Direitos Humanos', 'Comunidades Tradicionais', 'Saúde e Segurança', 
  'Mão de Obra Terceirizada', 'Impacto de Vizinhança', 'Patrimônio Cultural'
];

const RISCOS: RiscoNivel[] = ['Baixo', 'Médio', 'Alto', 'Crítico'];
const IMPACTOS: ImpactoNivel[] = ['Leve', 'Moderado', 'Significativo', 'Severo'];
const STATUS_PLANO: StatusPlano[] = ['Não Definido', 'Em Planejamento', 'Em Execução', 'Atrasado', 'Concluído'];

export function generateRandomPassivo(): Passivo {
  const tipo = faker.helpers.arrayElement<PassivoTipo>(['Ambiental', 'Social']);
  const categoria = faker.helpers.arrayElement(
    tipo === 'Ambiental' ? CATEGORIAS_AMBIENTAIS : CATEGORIAS_SOCIAIS
  );

  const risco = faker.helpers.arrayElement(RISCOS);
  
  // Lógica de negócio mockada: se o risco é crítico, há maior chance de não conformidade
  const naoConformidade = risco === 'Crítico' ? faker.datatype.boolean(0.8) : faker.datatype.boolean(0.2);

  return {
    id: faker.string.uuid(),
    codigo: `PAS-${tipo.substring(0, 3).toUpperCase()}-${faker.string.numeric(4)}`,
    nome: `${faker.helpers.arrayElement(['Vazamento', 'Impacto', 'Irregularidade', 'Ocupação', 'Multa'])} - ${faker.location.streetAddress()}`,
    tipo,
    categoria,
    risco,
    impactoAmbiental: faker.helpers.arrayElement(IMPACTOS),
    impactoSocial: faker.helpers.arrayElement(IMPACTOS),
    statusPlano: faker.helpers.arrayElement(STATUS_PLANO),
    dataIdentificacao: faker.date.past({ years: 2 }).toISOString(),
    responsavel: faker.person.fullName(),
    proximaAcao: faker.lorem.sentence(),
    recorrente: faker.datatype.boolean(0.15), // 15% de chance de ser recorrente
    auditado: faker.datatype.boolean(),
    naoConformidade,
    documentosAnexadas: faker.number.int({ min: 0, max: 10 }),
    tendencia: faker.helpers.arrayElement(['subindo', 'descendo', 'estavel']),
    recorrenciaContagem: naoConformidade ? faker.number.int({ min: 1, max: 5 }) : 0,
    ultimaAtualizacao: faker.date.recent({ days: 30 }).toISOString(),
  };
}

export function generatePassivosList(count: number = 50): Passivo[] {
  return Array.from({ length: count }, () => generateRandomPassivo());
}

export const passivosMock = generatePassivosList(100);