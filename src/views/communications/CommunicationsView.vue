<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300">
            <font-awesome-icon icon="bell" class="text-xl text-white" />
          </div>
          <div>
            <p class="text-3xl font-bold text-slate-800 mb-1">{{ communicationsStore.unreadNotificationsCount }}</p>
            <p class="text-sm text-slate-500 font-medium">Notifications non lues</p>
          </div>
        </div>
        <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-100/50 to-transparent rounded-tl-full opacity-50"></div>
      </div>
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
            <font-awesome-icon icon="envelope" class="text-xl text-white" />
          </div>
          <div>
            <p class="text-3xl font-bold text-slate-800 mb-1">{{ communicationsStore.unreadMessagesCount }}</p>
            <p class="text-sm text-slate-500 font-medium">Messages non lus</p>
          </div>
        </div>
        <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100/50 to-transparent rounded-tl-full opacity-50"></div>
      </div>
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
            <font-awesome-icon icon="bullhorn" class="text-xl text-white" />
          </div>
          <div>
            <p class="text-3xl font-bold text-slate-800 mb-1">{{ communicationsStore.activeAnnouncementsCount || 0 }}</p>
            <p class="text-sm text-slate-500 font-medium">Annonces actives</p>
          </div>
        </div>
        <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/50 to-transparent rounded-tl-full opacity-50"></div>
      </div>
    </div>
    
    <!-- Tabs -->
    <div class="tabs">
      <button
        @click="activeTab = 'notifications'"
        :class="['tab', activeTab === 'notifications' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="bell" />
        <span>Notifications</span>
        <span
          v-if="communicationsStore.unreadNotificationsCount > 0"
          class="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white"
        >
          {{ communicationsStore.unreadNotificationsCount }}
        </span>
      </button>
      <button
        @click="activeTab = 'messages'"
        :class="['tab', activeTab === 'messages' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="envelope" />
        <span>Messages</span>
        <span
          v-if="communicationsStore.unreadMessagesCount > 0"
          class="ml-2 px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white"
        >
          {{ communicationsStore.unreadMessagesCount }}
        </span>
      </button>
      <button
        @click="activeTab = 'announcements'"
        :class="['tab', activeTab === 'announcements' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="bullhorn" />
        <span>Annonces</span>
      </button>
    </div>
    
    <!-- Tab Content -->
    <transition name="fade" mode="out-in">
      <!-- Notifications Tab -->
      <div v-if="activeTab === 'notifications'" key="notifications" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-slate-800">Centre de notifications</h3>
            <p class="text-sm text-slate-500">Toutes vos notifications système</p>
          </div>
          <button 
            v-if="communicationsStore.unreadNotificationsCount > 0"
            class="btn btn-ghost text-sm"
          >
            <font-awesome-icon icon="check-double" />
            <span>Tout marquer comme lu</span>
          </button>
        </div>
        
        <div class="card p-0 overflow-hidden">
          <NotificationCenter />
        </div>
      </div>
      
      <!-- Messages Tab -->
      <div v-else-if="activeTab === 'messages'" key="messages" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-slate-800">Messagerie</h3>
            <p class="text-sm text-slate-500">Envoyez et recevez des messages</p>
          </div>
          <button class="btn btn-primary">
            <font-awesome-icon icon="plus" />
            <span>Nouveau message</span>
          </button>
        </div>
        
        <div class="card p-0 overflow-hidden">
          <MessageComposer />
        </div>
      </div>
      
      <!-- Announcements Tab -->
      <div v-else-if="activeTab === 'announcements'" key="announcements" class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-slate-800">Gestion des annonces</h3>
            <p class="text-sm text-slate-500">Publiez des annonces pour votre établissement</p>
          </div>
          <button class="btn btn-primary">
            <font-awesome-icon icon="plus" />
            <span>Nouvelle annonce</span>
          </button>
        </div>
        
        <div class="card p-0 overflow-hidden">
          <AnnouncementManager />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCommunicationsStore } from '@/stores/communications'
import NotificationCenter from '@/components/communications/NotificationCenter.vue'
import MessageComposer from '@/components/communications/MessageComposer.vue'
import AnnouncementManager from '@/components/communications/AnnouncementManager.vue'

const communicationsStore = useCommunicationsStore()
const activeTab = ref('notifications')

onMounted(async () => {
  await communicationsStore.fetchNotifications()
  await communicationsStore.fetchMessages()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
