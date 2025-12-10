<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5>Évaluations</h5>
      <button class="btn btn-primary btn-sm" @click="showModal = true">
        <font-awesome-icon icon="plus" class="me-2" />
        Nouvelle évaluation
      </button>
    </div>
    
    <div v-if="assessmentsStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else-if="assessmentsStore.filteredAssessments.length === 0" class="text-center text-muted py-5">
      <p>Aucune évaluation</p>
    </div>
    
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Titre</th>
            <th>Classe</th>
            <th>Matière</th>
            <th>Type</th>
            <th>Date</th>
            <th>Note max</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="assessment in assessmentsStore.filteredAssessments" :key="assessment.id">
            <td>{{ assessment.title }}</td>
            <td>{{ assessment.class_name }}</td>
            <td>{{ assessment.subject_name }}</td>
            <td>
              <span class="badge bg-info">{{ getAssessmentTypeLabel(assessment.assessment_type) }}</span>
            </td>
            <td>{{ formatDate(assessment.date) }}</td>
            <td>{{ assessment.max_score }}</td>
            <td>
              <button
                class="btn btn-sm btn-outline-primary me-2"
                @click="viewGrades(assessment)"
                title="Voir les notes"
              >
                <font-awesome-icon icon="edit" />
              </button>
              <button
                class="btn btn-sm btn-outline-warning me-2"
                @click="editAssessment(assessment)"
                title="Modifier"
              >
                <font-awesome-icon icon="edit" />
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteAssessment(assessment)"
                title="Supprimer"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <AssessmentFormModal
      v-if="showModal"
      :assessment="selectedAssessment"
      @close="closeModal"
      @saved="handleSaved"
    />
    
    <GradeManager
      v-if="showGradeManager"
      :assessment="selectedAssessment"
      @close="showGradeManager = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAssessmentsStore } from '@/stores/assessments'
import AssessmentFormModal from './AssessmentFormModal.vue'
import GradeManager from './GradeManager.vue'

const assessmentsStore = useAssessmentsStore()

const showModal = ref(false)
const showGradeManager = ref(false)
const selectedAssessment = ref(null)

onMounted(async () => {
  await assessmentsStore.fetchAssessments()
})

function getAssessmentTypeLabel(type) {
  const labels = {
    quiz: 'Quiz',
    test: 'Contrôle',
    exam: 'Examen',
    assignment: 'Devoir',
    project: 'Projet'
  }
  return labels[type] || type
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function editAssessment(assessment) {
  selectedAssessment.value = assessment
  showModal.value = true
}

function viewGrades(assessment) {
  selectedAssessment.value = assessment
  showGradeManager.value = true
}

async function deleteAssessment(assessment) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'évaluation "${assessment.title}" ?`)) {
    try {
      await assessmentsStore.deleteAssessment(assessment.id)
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}

function closeModal() {
  showModal.value = false
  selectedAssessment.value = null
}

function handleSaved() {
  assessmentsStore.fetchAssessments()
}
</script>

