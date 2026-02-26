import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const message = error?.response?.data?.detail || error?.message || 'API request failed'

    console.error('[API ERROR]', {
      status,
      message,
      url: error?.config?.url,
      method: error?.config?.method,
      isTimeout: error?.code === 'ECONNABORTED',
    })

    return Promise.reject(error)
  },
)

export default apiClient
