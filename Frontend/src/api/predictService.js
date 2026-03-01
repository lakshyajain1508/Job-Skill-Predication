import apiClient from './apiClient'

const fallbackPrediction = {
  match_score: 78,
  missing_skills: ['MLOps', 'A/B Testing', 'Feature Engineering', 'Stakeholder Storytelling'],
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
