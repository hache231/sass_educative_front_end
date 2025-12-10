<template>
  <div class="time-slot-manager">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h5 class="mb-0">Créneaux horaires</h5>
      <button class="btn btn-primary btn-sm" @click="showCreateModal">
        <font-awesome-icon icon="plus" class="me-2" />
        Nouveau créneau
      </button>
    </div>
    
    <div v-if="schedulesStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else-if="schedulesStore.activeTimeSlots.length === 0" class="text-center py-4 text-muted">
      <p>Aucun créneau horaire. Créez votre premier créneau pour commencer.</p>
    </div>
    
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Ordre</th>
            <th>Heure de début</th>
            <th>Heure de fin</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="timeSlot in schedulesStore.activeTimeSlots" :key="timeSlot.id">
            <td>{{ timeSlot.order }}</td>
            <td>{{ formatTime(timeSlot.start_time) }}</td>
            <td>{{ formatTime(timeSlot.end_time) }}</td>
            <td>
              <span :class="timeSlot.is_active ? 'badge bg-success' : 'badge bg-secondary'">
                {{ timeSlot.is_active ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td>
              <button
                class="btn btn-sm btn-outline-warning me-2"
                @click="editTimeSlot(timeSlot)"
                title="Modifier"
              >
                <font-awesome-icon icon="edit" />
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteTimeSlotConfirm(timeSlot)"
                title="Supprimer"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Modal pour créer/modifier un créneau horaire -->
    <div
      v-if="showModal"
      class="modal fade show"
      style="display: block; background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ selectedTimeSlot ? 'Modifier le créneau horaire' : 'Nouveau créneau horaire' }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="order" class="form-label">Ordre *</label>
                <input
                  type="number"
                  class="form-control"
                  id="order"
                  v-model.number="form.order"
                  min="1"
                  required
                />
                <small class="form-text text-muted">Ordre d'affichage du créneau</small>
              </div>
              
              <div class="mb-3">
                <label for="start_time" class="form-label">Heure de début *</label>
                <input
                  type="time"
                  class="form-control"
                  id="start_time"
                  v-model="form.start_time"
                  required
                />
              </div>
              
              <div class="mb-3">
                <label for="end_time" class="form-label">Heure de fin *</label>
                <input
                  type="time"
                  class="form-control"
                  id="end_time"
                  v-model="form.end_time"
                  required
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
                <button type="button" class="btn btn-secondary" @click="closeModal">
                  Annuler
                </button>
                <button type="submit" class="btn btn-primary" :disabled="schedulesStore.loading">
                  {{ selectedTimeSlot ? 'Modifier' : 'Créer' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSchedulesStore } from '@/stores/schedules'

const schedulesStore = useSchedulesStore()

const showModal = ref(false)
const selectedTimeSlot = ref(null)
const error = ref(null)

const form = ref({
  order: 1,
  start_time: '',
  end_time: '',
  is_active: true
})

onMounted(async () => {
  await schedulesStore.fetchTimeSlots()
})

function showCreateModal() {
  selectedTimeSlot.value = null
  form.value = {
    order: schedulesStore.activeTimeSlots.length + 1,
    start_time: '',
    end_time: '',
    is_active: true
  }
  error.value = null
  showModal.value = true
}

function editTimeSlot(timeSlot) {
  selectedTimeSlot.value = timeSlot
  form.value = {
    order: timeSlot.order,
    start_time: timeSlot.start_time.substring(0, 5), // Format HH:MM
    end_time: timeSlot.end_time.substring(0, 5),
    is_active: timeSlot.is_active
  }
  error.value = null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedTimeSlot.value = null
  error.value = null
}

async function handleSubmit() {
  error.value = null
  
  // Validation
  if (form.value.start_time >= form.value.end_time) {
    error.value = "L'heure de fin doit être après l'heure de début."
    return
  }
  
  try {
    if (selectedTimeSlot.value) {
      await schedulesStore.updateTimeSlot(selectedTimeSlot.value.id, form.value)
    } else {
      await schedulesStore.createTimeSlot(form.value)
    }
    await schedulesStore.fetchTimeSlots()
    closeModal()
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

async function deleteTimeSlotConfirm(timeSlot) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le créneau "${formatTime(timeSlot.start_time)} - ${formatTime(timeSlot.end_time)}" ?`)) {
    try {
      await schedulesStore.deleteTimeSlot(timeSlot.id)
      await schedulesStore.fetchTimeSlots()
    } catch (err) {
      alert('Erreur lors de la suppression du créneau horaire')
      console.error('Error deleting time slot:', err)
    }
  }
}

function formatTime(timeString) {
  if (!timeString) return ''
  // Format HH:MM:SS -> HH:MM
  return timeString.substring(0, 5)
}
</script>

<style scoped>
.time-slot-manager {
  padding: 0;
}
</style>

