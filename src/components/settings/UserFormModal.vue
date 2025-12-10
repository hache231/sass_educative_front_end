<template>
  <BaseFormModal
    :title="user ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'"
    :subtitle="user ? 'Mettez à jour les informations de l\'utilisateur' : 'Créez un nouveau compte utilisateur'"
    icon="user-plus"
    icon-bg-class="bg-teal-500 text-white"
    size="lg"
    :loading="loading"
    :error="error"
    :field-errors="fieldErrors"
    :is-edit="!!user"
    submit-label="Enregistrer"
    submit-icon="save"
    @close="$emit('close')"
    @submit="handleSubmit"
  >
    <template #default>
      <div class="space-y-6">
        <!-- Nom et Prénom -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="user-first-name" class="label">
              Prénom <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="user-first-name"
              v-model="form.first_name"
              class="input"
              :class="{ 'input-error': fieldErrors.first_name }"
              required
              placeholder="Prénom"
            />
            <p v-if="fieldErrors.first_name" class="form-error">{{ fieldErrors.first_name }}</p>
          </div>
          
          <div class="form-group">
            <label for="user-last-name" class="label">
              Nom <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="user-last-name"
              v-model="form.last_name"
              class="input"
              :class="{ 'input-error': fieldErrors.last_name }"
              required
              placeholder="Nom"
            />
            <p v-if="fieldErrors.last_name" class="form-error">{{ fieldErrors.last_name }}</p>
          </div>
        </div>
        
        <!-- Username -->
        <div class="form-group">
          <label for="user-username" class="label">
            Nom d'utilisateur <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="user-username"
            v-model="form.username"
            class="input"
            :class="{ 'input-error': fieldErrors.username }"
            required
            :disabled="!!user"
            placeholder="username"
          />
          <p v-if="fieldErrors.username" class="form-error">{{ fieldErrors.username }}</p>
          <p v-else-if="user" class="form-hint">Le nom d'utilisateur ne peut pas être modifié</p>
        </div>
        
        <!-- Email -->
        <div class="form-group">
          <label for="user-email" class="label">
            Email <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <font-awesome-icon icon="envelope" class="text-slate-400" />
            </div>
            <input
              type="email"
              id="user-email"
              v-model="form.email"
              class="input pl-12"
              :class="{ 'input-error': fieldErrors.email }"
              required
              placeholder="email@exemple.com"
            />
          </div>
          <p v-if="fieldErrors.email" class="form-error">{{ fieldErrors.email }}</p>
        </div>
        
        <!-- Téléphone -->
        <div class="form-group">
          <label for="user-phone" class="label">Téléphone</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <font-awesome-icon icon="phone" class="text-slate-400" />
            </div>
            <input
              type="tel"
              id="user-phone"
              v-model="form.phone"
              class="input pl-12"
              :class="{ 'input-error': fieldErrors.phone }"
              placeholder="+33 6 12 34 56 78"
            />
          </div>
          <p v-if="fieldErrors.phone" class="form-error">{{ fieldErrors.phone }}</p>
        </div>
        
        <!-- Mot de passe (seulement pour nouveau utilisateur) -->
        <div v-if="!user" class="form-group">
          <label for="user-password" class="label">
            Mot de passe <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <font-awesome-icon icon="lock" class="text-slate-400" />
            </div>
            <input
              :type="showPassword ? 'text' : 'password'"
              id="user-password"
              v-model="form.password"
              class="input pl-12 pr-12"
              :class="{ 'input-error': fieldErrors.password }"
              required
              minlength="8"
              placeholder="Minimum 8 caractères"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
            >
              <font-awesome-icon :icon="showPassword ? 'eye' : 'eye-slash'" />
            </button>
          </div>
          <p v-if="fieldErrors.password" class="form-error">{{ fieldErrors.password }}</p>
          <p v-else class="form-hint">Minimum 8 caractères avec lettres et chiffres</p>
        </div>
        
        <!-- Rôles (seulement pour nouveau utilisateur) -->
        <div v-if="!user" class="form-group">
          <label class="label">
            Rôles
            <span class="text-slate-400 text-sm font-normal ml-2">
              ({{ form.roles_ids.length }} sélectionné{{ form.roles_ids.length > 1 ? 's' : '' }})
            </span>
          </label>
          <div v-if="availableRoles.length === 0" class="text-slate-400 text-sm p-3 bg-slate-50 rounded-lg">
            Aucun rôle disponible. Créez d'abord des rôles.
          </div>
          <div v-else class="space-y-2 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div
              v-for="role in availableRoles"
              :key="role.id"
              class="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <input
                type="checkbox"
                :id="`role-${role.id}`"
                :value="role.id"
                v-model="form.roles_ids"
                class="mt-1 w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <label :for="`role-${role.id}`" class="flex-1 cursor-pointer">
                <span class="text-sm font-medium text-slate-800">{{ role.name }}</span>
                <p v-if="role.description" class="text-xs text-slate-500 mt-0.5">{{ role.description }}</p>
              </label>
            </div>
          </div>
          <p class="form-hint">Sélectionnez un ou plusieurs rôles à attribuer à cet utilisateur</p>
        </div>
        
        <!-- Statut -->
        <div class="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <input
            type="checkbox"
            id="user-active"
            v-model="form.is_active"
            class="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <label for="user-active" class="flex-1 cursor-pointer">
            <span class="text-sm font-medium text-slate-800">Compte actif</span>
            <p class="text-xs text-slate-500 mt-0.5">
              Les comptes inactifs ne peuvent pas se connecter
            </p>
          </label>
        </div>
      </div>
    </template>
  </BaseFormModal>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import BaseFormModal from '@/components/common/BaseFormModal.vue'

const props = defineProps({
  user: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const settingsStore = useSettingsStore()
const loading = ref(false)
const error = ref('')
const fieldErrors = ref({})
const showPassword = ref(false)

const form = reactive({
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  phone: '',
  password: '',
  roles_ids: [],
  is_active: true
})

const availableRoles = computed(() => {
  if (!Array.isArray(settingsStore.roles)) {
    return []
  }
  return settingsStore.roles.filter(r => r && r.is_active)
})

onMounted(async () => {
  if (settingsStore.roles.length === 0) {
    await settingsStore.fetchRoles()
  }
})

watch(() => props.user, (newUser) => {
  if (newUser) {
    form.first_name = newUser.first_name || ''
    form.last_name = newUser.last_name || ''
    form.username = newUser.username || ''
    form.email = newUser.email || ''
    form.phone = newUser.phone || ''
    form.is_active = newUser.is_active !== false
    form.password = ''
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.first_name = ''
  form.last_name = ''
  form.username = ''
  form.email = ''
  form.phone = ''
  form.password = ''
  form.roles_ids = []
  form.is_active = true
  error.value = ''
  fieldErrors.value = {}
  showPassword.value = false
}

async function handleSubmit() {
  if (!form.first_name.trim() || !form.last_name.trim() || !form.username.trim() || !form.email.trim()) {
    error.value = 'Tous les champs obligatoires doivent être remplis'
    return
  }
  
  if (!props.user && !form.password) {
    error.value = 'Le mot de passe est requis pour un nouvel utilisateur'
    fieldErrors.value = { password: 'Ce champ est obligatoire' }
    return
  }
  
  loading.value = true
  error.value = ''
  fieldErrors.value = {}
  
  try {
    const data = { ...form }
    if (props.user && !data.password) {
      delete data.password
    }
    
    // Pour la création, inclure les roles_ids si sélectionnés
    if (!props.user && data.roles_ids && data.roles_ids.length > 0) {
      // Les roles_ids seront traités par le backend
    } else if (props.user) {
      // Pour la modification, ne pas envoyer les roles_ids (gérés séparément)
      delete data.roles_ids
    }
    
    if (props.user) {
      await settingsStore.updateUser(props.user.id, data)
    } else {
      await settingsStore.createUser(data)
      // Recharger les user-roles pour afficher les rôles assignés
      await settingsStore.fetchUserRoles()
    }
    await settingsStore.fetchUsers()
    emit('saved')
  } catch (err) {
    const errorData = err.response?.data
    if (typeof errorData === 'object' && !errorData.detail) {
      fieldErrors.value = {}
      const messages = []
      for (const [field, msgs] of Object.entries(errorData)) {
        if (Array.isArray(msgs)) {
          fieldErrors.value[field] = msgs[0]
          messages.push(`${field}: ${msgs.join(', ')}`)
        } else if (msgs) {
          fieldErrors.value[field] = msgs
          messages.push(`${field}: ${msgs}`)
        }
      }
      error.value = messages.length > 0 ? messages.join(' | ') : 'Erreur lors de la sauvegarde'
    } else {
      error.value = errorData?.detail || 'Erreur lors de la sauvegarde'
    }
  } finally {
    loading.value = false
  }
}
</script>
