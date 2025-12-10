/**
 * Store Pinia pour la gestion des évaluations, notes et bulletins.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as assessmentsApi from '@/api/assessments'

export const useAssessmentsStore = defineStore('assessments', () => {
  // État
  const assessments = ref([])
  const grades = ref([])
  const reportCards = ref([])
  const currentAssessment = ref(null)
  const currentReportCard = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Filtres
  const filters = ref({
    class_id: null,
    subject_id: null,
    academic_year: null,
    assessment_type: null
  })
  
  // Getters
  const filteredAssessments = computed(() => {
    let result = assessments.value
    
    if (filters.value.class_id) {
      result = result.filter(a => a.class_obj === filters.value.class_id)
    }
    if (filters.value.subject_id) {
      result = result.filter(a => a.subject === filters.value.subject_id)
    }
    if (filters.value.academic_year) {
      result = result.filter(a => a.academic_year === filters.value.academic_year)
    }
    if (filters.value.assessment_type) {
      result = result.filter(a => a.assessment_type === filters.value.assessment_type)
    }
    
    return result
  })
  
  // Actions - Évaluations
  async function fetchAssessments(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await assessmentsApi.getAssessments({
        ...filters.value,
        ...params
      })
      assessments.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des évaluations'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchAssessment(id) {
    loading.value = true
    error.value = null
    try {
      const response = await assessmentsApi.getAssessment(id)
      currentAssessment.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement de l\'évaluation'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createAssessment(data) {
    loading.value = true
    error.value = null
    try {
      const response = await assessmentsApi.createAssessment(data)
      assessments.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création de l\'évaluation'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateAssessment(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await assessmentsApi.patchAssessment(id, data)
      const index = assessments.value.findIndex(a => a.id === id)
      if (index !== -1) {
        assessments.value[index] = response.data
      }
      if (currentAssessment.value?.id === id) {
        currentAssessment.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour de l\'évaluation'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteAssessment(id) {
    loading.value = true
    error.value = null
    try {
      await assessmentsApi.deleteAssessment(id)
      assessments.value = assessments.value.filter(a => a.id !== id)
      if (currentAssessment.value?.id === id) {
        currentAssessment.value = null
      }
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression de l\'évaluation'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchAssessmentGrades(id) {
    loading.value = true
    error.value = null
    try {
      const response = await assessmentsApi.getAssessmentGrades(id)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des notes'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function bulkCreateGrades(id, gradesData) {
    loading.value = true
    error.value = null
    try {
      const response = await assessmentsApi.bulkCreateGrades(id, gradesData)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création des notes'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Notes
  async function fetchGrades(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await assessmentsApi.getGrades(params)
      grades.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des notes'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createGrade(data) {
    loading.value = true
    error.value = null
    try {
      const response = await assessmentsApi.createGrade(data)
      grades.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création de la note'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateGrade(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await assessmentsApi.patchGrade(id, data)
      const index = grades.value.findIndex(g => g.id === id)
      if (index !== -1) {
        grades.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour de la note'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteGrade(id) {
    loading.value = true
    error.value = null
    try {
      await assessmentsApi.deleteGrade(id)
      grades.value = grades.value.filter(g => g.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression de la note'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Bulletins
  async function fetchReportCards(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await assessmentsApi.getReportCards(params)
      reportCards.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des bulletins'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchReportCard(id) {
    loading.value = true
    error.value = null
    try {
      const response = await assessmentsApi.getReportCard(id)
      currentReportCard.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement du bulletin'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function generateReportCard(data) {
    loading.value = true
    error.value = null
    try {
      const response = await assessmentsApi.generateReportCard(data)
      reportCards.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la génération du bulletin'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  function setFilters(newFilters) {
    filters.value = { ...filters.value, ...newFilters }
  }
  
  function clearFilters() {
    filters.value = {
      class_id: null,
      subject_id: null,
      academic_year: null,
      assessment_type: null
    }
  }
  
  return {
    // État
    assessments,
    grades,
    reportCards,
    currentAssessment,
    currentReportCard,
    loading,
    error,
    filters,
    
    // Getters
    filteredAssessments,
    
    // Actions - Évaluations
    fetchAssessments,
    fetchAssessment,
    createAssessment,
    updateAssessment,
    deleteAssessment,
    fetchAssessmentGrades,
    bulkCreateGrades,
    
    // Actions - Notes
    fetchGrades,
    createGrade,
    updateGrade,
    deleteGrade,
    
    // Actions - Bulletins
    fetchReportCards,
    fetchReportCard,
    generateReportCard,
    
    // Actions - Filtres
    setFilters,
    clearFilters
  }
})

