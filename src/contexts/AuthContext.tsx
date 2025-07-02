import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthTokens } from '../types'
import { apiService } from '../lib/api'

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = !!user

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        try {
          const userData = await apiService.auth.getUser()
          setUser(userData)
        } catch (error) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const tokens = await apiService.auth.login(username, password)
      
      localStorage.setItem('accessToken', tokens.access)
      localStorage.setItem('refreshToken', tokens.refresh)

      const userData = await apiService.auth.getUser()
      setUser(userData)
    } catch (error) {
      throw new Error('Invalid credentials')
    }
  }

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}