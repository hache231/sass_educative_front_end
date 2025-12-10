<template>
  <div
    class="modal fade show"
    style="display: block; background-color: rgba(0,0,0,0.5);"
    tabindex="-1"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Gestion des notes - {{ assessment?.title }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>
          
          <div v-else>
            <div class="mb-3">
              <button class="btn btn-primary btn-sm" @click="showBulkForm = true">
                <font-awesome-icon icon="plus" class="me-2" />
                Ajouter des notes en masse
              </button>
            </div>
            
            <div v-if="grades.length === 0" class="text-center text-muted py-5">
              <p>Aucune note enregistrée</p>
            </div>
            
            <div v-else class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Élève</th>
                    <th>ID</th>
                    <th>Note</th>
                    <th>Note max</th>
                    <th>Pourcentage</th>
                    <th>Commentaire</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="grade in grades" :key="grade.id">
                    <td>{{ grade.student_name }}</td>
                    <td>{{ grade.student_id }}</td>
                    <td>{{ grade.score }}</td>
                    <td>{{ grade.assessment_max_score }}</td>
                    <td>{{ grade.percentage }}%</td>
                    <td>{{ grade.comment || '-' }}</td>
                    <td>
                      <button
                        class="btn btn-sm btn-outline-warning me-2"
                        @click="editGrade(grade)"
                        title="Modifier"
                      >
                        <font-awesome-icon icon="edit" />
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="deleteGrade(grade)"
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
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAssessmentsStore } from '@/stores/assessments'
import { useStudentsStore } from '@/stores/students'

const props = defineProps({
  assessment: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

const assessmentsStore = useAssessmentsStore()
const studentsStore = useStudentsStore()

const loading = ref(false)
const grades = ref([])
const showBulkForm = ref(false)

onMounted(async () => {
  await loadGrades()
})

async function loadGrades() {
  loading.value = true
  try {
    const data = await assessmentsStore.fetchAssessmentGrades(props.assessment.id)
    grades.value = data
  } catch (error) {
    console.error('Erreur lors du chargement des notes:', error)
  } finally {
    loading.value = false
  }
}

function editGrade(grade) {
  // Fonctionnalité d'édition de note non implémentée - sera ajoutée dans une version future
  alert('Fonctionnalité d\'édition de note non implémentée pour le moment.')
}

async function deleteGrade(grade) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la note de ${grade.student_name} ?`)) {
    try {
      await assessmentsStore.deleteGrade(grade.id)
      await loadGrades()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }
}
</script>

