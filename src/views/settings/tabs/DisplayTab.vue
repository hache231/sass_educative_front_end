<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-slate-800">Paramètres d'Affichage</h2>
      <p class="text-sm text-slate-500">Personnalisez la langue, les formats de date et d'heure</p>
    </div>
    
    <!-- Form Card -->
    <div class="card">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Language & Timezone -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label for="language" class="label">
              Langue <span class="text-red-500">*</span>
            </label>
            <select id="language" v-model="form.language" class="select" required>
              <option value="fr">Français</option>
              <option value="en">Anglais</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="timezone" class="label">
              Fuseau horaire <span class="text-red-500">*</span>
            </label>
            <select id="timezone" v-model="form.timezone" class="select" required>
              <option value="Africa/Abidjan">Africa/Abidjan (GMT+0)</option>
              <option value="Africa/Dakar">Africa/Dakar (GMT+0)</option>
              <option value="Africa/Lagos">Africa/Lagos (GMT+1)</option>
              <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
            </select>
          </div>
        </div>
        
        <!-- Date Format -->
        <div class="form-group">
          <label for="date-format" class="label">
            Format de date <span class="text-red-500">*</span>
          </label>
          <select id="date-format" v-model="form.date_format" class="select" required>
            <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
          </select>
          <p class="form-hint">Exemple: {{ getDateExample(form.date_format) }}</p>
        </div>
        
        <!-- Time Format -->
        <div class="form-group">
          <label class="label">
            Format d'heure <span class="text-red-500">*</span>
          </label>
          <div class="grid grid-cols-2 gap-4">
            <label class="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors"
                   :class="form.time_format === '24h' 
                     ? 'border-teal-500 bg-teal-50' 
                     : 'border-slate-200 hover:border-slate-300'">
              <input
                type="radio"
                id="time-24h"
                value="24h"
                v-model="form.time_format"
                class="w-5 h-5 text-teal-600 focus:ring-teal-500"
              />
              <div class="flex-1">
                <div class="font-medium text-slate-800">24 heures</div>
                <div class="text-xs text-slate-500">Ex: 14:30</div>
              </div>
            </label>
            
            <label class="flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors"
                   :class="form.time_format === '12h' 
                     ? 'border-teal-500 bg-teal-50' 
                     : 'border-slate-200 hover:border-slate-300'">
              <input
                type="radio"
                id="time-12h"
                value="12h"
                v-model="form.time_format"
                class="w-5 h-5 text-teal-600 focus:ring-teal-500"
              />
              <div class="flex-1">
                <div class="font-medium text-slate-800">12 heures</div>
                <div class="text-xs text-slate-500">Ex: 2:30 PM</div>
              </div>
            </label>
          </div>
        </div>
        
        <!-- Preview -->
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div class="flex items-center gap-3 mb-3">
            <font-awesome-icon icon="eye" class="text-teal-600" />
            <span class="font-medium text-slate-800">Aperçu</span>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-slate-500">Date:</span>
              <span class="font-medium text-slate-800">{{ getDateExample(form.date_format) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-500">Heure:</span>
              <span class="font-medium text-slate-800">
                {{ form.time_format === '24h' ? '14:30' : '2:30 PM' }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- Alerts -->
        <transition name="slide">
          <div v-if="error" class="alert alert-danger">
            <font-awesome-icon icon="exclamation-circle" class="alert-icon" />
            <span>{{ error }}</span>
          </div>
        </transition>
        
        <transition name="slide">
          <div v-if="success" class="alert alert-success">
            <font-awesome-icon icon="check-circle" class="alert-icon" />
            <span>Paramètres sauvegardés avec succès !</span>
          </div>
        </transition>
        
        <!-- Submit -->
        <div class="flex justify-end pt-4 border-t border-slate-100">
          <button type="submit" class="btn btn-primary" :disabled="loading">
            <div v-if="loading" class="spinner spinner-sm border-white/30 border-t-white"></div>
            <font-awesome-icon v-else icon="save" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()
const loading = ref(false)
const error = ref('')
const success = ref(false)

const form = reactive({
  language: 'fr',
  timezone: 'Africa/Abidjan',
  date_format: 'DD/MM/YYYY',
  time_format: '24h'
})

watch(() => settingsStore.settings, (newSettings) => {
  if (newSettings) {
    form.language = newSettings.language || 'fr'
    form.timezone = newSettings.timezone || 'Africa/Abidjan'
    form.date_format = newSettings.date_format || 'DD/MM/YYYY'
    form.time_format = newSettings.time_format || '24h'
  }
}, { immediate: true })

function getDateExample(format) {
  const date = new Date(2024, 11, 31)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  switch (format) {
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    default:
      return `${day}/${month}/${year}`
  }
}

async function handleSubmit() {
  loading.value = true
  error.value = ''
  success.value = false
  
  try {
    await settingsStore.updateSettings(form)
    success.value = true
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err) {
    error.value = err.response?.data?.detail || 'Erreur lors de la sauvegarde'
  } finally {
    loading.value = false
  }
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
