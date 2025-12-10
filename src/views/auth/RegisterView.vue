<template>
  <div class="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Left Panel - Form -->
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
            <h2 class="text-2xl font-bold text-slate-800 mb-2">Créer un compte</h2>
            <p class="text-slate-500">Configurez votre établissement scolaire</p>
          </div>
          
          <form @submit.prevent="handleRegister" class="space-y-5">
            <!-- School Name -->
            <div class="form-group">
              <label for="school_name" class="label">Nom de l'établissement</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <font-awesome-icon icon="school" class="text-slate-400" />
                </div>
                <input
                  type="text"
                  id="school_name"
                  v-model="form.school_name"
                  required
                  placeholder="Ex: Lycée Jean Moulin"
                  class="input pl-12"
                />
              </div>
            </div>
            
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
                  placeholder="Choisissez un identifiant"
                  class="input pl-12"
                />
              </div>
            </div>
            
            <!-- Email -->
            <div class="form-group">
              <label for="email" class="label">Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <font-awesome-icon icon="envelope" class="text-slate-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  v-model="form.email"
                  required
                  placeholder="admin@etablissement.fr"
                  class="input pl-12"
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
                  placeholder="Minimum 8 caractères"
                  class="input pl-12 pr-12"
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
            
            <!-- Confirm Password -->
            <div class="form-group">
              <label for="password_confirm" class="label">Confirmer le mot de passe</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <font-awesome-icon icon="lock" class="text-slate-400" />
                </div>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  id="password_confirm"
                  v-model="form.password_confirm"
                  required
                  placeholder="Répétez le mot de passe"
                  class="input pl-12"
                />
              </div>
            </div>
            
            <!-- Terms -->
            <label class="flex items-start gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="acceptTerms"
                required
                class="w-4 h-4 mt-0.5 rounded border-slate-300 text-teal-600 
                       focus:ring-teal-500 focus:ring-offset-0"
              />
              <span class="text-sm text-slate-600">
                J'accepte les 
                <a href="#" class="text-teal-600 hover:underline">conditions d'utilisation</a>
                et la
                <a href="#" class="text-teal-600 hover:underline">politique de confidentialité</a>
              </span>
            </label>
            
            <!-- Error Message -->
            <transition name="slide">
              <div v-if="error" class="alert alert-danger">
                <font-awesome-icon icon="exclamation-circle" class="alert-icon" />
                <span>{{ error }}</span>
              </div>
            </transition>
            
            <!-- Success Message -->
            <transition name="slide">
              <div v-if="success" class="alert alert-success">
                <font-awesome-icon icon="check-circle" class="alert-icon" />
                <span>{{ success }}</span>
              </div>
            </transition>
            
            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-primary w-full py-3.5"
              :disabled="loading"
            >
              <div v-if="loading" class="spinner spinner-sm border-white/30 border-t-white"></div>
              <span v-else>Créer mon compte</span>
            </button>
          </form>
          
          <!-- Footer -->
          <div class="mt-8 pt-6 border-t border-slate-100 text-center">
            <p class="text-sm text-slate-500">
              Déjà inscrit ?
              <router-link 
                :to="{ name: 'Login' }" 
                class="text-teal-600 hover:text-teal-700 font-medium"
              >
                Se connecter
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right Panel - Branding -->
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
      <div class="absolute top-32 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-subtle"></div>
      <div class="absolute bottom-20 left-16 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl animate-pulse-subtle" style="animation-delay: 1s"></div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center px-16 text-white">
        <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
          <font-awesome-icon icon="graduation-cap" class="text-3xl text-white" />
        </div>
        <h1 class="text-5xl font-bold mb-4 leading-tight">
          Lancez-vous avec<br/>
          <span class="text-amber-300">EduSaaS</span>
        </h1>
        <p class="text-xl text-teal-100/80 max-w-md leading-relaxed mb-10">
          Créez votre compte administrateur et commencez à gérer votre établissement en quelques minutes.
        </p>
        
        <!-- Steps -->
        <div class="space-y-4">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-amber-300 font-bold">
              1
            </div>
            <span class="text-teal-100">Créez votre compte administrateur</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-amber-300 font-bold">
              2
            </div>
            <span class="text-teal-100">Configurez votre établissement</span>
          </div>
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-amber-300 font-bold">
              3
            </div>
            <span class="text-teal-100">Invitez votre équipe</span>
          </div>
        </div>
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
  school_name: '',
  username: '',
  email: '',
  password: '',
  password_confirm: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')
const showPassword = ref(false)
const acceptTerms = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = ''
  
  // Validation
  if (form.value.password !== form.value.password_confirm) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  
  if (form.value.password.length < 8) {
    error.value = 'Le mot de passe doit contenir au moins 8 caractères.'
    return
  }
  
  loading.value = true
  
  const result = await authStore.register(form.value)
  
  if (result.success) {
    success.value = 'Compte créé avec succès ! Redirection...'
    setTimeout(() => {
      router.push({ name: 'Login' })
    }, 2000)
  } else {
    error.value = result.error || 'Erreur lors de la création du compte.'
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
