<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-slate-800">Informations de l'École</h2>
      <p class="text-sm text-slate-500">Détails et configuration de votre établissement</p>
    </div>
    
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="spinner spinner-lg"></div>
    </div>
    
    <!-- Error -->
    <div v-else-if="error" class="alert alert-danger">
      <font-awesome-icon icon="exclamation-circle" class="alert-icon" />
      <span>{{ error }}</span>
    </div>
    
    <!-- School Info -->
    <div v-else-if="school" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Info -->
      <div class="lg:col-span-2 space-y-6">
        <!-- General Info -->
        <div class="card">
          <div class="card-header">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center">
                <font-awesome-icon icon="school" />
              </div>
              <h3 class="text-lg font-semibold text-slate-800">Informations générales</h3>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="label">Nom de l'école</label>
              <p class="text-slate-800 font-medium">{{ school.name }}</p>
            </div>
            <div>
              <label class="label">Slug</label>
              <p class="text-slate-600 font-mono text-sm">{{ school.slug }}</p>
            </div>
            <div class="md:col-span-2">
              <label class="label">Adresse</label>
              <p class="text-slate-800">{{ school.address || 'Non renseignée' }}</p>
            </div>
            <div>
              <label class="label">Ville</label>
              <p class="text-slate-800">{{ school.city || 'Non renseignée' }}</p>
            </div>
            <div>
              <label class="label">Pays</label>
              <p class="text-slate-800">{{ school.country || 'Non renseigné' }}</p>
            </div>
          </div>
        </div>
        
        <!-- Contact -->
        <div class="card">
          <div class="card-header">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <font-awesome-icon icon="phone" />
              </div>
              <h3 class="text-lg font-semibold text-slate-800">Contact</h3>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="label">Email</label>
              <a :href="`mailto:${school.email}`" class="text-teal-600 hover:text-teal-700 font-medium">
                {{ school.email }}
              </a>
            </div>
            <div>
              <label class="label">Téléphone</label>
              <a :href="`tel:${school.phone}`" class="text-teal-600 hover:text-teal-700 font-medium">
                {{ school.phone || 'Non renseigné' }}
              </a>
            </div>
            <div class="md:col-span-2">
              <label class="label">Site web</label>
              <a 
                v-if="school.website" 
                :href="school.website" 
                target="_blank"
                class="text-teal-600 hover:text-teal-700 font-medium"
              >
                {{ school.website }}
                <font-awesome-icon icon="external-link-alt" class="ml-1 text-xs" />
              </a>
              <span v-else class="text-slate-400">Non renseigné</span>
            </div>
          </div>
        </div>
        
        <!-- Subscription -->
        <div class="card">
          <div class="card-header">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                <font-awesome-icon icon="credit-card" />
              </div>
              <h3 class="text-lg font-semibold text-slate-800">Abonnement</h3>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="label">Statut</label>
              <span :class="['badge', getSubscriptionStatusClass(school.subscription_status)]">
                {{ getSubscriptionStatusLabel(school.subscription_status) }}
              </span>
            </div>
            <div>
              <label class="label">Actif</label>
              <span :class="['badge', school.is_subscription_active ? 'badge-success' : 'badge-danger']">
                {{ school.is_subscription_active ? 'Oui' : 'Non' }}
              </span>
            </div>
            <div>
              <label class="label">Date de début</label>
              <p class="text-slate-800">
                {{ school.subscription_start_date ? formatDate(school.subscription_start_date) : 'Non renseignée' }}
              </p>
            </div>
            <div>
              <label class="label">Date de fin</label>
              <p class="text-slate-800">
                {{ school.subscription_end_date ? formatDate(school.subscription_end_date) : 'Non renseignée' }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Time Slots -->
        <div class="card">
          <div class="card-header">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <font-awesome-icon icon="clock" />
                </div>
                <h3 class="text-lg font-semibold text-slate-800">Horaires de cours</h3>
              </div>
              <button @click="showTimeSlotModal = true" class="btn btn-primary btn-sm">
                <font-awesome-icon icon="plus" />
                <span>Ajouter un créneau</span>
              </button>
            </div>
          </div>
          
          <div v-if="loadingTimeSlots" class="flex items-center justify-center py-12">
            <div class="spinner spinner-md"></div>
          </div>
          
          <div v-else-if="timeSlots.length === 0" class="empty-state py-12">
            <div class="empty-state-icon">
              <font-awesome-icon icon="clock" class="text-3xl" />
            </div>
            <p class="empty-state-title">Aucun créneau horaire</p>
            <p class="empty-state-text">Ajoutez votre premier créneau pour commencer.</p>
            <button @click="showTimeSlotModal = true" class="btn btn-primary mt-4">
              <font-awesome-icon icon="plus" />
              <span>Ajouter un créneau</span>
            </button>
          </div>
          
          <div v-else class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Ordre</th>
                  <th>Heure de début</th>
                  <th>Heure de fin</th>
                  <th>Durée</th>
                  <th>Statut</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="slot in timeSlots" :key="slot.id">
                  <td class="font-medium text-slate-800">{{ slot.order }}</td>
                  <td class="text-slate-600">{{ formatTime(slot.start_time) }}</td>
                  <td class="text-slate-600">{{ formatTime(slot.end_time) }}</td>
                  <td class="text-slate-600">{{ calculateDuration(slot.start_time, slot.end_time) }}</td>
                  <td>
                    <span :class="['badge', slot.is_active ? 'badge-success' : 'badge-danger']">
                      {{ slot.is_active ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td>
                    <div class="flex items-center justify-end gap-2">
                      <button
                        @click="editTimeSlot(slot)"
                        class="action-btn action-btn-edit"
                        title="Modifier"
                      >
                        <font-awesome-icon icon="edit" />
                      </button>
                      <button
                        @click="deleteTimeSlotConfirm(slot)"
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
        </div>
      </div>
      
      <!-- Sidebar: Logo -->
      <div class="space-y-6">
        <div class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-slate-800">Logo de l'école</h3>
          </div>
          <div class="text-center">
            <div v-if="school.logo" class="mb-4">
              <img
                :src="getLogoUrl(school.logo)"
                alt="Logo"
                class="w-full max-w-xs mx-auto rounded-xl border-2 border-slate-200 shadow-sm"
              />
            </div>
            <div v-else class="mb-4 p-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
              <font-awesome-icon icon="image" class="text-4xl text-slate-400 mb-2" />
              <p class="text-sm text-slate-500">Aucun logo</p>
            </div>
            
            <div class="space-y-2">
              <input
                type="file"
                ref="logoInput"
                accept="image/*"
                @change="handleLogoChange"
                class="hidden"
              />
              <button
                @click="logoInput?.click()"
                class="btn btn-primary w-full"
                :disabled="uploadingLogo"
              >
                <font-awesome-icon icon="upload" />
                <span>{{ school.logo ? 'Changer le logo' : 'Télécharger un logo' }}</span>
              </button>
              <button
                v-if="school.logo"
                @click="removeLogo"
                class="btn btn-outline w-full"
                :disabled="uploadingLogo"
              >
                <font-awesome-icon icon="trash" />
                <span>Supprimer</span>
              </button>
            </div>
            
            <transition name="slide">
              <div v-if="logoError" class="alert alert-danger mt-4">
                <font-awesome-icon icon="exclamation-circle" class="alert-icon" />
                <span>{{ logoError }}</span>
              </div>
            </transition>
            
            <transition name="slide">
              <div v-if="logoSuccess" class="alert alert-success mt-4">
                <font-awesome-icon icon="check-circle" class="alert-icon" />
                <span>Logo mis à jour avec succès !</span>
              </div>
            </transition>
          </div>
        </div>
        
        <div class="card bg-sky-50 border-sky-200">
          <div class="flex items-start gap-3">
            <font-awesome-icon icon="info-circle" class="text-sky-600 mt-0.5" />
            <div class="text-sm text-sky-800">
              <p class="font-medium mb-1">Information</p>
              <p>Les autres informations sont gérées par le superadministrateur. Contactez le support pour modifier ces informations.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Time Slot Modal -->
    <div v-if="showTimeSlotModal" class="modal-overlay" @click.self="closeTimeSlotModal">
      <div class="modal-content max-w-md animate-modal-in">
        <div class="modal-header">
          <h3>{{ selectedTimeSlot ? 'Modifier le créneau' : 'Nouveau créneau horaire' }}</h3>
          <button @click="closeTimeSlotModal" class="btn-icon-sm btn-ghost">
            <font-awesome-icon icon="times" />
          </button>
        </div>
        
        <form @submit.prevent="saveTimeSlot" class="modal-body">
          <div class="space-y-4">
            <div class="form-group">
              <label class="label">Ordre <span class="text-red-500">*</span></label>
              <input
                type="number"
                v-model.number="timeSlotForm.order"
                class="input"
                required
                min="1"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div class="form-group">
                <label class="label">Heure de début <span class="text-red-500">*</span></label>
                <input
                  type="time"
                  v-model="timeSlotForm.start_time"
                  class="input"
                  required
                />
              </div>
              <div class="form-group">
                <label class="label">Heure de fin <span class="text-red-500">*</span></label>
                <input
                  type="time"
                  v-model="timeSlotForm.end_time"
                  class="input"
                  required
                />
              </div>
            </div>
            
            <div class="flex items-center gap-3 pt-2">
              <input
                type="checkbox"
                id="is-active"
                v-model="timeSlotForm.is_active"
                class="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <label for="is-active" class="text-sm font-medium text-slate-700">
                Créneau actif
              </label>
            </div>
            
            <div v-if="timeSlotError" class="alert alert-danger">
              <font-awesome-icon icon="exclamation-circle" class="alert-icon" />
              <span>{{ timeSlotError }}</span>
            </div>
          </div>
        </form>
        
        <div class="modal-footer">
          <button type="button" @click="closeTimeSlotModal" class="btn btn-secondary">
            Annuler
          </button>
          <button @click="saveTimeSlot" class="btn btn-primary" :disabled="savingTimeSlot">
            <div v-if="savingTimeSlot" class="spinner spinner-sm border-white/30 border-t-white"></div>
            <font-awesome-icon v-else icon="save" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as settingsApi from '@/api/settings'
import api from '@/api'

const loading = ref(false)
const error = ref('')
const school = ref(null)
const uploadingLogo = ref(false)
const logoError = ref('')
const logoSuccess = ref(false)
const logoInput = ref(null)

const loadingTimeSlots = ref(false)
const timeSlots = ref([])
const showTimeSlotModal = ref(false)
const selectedTimeSlot = ref(null)
const savingTimeSlot = ref(false)
const timeSlotError = ref('')
const timeSlotForm = ref({
  order: 1,
  start_time: '',
  end_time: '',
  is_active: true
})

onMounted(async () => {
  await Promise.all([loadSchool(), loadTimeSlots()])
})

async function loadSchool() {
  loading.value = true
  error.value = ''
  try {
    const response = await api.get('/schools/my_school/')
    school.value = response.data
  } catch (err) {
    error.value = err.response?.data?.error || 'Erreur lors du chargement'
    console.error(err)
  } finally {
    loading.value = false
  }
}

function getLogoUrl(logoPath) {
  if (!logoPath) return ''
  if (logoPath.startsWith('http://') || logoPath.startsWith('https://')) {
    return logoPath
  }
  const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  return `${baseURL}${logoPath}`
}

function getSubscriptionStatusClass(status) {
  const classes = {
    'trial': 'badge-info',
    'active': 'badge-success',
    'expired': 'badge-danger',
    'suspended': 'badge-warning'
  }
  return classes[status] || 'badge-secondary'
}

function getSubscriptionStatusLabel(status) {
  const labels = {
    'trial': 'Essai',
    'active': 'Actif',
    'expired': 'Expiré',
    'suspended': 'Suspendu'
  }
  return labels[status] || status
}

function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

async function handleLogoChange(event) {
  const file = event.target.files[0]
  if (!file) return
  
  if (file.size > 5 * 1024 * 1024) {
    logoError.value = 'Le fichier est trop volumineux (max 5MB)'
    return
  }
  
  if (!file.type.startsWith('image/')) {
    logoError.value = 'Le fichier doit être une image'
    return
  }
  
  uploadingLogo.value = true
  logoError.value = ''
  logoSuccess.value = false
  
  try {
    await settingsApi.updateSchoolLogo(file)
    logoSuccess.value = true
    await loadSchool()
    setTimeout(() => { logoSuccess.value = false }, 3000)
  } catch (err) {
    logoError.value = err.response?.data?.error || err.response?.data?.logo?.[0] || 'Erreur lors du téléchargement'
  } finally {
    uploadingLogo.value = false
    if (logoInput.value) logoInput.value.value = ''
  }
}

async function removeLogo() {
  if (!confirm('Supprimer le logo ?')) return
  
  uploadingLogo.value = true
  logoError.value = ''
  
  try {
    const formData = new FormData()
    formData.append('logo', '')
    await api.patch('/schools/my_school/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    await loadSchool()
    logoSuccess.value = true
    setTimeout(() => { logoSuccess.value = false }, 3000)
  } catch (err) {
    logoError.value = 'Erreur lors de la suppression'
  } finally {
    uploadingLogo.value = false
  }
}

async function loadTimeSlots() {
  loadingTimeSlots.value = true
  try {
    const response = await settingsApi.getTimeSlots()
    timeSlots.value = Array.isArray(response.data) ? response.data : (response.data.results || [])
  } catch (err) {
    console.error('Error loading time slots:', err)
    timeSlots.value = []
  } finally {
    loadingTimeSlots.value = false
  }
}

function editTimeSlot(slot) {
  selectedTimeSlot.value = slot
  timeSlotForm.value = {
    order: slot.order,
    start_time: slot.start_time,
    end_time: slot.end_time,
    is_active: slot.is_active
  }
  showTimeSlotModal.value = true
}

function closeTimeSlotModal() {
  showTimeSlotModal.value = false
  selectedTimeSlot.value = null
  timeSlotForm.value = { order: 1, start_time: '', end_time: '', is_active: true }
  timeSlotError.value = ''
}

async function saveTimeSlot() {
  savingTimeSlot.value = true
  timeSlotError.value = ''
  
  try {
    if (selectedTimeSlot.value) {
      await settingsApi.updateTimeSlot(selectedTimeSlot.value.id, timeSlotForm.value)
    } else {
      await settingsApi.createTimeSlot(timeSlotForm.value)
    }
    await loadTimeSlots()
    closeTimeSlotModal()
  } catch (err) {
    const errorData = err.response?.data
    if (typeof errorData === 'object') {
      const messages = []
      for (const [field, msgs] of Object.entries(errorData)) {
        if (Array.isArray(msgs)) {
          messages.push(`${field}: ${msgs.join(', ')}`)
        }
      }
      timeSlotError.value = messages.join(' | ') || 'Erreur lors de la sauvegarde'
    } else {
      timeSlotError.value = errorData?.detail || 'Erreur lors de la sauvegarde'
    }
  } finally {
    savingTimeSlot.value = false
  }
}

async function deleteTimeSlotConfirm(slot) {
  if (!confirm(`Supprimer le créneau ${formatTime(slot.start_time)} - ${formatTime(slot.end_time)} ?`)) {
    return
  }
  
  try {
    await settingsApi.deleteTimeSlot(slot.id)
    await loadTimeSlots()
  } catch (err) {
    alert('Erreur lors de la suppression')
  }
}

function formatTime(timeString) {
  if (!timeString) return '-'
  const parts = timeString.split(':')
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`
  }
  return timeString
}

function calculateDuration(startTime, endTime) {
  if (!startTime || !endTime) return '-'
  const start = new Date(`2000-01-01T${startTime}`)
  const end = new Date(`2000-01-01T${endTime}`)
  const diff = (end - start) / (1000 * 60)
  const hours = Math.floor(diff / 60)
  const minutes = diff % 60
  if (hours > 0) {
    return `${hours}h${minutes > 0 ? minutes + 'min' : ''}`
  }
  return `${minutes}min`
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
