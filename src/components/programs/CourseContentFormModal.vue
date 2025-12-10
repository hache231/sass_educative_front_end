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
            {{ content ? 'Modifier le contenu' : 'Nouveau contenu' }}
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
            
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="content_type" class="form-label">Type de contenu *</label>
                <select
                  class="form-select"
                  id="content_type"
                  v-model="form.content_type"
                  required
                >
                  <option value="lesson">Leçon</option>
                  <option value="exercise">Exercice</option>
                  <option value="video">Vidéo</option>
                  <option value="document">Document</option>
                  <option value="quiz">Quiz</option>
                </select>
              </div>
              
              <div class="col-md-6 mb-3">
                <label for="order" class="form-label">Ordre *</label>
                <input
                  type="number"
                  class="form-control"
                  id="order"
                  v-model.number="form.order"
                  min="1"
                  required
                />
              </div>
            </div>
            
            <div class="mb-3">
              <label for="content" class="form-label">Contenu *</label>
              <textarea
                class="form-control"
                id="content"
                v-model="form.content"
                rows="6"
                required
                placeholder="Contenu du cours (texte, HTML, etc.)"
              ></textarea>
            </div>
            
            <div class="mb-3">
              <label for="file" class="form-label">Fichier</label>
              <input
                type="file"
                class="form-control"
                id="file"
                @change="handleFileChange"
              />
              <small class="form-text text-muted">Fichier optionnel à joindre</small>
              <div v-if="form.file_name" class="mt-2">
                <span class="badge bg-info">{{ form.file_name }}</span>
                <button type="button" class="btn btn-sm btn-link" @click="clearFile">Supprimer</button>
              </div>
              <div v-if="content && content.file" class="mt-2">
                <span class="badge bg-secondary">Fichier actuel : {{ getFileName(content.file) }}</span>
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
                {{ content ? 'Modifier' : 'Créer' }}
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
  content: {
    type: Object,
    default: null
  },
  courseId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const programsStore = useProgramsStore()

const error = ref(null)

const form = ref({
  title: '',
  content_type: 'lesson',
  content: '',
  file: null,
  file_name: '',
  order: 1
})

onMounted(() => {
  if (props.content) {
    form.value = {
      title: props.content.title,
      content_type: props.content.content_type,
      content: props.content.content,
      order: props.content.order,
      file: null,
      file_name: ''
    }
  }
})

function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    form.value.file = file
    form.value.file_name = file.name
  }
}

function clearFile() {
  form.value.file = null
  form.value.file_name = ''
  const fileInput = document.getElementById('file')
  if (fileInput) {
    fileInput.value = ''
  }
}

function getFileName(fileUrl) {
  if (!fileUrl) return ''
  return fileUrl.split('/').pop()
}

async function handleSubmit() {
  error.value = null
  
  try {
    const courseId = props.content ? props.content.course : props.courseId
    if (!courseId) {
      error.value = 'Un cours doit être sélectionné'
      return
    }
    
    const data = new FormData()
    data.append('course', courseId)
    data.append('title', form.value.title)
    data.append('content_type', form.value.content_type)
    data.append('content', form.value.content)
    data.append('order', form.value.order)
    
    if (form.value.file) {
      data.append('file', form.value.file)
    }
    
    if (props.content) {
      await programsStore.updateCourseContent(props.content.id, data)
    } else {
      await programsStore.createCourseContent(data)
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

