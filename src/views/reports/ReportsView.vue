<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Quick Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div class="stat-card stat-card-teal">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-teal">
            <font-awesome-icon icon="file-alt" class="text-lg" />
          </div>
        </div>
        <p class="stat-value text-2xl">{{ reportsStore.reports.length }}</p>
        <p class="stat-label">Rapports générés</p>
      </div>
      <div class="stat-card stat-card-amber">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-amber">
            <font-awesome-icon icon="user-graduate" class="text-lg" />
          </div>
        </div>
        <p class="stat-value text-2xl">0</p>
        <p class="stat-label">Rapports élèves</p>
      </div>
      <div class="stat-card stat-card-sky">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-sky">
            <font-awesome-icon icon="door-open" class="text-lg" />
          </div>
        </div>
        <p class="stat-value text-2xl">0</p>
        <p class="stat-label">Rapports classes</p>
      </div>
      <div class="stat-card stat-card-purple">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-purple">
            <font-awesome-icon icon="chart-line" class="text-lg" />
          </div>
        </div>
        <p class="stat-value text-2xl">0</p>
        <p class="stat-label">Analyses</p>
      </div>
    </div>
    
    <!-- Report Generator -->
    <div class="card">
      <div class="card-header">
        <h3>Générer un rapport</h3>
      </div>
      <ReportGenerator @generated="handleReportGenerated" />
    </div>
    
    <!-- Generated Reports -->
    <div class="card p-0 overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-slate-800">Rapports générés</h3>
          <p class="text-sm text-slate-500">Historique de vos rapports</p>
        </div>
        <div class="search-input w-64">
          <font-awesome-icon icon="search" class="search-input-icon" />
          <input type="text" placeholder="Rechercher..." class="input pl-10 py-2" />
        </div>
      </div>
      
      <div v-if="reportsStore.loading" class="flex items-center justify-center py-20">
        <div class="spinner spinner-lg"></div>
      </div>
      
      <div v-else-if="reportsStore.reports.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <font-awesome-icon icon="file-alt" class="text-3xl" />
        </div>
        <p class="empty-state-title">Aucun rapport</p>
        <p class="empty-state-text">Utilisez le générateur ci-dessus pour créer votre premier rapport.</p>
      </div>
      
      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Type</th>
              <th>Généré par</th>
              <th>Date</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(report, index) in reportsStore.reports" 
              :key="report.id"
              class="animate-fade-in"
              :style="{ animationDelay: `${index * 0.03}s` }"
            >
              <td>
                <div class="flex items-center gap-3">
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', getReportIconClass(report.report_type)]">
                    <font-awesome-icon :icon="getReportIcon(report.report_type)" />
                  </div>
                  <span class="font-medium text-slate-800">{{ report.title }}</span>
                </div>
              </td>
              <td>
                <span :class="['badge', getReportBadgeClass(report.report_type)]">
                  {{ getReportTypeLabel(report.report_type) }}
                </span>
              </td>
              <td class="text-slate-600">{{ report.generated_by_name }}</td>
              <td class="text-slate-600">{{ formatDate(report.created_at) }}</td>
              <td>
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="viewReport(report.id)"
                    class="action-btn action-btn-view"
                    title="Voir"
                  >
                    <font-awesome-icon icon="eye" />
                  </button>
                  <button
                    @click="downloadReport(report.id)"
                    class="action-btn action-btn-success"
                    title="Télécharger"
                  >
                    <font-awesome-icon icon="download" />
                  </button>
                  <button
                    @click="deleteReport(report.id)"
                    class="action-btn action-btn-delete"
                    title="Supprimer"
                  >
                    <font-awesome-icon icon="trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Footer -->
      <div v-if="reportsStore.reports.length > 0" class="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
        <p class="text-sm text-slate-600">
          {{ reportsStore.reports.length }} rapport(s) généré(s)
        </p>
      </div>
    </div>
    
    <!-- Report Viewer Modal -->
    <ReportViewer
      v-if="selectedReportId"
      :report-id="selectedReportId"
      @close="selectedReportId = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReportsStore } from '@/stores/reports'
import ReportGenerator from '@/components/reports/ReportGenerator.vue'
import ReportViewer from '@/components/reports/ReportViewer.vue'

const reportsStore = useReportsStore()
const selectedReportId = ref(null)

onMounted(async () => {
  await reportsStore.fetchReports()
})

function handleReportGenerated() {
  reportsStore.fetchReports()
}

function viewReport(id) {
  selectedReportId.value = id
}

function downloadReport(id) {
  // TODO: Implement download functionality
}

function deleteReport(id) {
  if (confirm('Supprimer ce rapport ?')) {
    // TODO: Implement delete functionality
  }
}

function getReportTypeLabel(type) {
  const labels = {
    student: 'Élève',
    class: 'Classe',
    teacher: 'Enseignant',
    academic: 'Académique',
    financial: 'Financier',
    attendance: 'Présence',
    other: 'Autre'
  }
  return labels[type] || type
}

function getReportIcon(type) {
  const icons = {
    student: 'user-graduate',
    class: 'door-open',
    teacher: 'chalkboard-teacher',
    academic: 'book-open',
    financial: 'wallet',
    attendance: 'calendar-check',
    other: 'file-alt'
  }
  return icons[type] || 'file-alt'
}

function getReportIconClass(type) {
  const classes = {
    student: 'bg-teal-100 text-teal-600',
    class: 'bg-sky-100 text-sky-600',
    teacher: 'bg-amber-100 text-amber-600',
    academic: 'bg-purple-100 text-purple-600',
    financial: 'bg-emerald-100 text-emerald-600',
    attendance: 'bg-rose-100 text-rose-600',
    other: 'bg-slate-100 text-slate-600'
  }
  return classes[type] || 'bg-slate-100 text-slate-600'
}

function getReportBadgeClass(type) {
  const classes = {
    student: 'badge-primary',
    class: 'badge-info',
    teacher: 'badge-warning',
    academic: 'badge-purple',
    financial: 'badge-success',
    attendance: 'badge-danger',
    other: 'badge-secondary'
  }
  return classes[type] || 'badge-secondary'
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
