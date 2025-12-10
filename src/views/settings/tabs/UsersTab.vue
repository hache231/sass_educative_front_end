<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Gestion des Utilisateurs</h2>
        <p class="text-sm text-slate-500">Administrez les comptes utilisateurs et leurs rôles</p>
      </div>
      <button @click="openUserModal" class="btn btn-primary">
        <font-awesome-icon icon="user-plus" />
        <span>Nouvel utilisateur</span>
      </button>
    </div>
    
    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="stat-card stat-card-teal">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-teal">
            <font-awesome-icon icon="users" class="text-lg" />
          </div>
        </div>
        <p class="stat-value text-2xl">{{ filteredUsers.length }}</p>
        <p class="stat-label">Utilisateurs</p>
      </div>
      <div class="stat-card stat-card-amber">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-amber">
            <font-awesome-icon icon="check-circle" class="text-lg" />
          </div>
        </div>
        <p class="stat-value text-2xl">{{ activeUsersCount }}</p>
        <p class="stat-label">Actifs</p>
      </div>
      <div class="stat-card stat-card-purple">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-purple">
            <font-awesome-icon icon="user-shield" class="text-lg" />
          </div>
        </div>
        <p class="stat-value text-2xl">{{ usersWithRolesCount }}</p>
        <p class="stat-label">Avec rôles</p>
      </div>
    </div>
    
    <!-- Filters -->
    <div class="filter-bar">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-2">
          <label class="label">Rechercher</label>
          <div class="search-input">
            <font-awesome-icon icon="search" class="search-input-icon" />
            <input
              type="text"
              placeholder="Nom, email, username..."
              v-model="searchQuery"
            />
          </div>
        </div>
        <div>
          <label class="label">Statut</label>
          <select class="select" v-model="statusFilter">
            <option value="">Tous les statuts</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </div>
        <div>
          <label class="label">Rôle</label>
          <select class="select" v-model="roleFilter">
            <option value="">Tous les rôles</option>
            <option
              v-for="role in settingsStore.activeRoles"
              :key="role?.id"
              :value="role?.id"
            >
              {{ role?.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button @click="clearFilters" class="btn btn-ghost">
          <font-awesome-icon icon="times" />
          <span>Réinitialiser</span>
        </button>
      </div>
    </div>
    
    <!-- Users Table -->
    <div class="card p-0 overflow-hidden">
      <div v-if="settingsStore.loading" class="flex items-center justify-center py-20">
        <div class="spinner spinner-lg"></div>
      </div>
      
      <div v-else-if="filteredUsers.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <font-awesome-icon icon="users" class="text-3xl" />
        </div>
        <p class="empty-state-title">
          {{ hasFilters ? 'Aucun résultat' : 'Aucun utilisateur' }}
        </p>
        <p class="empty-state-text">
          {{ hasFilters 
            ? 'Aucun utilisateur ne correspond aux critères.' 
            : 'Créez votre premier utilisateur pour commencer.' 
          }}
        </p>
        <button v-if="!hasFilters" @click="showUserModal = true" class="btn btn-primary mt-4">
          <font-awesome-icon icon="user-plus" />
          <span>Créer un utilisateur</span>
        </button>
      </div>
      
      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Email</th>
              <th>Username</th>
              <th>Rôles</th>
              <th>Statut</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(user, index) in filteredUsers" 
              :key="user.id"
              class="animate-fade-in"
              :style="{ animationDelay: `${index * 0.03}s` }"
            >
              <td>
                <div class="flex items-center gap-3">
                  <div class="avatar avatar-md">
                    <div class="avatar-placeholder bg-gradient-to-br from-amber-400 to-amber-600">
                      {{ getInitials(user) }}
                    </div>
                  </div>
                  <span class="font-medium text-slate-800">
                    {{ user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username }}
                  </span>
                </div>
              </td>
              <td class="text-slate-600">{{ user.email }}</td>
              <td>
                <span class="badge badge-secondary font-mono">{{ user.username }}</span>
              </td>
              <td>
                <div class="flex items-center gap-2 flex-wrap">
                  <span
                    v-for="roleId in getUserRoles(user.id)"
                    :key="roleId"
                    class="badge badge-primary"
                  >
                    {{ getRoleName(roleId) }}
                  </span>
                  <span v-if="getUserRoles(user.id).length === 0" class="text-slate-400 text-sm">
                    Aucun rôle
                  </span>
                  <UserRoleAssignment :user="user" @updated="handleUserRolesUpdated" />
                </div>
              </td>
              <td>
                <span :class="[
                  'badge',
                  user.is_active ? 'badge-success' : 'badge-danger'
                ]">
                  <span :class="[
                    'badge-dot',
                    user.is_active ? 'bg-emerald-500' : 'bg-red-500'
                  ]"></span>
                  {{ user.is_active ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td>
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="editUser(user)"
                    class="action-btn action-btn-edit"
                    title="Modifier"
                  >
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button
                    @click="toggleActive(user)"
                    class="action-btn"
                    :class="user.is_active ? 'action-btn-warning' : 'action-btn-success'"
                    :title="user.is_active ? 'Désactiver' : 'Activer'"
                  >
                    <font-awesome-icon :icon="user.is_active ? 'times-circle' : 'check'" />
                  </button>
                  <button
                    @click="resetPassword(user)"
                    class="action-btn action-btn-view"
                    title="Réinitialiser mot de passe"
                  >
                    <font-awesome-icon icon="key" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Footer -->
      <div v-if="filteredUsers.length > 0" class="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
        <p class="text-sm text-slate-600">
          {{ filteredUsers.length }} utilisateur(s) affiché(s)
        </p>
      </div>
    </div>
    
    <!-- Modal -->
    <UserFormModal
      v-if="showUserModal"
      :user="selectedUser"
      @close="closeUserModal"
      @saved="handleUserSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import * as settingsApi from '@/api/settings'
import UserFormModal from '@/components/settings/UserFormModal.vue'
import UserRoleAssignment from '@/components/settings/UserRoleAssignment.vue'

const settingsStore = useSettingsStore()
const showUserModal = ref(false)
const selectedUser = ref(null)
const userRolesMap = ref({})
const searchQuery = ref('')
const statusFilter = ref('')
const roleFilter = ref('')

const hasFilters = computed(() => searchQuery.value || statusFilter.value || roleFilter.value)

const filteredUsers = computed(() => {
  let usersList = Array.isArray(settingsStore.users) 
    ? settingsStore.users.filter(u => u !== null && u !== undefined)
    : []
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    usersList = usersList.filter(user => 
      user && (
        (user.full_name && user.full_name.toLowerCase().includes(query)) ||
        (user.first_name && user.first_name.toLowerCase().includes(query)) ||
        (user.last_name && user.last_name.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.username && user.username.toLowerCase().includes(query))
      )
    )
  }
  
  if (statusFilter.value) {
    if (statusFilter.value === 'active') {
      usersList = usersList.filter(user => user && user.is_active)
    } else if (statusFilter.value === 'inactive') {
      usersList = usersList.filter(user => user && !user.is_active)
    }
  }
  
  if (roleFilter.value) {
    const roleId = parseInt(roleFilter.value)
    usersList = usersList.filter(user => {
      if (!user || !user.id) return false
      const userRoles = getUserRoles(user.id)
      return userRoles.includes(roleId)
    })
  }
  
  return usersList
})

const activeUsersCount = computed(() => {
  return filteredUsers.value.filter(u => u && u.is_active).length
})

const usersWithRolesCount = computed(() => {
  return filteredUsers.value.filter(u => {
    const roles = getUserRoles(u.id)
    return roles.length > 0
  }).length
})

onMounted(async () => {
  await Promise.all([
    settingsStore.fetchUsers(),
    settingsStore.fetchRoles(),
    loadUserRoles()
  ])
})

// Debug function to test modal
function openUserModal() {
  selectedUser.value = null
  showUserModal.value = true
}

async function loadUserRoles() {
  try {
    const response = await settingsApi.getUserRoles()
    let userRolesList = []
    if (Array.isArray(response.data)) {
      userRolesList = response.data
    } else if (response.data?.results) {
      userRolesList = response.data.results
    }
    
    const map = {}
    userRolesList.forEach(userRole => {
      if (userRole && userRole.user) {
        if (!map[userRole.user]) {
          map[userRole.user] = []
        }
        if (userRole.role) {
          map[userRole.user].push(userRole.role)
        }
      }
    })
    userRolesMap.value = map
  } catch (error) {
    console.error('Error loading user roles:', error)
    userRolesMap.value = {}
  }
}

function getUserRoles(userId) {
  return userRolesMap.value[userId] || []
}

function getRoleName(roleId) {
  const role = settingsStore.roles?.find(r => r && r.id === roleId)
  return role ? role.name : 'Rôle inconnu'
}

function getInitials(user) {
  if (user.full_name) {
    const parts = user.full_name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return user.full_name.substring(0, 2).toUpperCase()
  }
  if (user.first_name && user.last_name) {
    return (user.first_name[0] + user.last_name[0]).toUpperCase()
  }
  return (user.username || 'U').substring(0, 2).toUpperCase()
}

function handleUserRolesUpdated() {
  loadUserRoles()
}

function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
  roleFilter.value = ''
}

function editUser(user) {
  if (!user || !user.id) return
  selectedUser.value = user
  showUserModal.value = true
}

async function toggleActive(user) {
  if (!user || !user.id) return
  if (confirm(`${user.is_active ? 'Désactiver' : 'Activer'} cet utilisateur ?`)) {
    try {
      await settingsStore.toggleUserActive(user.id)
      await settingsStore.fetchUsers()
    } catch (error) {
      alert('Erreur lors de la modification')
    }
  }
}

async function resetPassword(user) {
  if (!user || !user.id) return
  const userName = user.full_name || user.username || 'cet utilisateur'
  if (confirm(`Réinitialiser le mot de passe de ${userName} ?`)) {
    try {
      const result = await settingsStore.resetUserPassword(user.id)
      alert(`Mot de passe réinitialisé. Nouveau mot de passe: ${result.new_password}`)
    } catch (error) {
      alert('Erreur lors de la réinitialisation')
    }
  }
}

function closeUserModal() {
  showUserModal.value = false
  selectedUser.value = null
}

async function handleUserSaved() {
  await Promise.all([
    settingsStore.fetchUsers(),
    loadUserRoles()  // Recharger les rôles utilisateurs pour afficher les nouveaux rôles assignés
  ])
  closeUserModal()
}
</script>
