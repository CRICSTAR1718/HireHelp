import {
  boolean,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN MODULE — canonical staff identity, RBAC, audit, config
// This is the single source of truth for `users` across the whole monolith.
// Recruitment/Interview modules reference admin.users.id directly (real FK now
// that everything lives in one database).
// ─────────────────────────────────────────────────────────────────────────────

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    nameIdx: index("roles_name_idx").on(table.name),
  })
);

export const permissions = pgTable(
  "permissions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 150 }).notNull().unique(),
    resource: varchar("resource", { length: 200 }).notNull(),
    action: varchar("action", { length: 100 }).notNull(),
    description: text("description"),
  },
  (table) => ({
    resourceActionIdx: index("permissions_resource_action_idx").on(
      table.resource,
      table.action
    ),
  })
);

export const rolePermissions = pgTable(
  "role_permissions",
  {
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
    permissionId: uuid("permission_id")
      .notNull()
      .references(() => permissions.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.roleId, table.permissionId] }),
  })
);

export const departments = pgTable(
  "departments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description"),
    parentDepartmentId: uuid("parent_department_id"),
    headUserId: uuid("head_user_id"),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    parentIdx: index("departments_parent_idx").on(table.parentDepartmentId),
  })
);

// NOTE: was `hr | admin` in Recruitment's old enum-based role column.
// Now role is a real FK to `roles` (recruiter/interviewer/admin rows seeded there)
// instead of a hardcoded enum — this is what unlocks deleting Recruitment's own `users` table.
export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: varchar("first_name", { length: 150 }).notNull(),
    lastName: varchar("last_name", { length: 150 }).notNull(),
    email: varchar("email", { length: 320 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    phone: varchar("phone", { length: 50 }),
    roleId: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
    departmentId: uuid("department_id").references(() => departments.id, { onDelete: "set null" }),
    isActive: boolean("is_active").notNull().default(true),
    lastLogin: timestamp("last_login", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailIdx: index("users_email_idx").on(table.email),
  })
);

export const auditLogs = pgTable(
  "audit_logs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    action: varchar("action", { length: 200 }).notNull(),
    resource: varchar("resource", { length: 300 }).notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>().notNull().default({}),
    ipAddress: varchar("ip_address", { length: 45 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    createdAtIdx: index("audit_logs_created_at_idx").on(table.createdAt),
  })
);

export const configuration = pgTable(
  "configuration",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    key: varchar("key", { length: 200 }).notNull().unique(),
    value: text("value").notNull(),
    description: text("description"),
    updatedBy: uuid("updated_by").references(() => users.id, { onDelete: "set null" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    keyIdx: index("configuration_key_idx").on(table.key),
  })
);

// Admin's generic approval-request tracker — used for non-requisition approvals
// (e.g. config changes). Requisition-specific approvals live in the
// recruitment module (`requisition_approvals`, `form_approvals`) since they're
// tightly coupled to requisition/form state there. Kept separate on purpose —
// this is NOT a duplicate, it's a different approval subject.
export const approvals = pgTable(
  "approvals",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requisitionId: varchar("requisition_id", { length: 100 }).notNull(),
    status: varchar("status", { length: 50 }).notNull().default("pending"),
    requiredApprovalCount: text("required_approval_count").notNull().default("1"),
    currentApprovalCount: text("current_approval_count").notNull().default("0"),
    approvedBy: jsonb("approved_by").$type<string[]>().notNull().default([]),
    rejectedBy: varchar("rejected_by", { length: 200 }),
    rejectionReason: text("rejection_reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    requisitionIdIdx: index("approvals_requisition_id_idx").on(table.requisitionId),
    statusIdx: index("approvals_status_idx").on(table.status),
  })
);

export const userSessions = pgTable(
  "user_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    refreshTokenHash: varchar("refresh_token_hash", { length: 255 }).notNull().unique(),
    deviceName: varchar("device_name", { length: 200 }),
    ipAddress: varchar("ip_address", { length: 45 }).notNull(),
    userAgent: text("user_agent"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }).notNull().defaultNow(),
    isRevoked: boolean("is_revoked").notNull().default(false),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    revokedReason: varchar("revoked_reason", { length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("user_sessions_user_id_idx").on(table.userId),
    refreshTokenHashIdx: index("user_sessions_refresh_token_hash_idx").on(
      table.refreshTokenHash
    ),
    expiresAtIdx: index("user_sessions_expires_at_idx").on(table.expiresAt),
    isRevokedIdx: index("user_sessions_is_revoked_idx").on(table.isRevoked),
  })
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: varchar("token_hash", { length: 255 }).notNull().unique(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    isUsed: boolean("is_used").notNull().default(false),
    usedAt: timestamp("used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    userIdIdx: index("password_reset_tokens_user_id_idx").on(table.userId),
    tokenHashIdx: index("password_reset_tokens_token_hash_idx").on(table.tokenHash),
    expiresAtIdx: index("password_reset_tokens_expires_at_idx").on(table.expiresAt),
  })
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  role: one(roles, { fields: [users.roleId], references: [roles.id] }),
  department: one(departments, { fields: [users.departmentId], references: [departments.id] }),
  auditLogs: many(auditLogs),
  sessions: many(userSessions),
  passwordResetTokens: many(passwordResetTokens),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
  users: many(users),
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, { fields: [rolePermissions.roleId], references: [roles.id] }),
  permission: one(permissions, { fields: [rolePermissions.permissionId], references: [permissions.id] }),
}));

export const departmentsRelations = relations(departments, ({ many, one }) => ({
  users: many(users),
  headUser: one(users, { fields: [departments.headUserId], references: [users.id] }),
  parent: one(departments, { fields: [departments.parentDepartmentId], references: [departments.id] }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, { fields: [auditLogs.userId], references: [users.id] }),
}));

export const configurationRelations = relations(configuration, ({ one }) => ({
  updatedByUser: one(users, { fields: [configuration.updatedBy], references: [users.id] }),
}));

export const userSessionsRelations = relations(userSessions, ({ one }) => ({
  user: one(users, { fields: [userSessions.userId], references: [users.id] }),
}));

export const passwordResetTokensRelations = relations(passwordResetTokens, ({ one }) => ({
  user: one(users, { fields: [passwordResetTokens.userId], references: [users.id] }),
}));
