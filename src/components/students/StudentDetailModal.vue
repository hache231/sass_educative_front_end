<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content max-w-3xl animate-modal-in">
      <!-- Header -->
      <div class="modal-header">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-teal-500 text-white flex items-center justify-center">
            <font-awesome-icon icon="user-graduate" />
          </div>
          <h3>Détails de l'élève</h3>
        </div>
        <button @click="$emit('close')" class="btn-icon-sm btn-ghost text-slate-400 hover:text-slate-600">
          <font-awesome-icon icon="times" />
        </button>
      </div>
      
      <!-- Body -->
      <div class="modal-body">
        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="spinner spinner-lg"></div>
        </div>
        
        <template v-else-if="studentData">
          <!-- Student Header Card -->
          <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-2xl 
                      bg-gradient-to-br from-slate-50 to-slate-100 mb-6">
            <div class="relative">
              <div class="avatar w-24 h-24 text-2xl ring-4 ring-white shadow-lg">
                <img
                  v-if="studentData.photo_url"
                  :src="studentData.photo_url"
                  :alt="studentData.full_name"
                />
                <div v-else class="avatar-placeholder">
                  {{ getInitials(studentData.full_name) }}
                </div>
              </div>
              <span 
                :class="[
                  'absolute bottom-1 right-1 w-5 h-5 rounded-full border-2 border-white',
                  studentData.is_active ? 'bg-emerald-500' : 'bg-red-500'
                ]"
              ></span>
            </div>
            
            <div class="flex-1 text-center sm:text-left">
              <h2 class="text-2xl font-bold text-slate-800 mb-2">{{ studentData.full_name }}</h2>
              <div class="flex flex-wrap justify-center sm:justify-start gap-2">
                <span class="badge badge-primary font-mono">
                  <font-awesome-icon icon="id-badge" class="text-xs" />
                  {{ studentData.student_id }}
                </span>
                <span :class="['badge', studentData.is_active ? 'badge-success' : 'badge-danger']">
                  {{ studentData.is_active ? 'Actif' : 'Inactif' }}
                </span>
                <span v-if="studentData.age" class="badge badge-info">
                  {{ studentData.age }} ans
                </span>
              </div>
            </div>
          </div>
          
          <!-- Tabs -->
          <div class="tabs mb-6">
            <button
              type="button"
              @click="activeTab = 'info'"
              :class="['tab', activeTab === 'info' ? 'tab-active' : 'tab-inactive']"
            >
              <font-awesome-icon icon="info-circle" />
              <span>Informations</span>
            </button>
            <button
              type="button"
              @click="activeTab = 'classes'"
              :class="['tab', activeTab === 'classes' ? 'tab-active' : 'tab-inactive']"
            >
              <font-awesome-icon icon="door-open" />
              <span>Classes</span>
            </button>
            <button
              type="button"
              @click="activeTab = 'parent'"
              :class="['tab', activeTab === 'parent' ? 'tab-active' : 'tab-inactive']"
            >
              <font-awesome-icon icon="users" />
              <span>Parents</span>
            </button>
          </div>
          
          <!-- Tab Content -->
          <transition name="fade" mode="out-in">
            <!-- Info Tab -->
            <div v-if="activeTab === 'info'" key="info" class="space-y-6">
              <!-- Personal Info -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="card">
                  <div class="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                    <div class="w-9 h-9 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                      <font-awesome-icon icon="user" />
                    </div>
                    <h4 class="font-semibold text-slate-800">Informations personnelles</h4>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-sm text-slate-500">Prénom</span>
                      <span class="text-sm font-medium text-slate-800">{{ studentData.first_name }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-slate-500">Nom</span>
                      <span class="text-sm font-medium text-slate-800">{{ studentData.last_name }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-slate-500">Date de naissance</span>
                      <span class="text-sm font-medium text-slate-800">{{ formatDate(studentData.date_of_birth) }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-sm text-slate-500">Genre</span>
                      <span class="text-sm font-medium text-slate-800">{{ studentData.gender === 'M' ? 'Masculin' : 'Féminin' }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="card">
                  <div class="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                    <div class="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <font-awesome-icon icon="phone" />
                    </div>
                    <h4 class="font-semibold text-slate-800">Contact</h4>
                  </div>
                  <div class="space-y-3">
                    <div v-if="studentData.address">
                      <span class="text-sm text-slate-500">Adresse</span>
                      <p class="text-sm font-medium text-slate-800 mt-1">{{ studentData.address }}</p>
                    </div>
                    <div v-if="studentData.phone" class="flex justify-between">
                      <span class="text-sm text-slate-500">Téléphone</span>
                      <a :href="`tel:${studentData.phone}`" class="text-sm font-medium text-teal-600 hover:underline">
                        {{ studentData.phone }}
                      </a>
                    </div>
                    <div v-if="studentData.email" class="flex justify-between">
                      <span class="text-sm text-slate-500">Email</span>
                      <a :href="`mailto:${studentData.email}`" class="text-sm font-medium text-teal-600 hover:underline">
                        {{ studentData.email }}
                      </a>
                    </div>
                    <p v-if="!studentData.address && !studentData.phone && !studentData.email" 
                       class="text-sm text-slate-400 italic">
                      Aucune information de contact
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- School Info -->
              <div class="card">
                <div class="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div class="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                    <font-awesome-icon icon="graduation-cap" />
                  </div>
                  <h4 class="font-semibold text-slate-800">Informations scolaires</h4>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <span class="text-sm text-slate-500">Date d'inscription</span>
                    <p class="text-sm font-medium text-slate-800 mt-1">{{ formatDate(studentData.enrollment_date) }}</p>
                  </div>
                  <div>
                    <span class="text-sm text-slate-500">École</span>
                    <p class="text-sm font-medium text-slate-800 mt-1">{{ studentData.school_name || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Classes Tab -->
            <div v-else-if="activeTab === 'classes'" key="classes">
              <div v-if="studentData.classes?.length" class="grid gap-4">
                <div
                  v-for="cls in studentData.classes"
                  :key="cls.id"
                  class="card flex items-center gap-4"
                >
                  <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 
                              text-white flex items-center justify-center">
                    <font-awesome-icon icon="door-open" class="text-xl" />
                  </div>
                  <div class="flex-1">
                    <h5 class="font-semibold text-slate-800">{{ cls.class_name }}</h5>
                    <div class="flex items-center gap-4 mt-1 text-sm text-slate-500">
                      <span class="flex items-center gap-1">
                        <font-awesome-icon icon="calendar" class="text-xs" />
                        {{ cls.academic_year }}
                      </span>
                      <span class="flex items-center gap-1">
                        <font-awesome-icon icon="clock" class="text-xs" />
                        {{ formatDate(cls.enrolled_at) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">
                <div class="empty-state-icon">
                  <font-awesome-icon icon="door-open" class="text-3xl" />
                </div>
                <p class="empty-state-title">Aucune classe</p>
                <p class="empty-state-text">Cet élève n'est assigné à aucune classe.</p>
              </div>
            </div>
            
            <!-- Parent Tab -->
            <div v-else-if="activeTab === 'parent'" key="parent">
              <div v-if="studentData.parent_name || studentData.parent_phone || studentData.parent_email" class="card">
                <div class="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div class="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                    <font-awesome-icon icon="users" />
                  </div>
                  <h4 class="font-semibold text-slate-800">Parent / Tuteur</h4>
                </div>
                <div class="space-y-3">
                  <div v-if="studentData.parent_name" class="flex justify-between">
                    <span class="text-sm text-slate-500">Nom complet</span>
                    <span class="text-sm font-medium text-slate-800">{{ studentData.parent_name }}</span>
                  </div>
                  <div v-if="studentData.parent_phone" class="flex justify-between">
                    <span class="text-sm text-slate-500">Téléphone</span>
                    <a :href="`tel:${studentData.parent_phone}`" class="text-sm font-medium text-teal-600 hover:underline">
                      {{ studentData.parent_phone }}
                    </a>
                  </div>
                  <div v-if="studentData.parent_email" class="flex justify-between">
                    <span class="text-sm text-slate-500">Email</span>
                    <a :href="`mailto:${studentData.parent_email}`" class="text-sm font-medium text-teal-600 hover:underline">
                      {{ studentData.parent_email }}
                    </a>
                  </div>
                </div>
              </div>
              <div v-else class="empty-state">
                <div class="empty-state-icon">
                  <font-awesome-icon icon="user-friends" class="text-3xl" />
                </div>
                <p class="empty-state-title">Aucune information</p>
                <p class="empty-state-text">Aucune information parentale enregistrée.</p>
              </div>
            </div>
          </transition>
        </template>
        
        <div v-else class="empty-state">
          <div class="empty-state-icon">
            <font-awesome-icon icon="user-slash" class="text-3xl" />
          </div>
          <p class="empty-state-title">Élève non trouvé</p>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="modal-footer">
        <button @click="$emit('close')" class="btn btn-secondary">
          Fermer
        </button>
        <button @click="handleEdit" class="btn btn-primary">
          <font-awesome-icon icon="edit" />
          <span>Modifier</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'

const props = defineProps({
  student: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'edit'])

const studentsStore = useStudentsStore()
const loading = ref(false)
const activeTab = ref('info')

const studentData = computed(() => studentsStore.currentStudent || props.student || {})

onMounted(async () => {
  if (props.student?.id) {
    loading.value = true
    try {
      await studentsStore.fetchStudent(props.student.id)
    } catch (error) {
      console.error('Error fetching student:', error)
    } finally {
      loading.value = false
    }
  }
})

watch(() => props.student, async (newStudent) => {
  if (newStudent?.id) {
    loading.value = true
    try {
      await studentsStore.fetchStudent(newStudent.id)
    } catch (error) {
      console.error('Error fetching student:', error)
    } finally {
      loading.value = false
    }
  }
})

function handleEdit() {
  emit('edit')
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.split(' ')
  return parts.length >= 2 
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase()
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
