<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-xl font-bold text-slate-800">Préférences de Notifications</h2>
      <p class="text-sm text-slate-500">Configurez vos canaux de notification et alertes</p>
    </div>
    
    <!-- Form Card -->
    <div class="card">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Notification Channels -->
        <div>
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Canaux de notification</h3>
          
          <div class="space-y-4">
            <!-- Email Notifications -->
            <div class="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 hover:border-teal-300 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <font-awesome-icon icon="envelope" class="text-xl" />
                </div>
                <div>
                  <label for="email-notifications" class="text-sm font-semibold text-slate-800 cursor-pointer">
                    Notifications par email
                  </label>
                  <p class="text-xs text-slate-500">Recevez des notifications importantes par email</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="email-notifications"
                  v-model="form.email_notifications"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            
            <!-- SMS Notifications -->
            <div class="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 hover:border-teal-300 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                  <font-awesome-icon icon="sms" class="text-xl" />
                </div>
                <div>
                  <label for="sms-notifications" class="text-sm font-semibold text-slate-800 cursor-pointer">
                    Notifications par SMS
                  </label>
                  <p class="text-xs text-slate-500">Recevez des alertes urgentes par SMS</p>
                </div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="sms-notifications"
                  v-model="form.sms_notifications"
                  class="sr-only peer"
                />
                <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Notification Types -->
        <div class="pt-6 border-t border-slate-100">
          <h3 class="text-lg font-semibold text-slate-800 mb-4">Types de notifications</h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="flex items-center gap-3 mb-2">
                <font-awesome-icon icon="user-graduate" class="text-teal-600" />
                <span class="font-medium text-slate-800">Nouveaux élèves</span>
              </div>
              <p class="text-xs text-slate-500">Alertes lors de nouvelles inscriptions</p>
            </div>
            
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="flex items-center gap-3 mb-2">
                <font-awesome-icon icon="clipboard-check" class="text-amber-600" />
                <span class="font-medium text-slate-800">Nouvelles évaluations</span>
              </div>
              <p class="text-xs text-slate-500">Notifications pour les nouvelles notes</p>
            </div>
            
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="flex items-center gap-3 mb-2">
                <font-awesome-icon icon="calendar-alt" class="text-sky-600" />
                <span class="font-medium text-slate-800">Événements</span>
              </div>
              <p class="text-xs text-slate-500">Rappels pour les événements à venir</p>
            </div>
            
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div class="flex items-center gap-3 mb-2">
                <font-awesome-icon icon="exclamation-triangle" class="text-red-600" />
                <span class="font-medium text-slate-800">Alertes système</span>
              </div>
              <p class="text-xs text-slate-500">Notifications importantes du système</p>
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
  email_notifications: true,
  sms_notifications: false
})

watch(() => settingsStore.settings, (newSettings) => {
  if (newSettings) {
    form.email_notifications = newSettings.email_notifications !== false
    form.sms_notifications = newSettings.sms_notifications === true
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
