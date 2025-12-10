/**
 * Service API pour la gestion des enseignants et affectations.
 */

import api from './index'

// ==================== ENSEIGNANTS ====================

/**
 * Récupère la liste des enseignants avec filtres optionnels.
 * @param {Object} params - Paramètres de filtrage (search, subject_id, class_id, is_active, academic_year)
 * @returns {Promise} Réponse API
 */
export const getTeachers = (params = {}) => {
  return api.get('/teachers/teachers/', { params })
}

/**
 * Récupère un enseignant par son ID.
 * @param {number} id - ID de l'enseignant
 * @returns {Promise} Réponse API
 */
export const getTeacher = (id) => {
  return api.get(`/teachers/teachers/${id}/`)
}

/**
 * Crée un nouvel enseignant.
 * @param {Object|FormData} data - Données de l'enseignant (peut être FormData pour upload avatar)
 * @returns {Promise} Réponse API
 */
export const createTeacher = (data) => {
  // Si un fichier avatar est présent, utiliser FormData
  if (data.avatar && data.avatar instanceof File) {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (key === 'avatar') {
        formData.append('avatar', data.avatar)
      } else if (Array.isArray(data[key])) {
        // Gérer les tableaux (ex: classes_ids)
        data[key].forEach(item => {
          formData.append(key, item)
        })
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    return api.post('/teachers/teachers/', formData)
  }
  return api.post('/teachers/teachers/', data)
}

/**
 * Met à jour un enseignant.
 * @param {number} id - ID de l'enseignant
 * @param {Object|FormData} data - Données à mettre à jour (peut être FormData pour upload avatar)
 * @returns {Promise} Réponse API
 */
export const updateTeacher = (id, data) => {
  // Si un fichier avatar est présent, utiliser FormData
  if (data.avatar && data.avatar instanceof File) {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (key === 'avatar') {
        formData.append('avatar', data.avatar)
      } else if (Array.isArray(data[key])) {
        // Gérer les tableaux
        data[key].forEach(item => {
          formData.append(key, item)
        })
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    return api.put(`/teachers/teachers/${id}/`, formData)
  }
  return api.put(`/teachers/teachers/${id}/`, data)
}

/**
 * Met à jour partiellement un enseignant.
 * @param {number} id - ID de l'enseignant
 * @param {Object|FormData} data - Données à mettre à jour (peut être FormData pour upload avatar)
 * @returns {Promise} Réponse API
 */
export const patchTeacher = (id, data) => {
  // Si un fichier avatar est présent, utiliser FormData
  if (data.avatar && data.avatar instanceof File) {
    const formData = new FormData()
    Object.keys(data).forEach(key => {
      if (key === 'avatar') {
        formData.append('avatar', data.avatar)
      } else if (Array.isArray(data[key])) {
        // Gérer les tableaux
        data[key].forEach(item => {
          formData.append(key, item)
        })
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })
    return api.patch(`/teachers/teachers/${id}/`, formData)
  }
  return api.patch(`/teachers/teachers/${id}/`, data)
}

/**
 * Supprime un enseignant.
 * @param {number} id - ID de l'enseignant
 * @returns {Promise} Réponse API
 */
export const deleteTeacher = (id) => {
  return api.delete(`/teachers/teachers/${id}/`)
}

/**
 * Récupère les classes/matières d'un enseignant.
 * @param {number} id - ID de l'enseignant
 * @param {string} academic_year - Année académique (optionnel)
 * @returns {Promise} Réponse API
 */
export const getTeacherClassesForTeacher = (id, academic_year = null) => {
  const params = academic_year ? { academic_year } : {}
  return api.get(`/teachers/teachers/${id}/classes/`, { params })
}

/**
 * Assign un enseignant à une classe/matière.
 * @param {number} id - ID de l'enseignant
 * @param {number} class_id - ID de la classe
 * @param {number} subject_id - ID de la matière
 * @param {string} academic_year - Année académique
 * @returns {Promise} Réponse API
 */
export const assignTeacherToClass = (id, class_id, subject_id, academic_year) => {
  return api.post(`/teachers/teachers/${id}/assign_class/`, {
    class_id,
    subject_id,
    academic_year
  })
}

/**
 * Retire un enseignant d'une classe/matière.
 * @param {number} id - ID de l'enseignant
 * @param {number} class_id - ID de la classe
 * @param {number} subject_id - ID de la matière
 * @param {string} academic_year - Année académique
 * @returns {Promise} Réponse API
 */
export const removeTeacherFromClass = (id, class_id, subject_id, academic_year) => {
  return api.delete(`/teachers/teachers/${id}/remove_class/`, {
    params: { class_id, subject_id, academic_year }
  })
}

/**
 * Récupère les matières enseignées par un enseignant.
 * @param {number} id - ID de l'enseignant
 * @param {string} academic_year - Année académique (optionnel)
 * @returns {Promise} Réponse API
 */
export const getTeacherSubjects = (id, academic_year = null) => {
  const params = academic_year ? { academic_year } : {}
  return api.get(`/teachers/teachers/${id}/subjects/`, { params })
}

// ==================== AFFECTATIONS ENSEIGNANT-CLASSE ====================

/**
 * Récupère la liste des affectations enseignant-classe-matière.
 * @param {Object} params - Paramètres de filtrage (teacher_id, class_id, subject_id, academic_year)
 * @returns {Promise} Réponse API
 */
export const getTeacherClasses = (params = {}) => {
  return api.get('/teachers/teacher-classes/', { params })
}

/**
 * Récupère une affectation par son ID.
 * @param {number} id - ID de l'affectation
 * @returns {Promise} Réponse API
 */
export const getTeacherClass = (id) => {
  return api.get(`/teachers/teacher-classes/${id}/`)
}

/**
 * Crée une nouvelle affectation.
 * @param {Object} data - Données de l'affectation
 * @returns {Promise} Réponse API
 */
export const createTeacherClass = (data) => {
  return api.post('/teachers/teacher-classes/', data)
}

/**
 * Met à jour une affectation.
 * @param {number} id - ID de l'affectation
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateTeacherClass = (id, data) => {
  return api.put(`/teachers/teacher-classes/${id}/`, data)
}

/**
 * Met à jour partiellement une affectation.
 * @param {number} id - ID de l'affectation
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchTeacherClass = (id, data) => {
  return api.patch(`/teachers/teacher-classes/${id}/`, data)
}

/**
 * Supprime une affectation.
 * @param {number} id - ID de l'affectation
 * @returns {Promise} Réponse API
 */
export const deleteTeacherClass = (id) => {
  return api.delete(`/teachers/teacher-classes/${id}/`)
}

