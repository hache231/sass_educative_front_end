<template>
  <div class="program-manager">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0">Programmes pédagogiques</h5>
      <button class="btn btn-primary btn-sm" @click="showCreateModal">
        <font-awesome-icon icon="plus" class="me-2" />
        Nouveau programme
      </button>
    </div>
    
    <div v-if="programsStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else-if="programsStore.filteredPrograms.length === 0" class="text-center py-4 text-muted">
      <p>Aucun programme. Créez votre premier programme pour commencer.</p>
    </div>
    
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Classe</th>
            <th>Matière</th>
            <th>Année scolaire</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="program in programsStore.filteredPrograms" :key="program.id">
            <td>{{ program.name }}</td>
            <td>{{ program.class_name || '-' }}</td>
            <td>
              <span class="badge bg-primary">{{ program.subject_name }}</span>
              <span class="badge bg-secondary ms-1">{{ program.subject_code }}</span>
            </td>
            <td>{{ program.academic_year }}</td>
            <td>{{ program.description || '-' }}</td>
            <td>
              <button
                class="btn btn-sm btn-outline-info me-2"
                @click="$emit('view-courses', program)"
                title="Voir les cours"
              >
                <font-awesome-icon icon="book" />
              </button>
              <button
                class="btn btn-sm btn-outline-warning me-2"
                @click="editProgram(program)"
                title="Modifier"
              >
                <font-awesome-icon icon="edit" />
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteProgramConfirm(program)"
                title="Supprimer"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <ProgramFormModal
      v-if="showModal"
      :program="selectedProgram"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useProgramsStore } from '@/stores/programs'
import ProgramFormModal from './ProgramFormModal.vue'

const emit = defineEmits(['view-courses'])

const programsStore = useProgramsStore()

const showModal = ref(false)
const selectedProgram = ref(null)

function showCreateModal() {
  selectedProgram.value = null
  showModal.value = true
}

function editProgram(program) {
  selectedProgram.value = program
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedProgram.value = null
}

async function handleSaved() {
  await programsStore.fetchPrograms()
  closeModal()
}

async function deleteProgramConfirm(program) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le programme "${program.name}" ?`)) {
    try {
      await programsStore.deleteProgram(program.id)
      await programsStore.fetchPrograms()
    } catch (err) {
      alert('Erreur lors de la suppression du programme')
      console.error('Error deleting program:', err)
    }
  }
}
</script>

<style scoped>
.program-manager {
  padding: 0;
}
</style>

