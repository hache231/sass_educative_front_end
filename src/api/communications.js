/**
 * Service API pour la gestion des communications (notifications, messages, annonces).
 */

import api from './index'

// ==================== NOTIFICATIONS ====================

/**
 * Récupère la liste des notifications avec filtres optionnels.
 * @param {Object} params - Paramètres de filtrage (is_read, notification_type)
 * @returns {Promise} Réponse API
 */
export const getNotifications = (params = {}) => {
  return api.get('/communications/notifications/', { params })
}

/**
 * Récupère une notification par son ID.
 * @param {number} id - ID de la notification
 * @returns {Promise} Réponse API
 */
export const getNotification = (id) => {
  return api.get(`/communications/notifications/${id}/`)
}

/**
 * Crée une nouvelle notification.
 * @param {Object} data - Données de la notification
 * @returns {Promise} Réponse API
 */
export const createNotification = (data) => {
  return api.post('/communications/notifications/', data)
}

/**
 * Met à jour une notification.
 * @param {number} id - ID de la notification
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateNotification = (id, data) => {
  return api.put(`/communications/notifications/${id}/`, data)
}

/**
 * Supprime une notification.
 * @param {number} id - ID de la notification
 * @returns {Promise} Réponse API
 */
export const deleteNotification = (id) => {
  return api.delete(`/communications/notifications/${id}/`)
}

/**
 * Marque une notification comme lue.
 * @param {number} id - ID de la notification
 * @returns {Promise} Réponse API
 */
export const markNotificationAsRead = (id) => {
  return api.post(`/communications/notifications/${id}/mark-as-read/`)
}

/**
 * Marque toutes les notifications comme lues.
 * @returns {Promise} Réponse API
 */
export const markAllNotificationsAsRead = () => {
  return api.post('/communications/notifications/mark-all-as-read/')
}

/**
 * Récupère le nombre de notifications non lues.
 * @returns {Promise} Réponse API
 */
export const getUnreadNotificationsCount = () => {
  return api.get('/communications/notifications/unread-count/')
}

// ==================== MESSAGES ====================

/**
 * Récupère la liste des messages avec filtres optionnels.
 * @param {Object} params - Paramètres de filtrage (type: 'sent'|'received', is_read)
 * @returns {Promise} Réponse API
 */
export const getMessages = (params = {}) => {
  return api.get('/communications/messages/', { params })
}

/**
 * Récupère un message par son ID.
 * @param {number} id - ID du message
 * @returns {Promise} Réponse API
 */
export const getMessage = (id) => {
  return api.get(`/communications/messages/${id}/`)
}

/**
 * Crée un nouveau message.
 * @param {Object} data - Données du message {recipient, subject, content}
 * @returns {Promise} Réponse API
 */
export const createMessage = (data) => {
  return api.post('/communications/messages/', data)
}

/**
 * Met à jour un message.
 * @param {number} id - ID du message
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateMessage = (id, data) => {
  return api.put(`/communications/messages/${id}/`, data)
}

/**
 * Supprime un message.
 * @param {number} id - ID du message
 * @returns {Promise} Réponse API
 */
export const deleteMessage = (id) => {
  return api.delete(`/communications/messages/${id}/`)
}

/**
 * Marque un message comme lu.
 * @param {number} id - ID du message
 * @returns {Promise} Réponse API
 */
export const markMessageAsRead = (id) => {
  return api.post(`/communications/messages/${id}/mark-as-read/`)
}

/**
 * Récupère le nombre de messages non lus.
 * @returns {Promise} Réponse API
 */
export const getUnreadMessagesCount = () => {
  return api.get('/communications/messages/unread-count/')
}

// ==================== ANNONCES ====================

/**
 * Récupère la liste des annonces avec filtres optionnels.
 * @param {Object} params - Paramètres de filtrage (priority, is_pinned, show_inactive)
 * @returns {Promise} Réponse API
 */
export const getAnnouncements = (params = {}) => {
  return api.get('/communications/announcements/', { params })
}

/**
 * Récupère une annonce par son ID.
 * @param {number} id - ID de l'annonce
 * @returns {Promise} Réponse API
 */
export const getAnnouncement = (id) => {
  return api.get(`/communications/announcements/${id}/`)
}

/**
 * Crée une nouvelle annonce.
 * @param {Object} data - Données de l'annonce
 * @returns {Promise} Réponse API
 */
export const createAnnouncement = (data) => {
  return api.post('/communications/announcements/', data)
}

/**
 * Met à jour une annonce.
 * @param {number} id - ID de l'annonce
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateAnnouncement = (id, data) => {
  return api.put(`/communications/announcements/${id}/`, data)
}

/**
 * Met à jour partiellement une annonce.
 * @param {number} id - ID de l'annonce
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchAnnouncement = (id, data) => {
  return api.patch(`/communications/announcements/${id}/`, data)
}

/**
 * Supprime une annonce.
 * @param {number} id - ID de l'annonce
 * @returns {Promise} Réponse API
 */
export const deleteAnnouncement = (id) => {
  return api.delete(`/communications/announcements/${id}/`)
}

