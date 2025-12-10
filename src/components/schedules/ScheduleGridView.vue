<template>
  <div class="schedule-grid-view">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0">Grille hebdomadaire</h5>
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
    
    <div v-else class="table-responsive">
      <table class="table table-bordered schedule-grid">
        <thead>
          <tr>
            <th class="time-slot-header">Créneaux</th>
            <th v-for="day in daysOfWeek" :key="day.value" class="day-header">
              {{ day.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="timeSlot in schedulesStore.activeTimeSlots" :key="timeSlot.id">
            <td class="time-slot-cell">
              <strong>{{ formatTime(timeSlot.start_time) }} - {{ formatTime(timeSlot.end_time) }}</strong>
            </td>
            <td
              v-for="day in daysOfWeek"
              :key="`${timeSlot.id}-${day.value}`"
              class="schedule-cell"
              @click="handleCellClick(day.value, timeSlot.id)"
            >
              <div
                v-for="schedule in getSchedulesForCell(day.value, timeSlot.id)"
                :key="schedule.id"
                class="schedule-item"
                :class="{ 'inactive': !schedule.is_active }"
                @click.stop="handleScheduleClick(schedule)"
              >
                <div class="schedule-subject">{{ schedule.subject_name }}</div>
                <div class="schedule-class">{{ schedule.class_name }}</div>
                <div class="schedule-teacher">{{ schedule.teacher_name }}</div>
                <div v-if="schedule.room" class="schedule-room">
                  <font-awesome-icon icon="door-open" class="me-1" />
                  {{ schedule.room }}
                </div>
              </div>
              <div
                v-if="getSchedulesForCell(day.value, timeSlot.id).length === 0"
                class="empty-cell"
              >
                <font-awesome-icon icon="plus" class="text-muted" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSchedulesStore } from '@/stores/schedules'

const schedulesStore = useSchedulesStore()

const props = defineProps({
  weeklyData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['create', 'edit'])

const daysOfWeek = [
  { value: 'monday', label: 'Lundi' },
  { value: 'tuesday', label: 'Mardi' },
  { value: 'wednesday', label: 'Mercredi' },
  { value: 'thursday', label: 'Jeudi' },
  { value: 'friday', label: 'Vendredi' },
  { value: 'saturday', label: 'Samedi' },
  { value: 'sunday', label: 'Dimanche' }
]

function formatTime(timeString) {
  if (!timeString) return ''
  return timeString.substring(0, 5)
}

function getSchedulesForCell(dayOfWeek, timeSlotId) {
  // Si on a des données formatées depuis weekly_view
  if (props.weeklyData && props.weeklyData[dayOfWeek]) {
    return props.weeklyData[dayOfWeek].filter(s => s.time_slot_id === timeSlotId)
  }
  
  // Sinon, filtrer depuis la liste des schedules
  return schedulesStore.filteredSchedules.filter(s => 
    s.day_of_week === dayOfWeek && s.time_slot === timeSlotId
  )
}

function handleCellClick(dayOfWeek, timeSlotId) {
  // Créer un nouveau cours pour ce créneau et ce jour
  emit('create', { day_of_week: dayOfWeek, time_slot: timeSlotId })
}

function handleScheduleClick(schedule) {
  emit('edit', schedule)
}
</script>

<style scoped>
.schedule-grid-view {
  padding: 0;
}

.schedule-grid {
  font-size: 0.875rem;
}

.time-slot-header,
.day-header {
  text-align: center;
  background-color: #f8f9fa;
  font-weight: 600;
  padding: 0.75rem;
}

.time-slot-cell {
  background-color: #f8f9fa;
  font-weight: 500;
  text-align: center;
  vertical-align: middle;
  width: 120px;
  padding: 0.75rem;
}

.schedule-cell {
  position: relative;
  min-height: 80px;
  padding: 0.25rem;
  vertical-align: top;
  cursor: pointer;
  transition: background-color 0.2s;
}

.schedule-cell:hover {
  background-color: #f0f0f0;
}

.empty-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 60px;
  opacity: 0.3;
}

.schedule-item {
  background-color: #4a90e2;
  color: white;
  padding: 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-size: 0.75rem;
}

.schedule-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.schedule-item.inactive {
  background-color: #95a5a6;
  opacity: 0.7;
}

.schedule-subject {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.schedule-class {
  font-size: 0.7rem;
  opacity: 0.9;
  margin-bottom: 0.15rem;
}

.schedule-teacher {
  font-size: 0.7rem;
  opacity: 0.85;
  margin-bottom: 0.15rem;
}

.schedule-room {
  font-size: 0.65rem;
  opacity: 0.8;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
}
</style>

