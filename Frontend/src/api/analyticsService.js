import apiClient from './apiClient'

const fallbackAnalytics = {
  demandTrend: [],
  growthData: [],
  radarSkills: [],
  growthIndex: {},
  volatility: {},
  saturation: {},
}

export async function fetchAnalytics() {
  try {
    const { data } = await apiClient.get('/analytics')
    return data
  } catch {
    return fallbackAnalytics
  }
}
