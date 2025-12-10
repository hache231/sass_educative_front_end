/**
 * Service API pour la gestion des documents et ressources.
 */

import api from './index'

// ==================== DOCUMENTS ====================

/**
 * Récupère la liste des documents avec filtres optionnels.
 * @param {Object} params - Paramètres de filtrage (category_id, document_type, is_public)
 * @returns {Promise} Réponse API
 */
export const getDocuments = (params = {}) => {
  return api.get('/documents/documents/', { params })
}

/**
 * Récupère un document par son ID.
 * @param {number} id - ID du document
 * @returns {Promise} Réponse API
 */
export const getDocument = (id) => {
  return api.get(`/documents/documents/${id}/`)
}

/**
 * Crée un nouveau document (avec upload de fichier).
 * @param {FormData} data - Données du document (peut être FormData pour upload)
 * @returns {Promise} Réponse API
 */
export const createDocument = (data) => {
  return api.post('/documents/documents/', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * Met à jour un document.
 * @param {number} id - ID du document
 * @param {Object|FormData} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateDocument = (id, data) => {
  return api.put(`/documents/documents/${id}/`, data)
}

/**
 * Met à jour partiellement un document.
 * @param {number} id - ID du document
 * @param {Object|FormData} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchDocument = (id, data) => {
  return api.patch(`/documents/documents/${id}/`, data)
}

/**
 * Supprime un document.
 * @param {number} id - ID du document
 * @returns {Promise} Réponse API
 */
export const deleteDocument = (id) => {
  return api.delete(`/documents/documents/${id}/`)
}

/**
 * Télécharge le fichier d'un document.
 * @param {number} id - ID du document
 * @returns {Promise} Réponse API (blob)
 */
export const downloadDocument = (id) => {
  return api.get(`/documents/documents/${id}/download/`, {
    responseType: 'blob'
  })
}

// ==================== CATÉGORIES DE DOCUMENTS ====================

/**
 * Récupère la liste des catégories de documents.
 * @returns {Promise} Réponse API
 */
export const getDocumentCategories = () => {
  return api.get('/documents/document-categories/')
}

/**
 * Récupère une catégorie par son ID.
 * @param {number} id - ID de la catégorie
 * @returns {Promise} Réponse API
 */
export const getDocumentCategory = (id) => {
  return api.get(`/documents/document-categories/${id}/`)
}

/**
 * Crée une nouvelle catégorie de documents.
 * @param {Object} data - Données de la catégorie
 * @returns {Promise} Réponse API
 */
export const createDocumentCategory = (data) => {
  return api.post('/documents/document-categories/', data)
}

/**
 * Met à jour une catégorie de documents.
 * @param {number} id - ID de la catégorie
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateDocumentCategory = (id, data) => {
  return api.put(`/documents/document-categories/${id}/`, data)
}

/**
 * Supprime une catégorie de documents.
 * @param {number} id - ID de la catégorie
 * @returns {Promise} Réponse API
 */
export const deleteDocumentCategory = (id) => {
  return api.delete(`/documents/document-categories/${id}/`)
}

// ==================== RESSOURCES ====================

/**
 * Récupère la liste des ressources avec filtres optionnels.
 * @param {Object} params - Paramètres de filtrage (resource_type, show_inactive)
 * @returns {Promise} Réponse API
 */
export const getResources = (params = {}) => {
  return api.get('/documents/resources/', { params })
}

/**
 * Récupère une ressource par son ID.
 * @param {number} id - ID de la ressource
 * @returns {Promise} Réponse API
 */
export const getResource = (id) => {
  return api.get(`/documents/resources/${id}/`)
}

/**
 * Crée une nouvelle ressource.
 * @param {Object|FormData} data - Données de la ressource (peut être FormData pour upload)
 * @returns {Promise} Réponse API
 */
export const createResource = (data) => {
  return api.post('/documents/resources/', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * Met à jour une ressource.
 * @param {number} id - ID de la ressource
 * @param {Object|FormData} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateResource = (id, data) => {
  return api.put(`/documents/resources/${id}/`, data)
}

/**
 * Met à jour partiellement une ressource.
 * @param {number} id - ID de la ressource
 * @param {Object|FormData} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchResource = (id, data) => {
  return api.patch(`/documents/resources/${id}/`, data)
}

/**
 * Supprime une ressource.
 * @param {number} id - ID de la ressource
 * @returns {Promise} Réponse API
 */
export const deleteResource = (id) => {
  return api.delete(`/documents/resources/${id}/`)
}

/**
 * Télécharge le fichier d'une ressource (si c'est un fichier).
 * @param {number} id - ID de la ressource
 * @returns {Promise} Réponse API (blob)
 */
export const downloadResource = (id) => {
  return api.get(`/documents/resources/${id}/download/`, {
    responseType: 'blob'
  })
}

