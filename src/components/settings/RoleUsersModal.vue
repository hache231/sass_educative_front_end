<template>
  <div
    class="modal fade show"
    style="display: block; background-color: rgba(0,0,0,0.5);"
    tabindex="-1"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            Utilisateurs avec le rôle "{{ role?.name }}"
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Chargement...</span>
            </div>
          </div>
          
          <div v-else-if="users.length === 0" class="text-center py-5 text-muted">
            <p>Aucun utilisateur n'a ce rôle.</p>
          </div>
          
          <div v-else class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Assigné le</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="userRole in users" :key="userRole.id">
                  <td>{{ userRole.user_full_name || userRole.user_username }}</td>
                  <td>{{ getUserEmail(userRole.user) }}</td>
                  <td>{{ userRole.user_username }}</td>
                  <td>{{ formatDate(userRole.assigned_at) }}</td>
                  <td>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      @click="removeRole(userRole)"
                      title="Retirer ce rôle"
                    >
                      <font-awesome-icon icon="trash" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-if="error" class="alert alert-danger mt-3" role="alert">
            {{ error }}
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">
            Fermer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import * as settingsApi from '@/api/settings'

const props = defineProps({
  role: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const settingsStore = useSettingsStore()
const loading = ref(false)
const error = ref('')
const users = ref([])

onMounted(async () => {
  await loadUsers()
})

async function loadUsers() {
  loading.value = true
  error.value = ''
  
  try {
    const response = await settingsApi.getRoleUsers(props.role.id)
    
    // Gérer la pagination si elle est activée (response.data.results)
    // ou utiliser directement response.data si c'est un tableau
    if (Array.isArray(response.data)) {
      users.value = response.data
    } else if (response.data && Array.isArray(response.data.results)) {
      users.value = response.data.results
    } else if (response.data && typeof response.data === 'object') {
      // Si c'est un objet, essayer de trouver un tableau dedans
      users.value = Object.values(response.data).find(val => Array.isArray(val)) || []
    } else {
      users.value = []
    }
  } catch (err) {
    error.value = 'Erreur lors du chargement des utilisateurs'
    console.error('Erreur loadUsers:', err)
    console.error('Response data:', err.response?.data)
    users.value = []
  } finally {
    loading.value = false
  }
}

async function removeRole(userRole) {
  if (!confirm(`Retirer le rôle "${props.role.name}" de ${userRole.user_full_name || userRole.user_username} ?`)) {
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    await settingsApi.removeUserRole(userRole.id)
    users.value = users.value.filter(ur => ur.id !== userRole.id)
    emit('updated')
  } catch (err) {
    error.value = err.response?.data?.detail || 'Erreur lors du retrait du rôle'
  } finally {
    loading.value = false
  }
}

function getUserEmail(userId) {
  if (!userId) return '-'
  // Trouver l'email dans la liste des utilisateurs
  if (!Array.isArray(settingsStore.users)) return '-'
  const user = settingsStore.users.find(u => u && u.id === userId)
  return user?.email || '-'
}

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}
</script>

<style scoped>
.modal {
  z-index: 1050;
}
</style>

