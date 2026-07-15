import * as repo from './logs.repository'

export async function getStatusLogs(requisitionId: string) {
  return repo.findLogs(requisitionId)
}
