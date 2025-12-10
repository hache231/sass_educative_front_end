/**
 * Store Pinia pour la gestion de l'emploi du temps.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as schedulesApi from '@/api/schedules'

export const useSchedulesStore = defineStore('schedules', () => {
  // État
  const timeSlots = ref([])
  const schedules = ref([])
  const calendarEvents = ref([])
  const holidays = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Filtres
  const filters = ref({
    selectedClass: null,
    selectedTeacher: null,
    selectedSubject: null,
    academicYear: null,
    viewMode: 'grid' // 'grid' ou 'list'
  })
  
  // Getters
  const filteredSchedules = computed(() => {
    let result = schedules.value
    
    if (filters.value.selectedClass) {
      result = result.filter(s => s.class_obj === filters.value.selectedClass)
    }
    
    if (filters.value.selectedTeacher) {
      result = result.filter(s => s.teacher === filters.value.selectedTeacher)
    }
    
    if (filters.value.selectedSubject) {
      result = result.filter(s => s.subject === filters.value.selectedSubject)
    }
    
    if (filters.value.academicYear) {
      result = result.filter(s => s.academic_year === filters.value.academicYear)
    }
    
    return result
  })
  
  const weeklyScheduleData = computed(() => {
    // Les données sont formatées par le backend dans weekly_view
    // On peut les utiliser directement
    return schedules.value
  })
  
  const upcomingEvents = computed(() => {
    const now = new Date()
    return calendarEvents.value.filter(event => {
      const startDate = new Date(event.start_date)
      return startDate >= now
    }).sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
  })
  
  const activeTimeSlots = computed(() => {
    return timeSlots.value.filter(ts => ts.is_active).sort((a, b) => {
      if (a.order !== b.order) return a.order - b.order
      return a.start_time.localeCompare(b.start_time)
    })
  })
  
  // Actions - Créneaux horaires
  async function fetchTimeSlots() {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.getTimeSlots()
      timeSlots.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des créneaux horaires'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createTimeSlot(data) {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.createTimeSlot(data)
      timeSlots.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création du créneau horaire'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateTimeSlot(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.patchTimeSlot(id, data)
      const index = timeSlots.value.findIndex(ts => ts.id === id)
      if (index !== -1) {
        timeSlots.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour du créneau horaire'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteTimeSlot(id) {
    loading.value = true
    error.value = null
    try {
      await schedulesApi.deleteTimeSlot(id)
      timeSlots.value = timeSlots.value.filter(ts => ts.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression du créneau horaire'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Emploi du temps
  async function fetchSchedules(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.getSchedules({
        ...filters.value,
        ...params
      })
      schedules.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement de l\'emploi du temps'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchWeeklySchedule(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.getWeeklySchedule({
        class_id: filters.value.selectedClass,
        academic_year: filters.value.academicYear,
        ...params
      })
      // Le backend retourne un objet avec les jours de la semaine comme clés
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement de l\'emploi du temps hebdomadaire'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createSchedule(data) {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.createSchedule(data)
      schedules.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création de l\'emploi du temps'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateSchedule(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.patchSchedule(id, data)
      const index = schedules.value.findIndex(s => s.id === id)
      if (index !== -1) {
        schedules.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour de l\'emploi du temps'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteSchedule(id) {
    loading.value = true
    error.value = null
    try {
      await schedulesApi.deleteSchedule(id)
      schedules.value = schedules.value.filter(s => s.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression de l\'emploi du temps'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Événements calendrier
  async function fetchCalendarEvents(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.getCalendarEvents(params)
      calendarEvents.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des événements'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchUpcomingEvents() {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.getUpcomingEvents()
      calendarEvents.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des événements à venir'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createCalendarEvent(data) {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.createCalendarEvent(data)
      calendarEvents.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création de l\'événement'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateCalendarEvent(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.patchCalendarEvent(id, data)
      const index = calendarEvents.value.findIndex(e => e.id === id)
      if (index !== -1) {
        calendarEvents.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour de l\'événement'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteCalendarEvent(id) {
    loading.value = true
    error.value = null
    try {
      await schedulesApi.deleteCalendarEvent(id)
      calendarEvents.value = calendarEvents.value.filter(e => e.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression de l\'événement'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Jours fériés
  async function fetchHolidays(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.getHolidays(params)
      holidays.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des jours fériés'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchHolidaysByYear(year) {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.getHolidaysByYear(year)
      holidays.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des jours fériés'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createHoliday(data) {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.createHoliday(data)
      holidays.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création du jour férié'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateHoliday(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await schedulesApi.patchHoliday(id, data)
      const index = holidays.value.findIndex(h => h.id === id)
      if (index !== -1) {
        holidays.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour du jour férié'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteHoliday(id) {
    loading.value = true
    error.value = null
    try {
      await schedulesApi.deleteHoliday(id)
      holidays.value = holidays.value.filter(h => h.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression du jour férié'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Filtres
  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }
  
  function clearFilters() {
    filters.value = {
      selectedClass: null,
      selectedTeacher: null,
      selectedSubject: null,
      academicYear: null,
      viewMode: 'grid'
    }
  }
  
  return {
    // État
    timeSlots,
    schedules,
    calendarEvents,
    holidays,
    loading,
    error,
    filters,
    
    // Getters
    filteredSchedules,
    weeklyScheduleData,
    upcomingEvents,
    activeTimeSlots,
    
    // Actions - Créneaux horaires
    fetchTimeSlots,
    createTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    
    // Actions - Emploi du temps
    fetchSchedules,
    fetchWeeklySchedule,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    
    // Actions - Événements
    fetchCalendarEvents,
    fetchUpcomingEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent,
    
    // Actions - Jours fériés
    fetchHolidays,
    fetchHolidaysByYear,
    createHoliday,
    updateHoliday,
    deleteHoliday,
    
    // Actions - Filtres
    setFilters,
    clearFilters
  }
})

