/**
 * Composable pour gérer la pagination de manière standardisée.
 * 
 * Fournit une interface cohérente pour gérer la pagination
 * dans les composants Vue.
 */

import { ref, computed } from 'vue'

/**
 * Composable pour gérer la pagination.
 * 
 * @param {Object} options - Options de pagination
 * @param {number} options.defaultPageSize - Taille de page par défaut
 * @returns {Object} Objet contenant les états et méthodes de pagination
 */
export function usePagination(options = {}) {
  const {
    defaultPageSize = 20
  } = options
  
  const currentPage = ref(1)
  const pageSize = ref(defaultPageSize)
  const totalCount = ref(0)
  const nextPageUrl = ref(null)
  const previousPageUrl = ref(null)
  
  /**
   * Calcule le nombre total de pages.
   */
  const totalPages = computed(() => {
    return Math.ceil(totalCount.value / pageSize.value)
  })
  
  /**
   * Indique s'il y a une page suivante.
   */
  const hasNextPage = computed(() => {
    return nextPageUrl.value !== null || currentPage.value < totalPages.value
  })
  
  /**
   * Indique s'il y a une page précédente.
   */
  const hasPreviousPage = computed(() => {
    return previousPageUrl.value !== null || currentPage.value > 1
  })
  
  /**
   * Met à jour les informations de pagination depuis une réponse API.
   * 
   * @param {Object} paginationData - Données de pagination de l'API
   */
  function updatePagination(paginationData) {
    if (paginationData.count !== undefined) {
      totalCount.value = paginationData.count
    }
    if (paginationData.next !== undefined) {
      nextPageUrl.value = paginationData.next
    }
    if (paginationData.previous !== undefined) {
      previousPageUrl.value = paginationData.previous
    }
    if (paginationData.page !== undefined) {
      currentPage.value = paginationData.page
    }
    if (paginationData.pageSize !== undefined) {
      pageSize.value = paginationData.pageSize
    }
  }
  
  /**
   * Va à la page suivante.
   */
  function nextPage() {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }
  
  /**
   * Va à la page précédente.
   */
  function previousPage() {
    if (hasPreviousPage.value) {
      currentPage.value--
    }
  }
  
  /**
   * Va à une page spécifique.
   * 
   * @param {number} page - Numéro de la page
   */
  function goToPage(page) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }
  
  /**
   * Change la taille de page.
   * 
   * @param {number} newPageSize - Nouvelle taille de page
   */
  function setPageSize(newPageSize) {
    pageSize.value = newPageSize
    currentPage.value = 1 // Réinitialiser à la première page
  }
  
  /**
   * Réinitialise la pagination.
   */
  function resetPagination() {
    currentPage.value = 1
    totalCount.value = 0
    nextPageUrl.value = null
    previousPageUrl.value = null
  }
  
  /**
   * Retourne les paramètres de pagination pour une requête API.
   * 
   * @returns {Object} Paramètres de pagination
   */
  function getPaginationParams() {
    return {
      page: currentPage.value,
      page_size: pageSize.value
    }
  }
  
  return {
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    nextPageUrl,
    previousPageUrl,
    updatePagination,
    nextPage,
    previousPage,
    goToPage,
    setPageSize,
    resetPagination,
    getPaginationParams
  }
}

