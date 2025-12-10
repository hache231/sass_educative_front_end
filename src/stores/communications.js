/**
 * Store Pinia pour la gestion des communications (notifications, messages, annonces).
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as communicationsApi from '@/api/communications'

export const useCommunicationsStore = defineStore('communications', () => {
  // État
  const notifications = ref([])
  const messages = ref([])
  const announcements = ref([])
  const unreadNotificationsCount = ref(0)
  const unreadMessagesCount = ref(0)
  const loading = ref(false)
  const error = ref(null)
  
  // Filtres
  const notificationFilters = ref({
    is_read: null,
    notification_type: null
  })
  
  const messageFilters = ref({
    type: null, // 'sent' ou 'received'
    is_read: null
  })
  
  // Getters
  const unreadNotifications = computed(() => {
    return notifications.value.filter(n => !n.is_read)
  })
  
  const unreadMessages = computed(() => {
    return messages.value.filter(m => !m.is_read)
  })
  
  const sentMessages = computed(() => {
    return messages.value.filter(m => messageFilters.value.type === 'sent' || !messageFilters.value.type)
  })
  
  const receivedMessages = computed(() => {
    return messages.value.filter(m => messageFilters.value.type === 'received' || !messageFilters.value.type)
  })
  
  const activeAnnouncements = computed(() => {
    return announcements.value.filter(a => a.is_active)
  })
  
  // Actions - Notifications
  async function fetchNotifications(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await communicationsApi.getNotifications({
        ...notificationFilters.value,
        ...params
      })
      notifications.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      await fetchUnreadNotificationsCount()
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des notifications'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function markNotificationAsRead(id) {
    try {
      await communicationsApi.markNotificationAsRead(id)
      const notification = notifications.value.find(n => n.id === id)
      if (notification) {
        notification.is_read = true
      }
      await fetchUnreadNotificationsCount()
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du marquage de la notification'
      throw err
    }
  }
  
  async function markAllNotificationsAsRead() {
    try {
      await communicationsApi.markAllNotificationsAsRead()
      notifications.value.forEach(n => { n.is_read = true })
      unreadNotificationsCount.value = 0
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du marquage des notifications'
      throw err
    }
  }
  
  async function fetchUnreadNotificationsCount() {
    try {
      const response = await communicationsApi.getUnreadNotificationsCount()
      unreadNotificationsCount.value = response.data.count || 0
    } catch (err) {
      // Ignorer l'erreur silencieusement
    }
  }
  
  // Actions - Messages
  async function fetchMessages(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await communicationsApi.getMessages({
        ...messageFilters.value,
        ...params
      })
      messages.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      await fetchUnreadMessagesCount()
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des messages'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createMessage(data) {
    loading.value = true
    error.value = null
    try {
      const response = await communicationsApi.createMessage(data)
      messages.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de l\'envoi du message'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function markMessageAsRead(id) {
    try {
      await communicationsApi.markMessageAsRead(id)
      const message = messages.value.find(m => m.id === id)
      if (message) {
        message.is_read = true
      }
      await fetchUnreadMessagesCount()
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du marquage du message'
      throw err
    }
  }
  
  async function fetchUnreadMessagesCount() {
    try {
      const response = await communicationsApi.getUnreadMessagesCount()
      unreadMessagesCount.value = response.data.count || 0
    } catch (err) {
      // Ignorer l'erreur silencieusement
    }
  }
  
  // Actions - Annonces
  async function fetchAnnouncements(params = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await communicationsApi.getAnnouncements(params)
      announcements.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors du chargement des annonces'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function createAnnouncement(data) {
    loading.value = true
    error.value = null
    try {
      const response = await communicationsApi.createAnnouncement(data)
      announcements.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la création de l\'annonce'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function updateAnnouncement(id, data) {
    loading.value = true
    error.value = null
    try {
      const response = await communicationsApi.patchAnnouncement(id, data)
      const index = announcements.value.findIndex(a => a.id === id)
      if (index !== -1) {
        announcements.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la mise à jour de l\'annonce'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  async function deleteAnnouncement(id) {
    loading.value = true
    error.value = null
    try {
      await communicationsApi.deleteAnnouncement(id)
      announcements.value = announcements.value.filter(a => a.id !== id)
    } catch (err) {
      error.value = err.response?.data || 'Erreur lors de la suppression de l\'annonce'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  return {
    // État
    notifications,
    messages,
    announcements,
    unreadNotificationsCount,
    unreadMessagesCount,
    loading,
    error,
    notificationFilters,
    messageFilters,
    
    // Getters
    unreadNotifications,
    unreadMessages,
    sentMessages,
    receivedMessages,
    activeAnnouncements,
    
    // Actions - Notifications
    fetchNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    fetchUnreadNotificationsCount,
    
    // Actions - Messages
    fetchMessages,
    createMessage,
    markMessageAsRead,
    fetchUnreadMessagesCount,
    
    // Actions - Annonces
    fetchAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement
  }
})

