<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-amber-50/20">
    <!-- Sidebar -->
    <aside 
      :class="[
        'sidebar fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-out',
        sidebarCollapsed ? 'w-20' : 'w-72'
      ]"
    >
      <!-- Brand -->
      <div class="sidebar-brand" :class="{ 'justify-center px-0': sidebarCollapsed }">
        <div class="sidebar-brand-icon">
          <font-awesome-icon icon="graduation-cap" class="text-white text-lg" />
        </div>
        <transition name="fade">
          <span v-if="!sidebarCollapsed" class="sidebar-brand-text">EduSaaS</span>
        </transition>
      </div>
      
      <!-- Navigation -->
      <nav class="sidebar-nav overflow-y-auto scrollbar-dark h-[calc(100vh-88px)]">
        <router-link
          v-for="(item, index) in visibleMenuItems"
          :key="item.name"
          :to="{ name: item.name }"
          :class="[
            'sidebar-link',
            route.name === item.name && 'sidebar-link-active'
          ]"
          :style="{ animationDelay: `${index * 0.03}s` }"
          :title="sidebarCollapsed ? item.label : ''"
        >
          <div class="sidebar-link-icon">
            <font-awesome-icon :icon="item.icon" class="text-base" />
          </div>
          <transition name="fade">
            <span v-if="!sidebarCollapsed" class="flex-1 truncate">{{ item.label }}</span>
          </transition>
          <div 
            v-if="!sidebarCollapsed && route.name === item.name"
            class="w-1.5 h-1.5 rounded-full bg-white animate-pulse-subtle"
          ></div>
        </router-link>
      </nav>
      
      <!-- Collapse Button -->
      <button
        @click="toggleSidebar"
        class="absolute bottom-6 left-1/2 -translate-x-1/2 p-2.5 rounded-xl
               bg-white/10 hover:bg-white/20 text-white/70 hover:text-white
               transition-all duration-200"
      >
        <font-awesome-icon 
          :icon="sidebarCollapsed ? 'chevron-right' : 'chevron-left'" 
          class="text-sm"
        />
      </button>
    </aside>
    
    <!-- Main Content Area -->
    <div :class="[
      'transition-all duration-300 ease-out min-h-screen',
      sidebarCollapsed ? 'ml-20' : 'ml-72'
    ]">
      <!-- Top Navbar -->
      <header class="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/50">
        <div class="px-6 lg:px-8 py-4 flex items-center justify-between">
          <!-- Left: Page Title -->
          <div class="flex items-center gap-4">
            <button
              @click="toggleSidebar"
              class="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
            >
              <font-awesome-icon icon="bars" />
            </button>
            <div>
              <h1 class="text-xl font-bold text-slate-800">{{ currentPageTitle }}</h1>
              <p class="text-sm text-slate-500 hidden sm:block">{{ currentPageSubtitle }}</p>
            </div>
          </div>
          
          <!-- Right: Actions -->
          <div class="flex items-center gap-3">
            <!-- Search (Desktop) -->
            <div class="hidden md:block relative">
              <input
                type="text"
                placeholder="Rechercher..."
                class="w-64 pl-10 pr-4 py-2 bg-slate-100/80 border-0 rounded-xl
                       text-sm placeholder-slate-400 
                       focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:bg-white
                       transition-all duration-200"
              />
              <font-awesome-icon 
                icon="search" 
                class="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"
              />
            </div>
            
            <!-- Notifications -->
            <div class="relative">
              <button
                @click="showNotifications = !showNotifications"
                class="relative p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/80
                       transition-all duration-200 text-slate-600 hover:text-slate-800"
              >
                <font-awesome-icon icon="bell" />
                <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full 
                             animate-pulse-subtle ring-2 ring-white"></span>
              </button>
              
              <!-- Notifications Dropdown -->
              <transition name="dropdown">
                <div 
                  v-if="showNotifications"
                  class="dropdown-menu w-80"
                >
                  <div class="px-4 py-3 border-b border-slate-100">
                    <div class="flex items-center justify-between">
                      <h3 class="font-semibold text-slate-800">Notifications</h3>
                      <span class="badge badge-primary">3 nouvelles</span>
                    </div>
                  </div>
                  <div class="max-h-72 overflow-y-auto scrollbar-thin">
                    <div 
                      v-for="n in 3" 
                      :key="n"
                      class="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors
                             border-b border-slate-50 last:border-0"
                    >
                      <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center flex-shrink-0">
                          <font-awesome-icon icon="info-circle" class="text-teal-600" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm text-slate-700 line-clamp-2">Notification exemple {{ n }}</p>
                          <p class="text-xs text-slate-400 mt-1">Il y a {{ n * 5 }} minutes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
                    <router-link 
                      to="/communications"
                      class="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Voir toutes les notifications →
                    </router-link>
                  </div>
                </div>
              </transition>
            </div>
            
            <!-- User Menu -->
            <div class="relative">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-3 pl-3 pr-4 py-2 rounded-xl
                       bg-slate-100/80 hover:bg-slate-200/80
                       transition-all duration-200"
              >
                <div class="avatar avatar-md">
                  <div class="avatar-placeholder">
                    {{ userInitials }}
                  </div>
                </div>
                <span class="hidden md:block font-medium text-slate-700 text-sm">
                  {{ authStore.currentUser?.username || 'Utilisateur' }}
                </span>
                <font-awesome-icon 
                  icon="chevron-down" 
                  class="hidden md:block text-slate-400 text-xs transition-transform duration-200"
                  :class="{ 'rotate-180': showUserMenu }"
                />
              </button>
              
              <!-- User Dropdown -->
              <transition name="dropdown">
                <div 
                  v-if="showUserMenu"
                  class="dropdown-menu"
                >
                  <div class="px-4 py-3 border-b border-slate-100">
                    <p class="text-sm font-semibold text-slate-800">
                      {{ authStore.currentUser?.username || 'Utilisateur' }}
                    </p>
                    <p class="text-xs text-slate-500">
                      {{ authStore.currentUser?.email || 'email@example.com' }}
                    </p>
                  </div>
                  <div class="py-1">
                    <router-link
                      to="/settings"
                      class="dropdown-item"
                      @click="showUserMenu = false"
                    >
                      <font-awesome-icon icon="user" class="dropdown-item-icon text-teal-500" />
                      <span>Mon profil</span>
                    </router-link>
                    <router-link
                      to="/settings"
                      class="dropdown-item"
                      @click="showUserMenu = false"
                    >
                      <font-awesome-icon icon="cog" class="dropdown-item-icon text-slate-400" />
                      <span>Paramètres</span>
                    </router-link>
                  </div>
                  <div class="dropdown-divider"></div>
                  <div class="py-1">
                    <button
                      @click="handleLogout"
                      class="dropdown-item w-full text-red-600 hover:bg-red-50"
                    >
                      <font-awesome-icon icon="sign-out-alt" class="dropdown-item-icon text-red-400" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </header>
      
      <!-- Page Content -->
      <main class="p-6 lg:p-8">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
    
    <!-- Click outside overlay -->
    <transition name="fade">
      <div 
        v-if="showNotifications || showUserMenu"
        class="fixed inset-0 z-30"
        @click="closeDropdowns"
      ></div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermissions } from '@/composables/usePermissions'
import { MENU_ITEMS } from '@/constants/permissions'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { canAccessRoute } = usePermissions()

const sidebarCollapsed = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)

const menuItems = MENU_ITEMS

// Filtrer les éléments du menu selon les permissions
const visibleMenuItems = computed(() => {
  return menuItems.filter(item => {
    // Le Dashboard est toujours visible pour les utilisateurs authentifiés
    if (item.name === 'Dashboard') return true
    // Vérifier si l'utilisateur a la permission pour cet élément
    return canAccessRoute(item.name)
  })
})

const pageConfig = {
  Dashboard: { title: 'Tableau de bord', subtitle: 'Vue d\'ensemble de votre établissement' },
  Students: { title: 'Gestion des Élèves', subtitle: 'Gérez les élèves et les classes' },
  Teachers: { title: 'Gestion des Enseignants', subtitle: 'Gérez le personnel enseignant' },
  Academics: { title: 'Programmes Pédagogiques', subtitle: 'Matières, cours et contenus' },
  Assessments: { title: 'Évaluations & Notes', subtitle: 'Gérez les évaluations et bulletins' },
  Schedules: { title: 'Emploi du Temps', subtitle: 'Planification et événements' },
  Finance: { title: 'Gestion Financière', subtitle: 'Paiements et comptabilité' },
  Communications: { title: 'Communications', subtitle: 'Messages et notifications' },
  Reports: { title: 'Rapports & Statistiques', subtitle: 'Analyses et exports' },
  Documents: { title: 'Gestion Documentaire', subtitle: 'Fichiers et ressources' },
  Settings: { title: 'Paramètres', subtitle: 'Configuration du système' },
}

const currentPageTitle = computed(() => {
  return pageConfig[route.name]?.title || 'Tableau de bord'
})

const currentPageSubtitle = computed(() => {
  return pageConfig[route.name]?.subtitle || ''
})

const userInitials = computed(() => {
  const name = authStore.currentUser?.username || 'U'
  return name.substring(0, 2).toUpperCase()
})

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function closeDropdowns() {
  showNotifications.value = false
  showUserMenu.value = false
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
  showUserMenu.value = false
}
</script>

<style scoped>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-4px);
}

.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
