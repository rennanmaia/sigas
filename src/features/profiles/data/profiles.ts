import { faker } from '@faker-js/faker'
import { roles } from './data'
import { featureGroups } from '@/features/features/data/features'
import type { Profile } from './schema'

// Seed for consistent results
faker.seed(42424)

const allPermissions = featureGroups.flatMap((g) => g.children.map((c) => c.id))

export const profiles: Profile[] = roles.map((r, idx) => {
  // create a random-sized subset of available permissions
  const max = Math.min(allPermissions.length, 16)
  const take = faker.number.int({ min: 3, max })
  const perms = faker.helpers.shuffle(allPermissions).slice(0, take)

  return {
    id: `${r.value}-${idx}`,
    label: r.label,
    value: r.value,
    description: faker.helpers.arrayElement([
      `${r.label} has full access to the system.`,
      `${r.label} can manage users and view reports.`,
      `General role for ${r.label.toLowerCase()}s.`,
    ]),
    permissions: perms,
  }
})
