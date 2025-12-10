<template>
  <div
    class="modal fade show"
    style="display: block; background-color: rgba(0,0,0,0.5);"
    tabindex="-1"
    @click.self="$emit('close')"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ assessment ? 'Modifier l\'évaluation' : 'Créer une nouvelle évaluation' }}
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleSubmit">
            <div class="mb-3">
              <label for="assessment-title" class="form-label">Titre *</label>
              <input
                type="text"
                class="form-control"
                id="assessment-title"
                v-model="form.title"
                required
              />
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="assessment-class" class="form-label">Classe *</label>
                <select
                  class="form-select"
                  id="assessment-class"
                  v-model="form.class_obj"
                  required
                >
                  <option value="">Sélectionner une classe</option>
                  <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                    {{ cls.name }}
                  </option>
                </select>
              </div>
              
              <div class="col-md-6 mb-3">
                <label for="assessment-subject" class="form-label">Matière *</label>
                <select
                  class="form-select"
                  id="assessment-subject"
                  v-model="form.subject"
                  required
                >
                  <option value="">Sélectionner une matière</option>
                  <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                    {{ subject.name }} ({{ subject.code }})
                  </option>
                </select>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="assessment-teacher" class="form-label">Enseignant *</label>
                <select
                  class="form-select"
                  id="assessment-teacher"
                  v-model="form.teacher"
                  required
                >
                  <option value="">Sélectionner un enseignant</option>
                  <option v-for="teacher in teachers" :key="teacher.id" :value="teacher.id">
                    {{ teacher.full_name }}
                  </option>
                </select>
              </div>
              
              <div class="col-md-6 mb-3">
                <label for="assessment-type" class="form-label">Type *</label>
                <select
                  class="form-select"
                  id="assessment-type"
                  v-model="form.assessment_type"
                  required
                >
                  <option value="">Sélectionner un type</option>
                  <option value="quiz">Quiz</option>
                  <option value="test">Contrôle</option>
                  <option value="exam">Examen</option>
                  <option value="assignment">Devoir</option>
                  <option value="project">Projet</option>
                </select>
              </div>
            </div>
            
            <div class="row">
              <div class="col-md-4 mb-3">
                <label for="assessment-max-score" class="form-label">Note maximale *</label>
                <input
                  type="number"
                  class="form-control"
                  id="assessment-max-score"
                  v-model.number="form.max_score"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              
              <div class="col-md-4 mb-3">
                <label for="assessment-date" class="form-label">Date *</label>
                <input
                  type="date"
                  class="form-control"
                  id="assessment-date"
                  v-model="form.date"
                  required
                />
              </div>
              
              <div class="col-md-4 mb-3">
                <label for="assessment-academic-year" class="form-label">Année académique *</label>
                <input
                  type="text"
                  class="form-control"
                  id="assessment-academic-year"
                  v-model="form.academic_year"
                  placeholder="Ex: 2024-2025"
                  required
                />
              </div>
            </div>
            
            <div class="mb-3">
              <label for="assessment-description" class="form-label">Description</label>
              <textarea
                class="form-control"
                id="assessment-description"
                v-model="form.description"
                rows="3"
              ></textarea>
            </div>
            
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="$emit('close')">
                Annuler
              </button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                {{ loading ? 'Enregistrement...' : (assessment ? 'Modifier' : 'Créer') }}
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
import { useAssessmentsStore } from '@/stores/assessments'
import { useStudentsStore } from '@/stores/students'
import { useProgramsStore } from '@/stores/programs'
import { useTeachersStore } from '@/stores/teachers'

const props = defineProps({
  assessment: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const assessmentsStore = useAssessmentsStore()
const studentsStore = useStudentsStore()
const programsStore = useProgramsStore()
const teachersStore = useTeachersStore()

const loading = ref(false)
const form = ref({
  title: '',
  class_obj: '',
  subject: '',
  teacher: '',
  assessment_type: '',
  max_score: 20,
  date: '',
  academic_year: '',
  description: ''
})

const classes = ref([])
const subjects = ref([])
const teachers = ref([])

onMounted(async () => {
  await Promise.all([
    loadClasses(),
    loadSubjects(),
    loadTeachers()
  ])
  
  if (props.assessment) {
    form.value = {
      title: props.assessment.title || '',
      class_obj: props.assessment.class_obj || '',
      subject: props.assessment.subject || '',
      teacher: props.assessment.teacher || '',
      assessment_type: props.assessment.assessment_type || '',
      max_score: props.assessment.max_score || 20,
      date: props.assessment.date || '',
      academic_year: props.assessment.academic_year || '',
      description: props.assessment.description || ''
    }
  }
})

async function loadClasses() {
  try {
    await studentsStore.fetchClasses()
    classes.value = studentsStore.activeClasses
  } catch (error) {
    console.error('Erreur lors du chargement des classes:', error)
  }
}

async function loadSubjects() {
  try {
    await programsStore.fetchSubjects()
    subjects.value = programsStore.subjects || []
  } catch (error) {
    console.error('Erreur lors du chargement des matières:', error)
  }
}

async function loadTeachers() {
  try {
    await teachersStore.fetchTeachers()
    teachers.value = teachersStore.teachers || []
  } catch (error) {
    console.error('Erreur lors du chargement des enseignants:', error)
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    if (props.assessment) {
      await assessmentsStore.updateAssessment(props.assessment.id, form.value)
    } else {
      await assessmentsStore.createAssessment(form.value)
    }
    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error)
  } finally {
    loading.value = false
  }
}
</script>

