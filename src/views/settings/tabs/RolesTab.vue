<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-slate-800">Gestion des Rôles</h2>
        <p class="text-sm text-slate-500">Définissez les rôles et leurs permissions d'accès</p>
      </div>
      <button @click="createNewRole" class="btn btn-primary">
        <font-awesome-icon icon="plus" />
        <span>Nouveau rôle</span>
      </button>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="stat-card stat-card-teal">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-teal">
            <font-awesome-icon icon="user-shield" class="text-lg" />
          </div>
        </div>
        <p class="stat-value text-2xl">{{ filteredRoles.length }}</p>
        <p class="stat-label">Rôles définis</p>
      </div>
      <div class="stat-card stat-card-amber">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-amber">
            <font-awesome-icon icon="check-circle" class="text-lg" />
          </div>
        </div>
        <p class="stat-value text-2xl">{{ activeRolesCount }}</p>
        <p class="stat-label">Rôles actifs</p>
      </div>
      <div class="stat-card stat-card-purple">
        <div class="flex items-start justify-between mb-3">
          <div class="stat-icon stat-icon-purple">
            <font-awesome-icon icon="key" class="text-lg" />
          </div>
        </div>
        <p class="stat-value text-2xl">{{ totalPermissionsCount }}</p>
        <p class="stat-label">Permissions totales</p>
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
              placeholder="Nom, description..."
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
        <div class="flex items-end">
          <button @click="clearFilters" class="btn btn-ghost w-full">
            <font-awesome-icon icon="times" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Roles Table -->
    <div class="card p-0 overflow-hidden">
      <div v-if="settingsStore.loading" class="flex items-center justify-center py-20">
        <div class="spinner spinner-lg"></div>
      </div>
      
      <div v-else-if="filteredRoles.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <font-awesome-icon icon="user-shield" class="text-3xl" />
        </div>
        <p class="empty-state-title">
          {{ hasFilters ? 'Aucun résultat' : 'Aucun rôle' }}
        </p>
        <p class="empty-state-text">
          {{ hasFilters 
            ? 'Aucun rôle ne correspond à vos critères.' 
            : 'Créez votre premier rôle pour commencer.' 
          }}
        </p>
        <button v-if="!hasFilters" @click="createNewRole" class="btn btn-primary mt-4">
          <font-awesome-icon icon="plus" />
          <span>Créer un rôle</span>
        </button>
      </div>
      
      <div v-else class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Rôle</th>
              <th>Description</th>
              <th>Permissions</th>
              <th>Utilisateurs</th>
              <th>Statut</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(role, index) in filteredRoles" 
              :key="role?.id || index"
              class="animate-fade-in"
              :style="{ animationDelay: `${index * 0.03}s` }"
            >
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-100 to-teal-200 
                              text-teal-600 flex items-center justify-center">
                    <font-awesome-icon icon="user-shield" />
                  </div>
                  <span class="font-semibold text-slate-800">{{ role.name }}</span>
                </div>
              </td>
              <td class="text-slate-600">
                {{ role.description || '-' }}
              </td>
              <td>
                <span class="badge badge-info">
                  {{ role.permissions?.length || 0 }} permission(s)
                </span>
              </td>
              <td>
                <span class="badge badge-secondary">
                  {{ role.user_count || 0 }} utilisateur(s)
                </span>
              </td>
              <td>
                <span :class="[
                  'badge',
                  role.is_active ? 'badge-success' : 'badge-danger'
                ]">
                  <span :class="[
                    'badge-dot',
                    role.is_active ? 'bg-emerald-500' : 'bg-red-500'
                  ]"></span>
                  {{ role.is_active ? 'Actif' : 'Inactif' }}
                </span>
              </td>
              <td>
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="editRole(role)"
                    class="action-btn action-btn-edit"
                    title="Modifier"
                  >
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button
                    @click="viewRoleUsers(role)"
                    class="action-btn action-btn-view"
                    title="Voir les utilisateurs"
                  >
                    <font-awesome-icon icon="users" />
                  </button>
                  <button
                    @click="deleteRoleConfirm(role)"
                    class="action-btn action-btn-delete"
                    title="Supprimer"
                  >
                    <font-awesome-icon icon="trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Footer -->
      <div v-if="filteredRoles.length > 0" class="px-5 py-4 border-t border-slate-100 bg-slate-50/50">
        <p class="text-sm text-slate-600">
          {{ filteredRoles.length }} rôle(s) affiché(s)
        </p>
      </div>
    </div>
    
    <!-- Modals -->
    <RoleFormModal
      v-if="showRoleModal"
      :role="selectedRole"
      @close="closeRoleModal"
      @saved="handleRoleSaved"
    />
    
    <RoleUsersModal
      v-if="showRoleUsersModal"
      :role="selectedRoleForUsers"
      @close="closeRoleUsersModal"
      @updated="handleRoleUsersUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import RoleFormModal from '@/components/settings/RoleFormModal.vue'
import RoleUsersModal from '@/components/settings/RoleUsersModal.vue'

const settingsStore = useSettingsStore()
const showRoleModal = ref(false)
const selectedRole = ref(null)
const showRoleUsersModal = ref(false)
const selectedRoleForUsers = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')

const hasFilters = computed(() => searchQuery.value || statusFilter.value)

const filteredRoles = computed(() => {
  let rolesList = Array.isArray(settingsStore.roles) 
    ? settingsStore.roles.filter(r => r !== null && r !== undefined)
    : []
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    rolesList = rolesList.filter(role => 
      role && (
        (role.name && role.name.toLowerCase().includes(query)) ||
        (role.description && role.description.toLowerCase().includes(query))
      )
    )
  }
  
  if (statusFilter.value) {
    if (statusFilter.value === 'active') {
      rolesList = rolesList.filter(role => role && role.is_active)
    } else if (statusFilter.value === 'inactive') {
      rolesList = rolesList.filter(role => role && !role.is_active)
    }
  }
  
  return rolesList
})

const activeRolesCount = computed(() => {
  return filteredRoles.value.filter(r => r && r.is_active).length
})

const totalPermissionsCount = computed(() => {
  return settingsStore.permissions?.length || 0
})

function createNewRole() {
  selectedRole.value = null
  showRoleModal.value = true
}

function editRole(role) {
  if (!role || !role.id) return
  selectedRole.value = role
  showRoleModal.value = true
}

async function deleteRoleConfirm(role) {
  if (!role || !role.id || !role.name) return
  if (confirm(`Supprimer le rôle "${role.name}" ?`)) {
    try {
      await settingsStore.deleteRole(role.id)
      await settingsStore.fetchRoles()
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }
}

function closeRoleModal() {
  showRoleModal.value = false
  selectedRole.value = null
}

async function handleRoleSaved() {
  await settingsStore.fetchRoles()
  closeRoleModal()
}

function viewRoleUsers(role) {
  if (!role || !role.id) return
  selectedRoleForUsers.value = role
  showRoleUsersModal.value = true
}

function closeRoleUsersModal() {
  showRoleUsersModal.value = false
  selectedRoleForUsers.value = null
}

function handleRoleUsersUpdated() {
  settingsStore.fetchRoles()
}

function clearFilters() {
  searchQuery.value = ''
  statusFilter.value = ''
}

onMounted(() => {
  settingsStore.fetchRoles()
})
</script>
