<template>
  <div class="course-content-manager">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h5 class="mb-0">Contenu du cours</h5>
        <small v-if="course" class="text-muted">
          Cours : {{ course.title }}
        </small>
      </div>
      <button class="btn btn-primary btn-sm" @click="showCreateModal">
        <font-awesome-icon icon="plus" class="me-2" />
        Nouveau contenu
      </button>
    </div>
    
    <div v-if="programsStore.loading" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Chargement...</span>
      </div>
    </div>
    
    <div v-else-if="contents.length === 0" class="text-center py-4 text-muted">
      <p>Aucun contenu. Créez votre premier contenu pour commencer.</p>
    </div>
    
    <div v-else>
      <div v-for="content in contents" :key="content.id" class="card mb-3">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <div class="flex-grow-1">
              <div class="d-flex align-items-center mb-2">
                <span class="badge bg-secondary me-2">{{ content.order }}</span>
                <span class="badge" :class="getTypeBadgeClass(content.content_type)">
                  {{ getTypeLabel(content.content_type) }}
                </span>
                <h6 class="mb-0 ms-2">{{ content.title }}</h6>
              </div>
              <p class="text-muted mb-2">{{ truncateContent(content.content) }}</p>
              <div v-if="content.file" class="mb-2">
                <font-awesome-icon icon="paperclip" class="me-1" />
                <a :href="content.file" target="_blank" class="text-decoration-none">
                  {{ getFileName(content.file) }}
                </a>
              </div>
            </div>
            <div>
              <button
                class="btn btn-sm btn-outline-warning me-2"
                @click="editContent(content)"
                title="Modifier"
              >
                <font-awesome-icon icon="edit" />
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="deleteContentConfirm(content)"
                title="Supprimer"
              >
                <font-awesome-icon icon="trash" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <CourseContentFormModal
      v-if="showModal"
      :content="selectedContent"
      :course-id="course?.id"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useProgramsStore } from '@/stores/programs'
import CourseContentFormModal from './CourseContentFormModal.vue'

const props = defineProps({
  course: {
    type: Object,
    default: null
  }
})

const programsStore = useProgramsStore()

const showModal = ref(false)
const selectedContent = ref(null)

const contents = computed(() => {
  if (!props.course) return []
  return programsStore.courseContents.filter(cc => cc.course === props.course.id)
    .sort((a, b) => a.order - b.order)
})

watch(() => props.course, async (newCourse) => {
  if (newCourse) {
    await programsStore.fetchCourseContentsByCourse(newCourse.id)
  }
}, { immediate: true })

function showCreateModal() {
  selectedContent.value = null
  showModal.value = true
}

function editContent(content) {
  selectedContent.value = content
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedContent.value = null
}

async function handleSaved() {
  if (props.course) {
    await programsStore.fetchCourseContentsByCourse(props.course.id)
  }
  closeModal()
}

async function deleteContentConfirm(content) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer le contenu "${content.title}" ?`)) {
    try {
      await programsStore.deleteCourseContent(content.id)
      if (props.course) {
        await programsStore.fetchCourseContentsByCourse(props.course.id)
      }
    } catch (err) {
      alert('Erreur lors de la suppression du contenu')
      console.error('Error deleting content:', err)
    }
  }
}

function getTypeLabel(type) {
  const labels = {
    lesson: 'Leçon',
    exercise: 'Exercice',
    video: 'Vidéo',
    document: 'Document',
    quiz: 'Quiz'
  }
  return labels[type] || type
}

function getTypeBadgeClass(type) {
  const classes = {
    lesson: 'bg-primary',
    exercise: 'bg-success',
    video: 'bg-danger',
    document: 'bg-info',
    quiz: 'bg-warning'
  }
  return classes[type] || 'bg-secondary'
}

function truncateContent(content) {
  if (!content) return ''
  return content.length > 150 ? content.substring(0, 150) + '...' : content
}

function getFileName(fileUrl) {
  if (!fileUrl) return ''
  return fileUrl.split('/').pop()
}
</script>

<style scoped>
.course-content-manager {
  padding: 0;
}
</style>

