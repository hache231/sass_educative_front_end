/**
 * Service API pour la gestion des évaluations, notes et bulletins.
 */

import api from './index'

// ==================== ÉVALUATIONS ====================

/**
 * Récupère la liste des évaluations avec filtres optionnels.
 * @param {Object} params - Paramètres de filtrage (class_id, subject_id, academic_year, assessment_type)
 * @returns {Promise} Réponse API
 */
export const getAssessments = (params = {}) => {
  return api.get('/assessments/assessments/', { params })
}

/**
 * Récupère une évaluation par son ID.
 * @param {number} id - ID de l'évaluation
 * @returns {Promise} Réponse API
 */
export const getAssessment = (id) => {
  return api.get(`/assessments/assessments/${id}/`)
}

/**
 * Crée une nouvelle évaluation.
 * @param {Object} data - Données de l'évaluation
 * @returns {Promise} Réponse API
 */
export const createAssessment = (data) => {
  return api.post('/assessments/assessments/', data)
}

/**
 * Met à jour une évaluation.
 * @param {number} id - ID de l'évaluation
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateAssessment = (id, data) => {
  return api.put(`/assessments/assessments/${id}/`, data)
}

/**
 * Met à jour partiellement une évaluation.
 * @param {number} id - ID de l'évaluation
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchAssessment = (id, data) => {
  return api.patch(`/assessments/assessments/${id}/`, data)
}

/**
 * Supprime une évaluation.
 * @param {number} id - ID de l'évaluation
 * @returns {Promise} Réponse API
 */
export const deleteAssessment = (id) => {
  return api.delete(`/assessments/assessments/${id}/`)
}

/**
 * Récupère toutes les notes pour une évaluation.
 * @param {number} id - ID de l'évaluation
 * @returns {Promise} Réponse API
 */
export const getAssessmentGrades = (id) => {
  return api.get(`/assessments/assessments/${id}/grades/`)
}

/**
 * Crée plusieurs notes pour une évaluation en une seule requête.
 * @param {number} id - ID de l'évaluation
 * @param {Array} grades - Tableau de notes [{student_id, score, comment}]
 * @returns {Promise} Réponse API
 */
export const bulkCreateGrades = (id, grades) => {
  return api.post(`/assessments/assessments/${id}/bulk-create-grades/`, { grades })
}

// ==================== NOTES ====================

/**
 * Récupère la liste des notes avec filtres optionnels.
 * @param {Object} params - Paramètres de filtrage (assessment_id, student_id, class_id)
 * @returns {Promise} Réponse API
 */
export const getGrades = (params = {}) => {
  return api.get('/assessments/grades/', { params })
}

/**
 * Récupère une note par son ID.
 * @param {number} id - ID de la note
 * @returns {Promise} Réponse API
 */
export const getGrade = (id) => {
  return api.get(`/assessments/grades/${id}/`)
}

/**
 * Crée une nouvelle note.
 * @param {Object} data - Données de la note
 * @returns {Promise} Réponse API
 */
export const createGrade = (data) => {
  return api.post('/assessments/grades/', data)
}

/**
 * Met à jour une note.
 * @param {number} id - ID de la note
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateGrade = (id, data) => {
  return api.put(`/assessments/grades/${id}/`, data)
}

/**
 * Met à jour partiellement une note.
 * @param {number} id - ID de la note
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchGrade = (id, data) => {
  return api.patch(`/assessments/grades/${id}/`, data)
}

/**
 * Supprime une note.
 * @param {number} id - ID de la note
 * @returns {Promise} Réponse API
 */
export const deleteGrade = (id) => {
  return api.delete(`/assessments/grades/${id}/`)
}

// ==================== BULLETINS ====================

/**
 * Récupère la liste des bulletins avec filtres optionnels.
 * @param {Object} params - Paramètres de filtrage (student_id, class_id, academic_year, period)
 * @returns {Promise} Réponse API
 */
export const getReportCards = (params = {}) => {
  return api.get('/assessments/report-cards/', { params })
}

/**
 * Récupère un bulletin par son ID.
 * @param {number} id - ID du bulletin
 * @returns {Promise} Réponse API
 */
export const getReportCard = (id) => {
  return api.get(`/assessments/report-cards/${id}/`)
}

/**
 * Génère un bulletin pour un élève et une période.
 * @param {Object} data - {student_id, class_id, academic_year, period}
 * @returns {Promise} Réponse API
 */
export const generateReportCard = (data) => {
  return api.post('/assessments/report-cards/generate/', data)
}

/**
 * Crée un nouveau bulletin.
 * @param {Object} data - Données du bulletin
 * @returns {Promise} Réponse API
 */
export const createReportCard = (data) => {
  return api.post('/assessments/report-cards/', data)
}

/**
 * Met à jour un bulletin.
 * @param {number} id - ID du bulletin
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateReportCard = (id, data) => {
  return api.put(`/assessments/report-cards/${id}/`, data)
}

/**
 * Supprime un bulletin.
 * @param {number} id - ID du bulletin
 * @returns {Promise} Réponse API
 */
export const deleteReportCard = (id) => {
  return api.delete(`/assessments/report-cards/${id}/`)
}

