<template>
  <BaseFormModal
    :title="student ? 'Modifier l\'élève' : 'Nouvel élève'"
    :subtitle="student ? 'Mettez à jour les informations de l\'élève' : 'Ajoutez un nouvel élève à votre établissement'"
    :icon="student ? 'edit' : 'user-plus'"
    icon-bg-class="bg-teal-500 text-white"
    size="3xl"
    :loading="loading"
    :error="error"
    :field-errors="{}"
    :form="form"
    :is-valid="isValid"
    :is-edit="!!student"

    :show-tabs="true"
    :tabs="tabs"
    :initial-tab="activeTab"
    :can-proceed-to-next="canProceedToNext"
    submit-label="Enregistrer"
    submit-icon="save"
    @close="$emit('close')"
    @submit="handleSubmit"
    @tab-change="activeTab = $event"
  >
    <!-- Personal Tab -->
    <template #tab-personal="{ form: modalForm, errors, isValid }">
      <div class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="first_name" class="label">
              Prénom <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="first_name"
              v-model="form.first_name"
              class="input"
              placeholder="Prénom de l'élève"
              required
            />
          </div>
          <div class="form-group">
            <label for="last_name" class="label">
              Nom <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="last_name"
              v-model="form.last_name"
              class="input"
              placeholder="Nom de l'élève"
              required
            />
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="date_of_birth" class="label">
              Date de naissance <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date_of_birth"
              v-model="form.date_of_birth"
              class="input"
              :max="maxDate"
              required
            />
          </div>
          <div class="form-group">
            <label for="gender" class="label">
              Genre <span class="text-red-500">*</span>
            </label>
            <select id="gender" v-model="form.gender" class="select" required>
              <option value="">Sélectionner...</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
        </div>
        
        <div class="form-group">
          <label class="label">Photo</label>
          <div class="flex items-start gap-4">
            <div v-if="photoPreview" class="relative">
              <img
                :src="photoPreview"
                alt="Preview"
                class="w-24 h-24 rounded-xl object-cover border-2 border-slate-200"
              />
              <button
                type="button"
                @click="removePhoto"
                class="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white
                       flex items-center justify-center text-xs hover:bg-red-600"
              >
                <font-awesome-icon icon="times" />
              </button>
            </div>
            <label class="flex-1 cursor-pointer">
              <div class="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center
                          hover:border-teal-500 hover:bg-teal-50/50 transition-colors">
                <font-awesome-icon icon="cloud-upload-alt" class="text-2xl text-slate-400 mb-2" />
                <p class="text-sm text-slate-600">Cliquez pour télécharger une photo</p>
                <p class="text-xs text-slate-400 mt-1">JPG, PNG (max 5MB)</p>
              </div>
              <input
                type="file"
                class="hidden"
                accept="image/*"
                @change="handlePhotoChange"
              />
            </label>
          </div>
        </div>
        
        <!-- Active Checkbox -->
        <div class="flex items-center gap-3 mt-6 pt-6 border-t border-slate-100">
          <input
            type="checkbox"
            id="is_active"
            v-model="form.is_active"
            class="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <label for="is_active" class="text-sm font-medium text-slate-700">
            Élève actif
          </label>
        </div>
      </div>
    </template>
    
    <!-- Contact Tab -->
    <template #tab-contact="{ form: modalForm, errors, isValid }">
      <div class="space-y-5">
        <div class="form-group">
          <label for="address" class="label">Adresse</label>
          <textarea
            id="address"
            v-model="form.address"
            class="input"
            rows="3"
            placeholder="Adresse complète..."
          ></textarea>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="phone" class="label">Téléphone</label>
            <input
              type="tel"
              id="phone"
              v-model="form.phone"
              class="input"
              placeholder="+33 6 12 34 56 78"
            />
          </div>
          <div class="form-group">
            <label for="email" class="label">Email</label>
            <input
              type="email"
              id="email"
              v-model="form.email"
              class="input"
              placeholder="email@exemple.com"
            />
          </div>
        </div>
      </div>
    </template>
    
    <!-- School Tab -->
    <template #tab-school="{ form: modalForm, errors, isValid }">
      <div class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="student_id" class="label">Numéro d'identification</label>
            <input
              type="text"
              id="student_id"
              v-model="form.student_id"
              class="input"
              :disabled="!!student"
              :placeholder="student ? 'Non modifiable' : 'Auto-généré si vide'"
            />
            <p class="form-hint">Laissez vide pour une génération automatique</p>
          </div>
          <div class="form-group">
            <label for="enrollment_date" class="label">
              Date d'inscription <span class="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="enrollment_date"
              v-model="form.enrollment_date"
              class="input"
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="classes" class="label">Classes</label>
          <select
            id="classes"
            v-model="form.classes_ids"
            class="select"
            multiple
            style="min-height: 120px;"
          >
            <option
              v-for="classItem in availableClasses"
              :key="classItem.id"
              :value="classItem.id"
            >
              {{ classItem.name }} ({{ classItem.level }}) - {{ classItem.capacity }} places
            </option>
          </select>
          <p class="form-hint">Maintenez Ctrl/Cmd pour sélectionner plusieurs classes</p>
        </div>
        
        <div class="form-group">
          <label for="academic_year" class="label">Année académique</label>
          <input
            type="text"
            id="academic_year"
            v-model="form.academic_year"
            class="input"
            placeholder="2024-2025"
          />
        </div>
      </div>
    </template>
    
    <!-- Parent Tab -->
    <template #tab-parent="{ form: modalForm, errors, isValid }">
      <div class="space-y-5">
        <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-4">
          <div class="flex items-start gap-3">
            <font-awesome-icon icon="info-circle" class="text-amber-500 mt-0.5" />
            <p class="text-sm text-amber-800">
              Ces informations permettent de contacter les parents ou tuteurs légaux en cas de besoin.
            </p>
          </div>
        </div>
        
        <div class="form-group">
          <label for="parent_name" class="label">Nom du parent/tuteur</label>
          <input
            type="text"
            id="parent_name"
            v-model="form.parent_name"
            class="input"
            placeholder="Nom complet du parent ou tuteur"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="form-group">
            <label for="parent_phone" class="label">Téléphone du parent</label>
            <input
              type="tel"
              id="parent_phone"
              v-model="form.parent_phone"
              class="input"
              placeholder="+33 6 12 34 56 78"
            />
          </div>
          <div class="form-group">
            <label for="parent_email" class="label">Email du parent</label>
            <input
              type="email"
              id="parent_email"
              v-model="form.parent_email"
              class="input"
              placeholder="parent@exemple.com"
            />
          </div>
        </div>
      </div>
    </template>
  </BaseFormModal>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue'
import BaseFormModal from '@/components/common/BaseFormModal.vue'
import { useStudentsStore } from '@/stores/students'
import { useSettingsStore } from '@/stores/settings'

const props = defineProps({
  student: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const studentsStore = useStudentsStore()
const settingsStore = useSettingsStore()

const loading = ref(false)
const error = ref('')
const activeTab = ref('personal')
const photoPreview = ref(null)
const selectedPhotoFile = ref(null)

const form = reactive({
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  photo: null,
  address: '',
  phone: '',
  email: '',
  student_id: '',
  enrollment_date: new Date().toISOString().split('T')[0],
  classes_ids: [],
  academic_year: '',
  parent_name: '',
  parent_phone: '',
  parent_email: '',
  is_active: true
})

const maxDate = computed(() => new Date().toISOString().split('T')[0])

const availableClasses = computed(() => studentsStore.activeClasses || [])

const tabs = computed(() => [
  { id: 'personal', label: 'Personnel', icon: 'user' },
  { id: 'contact', label: 'Contact', icon: 'phone' },
  { id: 'school', label: 'Scolaire', icon: 'graduation-cap' },
  { id: 'parent', label: 'Parents', icon: 'users' }
])

const canProceedToNext = computed(() => {
  if (activeTab.value === 'personal') {
    return !!(form.first_name?.trim() && form.last_name?.trim() && form.date_of_birth && form.gender)
  }
  return true
})

const isValid = computed(() => {
  return !!(form.first_name?.trim() && form.last_name?.trim() && form.date_of_birth && form.gender)
})

watch(() => props.student, (newStudent) => {
  if (newStudent) {
    form.first_name = newStudent.first_name || ''
    form.last_name = newStudent.last_name || ''
    form.date_of_birth = newStudent.date_of_birth || ''
    form.gender = newStudent.gender || ''
    form.address = newStudent.address || ''
    form.phone = newStudent.phone || ''
    form.email = newStudent.email || ''
    form.student_id = newStudent.student_id || ''
    form.enrollment_date = newStudent.enrollment_date || new Date().toISOString().split('T')[0]
    form.parent_name = newStudent.parent_name || ''
    form.parent_phone = newStudent.parent_phone || ''
    form.parent_email = newStudent.parent_email || ''
    form.is_active = newStudent.is_active !== undefined ? newStudent.is_active : true
    
    if (newStudent.classes?.length > 0) {
      form.classes_ids = newStudent.classes.map(c => c.class_obj?.id || c.id).filter(Boolean)
      form.academic_year = newStudent.classes[0].academic_year || ''
    }
    
    if (newStudent.photo_thumbnail) {
      photoPreview.value = newStudent.photo_thumbnail
    }
  } else {
    resetForm()
  }
}, { immediate: true })

onMounted(async () => {
  if (studentsStore.classes.length === 0) {
    await studentsStore.fetchClasses()
  }
  
  if (settingsStore.settings?.current_academic_year) {
    form.academic_year = settingsStore.settings.current_academic_year
  } else {
    const year = new Date().getFullYear()
    form.academic_year = `${year}-${year + 1}`
  }
})

function resetForm() {
  Object.assign(form, {
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    photo: null,
    address: '',
    phone: '',
    email: '',
    student_id: '',
    enrollment_date: new Date().toISOString().split('T')[0],
    classes_ids: [],
    academic_year: '',
    parent_name: '',
    parent_phone: '',
    parent_email: '',
    is_active: true
  })
  photoPreview.value = null
  selectedPhotoFile.value = null
}

function handlePhotoChange(event) {
  const file = event.target.files[0]
  if (file) {
    if (!file.type.startsWith('image/')) {
      error.value = 'Veuillez sélectionner un fichier image.'
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      error.value = 'Le fichier est trop volumineux (max 5MB).'
      return
    }
    selectedPhotoFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => photoPreview.value = e.target.result
    reader.readAsDataURL(file)
  }
}

function removePhoto() {
  photoPreview.value = null
  selectedPhotoFile.value = null
}

async function handleSubmit() {
  if (!form.first_name.trim() || !form.last_name.trim()) {
    error.value = 'Le prénom et le nom sont requis.'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    const formData = new FormData()
    
    Object.keys(form).forEach(key => {
      if (key === 'photo') {
        if (selectedPhotoFile.value) {
          formData.append('photo', selectedPhotoFile.value)
        }
      } else if (key === 'classes_ids') {
        form.classes_ids.forEach(id => formData.append('classes_ids', id))
      } else if (form[key] !== null && form[key] !== undefined && form[key] !== '') {
        formData.append(key, typeof form[key] === 'boolean' ? (form[key] ? 'true' : 'false') : form[key])
      }
    })
    
    if (props.student) {
      await studentsStore.updateStudent(props.student.id, formData)
    } else {
      await studentsStore.createStudent(formData)
    }
    
    emit('saved')
  } catch (err) {
    const errorData = err.response?.data
    if (typeof errorData === 'object' && !errorData.detail) {
      const messages = Object.entries(errorData).map(([field, msgs]) => 
        `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`
      )
      error.value = messages.join(' | ') || 'Erreur lors de la sauvegarde'
    } else {
      error.value = errorData?.detail || 'Erreur lors de la sauvegarde'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

