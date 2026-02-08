/**
 * Composable pour gérer les états de chargement de manière standardisée.
 * 
 * Fournit une interface cohérente pour gérer les états de chargement
 * dans les composants Vue.
 */

import { ref, computed } from 'vue'

/**
 * Composable pour gérer les états de chargement.
 * 
 * @returns {Object} Objet contenant les états et méthodes de chargement
 */
export function useLoadingState() {
  const loading = ref(false)
  const loadingActions = ref(new Map())
  
  /**
   * Indique si au moins une action est en cours de chargement.
   */
  const isLoading = computed(() => {
    return loading.value || loadingActions.value.size > 0
  })
  
  /**
   * Démarre le chargement global.
   */
  function startLoading() {
    loading.value = true
  }
  
  /**
   * Arrête le chargement global.
   */
  function stopLoading() {
    loading.value = false
  }
  
  /**
   * Démarre le chargement pour une action spécifique.
   * 
   * @param {string} actionName - Nom de l'action
   */
  function startActionLoading(actionName) {
    loadingActions.value.set(actionName, true)
  }
  
  /**
   * Arrête le chargement pour une action spécifique.
   * 
   * @param {string} actionName - Nom de l'action
   */
  function stopActionLoading(actionName) {
    loadingActions.value.delete(actionName)
  }
  
  /**
   * Vérifie si une action spécifique est en cours de chargement.
   * 
   * @param {string} actionName - Nom de l'action
   * @returns {boolean} True si l'action est en cours de chargement
   */
  function isActionLoading(actionName) {
    return loadingActions.value.has(actionName)
  }
  
  /**
   * Wrapper pour exécuter une fonction asynchrone avec gestion automatique du chargement.
   * 
   * @param {Function} asyncFn - Fonction asynchrone à exécuter
   * @param {string} actionName - Nom de l'action (optionnel, pour chargement granulaire)
   * @returns {Promise} Promise de la fonction exécutée
   */
  async function withLoading(asyncFn, actionName = null) {
    try {
      if (actionName) {
        startActionLoading(actionName)
      } else {
        startLoading()
      }
      return await asyncFn()
    } finally {
      if (actionName) {
        stopActionLoading(actionName)
      } else {
        stopLoading()
      }
    }
  }
  
  /**
   * Réinitialise tous les états de chargement.
   */
  function resetLoading() {
    loading.value = false
    loadingActions.value.clear()
  }
  
  return {
    loading,
    isLoading,
    loadingActions: computed(() => Object.fromEntries(loadingActions.value)),
    startLoading,
    stopLoading,
    startActionLoading,
    stopActionLoading,
    isActionLoading,
    withLoading,
    resetLoading
  }
}

