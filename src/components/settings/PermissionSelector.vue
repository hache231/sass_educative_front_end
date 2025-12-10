<template>
  <div class="permission-selector">
    <div v-for="(permissions, category) in permissionsByCategory" :key="category" class="mb-4">
      <h6 class="mb-3">{{ getCategoryLabel(category) }}</h6>
      <div class="row">
        <div
          v-for="permission in permissions"
          :key="permission.id"
          class="col-md-6 mb-2"
        >
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              :id="`perm-${permission.id}`"
              :value="permission.id"
              :checked="modelValue.includes(permission.id)"
              @change="handleChange(permission.id, $event.target.checked)"
            />
            <label class="form-check-label" :for="`perm-${permission.id}`">
              {{ permission.name }}
            </label>
            <small v-if="permission.description" class="text-muted d-block">
              {{ permission.description }}
            </small>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="!permissionsByCategory || Object.keys(permissionsByCategory).length === 0" class="text-muted">
      <p>Aucune permission disponible. Contactez l'administrateur.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  initialPermissions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const settingsStore = useSettingsStore()

const permissionsByCategory = computed(() => {
  // Les permissions sont stockées par catégorie dans le store
  if (typeof settingsStore.permissions === 'object' && !Array.isArray(settingsStore.permissions)) {
    return settingsStore.permissions
  }
  return {}
})

function getCategoryLabel(category) {
  const labels = {
    students: 'Élèves',
    teachers: 'Enseignants',
    academics: 'Académique',
    assessments: 'Évaluations',
    schedules: 'Emploi du temps',
    finance: 'Finances',
    communications: 'Communications',
    reports: 'Rapports',
    documents: 'Documents',
    settings: 'Paramètres'
  }
  return labels[category] || category
}

function handleChange(permissionId, checked) {
  const newValue = [...props.modelValue]
  if (checked) {
    if (!newValue.includes(permissionId)) {
      newValue.push(permissionId)
    }
  } else {
    const index = newValue.indexOf(permissionId)
    if (index > -1) {
      newValue.splice(index, 1)
    }
  }
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.permission-selector {
  max-height: 500px;
  overflow-y: auto;
  border: 1px solid #e5eaef;
  border-radius: 8px;
  padding: 1rem;
}
</style>

