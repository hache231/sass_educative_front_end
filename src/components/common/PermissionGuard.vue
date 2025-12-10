<template>
  <slot v-if="hasAccess" />
</template>

<script setup>
import { computed } from 'vue'
import { usePermissions } from '@/composables/usePermissions'

const props = defineProps({
  /**
   * Permission requise pour afficher le contenu
   * Peut être une string (permission unique) ou un array (au moins une permission)
   */
  permission: {
    type: [String, Array],
    default: null
  },
  /**
   * Si true, toutes les permissions doivent être présentes (AND)
   * Si false, au moins une permission doit être présente (OR)
   */
  requireAll: {
    type: Boolean,
    default: false
  }
})

const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

const hasAccess = computed(() => {
  if (!props.permission) return true // Pas de permission requise = accessible
  
  if (Array.isArray(props.permission)) {
    // Plusieurs permissions
    return props.requireAll 
      ? hasAllPermissions(props.permission)
      : hasAnyPermission(props.permission)
  } else {
    // Une seule permission
    return hasPermission(props.permission)
  }
})
</script>

