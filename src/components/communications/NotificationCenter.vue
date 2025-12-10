<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5>Notifications</h5>
      <button
        v-if="unreadCount > 0"
        class="btn btn-sm btn-outline-primary"
        @click="markAllAsRead"
      >
        Tout marquer comme lu
      </button>
    </div>
    
    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else-if="notifications.length === 0" class="text-center text-muted py-5">
      <p>Aucune notification</p>
    </div>
    
    <div v-else>
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="card mb-2"
        :class="{ 'border-primary': !notification.is_read }"
      >
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <div>
              <h6 class="mb-1">
                {{ notification.title }}
                <span v-if="!notification.is_read" class="badge bg-primary">Nouveau</span>
              </h6>
              <p class="mb-0 text-muted">{{ notification.message }}</p>
              <small class="text-muted">{{ formatDate(notification.created_at) }}</small>
            </div>
            <div>
              <button
                v-if="!notification.is_read"
                class="btn btn-sm btn-outline-primary"
                @click="markAsRead(notification.id)"
              >
                Marquer comme lu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCommunicationsStore } from '@/stores/communications'

const communicationsStore = useCommunicationsStore()

const loading = ref(false)
const notifications = computed(() => communicationsStore.notifications)
const unreadCount = computed(() => communicationsStore.unreadNotificationsCount)

onMounted(async () => {
  loading.value = true
  try {
    await communicationsStore.fetchNotifications()
    await communicationsStore.fetchUnreadNotificationsCount()
  } finally {
    loading.value = false
  }
})

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

async function markAsRead(id) {
  try {
    await communicationsStore.markNotificationAsRead(id)
  } catch (error) {
    console.error('Erreur:', error)
  }
}

async function markAllAsRead() {
  try {
    await communicationsStore.markAllNotificationsAsRead()
  } catch (error) {
    console.error('Erreur:', error)
  }
}
</script>

