import { db, pool } from './index';
import { roles, permissions, rolePermissions, departments, users } from './schema';
import { hashPassword } from '../common/utils/password';
import { eq } from 'drizzle-orm';

// ─────────────────────────────────────────────────────────────────────────────
// Seeds the minimum data requireRole()/authorize() need to actually work.
// Without this, every protected route 403s — there are no `roles` or
// `permissions` rows for the JWT's roleId to resolve against.
//
// Permission strings below are the exact set found in use across
// admin-rbac's route files (`authorize("resource:action")` calls) — see
// README.md's "Still outstanding" note #1. Role→permission mapping is a
// reasonable first-pass default, not a final product decision — review
// before shipping to real users.
//
// Run with: npx tsx server/database/seed.ts
// Safe to re-run — every insert uses onConflictDoNothing.
// ─────────────────────────────────────────────────────────────────────────────

const PERMISSIONS: Array<{ name: string; resource: string; action: string; description: string }> = [
  { name: 'approvals:list', resource: 'approvals', action: 'list', description: 'View pending requisition approvals' },
  { name: 'approvals:read', resource: 'approvals', action: 'read', description: 'View a single approval record' },
  { name: 'approvals:approve', resource: 'approvals', action: 'approve', description: 'Approve a requisition' },
  { name: 'approvals:reject', resource: 'approvals', action: 'reject', description: 'Reject a requisition' },
  { name: 'audit:list', resource: 'audit', action: 'list', description: 'List audit log entries' },
  { name: 'audit:read', resource: 'audit', action: 'read', description: 'View a single audit log entry' },
  { name: 'configuration:read', resource: 'configuration', action: 'read', description: 'View platform configuration' },
  { name: 'configuration:update', resource: 'configuration', action: 'update', description: 'Change platform configuration' },
  { name: 'departments:list', resource: 'departments', action: 'list', description: 'List departments' },
  { name: 'departments:read', resource: 'departments', action: 'read', description: 'View a single department' },
  { name: 'departments:create', resource: 'departments', action: 'create', description: 'Create a department' },
  { name: 'departments:update', resource: 'departments', action: 'update', description: 'Edit a department' },
  { name: 'departments:delete', resource: 'departments', action: 'delete', description: 'Delete a department' },
  // Not yet referenced by any route (users/roles modules have no routes.ts
  // yet), included so the RBAC model has somewhere to grow without another
  // migration when those routes get built.
  { name: 'users:manage', resource: 'users', action: 'manage', description: 'Create/edit/deactivate staff users' },
  { name: 'roles:manage', resource: 'roles', action: 'manage', description: 'Create/edit roles and permission mappings' },
];

const ROLE_PERMISSION_MAP: Record<string, string[]> = {
  admin: PERMISSIONS.map((p) => p.name), // admin gets everything
  hr: [
    'approvals:list',
    'approvals:read',
    'approvals:approve',
    'approvals:reject',
    'departments:list',
    'departments:read',
  ],
  interviewer: [
    // interviewers currently have no admin-rbac permission needs — their
    // access is governed by requireRole('interviewer', ...) on interview
    // routes directly, not the permission table. Left empty on purpose.
  ],
};

async function seed() {
  console.log('Seeding roles...');
  const roleRows = await db
    .insert(roles)
    .values([
      { name: 'admin', description: 'Full platform access' },
      { name: 'hr', description: 'Recruiter — requisitions, pipeline, offers, approvals' },
      { name: 'interviewer', description: 'Conducts interviews, submits feedback' },
    ])
    .onConflictDoNothing({ target: roles.name })
    .returning();

  // onConflictDoNothing returns [] for rows that already existed — re-fetch
  // to get a complete map regardless of whether this is a first run or a
  // re-run.
  const allRoles = await db.select().from(roles);
  const roleIdByName = new Map(allRoles.map((r) => [r.name, r.id]));

  console.log('Seeding permissions...');
  const existingPermissions = await db.select().from(permissions);
  const existingPermissionNames = new Set(existingPermissions.map((p) => p.name));
  const newPermissions = PERMISSIONS.filter((p) => !existingPermissionNames.has(p.name));

  if (newPermissions.length > 0) {
    await db.insert(permissions).values(
      newPermissions.map((p) => ({
        name: p.name,
        resource: p.resource,
        action: p.action,
        description: p.description,
      }))
    );
  }

  const allPermissions = await db.select().from(permissions);
  const permissionIdByName = new Map(allPermissions.map((p) => [p.name, p.id]));

  console.log('Seeding role_permissions...');
  for (const [roleName, permissionNames] of Object.entries(ROLE_PERMISSION_MAP)) {
    const roleId = roleIdByName.get(roleName);
    if (!roleId) continue;

    for (const permName of permissionNames) {
      const permissionId = permissionIdByName.get(permName);
      if (!permissionId) continue;

      await db
        .insert(rolePermissions)
        .values({ roleId, permissionId })
        .onConflictDoNothing();
    }
  }

  console.log('Seeding default department...');
  await db
    .insert(departments)
    .values([{ name: 'General', description: 'Default department' }])
    .onConflictDoNothing();

  const [generalDept] = await db.select().from(departments).where(eq(departments.name, 'General'));

  console.log('Seeding bootstrap admin user...');
  const adminRoleId = roleIdByName.get('admin');
  if (!adminRoleId) {
    throw new Error('admin role missing after seed — cannot create bootstrap user');
  }

  const bootstrapEmail = process.env.SEED_ADMIN_EMAIL || 'admin@hirehelp.local';
  const bootstrapPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';

  const existing = await db.select().from(users).where(eq(users.email, bootstrapEmail));
  if (existing.length === 0) {
    const passwordHash = await hashPassword(bootstrapPassword);
    await db.insert(users).values({
      firstName: 'System',
      lastName: 'Admin',
      email: bootstrapEmail,
      passwordHash,
      roleId: adminRoleId,
      departmentId: generalDept?.id,
    });
    console.log(`  Created bootstrap admin: ${bootstrapEmail} / ${bootstrapPassword}`);
    console.log('  ⚠ Change this password immediately after first login.');
  } else {
    console.log(`  Bootstrap admin ${bootstrapEmail} already exists, skipped.`);
  }

  console.log('Seed complete.');
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
