import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class AudioAPI {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async healthCheck() {
    try {
      const response = await this.client.get('/health')
      return response.data
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }

  async uploadAudio(file) {
    const formData = new FormData()
    formData.append('audio', file)

    try {
      const response = await this.client.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    }
  }

  async analyzeAudio(filepath) {
    try {
      const response = await this.client.post('/analyze', { filepath })
      return response.data
    } catch (error) {
      console.error('Analysis failed:', error)
      throw error
    }
  }

  async processAudio(file, settings) {
    const formData = new FormData()
    formData.append('audio', file)
    formData.append('settings', JSON.stringify(settings))

    try {
      const response = await this.client.post('/process', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5 minutes timeout for processing
      })
      return response.data
    } catch (error) {
      console.error('Processing failed:', error)
      throw error
    }
  }

  getDownloadUrl(filename) {
    return `${API_BASE_URL}/download/${filename}`
  }
}

export default new AudioAPI()
