<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="card flex items-center gap-4">
        <div class="stat-icon stat-icon-teal">
          <font-awesome-icon icon="bell" class="text-lg" />
        </div>
        <div>
          <p class="stat-value text-2xl">{{ communicationsStore.unreadNotificationsCount }}</p>
          <p class="stat-label">Notifications non lues</p>
        </div>
      </div>
      <div class="card flex items-center gap-4">
        <div class="stat-icon stat-icon-amber">
          <font-awesome-icon icon="envelope" class="text-lg" />
        </div>
        <div>
          <p class="stat-value text-2xl">{{ communicationsStore.unreadMessagesCount }}</p>
          <p class="stat-label">Messages non lus</p>
        </div>
      </div>
      <div class="card flex items-center gap-4">
        <div class="stat-icon stat-icon-purple">
          <font-awesome-icon icon="bullhorn" class="text-lg" />
        </div>
        <div>
          <p class="stat-value text-2xl">{{ communicationsStore.activeAnnouncementsCount || 0 }}</p>
          <p class="stat-label">Annonces actives</p>
        </div>
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
