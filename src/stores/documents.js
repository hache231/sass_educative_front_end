/**
 * Store Pinia pour la gestion des documents et ressources.
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as documentsApi from '@/api/documents'

export const useDocumentsStore = defineStore('documents', () => {
  // État
  const documents = ref([])
  const documentCategories = ref([])
  const resources = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Filtres
  const documentFilters = ref({
    category_id: null,
    document_type: null,
    is_public: null
  })
  
  const resourceFilters = ref({
    resource_type: null,
    show_inactive: false
  })
  
  // Getters
  const filteredDocuments = computed(() => {
    let result = documents.value
    
    if (documentFilters.value.category_id) {
      result = result.filter(d => d.category === documentFilters.value.category_id)
    }
    if (documentFilters.value.document_type) {
      result = result.filter(d => d.document_type === documentFilters.value.document_type)
    }
    if (documentFilters.value.is_public !== null) {
      result = result.filter(d => d.is_public === documentFilters.value.is_public)
    }
    
    return result
  })
  
  const publicDocuments = computed(() => {
    return documents.value.filter(d => d.is_public)
  })
  
  const activeResources = computed(() => {
    return resources.value.filter(r => r.is_active)
  })
  
  // Actions - Documents
  async function fetchDocuments(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await documentsApi.getDocuments({
        ...documentFilters.value,
        ...params
      })
      documents.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des documents'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createDocument(data) {
    loading.value = true
    error.value = null
    try {
      const response = await documentsApi.createDocument(data)
      documents.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création du document'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateDocument(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await documentsApi.patchDocument(id, data)
      const index = documents.value.findIndex(d => d.id === id)
      if (index !== -1) {
        documents.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour du document'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteDocument(id) {
    loading.value = true
    error.value = null
    try {
      await documentsApi.deleteDocument(id)
      documents.value = documents.value.filter(d => d.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression du document'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function downloadDocument(id) {
    try {
      const response = await documentsApi.downloadDocument(id)
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `document-${id}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du téléchargement'
      throw err
    }
  }
  
  // Actions - Catégories
  async function fetchDocumentCategories() {
    loading.value = true
    error.value = null
    try {
      const response = await documentsApi.getDocumentCategories()
      documentCategories.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des catégories'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createDocumentCategory(data) {
    loading.value = true
    error.value = null
    try {
      const response = await documentsApi.createDocumentCategory(data)
      documentCategories.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création de la catégorie'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateDocumentCategory(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await documentsApi.updateDocumentCategory(id, data)
      const index = documentCategories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        documentCategories.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour de la catégorie'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteDocumentCategory(id) {
    loading.value = true
    error.value = null
    try {
      await documentsApi.deleteDocumentCategory(id)
      documentCategories.value = documentCategories.value.filter(c => c.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression de la catégorie'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  // Actions - Ressources
  async function fetchResources(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await documentsApi.getResources({
        ...resourceFilters.value,
        ...params
      })
      resources.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des ressources'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createResource(data) {
    loading.value = true
    error.value = null
    try {
      const response = await documentsApi.createResource(data)
      resources.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création de la ressource'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateResource(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await documentsApi.patchResource(id, data)
      const index = resources.value.findIndex(r => r.id === id)
      if (index !== -1) {
        resources.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour de la ressource'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteResource(id) {
    loading.value = true
    error.value = null
    try {
      await documentsApi.deleteResource(id)
      resources.value = resources.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression de la ressource'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    // État
    documents,
    documentCategories,
    resources,
    loading,
    error,
    documentFilters,
    resourceFilters,
    
    // Getters
    filteredDocuments,
    publicDocuments,
    activeResources,
    
    // Actions - Documents
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    downloadDocument,
    
    // Actions - Catégories
    fetchDocumentCategories,
    createDocumentCategory,
    updateDocumentCategory,
    deleteDocumentCategory,
    
    // Actions - Ressources
    fetchResources,
    createResource,
    updateResource,
    deleteResource
  }
})

