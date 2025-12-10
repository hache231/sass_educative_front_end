/**
 * Store Pinia pour les paramètres et configurations.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as settingsApi from '@/api/settings'

export const useSettingsStore = defineStore('settings', () => {
  // État
  const settings = ref(null)
  const roles = ref([])
  const permissions = ref([])
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Getters
  const currentSettings = computed(() => settings.value)
  const activeRoles = computed(() => {
    if (!Array.isArray(roles.value)) {
      return []
    }
    return roles.value.filter(r => r && r.is_active)
  })
  
  // Actions - Settings
  async function fetchSettings() {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.getSettings()
      settings.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des paramètres'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateSettings(data) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.patchSettings(data)
      settings.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Roles
  async function fetchRoles() {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.getRoles()
      // Gérer la pagination si elle est activée, sinon utiliser directement les données
      roles.value = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.results || response.data || [])
      return roles.value
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des rôles'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createRole(data) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.createRole(data)
      // Vérifier que la réponse contient bien des données
      if (response && response.data) {
        roles.value.push(response.data)
        return response.data
      } else {
        throw new Error('Réponse invalide du serveur')
      }
    } catch (err) {
      console.error('Error creating role:', err)
      error.value = err.response?.data || err.message || 'Erreur lors de la création du rôle'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateRole(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.patchRole(id, data)
      const index = roles.value.findIndex(r => r.id === id)
      if (index !== -1) {
        roles.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour du rôle'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteRole(id) {
    loading.value = true
    error.value = null
    try {
      await settingsApi.deleteRole(id)
      roles.value = roles.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression du rôle'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Permissions
  async function fetchPermissions() {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.getPermissionsByCategory()
      permissions.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des permissions'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Users
  async function fetchUsers(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.getUsers(params)
      users.value = response.data.results || response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des utilisateurs'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createUser(data) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.createUser(data)
      users.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création de l\'utilisateur'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateUser(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.patchUser(id, data)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour de l\'utilisateur'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function resetUserPassword(id) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.resetUserPassword(id)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la réinitialisation du mot de passe'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function toggleUserActive(id) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.toggleUserActive(id)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index].is_active = response.data.is_active
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la modification du statut'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - User Roles
  async function fetchUserRoles() {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.getUserRoles()
      // Gérer la pagination si elle est activée, sinon utiliser directement les données
      const data = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.results || response.data || [])
      return data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des rôles utilisateurs'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function assignUserRole(data) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.assignUserRole(data)
      // Rafraîchir les utilisateurs pour mettre à jour les rôles
      await fetchUsers()
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de l\'assignation du rôle'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function removeUserRole(id) {
    loading.value = true
    error.value = null
    try {
      await settingsApi.removeUserRole(id)
      // Rafraîchir les utilisateurs
      await fetchUsers()
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du retrait du rôle'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function getRoleUsers(roleId) {
    loading.value = true
    error.value = null
    try {
      const response = await settingsApi.getRoleUsers(roleId)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des utilisateurs du rôle'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    // État
    settings,
    roles,
    permissions,
    users,
    loading,
    error,
    // Getters
    currentSettings,
    activeRoles,
    // Actions
    fetchSettings,
    updateSettings,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    fetchPermissions,
    fetchUsers,
    createUser,
    updateUser,
    resetUserPassword,
    toggleUserActive,
    fetchUserRoles,
    assignUserRole,
    removeUserRole,
    getRoleUsers
  }
})

