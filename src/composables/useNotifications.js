/**
 * Composable pour gérer les notifications toast.
 * 
 * Fournit une interface pour afficher des notifications
 * de succès, d'erreur, d'avertissement et d'information.
 */

import { ref } from 'vue'

const notifications = ref([])
let notificationId = 0

/**
 * Types de notifications disponibles.
 */
export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

/**
 * Ajoute une notification.
 * 
 * @param {string} message - Message de la notification
 * @param {string} type - Type de notification (success, error, warning, info)
 * @param {number} duration - Durée d'affichage en millisecondes (0 = permanent)
 * @returns {number} ID de la notification
 */
function addNotification(message, type = NotificationType.INFO, duration = 5000) {
  const id = ++notificationId
  const notification = {
    id,
    message,
    type,
    duration,
    timestamp: Date.now()
  }
  
  notifications.value.push(notification)
  
  // Supprimer automatiquement après la durée spécifiée
  if (duration > 0) {
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }
  
  return id
}

/**
 * Supprime une notification.
 * 
 * @param {number} id - ID de la notification
 */
function removeNotification(id) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

/**
 * Supprime toutes les notifications.
 */
function clearNotifications() {
  notifications.value = []
}

/**
 * Affiche une notification de succès.
 * 
 * @param {string} message - Message de succès
 * @param {number} duration - Durée d'affichage
 */
function showSuccess(message, duration = 5000) {
  return addNotification(message, NotificationType.SUCCESS, duration)
}

/**
 * Affiche une notification d'erreur.
 * 
 * @param {string} message - Message d'erreur
 * @param {number} duration - Durée d'affichage (0 = permanent)
 */
function showError(message, duration = 7000) {
  return addNotification(message, NotificationType.ERROR, duration)
}

/**
 * Affiche une notification d'avertissement.
 * 
 * @param {string} message - Message d'avertissement
 * @param {number} duration - Durée d'affichage
 */
function showWarning(message, duration = 6000) {
  return addNotification(message, NotificationType.WARNING, duration)
}

/**
 * Affiche une notification d'information.
 * 
 * @param {string} message - Message d'information
 * @param {number} duration - Durée d'affichage
 */
function showInfo(message, duration = 5000) {
  return addNotification(message, NotificationType.INFO, duration)
}

/**
 * Composable pour utiliser les notifications.
 * 
 * @returns {Object} Méthodes pour gérer les notifications
 */
export function useNotifications() {
  return {
    notifications,
    addNotification,
    removeNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

