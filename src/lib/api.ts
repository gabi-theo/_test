import axios from 'axios'
import { mockApi } from './mockApi'

export const BACKEND_URL = 'http://localhost:8002'
export const AI_HEDGE_FUND_URL = 'http://localhost:8003'

// Environment flag to enable/disable mock mode
const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true' || true // Default to true for demo

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${BACKEND_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          })
          
          const { access } = response.data
          localStorage.setItem('accessToken', access)
          
          originalRequest.headers.Authorization = `Bearer ${access}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// API wrapper that can switch between real and mock APIs
export const apiService = {
  // Auth endpoints
  auth: {
    login: async (username: string, password: string) => {
      if (USE_MOCK_API) {
        return mockApi.auth.login(username, password)
      }
      const response = await api.post('/auth/login/', { username, password })
      return response.data
    },
    
    getUser: async () => {
      if (USE_MOCK_API) {
        return mockApi.auth.getUser()
      }
      const response = await api.get('/auth/user/')
      return response.data
    },
  },

  // Journals endpoints
  journals: {
    list: async (params?: any) => {
      if (USE_MOCK_API) {
        return mockApi.journals.list(params)
      }
      const response = await api.get('/port/journals/', { params })
      return response.data
    },
    
    create: async (data: any) => {
      if (USE_MOCK_API) {
        return mockApi.journals.create(data)
      }
      const response = await api.post('/port/journals/', data)
      return response.data
    },
    
    update: async (id: number, data: any) => {
      if (USE_MOCK_API) {
        return mockApi.journals.update(id, data)
      }
      const response = await api.put(`/port/journals/${id}/`, data)
      return response.data
    },
    
    delete: async (id: number) => {
      if (USE_MOCK_API) {
        return mockApi.journals.delete(id)
      }
      await api.delete(`/port/journals/${id}/`)
    },
  },

  // Bond Accruals endpoints
  bondAccruals: {
    list: async (params?: any) => {
      if (USE_MOCK_API) {
        return mockApi.bondAccruals.list(params)
      }
      const response = await api.get('/port/bond-accruals/', { params })
      return response.data
    },
    
    generate: async () => {
      if (USE_MOCK_API) {
        return mockApi.bondAccruals.generate()
      }
      const response = await api.post('/port/bond-accruals/', {})
      return response.data
    },
    
    delete: async (id: number) => {
      if (USE_MOCK_API) {
        return mockApi.bondAccruals.delete(id)
      }
      await api.delete(`/port/bond-accruals/${id}/`)
    },
  },

  // Instruments endpoints
  instruments: {
    list: async (params?: any) => {
      if (USE_MOCK_API) {
        return mockApi.instruments.list(params)
      }
      const response = await api.get('/port/instruments/', { params })
      return response.data
    },
    
    create: async (data: any) => {
      if (USE_MOCK_API) {
        return mockApi.instruments.create(data)
      }
      const response = await api.post('/port/instruments/', data)
      return response.data
    },
    
    update: async (id: number, data: any) => {
      if (USE_MOCK_API) {
        return mockApi.instruments.update(id, data)
      }
      const response = await api.put(`/port/instruments/${id}/`, data)
      return response.data
    },
    
    delete: async (id: number) => {
      if (USE_MOCK_API) {
        return mockApi.instruments.delete(id)
      }
      await api.delete(`/port/instruments/${id}/`)
    },
  },

  // AI Hedge Fund endpoints
  aiHedgeFund: {
    getAgents: async () => {
      if (USE_MOCK_API) {
        return mockApi.aiHedgeFund.getAgents()
      }
      const response = await fetch(`${AI_HEDGE_FUND_URL}/hedge-fund/agents`)
      return response.json()
    },
    
    getModels: async () => {
      if (USE_MOCK_API) {
        return mockApi.aiHedgeFund.getModels()
      }
      const response = await fetch(`${AI_HEDGE_FUND_URL}/hedge-fund/language-models`)
      return response.json()
    },
    
    runAnalysis: async function* (config: any) {
      if (USE_MOCK_API) {
        yield* mockApi.aiHedgeFund.runAnalysis(config)
        return
      }
      
      // Real API implementation would go here
      const response = await fetch(`${AI_HEDGE_FUND_URL}/hedge-fund/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      // Handle streaming response...
    }
  },

  // Add other endpoints...
  partners: {
    list: async () => {
      if (USE_MOCK_API) {
        return mockApi.partners.list()
      }
      const response = await api.get('/port/partners/')
      return response.data
    }
  },
  
  portfolios: {
    list: async (params?: any) => {
      if (USE_MOCK_API) {
        return mockApi.portfolios.list(params)
      }
      const response = await api.get('/port/portfolios/', { params })
      return response.data
    }
  },
  
  operations: {
    list: async (params?: any) => {
      if (USE_MOCK_API) {
        return mockApi.operations.list(params)
      }
      const response = await api.get('/port/operations/', { params })
      return response.data
    }
  },
  
  accountMappings: {
    list: async () => {
      if (USE_MOCK_API) {
        return mockApi.accountMappings.list()
      }
      const response = await api.get('/port/account-mapping/')
      return response.data
    }
  },
  
  deposits: {
    list: async (params?: any) => {
      if (USE_MOCK_API) {
        return mockApi.deposits.list(params)
      }
      const response = await api.get('/port/deposits/', { params })
      return response.data
    }
  },
  
  errors: {
    list: async (params?: any) => {
      if (USE_MOCK_API) {
        return mockApi.errors.list(params)
      }
      const response = await api.get('/port/errors/', { params })
      return response.data
    }
  }
}

export default api