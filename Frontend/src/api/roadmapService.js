import apiClient from './apiClient'

const fallbackRoadmap = {
  steps: [],
}

export async function fetchRoadmap() {
  try {
    const { data } = await apiClient.get('/roadmap')
    return data
  } catch {
    return fallbackRoadmap
  }
}
