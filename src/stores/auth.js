/**
 * Store Pinia pour l'authentification.
 * 
 * Gère l'état d'authentification, les tokens JWT et les informations utilisateur.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/api'

export const useAuthStore = defineStore('auth', () => {
  // État
  const token = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
  
  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const currentUser = computed(() => user.value)
  
  // Actions
  async function login(credentials) {
    try {
      const response = await api.post('/auth/token/', credentials)
      const { access, refresh } = response.data
      
      token.value = access
      refreshToken.value = refresh
      
      localStorage.setItem('access_token', access)
      localStorage.setItem('refresh_token', refresh)
      
      // Récupérer les informations utilisateur
      await fetchUser()
      
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur de connexion'
      }
    }
  }
  
  async function fetchUser() {
    try {
      const response = await api.get('/accounts/users/me/')
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    }
  }
  
  async function refreshAccessToken() {
    try {
      const response = await api.post('/auth/token/refresh/', {
        refresh: refreshToken.value
      })
      const { access } = response.data
      
      token.value = access
      localStorage.setItem('access_token', access)
      
      return access
    } catch (error) {
      logout()
      throw error
    }
  }
  
  function logout() {
    token.value = null
    refreshToken.value = null
    user.value = null
    
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }
  
  return {
    token,
    refreshToken,
    user,
    isAuthenticated,
    currentUser,
    login,
    fetchUser,
    refreshAccessToken,
    logout
  }
})

