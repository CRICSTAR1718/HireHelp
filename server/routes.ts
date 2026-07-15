import { Router } from 'express';

// ─────────────────────────────────────────────────────────────────────────────
// Combines every module's router into one Express app. Mount prefixes below
// roughly mirror the old api-gateway's path-prefix -> service routing table,
// so the merged frontend's existing fetch paths need minimal changes.
//
// Export styles vary by module (default vs named export) because each
// module was copied over from a different original repo with its own
// convention — left as-is rather than forcing a uniform style during the
// merge, to keep each diff minimal and reviewable.
// ─────────────────────────────────────────────────────────────────────────────

// Candidates
import candidateAuthRoutes from './modules/candidates/auth/routes/auth.routes';
import candidateProfileRoutes from './modules/candidates/profile/routes/profile.routes';
import candidateResumeRoutes from './modules/candidates/resume/routes/resume.routes';
import candidateApplicationsRoutes from './modules/candidates/applications/routes/applications.routes';
import candidateDashboardRoutes from './modules/candidates/dashboard/routes/dashboard.routes';
import candidateNotificationsRoutes from './modules/candidates/notifications/routes/notifications.routes';
import candidateInterviewStatusRoutes from './modules/candidates/interview-status/routes/interview-status.routes';
import candidateJobsRoutes from './modules/candidates/jobs/routes/jobs.routes';

// Recruitment
import requisitionsRoutes from './modules/recruitment/requisitions/requisitions.routes';
import jobsRoutes from './modules/recruitment/jobs/jobs.routes';
import { reqFormRouter, approvalsRouter as formsApprovalsRouter, templatesRouter } from './modules/recruitment/forms/forms.routes';
import pipelineRoutes from './modules/recruitment/pipeline/pipeline.routes';
import feedbackAggRoutes from './modules/recruitment/feedback/feedback.routes';
import offersRoutes from './modules/recruitment/offers/offers.routes';
import recruitmentApplicationsRoutes from './modules/recruitment/applications/applications.routes';
import { approvalsRouter as requisitionApprovalsRouter, rulebooksRouter } from './modules/recruitment/approvals/approvals.routes';
import logsRoutes from './modules/recruitment/logs/logs.routes';

// Admin RBAC
import adminAuthRoutes from './modules/admin-rbac/auth/auth.routes';
import approvalsRoutes from './modules/admin-rbac/approvals/approvals.routes';
import auditRoutes from './modules/admin-rbac/audit/audit.routes';
import configurationRoutes from './modules/admin-rbac/configuration/configuration.routes';
import departmentsRoutes from './modules/admin-rbac/departments/departments.routes';
import usersRoutes from './modules/admin-rbac/users/users.routes';
import rolesRoutes from './modules/admin-rbac/roles/roles.routes';
import permissionsRoutes from './modules/admin-rbac/permissions/permissions.routes';
import healthRoutes from './modules/admin-rbac/health/health.routes';

// Interviews
import { assignmentRoutes } from './modules/interviews/assignment/assignment.routes';
import { schedulingRoutes } from './modules/interviews/scheduling/scheduling.routes';
import { calendarRoutes } from './modules/interviews/calendar/calendar.routes';
import { interviewerRoutes } from './modules/interviews/interviewer/interviewer.routes';
import { meetingLinksRoutes } from './modules/interviews/meeting-links/meeting-links.routes';
import { feedbackRoutes } from './modules/interviews/feedback/feedback.routes';
import { remindersRoutes } from './modules/interviews/reminders/reminders.routes';

const router = Router();

// ── Health (unauthenticated, matches old gateway's /health/all intent) ─────
router.use('/health', healthRoutes);

// ── Candidates ───────────────────────────────────────────────────────────
router.use('/candidates/auth', candidateAuthRoutes);
router.use('/candidates/profile', candidateProfileRoutes);
router.use('/candidates/resumes', candidateResumeRoutes);
router.use('/candidates/applications', candidateApplicationsRoutes);
router.use('/candidates/dashboard', candidateDashboardRoutes);
router.use('/candidates/notifications', candidateNotificationsRoutes);
router.use('/candidates/interview-status', candidateInterviewStatusRoutes);
router.use('/candidates/jobs', candidateJobsRoutes); // public browse — no auth, matches original

// ── Recruitment ─────────────────────────────────────────────────────────
router.use('/requisitions', requisitionsRoutes);
router.use('/jobs', jobsRoutes); // public published-jobs feed, consumed by candidates/jobs module in-process too
router.use('/requisitions/:requisitionId/form', reqFormRouter);
router.use('/form-approvals', formsApprovalsRouter);
router.use('/forms/templates', templatesRouter);
router.use('/pipeline', pipelineRoutes);
router.use('/feedback-aggregations', feedbackAggRoutes);
router.use('/offers', offersRoutes);
router.use('/applications', recruitmentApplicationsRoutes);
router.use('/requisitions/:requisitionId/approvals', requisitionApprovalsRouter);
router.use('/requisitions/:requisitionId/rulebooks', rulebooksRouter);
router.use('/requisitions/:requisitionId/logs', logsRoutes);

// ── Admin RBAC ───────────────────────────────────────────────────────────
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/approvals', approvalsRoutes);
router.use('/admin', auditRoutes); // audit.routes.ts already declares full '/audit' paths internally
router.use('/admin', configurationRoutes); // same — declares '/configuration' internally
router.use('/admin', departmentsRoutes); // same — declares '/departments' internally
router.use('/admin', usersRoutes); // declares '/users' internally
router.use('/admin', rolesRoutes); // declares '/roles' internally
router.use('/admin', permissionsRoutes); // declares '/permissions' internally

// ── Interviews ───────────────────────────────────────────────────────────
router.use('/interviews/assignments', assignmentRoutes);
router.use('/interviews/scheduling', schedulingRoutes);
router.use('/interviews/calendar', calendarRoutes);
router.use('/interviews/interviewers', interviewerRoutes);
router.use('/interviews/meeting-links', meetingLinksRoutes);
router.use('/interviews/feedback', feedbackRoutes);
router.use('/interviews/reminders', remindersRoutes);

export default router;
