/**
 * Service API pour la gestion des rapports.
 */

import api from './index'

// ==================== RAPPORTS ====================

/**
 * Récupère la liste des rapports avec filtres optionnels.
 * @param {Object} params - Paramètres de filtrage (report_type)
 * @returns {Promise} Réponse API
 */
export const getReports = (params = {}) => {
  return api.get('/reports/reports/', { params })
}

/**
 * Récupère un rapport par son ID.
 * @param {number} id - ID du rapport
 * @returns {Promise} Réponse API
 */
export const getReport = (id) => {
  return api.get(`/reports/reports/${id}/`)
}

/**
 * Crée un nouveau rapport.
 * @param {Object} data - Données du rapport
 * @returns {Promise} Réponse API
 */
export const createReport = (data) => {
  return api.post('/reports/reports/', data)
}

/**
 * Met à jour un rapport.
 * @param {number} id - ID du rapport
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateReport = (id, data) => {
  return api.put(`/reports/reports/${id}/`, data)
}

/**
 * Supprime un rapport.
 * @param {number} id - ID du rapport
 * @returns {Promise} Réponse API
 */
export const deleteReport = (id) => {
  return api.delete(`/reports/reports/${id}/`)
}

/**
 * Génère un rapport sur les élèves.
 * @returns {Promise} Réponse API
 */
export const generateStudentsReport = () => {
  return api.post('/reports/reports/generate-students/')
}

/**
 * Génère un rapport sur les enseignants.
 * @returns {Promise} Réponse API
 */
export const generateTeachersReport = () => {
  return api.post('/reports/reports/generate-teachers/')
}

/**
 * Génère un rapport académique.
 * @returns {Promise} Réponse API
 */
export const generateAcademicsReport = () => {
  return api.post('/reports/reports/generate-academics/')
}

