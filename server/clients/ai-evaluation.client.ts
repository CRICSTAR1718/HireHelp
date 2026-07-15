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

export interface EvaluationRequest {
  application_id: string
  candidate_id: string
  job_id: string
  resume_url: string
  job_description: string
}

export interface EvaluationResponse {
  application_id: string
  fitment_score: number
  recommendation: string
  matched_skills: string[]
  missing_skills: string[]
  strengths: string[]
  weaknesses: string[]
}

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

  async evaluateApplication(request: EvaluationRequest): Promise<EvaluationResponse> {
    if (!env.AI_EVALUATION_SERVICE_URL) {
      throw new Error('AI_EVALUATION_SERVICE_URL not configured')
    }

    const url = `${env.AI_EVALUATION_SERVICE_URL}/api/v1/evaluation`
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-service': 'recruitment-service'
      },
      body: JSON.stringify(request)
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error(`[ai-evaluation-client] Failed to evaluate application: ${res.status} - ${errorText}`)
      throw new Error(`AI evaluation failed: ${res.status}`)
    }

    return res.json() as Promise<EvaluationResponse>
  }
};
