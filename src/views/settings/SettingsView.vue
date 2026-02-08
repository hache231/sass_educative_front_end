<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header avec description -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-600 p-8 text-white shadow-xl shadow-teal-500/20 mb-6">
      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <font-awesome-icon icon="cog" class="text-xl" />
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold mb-1">Paramètres du Système</h1>
            <p class="text-teal-50/90 text-sm md:text-base">
              Configurez votre établissement, les utilisateurs, les rôles et les préférences
            </p>
          </div>
        </div>
      </div>
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
    </div>
    
    <!-- Tabs Navigation améliorée -->
    <div class="flex flex-wrap gap-2 bg-white rounded-2xl p-2 border border-slate-200/60 shadow-sm mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200',
          'hover:scale-[1.02] active:scale-[0.98]',
          activeTab === tab.id 
            ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-500/30' 
            : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-teal-300'
        ]"
      >
        <div :class="[
          'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
          activeTab === tab.id ? 'bg-white/20' : 'bg-slate-100 text-slate-600'
        ]">
          <font-awesome-icon :icon="tab.icon" class="text-sm" />
        </div>
        <span>{{ tab.label }}</span>
        <span 
          v-if="tab.badge" 
          :class="[
            'px-2 py-0.5 rounded-full text-xs font-bold',
            activeTab === tab.id ? 'bg-white/30' : 'bg-teal-100 text-teal-700'
          ]"
        >
          {{ tab.badge }}
        </span>
      </button>
    </div>
    
    <!-- Tab Content avec animation -->
    <transition name="slide-fade" mode="out-in">
      <!-- Roles Tab -->
      <div v-if="activeTab === 'roles'" key="roles" class="space-y-6">
        <RolesTab />
      </div>
      
      <!-- Users Tab -->
      <div v-else-if="activeTab === 'users'" key="users" class="space-y-6">
        <UsersTab />
      </div>
      
      <!-- Academic Tab -->
      <div v-else-if="activeTab === 'academic'" key="academic" class="space-y-6">
        <AcademicTab />
      </div>
      
      <!-- School Tab -->
      <div v-else-if="activeTab === 'school'" key="school" class="space-y-6">
        <SchoolTab />
      </div>
      
      <!-- Notifications Tab -->
      <div v-else-if="activeTab === 'notifications'" key="notifications" class="space-y-6">
        <NotificationsTab />
      </div>
      
      <!-- Display Tab -->
      <div v-else-if="activeTab === 'display'" key="display" class="space-y-6">
        <DisplayTab />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import RolesTab from './tabs/RolesTab.vue'
import AcademicTab from './tabs/AcademicTab.vue'
import SchoolTab from './tabs/SchoolTab.vue'
import UsersTab from './tabs/UsersTab.vue'
import NotificationsTab from './tabs/NotificationsTab.vue'
import DisplayTab from './tabs/DisplayTab.vue'

const settingsStore = useSettingsStore()
const activeTab = ref('roles')

const tabs = [
  { id: 'roles', label: 'Rôles & Permissions', icon: 'user-shield' },
  { id: 'users', label: 'Utilisateurs', icon: 'users-cog' },
  { id: 'academic', label: 'Académique', icon: 'graduation-cap' },
  { id: 'school', label: 'École', icon: 'school' },
  { id: 'notifications', label: 'Notifications', icon: 'bell' },
  { id: 'display', label: 'Affichage', icon: 'palette' }
]

onMounted(async () => {
  await settingsStore.fetchSettings()
  await settingsStore.fetchRoles()
  await settingsStore.fetchPermissions()
})
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
