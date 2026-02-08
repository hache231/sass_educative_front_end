/**
 * Composable pour gérer un cache simple des données API.
 * 
 * Utile pour les données qui changent rarement (matières, classes, etc.)
 * et qui sont fréquemment utilisées dans l'application.
 */

import { ref } from 'vue'

// Cache global partagé entre toutes les instances
const globalCache = new Map()

/**
 * Configuration par défaut du cache.
 */
const DEFAULT_CACHE_CONFIG = {
  ttl: 5 * 60 * 1000, // 5 minutes par défaut
  maxSize: 100 // Nombre maximum d'entrées
}

/**
 * Entrée de cache avec timestamp.
 */
class CacheEntry {
  constructor(data, ttl) {
    this.data = data
    this.timestamp = Date.now()
    this.ttl = ttl
  }

  isExpired() {
    return Date.now() - this.timestamp > this.ttl
  }
}

/**
 * Composable pour gérer le cache API.
 * 
 * @param {Object} options - Options de configuration
 * @param {number} options.defaultTTL - TTL par défaut en millisecondes
 * @returns {Object} Méthodes pour gérer le cache
 */
export function useApiCache(options = {}) {
  const { defaultTTL = DEFAULT_CACHE_CONFIG.ttl } = options

  /**
   * Récupère une valeur du cache.
   * 
   * @param {string} key - Clé du cache
   * @returns {any|null} Valeur en cache ou null si expirée/inexistante
   */
  function get(key) {
    const entry = globalCache.get(key)
    if (!entry) {
      return null
    }

    if (entry.isExpired()) {
      globalCache.delete(key)
      return null
    }

    return entry.data
  }

  /**
   * Met une valeur en cache.
   * 
   * @param {string} key - Clé du cache
   * @param {any} value - Valeur à mettre en cache
   * @param {number} ttl - TTL en millisecondes (optionnel)
   */
  function set(key, value, ttl = defaultTTL) {
    // Nettoyer le cache si nécessaire
    if (globalCache.size >= DEFAULT_CACHE_CONFIG.maxSize) {
      // Supprimer les entrées expirées
      for (const [k, entry] of globalCache.entries()) {
        if (entry.isExpired()) {
          globalCache.delete(k)
        }
      }

      // Si toujours trop plein, supprimer la plus ancienne
      if (globalCache.size >= DEFAULT_CACHE_CONFIG.maxSize) {
        const oldestKey = Array.from(globalCache.entries())
          .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0]
        globalCache.delete(oldestKey)
      }
    }

    globalCache.set(key, new CacheEntry(value, ttl))
  }

  /**
   * Supprime une entrée du cache.
   * 
   * @param {string} key - Clé du cache
   */
  function remove(key) {
    globalCache.delete(key)
  }

  /**
   * Vide tout le cache.
   */
  function clear() {
    globalCache.clear()
  }

  /**
   * Vérifie si une clé existe dans le cache et n'est pas expirée.
   * 
   * @param {string} key - Clé du cache
   * @returns {boolean} True si la clé existe et n'est pas expirée
   */
  function has(key) {
    const entry = globalCache.get(key)
    if (!entry) {
      return false
    }

    if (entry.isExpired()) {
      globalCache.delete(key)
      return false
    }

    return true
  }

  /**
   * Récupère une valeur du cache ou exécute une fonction pour la récupérer.
   * 
   * @param {string} key - Clé du cache
   * @param {Function} fetchFn - Fonction à exécuter si le cache est vide
   * @param {number} ttl - TTL en millisecondes (optionnel)
   * @returns {Promise<any>} Valeur en cache ou résultat de fetchFn
   */
  async function getOrFetch(key, fetchFn, ttl = defaultTTL) {
    const cached = get(key)
    if (cached !== null) {
      return cached
    }

    const data = await fetchFn()
    set(key, data, ttl)
    return data
  }

  /**
   * Invalide le cache pour une clé ou un pattern.
   * 
   * @param {string} keyOrPattern - Clé exacte ou pattern (commence par)
   */
  function invalidate(keyOrPattern) {
    if (keyOrPattern.includes('*')) {
      // Pattern avec wildcard
      const pattern = keyOrPattern.replace(/\*/g, '.*')
      const regex = new RegExp(`^${pattern}$`)
      for (const key of globalCache.keys()) {
        if (regex.test(key)) {
          globalCache.delete(key)
        }
      }
    } else {
      // Clé exacte
      globalCache.delete(keyOrPattern)
    }
  }

  /**
   * Retourne les statistiques du cache.
   * 
   * @returns {Object} Statistiques du cache
   */
  function getStats() {
    const entries = Array.from(globalCache.values())
    const expired = entries.filter(e => e.isExpired()).length
    const valid = entries.length - expired

    return {
      total: globalCache.size,
      valid,
      expired,
      maxSize: DEFAULT_CACHE_CONFIG.maxSize
    }
  }

  return {
    get,
    set,
    remove,
    clear,
    has,
    getOrFetch,
    invalidate,
    getStats
  }
}

