/**
 * Store Pinia pour la gestion des enseignants et affectations.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as teachersApi from '@/api/teachers'

export const useTeachersStore = defineStore('teachers', () => {
  // État
  const teachers = ref([])
  const teacherClasses = ref([])
  const currentTeacher = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Filtres
  const filters = ref({
    search: '',
    subject_id: null,
    class_id: null,
    is_active: true,
    academic_year: null
  })
  
  // Pagination
  const pagination = ref({
    count: 0,
    next: null,
    previous: null,
    page: 1,
    pageSize: 20
  })
  
  // Getters
  const activeTeachers = computed(() => {
    return teachers.value.filter(t => t.is_active)
  })
  
  const filteredTeachers = computed(() => {
    let result = teachers.value
    
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(t => 
        t.full_name?.toLowerCase().includes(search) ||
        t.employee_id?.toLowerCase().includes(search) ||
        t.specialization?.toLowerCase().includes(search) ||
        t.user_email?.toLowerCase().includes(search)
      )
    }
    
    if (filters.value.subject_id) {
      // Filtrage par matière non implémenté - sera ajouté dans une version future
      // Nécessite de charger les affectations enseignant-matière
    }
    
    if (filters.value.class_id) {
      // Filtrage par classe non implémenté - sera ajouté dans une version future
      // Nécessite de charger les affectations enseignant-classe
    }
    
    if (filters.value.is_active !== null) {
      result = result.filter(t => t.is_active === filters.value.is_active)
    }
    
    return result
  })
  
  // Actions - Enseignants
  async function fetchTeachers(params = {}) {
    loading.value = true
    error.value = null
    try {
      // Inclure les paramètres de pagination si présents
      const requestParams = {
        ...filters.value,
        ...params
      }
      
      // S'assurer que les paramètres de pagination sont correctement formatés
      if (pagination.value.page && !requestParams.page) {
        requestParams.page = pagination.value.page
      }
      if (pagination.value.pageSize && !requestParams.page_size) {
        requestParams.page_size = pagination.value.pageSize
      }
      
      const response = await teachersApi.getTeachers(requestParams)
      
      // Gérer la pagination si présente
      if (response.data.results) {
        teachers.value = response.data.results
        pagination.value = {
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          page: params.page || pagination.value.page || 1,
          pageSize: params.page_size || pagination.value.pageSize || 20
        }
      } else {
        teachers.value = Array.isArray(response.data) ? response.data : []
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des enseignants'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchTeacher(id) {
    loading.value = true
    error.value = null
    try {
      const response = await teachersApi.getTeacher(id)
      currentTeacher.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement de l\'enseignant'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createTeacher(data) {
    loading.value = true
    error.value = null
    try {
      const response = await teachersApi.createTeacher(data)
      // Si c'est un tableau paginé, ajouter à la liste
      if (Array.isArray(teachers.value)) {
        teachers.value.push(response.data)
      } else {
        // Sinon, recharger la liste
        await fetchTeachers()
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création de l\'enseignant'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateTeacher(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await teachersApi.patchTeacher(id, data)
      const index = teachers.value.findIndex(t => t && t.id === id)
      if (index !== -1) {
        teachers.value[index] = response.data
      }
      if (currentTeacher.value?.id === id) {
        currentTeacher.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour de l\'enseignant'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteTeacher(id) {
    loading.value = true
    error.value = null
    try {
      await teachersApi.deleteTeacher(id)
      teachers.value = teachers.value.filter(t => t.id !== id)
      if (currentTeacher.value?.id === id) {
        currentTeacher.value = null
      }
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression de l\'enseignant'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function assignTeacherToClass(teacherId, classId, subjectId, academicYear) {
    loading.value = true
    error.value = null
    try {
      await teachersApi.assignTeacherToClass(teacherId, classId, subjectId, academicYear)
      // Rafraîchir les données de l'enseignant
      await fetchTeacher(teacherId)
      await fetchTeachers()
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de l\'assignation à la classe'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function removeTeacherFromClass(teacherId, classId, subjectId, academicYear) {
    loading.value = true
    error.value = null
    try {
      await teachersApi.removeTeacherFromClass(teacherId, classId, subjectId, academicYear)
      // Rafraîchir les données de l'enseignant
      await fetchTeacher(teacherId)
      await fetchTeachers()
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du retrait de la classe'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchTeacherClasses(teacherId, academicYear = null) {
    loading.value = true
    error.value = null
    try {
      const response = await teachersApi.getTeacherClassesForTeacher(teacherId, academicYear)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des classes'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchTeacherSubjects(teacherId, academicYear = null) {
    loading.value = true
    error.value = null
    try {
      const response = await teachersApi.getTeacherSubjects(teacherId, academicYear)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des matières'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Affectations
  async function fetchAllTeacherClasses(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await teachersApi.getTeacherClasses(params)
      teacherClasses.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des affectations'
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
      search: '',
      subject_id: null,
      class_id: null,
      is_active: true,
      academic_year: null
    }
  }
  
  return {
    // État
    teachers,
    teacherClasses,
    currentTeacher,
    loading,
    error,
    filters,
    pagination,
    
    // Getters
    activeTeachers,
    filteredTeachers,
    
    // Actions - Enseignants
    fetchTeachers,
    fetchTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    assignTeacherToClass,
    removeTeacherFromClass,
    fetchTeacherClasses,
    fetchTeacherSubjects,
    
    // Actions - Affectations
    fetchAllTeacherClasses,
    
    // Actions - Filtres
    setFilters,
    clearFilters
  }
})

