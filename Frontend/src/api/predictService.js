import apiClient from './apiClient'

const fallbackPrediction = {
  match_score: 0,
  missing_skills: [],
  career_prediction: 'Data Scientist',
}

export async function runPrediction(payload) {
  try {
    const { data } = await apiClient.post('/predict', payload)
    return data
  } catch {
    return fallbackPrediction
  }
}
