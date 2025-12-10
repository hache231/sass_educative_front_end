/**
 * Service API pour la gestion de l'emploi du temps.
 */

import api from './index'

// ==================== CRÉNEAUX HORAIRES (TimeSlot) ====================

/**
 * Récupère les créneaux horaires de l'école.
 * @returns {Promise} Réponse API
 */
export const getTimeSlots = () => api.get('/schedules/time-slots/my_time_slots/')

/**
 * Crée un nouveau créneau horaire.
 * @param {Object} data - Données du créneau horaire
 * @returns {Promise} Réponse API
 */
export const createTimeSlot = (data) => api.post('/schedules/time-slots/', data)

/**
 * Met à jour un créneau horaire.
 * @param {number} id - ID du créneau horaire
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateTimeSlot = (id, data) => api.put(`/schedules/time-slots/${id}/`, data)

/**
 * Met à jour partiellement un créneau horaire.
 * @param {number} id - ID du créneau horaire
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchTimeSlot = (id, data) => api.patch(`/schedules/time-slots/${id}/`, data)

/**
 * Supprime un créneau horaire.
 * @param {number} id - ID du créneau horaire
 * @returns {Promise} Réponse API
 */
export const deleteTimeSlot = (id) => api.delete(`/schedules/time-slots/${id}/`)

// ==================== EMPLOI DU TEMPS (Schedule) ====================

/**
 * Récupère la liste des emplois du temps avec filtres optionnels.
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise} Réponse API
 */
export const getSchedules = (params = {}) => api.get('/schedules/schedules/', { params })

/**
 * Récupère un emploi du temps par son ID.
 * @param {number} id - ID de l'emploi du temps
 * @returns {Promise} Réponse API
 */
export const getSchedule = (id) => api.get(`/schedules/schedules/${id}/`)

/**
 * Crée un nouvel emploi du temps.
 * @param {Object} data - Données de l'emploi du temps
 * @returns {Promise} Réponse API
 */
export const createSchedule = (data) => api.post('/schedules/schedules/', data)

/**
 * Met à jour un emploi du temps.
 * @param {number} id - ID de l'emploi du temps
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateSchedule = (id, data) => api.put(`/schedules/schedules/${id}/`, data)

/**
 * Met à jour partiellement un emploi du temps.
 * @param {number} id - ID de l'emploi du temps
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchSchedule = (id, data) => api.patch(`/schedules/schedules/${id}/`, data)

/**
 * Supprime un emploi du temps.
 * @param {number} id - ID de l'emploi du temps
 * @returns {Promise} Réponse API
 */
export const deleteSchedule = (id) => api.delete(`/schedules/schedules/${id}/`)

/**
 * Récupère les emplois du temps filtrés par classe.
 * @param {number} classId - ID de la classe
 * @returns {Promise} Réponse API
 */
export const getSchedulesByClass = (classId) => api.get('/schedules/schedules/by_class/', { params: { class_id: classId } })

/**
 * Récupère les emplois du temps filtrés par enseignant.
 * @param {number} teacherId - ID de l'enseignant
 * @returns {Promise} Réponse API
 */
export const getSchedulesByTeacher = (teacherId) => api.get('/schedules/schedules/by_teacher/', { params: { teacher_id: teacherId } })

/**
 * Récupère les emplois du temps filtrés par matière.
 * @param {number} subjectId - ID de la matière
 * @returns {Promise} Réponse API
 */
export const getSchedulesBySubject = (subjectId) => api.get('/schedules/schedules/by_subject/', { params: { subject_id: subjectId } })

/**
 * Récupère les emplois du temps filtrés par année scolaire.
 * @param {string} academicYear - Année scolaire
 * @returns {Promise} Réponse API
 */
export const getSchedulesByAcademicYear = (academicYear) => api.get('/schedules/schedules/by_academic_year/', { params: { academic_year: academicYear } })

/**
 * Récupère l'emploi du temps formaté pour la grille hebdomadaire.
 * @param {Object} params - Paramètres (class_id, academic_year)
 * @returns {Promise} Réponse API
 */
export const getWeeklySchedule = (params = {}) => api.get('/schedules/schedules/weekly_view/', { params })

// ==================== ÉVÉNEMENTS CALENDRIER (CalendarEvent) ====================

/**
 * Récupère la liste des événements du calendrier.
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise} Réponse API
 */
export const getCalendarEvents = (params = {}) => api.get('/schedules/calendar-events/', { params })

/**
 * Récupère un événement par son ID.
 * @param {number} id - ID de l'événement
 * @returns {Promise} Réponse API
 */
export const getCalendarEvent = (id) => api.get(`/schedules/calendar-events/${id}/`)

/**
 * Crée un nouvel événement.
 * @param {Object} data - Données de l'événement
 * @returns {Promise} Réponse API
 */
export const createCalendarEvent = (data) => api.post('/schedules/calendar-events/', data)

/**
 * Met à jour un événement.
 * @param {number} id - ID de l'événement
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateCalendarEvent = (id, data) => api.put(`/schedules/calendar-events/${id}/`, data)

/**
 * Met à jour partiellement un événement.
 * @param {number} id - ID de l'événement
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchCalendarEvent = (id, data) => api.patch(`/schedules/calendar-events/${id}/`, data)

/**
 * Supprime un événement.
 * @param {number} id - ID de l'événement
 * @returns {Promise} Réponse API
 */
export const deleteCalendarEvent = (id) => api.delete(`/schedules/calendar-events/${id}/`)

/**
 * Récupère les événements à venir.
 * @returns {Promise} Réponse API
 */
export const getUpcomingEvents = () => api.get('/schedules/calendar-events/upcoming/')

/**
 * Récupère les événements dans une plage de dates.
 * @param {string} startDate - Date de début (ISO 8601)
 * @param {string} endDate - Date de fin (ISO 8601)
 * @returns {Promise} Réponse API
 */
export const getEventsByDateRange = (startDate, endDate) => api.get('/schedules/calendar-events/by_date_range/', {
  params: { start_date: startDate, end_date: endDate }
})

// ==================== JOURS FÉRIÉS (Holiday) ====================

/**
 * Récupère la liste des jours fériés.
 * @param {Object} params - Paramètres de filtrage
 * @returns {Promise} Réponse API
 */
export const getHolidays = (params = {}) => api.get('/schedules/holidays/', { params })

/**
 * Récupère un jour férié par son ID.
 * @param {number} id - ID du jour férié
 * @returns {Promise} Réponse API
 */
export const getHoliday = (id) => api.get(`/schedules/holidays/${id}/`)

/**
 * Crée un nouveau jour férié.
 * @param {Object} data - Données du jour férié
 * @returns {Promise} Réponse API
 */
export const createHoliday = (data) => api.post('/schedules/holidays/', data)

/**
 * Met à jour un jour férié.
 * @param {number} id - ID du jour férié
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const updateHoliday = (id, data) => api.put(`/schedules/holidays/${id}/`, data)

/**
 * Met à jour partiellement un jour férié.
 * @param {number} id - ID du jour férié
 * @param {Object} data - Données à mettre à jour
 * @returns {Promise} Réponse API
 */
export const patchHoliday = (id, data) => api.patch(`/schedules/holidays/${id}/`, data)

/**
 * Supprime un jour férié.
 * @param {number} id - ID du jour férié
 * @returns {Promise} Réponse API
 */
export const deleteHoliday = (id) => api.delete(`/schedules/holidays/${id}/`)

/**
 * Récupère les jours fériés pour une année donnée.
 * @param {number} year - Année
 * @returns {Promise} Réponse API
 */
export const getHolidaysByYear = (year) => api.get('/schedules/holidays/by_year/', { params: { year } })

/**
 * Récupère les jours fériés récurrents.
 * @returns {Promise} Réponse API
 */
export const getRecurringHolidays = () => api.get('/schedules/holidays/recurring/')

