<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Filters -->
    <div class="filter-bar">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label class="label">Classe</label>
          <select class="select" v-model="filters.selectedClass" @change="handleFilterChange">
            <option value="">Toutes les classes</option>
            <option
              v-for="classItem in studentsStore.activeClasses"
              :key="classItem.id"
              :value="classItem.id"
            >
              {{ classItem.name }} ({{ classItem.level }})
            </option>
          </select>
        </div>
        <div>
          <label class="label">Enseignant</label>
          <select class="select" v-model="filters.selectedTeacher" @change="handleFilterChange">
            <option value="">Tous les enseignants</option>
            <option
              v-for="teacher in teachersStore.activeTeachers"
              :key="teacher.id"
              :value="teacher.id"
            >
              {{ teacher.full_name || teacher.user_email }}
            </option>
          </select>
        </div>
        <div>
          <label class="label">Matière</label>
          <select class="select" v-model="filters.selectedSubject" @change="handleFilterChange">
            <option value="">Toutes les matières</option>
            <option
              v-for="subject in subjects"
              :key="subject.id"
              :value="subject.id"
            >
              {{ subject.name }} ({{ subject.code }})
            </option>
          </select>
        </div>
        <div>
          <label class="label">Année scolaire</label>
          <input
            type="text"
            class="input"
            v-model="filters.academicYear"
            placeholder="Ex: 2024-2025"
            @change="handleFilterChange"
          />
        </div>
        <div class="flex items-end">
          <button @click="clearFilters" class="btn btn-ghost w-full">
            <font-awesome-icon icon="times" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="tabs">
      <button
        @click="activeTab = 'schedule'"
        :class="['tab', activeTab === 'schedule' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="calendar-alt" />
        <span>Emploi du temps</span>
      </button>
      <button
        @click="activeTab = 'time-slots'"
        :class="['tab', activeTab === 'time-slots' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="clock" />
        <span>Créneaux</span>
      </button>
      <button
        @click="activeTab = 'events'"
        :class="['tab', activeTab === 'events' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="calendar-check" />
        <span>Événements</span>
      </button>
      <button
        @click="activeTab = 'holidays'"
        :class="['tab', activeTab === 'holidays' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="umbrella-beach" />
        <span>Jours fériés</span>
      </button>
    </div>
    
    <!-- Tab Content -->
    <transition name="fade" mode="out-in">
      <!-- Schedule Tab -->
      <div v-if="activeTab === 'schedule'" key="schedule" class="space-y-4">
        <!-- View Toggle & Actions -->
        <div class="flex items-center justify-between">
          <div class="tabs p-1">
            <button
              @click="viewMode = 'grid'"
              :class="['tab py-2', viewMode === 'grid' ? 'tab-active' : 'tab-inactive']"
            >
              <font-awesome-icon icon="th" />
              <span>Grille</span>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="['tab py-2', viewMode === 'list' ? 'tab-active' : 'tab-inactive']"
            >
              <font-awesome-icon icon="list" />
              <span>Liste</span>
            </button>
          </div>
          <button @click="showScheduleModal()" class="btn btn-primary">
            <font-awesome-icon icon="plus" />
            <span>Nouveau cours</span>
          </button>
        </div>
        
        <div class="card p-0 overflow-hidden">
          <ScheduleGridView
            v-if="viewMode === 'grid'"
            :weekly-data="weeklyData"
            @create="showScheduleModal"
            @edit="editSchedule"
          />
          <ScheduleListView
            v-else
            @create="showScheduleModal"
            @edit="editSchedule"
          />
        </div>
      </div>
      
      <!-- Time Slots Tab -->
      <div v-else-if="activeTab === 'time-slots'" key="time-slots">
        <TimeSlotManager />
      </div>
      
      <!-- Events Tab -->
      <div v-else-if="activeTab === 'events'" key="events" class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-slate-800">Événements du calendrier</h3>
            <p class="text-sm text-slate-500">Réunions, examens et événements spéciaux</p>
          </div>
          <button @click="showEventModal()" class="btn btn-primary">
            <font-awesome-icon icon="plus" />
            <span>Nouvel événement</span>
          </button>
        </div>
        
        <div class="card p-0 overflow-hidden">
          <div v-if="schedulesStore.loading" class="flex items-center justify-center py-20">
            <div class="spinner spinner-lg"></div>
          </div>
          
          <div v-else-if="schedulesStore.calendarEvents.length === 0" class="empty-state">
            <div class="empty-state-icon">
              <font-awesome-icon icon="calendar-plus" class="text-3xl" />
            </div>
            <p class="empty-state-title">Aucun événement</p>
            <p class="empty-state-text">Créez votre premier événement pour commencer.</p>
            <button @click="showEventModal()" class="btn btn-primary mt-4">
              <font-awesome-icon icon="plus" />
              <span>Créer un événement</span>
            </button>
          </div>
          
          <div v-else class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Type</th>
                  <th>Date de début</th>
                  <th>Date de fin</th>
                  <th>Journée entière</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="event in schedulesStore.calendarEvents" :key="event.id">
                  <td class="font-medium text-slate-800">{{ event.title }}</td>
                  <td>
                    <span :class="['badge', getEventTypeClass(event.event_type)]">
                      {{ getEventTypeLabel(event.event_type) }}
                    </span>
                  </td>
                  <td class="text-slate-600">{{ formatDateTime(event.start_date) }}</td>
                  <td class="text-slate-600">{{ formatDateTime(event.end_date) }}</td>
                  <td>
                    <span :class="['badge', event.is_all_day ? 'badge-success' : 'badge-secondary']">
                      {{ event.is_all_day ? 'Oui' : 'Non' }}
                    </span>
                  </td>
                  <td>
                    <div class="flex items-center justify-end gap-2">
                      <button
                        @click="editEvent(event)"
                        class="action-btn action-btn-edit"
                        title="Modifier"
                      >
                        <font-awesome-icon icon="edit" />
                      </button>
                      <button
                        @click="deleteEventConfirm(event)"
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
        </div>
      </div>
      
      <!-- Holidays Tab -->
      <div v-else-if="activeTab === 'holidays'" key="holidays" class="space-y-4">
        <!-- Header -->
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-slate-800">Jours fériés</h3>
            <p class="text-sm text-slate-500">Vacances et jours de fermeture</p>
          </div>
          <button @click="showHolidayModal()" class="btn btn-primary">
            <font-awesome-icon icon="plus" />
            <span>Nouveau jour férié</span>
          </button>
        </div>
        
        <div class="card p-0 overflow-hidden">
          <div v-if="schedulesStore.loading" class="flex items-center justify-center py-20">
            <div class="spinner spinner-lg"></div>
          </div>
          
          <div v-else-if="schedulesStore.holidays.length === 0" class="empty-state">
            <div class="empty-state-icon">
              <font-awesome-icon icon="umbrella-beach" class="text-3xl" />
            </div>
            <p class="empty-state-title">Aucun jour férié</p>
            <p class="empty-state-text">Ajoutez les jours fériés et vacances.</p>
            <button @click="showHolidayModal()" class="btn btn-primary mt-4">
              <font-awesome-icon icon="plus" />
              <span>Ajouter un jour férié</span>
            </button>
          </div>
          
          <div v-else class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Date</th>
                  <th>Récurrent</th>
                  <th>Description</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="holiday in schedulesStore.holidays" :key="holiday.id">
                  <td class="font-medium text-slate-800">{{ holiday.name }}</td>
                  <td class="text-slate-600">{{ formatDate(holiday.date) }}</td>
                  <td>
                    <span :class="['badge', holiday.is_recurring ? 'badge-success' : 'badge-secondary']">
                      {{ holiday.is_recurring ? 'Oui' : 'Non' }}
                    </span>
                  </td>
                  <td class="text-slate-600">{{ holiday.description || '-' }}</td>
                  <td>
                    <div class="flex items-center justify-end gap-2">
                      <button
                        @click="editHoliday(holiday)"
                        class="action-btn action-btn-edit"
                        title="Modifier"
                      >
                        <font-awesome-icon icon="edit" />
                      </button>
                      <button
                        @click="deleteHolidayConfirm(holiday)"
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
        </div>
      </div>
    </transition>
    
    <!-- Modals -->
    <ScheduleFormModal
      v-if="showScheduleFormModal"
      :schedule="selectedSchedule"
      @close="closeScheduleModal"
      @saved="handleScheduleSaved"
    />
    
    <CalendarEventFormModal
      v-if="showEventFormModal"
      :event="selectedEvent"
      @close="closeEventModal"
      @saved="handleEventSaved"
    />
    
    <HolidayFormModal
      v-if="showHolidayFormModal"
      :holiday="selectedHoliday"
      @close="closeHolidayModal"
      @saved="handleHolidaySaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useSchedulesStore } from '@/stores/schedules'
import { useStudentsStore } from '@/stores/students'
import { useTeachersStore } from '@/stores/teachers'
import TimeSlotManager from '@/components/schedules/TimeSlotManager.vue'
import ScheduleGridView from '@/components/schedules/ScheduleGridView.vue'
import ScheduleListView from '@/components/schedules/ScheduleListView.vue'
import ScheduleFormModal from '@/components/schedules/ScheduleFormModal.vue'
import CalendarEventFormModal from '@/components/schedules/CalendarEventFormModal.vue'
import HolidayFormModal from '@/components/schedules/HolidayFormModal.vue'
import api from '@/api/index'

const schedulesStore = useSchedulesStore()
const studentsStore = useStudentsStore()
const teachersStore = useTeachersStore()

const activeTab = ref('schedule')
const viewMode = ref('grid')
const showScheduleFormModal = ref(false)
const showEventFormModal = ref(false)
const showHolidayFormModal = ref(false)
const selectedSchedule = ref(null)
const selectedEvent = ref(null)
const selectedHoliday = ref(null)
const subjects = ref([])
const weeklyData = ref({})

const filters = computed(() => schedulesStore.filters)

onMounted(async () => {
  await Promise.all([
    studentsStore.fetchClasses({ is_active: true }),
    teachersStore.fetchTeachers({ is_active: true }),
    loadSubjects(),
    schedulesStore.fetchTimeSlots(),
    schedulesStore.fetchSchedules(),
    schedulesStore.fetchCalendarEvents(),
    schedulesStore.fetchHolidays()
  ])
  
  if (viewMode.value === 'grid') {
    await loadWeeklyData()
  }
})

watch(viewMode, async (newMode) => {
  if (newMode === 'grid') {
    await loadWeeklyData()
  }
})

async function loadSubjects() {
  try {
    const response = await api.get('/academics/subjects/', { params: { is_active: true } })
    subjects.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
  } catch (err) {
    console.error('Error loading subjects:', err)
  }
}

async function loadWeeklyData() {
  try {
    const data = await schedulesStore.fetchWeeklySchedule({
      class_id: filters.value.selectedClass,
      academic_year: filters.value.academicYear
    })
    weeklyData.value = data
  } catch (err) {
    console.error('Error loading weekly data:', err)
  }
}

function handleFilterChange() {
  schedulesStore.setFilters({
    selectedClass: filters.value.selectedClass || null,
    selectedTeacher: filters.value.selectedTeacher || null,
    selectedSubject: filters.value.selectedSubject || null,
    academicYear: filters.value.academicYear || null
  })
  
  schedulesStore.fetchSchedules()
  
  if (viewMode.value === 'grid') {
    loadWeeklyData()
  }
}

function clearFilters() {
  schedulesStore.clearFilters()
  schedulesStore.fetchSchedules()
  if (viewMode.value === 'grid') {
    loadWeeklyData()
  }
}

// Schedule functions
function showScheduleModal(scheduleData = null) {
  selectedSchedule.value = scheduleData || null
  showScheduleFormModal.value = true
}

function editSchedule(schedule) {
  selectedSchedule.value = schedule
  showScheduleFormModal.value = true
}

function closeScheduleModal() {
  showScheduleFormModal.value = false
  selectedSchedule.value = null
}

async function handleScheduleSaved() {
  await schedulesStore.fetchSchedules()
  if (viewMode.value === 'grid') {
    await loadWeeklyData()
  }
  closeScheduleModal()
}

// Event functions
function showEventModal() {
  selectedEvent.value = null
  showEventFormModal.value = true
}

function editEvent(event) {
  selectedEvent.value = event
  showEventFormModal.value = true
}

function closeEventModal() {
  showEventFormModal.value = false
  selectedEvent.value = null
}

async function handleEventSaved() {
  await schedulesStore.fetchCalendarEvents()
  closeEventModal()
}

async function deleteEventConfirm(event) {
  if (confirm(`Supprimer l'événement "${event.title}" ?`)) {
    try {
      await schedulesStore.deleteCalendarEvent(event.id)
      await schedulesStore.fetchCalendarEvents()
    } catch (err) {
      alert('Erreur lors de la suppression')
      console.error(err)
    }
  }
}

// Holiday functions
function showHolidayModal() {
  selectedHoliday.value = null
  showHolidayFormModal.value = true
}

function editHoliday(holiday) {
  selectedHoliday.value = holiday
  showHolidayFormModal.value = true
}

function closeHolidayModal() {
  showHolidayFormModal.value = false
  selectedHoliday.value = null
}

async function handleHolidaySaved() {
  await schedulesStore.fetchHolidays()
  closeHolidayModal()
}

async function deleteHolidayConfirm(holiday) {
  if (confirm(`Supprimer le jour férié "${holiday.name}" ?`)) {
    try {
      await schedulesStore.deleteHoliday(holiday.id)
      await schedulesStore.fetchHolidays()
    } catch (err) {
      alert('Erreur lors de la suppression')
      console.error(err)
    }
  }
}

// Helpers
function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function formatDateTime(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getEventTypeLabel(type) {
  const labels = {
    holiday: 'Jour férié',
    meeting: 'Réunion',
    exam: 'Examen',
    event: 'Événement',
    other: 'Autre'
  }
  return labels[type] || type
}

function getEventTypeClass(type) {
  const classes = {
    holiday: 'badge-success',
    meeting: 'badge-info',
    exam: 'badge-warning',
    event: 'badge-purple',
    other: 'badge-secondary'
  }
  return classes[type] || 'badge-secondary'
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
