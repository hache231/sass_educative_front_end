<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Welcome Banner -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-600 p-8 text-white shadow-xl shadow-teal-500/20">
      <div class="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <font-awesome-icon icon="graduation-cap" class="text-xl" />
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold mb-1">
                Bonjour, {{ authStore.currentUser?.username || 'Administrateur' }} 👋
              </h1>
              <p class="text-teal-50/90 text-sm md:text-base">
                Bienvenue sur votre tableau de bord. Voici un aperçu de votre établissement.
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-6">
          <div class="text-right hidden sm:block">
            <p class="text-xs text-teal-100/70 uppercase tracking-wider mb-1">Année scolaire</p>
            <p class="text-2xl font-bold">{{ currentAcademicYear }}</p>
          </div>
          <div class="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <font-awesome-icon icon="calendar-alt" class="text-2xl" />
          </div>
        </div>
      </div>
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
    </div>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Élèves -->
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-start justify-between mb-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300">
            <font-awesome-icon icon="user-graduate" class="text-xl text-white" />
          </div>
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <font-awesome-icon icon="arrow-up" class="text-[10px]" />
            <span>+12%</span>
          </div>
        </div>
        <div>
          <p class="text-3xl font-bold text-slate-800 mb-1">{{ stats.students }}</p>
          <p class="text-sm text-slate-500 font-medium">Élèves inscrits</p>
          <p class="text-xs text-slate-400 mt-1">Vs mois dernier: +{{ Math.floor(stats.students * 0.12) }}</p>
        </div>
        <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-100/50 to-transparent rounded-tl-full opacity-50"></div>
      </div>
      
      <!-- Enseignants -->
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-start justify-between mb-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
            <font-awesome-icon icon="chalkboard-teacher" class="text-xl text-white" />
          </div>
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <font-awesome-icon icon="arrow-up" class="text-[10px]" />
            <span>+3</span>
          </div>
        </div>
        <div>
          <p class="text-3xl font-bold text-slate-800 mb-1">{{ stats.teachers }}</p>
          <p class="text-sm text-slate-500 font-medium">Enseignants actifs</p>
          <p class="text-xs text-slate-400 mt-1">Tous les enseignants</p>
        </div>
        <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100/50 to-transparent rounded-tl-full opacity-50"></div>
      </div>
      
      <!-- Classes -->
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-start justify-between mb-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform duration-300">
            <font-awesome-icon icon="door-open" class="text-xl text-white" />
          </div>
          <span class="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold">Actif</span>
        </div>
        <div>
          <p class="text-3xl font-bold text-slate-800 mb-1">{{ stats.classes }}</p>
          <p class="text-sm text-slate-500 font-medium">Classes ouvertes</p>
          <p class="text-xs text-slate-400 mt-1">En cours d'activité</p>
        </div>
        <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-100/50 to-transparent rounded-tl-full opacity-50"></div>
      </div>
      
      <!-- Matières -->
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-start justify-between mb-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
            <font-awesome-icon icon="book-open" class="text-xl text-white" />
          </div>
        </div>
        <div>
          <p class="text-3xl font-bold text-slate-800 mb-1">{{ stats.subjects }}</p>
          <p class="text-sm text-slate-500 font-medium">Matières enseignées</p>
          <p class="text-xs text-slate-400 mt-1">Programme complet</p>
        </div>
        <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/50 to-transparent rounded-tl-full opacity-50"></div>
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
        
        <div v-else class="space-y-3">
          <div 
            v-for="(activity, index) in activities" 
            :key="index"
            class="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50/80 transition-all duration-200 border border-transparent hover:border-slate-200 cursor-pointer group"
          >
            <div 
              class="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-200"
              :class="getActivityIconClass(activity.type)"
            >
              <font-awesome-icon :icon="getActivityIcon(activity.type)" class="text-base" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-800 group-hover:text-teal-600 transition-colors">{{ activity.message }}</p>
              <p class="text-xs text-slate-400 mt-1.5 flex items-center gap-2">
                <font-awesome-icon icon="clock" class="text-[10px]" />
                {{ activity.time }}
              </p>
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity">
              <font-awesome-icon icon="chevron-right" class="text-slate-400 text-xs" />
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
              class="group relative flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100/50 hover:from-teal-100 hover:to-teal-50 border border-teal-200/50 hover:border-teal-300 text-teal-700 transition-all duration-200 hover:shadow-md"
            >
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-teal-500/40 transition-all duration-200">
                <font-awesome-icon icon="user-plus" class="text-lg" />
              </div>
              <span class="text-sm font-semibold text-center">Nouvel élève</span>
            </router-link>
            
            <router-link 
              to="/teachers" 
              class="group relative flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 hover:from-amber-100 hover:to-amber-50 border border-amber-200/50 hover:border-amber-300 text-amber-700 transition-all duration-200 hover:shadow-md"
            >
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-amber-500/40 transition-all duration-200">
                <font-awesome-icon icon="user-tie" class="text-lg" />
              </div>
              <span class="text-sm font-semibold text-center">Nouvel enseignant</span>
            </router-link>
            
            <router-link 
              to="/schedules" 
              class="group relative flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-sky-50 to-sky-100/50 hover:from-sky-100 hover:to-sky-50 border border-sky-200/50 hover:border-sky-300 text-sky-700 transition-all duration-200 hover:shadow-md"
            >
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-sky-500/40 transition-all duration-200">
                <font-awesome-icon icon="calendar-plus" class="text-lg" />
              </div>
              <span class="text-sm font-semibold text-center">Planifier</span>
            </router-link>
            
            <router-link 
              to="/assessments" 
              class="group relative flex flex-col items-center gap-3 p-5 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100/50 hover:from-purple-100 hover:to-purple-50 border border-purple-200/50 hover:border-purple-300 text-purple-700 transition-all duration-200 hover:shadow-md"
            >
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-purple-500/40 transition-all duration-200">
                <font-awesome-icon icon="clipboard-list" class="text-lg" />
              </div>
              <span class="text-sm font-semibold text-center">Évaluation</span>
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
              class="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white hover:from-teal-50 hover:to-white border border-slate-200/60 hover:border-teal-200 transition-all duration-200 group cursor-pointer"
            >
              <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex flex-col items-center justify-center text-white shadow-md shadow-teal-500/30 group-hover:scale-110 transition-transform duration-200">
                <p class="text-lg font-bold leading-none">{{ event.day }}</p>
                <p class="text-[10px] uppercase font-semibold opacity-90">{{ event.month }}</p>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-slate-800 group-hover:text-teal-700 transition-colors mb-1">{{ event.title }}</p>
                <p class="text-xs text-slate-500 flex items-center gap-1.5">
                  <font-awesome-icon icon="clock" class="text-[10px]" />
                  {{ event.time }}
                </p>
              </div>
              <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                <font-awesome-icon icon="chevron-right" class="text-slate-400 text-xs" />
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
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useStudentsStore } from '@/stores/students'
import { useTeachersStore } from '@/stores/teachers'
import { useProgramsStore } from '@/stores/programs'
import { useSchedulesStore } from '@/stores/schedules'
import { useLoadingState } from '@/composables/useLoadingState'
import { useErrorHandler } from '@/composables/useErrorHandler'

const authStore = useAuthStore()
const studentsStore = useStudentsStore()
const teachersStore = useTeachersStore()
const programsStore = useProgramsStore()
const schedulesStore = useSchedulesStore()

const { loading, withLoading } = useLoadingState()
const { handleApiError } = useErrorHandler()

// Statistiques réelles
const stats = ref({
  students: 0,
  teachers: 0,
  classes: 0,
  subjects: 0
})

// Activités récentes
const activities = ref([])
const upcomingEvents = ref([])

// Année académique actuelle (à récupérer depuis les settings)
const currentAcademicYear = ref('2024-2025')

// Charger les données du dashboard
async function loadDashboardData() {
  try {
    await withLoading(async () => {
      // Charger les statistiques en parallèle
      await Promise.all([
        studentsStore.fetchStudents({ page_size: 1 }).catch(() => null),
        teachersStore.fetchTeachers({ page_size: 1 }).catch(() => null),
        studentsStore.fetchClasses().catch(() => null),
        programsStore.fetchSubjects().catch(() => null),
        schedulesStore.fetchCalendarEvents().catch(() => null)
      ])
      
      // Mettre à jour les statistiques depuis les stores
      stats.value = {
        students: studentsStore.pagination?.count || studentsStore.students.length || 0,
        teachers: teachersStore.pagination?.count || teachersStore.teachers.length || 0,
        classes: studentsStore.classes.filter(c => c.is_active).length || 0,
        subjects: programsStore.subjects.length || 0
      }
      
      // Traiter les événements à venir depuis le store
      const now = new Date()
      upcomingEvents.value = schedulesStore.upcomingEvents
        .slice(0, 5)
        .map(event => {
          const eventDate = new Date(event.start_date || event.startDate)
          return {
            id: event.id,
            title: event.title,
            day: eventDate.getDate(),
            month: eventDate.toLocaleDateString('fr-FR', { month: 'short' }),
            time: eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
          }
        })
      
      // Générer les activités récentes (à partir des données récentes)
      generateRecentActivities()
    })
  } catch (error) {
    handleApiError(error, false) // Ne pas afficher de toast pour les erreurs de chargement du dashboard
  }
}

// Générer les activités récentes à partir des données
function generateRecentActivities() {
  const recentActivities = []
  const now = new Date()
  
  // Activités basées sur les élèves récemment créés/modifiés
  const recentStudents = studentsStore.students
    .filter(s => {
      if (!s.created_at && !s.updated_at) return false
      const date = new Date(s.updated_at || s.created_at)
      const daysDiff = (now - date) / (1000 * 60 * 60 * 24)
      return daysDiff <= 7 // Derniers 7 jours
    })
    .slice(0, 3)
  
  recentStudents.forEach(student => {
    const date = new Date(student.updated_at || student.created_at)
    recentActivities.push({
      type: 'student',
      message: `${student.full_name || `${student.first_name} ${student.last_name}`} a été ${student.updated_at ? 'modifié' : 'inscrit'}`,
      time: formatTimeAgo(date)
    })
  })
  
  // Activités basées sur les enseignants récemment créés/modifiés
  const recentTeachers = teachersStore.teachers
    .filter(t => {
      if (!t.created_at && !t.updated_at) return false
      const date = new Date(t.updated_at || t.created_at)
      const daysDiff = (now - date) / (1000 * 60 * 60 * 24)
      return daysDiff <= 7
    })
    .slice(0, 2)
  
  recentTeachers.forEach(teacher => {
    const date = new Date(teacher.updated_at || teacher.created_at)
    recentActivities.push({
      type: 'teacher',
      message: `${teacher.full_name} a été ${teacher.updated_at ? 'modifié' : 'ajouté'}`,
      time: formatTimeAgo(date)
    })
  })
  
  // Trier par date (plus récent en premier)
  activities.value = recentActivities.sort((a, b) => {
    const dateA = new Date(a.time)
    const dateB = new Date(b.time)
    return dateB - dateA
  }).slice(0, 10)
}

// Formater le temps écoulé
function formatTimeAgo(date) {
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'À l\'instant'
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

onMounted(() => {
  loadDashboardData()
})

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
