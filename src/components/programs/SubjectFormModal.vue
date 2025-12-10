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
            {{ subject ? 'Modifier la matière' : 'Nouvelle matière' }}
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
              <label for="code" class="form-label">Code *</label>
              <input
                type="text"
                class="form-control"
                id="code"
                v-model="form.code"
                required
                placeholder="Ex: MATH, FR"
              />
              <small class="form-text text-muted">Code unique de la matière</small>
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
              <button type="submit" class="btn btn-primary" :disabled="programsStore.loading">
                {{ subject ? 'Modifier' : 'Créer' }}
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
import { useProgramsStore } from '@/stores/programs'

const props = defineProps({
  subject: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const programsStore = useProgramsStore()

const error = ref(null)

const form = ref({
  name: '',
  code: '',
  description: '',
  is_active: true
})

onMounted(() => {
  if (props.subject) {
    form.value = {
      name: props.subject.name,
      code: props.subject.code,
      description: props.subject.description || '',
      is_active: props.subject.is_active !== false
    }
  }
})

async function handleSubmit() {
  error.value = null
  
  try {
    if (props.subject) {
      await programsStore.updateSubject(props.subject.id, form.value)
    } else {
      await programsStore.createSubject(form.value)
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

