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
            {{ event ? 'Modifier l\'événement' : 'Nouvel événement' }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="title" class="form-label">Titre *</label>
              <input
                type="text"
                class="form-control"
                id="title"
                v-model="form.title"
                required
              />
            </div>
            
            <div class="mb-3">
              <label for="event_type" class="form-label">Type d'événement *</label>
              <select
                class="form-select"
                id="event_type"
                v-model="form.event_type"
                required
              >
                <option value="event">Événement</option>
                <option value="holiday">Jour férié</option>
                <option value="meeting">Réunion</option>
                <option value="exam">Examen</option>
                <option value="other">Autre</option>
              </select>
            </div>
            
            <div class="mb-3">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="is_all_day"
                  v-model="form.is_all_day"
                  @change="handleAllDayChange"
                />
                <label class="form-check-label" for="is_all_day">
                  Toute la journée
                </label>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="start_date" class="form-label">Date de début *</label>
                <input
                  v-if="form.is_all_day"
                  type="date"
                  class="form-control"
                  id="start_date"
                  v-model="form.start_date_date"
                  required
                />
                <input
                  v-else
                  type="datetime-local"
                  class="form-control"
                  id="start_date"
                  v-model="form.start_date"
                  required
                />
              </div>
              
              <div class="col-md-6 mb-3">
                <label for="end_date" class="form-label">Date de fin *</label>
                <input
                  v-if="form.is_all_day"
                  type="date"
                  class="form-control"
                  id="end_date"
                  v-model="form.end_date_date"
                  required
                />
                <input
                  v-else
                  type="datetime-local"
                  class="form-control"
                  id="end_date"
                  v-model="form.end_date"
                  required
                />
              </div>
            </div>
            
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea
                class="form-control"
                id="description"
                v-model="form.description"
                rows="3"
              ></textarea>
            </div>
            
            <div v-if="error" class="alert alert-danger">
              {{ error }}
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="$emit('close')">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary" :disabled="schedulesStore.loading">
                {{ event ? 'Modifier' : 'Créer' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSchedulesStore } from '@/stores/schedules'

const props = defineProps({
  event: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const schedulesStore = useSchedulesStore()

const error = ref(null)

const form = ref({
  title: '',
  event_type: 'event',
  start_date: '',
  start_date_date: '',
  end_date: '',
  end_date_date: '',
  is_all_day: false,
  description: ''
})

onMounted(() => {
  if (props.event) {
    const startDate = new Date(props.event.start_date)
    const endDate = new Date(props.event.end_date)
    
    form.value = {
      title: props.event.title,
      event_type: props.event.event_type,
      is_all_day: props.event.is_all_day,
      description: props.event.description || '',
      start_date: props.event.is_all_day ? '' : formatDateTimeLocal(startDate),
      start_date_date: props.event.is_all_day ? formatDateLocal(startDate) : '',
      end_date: props.event.is_all_day ? '' : formatDateTimeLocal(endDate),
      end_date_date: props.event.is_all_day ? formatDateLocal(endDate) : ''
    }
  }
})

function formatDateTimeLocal(date) {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

function formatDateLocal(date) {
  const d = new Date(date)
  return d.toISOString().slice(0, 10)
}

function handleAllDayChange() {
  if (form.value.is_all_day) {
    form.value.start_date = ''
    form.value.end_date = ''
  } else {
    form.value.start_date_date = ''
    form.value.end_date_date = ''
  }
}

async function handleSubmit() {
  error.value = null
  
  try {
    let startDate, endDate
    
    if (form.value.is_all_day) {
      startDate = new Date(form.value.start_date_date + 'T00:00:00')
      endDate = new Date(form.value.end_date_date + 'T23:59:59')
    } else {
      startDate = new Date(form.value.start_date)
      endDate = new Date(form.value.end_date)
    }
    
    const data = {
      title: form.value.title,
      event_type: form.value.event_type,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      is_all_day: form.value.is_all_day,
      description: form.value.description
    }
    
    if (props.event) {
      await schedulesStore.updateCalendarEvent(props.event.id, data)
    } else {
      await schedulesStore.createCalendarEvent(data)
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
</script>

