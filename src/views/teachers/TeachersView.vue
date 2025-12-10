<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Liste des enseignants</h2>
        <p class="text-sm text-slate-500">Gérez le personnel enseignant de votre établissement</p>
      </div>
      <button @click="createNewTeacher" class="btn btn-primary">
        <font-awesome-icon icon="plus" />
        <span>Nouvel enseignant</span>
      </button>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="card flex items-center gap-4">
        <div class="stat-icon stat-icon-teal">
          <font-awesome-icon icon="chalkboard-teacher" class="text-lg" />
        </div>
        <div>
          <p class="stat-value text-2xl">{{ teachersStore.teachers.length }}</p>
          <p class="stat-label">Total enseignants</p>
        </div>
      </div>
      <div class="card flex items-center gap-4">
        <div class="stat-icon stat-icon-amber">
          <font-awesome-icon icon="check-circle" class="text-lg" />
        </div>
        <div>
          <p class="stat-value text-2xl">{{ activeTeachersCount }}</p>
          <p class="stat-label">Actifs</p>
        </div>
      </div>
      <div class="card flex items-center gap-4">
        <div class="stat-icon stat-icon-purple">
          <font-awesome-icon icon="book-reader" class="text-lg" />
        </div>
        <div>
          <p class="stat-value text-2xl">{{ totalClassesCount }}</p>
          <p class="stat-label">Classes assignées</p>
        </div>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="filter-bar">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <label class="label">Rechercher</label>
          <div class="search-input">
            <font-awesome-icon icon="search" class="search-input-icon" />
            <input
              type="text"
              placeholder="Nom, prénom, ID, spécialisation..."
              v-model="searchQuery"
              @input="handleSearch"
            />
          </div>
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
    
    <!-- Teachers Table -->
    <div class="card p-0 overflow-hidden">
      <!-- Loading State -->
      <div v-if="teachersStore.loading" class="flex items-center justify-center py-20">
        <div class="spinner spinner-lg"></div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="teachersStore.filteredTeachers.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <font-awesome-icon icon="chalkboard-teacher" class="text-3xl" />
        </div>
        <p class="empty-state-title">
          {{ hasFilters ? 'Aucun résultat' : 'Aucun enseignant' }}
        </p>
        <p class="empty-state-text">
          {{ hasFilters 
            ? 'Aucun enseignant ne correspond à vos critères de recherche.' 
            : 'Commencez par ajouter votre premier enseignant.' 
          }}
        </p>
        <button v-if="!hasFilters" @click="createNewTeacher" class="btn btn-primary mt-4">
          <font-awesome-icon icon="plus" />
          <span>Ajouter un enseignant</span>
        </button>
      </div>
      
      <!-- Table -->
      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Enseignant</th>
              <th>ID Employé</th>
              <th>Spécialisation</th>
              <th>Classes</th>
              <th>Date embauche</th>
              <th>Statut</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(teacher, index) in teachersStore.filteredTeachers" 
              :key="teacher.id"
              class="animate-fade-in"
              :style="{ animationDelay: `${index * 0.03}s` }"
            >
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar avatar-lg">
                    <img
                      v-if="teacher.avatar_url"
                      :src="teacher.avatar_url"
                      :alt="teacher.full_name"
                    />
                    <div v-else class="avatar-placeholder bg-gradient-to-br from-amber-400 to-amber-600">
                      {{ getInitials(teacher.full_name) }}
                    </div>
                  </div>
                  <div>
                    <p class="font-medium text-slate-800">{{ teacher.full_name }}</p>
                    <p class="text-xs text-slate-500">{{ teacher.user_email }}</p>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge badge-secondary font-mono">
                  {{ teacher.employee_id }}
                </span>
              </td>
              <td>
                <span v-if="teacher.specialization" class="text-slate-700">
                  {{ teacher.specialization }}
                </span>
                <span v-else class="text-slate-400 text-sm">Non spécifié</span>
              </td>
              <td>
                <span class="badge badge-info">
                  <font-awesome-icon icon="door-open" class="text-xs" />
                  {{ teacher.classes_count || 0 }} classe(s)
                </span>
              </td>
              <td class="text-slate-600">
                {{ formatDate(teacher.hire_date) }}
              </td>
              <td>
                <span :class="[
                  'badge',
                  teacher.is_active ? 'badge-success' : 'badge-danger'
                ]">
                  <span :class="[
                    'badge-dot',
                    teacher.is_active ? 'bg-emerald-500' : 'bg-red-500'
                  ]"></span>
                  {{ teacher.is_active ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td>
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="viewTeacher(teacher.id)"
                    class="action-btn action-btn-view"
                    title="Voir le détail"
                  >
                    <font-awesome-icon icon="eye" />
                  </button>
                  <button
                    @click="editTeacher(teacher.id)"
                    class="action-btn action-btn-edit"
                    title="Modifier"
                  >
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button
                    @click="deleteTeacher(teacher.id)"
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
      
      <!-- Footer -->
      <div v-if="teachersStore.filteredTeachers.length > 0" class="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
        <div class="flex items-center justify-between">
          <p class="text-sm text-slate-600">
            Affichage de <span class="font-medium">{{ teachersStore.filteredTeachers.length }}</span> enseignant(s)
          </p>
        </div>
      </div>
    </div>
    
    <!-- Modals -->
    <TeacherFormModal
      v-if="showFormModal"
      :teacher-id="selectedTeacherId"
      @close="closeFormModal"
      @saved="handleTeacherSaved"
    />
    
    <TeacherDetailModal
      v-if="showDetailModal"
      :teacher-id="selectedTeacherId"
      @close="closeDetailModal"
      @edit="editTeacherFromDetail"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTeachersStore } from '@/stores/teachers'
import TeacherFormModal from '@/components/teachers/TeacherFormModal.vue'
import TeacherDetailModal from '@/components/teachers/TeacherDetailModal.vue'

const teachersStore = useTeachersStore()

const searchQuery = ref('')
const statusFilter = ref('')
const showFormModal = ref(false)
const showDetailModal = ref(false)
const selectedTeacherId = ref(null)

const hasFilters = computed(() => {
  return searchQuery.value || statusFilter.value
})

const activeTeachersCount = computed(() => {
  return teachersStore.teachers.filter(t => t.is_active).length
})

const totalClassesCount = computed(() => {
  return teachersStore.teachers.reduce((sum, t) => sum + (t.classes_count || 0), 0)
})

onMounted(async () => {
  await teachersStore.fetchTeachers()
})

let searchTimeout = null
function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    teachersStore.setFilters({ search: searchQuery.value })
    teachersStore.fetchTeachers()
  }, 400)
}

function handleFilterChange() {
  const filters = {}
  if (statusFilter.value) {
    filters.is_active = statusFilter.value === 'true'
  }
  teachersStore.setFilters(filters)
  teachersStore.fetchTeachers()
}

function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  teachersStore.clearFilters()
  teachersStore.fetchTeachers()
}

function createNewTeacher() {
  selectedTeacherId.value = null
  showFormModal.value = true
}

function viewTeacher(id) {
  selectedTeacherId.value = id
  showDetailModal.value = true
}

function editTeacher(id) {
  selectedTeacherId.value = id
  showFormModal.value = true
}

function editTeacherFromDetail(id) {
  closeDetailModal()
  editTeacher(id)
}

async function deleteTeacher(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
    try {
      await teachersStore.deleteTeacher(id)
      await teachersStore.fetchTeachers()
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      alert('Erreur lors de la suppression de l\'enseignant')
    }
  }
}

function closeFormModal() {
  showFormModal.value = false
  selectedTeacherId.value = null
}

function closeDetailModal() {
  showDetailModal.value = false
  selectedTeacherId.value = null
}

function handleTeacherSaved() {
  closeFormModal()
  teachersStore.fetchTeachers()
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
