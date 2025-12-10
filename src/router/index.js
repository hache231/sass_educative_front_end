/**
 * Configuration du routeur Vue.
 * 
 * Définit toutes les routes de l'application avec leurs guards d'authentification.
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/DashboardView.vue')
      },
      {
        path: 'students',
        name: 'Students',
        component: () => import('@/views/students/StudentsView.vue')
      },
      {
        path: 'teachers',
        name: 'Teachers',
        component: () => import('@/views/teachers/TeachersView.vue')
      },
      {
        path: 'academics',
        name: 'Academics',
        component: () => import('@/views/academics/AcademicsView.vue')
      },
      {
        path: 'assessments',
        name: 'Assessments',
        component: () => import('@/views/assessments/AssessmentsView.vue')
      },
      {
        path: 'schedules',
        name: 'Schedules',
        component: () => import('@/views/schedules/SchedulesView.vue')
      },
      {
        path: 'finance',
        name: 'Finance',
        component: () => import('@/views/finance/FinanceView.vue')
      },
      {
        path: 'communications',
        name: 'Communications',
        component: () => import('@/views/communications/CommunicationsView.vue')
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/reports/ReportsView.vue')
      },
      {
        path: 'documents',
        name: 'Documents',
        component: () => import('@/views/documents/DocumentsView.vue')
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/SettingsView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard d'authentification
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.name === 'Login' && authStore.isAuthenticated) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router

