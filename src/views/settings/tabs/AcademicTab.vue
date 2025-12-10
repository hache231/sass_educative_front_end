<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-slate-800">Paramètres Académiques</h2>
      <p class="text-sm text-slate-500">Configurez les années scolaires, périodes et système de notation</p>
    </div>
    
    <!-- Form Card -->
    <div class="card">
      <div v-if="settingsStore.loading" class="flex items-center justify-center py-20">
        <div class="spinner spinner-lg"></div>
      </div>
      
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Année académique -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label for="academic-year" class="label">
              Année académique actuelle <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="academic-year"
              v-model="form.current_academic_year"
              class="input"
              placeholder="Ex: 2024-2025"
              required
            />
            <p class="form-hint">Format: AAAA-AAAA (ex: 2024-2025)</p>
          </div>
          
          <div class="form-group">
            <label for="period-type" class="label">
              Type de période <span class="text-red-500">*</span>
            </label>
            <select id="period-type" v-model="form.period_type" class="select" required>
              <option value="trimester">Trimestre</option>
              <option value="semester">Semestre</option>
              <option value="quarter">Trimestre (4 périodes)</option>
            </select>
          </div>
        </div>
        
        <!-- Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label for="start-date" class="label">Date de début</label>
            <input
              type="date"
              id="start-date"
              v-model="form.academic_year_start"
              class="input"
            />
          </div>
          
          <div class="form-group">
            <label for="end-date" class="label">Date de fin</label>
            <input
              type="date"
              id="end-date"
              v-model="form.academic_year_end"
              class="input"
            />
          </div>
        </div>
        
        <!-- Périodes et notation -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="form-group">
            <label for="periods-count" class="label">
              Nombre de périodes <span class="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="periods-count"
              v-model.number="form.number_of_periods"
              class="input"
              required
              min="1"
              max="12"
            />
          </div>
          
          <div class="form-group">
            <label for="grading-system" class="label">
              Système de notation <span class="text-red-500">*</span>
            </label>
            <select id="grading-system" v-model="form.grading_system" class="select" required>
              <option value="20">Sur 20</option>
              <option value="100">Sur 100</option>
              <option value="A-F">Lettres (A-F)</option>
            </select>
          </div>
        </div>
        
        <!-- Note de passage -->
        <div class="form-group">
          <label for="passing-grade" class="label">
            Note de passage <span class="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="passing-grade"
            v-model.number="form.passing_grade"
            class="input"
            required
            min="0"
            step="0.01"
            :max="form.grading_system === '20' ? 20 : form.grading_system === '100' ? 100 : 100"
          />
          <p class="form-hint">
            Note minimale requise pour valider une évaluation
          </p>
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
  current_academic_year: '',
  academic_year_start: '',
  academic_year_end: '',
  period_type: 'trimester',
  number_of_periods: 3,
  grading_system: '20',
  passing_grade: 10.00
})

watch(() => settingsStore.settings, (newSettings) => {
  if (newSettings) {
    form.current_academic_year = newSettings.current_academic_year || ''
    form.academic_year_start = newSettings.academic_year_start || ''
    form.academic_year_end = newSettings.academic_year_end || ''
    form.period_type = newSettings.period_type || 'trimester'
    form.number_of_periods = newSettings.number_of_periods || 3
    form.grading_system = newSettings.grading_system || '20'
    form.passing_grade = parseFloat(newSettings.passing_grade) || 10.00
  }
}, { immediate: true })

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
    const errorData = err.response?.data
    if (typeof errorData === 'object') {
      const messages = []
      for (const [field, msgs] of Object.entries(errorData)) {
        if (Array.isArray(msgs)) {
          messages.push(`${field}: ${msgs.join(', ')}`)
        }
      }
      error.value = messages.join(' | ') || 'Erreur lors de la sauvegarde'
    } else {
      error.value = errorData?.detail || 'Erreur lors de la sauvegarde'
    }
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
