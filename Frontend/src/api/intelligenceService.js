import apiClient from './apiClient'

const fallbackGrowth = { growth: {} }
const fallbackVolatility = { volatility: {} }
const fallbackSaturation = { saturation: {} }
const fallbackPortfolio = {
  salary_projection: '8-12 LPA',
  growth_potential: 50,
  risk_level: 'Medium',
}
const fallbackRisk = { career_risk_score: 50 }

export async function fetchGrowthIndex() {
  try {
    const { data } = await apiClient.get('/intelligence/growth')
    return data
  } catch {
    return fallbackGrowth
  }
}

export async function fetchVolatility() {
  try {
    const { data } = await apiClient.get('/intelligence/volatility')
    return data
  } catch {
    return fallbackVolatility
  }
}

export async function fetchSaturation() {
  try {
    const { data } = await apiClient.get('/intelligence/saturation')
    return data
  } catch {
    return fallbackSaturation
  }
}

export async function fetchPortfolio(skills = []) {
  try {
    const { data } = await apiClient.post('/intelligence/portfolio', { skills })
    return data
  } catch {
    return fallbackPortfolio
  }
}

export async function fetchCareerRisk(skills = []) {
  try {
    const { data } = await apiClient.post('/intelligence/risk', { skills })
    return data
  } catch {
    return fallbackRisk
  }
}
