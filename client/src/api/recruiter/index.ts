import axios from 'axios'
import { refreshToken } from "./auth"
import { TOKEN_KEY } from "../shared/client"

// VITE_API_URL is unset by default in this project (see .env.example) — the
// app is meant to run through Vite's dev proxy at /api, not a separate
// origin. Falling through to `undefined` meant every request here resolved
// against the frontend's own origin (e.g. GET /requisitions instead of
// GET /api/requisitions) and never hit the backend at all.
const BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE,
  withCredentials: true
})

// Authorization header no longer needed - cookies sent automatically with withCredentials: true

// ─── Interceptor: 401 → refresh → retry once ──────────────────────────────────
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config

    if (err.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(() => api(originalRequest)).catch((e) => Promise.reject(e))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        // Cookie-based refresh - no localStorage token needed
        const res = await refreshToken()
        processQueue(null)
        return api(originalRequest)
      } catch (refreshErr) {
        processQueue(refreshErr)
        // Don't redirect on refresh failure - let the auth state handle it
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(err)
  }
)

export default api
