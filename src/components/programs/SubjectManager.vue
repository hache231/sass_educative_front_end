<template>
  <div class="subject-manager">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0">Matières</h5>
      <button class="btn btn-primary btn-sm" @click="showCreateModal">
        <font-awesome-icon icon="plus" class="me-2" />
        Nouvelle matière
      </button>
    </div>
    
    <div class="mb-3">
      <input
        type="text"
        class="form-control"
        placeholder="Rechercher une matière..."
        v-model="searchQuery"
        @input="handleSearch"
      />
    </div>
    
    <div v-if="programsStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else-if="filteredSubjects.length === 0" class="text-center py-4 text-muted">
      <p>Aucune matière. Créez votre première matière pour commencer.</p>
    </div>
    
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Code</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="subject in filteredSubjects" :key="subject.id">
            <td><span class="badge bg-info">{{ subject.code }}</span></td>
            <td>{{ subject.name }}</td>
            <td>{{ subject.description || '-' }}</td>
            <td>
              <span :class="subject.is_active ? 'badge bg-success' : 'badge bg-secondary'">
                {{ subject.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td>
              <button
                class="btn btn-sm btn-outline-warning me-2"
                @click="editSubject(subject)"
                title="Modifier"
              >
                <font-awesome-icon icon="edit" />
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteSubjectConfirm(subject)"
                title="Supprimer"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <SubjectFormModal
      v-if="showModal"
      :subject="selectedSubject"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProgramsStore } from '@/stores/programs'
import SubjectFormModal from './SubjectFormModal.vue'

const programsStore = useProgramsStore()

const showModal = ref(false)
const selectedSubject = ref(null)
const searchQuery = ref('')

const filteredSubjects = computed(() => {
  if (!searchQuery.value) return programsStore.subjects
  const query = searchQuery.value.toLowerCase()
  return programsStore.subjects.filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.code.toLowerCase().includes(query) ||
    (s.description && s.description.toLowerCase().includes(query))
  )
})

onMounted(async () => {
  await programsStore.fetchSubjects()
})

function showCreateModal() {
  selectedSubject.value = null
  showModal.value = true
}

function editSubject(subject) {
  selectedSubject.value = subject
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedSubject.value = null
}

async function handleSaved() {
  await programsStore.fetchSubjects()
  closeModal()
}

function handleSearch() {
  // La recherche est gérée par le computed filteredSubjects
}

async function deleteSubjectConfirm(subject) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la matière "${subject.name}" ?`)) {
    try {
      await programsStore.deleteSubject(subject.id)
      await programsStore.fetchSubjects()
    } catch (err) {
      alert('Erreur lors de la suppression de la matière')
      console.error('Error deleting subject:', err)
    }
  }
}
</script>

<style scoped>
.subject-manager {
  padding: 0;
}
</style>

