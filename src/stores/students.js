/**
 * Store Pinia pour la gestion des élèves et classes.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as studentsApi from '@/api/students'

export const useStudentsStore = defineStore('students', () => {
  // État
  const students = ref([])
  const classes = ref([])
  const currentStudent = ref(null)
  const currentClass = ref(null)
  const loading = ref(false)
  const error = ref(null)
  
  // Filtres
  const filters = ref({
    search: '',
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
  const activeStudents = computed(() => {
    return students.value.filter(s => s.is_active)
  })
  
  const filteredStudents = computed(() => {
    let result = students.value
    
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      result = result.filter(s => 
        s.full_name?.toLowerCase().includes(search) ||
        s.student_id?.toLowerCase().includes(search)
      )
    }
    
    if (filters.value.class_id) {
      result = result.filter(s => 
        s.current_classes?.some(c => c.id === filters.value.class_id)
      )
    }
    
    if (filters.value.is_active !== null) {
      result = result.filter(s => s.is_active === filters.value.is_active)
    }
    
    return result
  })
  
  const activeClasses = computed(() => {
    return classes.value.filter(c => c.is_active)
  })
  
  // Actions - Élèves
  async function fetchStudents(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await studentsApi.getStudents({
        ...filters.value,
        ...params
      })
      
      // Gérer la pagination si présente
      if (response.data.results) {
        students.value = response.data.results
        pagination.value = {
          count: response.data.count,
          next: response.data.next,
          previous: response.data.previous,
          page: params.page || 1,
          pageSize: params.page_size || 20
        }
      } else {
        students.value = Array.isArray(response.data) ? response.data : []
      }
      
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des élèves'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchStudent(id) {
    loading.value = true
    error.value = null
    try {
      const response = await studentsApi.getStudent(id)
      currentStudent.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement de l\'élève'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createStudent(data) {
    loading.value = true
    error.value = null
    try {
      const response = await studentsApi.createStudent(data)
      // Si c'est un tableau paginé, ajouter à la liste
      if (Array.isArray(students.value)) {
        students.value.push(response.data)
      } else {
        // Sinon, recharger la liste
        await fetchStudents()
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création de l\'élève'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateStudent(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await studentsApi.patchStudent(id, data)
      const index = students.value.findIndex(s => s && s.id === id)
      if (index !== -1) {
        students.value[index] = response.data
      }
      if (currentStudent.value?.id === id) {
        currentStudent.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour de l\'élève'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteStudent(id) {
    loading.value = true
    error.value = null
    try {
      await studentsApi.deleteStudent(id)
      students.value = students.value.filter(s => s.id !== id)
      if (currentStudent.value?.id === id) {
        currentStudent.value = null
      }
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression de l\'élève'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function assignStudentToClass(studentId, classId, academicYear) {
    loading.value = true
    error.value = null
    try {
      await studentsApi.assignStudentToClass(studentId, classId, academicYear)
      // Rafraîchir les données de l'élève
      await fetchStudent(studentId)
      await fetchStudents()
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de l\'assignation à la classe'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function removeStudentFromClass(studentId, classId, academicYear) {
    loading.value = true
    error.value = null
    try {
      await studentsApi.removeStudentFromClass(studentId, classId, academicYear)
      // Rafraîchir les données de l'élève
      await fetchStudent(studentId)
      await fetchStudents()
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du retrait de la classe'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Classes
  async function fetchClasses(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await studentsApi.getClasses(params)
      classes.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des classes'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function fetchClass(id) {
    loading.value = true
    error.value = null
    try {
      const response = await studentsApi.getClass(id)
      currentClass.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement de la classe'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createClass(data) {
    loading.value = true
    error.value = null
    try {
      const response = await studentsApi.createClass(data)
      classes.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création de la classe'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateClass(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await studentsApi.patchClass(id, data)
      const index = classes.value.findIndex(c => c.id === id)
      if (index !== -1) {
        classes.value[index] = response.data
      }
      if (currentClass.value?.id === id) {
        currentClass.value = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour de la classe'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteClass(id) {
    loading.value = true
    error.value = null
    try {
      await studentsApi.deleteClass(id)
      classes.value = classes.value.filter(c => c.id !== id)
      if (currentClass.value?.id === id) {
        currentClass.value = null
      }
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression de la classe'
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
      class_id: null,
      is_active: true,
      academic_year: null
    }
  }
  
  return {
    // État
    students,
    classes,
    currentStudent,
    currentClass,
    loading,
    error,
    filters,
    pagination,
    
    // Getters
    activeStudents,
    filteredStudents,
    activeClasses,
    
    // Actions - Élèves
    fetchStudents,
    fetchStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    assignStudentToClass,
    removeStudentFromClass,
    
    // Actions - Classes
    fetchClasses,
    fetchClass,
    createClass,
    updateClass,
    deleteClass,
    
    // Actions - Filtres
    setFilters,
    clearFilters
  }
})

