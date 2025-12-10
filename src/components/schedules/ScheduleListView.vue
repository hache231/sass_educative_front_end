<template>
  <div class="schedule-list-view">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0">Liste des cours</h5>
      <button class="btn btn-primary btn-sm" @click="$emit('create')">
        <font-awesome-icon icon="plus" class="me-2" />
        Nouveau cours
      </button>
    </div>
    
    <div v-if="schedulesStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else-if="schedulesStore.filteredSchedules.length === 0" class="text-center py-4 text-muted">
      <p>Aucun cours planifié. Créez votre premier cours pour commencer.</p>
    </div>
    
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Jour</th>
            <th>Créneau</th>
            <th>Classe</th>
            <th>Matière</th>
            <th>Enseignant</th>
            <th>Salle</th>
            <th>Année scolaire</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="schedule in schedulesStore.filteredSchedules" :key="schedule.id">
            <td>{{ getDayName(schedule.day_of_week) }}</td>
            <td>{{ schedule.time_slot_display || '-' }}</td>
            <td>{{ schedule.class_name || '-' }}</td>
            <td>{{ schedule.subject_name || '-' }}</td>
            <td>{{ schedule.teacher_name || '-' }}</td>
            <td>{{ schedule.room || '-' }}</td>
            <td>{{ schedule.academic_year }}</td>
            <td>
              <span :class="schedule.is_active ? 'badge bg-success' : 'badge bg-secondary'">
                {{ schedule.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td>
              <button
                class="btn btn-sm btn-outline-warning me-2"
                @click="$emit('edit', schedule)"
                title="Modifier"
              >
                <font-awesome-icon icon="edit" />
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteScheduleConfirm(schedule)"
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
import { useSchedulesStore } from '@/stores/schedules'

const schedulesStore = useSchedulesStore()

defineEmits(['create', 'edit'])

function getDayName(dayOfWeek) {
  const days = {
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sunday: 'Dimanche'
  }
  return days[dayOfWeek] || dayOfWeek
}

async function deleteScheduleConfirm(schedule) {
  const scheduleName = `${schedule.class_name} - ${schedule.subject_name} - ${getDayName(schedule.day_of_week)}`
  if (confirm(`Êtes-vous sûr de vouloir supprimer le cours "${scheduleName}" ?`)) {
    try {
      await schedulesStore.deleteSchedule(schedule.id)
      await schedulesStore.fetchSchedules()
    } catch (err) {
      alert('Erreur lors de la suppression du cours')
      console.error('Error deleting schedule:', err)
    }
  }
}
</script>

<style scoped>
.schedule-list-view {
  padding: 0;
}
</style>

