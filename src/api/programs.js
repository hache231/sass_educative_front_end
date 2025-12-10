/**
 * Service API pour la gestion des programmes pédagogiques.
 */

import api from './index'

// ==================== MATIÈRES (Subject) ====================

/**
 * Récupère la liste des matières.
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise} Réponse API
 */
export const getSubjects = (params = {}) => api.get('/academics/subjects/', { params })

/**
 * Récupère une matière par son ID.
 * @param {number} id - ID de la matière
 * @returns {Promise} Réponse API
 */
export const getSubject = (id) => api.get(`/academics/subjects/${id}/`)

/**
 * Crée une nouvelle matière.
 * @param {Object} data - Données de la matière
 * @returns {Promise} Réponse API
 */
export const createSubject = (data) => api.post('/academics/subjects/', data)

/**
 * Met à jour une matière.
 * @param {number} id - ID de la matière
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateSubject = (id, data) => api.put(`/academics/subjects/${id}/`, data)

/**
 * Met à jour partiellement une matière.
 * @param {number} id - ID de la matière
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchSubject = (id, data) => api.patch(`/academics/subjects/${id}/`, data)

/**
 * Supprime une matière.
 * @param {number} id - ID de la matière
 * @returns {Promise} Réponse API
 */
export const deleteSubject = (id) => api.delete(`/academics/subjects/${id}/`)

/**
 * Récupère les matières enseignées dans une classe.
 * @param {number} classId - ID de la classe
 * @returns {Promise} Réponse API
 */
export const getSubjectsByClass = (classId) => api.get('/academics/subjects/by_class/', { params: { class_id: classId } })

/**
 * Récupère uniquement les matières actives.
 * @returns {Promise} Réponse API
 */
export const getActiveSubjects = () => api.get('/academics/subjects/active/')

// ==================== PROGRAMMES (Program) ====================

/**
 * Récupère la liste des programmes.
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise} Réponse API
 */
export const getPrograms = (params = {}) => api.get('/academics/programs/', { params })

/**
 * Récupère un programme par son ID.
 * @param {number} id - ID du programme
 * @returns {Promise} Réponse API
 */
export const getProgram = (id) => api.get(`/academics/programs/${id}/`)

/**
 * Crée un nouveau programme.
 * @param {Object} data - Données du programme
 * @returns {Promise} Réponse API
 */
export const createProgram = (data) => api.post('/academics/programs/', data)

/**
 * Met à jour un programme.
 * @param {number} id - ID du programme
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateProgram = (id, data) => api.put(`/academics/programs/${id}/`, data)

/**
 * Met à jour partiellement un programme.
 * @param {number} id - ID du programme
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchProgram = (id, data) => api.patch(`/academics/programs/${id}/`, data)

/**
 * Supprime un programme.
 * @param {number} id - ID du programme
 * @returns {Promise} Réponse API
 */
export const deleteProgram = (id) => api.delete(`/academics/programs/${id}/`)

/**
 * Récupère les programmes d'une classe.
 * @param {number} classId - ID de la classe
 * @returns {Promise} Réponse API
 */
export const getProgramsByClass = (classId) => api.get('/academics/programs/by_class/', { params: { class_id: classId } })

/**
 * Récupère les programmes d'une matière.
 * @param {number} subjectId - ID de la matière
 * @returns {Promise} Réponse API
 */
export const getProgramsBySubject = (subjectId) => api.get('/academics/programs/by_subject/', { params: { subject_id: subjectId } })

/**
 * Récupère les programmes d'une année scolaire.
 * @param {string} academicYear - Année scolaire
 * @returns {Promise} Réponse API
 */
export const getProgramsByAcademicYear = (academicYear) => api.get('/academics/programs/by_academic_year/', { params: { academic_year: academicYear } })

/**
 * Récupère les programmes pour une classe et une matière.
 * @param {number} classId - ID de la classe
 * @param {number} subjectId - ID de la matière
 * @returns {Promise} Réponse API
 */
export const getProgramsByClassAndSubject = (classId, subjectId) => api.get('/academics/programs/by_class_and_subject/', {
  params: { class_id: classId, subject_id: subjectId }
})

// ==================== COURS (Course) ====================

/**
 * Récupère la liste des cours.
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise} Réponse API
 */
export const getCourses = (params = {}) => api.get('/academics/courses/', { params })

/**
 * Récupère un cours par son ID.
 * @param {number} id - ID du cours
 * @returns {Promise} Réponse API
 */
export const getCourse = (id) => api.get(`/academics/courses/${id}/`)

/**
 * Crée un nouveau cours.
 * @param {Object} data - Données du cours
 * @returns {Promise} Réponse API
 */
export const createCourse = (data) => api.post('/academics/courses/', data)

/**
 * Met à jour un cours.
 * @param {number} id - ID du cours
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateCourse = (id, data) => api.put(`/academics/courses/${id}/`, data)

/**
 * Met à jour partiellement un cours.
 * @param {number} id - ID du cours
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchCourse = (id, data) => api.patch(`/academics/courses/${id}/`, data)

/**
 * Supprime un cours.
 * @param {number} id - ID du cours
 * @returns {Promise} Réponse API
 */
export const deleteCourse = (id) => api.delete(`/academics/courses/${id}/`)

/**
 * Récupère les cours d'un programme.
 * @param {number} programId - ID du programme
 * @returns {Promise} Réponse API
 */
export const getCoursesByProgram = (programId) => api.get('/academics/courses/by_program/', { params: { program_id: programId } })

// ==================== CONTENU DE COURS (CourseContent) ====================

/**
 * Récupère la liste des contenus de cours.
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise} Réponse API
 */
export const getCourseContents = (params = {}) => api.get('/academics/course-contents/', { params })

/**
 * Récupère un contenu de cours par son ID.
 * @param {number} id - ID du contenu
 * @returns {Promise} Réponse API
 */
export const getCourseContent = (id) => api.get(`/academics/course-contents/${id}/`)

/**
 * Crée un nouveau contenu de cours.
 * @param {Object|FormData} data - Données du contenu (peut être FormData pour upload fichier)
 * @returns {Promise} Réponse API
 */
export const createCourseContent = (data) => {
  if (data instanceof FormData) {
    return api.post('/academics/course-contents/', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  return api.post('/academics/course-contents/', data)
}

/**
 * Met à jour un contenu de cours.
 * @param {number} id - ID du contenu
 * @param {Object|FormData} data - Données à mettre à jour (peut être FormData pour upload fichier)
 * @returns {Promise} Réponse API
 */
export const updateCourseContent = (id, data) => {
  if (data instanceof FormData) {
    return api.put(`/academics/course-contents/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  return api.put(`/academics/course-contents/${id}/`, data)
}

/**
 * Met à jour partiellement un contenu de cours.
 * @param {number} id - ID du contenu
 * @param {Object|FormData} data - Données à mettre à jour (peut être FormData pour upload fichier)
 * @returns {Promise} Réponse API
 */
export const patchCourseContent = (id, data) => {
  if (data instanceof FormData) {
    return api.patch(`/academics/course-contents/${id}/`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  return api.patch(`/academics/course-contents/${id}/`, data)
}

/**
 * Supprime un contenu de cours.
 * @param {number} id - ID du contenu
 * @returns {Promise} Réponse API
 */
export const deleteCourseContent = (id) => api.delete(`/academics/course-contents/${id}/`)

/**
 * Récupère les contenus d'un cours.
 * @param {number} courseId - ID du cours
 * @returns {Promise} Réponse API
 */
export const getCourseContentsByCourse = (courseId) => api.get('/academics/course-contents/by_course/', { params: { course_id: courseId } })

/**
 * Récupère les contenus par type.
 * @param {string} contentType - Type de contenu (lesson, exercise, video, document, quiz)
 * @returns {Promise} Réponse API
 */
export const getCourseContentsByType = (contentType) => api.get('/academics/course-contents/by_type/', { params: { content_type: contentType } })

