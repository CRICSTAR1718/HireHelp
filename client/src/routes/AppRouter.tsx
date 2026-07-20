import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute, PublicRoute } from "./ProtectedRoute";
import { useAppSelector } from "@/store/hooks";

// ── Shared / auth ──────────────────────────────────────────────────────
import { StaffLoginPage } from "@/pages/shared/StaffLoginPage";
import { ForgotPasswordPage } from "@/pages/shared/ForgotPassword";
import { ResetPasswordPage } from "@/pages/shared/ResetPassword";
import { ResetPasswordSentPage } from "@/pages/shared/ResetPasswordSent";
import { ResetPasswordSuccessPage } from "@/pages/shared/ResetPasswordSuccess";

// ── Candidate (existing self-contained router pieces, reused) ─────────
import AuthLayout from "@/layouts/candidate/AuthLayout";
import { AppLayout as CandidateAppLayout } from "@/layouts/candidate/AppLayout";
import CandidateLogin from "@/pages/candidate/Login";
import CandidateRegister from "@/pages/candidate/Register";
import ForgotPassword from "@/pages/candidate/Login/ForgotPassword";
import CandidateDashboard from "@/pages/candidate/Dashboard";
import CandidateProfile from "@/pages/candidate/Profile";
import CandidateJobs from "@/pages/candidate/Jobs";
import CandidateApplications from "@/pages/candidate/Applications";
import CandidateSettings from "@/pages/candidate/Settings";

// ── Recruiter / HR ──────────────────────────────────────────────────────
import { RecruiterLayout } from "@/layouts/shared/RecruiterLayout";
import { RecruiterDashboard } from "@/pages/recruiter/Dashboard";
import RequisitionsPage from "@/pages/recruiter/RequisitionsPage";
import RequisitionDetailPage from "@/pages/recruiter/RequisitionDetailPage";
import RequisitionFormPage from "@/pages/recruiter/RequisitionFormPage";
import RulebookPage from "@/pages/recruiter/RulebookPage";
import ApprovalsPage from "@/pages/recruiter/ApprovalsPage";
import { PipelineBoard } from "@/pages/recruiter/PipelineBoard";
import { CandidateProfileView } from "@/pages/recruiter/CandidateProfileView";
import { PublishedJobsList } from "@/pages/recruiter/PublishedJobsList";
import { Pipeline } from "@/pages/recruiter/Pipeline";
import { Candidates } from "@/pages/recruiter/Candidates";
import { TalentPool } from "@/pages/recruiter/TalentPool";
import { Notifications } from "@/pages/recruiter/Notifications";
import { RecruiterSettings } from "@/pages/recruiter/Settings";
import FormBuilderPage from "@/pages/recruiter/hr/FormBuilderPage";
import ApplicationsListPage from "@/pages/recruiter/hr/ApplicationsListPage";
import ApplicationDetailPage from "@/pages/recruiter/hr/ApplicationDetailPage";
import FormApprovalsPage from "@/pages/recruiter/admin/FormApprovalsPage";
import RequisitionReviewPage from "@/pages/recruiter/admin/RequisitionReviewPage";
import RecruiterInterviewSchedulingPage from "@/pages/recruiter/InterviewSchedulingPage";
import InterviewPanel from "@/pages/recruiter/InterviewPanel";
import AllInterviews from "@/pages/recruiter/AllInterviews";

// ── Interviewer ──────────────────────────────────────────────────────
import { InterviewerLayout } from "@/layouts/shared/InterviewerLayout";
import { AssignedInterviews } from "@/pages/interviewer/AssignedInterviews";
import { ScheduleCalendarView } from "@/pages/interviewer/ScheduleCalendarView";
import { FeedbackForm } from "@/pages/interviewer/FeedbackForm";
import { InterviewHistory } from "@/pages/interviewer/InterviewHistory";
import InterviewerDashboard from "@/pages/interviewer/Dashboard";
import InterviewerSettings from "@/pages/interviewer/Settings";
import InterviewerNotifications from "@/pages/interviewer/Notifications";
import InterviewerCalendar from "@/pages/interviewer/InterviewerCalendar";
import ScheduleInterview from "@/pages/interviewer/ScheduleInterview";
import InterviewerCalcomSetup from "@/pages/interviewer/CalcomSetup";

// ── Admin ──────────────────────────────────────────────────────
import { AppLayout as AdminAppLayout } from "@/layouts/admin/AppLayout";
import { ApprovalsPage as AdminApprovalsPage } from "@/pages/admin/Approvals/ApprovalsPage";
import { AuditPage } from "@/pages/admin/Audit/AuditPage";
import AdminRequisitionsPage from "@/pages/admin/AdminRequisitionsPage";
import AdminRequisitionDetailPage from "@/pages/admin/AdminRequisitionDetailPage";
import AdminRequisitionFormPage from "@/pages/admin/AdminRequisitionFormPage";
import AdminRequisitionReviewPage from "@/pages/admin/AdminRequisitionReviewPage";
import { ConfigurationPage } from "@/pages/admin/Configuration/ConfigurationPage";
import { DashboardPage as AdminDashboardPage } from "@/pages/admin/Dashboard/DashboardPage";
import { DepartmentsPage } from "@/pages/admin/Departments/DepartmentsPage";
import { ForbiddenPage } from "@/pages/admin/Forbidden/ForbiddenPage";
import { NotFoundPage } from "@/pages/admin/NotFound/NotFoundPage";
import { PermissionsPage } from "@/pages/admin/Permissions/PermissionsPage";
import AdminCalcomSetup from "@/pages/admin/CalcomSetup";
import { RolesPage } from "@/pages/admin/Roles/RolesPage";
import { UsersPage } from "@/pages/admin/Users/UsersPage";
import InterviewSchedulingPage from "@/pages/admin/InterviewSchedulingPage";

// Recruiter pages take `user` as a prop (the original apps prop-drilled it
// from a top-level App component's local state). Since session now lives in
// Redux, this small adapter layer reads it from there and passes it down
// unchanged, so the recruiter page components themselves didn't need edits.
const RecruiterPagesWithUser = () => {
  const user = useAppSelector((s) => s.auth.user)!;
  return (
    <Routes>
      <Route index element={<Navigate replace to="requisitions" />} />
      <Route path="requisitions" element={<RequisitionsPage user={user} />} />
      <Route path="requisitions/new" element={<RequisitionFormPage mode="create" user={user} />} />
      <Route path="requisitions/:id" element={<RequisitionDetailPage user={user} />} />
      <Route path="requisitions/:id/edit" element={<RequisitionFormPage mode="edit" user={user} />} />
      <Route path="requisitions/:id/rulebook/new" element={<RulebookPage />} />
      <Route path="requisitions/:id/approvals" element={<ApprovalsPage user={user} />} />
      <Route path="requisitions/:id/pipeline" element={<PipelineBoard />} />
      <Route path="requisitions/:id/pipeline/candidate/:candidateId" element={<CandidateProfileView />} />
      <Route path="requisitions/:id/form/builder" element={<FormBuilderPage />} />
      <Route path="requisitions/:id/applications" element={<ApplicationsListPage />} />
      <Route path="requisitions/:id/applications/:aid" element={<ApplicationDetailPage />} />
      <Route path="admin/form-approvals" element={<FormApprovalsPage />} />
      <Route path="admin/requisitions" element={<RequisitionReviewPage user={user} />} />
      <Route path="jobs" element={<PublishedJobsList />} />
    </Routes>
  );
};

const RootRedirect = () => {
  const { isAuthenticated, loading, user } = useAppSelector((s) => s.auth);

  const hostname = window.location.hostname;
  const isCandidateDomain = hostname.startsWith("candidate.");
  const isStaffDomain = hostname.startsWith("staff.");

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </main>
    );
  }

  if (!isAuthenticated) {
    if (isCandidateDomain) return <Navigate replace to="/candidate" />;
    if (isStaffDomain) return <Navigate replace to="/login" />;
    return <Navigate replace to="/login" />; // fallback for main domain / localhost
  }

  const target = user?.role === "hr" ? "recruiter" : user?.role ?? "login";
  return <Navigate replace to={`/${target}`} />;
};

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        {/* Staff login (recruiter / hr / admin / interviewer) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<div className="scope-public"><StaffLoginPage /></div>} />
          <Route path="/forgot-password" element={<div className="scope-public"><ForgotPasswordPage /></div>} />
          <Route path="/reset-password" element={<div className="scope-public"><ResetPasswordPage /></div>} />
          <Route path="/reset-password/sent" element={<div className="scope-public"><ResetPasswordSentPage /></div>} />
          <Route path="/reset-password/success" element={<div className="scope-public"><ResetPasswordSuccessPage /></div>} />
        </Route>

        {/* Candidate: public auth pages + protected dashboard */}
        <Route path="/candidate" element={<div className="scope-candidate"><AuthLayout /></div>}>
          <Route index element={<CandidateLogin />} />
          <Route path="register" element={<CandidateRegister />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route
          element={
            <ProtectedRoute allowedRoles={["candidate"]} loginPath="/candidate" />
          }
        >
          <Route path="/candidate/*" element={<div className="scope-candidate"><CandidateAppLayout /></div>}>
            <Route path="dashboard" element={<CandidateDashboard />} />
            <Route path="profile" element={<CandidateProfile />} />
            <Route path="jobs" element={<CandidateJobs />} />
            <Route path="jobs/:jobId" element={<CandidateJobs />} />
            <Route path="applications" element={<CandidateApplications />} />
            <Route path="settings" element={<CandidateSettings />} />
          </Route>
        </Route>

        {/* Recruiter / HR */}
        <Route element={<ProtectedRoute allowedRoles={["recruiter", "hr", "admin"]} />}>
          <Route path="/recruiter" element={<RecruiterLayout />}>
            <Route index element={<Navigate replace to="dashboard" />} />
            <Route path="dashboard" element={<RecruiterDashboard />} />
            <Route path="requisitions" element={<RequisitionsPage user={useAppSelector((s) => s.auth.user)!} />} />
            <Route path="published-jobs" element={<PublishedJobsList />} />
            <Route path="published-jobs/:id/applications" element={<ApplicationsListPage />} />
            <Route path="applications" element={<ApplicationsListPage />} />
            <Route path="applications/:aid" element={<ApplicationDetailPage />} />
            <Route path="jobs" element={<PublishedJobsList />} />
            <Route path="requisitions/new" element={<RequisitionFormPage mode="create" user={useAppSelector((s) => s.auth.user)!} />} />
            <Route path="requisitions/:id/form/builder" element={<FormBuilderPage />} />
            <Route path="requisitions/:id/edit" element={<RequisitionFormPage mode="edit" user={useAppSelector((s) => s.auth.user)!} />} />
            <Route path="requisitions/:id" element={<RequisitionDetailPage user={useAppSelector((s) => s.auth.user)!} />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="talent-pool" element={<TalentPool />} />
            <Route path="interviews" element={<InterviewPanel />} />
            <Route path="interviews/all" element={<AllInterviews />} />
            <Route path="interviews/schedule" element={<RecruiterInterviewSchedulingPage />} />
            <Route path="schedule-interview" element={<RecruiterInterviewSchedulingPage />} />
              <Route path="integrations" element={<InterviewerCalcomSetup />} />
            <Route path="calcom-setup" element={<Navigate replace to="integrations" />} />
            <Route path="analytics" element={<AssignedInterviews />} />
            <Route path="reports" element={<AssignedInterviews />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<RecruiterSettings />} />
          </Route>
        </Route>

        {/* Interviewer */}
        <Route element={<ProtectedRoute allowedRoles={["interviewer"]} />}>
          <Route path="/interviewer" element={<InterviewerLayout />}>
            <Route index element={<InterviewerDashboard />} />
            <Route path="interviews" element={<AssignedInterviews />} />
            <Route path="calendar" element={<InterviewerCalendar />} />
            <Route path="schedule" element={<ScheduleInterview />} />
            <Route path="schedule-interview" element={<Navigate replace to="schedule" />} />
            <Route path="history" element={<InterviewHistory />} />
            <Route path="feedback" element={<FeedbackForm />} />
            <Route path="notifications" element={<InterviewerNotifications />} />
            <Route path="integrations" element={<InterviewerCalcomSetup />} />
            <Route path="settings" element={<InterviewerSettings />} />
            <Route path="schedule-calendar" element={<ScheduleCalendarView />} />
            <Route path="*" element={<Navigate replace to="calendar" />} />
          </Route>
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminAppLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="applications" element={<ApplicationsListPage />} />
            <Route path="applications/:aid" element={<ApplicationDetailPage />} />
            <Route path="requisitions/:id/applications" element={<ApplicationsListPage />} />
            <Route path="requisitions/:id/applications/:aid" element={<ApplicationDetailPage />} />
            <Route path="requisitions" element={<AdminRequisitionsPage user={useAppSelector((s) => s.auth.user)!} />} />
            <Route path="requisitions/new" element={<AdminRequisitionFormPage mode="create" user={useAppSelector((s) => s.auth.user)!} />} />
            <Route path="requisitions/:id/form/builder" element={<FormBuilderPage />} />
            <Route path="requisitions/:id/edit" element={<AdminRequisitionFormPage mode="edit" user={useAppSelector((s) => s.auth.user)!} />} />
            <Route path="requisitions/:id" element={<AdminRequisitionDetailPage user={useAppSelector((s) => s.auth.user)!} />} />
            <Route path="requisitions/review" element={<AdminRequisitionReviewPage user={useAppSelector((s) => s.auth.user)!} />} />
            <Route path="forms/approvals" element={<FormApprovalsPage />} />
            <Route path="pipeline" element={<Pipeline />} />
            <Route path="candidates" element={<Candidates />} />
            <Route path="talent-pool" element={<TalentPool />} />
            <Route path="interviews" element={<AssignedInterviews />} />
            <Route path="interviews/all" element={<AllInterviews />} />
            <Route path="schedule-interview" element={<InterviewSchedulingPage />} />
            <Route path="analytics" element={<AssignedInterviews />} />
            <Route path="reports" element={<AssignedInterviews />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<RecruiterSettings />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="permissions" element={<PermissionsPage />} />
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="configuration" element={<ConfigurationPage />} />
            <Route path="audit" element={<AuditPage />} />
            <Route path="approvals" element={<AdminApprovalsPage />} />
        <Route path="integrations" element={<AdminCalcomSetup />} />
        <Route path="calcom-setup" element={<Navigate replace to="integrations" />} />
          </Route>
        </Route>

        {/* Error pages */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </BrowserRouter>
  );
}
