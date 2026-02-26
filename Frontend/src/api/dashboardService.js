import apiClient from './apiClient'

const fallbackDashboard = {
  skill_match: 0,
  market_demand: 0,
  missing_skills_count: 0,
  career_prediction: 'Data Scientist',
}

export async function fetchDashboard() {
  try {
    const { data } = await apiClient.get('/dashboard')
    return data
  } catch {
    return fallbackDashboard
  }
}
