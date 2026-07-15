import { env } from '../config/env';

// ─────────────────────────────────────────────────────────────────────────────
// The only outbound HTTP client the monolith needs — ai-evaluation-service
// stays a separate Python/FastAPI process (see earlier architecture
// decision). Every other module's cross-domain calls are now in-process
// function calls or events, not HTTP.
//
// CHANGED FROM ORIGINAL: candidate-service's old client hit
// `${API_GATEWAY_URL}/ai-evaluation/...` — routed through the gateway,
// which no longer exists. Calls the service directly via its own env var
// instead. Expand this file as more endpoints are needed (resume parsing
// trigger, fitment sweep, etc.) — one client, used by whichever module
// needs it, instead of duplicating a fetch wrapper per module.
// ─────────────────────────────────────────────────────────────────────────────

export const aiEvaluationClient = {
  async getFitmentScore(applicationId: number | string) {
    const response = await fetch(
      `${env.AI_EVALUATION_SERVICE_URL}/fitment/${applicationId}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch fitment score for ${applicationId}`);
    }
    return response.json();
  },
};
