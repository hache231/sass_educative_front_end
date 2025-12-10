<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
    style="background-color: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px);"
    @click.self="$emit('close')"
  >
    <div class="card w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin animate-scale-in">
      <!-- Header -->
      <div class="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 p-6 flex items-center justify-between">
        <h3 class="text-2xl font-bold text-slate-900">
          {{ classObj ? 'Modifier la classe' : 'Nouvelle classe' }}
        </h3>
        <button
          @click="$emit('close')"
          class="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
        >
          <font-awesome-icon icon="times" class="text-xl" />
        </button>
      </div>
      
      <!-- Body -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-semibold text-slate-700 mb-2">
              Nom de la classe <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              required
              placeholder="Ex: 6ème A, Terminale S"
              class="input"
            />
          </div>
          
          <div>
            <label for="level" class="block text-sm font-semibold text-slate-700 mb-2">
              Niveau <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="level"
              v-model="form.level"
              list="level-suggestions"
              required
              placeholder="Ex: CP1, CE1, 6ème, Terminale"
              class="input"
            />
            <datalist id="level-suggestions">
              <option>CP1</option>
              <option>CP2</option>
              <option>CE1</option>
              <option>CE2</option>
              <option>CM1</option>
              <option>CM2</option>
              <option>6ème</option>
              <option>5ème</option>
              <option>4ème</option>
              <option>3ème</option>
              <option>2nde</option>
              <option>1ère</option>
              <option>Terminale</option>
            </datalist>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="capacity" class="block text-sm font-semibold text-slate-700 mb-2">
              Capacité maximale <span class="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="capacity"
              v-model.number="form.capacity"
              min="1"
              max="100"
              required
              class="input"
            />
            <p class="text-xs text-slate-500 mt-1">Nombre maximum d'élèves (1-100)</p>
            <div v-if="classObj && form.capacity < currentStudentCount" class="mt-2 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
              <p class="text-sm text-yellow-800">
                ⚠️ Attention : La capacité est inférieure au nombre d'élèves actuels ({{ currentStudentCount }})
              </p>
            </div>
          </div>
          
          <div>
            <label for="class_teacher" class="block text-sm font-semibold text-slate-700 mb-2">
              Professeur principal
            </label>
            <select id="class_teacher" v-model="form.class_teacher" class="input-modern">
              <option value="">Aucun</option>
              <option
                v-for="teacher in teachers"
                :key="teacher.id"
                :value="teacher.id"
              >
                {{ teacher.full_name || teacher.user_email }}
              </option>
            </select>
          </div>
        </div>
        
        <div v-if="classObj" class="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-slate-600">Nombre d'élèves actuels</p>
              <p class="text-2xl font-bold text-indigo-600">{{ currentStudentCount }}</p>
            </div>
            <div>
              <p class="text-sm text-slate-600">Taux d'occupation</p>
              <p class="text-2xl font-bold text-purple-600">{{ occupationRate }}%</p>
            </div>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <input
            type="checkbox"
            id="is_active"
            v-model="form.is_active"
            class="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label for="is_active" class="text-sm font-medium text-slate-700">
            Classe active
          </label>
        </div>
        
        <div v-if="error" class="p-4 rounded-xl bg-red-50 border border-red-200">
          <p class="text-sm text-red-800">{{ error }}</p>
        </div>
        
        <!-- Footer -->
        <div class="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
          <button
            type="button"
            @click="$emit('close')"
            class="btn btn-secondary"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="studentsStore.loading"
            class="btn btn-primary"
          >
            <span v-if="studentsStore.loading" class="animate-spin mr-2">⏳</span>
            {{ classObj ? 'Modifier' : 'Créer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useTeachersStore } from '@/stores/teachers'

const props = defineProps({
  classObj: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const studentsStore = useStudentsStore()
const teachersStore = useTeachersStore()

const teachers = ref([])
const error = ref(null)

const form = ref({
  name: '',
  level: '',
  capacity: 30,
  class_teacher: '',
  is_active: true
})

const currentStudentCount = computed(() => {
  return props.classObj?.student_count || 0
})

const occupationRate = computed(() => {
  if (!props.classObj || !form.value.capacity) return 0
  return Math.round((currentStudentCount.value / form.value.capacity) * 100)
})

onMounted(async () => {
  await teachersStore.fetchTeachers({ is_active: true })
  teachers.value = teachersStore.activeTeachers
  
  if (props.classObj) {
    form.value = {
      name: props.classObj.name,
      level: props.classObj.level,
      capacity: props.classObj.capacity,
      class_teacher: props.classObj.class_teacher || '',
      is_active: props.classObj.is_active !== false
    }
  }
})

async function handleSubmit() {
  error.value = null
  
  if (form.value.capacity < currentStudentCount.value) {
    if (!confirm(`Attention : La capacité (${form.value.capacity}) est inférieure au nombre d'élèves actuels (${currentStudentCount.value}). Voulez-vous continuer ?`)) {
      return
    }
  }
  
  try {
    const data = {
      ...form.value,
      class_teacher: form.value.class_teacher || null
    }
    
    if (props.classObj) {
      await studentsStore.updateClass(props.classObj.id, data)
    } else {
      await studentsStore.createClass(data)
    }
    emit('saved')
  } catch (err) {
    if (err.response?.data) {
      if (typeof err.response.data === 'string') {
        error.value = err.response.data
      } else if (err.response.data.non_field_errors) {
        error.value = err.response.data.non_field_errors[0]
      } else {
        error.value = Object.values(err.response.data).flat().join(', ')
      }
    } else {
      error.value = 'Une erreur est survenue'
    }
  }
}
</script>
