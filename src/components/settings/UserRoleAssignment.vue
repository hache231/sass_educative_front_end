<template>
  <div>
    <button
      class="btn btn-sm btn-outline-primary"
      @click="showModal = true"
      :title="user ? `Gérer les rôles de ${user.full_name || user.username}` : 'Gérer les rôles'"
    >
      <font-awesome-icon icon="user" class="me-1" />
      Rôles
    </button>
    
    <!-- Modal d'assignation de rôles -->
    <div
      v-if="showModal"
      class="modal fade show"
      style="display: block; background-color: rgba(0,0,0,0.5);"
      tabindex="-1"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              Gérer les rôles de {{ user?.full_name || user?.username }}
            </h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div v-if="loading" class="text-center py-3">
              <div class="spinner-border spinner-border-sm text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>
            
            <div v-else>
              <div class="mb-3">
                <label class="form-label">Rôles disponibles</label>
                <div v-if="availableRoles.length === 0" class="text-muted">
                  Aucun rôle disponible. Créez d'abord des rôles.
                </div>
                <div v-else>
                  <div
                    v-for="role in availableRoles"
                    :key="role.id"
                    class="form-check mb-2"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :id="`role-${role.id}`"
                      :value="role.id"
                      :checked="userRoleIds.includes(role.id)"
                      @change="toggleRole(role.id, $event.target.checked)"
                    />
                    <label class="form-check-label" :for="`role-${role.id}`">
                      {{ role.name }}
                      <small v-if="role.description" class="text-muted d-block">
                        {{ role.description }}
                      </small>
                    </label>
                  </div>
                </div>
              </div>
              
              <div v-if="userRoleIds.length > 0" class="mt-3">
                <label class="form-label">Rôles assignés</label>
                <div>
                  <span
                    v-for="roleId in userRoleIds"
                    :key="roleId"
                    class="badge bg-primary me-2 mb-2"
                  >
                    {{ getRoleName(roleId) }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="error" class="alert alert-danger mt-3" role="alert">
              {{ error }}
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import * as settingsApi from '@/api/settings'

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

const settingsStore = useSettingsStore()
const showModal = ref(false)
const loading = ref(false)
const error = ref('')
const userRoleIds = ref([])
const userRoles = ref([])

const availableRoles = computed(() => {
  if (!Array.isArray(settingsStore.roles)) {
    return []
  }
  return settingsStore.roles.filter(r => r && r.is_active)
})

function getRoleName(roleId) {
  const role = availableRoles.value.find(r => r.id === roleId)
  return role ? role.name : 'Rôle inconnu'
}

async function loadUserRoles() {
  if (!props.user?.id) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await settingsApi.getUserRoles()
    
    // Gérer la pagination si elle est activée (response.data.results)
    // ou utiliser directement response.data si c'est un tableau
    let userRolesList = []
    if (Array.isArray(response.data)) {
      userRolesList = response.data
    } else if (response.data && Array.isArray(response.data.results)) {
      userRolesList = response.data.results
    } else if (response.data && typeof response.data === 'object') {
      // Si c'est un objet, essayer de trouver un tableau dedans
      userRolesList = Object.values(response.data).find(val => Array.isArray(val)) || []
    }
    
    // Filtrer les rôles de cet utilisateur
    const filteredRoles = Array.isArray(userRolesList) 
      ? userRolesList.filter(ur => ur && ur.user === props.user.id)
      : []
    
    userRoles.value = filteredRoles
    userRoleIds.value = filteredRoles.map(ur => ur.role).filter(id => id !== null && id !== undefined)
  } catch (err) {
    error.value = 'Erreur lors du chargement des rôles'
    console.error('Erreur loadUserRoles:', err)
    console.error('Response data:', err.response?.data)
    userRoles.value = []
    userRoleIds.value = []
  } finally {
    loading.value = false
  }
}

async function toggleRole(roleId, assign) {
  loading.value = true
  error.value = ''
  
  try {
    if (assign) {
      // Assigner le rôle
      const schoolId = settingsStore.settings?.school || null
      if (!schoolId) {
        throw new Error('École non trouvée')
      }
      
      await settingsApi.assignUserRole({
        user: props.user.id,
        role: roleId,
        school: schoolId
      })
      
      userRoleIds.value.push(roleId)
    } else {
      // Retirer le rôle
      const userRole = userRoles.value.find(ur => ur.role === roleId)
      if (userRole) {
        await settingsApi.removeUserRole(userRole.id)
        userRoleIds.value = userRoleIds.value.filter(id => id !== roleId)
        userRoles.value = userRoles.value.filter(ur => ur.id !== userRole.id)
      }
    }
    
    // Rafraîchir la liste des utilisateurs
    await settingsStore.fetchUsers()
    // Émettre l'événement pour mettre à jour l'affichage
    emit('updated')
  } catch (err) {
    error.value = err.response?.data?.detail || err.response?.data?.error || 'Erreur lors de la modification'
    // Annuler le changement visuel
    if (assign) {
      userRoleIds.value = userRoleIds.value.filter(id => id !== roleId)
    } else {
      userRoleIds.value.push(roleId)
    }
  } finally {
    loading.value = false
  }
}

function closeModal() {
  showModal.value = false
  error.value = ''
}

watch(() => showModal.value, (newValue) => {
  if (newValue) {
    loadUserRoles()
  }
})
</script>

<style scoped>
.modal {
  z-index: 1050;
}
</style>

