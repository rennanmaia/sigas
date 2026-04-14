import { faker } from "@faker-js/faker";
import type { Liability, PassiveStatus } from "./schema";
import { users } from "@/features/users/data/users";

export const PASSIVE_STATUSES: PassiveStatus[] = [
  "Ativo",
  "Inativo",
  "Indisponível",
];

export const TIPO_TAGS = [
  "Ambiental",
  "Social",
  "Resíduos",
  "Hídrico",
  "Emissões",
  "Segurança",
  "Comunidade",
  "Licença",
  "Solo",
  "Biodiversidade",
];

export function generateRandomLiablility(): Liability {
  const status = faker.helpers.arrayElement(PASSIVE_STATUSES);
  const tagCount = faker.number.int({ min: 1, max: 3 });
  const tipo = faker.helpers.arrayElements(TIPO_TAGS, tagCount);

  return {
    id: faker.string.uuid(),
    codigo: `PAS-${faker.string.numeric(4)}`,
    nome: `${faker.helpers.arrayElement(["Vazamento", "Impacto", "Irregularidade", "Ocupação", "Multa"])} - ${faker.location.streetAddress()}`,
    tipo,
    descricao: faker.lorem.sentence(),
    categoria: faker.helpers.arrayElement([
      "Recursos Hídricos",
      "Biodiversidade",
      "Emissões Atmosféricas",
      "Resíduos Perigosos",
      "Contaminação de Solo",
      "Direitos Humanos",
    ]),
    status,
    dataIdentificacao: faker.date.past({ years: 2 }).toISOString(),
    responsavel: faker.helpers.arrayElement(users.map((u) => u.firstName)),
    auditado: faker.datatype.boolean(0.8),
    documentos: [],
    customFields: [],
    lat: faker.location.latitude({ min: -3.5, max: -1.5 }),
    lng: faker.location.longitude({ min: -56.0, max: -53.0 }),
    ultimaAtualizacao: faker.date.recent({ days: 30 }).toISOString(),
  };
}

export function generateLiabilityList(count: number = 50): Liability[] {
  return Array.from({ length: count }, () => generateRandomLiablility());
}

export const liabilities = generateLiabilityList(100);
