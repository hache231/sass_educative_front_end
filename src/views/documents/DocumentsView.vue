<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Tabs -->
    <div class="tabs">
      <button
        @click="activeTab = 'documents'"
        :class="['tab', activeTab === 'documents' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="file" />
        <span>Documents</span>
      </button>
      <button
        @click="activeTab = 'categories'"
        :class="['tab', activeTab === 'categories' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="folder" />
        <span>Catégories</span>
      </button>
      <button
        @click="activeTab = 'resources'"
        :class="['tab', activeTab === 'resources' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="link" />
        <span>Ressources</span>
      </button>
    </div>
    
    <!-- Tab Content -->
    <transition name="fade" mode="out-in">
      <!-- Documents Tab -->
      <div v-if="activeTab === 'documents'" key="documents" class="space-y-4">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold text-slate-800">Gestion des documents</h3>
            <p class="text-sm text-slate-500">Téléchargez et organisez vos documents</p>
          </div>
          <button class="btn btn-primary">
            <font-awesome-icon icon="upload" />
            <span>Téléverser</span>
          </button>
        </div>
        
        <div class="card p-0 overflow-hidden">
          <DocumentManager />
        </div>
      </div>
      
      <!-- Categories Tab -->
      <div v-else-if="activeTab === 'categories'" key="categories" class="space-y-4">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold text-slate-800">Catégories de documents</h3>
            <p class="text-sm text-slate-500">Organisez vos documents par catégories</p>
          </div>
          <button class="btn btn-primary">
            <font-awesome-icon icon="plus" />
            <span>Nouvelle catégorie</span>
          </button>
        </div>
        
        <div class="card">
          <div class="empty-state">
            <div class="empty-state-icon">
              <font-awesome-icon icon="folder-open" class="text-3xl" />
            </div>
            <p class="empty-state-title">Gestion des catégories</p>
            <p class="empty-state-text">Cette fonctionnalité sera bientôt disponible.</p>
          </div>
        </div>
      </div>
      
      <!-- Resources Tab -->
      <div v-else-if="activeTab === 'resources'" key="resources" class="space-y-4">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 class="text-lg font-semibold text-slate-800">Ressources externes</h3>
            <p class="text-sm text-slate-500">Liens et ressources pédagogiques</p>
          </div>
          <button class="btn btn-primary">
            <font-awesome-icon icon="plus" />
            <span>Ajouter une ressource</span>
          </button>
        </div>
        
        <div class="card p-0 overflow-hidden">
          <ResourceManager />
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DocumentManager from '@/components/documents/DocumentManager.vue'
import ResourceManager from '@/components/documents/ResourceManager.vue'

const activeTab = ref('documents')
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
