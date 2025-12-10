/**
 * Configuration du routeur Vue.
 * 
 * Définit toutes les routes de l'application avec leurs guards d'authentification
 * et de permissions.
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermissions } from '@/composables/usePermissions'
import { ROUTE_PERMISSIONS } from '@/constants/permissions'

// Générer les routes à partir des constantes
// L'ordre est important : Dashboard doit être en premier (path: '')
const generateRoutes = () => {
  const routeMap = {
    'Dashboard': { path: '', component: () => import('@/views/DashboardView.vue') },
    'Students': { path: 'students', component: () => import('@/views/students/StudentsView.vue') },
    'Teachers': { path: 'teachers', component: () => import('@/views/teachers/TeachersView.vue') },
    'Academics': { path: 'academics', component: () => import('@/views/academics/AcademicsView.vue') },
    'Assessments': { path: 'assessments', component: () => import('@/views/assessments/AssessmentsView.vue') },
    'Schedules': { path: 'schedules', component: () => import('@/views/schedules/SchedulesView.vue') },
    'Finance': { path: 'finance', component: () => import('@/views/finance/FinanceView.vue') },
    'Communications': { path: 'communications', component: () => import('@/views/communications/CommunicationsView.vue') },
    'Reports': { path: 'reports', component: () => import('@/views/reports/ReportsView.vue') },
    'Documents': { path: 'documents', component: () => import('@/views/documents/DocumentsView.vue') },
    'Settings': { path: 'settings', component: () => import('@/views/settings/SettingsView.vue') },
  }

  // Garantir l'ordre : Dashboard en premier, puis les autres dans l'ordre des clés
  const orderedNames = Object.keys(ROUTE_PERMISSIONS)
  return orderedNames.map(name => ({
    path: routeMap[name].path,
    name,
    component: routeMap[name].component,
    meta: { permission: ROUTE_PERMISSIONS[name] }
  }))
}

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: generateRoutes()
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guards d'authentification et de permissions
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Vérifier l'authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
    return
  }
  
  // Si l'utilisateur est sur la page de login et est déjà authentifié, rediriger vers le dashboard
  if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }
  
  // Vérifier les permissions pour les routes protégées
  if (to.meta.requiresAuth && authStore.isAuthenticated) {
    // S'assurer que les données utilisateur sont chargées
    if (!authStore.currentUser || !authStore.currentUser.permissions) {
      try {
        await authStore.fetchUser()
      } catch (error) {
        // Log structuré de l'erreur
        const errorMessage = error.response?.data?.detail || error.message || 'Erreur inconnue'
        const errorStatus = error.response?.status
        
        // Log pour le développement (sera supprimé en production par les outils de build)
        if (import.meta.env.DEV) {
          console.error('[Router] Erreur lors du chargement des permissions:', {
            path: to.path,
            error: errorMessage,
            status: errorStatus,
            errorObject: error
          })
        }
        
        // Si l'erreur est 401 (non autorisé), rediriger vers login
        // Sinon, on peut essayer de continuer ou afficher une notification
        if (errorStatus === 401 || errorStatus === 403) {
          next({ name: 'Login' })
          return
        }
        
        // Pour les autres erreurs, on redirige quand même vers login par sécurité
        // mais on pourrait aussi rediriger vers dashboard avec un message d'erreur
        next({ name: 'Login' })
        return
      }
    }
    
    // Vérifier la permission requise pour cette route
    const { canAccessRoute, hasPermission, hasAnyPermission } = usePermissions()
    
    // Vérifier d'abord si une permission est définie dans meta.permission
    if (to.meta.permission) {
      const requiredPermission = to.meta.permission
      let hasAccess = false
      
      if (Array.isArray(requiredPermission)) {
        hasAccess = hasAnyPermission(requiredPermission)
      } else {
        hasAccess = hasPermission(requiredPermission)
      }
      
      if (!hasAccess) {
        // L'utilisateur n'a pas la permission, rediriger vers le dashboard
        next({ name: 'Dashboard' })
        return
      }
    } else {
      // Sinon, utiliser le mapping par nom de route
      const routeName = to.name
      if (routeName && !canAccessRoute(routeName)) {
        // L'utilisateur n'a pas la permission, rediriger vers le dashboard
        next({ name: 'Dashboard' })
        return
      }
    }
  }
  
  next()
})

export default router

