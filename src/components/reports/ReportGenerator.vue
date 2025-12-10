<template>
  <div class="card">
    <div class="card-header">
      <h5 class="mb-0">Générer un rapport</h5>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <font-awesome-icon icon="users" class="fa-3x text-primary mb-3" />
              <h6>Rapport sur les élèves</h6>
              <p class="text-muted small">Statistiques et informations sur les élèves</p>
              <button
                class="btn btn-primary btn-sm"
                @click="generateReport('students')"
                :disabled="loading"
              >
                {{ loading === 'students' ? 'Génération...' : 'Générer' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <font-awesome-icon icon="chalkboard-teacher" class="fa-3x text-success mb-3" />
              <h6>Rapport sur les enseignants</h6>
              <p class="text-muted small">Statistiques sur les enseignants</p>
              <button
                class="btn btn-success btn-sm"
                @click="generateReport('teachers')"
                :disabled="loading"
              >
                {{ loading === 'teachers' ? 'Génération...' : 'Générer' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <div class="card-body text-center">
              <font-awesome-icon icon="graduation-cap" class="fa-3x text-info mb-3" />
              <h6>Rapport académique</h6>
              <p class="text-muted small">Statistiques académiques et performances</p>
              <button
                class="btn btn-info btn-sm"
                @click="generateReport('academics')"
                :disabled="loading"
              >
                {{ loading === 'academics' ? 'Génération...' : 'Générer' }}
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
import { useReportsStore } from '@/stores/reports'

const emit = defineEmits(['generated'])

const reportsStore = useReportsStore()

const loading = ref(null)

async function generateReport(type) {
  loading.value = type
  try {
    let report
    if (type === 'students') {
      report = await reportsStore.generateStudentsReport()
    } else if (type === 'teachers') {
      report = await reportsStore.generateTeachersReport()
    } else if (type === 'academics') {
      report = await reportsStore.generateAcademicsReport()
    }
    emit('generated', report)
  } catch (error) {
    console.error('Erreur lors de la génération:', error)
    alert('Erreur lors de la génération du rapport')
  } finally {
    loading.value = null
  }
}
</script>

