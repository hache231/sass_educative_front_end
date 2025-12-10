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
          <h5 class="modal-title">{{ report?.title }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>
          
          <div v-else-if="report">
            <div class="mb-3">
              <p><strong>Type:</strong> {{ getReportTypeLabel(report.report_type) }}</p>
              <p><strong>Généré par:</strong> {{ report.generated_by_name }}</p>
              <p><strong>Date:</strong> {{ formatDate(report.created_at) }}</p>
            </div>
            
            <div v-if="report.data">
              <h6>Données du rapport</h6>
              <pre class="bg-light p-3 rounded">{{ JSON.stringify(report.data, null, 2) }}</pre>
            </div>
            
            <div v-if="report.file_url" class="mt-3">
              <a :href="report.file_url" target="_blank" class="btn btn-primary">
                <font-awesome-icon icon="download" class="me-2" />
                Télécharger le fichier
              </a>
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
import { useReportsStore } from '@/stores/reports'

const props = defineProps({
  reportId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close'])

const reportsStore = useReportsStore()

const loading = ref(false)
const report = ref(null)

onMounted(async () => {
  await loadReport()
})

async function loadReport() {
  loading.value = true
  try {
    report.value = await reportsStore.fetchReport(props.reportId)
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    loading.value = false
  }
}

function getReportTypeLabel(type) {
  const labels = {
    students: 'Élèves',
    teachers: 'Enseignants',
    academics: 'Académique',
    finance: 'Financier',
    attendance: 'Présence',
    other: 'Autre'
  }
  return labels[type] || type
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR')
}
</script>

