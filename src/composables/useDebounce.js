/**
 * Composable pour implémenter le debounce.
 * 
 * Utile pour optimiser les recherches et autres interactions
 * qui nécessitent d'attendre que l'utilisateur ait fini de taper.
 */

import { ref, watch } from 'vue'

/**
 * Composable pour créer une valeur avec debounce.
 * 
 * @param {any} initialValue - Valeur initiale
 * @param {number} delay - Délai en millisecondes (défaut: 300)
 * @returns {Object} Objet avec la valeur debounced et les méthodes de contrôle
 */
export function useDebounce(initialValue, delay = 300) {
  const value = ref(initialValue)
  const debouncedValue = ref(initialValue)
  let timeoutId = null
  
  /**
   * Met à jour la valeur et déclenche le debounce.
   * 
   * @param {any} newValue - Nouvelle valeur
   */
  function setValue(newValue) {
    value.value = newValue
    
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      debouncedValue.value = newValue
      timeoutId = null
    }, delay)
  }
  
  /**
   * Annule le debounce en cours.
   */
  function cancel() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }
  
  /**
   * Force la mise à jour immédiate de la valeur debounced.
   */
  function flush() {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    debouncedValue.value = value.value
  }
  
  // Watcher pour mettre à jour automatiquement si la valeur change
  watch(value, (newValue) => {
    setValue(newValue)
  })
  
  return {
    value,
    debouncedValue,
    setValue,
    cancel,
    flush
  }
}

