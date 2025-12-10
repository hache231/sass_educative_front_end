<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Tabs Navigation -->
    <div class="tabs">
      <button
        @click="activeTab = 'students'"
        :class="['tab', activeTab === 'students' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="user-graduate" />
        <span>Élèves</span>
        <span v-if="studentsStore.students.length" class="badge badge-primary ml-2">
          {{ studentsStore.students.length }}
        </span>
      </button>
      <button
        @click="activeTab = 'classes'"
        :class="['tab', activeTab === 'classes' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="door-open" />
        <span>Classes</span>
        <span v-if="studentsStore.classes.length" class="badge badge-info ml-2">
          {{ studentsStore.classes.length }}
        </span>
      </button>
    </div>
    
    <!-- Students Tab -->
    <div v-show="activeTab === 'students'" class="space-y-6">
      <!-- Header Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-xl font-bold text-slate-800">Liste des élèves</h2>
          <p class="text-sm text-slate-500">Gérez les inscriptions et informations des élèves</p>
        </div>
        <button @click="createNewStudent" class="btn btn-primary">
          <font-awesome-icon icon="plus" />
          <span>Nouvel élève</span>
        </button>
      </div>
      
      <!-- Filters -->
      <div class="filter-bar">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-1">
            <label class="label">Rechercher</label>
            <div class="search-input">
              <font-awesome-icon icon="search" class="search-input-icon" />
              <input
                type="text"
                placeholder="Nom, prénom, ID..."
                v-model="searchQuery"
                @input="handleSearch"
              />
            </div>
          </div>
          <div>
            <label class="label">Classe</label>
            <select class="select" v-model="classFilter" @change="handleFilterChange">
              <option value="">Toutes les classes</option>
              <option
                v-for="classItem in studentsStore.activeClasses"
                :key="classItem.id"
                :value="classItem.id"
              >
                {{ classItem.name }} ({{ classItem.level }})
              </option>
            </select>
          </div>
          <div>
            <label class="label">Statut</label>
            <select class="select" v-model="statusFilter" @change="handleFilterChange">
              <option value="">Tous les statuts</option>
              <option value="true">Actifs</option>
              <option value="false">Inactifs</option>
            </select>
          </div>
          <div class="flex items-end">
            <button @click="clearFilters" class="btn btn-ghost w-full">
              <font-awesome-icon icon="times" />
              <span>Réinitialiser</span>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Students Table -->
      <div class="card p-0 overflow-hidden">
        <!-- Loading State -->
        <div v-if="studentsStore.loading" class="flex items-center justify-center py-20">
          <div class="spinner spinner-lg"></div>
        </div>
        
        <!-- Empty State -->
        <div v-else-if="studentsStore.filteredStudents.length === 0" class="empty-state">
          <div class="empty-state-icon">
            <font-awesome-icon icon="user-graduate" class="text-3xl" />
          </div>
          <p class="empty-state-title">
            {{ hasFilters ? 'Aucun résultat' : 'Aucun élève' }}
          </p>
          <p class="empty-state-text">
            {{ hasFilters 
              ? 'Aucun élève ne correspond à vos critères de recherche.' 
              : 'Commencez par ajouter votre premier élève.' 
            }}
          </p>
          <button v-if="!hasFilters" @click="createNewStudent" class="btn btn-primary mt-4">
            <font-awesome-icon icon="plus" />
            <span>Ajouter un élève</span>
          </button>
        </div>
        
        <!-- Table -->
        <div v-else class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Élève</th>
                <th>ID</th>
                <th>Classe(s)</th>
                <th>Date inscription</th>
                <th>Statut</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(student, index) in studentsStore.filteredStudents" 
                :key="student.id"
                class="animate-fade-in"
                :style="{ animationDelay: `${index * 0.03}s` }"
              >
                <td>
                  <div class="flex items-center gap-3">
                    <div class="avatar avatar-lg">
                      <img
                        v-if="student.photo_thumbnail"
                        :src="student.photo_thumbnail"
                        :alt="student.full_name"
                      />
                      <div v-else class="avatar-placeholder">
                        {{ getInitials(student.full_name) }}
                      </div>
                    </div>
                    <div>
                      <p class="font-medium text-slate-800">{{ student.full_name }}</p>
                      <p v-if="student.email" class="text-xs text-slate-500">{{ student.email }}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge badge-secondary font-mono">
                    {{ student.student_id }}
                  </span>
                </td>
                <td>
                  <div v-if="student.current_classes?.length" class="flex flex-wrap gap-1">
                    <span
                      v-for="cls in student.current_classes"
                      :key="cls.id"
                      class="badge badge-primary"
                    >
                      {{ cls.name }}
                    </span>
                  </div>
                  <span v-else class="text-slate-400 text-sm">Non assigné</span>
                </td>
                <td class="text-slate-600">
                  {{ formatDate(student.enrollment_date) }}
                </td>
                <td>
                  <span :class="[
                    'badge',
                    student.is_active ? 'badge-success' : 'badge-danger'
                  ]">
                    <span :class="[
                      'badge-dot',
                      student.is_active ? 'bg-emerald-500' : 'bg-red-500'
                    ]"></span>
                    {{ student.is_active ? 'Actif' : 'Inactif' }}
                  </span>
                </td>
                <td>
                  <div class="flex items-center justify-end gap-2">
                    <button
                      @click="viewStudent(student)"
                      class="action-btn action-btn-view"
                      title="Voir le détail"
                    >
                      <font-awesome-icon icon="eye" />
                    </button>
                    <button
                      @click="editStudent(student)"
                      class="action-btn action-btn-edit"
                      title="Modifier"
                    >
                      <font-awesome-icon icon="edit" />
                    </button>
                    <button
                      @click="deleteStudentConfirm(student)"
                      class="action-btn action-btn-delete"
                      title="Supprimer"
                    >
                      <font-awesome-icon icon="trash" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination placeholder -->
        <div v-if="studentsStore.filteredStudents.length > 0" class="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
          <div class="flex items-center justify-between">
            <p class="text-sm text-slate-600">
              Affichage de <span class="font-medium">{{ studentsStore.filteredStudents.length }}</span> élève(s)
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Classes Tab -->
    <div v-show="activeTab === 'classes'" class="animate-fade-in">
      <ClassManager />
    </div>
    
    <!-- Modals -->
    <StudentFormModal
      v-if="showStudentModal"
      :student="selectedStudent"
      @close="closeStudentModal"
      @saved="handleStudentSaved"
    />
    
    <StudentDetailModal
      v-if="showDetailModal"
      :student="selectedStudent"
      @close="closeDetailModal"
      @edit="handleEditFromDetail"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import StudentFormModal from '@/components/students/StudentFormModal.vue'
import StudentDetailModal from '@/components/students/StudentDetailModal.vue'
import ClassManager from '@/components/students/ClassManager.vue'

const studentsStore = useStudentsStore()

const activeTab = ref('students')
const showStudentModal = ref(false)
const showDetailModal = ref(false)
const selectedStudent = ref(null)
const searchQuery = ref('')
const classFilter = ref('')
const statusFilter = ref('')

const hasFilters = computed(() => {
  return searchQuery.value || classFilter.value || statusFilter.value
})

onMounted(async () => {
  await Promise.all([
    studentsStore.fetchStudents(),
    studentsStore.fetchClasses()
  ])
})

let searchTimeout = null
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    studentsStore.setFilters({ search: searchQuery.value })
    studentsStore.fetchStudents()
  }, 400)
}

function handleFilterChange() {
  studentsStore.setFilters({
    class_id: classFilter.value || null,
    is_active: statusFilter.value === '' ? null : statusFilter.value === 'true'
  })
  studentsStore.fetchStudents()
}

function clearFilters() {
  searchQuery.value = ''
  classFilter.value = ''
  statusFilter.value = ''
  studentsStore.clearFilters()
  studentsStore.fetchStudents()
}

function createNewStudent() {
  selectedStudent.value = null
  showStudentModal.value = true
}

function editStudent(student) {
  selectedStudent.value = student
  showStudentModal.value = true
}

function viewStudent(student) {
  selectedStudent.value = student
  showDetailModal.value = true
}

async function deleteStudentConfirm(student) {
  if (confirm(`Êtes-vous sûr de vouloir supprimer l'élève "${student.full_name}" ?`)) {
    try {
      await studentsStore.deleteStudent(student.id)
      await studentsStore.fetchStudents()
    } catch (error) {
      alert('Erreur lors de la suppression de l\'élève')
      console.error('Error deleting student:', error)
    }
  }
}

function closeStudentModal() {
  showStudentModal.value = false
  selectedStudent.value = null
}

function closeDetailModal() {
  showDetailModal.value = false
  selectedStudent.value = null
}

async function handleStudentSaved() {
  await studentsStore.fetchStudents()
  closeStudentModal()
}

function handleEditFromDetail() {
  closeDetailModal()
  editStudent(selectedStudent.value)
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}
</script>
