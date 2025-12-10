<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5>Annonces</h5>
      <button class="btn btn-primary btn-sm" @click="showModal = true">
        <font-awesome-icon icon="plus" class="me-2" />
        Nouvelle annonce
      </button>
    </div>
    
    <div v-if="communicationsStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else-if="communicationsStore.activeAnnouncements.length === 0" class="text-center text-muted py-5">
      <p>Aucune annonce</p>
    </div>
    
    <div v-else>
      <div
        v-for="announcement in communicationsStore.activeAnnouncements"
        :key="announcement.id"
        class="card mb-3"
        :class="{
          'border-warning': announcement.priority === 'high',
          'border-info': announcement.is_pinned
        }"
      >
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <h6 class="mb-2">
                {{ announcement.title }}
                <span v-if="announcement.is_pinned" class="badge bg-info">Épinglé</span>
                <span
                  class="badge ms-2"
                  :class="{
                    'bg-danger': announcement.priority === 'high',
                    'bg-warning': announcement.priority === 'medium',
                    'bg-secondary': announcement.priority === 'low'
                  }"
                >
                  {{ getPriorityLabel(announcement.priority) }}
                </span>
              </h6>
              <p class="mb-2">{{ announcement.content }}</p>
              <small class="text-muted">
                Par {{ announcement.author_name }} le {{ formatDate(announcement.created_at) }}
              </small>
            </div>
            <div>
              <button
                class="btn btn-sm btn-outline-warning me-2"
                @click="editAnnouncement(announcement)"
                title="Modifier"
              >
                <font-awesome-icon icon="edit" />
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteAnnouncement(announcement)"
                title="Supprimer"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCommunicationsStore } from '@/stores/communications'

const communicationsStore = useCommunicationsStore()

const showModal = ref(false)

function getPriorityLabel(priority) {
  const labels = {
    high: 'Élevée',
    medium: 'Moyenne',
    low: 'Faible'
  }
  return labels[priority] || priority
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function editAnnouncement(announcement) {
  // Fonctionnalité d'édition d'annonce non implémentée - sera ajoutée dans une version future
  alert('Fonctionnalité d\'édition d\'annonce non implémentée pour le moment.')
}

async function deleteAnnouncement(announcement) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'annonce "${announcement.title}" ?`)) {
    try {
      await communicationsStore.deleteAnnouncement(announcement.id)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}
</script>

