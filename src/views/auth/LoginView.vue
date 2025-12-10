<template>
  <div class="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Left Panel - Branding -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-600"></div>
      <div class="absolute inset-0 opacity-10">
        <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <!-- Floating Shapes -->
      <div class="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse-subtle"></div>
      <div class="absolute bottom-32 right-16 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl animate-pulse-subtle" style="animation-delay: 1s"></div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center px-16 text-white">
        <div class="mb-12">
          <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
            <font-awesome-icon icon="graduation-cap" class="text-3xl text-white" />
          </div>
          <h1 class="text-5xl font-bold mb-4 leading-tight">
            Bienvenue sur<br/>
            <span class="text-amber-300">EduSaaS</span>
          </h1>
          <p class="text-xl text-teal-100/80 max-w-md leading-relaxed">
            La solution complète pour la gestion de votre établissement scolaire.
          </p>
        </div>
        
        <!-- Features -->
        <div class="space-y-4">
          <div class="flex items-center gap-4 text-teal-100">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <font-awesome-icon icon="users" class="text-amber-300" />
            </div>
            <span>Gestion des élèves et enseignants</span>
          </div>
          <div class="flex items-center gap-4 text-teal-100">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <font-awesome-icon icon="calendar-alt" class="text-amber-300" />
            </div>
            <span>Emploi du temps intelligent</span>
          </div>
          <div class="flex items-center gap-4 text-teal-100">
            <div class="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <font-awesome-icon icon="chart-pie" class="text-amber-300" />
            </div>
            <span>Rapports et analyses détaillés</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right Panel - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden text-center mb-10">
          <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 
                      flex items-center justify-center mb-4 shadow-lg shadow-teal-500/30">
            <font-awesome-icon icon="graduation-cap" class="text-3xl text-white" />
          </div>
          <h1 class="text-2xl font-bold text-white">EduSaaS</h1>
        </div>
        
        <!-- Form Card -->
        <div class="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-slate-800 mb-2">Connexion</h2>
            <p class="text-slate-500">Accédez à votre espace de gestion</p>
          </div>
          
          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Username -->
            <div class="form-group">
              <label for="username" class="label">Nom d'utilisateur</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <font-awesome-icon icon="user" class="text-slate-400" />
                </div>
                <input
                  type="text"
                  id="username"
                  v-model="form.username"
                  required
                  placeholder="Entrez votre identifiant"
                  class="input pl-12"
                  :class="{ 'input-error': error }"
                />
              </div>
            </div>
            
            <!-- Password -->
            <div class="form-group">
              <label for="password" class="label">Mot de passe</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <font-awesome-icon icon="lock" class="text-slate-400" />
                </div>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password"
                  v-model="form.password"
                  required
                  placeholder="Entrez votre mot de passe"
                  class="input pl-12 pr-12"
                  :class="{ 'input-error': error }"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                </button>
              </div>
            </div>
            
            <!-- Remember Me -->
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="rememberMe"
                  class="w-4 h-4 rounded border-slate-300 text-teal-600 
                         focus:ring-teal-500 focus:ring-offset-0"
                />
                <span class="text-sm text-slate-600">Se souvenir de moi</span>
              </label>
              <a href="#" class="text-sm text-teal-600 hover:text-teal-700 font-medium">
                Mot de passe oublié ?
              </a>
            </div>
            
            <!-- Error Message -->
            <transition name="slide">
              <div v-if="error" class="alert alert-danger">
                <font-awesome-icon icon="exclamation-circle" class="alert-icon" />
                <span>{{ error }}</span>
              </div>
            </transition>
            
            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-primary w-full py-3.5"
              :disabled="loading"
            >
              <div v-if="loading" class="spinner spinner-sm border-white/30 border-t-white"></div>
              <span v-else>Se connecter</span>
            </button>
          </form>
          
          <!-- Footer -->
          <div class="mt-8 pt-6 border-t border-slate-100 text-center">
            <p class="text-sm text-slate-500">
              Besoin d'un compte ? 
              <span class="text-slate-600 font-medium">Contactez votre administrateur.</span>
            </p>
          </div>
        </div>
        
        <!-- Copyright -->
        <p class="text-center text-sm text-slate-500 mt-8">
          © {{ new Date().getFullYear() }} EduSaaS. Tous droits réservés.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''
  
  const result = await authStore.login(form.value)
  
  if (result.success) {
    router.push({ name: 'Dashboard' })
  } else {
    error.value = result.error || 'Identifiants incorrects. Veuillez réessayer.'
  }
  
  loading.value = false
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
