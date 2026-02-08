/**
 * Configuration Axios pour les appels API.
 * 
 * Configure les interceptors pour gérer les tokens JWT et les erreurs.
 */

import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Important pour CSRF et cookies
})

// Interceptor pour ajouter le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    // Si c'est FormData, laisser Axios gérer le Content-Type automatiquement
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Flag pour éviter les refresh multiples simultanés
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Interceptor pour gérer les erreurs et le refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    // Ne pas intercepter les erreurs sur les endpoints d'authentification
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/token/')
    
    // Si l'erreur est 401 et qu'on n'a pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      // Si on est déjà en train de rafraîchir, ajouter la requête à la queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch(err => {
            return Promise.reject(err)
          })
      }
      
      originalRequest._retry = true
      isRefreshing = true
      
      const authStore = useAuthStore()
      
      // Vérifier que le refresh token existe
      if (!authStore.refreshToken) {
        isRefreshing = false
        authStore.logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }
      
      try {
        await authStore.refreshAccessToken()
        isRefreshing = false
        processQueue(null, authStore.token)
        
        // Réessayer la requête avec le nouveau token
        originalRequest.headers.Authorization = `Bearer ${authStore.token}`
        return api(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        processQueue(refreshError, null)
        
        // Si le refresh échoue, déconnecter l'utilisateur
        authStore.logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export default api

