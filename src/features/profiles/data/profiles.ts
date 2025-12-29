import { faker } from '@faker-js/faker'
import { roles } from './data'
import type { Profile } from './schema'

// Seed for consistent results
faker.seed(42424)

export const profiles: Profile[] = roles.map((r, idx) => ({
  id: `${r.value}-${idx}`,
  label: r.label,
  value: r.value,
  description: faker.helpers.arrayElement([
    `${r.label} has full access to the system.`,
    `${r.label} can manage users and view reports.`,
    `General role for ${r.label.toLowerCase()}s.`,
  ]),
  permissions: faker.number.int({ min: 0, max: 50 }),
}))
