import apiClient from './apiClient'

const fallbackUpload = {
  detected_skills: [],
  total_detected: 0,
}

export async function uploadResume(file) {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await apiClient.post('/upload-resume', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data
  } catch {
    return fallbackUpload
  }
}
