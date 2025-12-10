<template>
  <div
    class="modal fade show"
    style="display: block; background-color: rgba(0,0,0,0.5);"
    tabindex="-1"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Détails de la classe : {{ classObj.name }}</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>
          
          <div v-else>
            <!-- Informations générales -->
            <div class="row mb-4">
              <div class="col-md-6">
                <h6>Informations générales</h6>
                <table class="table table-sm">
                  <tbody>
                    <tr>
                      <td><strong>Nom :</strong></td>
                      <td>{{ classObj.name }}</td>
                    </tr>
                    <tr>
                      <td><strong>Niveau :</strong></td>
                      <td><span class="badge bg-info">{{ classObj.level }}</span></td>
                    </tr>
                    <tr>
                      <td><strong>Capacité :</strong></td>
                      <td>{{ classObj.capacity }} élèves</td>
                    </tr>
                    <tr>
                      <td><strong>Élèves actuels :</strong></td>
                      <td>
                        <span :class="getStudentCountClass()">
                          {{ classObj.student_count || 0 }}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Taux d'occupation :</strong></td>
                      <td>
                        <div class="progress" style="height: 25px;">
                          <div
                            class="progress-bar"
                            :class="getOccupationClass()"
                            :style="{ width: getOccupationRate() + '%' }"
                          >
                            {{ getOccupationRate() }}%
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Places disponibles :</strong></td>
                      <td>{{ availableSpots }}</td>
                    </tr>
                    <tr>
                      <td><strong>Professeur principal :</strong></td>
                      <td>{{ classObj.class_teacher_name || 'Aucun' }}</td>
                    </tr>
                    <tr>
                      <td><strong>Statut :</strong></td>
                      <td>
                        <span :class="classObj.is_active ? 'badge bg-success' : 'badge bg-secondary'">
                          {{ classObj.is_active ? 'Actif' : 'Inactif' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="col-md-6">
                <h6>Statistiques</h6>
                <div v-if="statistics" class="card">
                  <div class="card-body">
                    <div class="mb-3">
                      <strong>Répartition par genre :</strong>
                      <div class="mt-2">
                        <div class="d-flex justify-content-between mb-1">
                          <span>Masculin</span>
                          <span>{{ statistics.gender_distribution?.male || 0 }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-1">
                          <span>Féminin</span>
                          <span>{{ statistics.gender_distribution?.female || 0 }}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <strong>Total élèves actifs :</strong> {{ statistics.total_students || 0 }}
                    </div>
                  </div>
                </div>
                <div v-else class="text-muted">
                  <small>Chargement des statistiques...</small>
                </div>
              </div>
            </div>
            
            <!-- Liste des élèves -->
            <div class="mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6>Élèves de la classe</h6>
                <div>
                  <label class="form-label me-2">Année scolaire :</label>
                  <select class="form-select form-select-sm d-inline-block" style="width: auto;" v-model="selectedAcademicYear" @change="loadStudents">
                    <option value="">Toutes</option>
                    <option v-for="year in academicYears" :key="year" :value="year">{{ year }}</option>
                  </select>
                </div>
              </div>
              
              <div v-if="studentsLoading" class="text-center py-3">
                <div class="spinner-border spinner-border-sm text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
              </div>
              
              <div v-else-if="students.length === 0" class="text-center py-3 text-muted">
                <p>Aucun élève dans cette classe.</p>
              </div>
              
              <div v-else class="table-responsive">
                <table class="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>Photo</th>
                      <th>Nom complet</th>
                      <th>ID</th>
                      <th>Âge</th>
                      <th>Année scolaire</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="student in students" :key="student.id">
                      <td>
                        <img
                          v-if="student.photo_thumbnail"
                          :src="student.photo_thumbnail"
                          alt="Photo"
                          class="rounded-circle"
                          style="width: 35px; height: 35px; object-fit: cover;"
                        />
                        <div
                          v-else
                          class="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                          style="width: 35px; height: 35px; color: white; font-size: 0.7rem;"
                        >
                          {{ getInitials(student.full_name) }}
                        </div>
                      </td>
                      <td>{{ student.full_name }}</td>
                      <td><span class="badge bg-info">{{ student.student_id }}</span></td>
                      <td>{{ student.age ? student.age + ' ans' : '-' }}</td>
                      <td>{{ selectedAcademicYear || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Fermer
          </button>
          <button
            v-if="canEdit"
            type="button"
            class="btn btn-primary"
            @click="$emit('edit')"
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
import { ref, computed, onMounted, watch } from 'vue'
import { useStudentsStore } from '@/stores/students'
import * as studentsApi from '@/api/students'

const props = defineProps({
  classObj: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'edit'])

const studentsStore = useStudentsStore()

const loading = ref(false)
const studentsLoading = ref(false)
const statistics = ref(null)
const students = ref([])
const academicYears = ref([])
const selectedAcademicYear = ref('')

// Les permissions sont gérées côté backend via SchoolPermission
const canEdit = ref(true)

const availableSpots = computed(() => {
  const capacity = props.classObj.capacity || 0
  const count = props.classObj.student_count || 0
  return Math.max(0, capacity - count)
})

onMounted(async () => {
  await Promise.all([
    loadStatistics(),
    loadStudents()
  ])
})

watch(() => props.classObj, async () => {
  if (props.classObj) {
    await Promise.all([
      loadStatistics(),
      loadStudents()
    ])
  }
})

async function loadStatistics() {
  loading.value = true
  try {
    const response = await studentsApi.getClassStatistics(props.classObj.id, selectedAcademicYear.value || null)
    statistics.value = response.data
  } catch (err) {
    console.error('Error loading statistics:', err)
  } finally {
    loading.value = false
  }
}

async function loadStudents() {
  studentsLoading.value = true
  try {
    const response = await studentsApi.getClassStudents(props.classObj.id, selectedAcademicYear.value || null)
    students.value = response.data || []
    
    // Utiliser l'année sélectionnée pour l'affichage
    students.value = students.value.map(student => ({
      ...student,
      academic_year: selectedAcademicYear.value || (student.current_classes?.[0]?.academic_year) || ''
    }))
    
    // Extraire les années académiques depuis les classes des élèves
    const years = new Set()
    if (selectedAcademicYear.value) {
      years.add(selectedAcademicYear.value)
    }
    // Pour l'instant, on ne peut pas extraire toutes les années sans appels supplémentaires
    // On pourrait faire plusieurs appels ou modifier l'API
    academicYears.value = Array.from(years).sort().reverse()
  } catch (err) {
    console.error('Error loading students:', err)
    students.value = []
  } finally {
    studentsLoading.value = false
  }
}

function getOccupationRate() {
  if (!props.classObj.capacity || props.classObj.capacity === 0) return 0
  const count = props.classObj.student_count || 0
  return Math.round((count / props.classObj.capacity) * 100)
}

function getOccupationClass() {
  const rate = getOccupationRate()
  if (rate >= 100) return 'bg-danger'
  if (rate >= 80) return 'bg-warning'
  return 'bg-success'
}

function getStudentCountClass() {
  const count = props.classObj.student_count || 0
  const capacity = props.classObj.capacity || 0
  if (count >= capacity) return 'text-danger fw-bold'
  if (count >= capacity * 0.8) return 'text-warning fw-bold'
  return 'text-success'
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}
</script>

