// ─────────────────────────────────────────────────────────────────────────────
// Event catalog — every cross-module event in the monolith, in one place.
// This is documentation as much as code: it replaces the "Publishes / Consumes"
// lists that used to live in each repo's own AGENTS.md. Keep this in sync
// whenever a publish/consume relationship changes — same discipline as
// before ("don't change a published event's shape without checking every
// consumer"), just no longer requires pinging another team's repo to do it.
// ─────────────────────────────────────────────────────────────────────────────

export const events = {
  // ── Candidate module ──────────────────────────────────────────────────────
  CandidateRegistered: "CandidateRegistered", // publishes: candidates | consumes: (none yet)
  ResumeUploaded: "ResumeUploaded", // publishes: candidates | consumes: ai-evaluation-service (external)

  // ── AI evaluation service (external Python service, still separate) ───────
  ResumeParsed: "ResumeParsed", // publishes: ai-evaluation-service (external) | consumes: (none yet)
  ResumeScreened: "ResumeScreened", // publishes: ai-evaluation-service (external) | consumes: recruitment
  FitmentScoreCalculated: "FitmentScoreCalculated", // publishes: ai-evaluation-service (external) | consumes: candidates
  AIInterviewCompleted: "AIInterviewCompleted", // publishes: ai-evaluation-service (external) | consumes: interviews

  // ── Recruitment module ────────────────────────────────────────────────────
  RequisitionPublished: "RequisitionPublished", // publishes: recruitment | consumes: (none yet — was analytics, out of scope)
  CandidateShortlisted: "CandidateShortlisted", // publishes: recruitment | consumes: interviews
  OfferGenerated: "OfferGenerated", // publishes: recruitment | consumes: candidates
  CandidateRejected: "CandidateRejected", // publishes: recruitment | consumes: admin-rbac (audit)
  RequisitionApproved: "RequisitionApproved", // publishes: admin-rbac | consumes: recruitment
  RequisitionRejected: "RequisitionRejected", // publishes: admin-rbac | consumes: recruitment

  // ── Interviews module ──────────────────────────────────────────────────────
  InterviewerAssigned: "InterviewerAssigned", // publishes: interviews | consumes: (none yet)
  InterviewScheduled: "InterviewScheduled", // publishes: interviews | consumes: candidates
  InterviewCompleted: "InterviewCompleted", // publishes: interviews | consumes: (none yet)
  FeedbackSubmitted: "FeedbackSubmitted", // publishes: interviews | consumes: recruitment

  // ── Admin-RBAC module ──────────────────────────────────────────────────────
  UserRoleChanged: "UserRoleChanged", // publishes: admin-rbac | consumes: (none yet)
} as const;

export type EventName = (typeof events)[keyof typeof events];

// Events admin-rbac's audit log subscribes to broadly (mirrors the old
// admin-service's "consumes almost everything for audit" behavior). Kept as
// an explicit list rather than "subscribe to all" so it's obvious in code
// review when a new event silently starts getting audited (or doesn't).
export const AUDIT_LOGGED_EVENTS: EventName[] = [
  events.CandidateRegistered,
  events.ResumeUploaded,
  events.RequisitionPublished,
  events.CandidateShortlisted,
  events.OfferGenerated,
  events.CandidateRejected,
  events.RequisitionApproved,
  events.RequisitionRejected,
  events.InterviewerAssigned,
  events.InterviewScheduled,
  events.InterviewCompleted,
  events.FeedbackSubmitted,
  events.UserRoleChanged,
];
