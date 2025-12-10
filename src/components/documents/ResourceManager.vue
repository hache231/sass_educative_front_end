<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5>Ressources</h5>
      <button class="btn btn-primary btn-sm" @click="showCreateModal = true">
        <font-awesome-icon icon="plus" class="me-2" />
        Nouvelle ressource
      </button>
    </div>
    
    <div v-if="documentsStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else-if="documentsStore.activeResources.length === 0" class="text-center text-muted py-5">
      <p>Aucune ressource</p>
    </div>
    
    <div v-else>
      <div class="row">
        <div
          v-for="resource in documentsStore.activeResources"
          :key="resource.id"
          class="col-md-4 mb-3"
        >
          <div class="card h-100">
            <div class="card-body">
              <h6 class="card-title">{{ resource.title }}</h6>
              <p class="card-text text-muted small">{{ resource.description || 'Aucune description' }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <span class="badge bg-info">{{ getResourceTypeLabel(resource.resource_type) }}</span>
                <div>
                  <a
                    v-if="resource.resource_type === 'link' && resource.url"
                    :href="resource.url"
                    target="_blank"
                    class="btn btn-sm btn-outline-primary"
                  >
                    <font-awesome-icon icon="external-link-alt" />
                  </a>
                  <button
                    v-else-if="resource.resource_type === 'file'"
                    class="btn btn-sm btn-outline-primary"
                    @click="downloadResource(resource.id)"
                  >
                    <font-awesome-icon icon="download" />
                  </button>
                  <button
                    class="btn btn-sm btn-outline-danger ms-2"
                    @click="deleteResource(resource.id)"
                  >
                    <font-awesome-icon icon="trash" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDocumentsStore } from '@/stores/documents'

const documentsStore = useDocumentsStore()

const showCreateModal = ref(false)

onMounted(async () => {
  await documentsStore.fetchResources()
})

function getResourceTypeLabel(type) {
  const labels = {
    link: 'Lien',
    file: 'Fichier',
    video: 'Vidéo',
    other: 'Autre'
  }
  return labels[type] || type
}

async function downloadResource(id) {
  // Fonctionnalité de téléchargement de ressource non implémentée - sera ajoutée dans une version future
  alert('Fonctionnalité de téléchargement de ressource non implémentée pour le moment.')
}

async function deleteResource(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
    try {
      await documentsStore.deleteResource(id)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}
</script>

