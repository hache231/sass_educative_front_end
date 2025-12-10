/**
 * Service API pour la gestion des élèves et classes.
 */

import api from './index'

// ==================== ÉLÈVES ====================

/**
 * Récupère la liste des élèves avec filtres optionnels.
 * @param {Object} params - Paramètres de filtrage (search, class_id, is_active, academic_year)
 * @returns {Promise} Réponse API
 */
export const getStudents = (params = {}) => {
  return api.get('/students/students/', { params })
}

/**
 * Récupère un élève par son ID.
 * @param {number} id - ID de l'élève
 * @returns {Promise} Réponse API
 */
export const getStudent = (id) => {
  return api.get(`/students/students/${id}/`)
}

/**
 * Crée un nouvel élève.
 * @param {Object|FormData} data - Données de l'élève (peut être FormData pour upload photo)
 * @returns {Promise} Réponse API
 */
export const createStudent = (data) => {
  return api.post('/students/students/', data)
}

/**
 * Met à jour un élève.
 * @param {number} id - ID de l'élève
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateStudent = (id, data) => {
  return api.put(`/students/students/${id}/`, data)
}

/**
 * Met à jour partiellement un élève.
 * @param {number} id - ID de l'élève
 * @param {Object|FormData} data - Données à mettre à jour (peut être FormData pour upload photo)
 * @returns {Promise} Réponse API
 */
export const patchStudent = (id, data) => {
  return api.patch(`/students/students/${id}/`, data)
}

/**
 * Supprime un élève.
 * @param {number} id - ID de l'élève
 * @returns {Promise} Réponse API
 */
export const deleteStudent = (id) => {
  return api.delete(`/students/students/${id}/`)
}

/**
 * Récupère les classes d'un élève.
 * @param {number} id - ID de l'élève
 * @param {string} academic_year - Année académique (optionnel)
 * @returns {Promise} Réponse API
 */
export const getStudentClasses = (id, academic_year = null) => {
  const params = academic_year ? { academic_year } : {}
  return api.get(`/students/students/${id}/classes/`, { params })
}

/**
 * Assign un élève à une classe.
 * @param {number} id - ID de l'élève
 * @param {number} class_id - ID de la classe
 * @param {string} academic_year - Année académique
 * @returns {Promise} Réponse API
 */
export const assignStudentToClass = (id, class_id, academic_year) => {
  return api.post(`/students/students/${id}/assign_class/`, {
    class_id,
    academic_year
  })
}

/**
 * Retire un élève d'une classe.
 * @param {number} id - ID de l'élève
 * @param {number} class_id - ID de la classe
 * @param {string} academic_year - Année académique
 * @returns {Promise} Réponse API
 */
export const removeStudentFromClass = (id, class_id, academic_year) => {
  return api.delete(`/students/students/${id}/remove_class/`, {
    params: { class_id, academic_year }
  })
}

// ==================== CLASSES ====================

/**
 * Récupère la liste des classes avec filtres optionnels.
 * @param {Object} params - Paramètres de filtrage (is_active, level)
 * @returns {Promise} Réponse API
 */
export const getClasses = (params = {}) => {
  return api.get('/students/classes/', { params })
}

/**
 * Récupère une classe par son ID.
 * @param {number} id - ID de la classe
 * @returns {Promise} Réponse API
 */
export const getClass = (id) => {
  return api.get(`/students/classes/${id}/`)
}

/**
 * Crée une nouvelle classe.
 * @param {Object} data - Données de la classe
 * @returns {Promise} Réponse API
 */
export const createClass = (data) => {
  return api.post('/students/classes/', data)
}

/**
 * Met à jour une classe.
 * @param {number} id - ID de la classe
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateClass = (id, data) => {
  return api.put(`/students/classes/${id}/`, data)
}

/**
 * Met à jour partiellement une classe.
 * @param {number} id - ID de la classe
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchClass = (id, data) => {
  return api.patch(`/students/classes/${id}/`, data)
}

/**
 * Supprime une classe.
 * @param {number} id - ID de la classe
 * @returns {Promise} Réponse API
 */
export const deleteClass = (id) => {
  return api.delete(`/students/classes/${id}/`)
}

/**
 * Récupère les élèves d'une classe.
 * @param {number} id - ID de la classe
 * @param {string} academic_year - Année académique (optionnel)
 * @returns {Promise} Réponse API
 */
export const getClassStudents = (id, academic_year = null) => {
  const params = academic_year ? { academic_year } : {}
  return api.get(`/students/classes/${id}/students/`, { params })
}

/**
 * Récupère les statistiques d'une classe.
 * @param {number} id - ID de la classe
 * @param {string} academic_year - Année académique (optionnel)
 * @returns {Promise} Réponse API
 */
export const getClassStatistics = (id, academic_year = null) => {
  const params = academic_year ? { academic_year } : {}
  return api.get(`/students/classes/${id}/statistics/`, { params })
}

