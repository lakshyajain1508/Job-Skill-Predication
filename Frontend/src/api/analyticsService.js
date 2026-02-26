import apiClient from './apiClient'

const fallbackAnalytics = {
  demandTrend: [],
  growthData: [],
  radarSkills: [],
}

export async function fetchAnalytics() {
  try {
    const { data } = await apiClient.get('/analytics')
    return data
  } catch {
    return fallbackAnalytics
  }
}
