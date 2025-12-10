<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Welcome Banner -->
    <div class="card-gradient text-white">
      <div class="relative z-10 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2">
            Bonjour, {{ authStore.currentUser?.username || 'Administrateur' }} 👋
          </h1>
          <p class="text-teal-100/90">
            Bienvenue sur votre tableau de bord. Voici un aperçu de votre établissement.
          </p>
        </div>
        <div class="hidden md:block">
          <div class="flex items-center gap-4">
            <div class="text-right">
              <p class="text-sm text-teal-100/70">Année scolaire</p>
              <p class="text-xl font-bold">2024 - 2025</p>
            </div>
            <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <font-awesome-icon icon="calendar-alt" class="text-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Élèves -->
      <div class="stat-card stat-card-teal animate-slide-up stagger-1">
        <div class="flex items-start justify-between mb-4">
          <div class="stat-icon stat-icon-teal">
            <font-awesome-icon icon="user-graduate" class="text-xl" />
          </div>
          <span class="stat-trend stat-trend-up">
            <font-awesome-icon icon="arrow-up" class="text-xs" />
            <span>+12%</span>
          </span>
        </div>
        <div>
          <p class="stat-value">0</p>
          <p class="stat-label">Élèves inscrits</p>
        </div>
      </div>
      
      <!-- Enseignants -->
      <div class="stat-card stat-card-amber animate-slide-up stagger-2">
        <div class="flex items-start justify-between mb-4">
          <div class="stat-icon stat-icon-amber">
            <font-awesome-icon icon="chalkboard-teacher" class="text-xl" />
          </div>
          <span class="stat-trend stat-trend-up">
            <font-awesome-icon icon="arrow-up" class="text-xs" />
            <span>+3</span>
          </span>
        </div>
        <div>
          <p class="stat-value">0</p>
          <p class="stat-label">Enseignants actifs</p>
        </div>
      </div>
      
      <!-- Classes -->
      <div class="stat-card stat-card-sky animate-slide-up stagger-3">
        <div class="flex items-start justify-between mb-4">
          <div class="stat-icon stat-icon-sky">
            <font-awesome-icon icon="door-open" class="text-xl" />
          </div>
          <span class="badge badge-info">Actif</span>
        </div>
        <div>
          <p class="stat-value">0</p>
          <p class="stat-label">Classes ouvertes</p>
        </div>
      </div>
      
      <!-- Matières -->
      <div class="stat-card stat-card-purple animate-slide-up stagger-4">
        <div class="flex items-start justify-between mb-4">
          <div class="stat-icon stat-icon-purple">
            <font-awesome-icon icon="book-open" class="text-xl" />
          </div>
        </div>
        <div>
          <p class="stat-value">0</p>
          <p class="stat-label">Matières enseignées</p>
        </div>
      </div>
    </div>
    
    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Recent Activities -->
      <div class="lg:col-span-2 card animate-slide-up stagger-5">
        <div class="card-header">
          <h3>Activités récentes</h3>
          <router-link to="/reports" class="text-sm text-teal-600 hover:text-teal-700 font-medium">
            Voir tout →
          </router-link>
        </div>
        
        <div v-if="activities.length === 0" class="empty-state py-12">
          <div class="empty-state-icon">
            <font-awesome-icon icon="history" class="text-3xl" />
          </div>
          <p class="empty-state-title">Aucune activité récente</p>
          <p class="empty-state-text">Les activités apparaîtront ici au fur et à mesure de l'utilisation.</p>
        </div>
        
        <div v-else class="space-y-4">
          <div 
            v-for="(activity, index) in activities" 
            :key="index"
            class="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div 
              class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="getActivityIconClass(activity.type)"
            >
              <font-awesome-icon :icon="getActivityIcon(activity.type)" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-slate-800">{{ activity.message }}</p>
              <p class="text-xs text-slate-400 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions & Calendar -->
      <div class="space-y-6">
        <!-- Quick Actions -->
        <div class="card animate-slide-up stagger-6">
          <div class="card-header">
            <h3>Actions rapides</h3>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <router-link 
              to="/students" 
              class="flex flex-col items-center gap-2 p-4 rounded-xl bg-teal-50 hover:bg-teal-100 
                     text-teal-700 transition-colors group"
            >
              <div class="w-12 h-12 rounded-xl bg-teal-500 text-white flex items-center justify-center
                          group-hover:scale-110 transition-transform">
                <font-awesome-icon icon="user-plus" class="text-lg" />
              </div>
              <span class="text-sm font-medium text-center">Nouvel élève</span>
            </router-link>
            
            <router-link 
              to="/teachers" 
              class="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 
                     text-amber-700 transition-colors group"
            >
              <div class="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center
                          group-hover:scale-110 transition-transform">
                <font-awesome-icon icon="user-tie" class="text-lg" />
              </div>
              <span class="text-sm font-medium text-center">Nouvel enseignant</span>
            </router-link>
            
            <router-link 
              to="/schedules" 
              class="flex flex-col items-center gap-2 p-4 rounded-xl bg-sky-50 hover:bg-sky-100 
                     text-sky-700 transition-colors group"
            >
              <div class="w-12 h-12 rounded-xl bg-sky-500 text-white flex items-center justify-center
                          group-hover:scale-110 transition-transform">
                <font-awesome-icon icon="calendar-plus" class="text-lg" />
              </div>
              <span class="text-sm font-medium text-center">Planifier</span>
            </router-link>
            
            <router-link 
              to="/assessments" 
              class="flex flex-col items-center gap-2 p-4 rounded-xl bg-purple-50 hover:bg-purple-100 
                     text-purple-700 transition-colors group"
            >
              <div class="w-12 h-12 rounded-xl bg-purple-500 text-white flex items-center justify-center
                          group-hover:scale-110 transition-transform">
                <font-awesome-icon icon="clipboard-list" class="text-lg" />
              </div>
              <span class="text-sm font-medium text-center">Évaluation</span>
            </router-link>
          </div>
        </div>
        
        <!-- Upcoming Events -->
        <div class="card animate-slide-up stagger-7">
          <div class="card-header">
            <h3>Prochains événements</h3>
            <router-link to="/schedules" class="text-sm text-teal-600 hover:text-teal-700 font-medium">
              Calendrier →
            </router-link>
          </div>
          
          <div v-if="upcomingEvents.length === 0" class="text-center py-8">
            <div class="w-14 h-14 mx-auto mb-3 rounded-xl bg-slate-100 flex items-center justify-center">
              <font-awesome-icon icon="calendar" class="text-xl text-slate-400" />
            </div>
            <p class="text-sm text-slate-500">Aucun événement à venir</p>
          </div>
          
          <div v-else class="space-y-3">
            <div 
              v-for="event in upcomingEvents" 
              :key="event.id"
              class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              <div class="w-12 text-center">
                <p class="text-lg font-bold text-teal-600">{{ event.day }}</p>
                <p class="text-xs text-slate-500 uppercase">{{ event.month }}</p>
              </div>
              <div class="flex-1 border-l-2 border-teal-200 pl-3">
                <p class="text-sm font-medium text-slate-800">{{ event.title }}</p>
                <p class="text-xs text-slate-500">{{ event.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- System Status -->
    <div class="card animate-slide-up stagger-8">
      <div class="card-header">
        <h3>État du système</h3>
        <span class="badge badge-success">
          <span class="badge-dot bg-emerald-500 animate-pulse-subtle"></span>
          Tous les services opérationnels
        </span>
      </div>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
          <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <font-awesome-icon icon="server" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-800">Serveur</p>
            <p class="text-xs text-emerald-600">En ligne</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
          <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <font-awesome-icon icon="database" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-800">Base de données</p>
            <p class="text-xs text-emerald-600">Connectée</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
          <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <font-awesome-icon icon="shield-alt" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-800">Sécurité</p>
            <p class="text-xs text-emerald-600">Protégé</p>
          </div>
        </div>
        
        <div class="flex items-center gap-3 p-4 rounded-xl bg-slate-50">
          <div class="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <font-awesome-icon icon="sync" />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-800">Synchronisation</p>
            <p class="text-xs text-emerald-600">À jour</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// Placeholder data
const activities = ref([])
const upcomingEvents = ref([])

function getActivityIcon(type) {
  const icons = {
    student: 'user-graduate',
    teacher: 'chalkboard-teacher',
    class: 'door-open',
    assessment: 'clipboard-check',
    default: 'info-circle'
  }
  return icons[type] || icons.default
}

function getActivityIconClass(type) {
  const classes = {
    student: 'bg-teal-100 text-teal-600',
    teacher: 'bg-amber-100 text-amber-600',
    class: 'bg-sky-100 text-sky-600',
    assessment: 'bg-purple-100 text-purple-600',
    default: 'bg-slate-100 text-slate-600'
  }
  return classes[type] || classes.default
}
</script>
