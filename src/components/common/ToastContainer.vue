<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-md w-full">
      <TransitionGroup name="toast" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          :class="getToastClass(notification.type)"
          class="toast p-4 rounded-lg shadow-lg flex items-start gap-3"
        >
          <font-awesome-icon
            :icon="getToastIcon(notification.type)"
            :class="getIconClass(notification.type)"
            class="flex-shrink-0 mt-0.5"
          />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium">{{ notification.message }}</p>
          </div>
          <button
            @click="removeNotification(notification.id)"
            class="flex-shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
          >
            <font-awesome-icon icon="times" class="text-sm" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { useNotifications } from '@/composables/useNotifications'

const { notifications, removeNotification } = useNotifications()

function getToastClass(type) {
  const classes = {
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    error: 'bg-rose-50 text-rose-800 border border-rose-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    info: 'bg-blue-50 text-blue-800 border border-blue-200'
  }
  return classes[type] || classes.info
}

function getToastIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  }
  return icons[type] || icons.info
}

function getIconClass(type) {
  const classes = {
    success: 'text-emerald-600',
    error: 'text-rose-600',
    warning: 'text-amber-600',
    info: 'text-blue-600'
  }
  return classes[type] || classes.info
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style>

