<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5>Documents</h5>
      <button class="btn btn-primary btn-sm" @click="showUploadModal = true">
        <font-awesome-icon icon="upload" class="me-2" />
        Uploader un document
      </button>
    </div>
    
    <div v-if="documentsStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else-if="documentsStore.filteredDocuments.length === 0" class="text-center text-muted py-5">
      <p>Aucun document</p>
    </div>
    
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Type</th>
            <th>Uploadé par</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="document in documentsStore.filteredDocuments" :key="document.id">
            <td>{{ document.title }}</td>
            <td>{{ document.category_name || '-' }}</td>
            <td>
              <span class="badge bg-info">{{ document.document_type }}</span>
            </td>
            <td>{{ document.uploaded_by_name || '-' }}</td>
            <td>{{ formatDate(document.created_at) }}</td>
            <td>
              <button
                class="btn btn-sm btn-outline-primary me-2"
                @click="downloadDocument(document.id)"
                title="Télécharger"
              >
                <font-awesome-icon icon="download" />
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteDocument(document.id)"
                title="Supprimer"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDocumentsStore } from '@/stores/documents'

const documentsStore = useDocumentsStore()

const showUploadModal = ref(false)

onMounted(async () => {
  await documentsStore.fetchDocuments()
  await documentsStore.fetchDocumentCategories()
})

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

async function downloadDocument(id) {
  try {
    await documentsStore.downloadDocument(id)
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    alert('Erreur lors du téléchargement')
  }
}

async function deleteDocument(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
    try {
      await documentsStore.deleteDocument(id)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}
</script>

