import { onEvent } from './bus';
import { events, AUDIT_LOGGED_EVENTS } from './catalog';

// ─────────────────────────────────────────────────────────────────────────────
// Call registerAllEventHandlers() once at server startup (from index.ts),
// same spot each old repo used to call its startConsumer()/connectConsumer().
//
// This file is the one place that shows the full map of "event -> who
// listens" across the whole monolith — worth keeping it as a flat list
// rather than letting each module self-register via a side-effecting import,
// so a reviewer can see the entire wiring without hunting through modules.
// ─────────────────────────────────────────────────────────────────────────────

export async function registerAllEventHandlers(): Promise<void> {
  // ── Candidates module ───────────────────────────────────────────────────
  const { handleFitmentScoreCalculated } = await import(
    '../modules/candidates/events/handlers/fitment-score-handler'
  );
  const { handleInterviewScheduled } = await import(
    '../modules/candidates/events/handlers/interview-scheduled-handler'
  );
  const { handleOfferGenerated } = await import(
    '../modules/candidates/events/handlers/offer-generated-handler'
  );
  onEvent(events.FitmentScoreCalculated, handleFitmentScoreCalculated);
  onEvent(events.InterviewScheduled, handleInterviewScheduled);
  onEvent(events.OfferGenerated, handleOfferGenerated);

  // ── Recruitment module ──────────────────────────────────────────────────
  const { handleResumeScreened } = await import(
    '../modules/recruitment/events/handlers/resumeScreened.handler'
  );
  const { handleCandidateShortlisted: handleCandidateShortlistedForPipeline } = await import(
    '../modules/recruitment/events/handlers/candidateShortlisted.handler'
  );
  const { handleFeedbackSubmitted } = await import(
    '../modules/recruitment/events/handlers/feedbackSubmitted.handler'
  );
  const { handleCandidateRejected } = await import(
    '../modules/recruitment/events/handlers/candidateRejected.handler'
  );
  onEvent(events.ResumeScreened, handleResumeScreened);
  onEvent(events.CandidateShortlisted, handleCandidateShortlistedForPipeline);
  onEvent(events.FeedbackSubmitted, handleFeedbackSubmitted);
  onEvent(events.CandidateRejected, handleCandidateRejected);

  // ── Interviews module ───────────────────────────────────────────────────
  const { handleCandidateShortlisted: handleCandidateShortlistedForAssignment } = await import(
    '../modules/interviews/events/handlers/candidateShortlisted.handler'
  );
  const { handleAIInterviewCompleted } = await import(
    '../modules/interviews/events/handlers/aiInterviewCompleted.handler'
  );
  onEvent(events.CandidateShortlisted, handleCandidateShortlistedForAssignment);
  onEvent(events.AIInterviewCompleted, handleAIInterviewCompleted);

  // ── Admin-RBAC module: broad audit-log subscription ─────────────────────
  const { handleAuditableEvent } = await import(
    '../modules/admin-rbac/events/handlers/auditLog.handler'
  );
  for (const eventName of AUDIT_LOGGED_EVENTS) {
    onEvent(eventName, (payload: Record<string, unknown>) =>
      handleAuditableEvent(eventName, payload)
    );
  }

  console.log(
    `[events] registered handlers for ${new Set([...AUDIT_LOGGED_EVENTS]).size} audited event types, plus module-specific handlers`
  );
}
