/**
 * Composable pour gérer les permissions de l'utilisateur.
 * 
 * Fournit des fonctions utilitaires pour vérifier les permissions
 * et contrôler l'affichage des éléments de l'interface.
 */

import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ROUTE_PERMISSIONS, ACTION_PERMISSIONS } from '@/constants/permissions'

export function usePermissions() {
  const authStore = useAuthStore()
  
  /**
   * Liste des permissions de l'utilisateur
   */
  const userPermissions = computed(() => {
    return authStore.currentUser?.permissions || []
  })
  
  /**
   * Vérifie si l'utilisateur a une permission spécifique
   * @param {string} permission - Le codename de la permission
   * @returns {boolean}
   */
  function hasPermission(permission) {
    if (!permission) return true // Pas de permission requise = accessible
    
    const user = authStore.currentUser
    if (!user) return false
    
    // Les superadmins ont toutes les permissions
    if (user.is_superadmin) return true
    
    // Les admins d'école ont toutes les permissions
    if (user.is_school_admin) return true
    
    // Vérifier si l'utilisateur a la permission
    return userPermissions.value.includes(permission)
  }
  
  /**
   * Vérifie si l'utilisateur a au moins une des permissions
   * @param {string[]} permissions - Liste des permissions
   * @returns {boolean}
   */
  function hasAnyPermission(permissions) {
    if (!permissions || permissions.length === 0) return true
    return permissions.some(perm => hasPermission(perm))
  }
  
  /**
   * Vérifie si l'utilisateur a toutes les permissions
   * @param {string[]} permissions - Liste des permissions
   * @returns {boolean}
   */
  function hasAllPermissions(permissions) {
    if (!permissions || permissions.length === 0) return true
    return permissions.every(perm => hasPermission(perm))
  }
  
  /**
   * Vérifie si l'utilisateur peut accéder à une route
   * @param {string} routeName - Le nom de la route
   * @returns {boolean}
   */
  function canAccessRoute(routeName) {
    const requiredPermission = ROUTE_PERMISSIONS[routeName]
    if (!requiredPermission) return true // Pas de permission requise = accessible
    
    if (Array.isArray(requiredPermission)) {
      // Au moins une permission requise
      return hasAnyPermission(requiredPermission)
    } else {
      // Une seule permission requise
      return hasPermission(requiredPermission)
    }
  }
  
  /**
   * Vérifie si l'utilisateur peut effectuer une action
   * @param {string} action - Le nom de l'action
   * @returns {boolean}
   */
  function canPerformAction(action) {
    const requiredPermission = ACTION_PERMISSIONS[action]
    return hasPermission(requiredPermission)
  }
  
  return {
    userPermissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessRoute,
    canPerformAction,
  }
}

