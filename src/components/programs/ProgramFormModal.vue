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
            {{ program ? 'Modifier le programme' : 'Nouveau programme' }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="name" class="form-label">Nom du programme *</label>
              <input
                type="text"
                class="form-control"
                id="name"
                v-model="form.name"
                required
              />
            </div>
            
            <div class="row">
              <div class="col-md-4 mb-3">
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
              
              <div class="col-md-4 mb-3">
                <label for="subject" class="form-label">Matière *</label>
                <select
                  class="form-select"
                  id="subject"
                  v-model="form.subject"
                  required
                >
                  <option value="">Sélectionner une matière</option>
                  <option
                    v-for="subject in programsStore.activeSubjects"
                    :key="subject.id"
                    :value="subject.id"
                  >
                    {{ subject.name }} ({{ subject.code }})
                  </option>
                </select>
              </div>
              
              <div class="col-md-4 mb-3">
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
                {{ program ? 'Modifier' : 'Créer' }}
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
import { useStudentsStore } from '@/stores/students'

const props = defineProps({
  program: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const programsStore = useProgramsStore()
const studentsStore = useStudentsStore()

const classes = ref([])
const error = ref(null)

const form = ref({
  name: '',
  class_obj: '',
  subject: '',
  academic_year: '',
  description: ''
})

onMounted(async () => {
  await Promise.all([
    studentsStore.fetchClasses({ is_active: true }),
    programsStore.fetchSubjects()
  ])
  classes.value = studentsStore.activeClasses
  
  if (props.program) {
    form.value = {
      name: props.program.name,
      class_obj: props.program.class_obj,
      subject: props.program.subject,
      academic_year: props.program.academic_year,
      description: props.program.description || ''
    }
  }
})

async function handleSubmit() {
  error.value = null
  
  try {
    if (props.program) {
      await programsStore.updateProgram(props.program.id, form.value)
    } else {
      await programsStore.createProgram(form.value)
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

