<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Gestion des Classes</h2>
        <p class="text-sm text-slate-500">Organisez vos classes et suivez leur occupation</p>
      </div>
      <button v-if="canCreate" @click="showCreateModal" class="btn btn-primary">
        <font-awesome-icon icon="plus" />
        <span>Nouvelle classe</span>
      </button>
    </div>
    
    <!-- Filters -->
    <div class="filter-bar">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="label">Rechercher</label>
          <div class="search-input">
            <font-awesome-icon icon="search" class="search-input-icon" />
            <input
              type="text"
              placeholder="Nom, niveau..."
              v-model="searchQuery"
              @input="handleSearch"
            />
          </div>
        </div>
        <div>
          <label class="label">Niveau</label>
          <input
            type="text"
            class="input"
            placeholder="Ex: 6ème, Terminale"
            v-model="levelFilter"
            @input="handleFilterChange"
          />
        </div>
        <div>
          <label class="label">Statut</label>
          <select class="select" v-model="statusFilter" @change="handleFilterChange">
            <option value="">Tous les statuts</option>
            <option value="true">Actives</option>
            <option value="false">Inactives</option>
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
    
    <!-- Table -->
    <div class="card p-0 overflow-hidden">
      <!-- Loading -->
      <div v-if="studentsStore.loading" class="flex items-center justify-center py-20">
        <div class="spinner spinner-lg"></div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="filteredClasses.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <font-awesome-icon icon="door-open" class="text-3xl" />
        </div>
        <p class="empty-state-title">
          {{ hasFilters ? 'Aucun résultat' : 'Aucune classe' }}
        </p>
        <p class="empty-state-text">
          {{ hasFilters 
            ? 'Aucune classe ne correspond à vos critères.' 
            : 'Commencez par créer votre première classe.' 
          }}
        </p>
        <button v-if="!hasFilters && canCreate" @click="showCreateModal" class="btn btn-primary mt-4">
          <font-awesome-icon icon="plus" />
          <span>Créer une classe</span>
        </button>
      </div>
      
      <!-- Table Content -->
      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Classe</th>
              <th>Niveau</th>
              <th>Capacité</th>
              <th>Occupation</th>
              <th>Prof. principal</th>
              <th>Statut</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(classItem, index) in filteredClasses" 
              :key="classItem.id"
              class="animate-fade-in"
              :style="{ animationDelay: `${index * 0.03}s` }"
            >
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-100 to-sky-200 
                              text-sky-600 flex items-center justify-center">
                    <font-awesome-icon icon="door-open" />
                  </div>
                  <span class="font-medium text-slate-800">{{ classItem.name }}</span>
                </div>
              </td>
              <td>
                <span class="badge badge-info">{{ classItem.level }}</span>
              </td>
              <td class="text-slate-600">{{ classItem.capacity }} places</td>
              <td>
                <div class="w-28">
                  <div class="flex items-center justify-between text-xs mb-1">
                    <span :class="getStudentCountClass(classItem)" class="font-semibold">
                      {{ classItem.student_count || 0 }} élèves
                    </span>
                    <span class="text-slate-400">{{ getOccupationRate(classItem) }}%</span>
                  </div>
                  <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      class="h-full transition-all duration-500 rounded-full"
                      :class="getOccupationClass(classItem)"
                      :style="{ width: getOccupationRate(classItem) + '%' }"
                    ></div>
                  </div>
                </div>
              </td>
              <td class="text-slate-600">
                {{ classItem.class_teacher_name || '-' }}
              </td>
              <td>
                <span :class="[
                  'badge',
                  classItem.is_active ? 'badge-success' : 'badge-secondary'
                ]">
                  <span :class="[
                    'badge-dot',
                    classItem.is_active ? 'bg-emerald-500' : 'bg-slate-400'
                  ]"></span>
                  {{ classItem.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="viewClass(classItem)"
                    class="action-btn action-btn-view"
                    title="Voir détails"
                  >
                    <font-awesome-icon icon="eye" />
                  </button>
                  <button
                    v-if="canEdit"
                    @click="editClass(classItem)"
                    class="action-btn action-btn-edit"
                    title="Modifier"
                  >
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button
                    v-if="canDelete"
                    @click="deleteClassConfirm(classItem)"
                    class="action-btn action-btn-delete"
                    :class="{ 'opacity-50 cursor-not-allowed': (classItem.student_count || 0) > 0 }"
                    :disabled="(classItem.student_count || 0) > 0"
                    :title="(classItem.student_count || 0) > 0 ? 'Classe non vide' : 'Supprimer'"
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
      <div v-if="filteredClasses.length > 0" class="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
        <p class="text-sm text-slate-600">
          {{ filteredClasses.length }} classe(s) affichée(s)
        </p>
      </div>
    </div>
    
    <!-- Modals -->
    <ClassFormModal
      v-if="showFormModal"
      :class-obj="selectedClass"
      @close="closeFormModal"
      @saved="handleClassSaved"
    />
    
    <ClassDetailModal
      v-if="showDetailModal"
      :class-obj="selectedClass"
      @close="closeDetailModal"
      @edit="handleEditFromDetail"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import ClassFormModal from './ClassFormModal.vue'
import ClassDetailModal from './ClassDetailModal.vue'

const studentsStore = useStudentsStore()

const showFormModal = ref(false)
const showDetailModal = ref(false)
const selectedClass = ref(null)
const searchQuery = ref('')
const levelFilter = ref('')
const statusFilter = ref('')

const canCreate = ref(true)
const canEdit = ref(true)
const canDelete = ref(true)

const hasFilters = computed(() => searchQuery.value || levelFilter.value || statusFilter.value)

const filteredClasses = computed(() => {
  let result = studentsStore.classes
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.name?.toLowerCase().includes(query) ||
      c.level?.toLowerCase().includes(query)
    )
  }
  
  if (levelFilter.value) {
    const level = levelFilter.value.toLowerCase()
    result = result.filter(c => c.level?.toLowerCase().includes(level))
  }
  
  if (statusFilter.value !== '') {
    const isActive = statusFilter.value === 'true'
    result = result.filter(c => c.is_active === isActive)
  }
  
  return result
})

onMounted(async () => {
  await studentsStore.fetchClasses()
})

function handleSearch() {}
function handleFilterChange() {}

function clearFilters() {
  searchQuery.value = ''
  levelFilter.value = ''
  statusFilter.value = ''
}

function showCreateModal() {
  selectedClass.value = null
  showFormModal.value = true
}

function editClass(classItem) {
  selectedClass.value = classItem
  showFormModal.value = true
}

function viewClass(classItem) {
  selectedClass.value = classItem
  showDetailModal.value = true
}

function closeFormModal() {
  showFormModal.value = false
  selectedClass.value = null
}

function closeDetailModal() {
  showDetailModal.value = false
  selectedClass.value = null
}

async function handleClassSaved() {
  await studentsStore.fetchClasses()
  closeFormModal()
}

function handleEditFromDetail() {
  closeDetailModal()
  editClass(selectedClass.value)
}

async function deleteClassConfirm(classItem) {
  if ((classItem.student_count || 0) > 0) {
    alert(`Impossible de supprimer "${classItem.name}" car elle contient des élèves.`)
    return
  }
  
  if (confirm(`Supprimer la classe "${classItem.name}" ?`)) {
    try {
      await studentsStore.deleteClass(classItem.id)
      await studentsStore.fetchClasses()
    } catch (err) {
      alert('Erreur lors de la suppression')
      console.error(err)
    }
  }
}

function getOccupationRate(classItem) {
  if (!classItem.capacity) return 0
  return Math.round(((classItem.student_count || 0) / classItem.capacity) * 100)
}

function getOccupationClass(classItem) {
  const rate = getOccupationRate(classItem)
  if (rate >= 100) return 'bg-red-500'
  if (rate >= 80) return 'bg-amber-500'
  return 'bg-emerald-500'
}

function getStudentCountClass(classItem) {
  const rate = getOccupationRate(classItem)
  if (rate >= 100) return 'text-red-600'
  if (rate >= 80) return 'text-amber-600'
  return 'text-emerald-600'
}
</script>
