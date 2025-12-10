/**
 * Store Pinia pour la gestion des programmes pédagogiques.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as programsApi from '@/api/programs'

export const useProgramsStore = defineStore('programs', () => {
  // État
  const subjects = ref([])
  const programs = ref([])
  const courses = ref([])
  const courseContents = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Filtres
  const filters = ref({
    selectedClass: null,
    selectedSubject: null,
    academicYear: null,
    selectedProgram: null,
    selectedCourse: null
  })
  
  // Getters
  const activeSubjects = computed(() => {
    return subjects.value.filter(s => s.is_active)
  })
  
  const filteredPrograms = computed(() => {
    let result = programs.value
    
    if (filters.value.selectedClass) {
      result = result.filter(p => p.class_obj === filters.value.selectedClass)
    }
    
    if (filters.value.selectedSubject) {
      result = result.filter(p => p.subject === filters.value.selectedSubject)
    }
    
    if (filters.value.academicYear) {
      result = result.filter(p => p.academic_year === filters.value.academicYear)
    }
    
    return result
  })
  
  const coursesByProgram = computed(() => {
    if (!filters.value.selectedProgram) return []
    return courses.value.filter(c => c.program === filters.value.selectedProgram)
      .sort((a, b) => a.order - b.order)
  })
  
  const contentsByCourse = computed(() => {
    if (!filters.value.selectedCourse) return []
    return courseContents.value.filter(cc => cc.course === filters.value.selectedCourse)
      .sort((a, b) => a.order - b.order)
  })
  
  // Actions - Matières
  async function fetchSubjects(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.getSubjects(params)
      subjects.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des matières'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchSubject(id) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.getSubject(id)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement de la matière'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createSubject(data) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.createSubject(data)
      subjects.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création de la matière'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateSubject(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.patchSubject(id, data)
      const index = subjects.value.findIndex(s => s.id === id)
      if (index !== -1) {
        subjects.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour de la matière'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteSubject(id) {
    loading.value = true
    error.value = null
    try {
      await programsApi.deleteSubject(id)
      subjects.value = subjects.value.filter(s => s.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression de la matière'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Programmes
  async function fetchPrograms(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.getPrograms({
        ...filters.value,
        ...params
      })
      programs.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des programmes'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchProgram(id) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.getProgram(id)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement du programme'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createProgram(data) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.createProgram(data)
      programs.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création du programme'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateProgram(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.patchProgram(id, data)
      const index = programs.value.findIndex(p => p.id === id)
      if (index !== -1) {
        programs.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour du programme'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteProgram(id) {
    loading.value = true
    error.value = null
    try {
      await programsApi.deleteProgram(id)
      programs.value = programs.value.filter(p => p.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression du programme'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Cours
  async function fetchCourses(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.getCourses(params)
      courses.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des cours'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchCoursesByProgram(programId) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.getCoursesByProgram(programId)
      courses.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des cours'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createCourse(data) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.createCourse(data)
      courses.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création du cours'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateCourse(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.patchCourse(id, data)
      const index = courses.value.findIndex(c => c.id === id)
      if (index !== -1) {
        courses.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour du cours'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteCourse(id) {
    loading.value = true
    error.value = null
    try {
      await programsApi.deleteCourse(id)
      courses.value = courses.value.filter(c => c.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression du cours'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Contenu de cours
  async function fetchCourseContents(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.getCourseContents(params)
      courseContents.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement du contenu'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchCourseContentsByCourse(courseId) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.getCourseContentsByCourse(courseId)
      courseContents.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement du contenu'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createCourseContent(data) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.createCourseContent(data)
      courseContents.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création du contenu'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateCourseContent(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await programsApi.patchCourseContent(id, data)
      const index = courseContents.value.findIndex(cc => cc.id === id)
      if (index !== -1) {
        courseContents.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour du contenu'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteCourseContent(id) {
    loading.value = true
    error.value = null
    try {
      await programsApi.deleteCourseContent(id)
      courseContents.value = courseContents.value.filter(cc => cc.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression du contenu'
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
      selectedSubject: null,
      academicYear: null,
      selectedProgram: null,
      selectedCourse: null
    }
  }
  
  return {
    // État
    subjects,
    programs,
    courses,
    courseContents,
    loading,
    error,
    filters,
    
    // Getters
    activeSubjects,
    filteredPrograms,
    coursesByProgram,
    contentsByCourse,
    
    // Actions - Matières
    fetchSubjects,
    fetchSubject,
    createSubject,
    updateSubject,
    deleteSubject,
    
    // Actions - Programmes
    fetchPrograms,
    fetchProgram,
    createProgram,
    updateProgram,
    deleteProgram,
    
    // Actions - Cours
    fetchCourses,
    fetchCoursesByProgram,
    createCourse,
    updateCourse,
    deleteCourse,
    
    // Actions - Contenu
    fetchCourseContents,
    fetchCourseContentsByCourse,
    createCourseContent,
    updateCourseContent,
    deleteCourseContent,
    
    // Actions - Filtres
    setFilters,
    clearFilters
  }
})

