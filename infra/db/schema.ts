import {
  pgTable, uuid, text, timestamp, uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  // auth_user_id — из Supabase Auth JWT (sub)
  authUserId: uuid('auth_user_id').notNull().unique(),
  fullName: text('full_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  authUserIdIdx: uniqueIndex('profiles_auth_user_id_idx').on(t.authUserId),
}))

export const memberships = pgTable('memberships', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: uuid('org_id').references(() => organizations.id, { onDelete: 'cascade' }).notNull(),
  profileId: uuid('profile_id').references(() => profiles.id, { onDelete: 'cascade' }).notNull(),
  role: text('role').notNull().$type<'owner'|'admin'|'member'>().default('owner'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (t) => ({
  uniq: uniqueIndex('memb_org_profile_uniq').on(t.orgId, t.profileId),
}))

export const orgRelations = relations(organizations, ({ many }) => ({
  memberships: many(memberships),
}))

export const profileRelations = relations(profiles, ({ many }) => ({
  memberships: many(memberships),
}))

export const membershipRelations = relations(memberships, ({ one }) => ({
  org: one(organizations, {
    fields: [memberships.orgId],
    references: [organizations.id],
  }),
  profile: one(profiles, {
    fields: [memberships.profileId],
    references: [profiles.id],
  }),
}))
