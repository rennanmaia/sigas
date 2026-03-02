import { faker } from "@faker-js/faker";
import { roles } from "./data";
import { FEATURE_GROUPS } from "@/features/features/data/features";
import type { Profile } from "./schema";

// Seed for consistent results
faker.seed(42424);

const allPermissions = FEATURE_GROUPS.flatMap((g) =>
  g.children.map((c) => c.id),
);

export const profiles: Profile[] = roles.map((r, idx) => {
  // create a random-sized subset of available permissions
  const max = Math.min(allPermissions.length, 16);
  const take = faker.number.int({ min: 3, max });
  const perms = faker.helpers.shuffle(allPermissions).slice(0, take);

  return {
    id: `${r.value}-${idx}`,
    label: r.label,
    value: r.value,
    description: faker.helpers.arrayElement([
      `${r.label} tem acesso total ao sistema.`,
      `${r.label} pode gerenciar usuários e visualizar relatórios.`,
      `Função geral para ${r.label.toLowerCase()}s.`,
    ]),
    permissions: perms,
  };
});
