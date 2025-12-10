<template>
  <div
    class="modal fade show"
    style="display: block; background-color: rgba(0,0,0,0.5);"
    tabindex="-1"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Détails de l'enseignant</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>
          
          <div v-else-if="teacher">
            <!-- Onglets -->
            <ul class="nav nav-tabs mb-4" role="tablist">
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'info' }"
                  @click="activeTab = 'info'"
                  type="button"
                >
                  Informations
                </button>
              </li>
              <li class="nav-item" role="presentation">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'classes' }"
                  @click="activeTab = 'classes'"
                  type="button"
                >
                  Classes/Matières
                </button>
              </li>
            </ul>
            
            <!-- Contenu des onglets -->
            <div class="tab-content">
              <!-- Onglet Informations -->
              <div v-show="activeTab === 'info'" class="tab-pane fade show active">
                <div class="row">
                  <div class="col-md-4 text-center mb-4">
                    <img
                      v-if="teacher.avatar_url"
                      :src="teacher.avatar_url"
                      alt="Avatar"
                      class="img-thumbnail rounded-circle"
                      style="width: 150px; height: 150px; object-fit: cover;"
                    />
                    <div
                      v-else
                      class="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto"
                      style="width: 150px; height: 150px; color: white; font-size: 2rem;"
                    >
                      {{ getInitials(teacher.full_name) }}
                    </div>
                  </div>
                  
                  <div class="col-md-8">
                    <h4>{{ teacher.full_name }}</h4>
                    <p class="text-muted">{{ teacher.employee_id }}</p>
                    
                    <dl class="row">
                      <dt class="col-sm-4">Email</dt>
                      <dd class="col-sm-8">{{ teacher.user?.email || '-' }}</dd>
                      
                      <dt class="col-sm-4">Téléphone</dt>
                      <dd class="col-sm-8">{{ teacher.user?.phone || '-' }}</dd>
                      
                      <dt class="col-sm-4">Spécialisation</dt>
                      <dd class="col-sm-8">{{ teacher.specialization || '-' }}</dd>
                      
                      <dt class="col-sm-4">Date d'embauche</dt>
                      <dd class="col-sm-8">{{ formatDate(teacher.hire_date) }}</dd>
                      
                      <dt class="col-sm-4">Statut</dt>
                      <dd class="col-sm-8">
                        <span
                          :class="teacher.is_active ? 'badge bg-success' : 'badge bg-secondary'"
                        >
                          {{ teacher.is_active ? 'Actif' : 'Inactif' }}
                        </span>
                      </dd>
                      
                      <dt class="col-sm-4">École</dt>
                      <dd class="col-sm-8">{{ teacher.school_name || '-' }}</dd>
                    </dl>
                  </div>
                </div>
              </div>
              
              <!-- Onglet Classes/Matières -->
              <div v-show="activeTab === 'classes'" class="tab-pane fade show active">
                <div v-if="classesLoading" class="text-center py-3">
                  <div class="spinner-border spinner-border-sm text-primary" role="status">
                    <span class="visually-hidden">Chargement...</span>
                  </div>
                </div>
                
                <div v-else-if="teacherClasses.length === 0" class="text-center py-5 text-muted">
                  <p>Aucune affectation classe/matière.</p>
                </div>
                
                <div v-else class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Classe</th>
                        <th>Matière</th>
                        <th>Année académique</th>
                        <th>Date d'assignation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="tc in teacherClasses" :key="tc.id">
                        <td>{{ tc.class_name }}</td>
                        <td>{{ tc.subject_name }}</td>
                        <td>{{ tc.academic_year }}</td>
                        <td>{{ formatDateTime(tc.assigned_at) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-5 text-muted">
            <p>Enseignant non trouvé.</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Fermer
          </button>
          <button
            v-if="teacher"
            type="button"
            class="btn btn-primary"
            @click="$emit('edit', teacher.id)"
          >
            <font-awesome-icon icon="edit" class="me-2" />
            Modifier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useTeachersStore } from '@/stores/teachers'

const props = defineProps({
  teacherId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'edit'])

const teachersStore = useTeachersStore()

// État local
const activeTab = ref('info')
const loading = ref(false)
const classesLoading = ref(false)
const teacher = ref(null)
const teacherClasses = ref([])

// Charger les données de l'enseignant
onMounted(async () => {
  await loadTeacher()
  await loadTeacherClasses()
})

// Recharger quand l'onglet change
watch(activeTab, (newTab) => {
  if (newTab === 'classes' && teacherClasses.value.length === 0) {
    loadTeacherClasses()
  }
})

// Charger l'enseignant
const loadTeacher = async () => {
  loading.value = true
  try {
    teacher.value = await teachersStore.fetchTeacher(props.teacherId)
  } catch (err) {
    console.error('Erreur lors du chargement de l\'enseignant:', err)
  } finally {
    loading.value = false
  }
}

// Charger les classes/matières
const loadTeacherClasses = async () => {
  classesLoading.value = true
  try {
    const data = await teachersStore.fetchTeacherClasses(props.teacherId)
    teacherClasses.value = Array.isArray(data) ? data : []
  } catch (err) {
    console.error('Erreur lors du chargement des classes:', err)
    teacherClasses.value = []
  } finally {
    classesLoading.value = false
  }
}

// Utilitaires
const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR')
}
</script>

<style scoped>
.modal {
  z-index: 1050;
}
</style>

