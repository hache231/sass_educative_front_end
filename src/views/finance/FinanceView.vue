<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Stats Overview -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-start justify-between mb-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300">
            <font-awesome-icon icon="wallet" class="text-xl text-white" />
          </div>
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <font-awesome-icon icon="arrow-up" class="text-[10px]" />
            <span>+8%</span>
          </div>
        </div>
        <p class="text-3xl font-bold text-slate-800 mb-1">0 €</p>
        <p class="text-sm text-slate-500 font-medium">Revenus totaux</p>
        <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-100/50 to-transparent rounded-tl-full opacity-50"></div>
      </div>
      
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-start justify-between mb-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
            <font-awesome-icon icon="clock" class="text-xl text-white" />
          </div>
        </div>
        <p class="text-3xl font-bold text-slate-800 mb-1">0 €</p>
        <p class="text-sm text-slate-500 font-medium">En attente</p>
        <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-100/50 to-transparent rounded-tl-full opacity-50"></div>
      </div>
      
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-start justify-between mb-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform duration-300">
            <font-awesome-icon icon="check-circle" class="text-xl text-white" />
          </div>
        </div>
        <p class="text-3xl font-bold text-slate-800 mb-1">0 €</p>
        <p class="text-sm text-slate-500 font-medium">Paiements reçus</p>
        <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-sky-100/50 to-transparent rounded-tl-full opacity-50"></div>
      </div>
      
      <div class="group relative overflow-hidden bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 hover:shadow-lg transition-all duration-300">
        <div class="flex items-start justify-between mb-4">
          <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
            <font-awesome-icon icon="exclamation-triangle" class="text-xl text-white" />
          </div>
        </div>
        <p class="text-3xl font-bold text-slate-800 mb-1">0</p>
        <p class="text-sm text-slate-500 font-medium">Impayés</p>
        <div class="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-100/50 to-transparent rounded-tl-full opacity-50"></div>
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
      <div class="group card hover:shadow-xl hover:border-teal-200 transition-all duration-300 cursor-pointer">
        <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform duration-300">
          <font-awesome-icon icon="file-invoice-dollar" class="text-xl" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2 group-hover:text-teal-600 transition-colors">Facturation</h3>
        <p class="text-sm text-slate-600">
          Créez et envoyez des factures automatiquement aux parents et tuteurs.
        </p>
      </div>
      
      <div class="group card hover:shadow-xl hover:border-amber-200 transition-all duration-300 cursor-pointer">
        <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
          <font-awesome-icon icon="credit-card" class="text-xl" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2 group-hover:text-amber-600 transition-colors">Paiements en ligne</h3>
        <p class="text-sm text-slate-600">
          Acceptez les paiements en ligne de manière sécurisée et pratique.
        </p>
      </div>
      
      <div class="group card hover:shadow-xl hover:border-purple-200 transition-all duration-300 cursor-pointer">
        <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
          <font-awesome-icon icon="chart-pie" class="text-xl" />
        </div>
        <h3 class="text-lg font-semibold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">Analyses</h3>
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
