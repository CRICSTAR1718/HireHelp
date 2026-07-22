import { db, pool } from './index';
import { roles, permissions, rolePermissions, departments, users, question_templates } from './schema';
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

  console.log('Seeding generic question templates...');
  const GENERIC_TEMPLATES = [
    // Text fields
    { label: 'Full Name', field_type: 'text', category: 'generic', user_id: null, is_required: true, placeholder: 'Enter your full name', helper_text: 'Please provide your legal name as it appears on official documents', max_rating: 5, options: null, usage_count: 0 },
    { label: 'Email Address', field_type: 'text', category: 'generic', user_id: null, is_required: true, placeholder: 'your.email@example.com', helper_text: 'We will use this email for all communication', max_rating: 5, options: null, usage_count: 0 },
    { label: 'Phone Number', field_type: 'text', category: 'generic', user_id: null, is_required: true, placeholder: '+1 234 567 8900', helper_text: 'Include country code', max_rating: 5, options: null, usage_count: 0 },
    { label: 'Current Location', field_type: 'text', category: 'generic', user_id: null, is_required: true, placeholder: 'City, State, Country', helper_text: 'Where are you currently located?', max_rating: 5, options: null, usage_count: 0 },
    { label: 'LinkedIn Profile URL', field_type: 'text', category: 'generic', user_id: null, is_required: false, placeholder: 'https://linkedin.com/in/yourprofile', helper_text: 'Link to your LinkedIn profile', max_rating: 5, options: null, usage_count: 0 },
    { label: 'Portfolio URL', field_type: 'text', category: 'generic', user_id: null, is_required: false, placeholder: 'https://yourportfolio.com', helper_text: 'Link to your portfolio or website', max_rating: 5, options: null, usage_count: 0 },
    { label: 'GitHub Profile URL', field_type: 'text', category: 'generic', user_id: null, is_required: false, placeholder: 'https://github.com/yourusername', helper_text: 'Link to your GitHub profile', max_rating: 5, options: null, usage_count: 0 },
    // Textarea fields
    { label: 'Professional Summary', field_type: 'textarea', category: 'generic', user_id: null, is_required: false, placeholder: 'Brief summary of your professional background', helper_text: 'Tell us about yourself in 2-3 sentences', max_rating: 5, options: null, usage_count: 0 },
    { label: 'Why are you interested in this role?', field_type: 'textarea', category: 'generic', user_id: null, is_required: true, placeholder: 'Explain your motivation', helper_text: 'What excites you about this position?', max_rating: 5, options: null, usage_count: 0 },
    { label: 'Describe a challenging project you worked on', field_type: 'textarea', category: 'generic', user_id: null, is_required: false, placeholder: 'Describe the project, your role, and the outcome', helper_text: 'Share a specific example from your experience', max_rating: 5, options: null, usage_count: 0 },
    { label: 'What are your salary expectations?', field_type: 'textarea', category: 'generic', user_id: null, is_required: false, placeholder: 'Provide your expected salary range', helper_text: 'This helps us ensure alignment', max_rating: 5, options: null, usage_count: 0 },
    { label: 'When can you start?', field_type: 'textarea', category: 'generic', user_id: null, is_required: true, placeholder: 'Provide your availability', helper_text: 'Your earliest start date', max_rating: 5, options: null, usage_count: 0 },
    // Dropdown fields
    { label: 'Years of Experience', field_type: 'dropdown', category: 'generic', user_id: null, is_required: true, placeholder: null, helper_text: 'Total years of professional experience', max_rating: 5, options: JSON.stringify([{ label: '0-1 years' }, { label: '1-3 years' }, { label: '3-5 years' }, { label: '5-10 years' }, { label: '10+ years' }]), usage_count: 0 },
    { label: 'Employment Type Preference', field_type: 'dropdown', category: 'generic', user_id: null, is_required: true, placeholder: null, helper_text: 'What type of employment are you looking for?', max_rating: 5, options: JSON.stringify([{ label: 'Full-time' }, { label: 'Part-time' }, { label: 'Contract' }, { label: 'Freelance' }]), usage_count: 0 },
    { label: 'Work Mode Preference', field_type: 'dropdown', category: 'generic', user_id: null, is_required: true, placeholder: null, helper_text: 'How would you prefer to work?', max_rating: 5, options: JSON.stringify([{ label: 'On-site' }, { label: 'Remote' }, { label: 'Hybrid' }]), usage_count: 0 },
    { label: 'Highest Education Level', field_type: 'dropdown', category: 'generic', user_id: null, is_required: true, placeholder: null, helper_text: 'Select your highest completed education', max_rating: 5, options: JSON.stringify([{ label: 'High School' }, { label: 'Associate Degree' }, { label: "Bachelor's Degree" }, { label: "Master's Degree" }, { label: 'PhD' }, { label: 'Other' }]), usage_count: 0 },
    { label: 'Notice Period', field_type: 'dropdown', category: 'generic', user_id: null, is_required: true, placeholder: null, helper_text: 'How much notice do you need to give your current employer?', max_rating: 5, options: JSON.stringify([{ label: 'Immediate' }, { label: '1-2 weeks' }, { label: '1 month' }, { label: '2 months' }, { label: '3+ months' }]), usage_count: 0 },
    // Multi-select fields
    { label: 'Programming Languages', field_type: 'multi_select', category: 'generic', user_id: null, is_required: false, placeholder: null, helper_text: 'Select languages you are proficient in', max_rating: 5, options: JSON.stringify([{ label: 'JavaScript' }, { label: 'Python' }, { label: 'Java' }, { label: 'C++' }, { label: 'C#' }, { label: 'Go' }, { label: 'Ruby' }, { label: 'PHP' }, { label: 'Swift' }, { label: 'Kotlin' }]), usage_count: 0 },
    { label: 'Frameworks & Libraries', field_type: 'multi_select', category: 'generic', user_id: null, is_required: false, placeholder: null, helper_text: 'Select frameworks you have experience with', max_rating: 5, options: JSON.stringify([{ label: 'React' }, { label: 'Angular' }, { label: 'Vue.js' }, { label: 'Node.js' }, { label: 'Django' }, { label: 'Spring Boot' }, { label: '.NET' }, { label: 'Flutter' }, { label: 'React Native' }]), usage_count: 0 },
    { label: 'Databases', field_type: 'multi_select', category: 'generic', user_id: null, is_required: false, placeholder: null, helper_text: 'Select databases you have worked with', max_rating: 5, options: JSON.stringify([{ label: 'PostgreSQL' }, { label: 'MySQL' }, { label: 'MongoDB' }, { label: 'Redis' }, { label: 'SQLite' }, { label: 'Oracle' }, { label: 'SQL Server' }]), usage_count: 0 },
    { label: 'Cloud Platforms', field_type: 'multi_select', category: 'generic', user_id: null, is_required: false, placeholder: null, helper_text: 'Select cloud platforms you have experience with', max_rating: 5, options: JSON.stringify([{ label: 'AWS' }, { label: 'Google Cloud' }, { label: 'Azure' }, { label: 'Heroku' }, { label: 'DigitalOcean' }]), usage_count: 0 },
    { label: 'Tools & Technologies', field_type: 'multi_select', category: 'generic', user_id: null, is_required: false, placeholder: null, helper_text: 'Select tools you are familiar with', max_rating: 5, options: JSON.stringify([{ label: 'Git' }, { label: 'Docker' }, { label: 'Kubernetes' }, { label: 'Jenkins' }, { label: 'CI/CD' }, { label: 'Linux' }, { label: 'Agile/Scrum' }]), usage_count: 0 },
    // File upload
    { label: 'Resume/CV', field_type: 'file', category: 'generic', user_id: null, is_required: true, placeholder: null, helper_text: 'Upload your resume in PDF format', max_rating: 5, options: null, usage_count: 0 },
    { label: 'Cover Letter', field_type: 'file', category: 'generic', user_id: null, is_required: false, placeholder: null, helper_text: 'Upload your cover letter (optional)', max_rating: 5, options: null, usage_count: 0 },
    // Checkbox
    { label: 'I am willing to relocate', field_type: 'checkbox', category: 'generic', user_id: null, is_required: false, placeholder: null, helper_text: 'Check if you are open to relocating for this role', max_rating: 5, options: null, usage_count: 0 },
    { label: 'I require visa sponsorship', field_type: 'checkbox', category: 'generic', user_id: null, is_required: false, placeholder: null, helper_text: 'Check if you need visa sponsorship', max_rating: 5, options: null, usage_count: 0 },
    // Date
    { label: 'Date of Birth', field_type: 'date', category: 'generic', user_id: null, is_required: false, placeholder: null, helper_text: 'Your date of birth', max_rating: 5, options: null, usage_count: 0 },
    { label: 'Expected Start Date', field_type: 'date', category: 'generic', user_id: null, is_required: true, placeholder: null, helper_text: 'When can you join?', max_rating: 5, options: null, usage_count: 0 },
    // Number
    { label: 'Current CTC (Annual)', field_type: 'number', category: 'generic', user_id: null, is_required: false, placeholder: 'Enter amount in USD', helper_text: 'Current annual compensation', max_rating: 5, options: null, usage_count: 0 },
    { label: 'Expected CTC (Annual)', field_type: 'number', category: 'generic', user_id: null, is_required: false, placeholder: 'Enter amount in USD', helper_text: 'Expected annual compensation', max_rating: 5, options: null, usage_count: 0 },
    // Rating
    { label: 'Rate your proficiency in [Skill]', field_type: 'rating', category: 'generic', user_id: null, is_required: false, placeholder: null, helper_text: '1 = Beginner, 5 = Expert', max_rating: 5, options: null, usage_count: 0 },
    // Yes/No
    { label: 'Do you have experience working in a similar industry?', field_type: 'yes_no', category: 'generic', user_id: null, is_required: false, placeholder: null, helper_text: 'Industry experience check', max_rating: 5, options: null, usage_count: 0 },
    { label: 'Are you available for overtime?', field_type: 'yes_no', category: 'generic', user_id: null, is_required: false, placeholder: null, helper_text: 'Overtime availability', max_rating: 5, options: null, usage_count: 0 },
  ];

  await db.insert(question_templates).values(GENERIC_TEMPLATES).onConflictDoNothing();
  console.log('  Generic question templates seeded.');

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
