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
          <h5 class="modal-title">Bulletin - {{ reportCard?.student_name }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>
          
          <div v-else-if="reportCard">
            <div class="mb-4">
              <h6>Informations générales</h6>
              <p><strong>Élève:</strong> {{ reportCard.student_name }} ({{ reportCard.student_id }})</p>
              <p><strong>Classe:</strong> {{ reportCard.class_name }}</p>
              <p><strong>Période:</strong> {{ reportCard.period }}</p>
              <p><strong>Année académique:</strong> {{ reportCard.academic_year }}</p>
              <p><strong>Moyenne générale:</strong> {{ reportCard.overall_average || 'Non calculée' }}</p>
              <p v-if="reportCard.rank"><strong>Rang:</strong> {{ reportCard.rank }}/{{ reportCard.total_students }}</p>
            </div>
            
            <div v-if="reportCard.subject_grades && reportCard.subject_grades.length > 0">
              <h6>Notes par matière</h6>
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Matière</th>
                      <th>Code</th>
                      <th>Moyenne</th>
                      <th>Détails</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="subject in reportCard.subject_grades" :key="subject.subject_id">
                      <td>{{ subject.subject_name }}</td>
                      <td>{{ subject.subject_code }}</td>
                      <td>{{ subject.average || '-' }}</td>
                      <td>
                        <div v-for="grade in subject.grades" :key="grade.assessment_title" class="small">
                          {{ grade.assessment_title }}: {{ grade.score }}/{{ grade.max_score }} ({{ grade.percentage }}%)
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div v-if="reportCard.comments" class="mt-3">
              <h6>Commentaires</h6>
              <p>{{ reportCard.comments }}</p>
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

const props = defineProps({
  reportCardId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close'])

const assessmentsStore = useAssessmentsStore()

const loading = ref(false)
const reportCard = ref(null)

onMounted(async () => {
  await loadReportCard()
})

async function loadReportCard() {
  loading.value = true
  try {
    reportCard.value = await assessmentsStore.fetchReportCard(props.reportCardId)
  } catch (error) {
    console.error('Erreur lors du chargement du bulletin:', error)
  } finally {
    loading.value = false
  }
}
</script>

