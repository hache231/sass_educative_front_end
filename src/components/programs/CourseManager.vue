<template>
  <div class="course-manager">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h5 class="mb-0">Cours</h5>
        <small v-if="program" class="text-muted">
          Programme : {{ program.name }} - {{ program.class_name }} - {{ program.subject_name }}
        </small>
      </div>
      <button class="btn btn-primary btn-sm" @click="showCreateModal">
        <font-awesome-icon icon="plus" class="me-2" />
        Nouveau cours
      </button>
    </div>
    
    <div v-if="programsStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else-if="courses.length === 0" class="text-center py-4 text-muted">
      <p>Aucun cours. Créez votre premier cours pour commencer.</p>
    </div>
    
    <div v-else class="table-responsive">
      <table class="table table-hover">
        <thead>
          <tr>
            <th style="width: 80px;">Ordre</th>
            <th>Titre</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="course in courses" :key="course.id">
            <td>
              <span class="badge bg-secondary">{{ course.order }}</span>
            </td>
            <td>{{ course.title }}</td>
            <td>{{ course.description || '-' }}</td>
            <td>
              <button
                class="btn btn-sm btn-outline-info me-2"
                @click="$emit('view-contents', course)"
                title="Voir le contenu"
              >
                <font-awesome-icon icon="file-alt" />
              </button>
              <button
                class="btn btn-sm btn-outline-warning me-2"
                @click="editCourse(course)"
                title="Modifier"
              >
                <font-awesome-icon icon="edit" />
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteCourseConfirm(course)"
                title="Supprimer"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <CourseFormModal
      v-if="showModal"
      :course="selectedCourse"
      :program-id="program?.id"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProgramsStore } from '@/stores/programs'
import CourseFormModal from './CourseFormModal.vue'

const props = defineProps({
  program: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['view-contents'])

const programsStore = useProgramsStore()

const showModal = ref(false)
const selectedCourse = ref(null)

const courses = computed(() => {
  if (!props.program) return []
  return programsStore.courses.filter(c => c.program === props.program.id)
    .sort((a, b) => a.order - b.order)
})

watch(() => props.program, async (newProgram) => {
  if (newProgram) {
    await programsStore.fetchCoursesByProgram(newProgram.id)
  }
}, { immediate: true })

function showCreateModal() {
  selectedCourse.value = null
  showModal.value = true
}

function editCourse(course) {
  selectedCourse.value = course
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedCourse.value = null
}

async function handleSaved() {
  if (props.program) {
    await programsStore.fetchCoursesByProgram(props.program.id)
  }
  closeModal()
}

async function deleteCourseConfirm(course) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le cours "${course.title}" ?`)) {
    try {
      await programsStore.deleteCourse(course.id)
      if (props.program) {
        await programsStore.fetchCoursesByProgram(props.program.id)
      }
    } catch (err) {
      alert('Erreur lors de la suppression du cours')
      console.error('Error deleting course:', err)
    }
  }
}
</script>

<style scoped>
.course-manager {
  padding: 0;
}
</style>

