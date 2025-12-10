<template>
  <BaseFormModal
    :title="role ? 'Modifier le rôle' : 'Créer un nouveau rôle'"
    :subtitle="role ? 'Mettez à jour les informations du rôle' : 'Définissez un nouveau rôle avec ses permissions'"
    icon="user-shield"
    icon-bg-class="bg-purple-500 text-white"
    size="lg"
    :loading="loading"
    :error="error"
    :is-edit="!!role"
    submit-label="Enregistrer"
    submit-icon="save"
    @close="$emit('close')"
    @submit="handleSubmit"
  >
    <template #default="{ form: modalForm }">
      <div class="space-y-6">
        <!-- Nom du rôle -->
        <div class="form-group">
          <label for="role-name" class="label">
            Nom du rôle <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="role-name"
            v-model="form.name"
            class="input"
            :class="{ 'input-error': fieldErrors.name }"
            required
            placeholder="Ex: Enseignant, Secrétaire, etc."
          />
          <p v-if="fieldErrors.name" class="form-error">{{ fieldErrors.name }}</p>
        </div>
        
        <!-- Description -->
        <div class="form-group">
          <label for="role-description" class="label">Description</label>
          <textarea
            id="role-description"
            v-model="form.description"
            class="input"
            rows="3"
            placeholder="Description du rôle et de ses responsabilités..."
          ></textarea>
          <p class="form-hint">Décrivez brièvement le rôle et ses responsabilités</p>
        </div>
        
        <!-- Permissions -->
        <div class="form-group">
          <label class="label">
            Permissions
            <span class="text-slate-400 text-sm font-normal ml-2">
              ({{ form.permissions_ids.length }} sélectionnée{{ form.permissions_ids.length > 1 ? 's' : '' }})
            </span>
          </label>
          <PermissionSelector
            v-model="form.permissions_ids"
            :initial-permissions="role?.permissions || []"
          />
        </div>
        
        <!-- Statut -->
        <div class="flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <input
            type="checkbox"
            id="role-active"
            v-model="form.is_active"
            class="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <label for="role-active" class="flex-1 cursor-pointer">
            <span class="text-sm font-medium text-slate-800">Rôle actif</span>
            <p class="text-xs text-slate-500 mt-0.5">
              Les rôles inactifs ne peuvent pas être assignés aux utilisateurs
            </p>
          </label>
        </div>
      </div>
    </template>
  </BaseFormModal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import BaseFormModal from '@/components/common/BaseFormModal.vue'
import PermissionSelector from './PermissionSelector.vue'

const props = defineProps({
  role: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const settingsStore = useSettingsStore()
const loading = ref(false)
const error = ref('')
const fieldErrors = ref({})

const form = reactive({
  name: '',
  description: '',
  permissions_ids: [],
  is_active: true
})

watch(() => props.role, (newRole) => {
  if (newRole) {
    form.name = newRole.name || ''
    form.description = newRole.description || ''
    form.permissions_ids = newRole.permissions?.map(p => p.id) || []
    form.is_active = newRole.is_active !== false
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  form.name = ''
  form.description = ''
  form.permissions_ids = []
  form.is_active = true
  error.value = ''
  fieldErrors.value = {}
}

async function handleSubmit() {
  if (!form.name.trim()) {
    error.value = 'Le nom du rôle est requis'
    fieldErrors.value = { name: 'Ce champ est obligatoire' }
    return
  }
  
  loading.value = true
  error.value = ''
  fieldErrors.value = {}
  
  try {
    if (props.role) {
      await settingsStore.updateRole(props.role.id, form)
    } else {
      await settingsStore.createRole(form)
    }
    emit('saved')
  } catch (err) {
    const errorData = err.response?.data
    if (errorData) {
      if (typeof errorData === 'string') {
        error.value = errorData
      } else if (typeof errorData === 'object') {
        if (errorData.detail) {
          error.value = errorData.detail
        } else {
          // Map field errors
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
        }
      } else {
        error.value = 'Erreur lors de la sauvegarde'
      }
    } else {
      error.value = err.message || 'Erreur lors de la sauvegarde'
    }
  } finally {
    loading.value = false
  }
}
</script>
