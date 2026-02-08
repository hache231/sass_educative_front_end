/**
 * Composable pour gérer les erreurs de manière standardisée.
 * 
 * Fournit une interface cohérente pour gérer et afficher les erreurs
 * dans les composants Vue.
 */

import { ref, computed } from 'vue'
import { useNotifications } from './useNotifications'

/**
 * Composable pour gérer les erreurs.
 * 
 * @returns {Object} Objet contenant les états et méthodes de gestion d'erreurs
 */
export function useErrorHandler() {
  const error = ref(null)
  const fieldErrors = ref({})
  const { showError: showErrorNotification, showSuccess, showWarning, showInfo } = useNotifications()
  
  /**
   * Indique s'il y a des erreurs.
   */
  const hasError = computed(() => {
    return error.value !== null || Object.keys(fieldErrors.value).length > 0
  })
  
  /**
   * Définit une erreur globale.
   * 
   * @param {string|Object} errorMessage - Message d'erreur ou objet d'erreur
   */
  function setError(errorMessage) {
    if (typeof errorMessage === 'string') {
      error.value = errorMessage
    } else if (errorMessage?.message) {
      error.value = errorMessage.message
    } else if (errorMessage?.detail) {
      error.value = errorMessage.detail
    } else {
      error.value = 'Une erreur est survenue'
    }
  }
  
  /**
   * Définit les erreurs de champs.
   * 
   * @param {Object} errors - Objet avec les erreurs par champ
   */
  function setFieldErrors(errors) {
    fieldErrors.value = { ...errors }
  }
  
  /**
   * Définit une erreur pour un champ spécifique.
   * 
   * @param {string} fieldName - Nom du champ
   * @param {string} errorMessage - Message d'erreur
   */
  function setFieldError(fieldName, errorMessage) {
    fieldErrors.value[fieldName] = errorMessage
  }
  
  /**
   * Récupère l'erreur d'un champ spécifique.
   * 
   * @param {string} fieldName - Nom du champ
   * @returns {string|null} Message d'erreur ou null
   */
  function getFieldError(fieldName) {
    return fieldErrors.value[fieldName] || null
  }
  
  /**
   * Traite une erreur API et extrait les messages d'erreur.
   * 
   * @param {Error} apiError - Erreur de l'API
   * @param {boolean} showToast - Afficher une notification toast (défaut: true)
   */
  function handleApiError(apiError, showToast = true) {
    const errorData = apiError.response?.data
    
    if (!errorData) {
      const errorMessage = apiError.message || 'Une erreur est survenue'
      setError(errorMessage)
      if (showToast) {
        showErrorNotification(errorMessage)
      }
      return
    }
    
    // Si c'est une erreur de validation avec des champs
    if (typeof errorData === 'object' && !errorData.detail) {
      const errors = {}
      const messages = []
      
      for (const [field, msgs] of Object.entries(errorData)) {
        if (Array.isArray(msgs)) {
          errors[field] = msgs[0]
          messages.push(`${field}: ${msgs.join(', ')}`)
        } else if (msgs) {
          errors[field] = msgs
          messages.push(`${field}: ${msgs}`)
        }
      }
      
      setFieldErrors(errors)
      const errorMessage = messages.length > 0 ? messages.join(' | ') : 'Erreur de validation'
      setError(errorMessage)
      if (showToast) {
        showErrorNotification(errorMessage)
      }
    } else {
      // Erreur globale
      const errorMessage = errorData.detail || errorData.message || 'Une erreur est survenue'
      setError(errorMessage)
      if (showToast) {
        showErrorNotification(errorMessage)
      }
    }
  }
  
  /**
   * Affiche un message de succès.
   * 
   * @param {string} message - Message de succès
   */
  function showSuccessMessage(message) {
    showSuccess(message)
  }
  
  /**
   * Affiche un message d'avertissement.
   * 
   * @param {string} message - Message d'avertissement
   */
  function showWarningMessage(message) {
    showWarning(message)
  }
  
  /**
   * Affiche un message d'information.
   * 
   * @param {string} message - Message d'information
   */
  function showInfoMessage(message) {
    showInfo(message)
  }
  
  /**
   * Réinitialise toutes les erreurs.
   */
  function clearErrors() {
    error.value = null
    fieldErrors.value = {}
  }
  
  /**
   * Réinitialise l'erreur d'un champ spécifique.
   * 
   * @param {string} fieldName - Nom du champ
   */
  function clearFieldError(fieldName) {
    delete fieldErrors.value[fieldName]
  }
  
  return {
    error,
    fieldErrors,
    hasError,
    setError,
    setFieldErrors,
    setFieldError,
    getFieldError,
    handleApiError,
    clearErrors,
    clearFieldError,
    showSuccessMessage,
    showWarningMessage,
    showInfoMessage
  }
}

