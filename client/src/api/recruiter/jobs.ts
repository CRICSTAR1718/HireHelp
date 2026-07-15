import api from "./index"

export interface Job {
  id: string
  memo_no: string
  title: string
  department?: string
  location?: string
  employment_type?: string
  work_mode?: string
  number_of_openings: number
  published_at?: string
  application_deadline?: string
  hiring_manager: string
}

export const getPublishedJobs = async (): Promise<Job[]> => {
  const res = await api.get('/jobs')
  return res.data
}

export const getJobDetails = async (id: string): Promise<any> => {
  const res = await api.get(`/jobs/${id}`)
  return res.data
}
