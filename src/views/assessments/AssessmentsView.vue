<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Tabs -->
    <div class="tabs">
      <button
        @click="activeTab = 'assessments'"
        :class="['tab', activeTab === 'assessments' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="clipboard-list" />
        <span>Évaluations</span>
      </button>
      <button
        @click="activeTab = 'grades'"
        :class="['tab', activeTab === 'grades' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="edit" />
        <span>Saisie des notes</span>
      </button>
      <button
        @click="activeTab = 'report-cards'"
        :class="['tab', activeTab === 'report-cards' ? 'tab-active' : 'tab-inactive']"
      >
        <font-awesome-icon icon="file-alt" />
        <span>Bulletins</span>
      </button>
    </div>
    
    <!-- Tab Content -->
    <transition name="fade" mode="out-in">
      <!-- Assessments Tab -->
      <div v-if="activeTab === 'assessments'" key="assessments" class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800">Gestion des évaluations</h2>
            <p class="text-sm text-slate-500">Créez et planifiez les contrôles et examens</p>
          </div>
          <button class="btn btn-primary">
            <font-awesome-icon icon="plus" />
            <span>Nouvelle évaluation</span>
          </button>
        </div>
        
        <AssessmentManager />
      </div>
      
      <!-- Grades Tab -->
      <div v-else-if="activeTab === 'grades'" key="grades" class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800">Saisie des notes</h2>
            <p class="text-sm text-slate-500">Entrez et gérez les notes des élèves</p>
          </div>
        </div>
        
        <GradeManager />
      </div>
      
      <!-- Report Cards Tab -->
      <div v-else-if="activeTab === 'report-cards'" key="report-cards" class="space-y-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-800">Bulletins scolaires</h2>
            <p class="text-sm text-slate-500">Consultez et imprimez les bulletins</p>
          </div>
          <button class="btn btn-secondary">
            <font-awesome-icon icon="print" />
            <span>Imprimer les bulletins</span>
          </button>
        </div>
        
        <ReportCardView />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AssessmentManager from '@/components/assessments/AssessmentManager.vue'
import GradeManager from '@/components/assessments/GradeManager.vue'
import ReportCardView from '@/components/assessments/ReportCardView.vue'

const activeTab = ref('assessments')
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
