<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content max-w-3xl animate-modal-in">
      <!-- Header -->
      <div class="modal-header">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
            <font-awesome-icon :icon="teacher ? 'edit' : 'user-plus'" />
          </div>
          <h3>{{ teacher ? 'Modifier l\'enseignant' : 'Nouvel enseignant' }}</h3>
        </div>
        <button @click="$emit('close')" class="btn-icon-sm btn-ghost text-slate-400 hover:text-slate-600">
          <font-awesome-icon icon="times" />
        </button>
      </div>
      
      <!-- Body -->
      <form @submit.prevent="handleSubmit">
        <div class="modal-body">
          <!-- Tabs -->
          <div class="tabs mb-6">
            <button
              type="button"
              @click="activeTab = 'personal'"
              :class="['tab', activeTab === 'personal' ? 'tab-active' : 'tab-inactive']"
            >
              <font-awesome-icon icon="user" />
              <span>Personnel</span>
            </button>
            <button
              type="button"
              @click="activeTab = 'contact'"
              :class="['tab', activeTab === 'contact' ? 'tab-active' : 'tab-inactive']"
            >
              <font-awesome-icon icon="envelope" />
              <span>Contact</span>
            </button>
            <button
              type="button"
              @click="activeTab = 'professional'"
              :class="['tab', activeTab === 'professional' ? 'tab-active' : 'tab-inactive']"
            >
              <font-awesome-icon icon="briefcase" />
              <span>Professionnel</span>
            </button>
          </div>
          
          <!-- Tab Content -->
          <transition name="fade" mode="out-in">
            <!-- Personal Tab -->
            <div v-if="activeTab === 'personal'" key="personal" class="space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="first_name" class="label">
                    Prénom <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    v-model="form.first_name"
                    class="input"
                    placeholder="Prénom"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="last_name" class="label">
                    Nom <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    v-model="form.last_name"
                    class="input"
                    placeholder="Nom"
                    required
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label class="label">Photo de profil</label>
                <div class="flex items-start gap-4">
                  <div v-if="avatarPreview" class="relative">
                    <img
                      :src="avatarPreview"
                      alt="Preview"
                      class="w-24 h-24 rounded-xl object-cover border-2 border-slate-200"
                    />
                    <button
                      type="button"
                      @click="removeAvatar"
                      class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white
                             flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      <font-awesome-icon icon="times" />
                    </button>
                  </div>
                  <label class="flex-1 cursor-pointer">
                    <div class="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center
                                hover:border-amber-500 hover:bg-amber-50/50 transition-colors">
                      <font-awesome-icon icon="cloud-upload-alt" class="text-2xl text-slate-400 mb-2" />
                      <p class="text-sm text-slate-600">Télécharger une photo</p>
                      <p class="text-xs text-slate-400 mt-1">JPG, PNG (max 5MB)</p>
                    </div>
                    <input
                      type="file"
                      class="hidden"
                      accept="image/*"
                      @change="handleAvatarChange"
                    />
                  </label>
                </div>
              </div>
            </div>
            
            <!-- Contact Tab -->
            <div v-else-if="activeTab === 'contact'" key="contact" class="space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="email" class="label">
                    Email <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    v-model="form.email"
                    class="input"
                    placeholder="email@exemple.com"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="phone" class="label">Téléphone</label>
                  <input
                    type="tel"
                    id="phone"
                    v-model="form.phone"
                    class="input"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
              
              <template v-if="!teacher">
                <div class="p-4 rounded-xl bg-sky-50 border border-sky-200 mb-4">
                  <div class="flex items-start gap-3">
                    <font-awesome-icon icon="info-circle" class="text-sky-500 mt-0.5" />
                    <p class="text-sm text-sky-800">
                      Un compte utilisateur sera créé automatiquement. Les identifiants seront envoyés par email.
                    </p>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="form-group">
                    <label for="username" class="label">
                      Nom d'utilisateur
                      <span class="label-optional">(optionnel)</span>
                    </label>
                    <input
                      type="text"
                      id="username"
                      v-model="form.username"
                      class="input"
                      placeholder="Auto-généré si vide"
                    />
                  </div>
                  <div class="form-group">
                    <label for="password" class="label">
                      Mot de passe
                      <span class="label-optional">(optionnel)</span>
                    </label>
                    <input
                      type="password"
                      id="password"
                      v-model="form.password"
                      class="input"
                      placeholder="Auto-généré si vide"
                    />
                  </div>
                </div>
              </template>
            </div>
            
            <!-- Professional Tab -->
            <div v-else-if="activeTab === 'professional'" key="professional" class="space-y-5">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label for="employee_id" class="label">ID Employé</label>
                  <input
                    type="text"
                    id="employee_id"
                    v-model="form.employee_id"
                    class="input"
                    placeholder="Auto-généré si vide"
                  />
                </div>
                <div class="form-group">
                  <label for="hire_date" class="label">
                    Date d'embauche <span class="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="hire_date"
                    v-model="form.hire_date"
                    class="input"
                    :max="maxDate"
                    required
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label for="specialization" class="label">Spécialisation</label>
                <input
                  type="text"
                  id="specialization"
                  v-model="form.specialization"
                  class="input"
                  placeholder="Ex: Mathématiques, Sciences, Langues..."
                />
              </div>
              
              <div class="flex items-center gap-3 pt-4 border-t border-slate-100">
                <input
                  type="checkbox"
                  id="is_active"
                  v-model="form.is_active"
                  class="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                />
                <label for="is_active" class="text-sm font-medium text-slate-700">
                  Enseignant actif
                </label>
              </div>
            </div>
          </transition>
          
          <!-- Error -->
          <div v-if="error" class="alert alert-danger mt-4">
            <font-awesome-icon icon="exclamation-circle" class="alert-icon" />
            <div>
              <template v-if="typeof error === 'object'">
                <p v-for="(msg, key) in error" :key="key">
                  {{ Array.isArray(msg) ? msg[0] : msg }}
                </p>
              </template>
              <span v-else>{{ error }}</span>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="modal-footer">
          <button type="button" @click="$emit('close')" class="btn btn-secondary">
            Annuler
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <div v-if="loading" class="spinner spinner-sm border-white/30 border-t-white"></div>
            <font-awesome-icon v-else :icon="teacher ? 'check' : 'plus'" />
            <span>{{ teacher ? 'Enregistrer' : 'Créer' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTeachersStore } from '@/stores/teachers'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  teacherId: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const teachersStore = useTeachersStore()
const authStore = useAuthStore()

const activeTab = ref('personal')
const loading = ref(false)
const error = ref(null)
const teacher = ref(null)
const avatarPreview = ref(null)

const form = ref({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  username: '',
  password: '',
  avatar: null,
  employee_id: '',
  specialization: '',
  hire_date: new Date().toISOString().split('T')[0],
  is_active: true
})

const maxDate = computed(() => new Date().toISOString().split('T')[0])

onMounted(async () => {
  if (props.teacherId) {
    try {
      teacher.value = await teachersStore.fetchTeacher(props.teacherId)
      if (teacher.value) {
        form.value = {
          first_name: teacher.value.user?.first_name || '',
          last_name: teacher.value.user?.last_name || '',
          email: teacher.value.user?.email || '',
          phone: teacher.value.user?.phone || '',
          username: teacher.value.user?.username || '',
          password: '',
          avatar: null,
          employee_id: teacher.value.employee_id || '',
          specialization: teacher.value.specialization || '',
          hire_date: teacher.value.hire_date || '',
          is_active: teacher.value.is_active !== false
        }
        if (teacher.value.avatar_url) {
          avatarPreview.value = teacher.value.avatar_url
        }
      }
    } catch (err) {
      console.error('Error loading teacher:', err)
      error.value = 'Erreur lors du chargement'
    }
  }
})

function handleAvatarChange(event) {
  const file = event.target.files[0]
  if (file) {
    form.value.avatar = file
    const reader = new FileReader()
    reader.onload = (e) => avatarPreview.value = e.target.result
    reader.readAsDataURL(file)
  }
}

function removeAvatar() {
  avatarPreview.value = null
  form.value.avatar = null
}

async function handleSubmit() {
  loading.value = true
  error.value = null
  
  try {
    const data = {
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      email: form.value.email,
      phone: form.value.phone,
      employee_id: form.value.employee_id || undefined,
      specialization: form.value.specialization,
      hire_date: form.value.hire_date,
      is_active: form.value.is_active
    }
    
    if (!props.teacherId) {
      if (form.value.username) data.username = form.value.username
      if (form.value.password) data.password = form.value.password
    }
    
    if (form.value.avatar) {
      data.avatar = form.value.avatar
    }
    
    const schoolId = authStore.user?.school_id || authStore.user?.school?.id
    if (schoolId) data.school = schoolId
    
    if (props.teacherId) {
      await teachersStore.updateTeacher(props.teacherId, data)
    } else {
      await teachersStore.createTeacher(data)
    }
    
    emit('saved')
  } catch (err) {
    console.error('Error saving:', err)
    error.value = err.response?.data || 'Erreur lors de la sauvegarde'
  } finally {
    loading.value = false
  }
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


