/**
 * Composable pour protéger les formulaires contre la perte de données.
 * 
 * Fournit une interface pour détecter les modifications non sauvegardées
 * et demander confirmation avant fermeture.
 */

import { ref, computed, onBeforeUnmount } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'

/**
 * Composable pour protéger un formulaire contre la perte de données.
 * 
 * @param {Function} hasUnsavedChanges - Fonction qui retourne true si des modifications non sauvegardées existent
 * @param {Function} onConfirm - Fonction appelée si l'utilisateur confirme la fermeture
 * @returns {Object} Méthodes et états pour gérer la protection du formulaire
 */
export function useFormGuard(hasUnsavedChanges, onConfirm = null) {
  const isDirty = computed(() => hasUnsavedChanges())
  
  /**
   * Vérifie si l'utilisateur peut quitter sans perdre de données.
   * 
   * @returns {boolean} True si l'utilisateur peut quitter
   */
  function canLeave() {
    if (!isDirty.value) {
      return true
    }
    
    return window.confirm(
      'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?'
    )
  }
  
  /**
   * Gère la tentative de fermeture du formulaire.
   * 
   * @param {Function} onClose - Fonction à appeler si l'utilisateur confirme
   * @returns {boolean} True si la fermeture peut avoir lieu
   */
  function handleClose(onClose) {
    if (!isDirty.value) {
      if (onClose) onClose()
      return true
    }
    
    if (canLeave()) {
      if (onConfirm) onConfirm()
      if (onClose) onClose()
      return true
    }
    
    return false
  }
  
  /**
   * Protège la navigation avec Vue Router.
   */
  onBeforeRouteLeave((to, from, next) => {
    if (canLeave()) {
      next()
    } else {
      next(false)
    }
  })
  
  /**
   * Protège contre la fermeture de la fenêtre/navigateur.
   */
  function handleBeforeUnload(event) {
    if (isDirty.value) {
      event.preventDefault()
      event.returnValue = 'Vous avez des modifications non sauvegardées. Êtes-vous sûr de vouloir quitter ?'
      return event.returnValue
    }
  }
  
  // Ajouter l'écouteur d'événement
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    onBeforeUnmount(() => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    })
  }
  
  return {
    isDirty,
    canLeave,
    handleClose
  }
}

