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
            {{ course ? 'Modifier le cours' : 'Nouveau cours' }}
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
              <label for="program" class="form-label">Programme *</label>
              <select
                class="form-select"
                id="program"
                v-model="form.program"
                required
                :disabled="!!programId"
              >
                <option value="">Sélectionner un programme</option>
                <option
                  v-for="program in programsStore.programs"
                  :key="program.id"
                  :value="program.id"
                >
                  {{ program.name }} - {{ program.class_name }} - {{ program.subject_name }}
                </option>
              </select>
            </div>
            
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
              <small class="form-text text-muted">Ordre d'affichage dans le programme</small>
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
              <button type="submit" class="btn btn-primary" :disabled="programsStore.loading">
                {{ course ? 'Modifier' : 'Créer' }}
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
  course: {
    type: Object,
    default: null
  },
  programId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const programsStore = useProgramsStore()

const error = ref(null)

const form = ref({
  title: '',
  program: '',
  order: 1,
  description: ''
})

onMounted(async () => {
  await programsStore.fetchPrograms()
  
  if (props.course) {
    form.value = {
      title: props.course.title,
      program: props.course.program,
      order: props.course.order,
      description: props.course.description || ''
    }
  } else if (props.programId) {
    form.value.program = props.programId
  }
})

async function handleSubmit() {
  error.value = null
  
  try {
    if (props.course) {
      await programsStore.updateCourse(props.course.id, form.value)
    } else {
      await programsStore.createCourse(form.value)
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

