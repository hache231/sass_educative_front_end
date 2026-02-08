/**
 * Composable pour implémenter la virtualisation de listes.
 * 
 * Utile pour optimiser le rendu de grandes listes en ne rendant
 * que les éléments visibles à l'écran.
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * Composable pour virtualiser une liste.
 * 
 * @param {Object} options - Options de configuration
 * @param {number} options.itemHeight - Hauteur d'un élément en pixels
 * @param {number} options.containerHeight - Hauteur du conteneur en pixels
 * @param {number} options.overscan - Nombre d'éléments à rendre en plus (pour le scroll fluide)
 * @returns {Object} État et méthodes pour la virtualisation
 */
export function useVirtualList(options = {}) {
  const {
    itemHeight = 50,
    containerHeight = 600,
    overscan = 5
  } = options

  const scrollTop = ref(0)
  const containerRef = ref(null)

  /**
   * Calcule les indices des éléments visibles.
   * 
   * @param {number} totalItems - Nombre total d'éléments
   * @returns {Object} Indices de début et de fin, et éléments visibles
   */
  function calculateVisibleRange(totalItems) {
    const startIndex = Math.max(0, Math.floor(scrollTop.value / itemHeight) - overscan)
    const endIndex = Math.min(
      totalItems - 1,
      Math.ceil((scrollTop.value + containerHeight) / itemHeight) + overscan
    )

    return {
      startIndex,
      endIndex,
      visibleCount: endIndex - startIndex + 1
    }
  }

  /**
   * Gère le scroll du conteneur.
   * 
   * @param {Event} event - Événement de scroll
   */
  function handleScroll(event) {
    if (containerRef.value) {
      scrollTop.value = containerRef.value.scrollTop
    }
  }

  /**
   * Crée une fonction pour calculer les éléments visibles.
   * 
   * @param {number} totalItems - Nombre total d'éléments
   * @returns {Object} État calculé pour la virtualisation
   */
  function getVisibleItems(totalItems) {
    const { startIndex, endIndex, visibleCount } = calculateVisibleRange(totalItems)

    return {
      startIndex,
      endIndex,
      visibleCount,
      offsetY: startIndex * itemHeight,
      totalHeight: totalItems * itemHeight,
      visibleItems: Array.from({ length: visibleCount }, (_, i) => startIndex + i)
    }
  }

  /**
   * Scroll vers un élément spécifique.
   * 
   * @param {number} index - Index de l'élément
   */
  function scrollToIndex(index) {
    if (containerRef.value) {
      containerRef.value.scrollTop = index * itemHeight
    }
  }

  /**
   * Scroll vers le haut.
   */
  function scrollToTop() {
    scrollToIndex(0)
  }

  /**
   * Scroll vers le bas.
   * 
   * @param {number} totalItems - Nombre total d'éléments
   */
  function scrollToBottom(totalItems) {
    scrollToIndex(totalItems - 1)
  }

  return {
    scrollTop,
    containerRef,
    handleScroll,
    getVisibleItems,
    scrollToIndex,
    scrollToTop,
    scrollToBottom
  }
}

