<template>
  <div
    class="modal fade show"
    style="display: block; background-color: rgba(0,0,0,0.5);"
    tabindex="-1"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ holiday ? 'Modifier le jour férié' : 'Nouveau jour férié' }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="name" class="form-label">Nom *</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="form.name"
                required
              />
            </div>
            
            <div class="mb-3">
              <label for="date" class="form-label">Date *</label>
              <input
                type="date"
                class="form-control"
                id="date"
                v-model="form.date"
                required
              />
            </div>
            
            <div class="mb-3">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  id="is_recurring"
                  v-model="form.is_recurring"
                />
                <label class="form-check-label" for="is_recurring">
                  Récurrent (se répète chaque année)
                </label>
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
                {{ holiday ? 'Modifier' : 'Créer' }}
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
  holiday: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const schedulesStore = useSchedulesStore()

const error = ref(null)

const form = ref({
  name: '',
  date: '',
  is_recurring: false,
  description: ''
})

onMounted(() => {
  if (props.holiday) {
    const date = new Date(props.holiday.date)
    form.value = {
      name: props.holiday.name,
      date: date.toISOString().slice(0, 10),
      is_recurring: props.holiday.is_recurring,
      description: props.holiday.description || ''
    }
  }
})

async function handleSubmit() {
  error.value = null
  
  try {
    if (props.holiday) {
      await schedulesStore.updateHoliday(props.holiday.id, form.value)
    } else {
      await schedulesStore.createHoliday(form.value)
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

