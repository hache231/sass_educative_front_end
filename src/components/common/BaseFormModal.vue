<template>
  <Teleport to="body">
    <div 
      class="modal-overlay" 
      @click.self="handleClose"
      style="display: flex !important; visibility: visible !important; opacity: 1 !important;"
    >
    <div 
      :class="[
        'modal-content animate-modal-in flex flex-col',
        sizeClasses
      ]"
    >
      <!-- Header -->
      <div class="modal-header flex-shrink-0 bg-gradient-to-r from-slate-50 to-white">
        <div class="flex items-center gap-4">
          <div 
            v-if="icon"
            :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
              iconBgClass || 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-teal-500/30'
            ]"
          >
            <font-awesome-icon :icon="icon" class="text-lg" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-slate-800">{{ title }}</h3>
            <p v-if="subtitle" class="text-sm text-slate-500 mt-1">{{ subtitle }}</p>
          </div>
        </div>
        <button 
          @click="handleClose" 
          class="btn-icon-sm btn-ghost text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          :disabled="loading"
        >
          <font-awesome-icon icon="times" />
        </button>
      </div>
      
      <!-- Progress Indicator (if tabs) -->
      <div v-if="showTabs && tabs.length > 1" class="px-6 pt-4 pb-2 flex-shrink-0 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100">
        <div class="flex items-center gap-2 mb-4">
          <div 
            v-for="(tab, index) in tabs" 
            :key="tab.id"
            class="flex items-center"
          >
            <div 
              :class="[
                'w-10 h-10 rounded-xl flex items-center justify-center text-xs font-semibold transition-all shadow-sm',
                currentTabIndex >= index 
                  ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30' 
                  : 'bg-slate-200 text-slate-500'
              ]"
            >
              <font-awesome-icon 
                v-if="currentTabIndex > index" 
                icon="check" 
                class="text-xs"
              />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <div 
              v-if="index < tabs.length - 1"
              :class="[
                'w-16 h-1 mx-3 rounded-full transition-all',
                currentTabIndex > index ? 'bg-gradient-to-r from-teal-500 to-teal-600' : 'bg-slate-200'
              ]"
            ></div>
          </div>
        </div>
      </div>
      
      <!-- Body -->
      <form @submit.prevent="handleSubmit" class="flex flex-col flex-1 min-h-0">
        <div class="modal-body flex-1 overflow-y-auto">
          <!-- Tabs Navigation -->
          <div v-if="showTabs && tabs.length > 1" class="tabs mb-6">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              type="button"
              @click="setActiveTab(tab.id)"
              :class="[
                'tab',
                activeTab === tab.id ? 'tab-active' : 'tab-inactive'
              ]"
            >
              <font-awesome-icon v-if="tab.icon" :icon="tab.icon" />
              <span>{{ tab.label }}</span>
              <span 
                v-if="tab.badge" 
                class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-700"
              >
                {{ tab.badge }}
              </span>
            </button>
          </div>
          
          <!-- Tab Content -->
          <transition name="slide-fade" mode="out-in">
            <div :key="activeTab">
              <slot 
                :name="`tab-${activeTab}`" 
                :form="form"
                :errors="fieldErrors"
                :isValid="isValid"
              >
                <slot :form="form" :errors="fieldErrors" :isValid="isValid"></slot>
              </slot>
            </div>
          </transition>
          
          <!-- Global Error -->
          <transition name="slide">
            <div v-if="error" class="alert alert-danger mt-4">
              <font-awesome-icon icon="exclamation-circle" class="alert-icon" />
              <div class="flex-1">
                <p class="font-medium">{{ error }}</p>
                <ul v-if="Array.isArray(errorDetails)" class="mt-2 space-y-1 text-sm">
                  <li v-for="(detail, index) in errorDetails" :key="index">• {{ detail }}</li>
                </ul>
              </div>
            </div>
          </transition>
          
          <!-- Success Message -->
          <transition name="slide">
            <div v-if="successMessage" class="alert alert-success mt-4">
              <font-awesome-icon icon="check-circle" class="alert-icon" />
              <span>{{ successMessage }}</span>
            </div>
          </transition>
        </div>
        
        <!-- Footer -->
        <div class="modal-footer flex-shrink-0 bg-gradient-to-r from-slate-50 to-white">
          <div class="flex items-center justify-between w-full">
            <button 
              type="button" 
              @click="handleClose" 
              class="btn btn-secondary shadow-sm hover:shadow-md transition-shadow"
              :disabled="loading"
            >
              Annuler
            </button>
            <div class="flex items-center gap-3">
              <button
                v-if="showTabs && currentTabIndex > 0"
                type="button"
                @click="previousTab"
                class="btn btn-outline shadow-sm hover:shadow-md transition-shadow"
              >
                <font-awesome-icon icon="chevron-left" />
                <span>Précédent</span>
              </button>
              <button
                v-if="showTabs && currentTabIndex < tabs.length - 1"
                type="button"
                @click="nextTab"
                class="btn btn-outline shadow-sm hover:shadow-md transition-shadow"
                :disabled="!canProceedToNext"
              >
                <span>Suivant</span>
                <font-awesome-icon icon="chevron-right" />
              </button>
              <button 
                type="submit" 
                class="btn btn-primary shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30" 
                :disabled="loading || (!isValid && validateOnSubmit)"
              >
                <div v-if="loading" class="spinner spinner-sm border-white/30 border-t-white"></div>
                <font-awesome-icon v-else :icon="submitIcon || 'save'" />
                <span>{{ submitLabel || (isEdit ? 'Enregistrer' : 'Créer') }}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useLoadingState } from '@/composables/useLoadingState'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: null
  },
  iconBgClass: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg, xl, full
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'full', '2xl', '3xl'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  errorDetails: {
    type: Array,
    default: () => []
  },
  successMessage: {
    type: String,
    default: ''
  },
  submitLabel: {
    type: String,
    default: ''
  },
  submitIcon: {
    type: String,
    default: 'save'
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  showTabs: {
    type: Boolean,
    default: false
  },
  tabs: {
    type: Array,
    default: () => []
  },
  initialTab: {
    type: String,
    default: ''
  },
  validateOnSubmit: {
    type: Boolean,
    default: true
  },
  canProceedToNext: {
    type: Boolean,
    default: true
  },
  form: {
    type: Object,
    default: () => ({})
  },
  fieldErrors: {
    type: Object,
    default: () => ({})
  },
  isValid: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close', 'submit', 'tab-change'])

// Utiliser les composables pour la gestion d'erreurs et de chargement
const { 
  error: internalError, 
  fieldErrors: internalFieldErrors,
  handleApiError,
  clearErrors 
} = useErrorHandler()

const { 
  loading: internalLoading,
  isLoading,
  withLoading 
} = useLoadingState()

// Utiliser les props ou les valeurs internes
const error = computed(() => props.error || internalError.value)
const fieldErrors = computed(() => Object.keys(props.fieldErrors || {}).length > 0 ? props.fieldErrors : internalFieldErrors.value)
const loading = computed(() => props.loading || internalLoading.value)

const activeTab = ref(props.initialTab || (props.tabs.length > 0 ? props.tabs[0].id : ''))

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-3xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-5xl',
    '3xl': 'max-w-6xl',
    full: 'max-w-full mx-4'
  }
  return sizes[props.size] || sizes.md
})

const currentTabIndex = computed(() => {
  return props.tabs.findIndex(tab => tab.id === activeTab.value)
})

watch(() => props.initialTab, (newTab) => {
  if (newTab) {
    activeTab.value = newTab
  }
})

function setActiveTab(tabId) {
  activeTab.value = tabId
  emit('tab-change', tabId)
}

function nextTab() {
  const currentIndex = currentTabIndex.value
  if (currentIndex < props.tabs.length - 1) {
    setActiveTab(props.tabs[currentIndex + 1].id)
  }
}

function previousTab() {
  const currentIndex = currentTabIndex.value
  if (currentIndex > 0) {
    setActiveTab(props.tabs[currentIndex - 1].id)
  }
}

function handleClose() {
  if (!loading.value) {
    clearErrors()
    emit('close')
  }
}

onMounted(() => {
  // Component mounted
})

function handleSubmit() {
  emit('submit', activeTab.value)
}
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

