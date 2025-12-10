<template>
  <div
    class="modal fade show"
    style="display: block; background-color: rgba(0,0,0,0.5);"
    tabindex="-1"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ schedule ? 'Modifier le cours' : 'Nouveau cours' }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="class_obj" class="form-label">Classe *</label>
                <select
                  class="form-select"
                  id="class_obj"
                  v-model="form.class_obj"
                  required
                >
                  <option value="">Sélectionner une classe</option>
                  <option
                    v-for="classItem in classes"
                    :key="classItem.id"
                    :value="classItem.id"
                  >
                    {{ classItem.name }} ({{ classItem.level }})
                  </option>
                </select>
              </div>
              
              <div class="col-md-6 mb-3">
                <label for="subject" class="form-label">Matière *</label>
                <select
                  class="form-select"
                  id="subject"
                  v-model="form.subject"
                  required
                >
                  <option value="">Sélectionner une matière</option>
                  <option
                    v-for="subject in subjects"
                    :key="subject.id"
                    :value="subject.id"
                  >
                    {{ subject.name }} ({{ subject.code }})
                  </option>
                </select>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="teacher" class="form-label">Enseignant *</label>
                <select
                  class="form-select"
                  id="teacher"
                  v-model="form.teacher"
                  required
                >
                  <option value="">Sélectionner un enseignant</option>
                  <option
                    v-for="teacher in teachers"
                    :key="teacher.id"
                    :value="teacher.id"
                  >
                    {{ teacher.full_name || teacher.user_email }}
                  </option>
                </select>
              </div>
              
              <div class="col-md-6 mb-3">
                <label for="time_slot" class="form-label">Créneau horaire *</label>
                <select
                  class="form-select"
                  id="time_slot"
                  v-model="form.time_slot"
                  required
                >
                  <option value="">Sélectionner un créneau</option>
                  <option
                    v-for="timeSlot in schedulesStore.activeTimeSlots"
                    :key="timeSlot.id"
                    :value="timeSlot.id"
                  >
                    {{ formatTime(timeSlot.start_time) }} - {{ formatTime(timeSlot.end_time) }}
                  </option>
                </select>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="day_of_week" class="form-label">Jour de la semaine *</label>
                <select
                  class="form-select"
                  id="day_of_week"
                  v-model="form.day_of_week"
                  required
                >
                  <option value="">Sélectionner un jour</option>
                  <option value="monday">Lundi</option>
                  <option value="tuesday">Mardi</option>
                  <option value="wednesday">Mercredi</option>
                  <option value="thursday">Jeudi</option>
                  <option value="friday">Vendredi</option>
                  <option value="saturday">Samedi</option>
                  <option value="sunday">Dimanche</option>
                </select>
              </div>
              
              <div class="col-md-6 mb-3">
                <label for="academic_year" class="form-label">Année scolaire *</label>
                <input
                  type="text"
                  class="form-control"
                  id="academic_year"
                  v-model="form.academic_year"
                  placeholder="Ex: 2024-2025"
                  required
                />
              </div>
            </div>
            
            <div class="mb-3">
              <label for="room" class="form-label">Salle</label>
              <input
                type="text"
                class="form-control"
                id="room"
                v-model="form.room"
                placeholder="Ex: A101"
              />
            </div>
            
            <div class="mb-3">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="is_active"
                  v-model="form.is_active"
                />
                <label class="form-check-label" for="is_active">
                  Actif
                </label>
              </div>
            </div>
            
            <div v-if="error" class="alert alert-danger">
              {{ error }}
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="$emit('close')">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary" :disabled="schedulesStore.loading">
                {{ schedule ? 'Modifier' : 'Créer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useSchedulesStore } from '@/stores/schedules'
import { useStudentsStore } from '@/stores/students'
import { useTeachersStore } from '@/stores/teachers'
import api from '@/api/index'

const props = defineProps({
  schedule: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const schedulesStore = useSchedulesStore()
const studentsStore = useStudentsStore()
const teachersStore = useTeachersStore()

const classes = ref([])
const subjects = ref([])
const teachers = ref([])
const error = ref(null)

const form = ref({
  class_obj: '',
  subject: '',
  teacher: '',
  time_slot: '',
  day_of_week: '',
  room: '',
  academic_year: '',
  is_active: true
})

onMounted(async () => {
  await Promise.all([
    loadClasses(),
    loadSubjects(),
    loadTeachers(),
    schedulesStore.fetchTimeSlots()
  ])
  
  if (props.schedule) {
    form.value = {
      class_obj: props.schedule.class_obj,
      subject: props.schedule.subject,
      teacher: props.schedule.teacher,
      time_slot: props.schedule.time_slot,
      day_of_week: props.schedule.day_of_week,
      room: props.schedule.room || '',
      academic_year: props.schedule.academic_year,
      is_active: props.schedule.is_active !== false
    }
  }
})

async function loadClasses() {
  try {
    await studentsStore.fetchClasses({ is_active: true })
    classes.value = studentsStore.activeClasses
  } catch (err) {
    console.error('Error loading classes:', err)
  }
}

async function loadSubjects() {
  try {
    const response = await api.get('/academics/subjects/', { params: { is_active: true } })
    subjects.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
  } catch (err) {
    console.error('Error loading subjects:', err)
  }
}

async function loadTeachers() {
  try {
    await teachersStore.fetchTeachers({ is_active: true })
    teachers.value = teachersStore.activeTeachers
  } catch (err) {
    console.error('Error loading teachers:', err)
  }
}

async function handleSubmit() {
  error.value = null
  
  try {
    if (props.schedule) {
      await schedulesStore.updateSchedule(props.schedule.id, form.value)
    } else {
      await schedulesStore.createSchedule(form.value)
    }
    emit('saved')
  } catch (err) {
    if (err.response?.data) {
      if (typeof err.response.data === 'string') {
        error.value = err.response.data
      } else if (err.response.data.non_field_errors) {
        error.value = err.response.data.non_field_errors[0]
      } else {
        error.value = Object.values(err.response.data).flat().join(', ')
      }
    } else {
      error.value = 'Une erreur est survenue'
    }
  }
}

function formatTime(timeString) {
  if (!timeString) return ''
  return timeString.substring(0, 5)
}
</script>

