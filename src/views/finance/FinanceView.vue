<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="stat-card stat-card-teal">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-teal">
            <font-awesome-icon icon="wallet" class="text-lg" />
          </div>
          <span class="stat-trend stat-trend-up">
            <font-awesome-icon icon="arrow-up" class="text-xs" />
            <span>+8%</span>
          </span>
        </div>
        <p class="stat-value text-2xl">0 €</p>
        <p class="stat-label">Revenus totaux</p>
      </div>
      
      <div class="stat-card stat-card-amber">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-amber">
            <font-awesome-icon icon="clock" class="text-lg" />
          </div>
        </div>
        <p class="stat-value text-2xl">0 €</p>
        <p class="stat-label">En attente</p>
      </div>
      
      <div class="stat-card stat-card-sky">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-sky">
            <font-awesome-icon icon="check-circle" class="text-lg" />
          </div>
        </div>
        <p class="stat-value text-2xl">0 €</p>
        <p class="stat-label">Paiements reçus</p>
      </div>
      
      <div class="stat-card stat-card-purple">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-purple">
            <font-awesome-icon icon="exclamation-triangle" class="text-lg" />
          </div>
        </div>
        <p class="stat-value text-2xl">0</p>
        <p class="stat-label">Impayés</p>
      </div>
    </div>
    
    <!-- Module Coming Soon -->
    <div class="card">
      <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <!-- Background decoration -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div class="relative z-10 text-center max-w-lg mx-auto">
          <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 
                      flex items-center justify-center shadow-lg shadow-teal-500/30">
            <font-awesome-icon icon="wallet" class="text-3xl text-white" />
          </div>
          
          <h2 class="text-2xl font-bold text-slate-800 mb-3">Module Finance</h2>
          <p class="text-slate-600 mb-6">
            Le module de gestion financière est en cours de développement. 
            Vous pourrez bientôt gérer les frais de scolarité, les paiements et la comptabilité.
          </p>
          
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div class="flex items-center gap-2 text-sm text-slate-500">
              <font-awesome-icon icon="check" class="text-teal-500" />
              <span>Gestion des frais</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-500">
              <font-awesome-icon icon="check" class="text-teal-500" />
              <span>Suivi des paiements</span>
            </div>
            <div class="flex items-center gap-2 text-sm text-slate-500">
              <font-awesome-icon icon="check" class="text-teal-500" />
              <span>Rapports financiers</span>
            </div>
          </div>
          
          <div class="mt-8">
            <span class="badge badge-primary">
              <font-awesome-icon icon="clock" class="text-xs" />
              <span>Bientôt disponible</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Preview Features -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card hover:shadow-lg transition-shadow">
        <div class="w-12 h-12 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center mb-4">
          <font-awesome-icon icon="file-invoice-dollar" class="text-xl" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2">Facturation</h3>
        <p class="text-sm text-slate-600">
          Créez et envoyez des factures automatiquement aux parents et tuteurs.
        </p>
      </div>
      
      <div class="card hover:shadow-lg transition-shadow">
        <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
          <font-awesome-icon icon="credit-card" class="text-xl" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2">Paiements en ligne</h3>
        <p class="text-sm text-slate-600">
          Acceptez les paiements en ligne de manière sécurisée et pratique.
        </p>
      </div>
      
      <div class="card hover:shadow-lg transition-shadow">
        <div class="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-4">
          <font-awesome-icon icon="chart-pie" class="text-xl" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2">Analyses</h3>
        <p class="text-sm text-slate-600">
          Visualisez les tendances et générez des rapports financiers détaillés.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Module Finance - À implémenter
</script>
