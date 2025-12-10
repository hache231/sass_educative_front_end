/**
 * Store Pinia pour la gestion des rapports.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as reportsApi from '@/api/reports'

export const useReportsStore = defineStore('reports', () => {
  // État
  const reports = ref([])
  const currentReport = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Filtres
  const filters = ref({
    report_type: null
  })
  
  // Getters
  const filteredReports = computed(() => {
    let result = reports.value
    
    if (filters.value.report_type) {
      result = result.filter(r => r.report_type === filters.value.report_type)
    }
    
    return result
  })
  
  const reportsByType = computed(() => {
    const grouped = {}
    reports.value.forEach(report => {
      if (!grouped[report.report_type]) {
        grouped[report.report_type] = []
      }
      grouped[report.report_type].push(report)
    })
    return grouped
  })
  
  // Actions
  async function fetchReports(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.getReports({
        ...filters.value,
        ...params
      })
      reports.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des rapports'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchReport(id) {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.getReport(id)
      currentReport.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement du rapport'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function generateStudentsReport() {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.generateStudentsReport()
      reports.value.push(response.data)
      currentReport.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la génération du rapport'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function generateTeachersReport() {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.generateTeachersReport()
      reports.value.push(response.data)
      currentReport.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la génération du rapport'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function generateAcademicsReport() {
    loading.value = true
    error.value = null
    try {
      const response = await reportsApi.generateAcademicsReport()
      reports.value.push(response.data)
      currentReport.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la génération du rapport'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteReport(id) {
    loading.value = true
    error.value = null
    try {
      await reportsApi.deleteReport(id)
      reports.value = reports.value.filter(r => r.id !== id)
      if (currentReport.value?.id === id) {
        currentReport.value = null
      }
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression du rapport'
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
      report_type: null
    }
  }
  
  return {
    // État
    reports,
    currentReport,
    loading,
    error,
    filters,
    
    // Getters
    filteredReports,
    reportsByType,
    
    // Actions
    fetchReports,
    fetchReport,
    generateStudentsReport,
    generateTeachersReport,
    generateAcademicsReport,
    deleteReport,
    setFilters,
    clearFilters
  }
})

