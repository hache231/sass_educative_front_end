<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 mb-1">Gestion des Présences</h1>
        <p class="text-sm text-slate-500">Suivi quotidien des présences et absences</p>
      </div>
      <div class="flex gap-3">
        <router-link
          :to="{ name: 'TakeAttendance' }"
          class="btn btn-primary shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30"
        >
          <font-awesome-icon icon="plus" />
          <span>Faire l'appel</span>
        </router-link>
      </div>
    </div>

    <!-- Filtres et Recherche -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Date -->
        <div>
          <label for="date" class="label">Date</label>
          <input
            type="date"
            id="date"
            v-model="filters.date"
            class="input"
          >
        </div>

        <!-- Classe (Mock pour l'instant, devrait venir du store Classes) -->
        <div>
          <label for="class" class="label">Classe</label>
          <select
            id="class"
            v-model="filters.class"
            class="select"
          >
            <option value="">Toutes les classes</option>
            <option value="1">6ème A</option>
            <option value="2">5ème B</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Liste des présences -->
    <div class="card p-0 overflow-hidden border-slate-200/60">
        <div class="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <h3 class="text-lg font-semibold text-slate-800 mb-1">Historique récent</h3>
            <p class="text-sm text-slate-500">Liste des présences enregistrées</p>
        </div>
        
        <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="spinner spinner-lg"></div>
        </div>

        <div v-else-if="attendances.length === 0" class="empty-state">
            <div class="empty-state-icon">
              <font-awesome-icon icon="calendar-check" class="text-3xl" />
            </div>
            <p class="empty-state-title">Aucune présence enregistrée</p>
            <p class="empty-state-text">Commencez par faire l'appel pour une classe.</p>
            <router-link :to="{ name: 'TakeAttendance' }" class="btn btn-primary mt-4">
              <font-awesome-icon icon="plus" />
              <span>Faire l'appel</span>
            </router-link>
        </div>

        <div v-else class="table-container">
          <table class="table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Élève</th>
                    <th>Statut</th>
                    <th>Justification</th>
                    <th>Enregistré par</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="attendance in attendances" :key="attendance.id">
                    <td class="text-slate-700">
                        {{ new Date(attendance.date).toLocaleDateString('fr-FR') }}
                    </td>
                    <td>
                        <span class="font-medium text-slate-800">{{ attendance.student_name }}</span>
                    </td>
                    <td>
                        <span 
                            class="badge"
                            :class="{
                                'badge-success': attendance.status === 'present',
                                'badge-danger': attendance.status === 'absent',
                                'badge-warning': attendance.status === 'late',
                                'badge-info': attendance.status === 'excused'
                            }"
                        >
                            {{ getStatusLabel(attendance.status) }}
                        </span>
                    </td>
                    <td class="text-slate-500">
                        {{ attendance.reason || '-' }}
                    </td>
                    <td class="text-slate-500">
                        {{ attendance.recorder_name || '-' }}
                    </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAttendanceStore } from '@/stores/attendance'
import { storeToRefs } from 'pinia'

const attendanceStore = useAttendanceStore()
const { attendances, loading } = storeToRefs(attendanceStore)

const filters = ref({
    date: new Date().toISOString().substr(0, 10),
    class: ''
})

const getStatusLabel = (status) => {
    const labels = {
        'present': 'Présent',
        'absent': 'Absent',
        'late': 'En retard',
        'excused': 'Excusé'
    }
    return labels[status] || status
}

const loadData = () => {
    attendanceStore.fetchAttendances({
        date: filters.value.date,
        // class: filters.value.class  // À décommenter quand le back filtrera par classe liée à l'étudiant
    })
}

onMounted(() => {
    loadData()
})

watch(filters, () => {
    loadData()
}, { deep: true })

</script>
