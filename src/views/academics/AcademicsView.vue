<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Filters -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="label">Classe</label>
          <select class="select" v-model="filters.selectedClass" @change="handleFilterChange">
            <option value="">Toutes les classes</option>
            <option
              v-for="classItem in studentsStore.activeClasses"
              :key="classItem.id"
              :value="classItem.id"
            >
              {{ classItem.name }} ({{ classItem.level }})
            </option>
          </select>
        </div>
        <div>
          <label class="label">Matière</label>
          <select class="select" v-model="filters.selectedSubject" @change="handleFilterChange">
            <option value="">Toutes les matières</option>
            <option
              v-for="subject in programsStore.activeSubjects"
              :key="subject.id"
              :value="subject.id"
            >
              {{ subject.name }} ({{ subject.code }})
            </option>
          </select>
        </div>
        <div>
          <label class="label">Année scolaire</label>
          <input
            type="text"
            class="input"
            v-model="filters.academicYear"
            placeholder="Ex: 2024-2025"
            @change="handleFilterChange"
          />
        </div>
        <div class="flex items-end">
          <button @click="clearFilters" class="btn btn-ghost w-full">
            <font-awesome-icon icon="times" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Breadcrumb Navigation -->
    <div v-if="currentView !== 'subjects'" class="card py-3 px-4">
      <nav class="flex items-center gap-2 text-sm">
        <button 
          @click="navigateTo('subjects')" 
          class="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
        >
          <font-awesome-icon icon="book-open" class="text-xs" />
          Matières
        </button>
        
        <template v-if="selectedSubject">
          <font-awesome-icon icon="chevron-right" class="text-slate-400 text-xs" />
          <button 
            @click="navigateTo('programs')" 
            class="text-teal-600 hover:text-teal-700 font-medium"
          >
            {{ selectedSubject.name }}
          </button>
        </template>
        
        <template v-if="selectedProgram">
          <font-awesome-icon icon="chevron-right" class="text-slate-400 text-xs" />
          <span class="text-slate-700 font-medium">{{ selectedProgram.name }}</span>
        </template>
        
        <template v-if="selectedCourse">
          <font-awesome-icon icon="chevron-right" class="text-slate-400 text-xs" />
          <span class="text-slate-700 font-medium">{{ selectedCourse.title }}</span>
        </template>
      </nav>
    </div>
    
    <!-- Content based on navigation state -->
    <transition name="fade" mode="out-in">
      <!-- Subjects View -->
      <div v-if="currentView === 'subjects'" key="subjects">
        <SubjectManager @select-subject="handleSelectSubject" />
      </div>
      
      <!-- Programs View -->
      <div v-else-if="currentView === 'programs'" key="programs">
        <ProgramManager 
          :subject-id="selectedSubject?.id" 
          @select-program="handleSelectProgram"
          @back="navigateTo('subjects')"
        />
      </div>
      
      <!-- Courses View -->
      <div v-else-if="currentView === 'courses'" key="courses">
        <CourseManager 
          :program-id="selectedProgram?.id"
          @select-course="handleSelectCourse"
          @back="navigateTo('programs')"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStudentsStore } from '@/stores/students'
import { useProgramsStore } from '@/stores/programs'
import SubjectManager from '@/components/programs/SubjectManager.vue'
import ProgramManager from '@/components/programs/ProgramManager.vue'
import CourseManager from '@/components/programs/CourseManager.vue'

const studentsStore = useStudentsStore()
const programsStore = useProgramsStore()

const filters = ref({
  selectedClass: '',
  selectedSubject: '',
  academicYear: ''
})

const selectedSubject = ref(null)
const selectedProgram = ref(null)
const selectedCourse = ref(null)

const currentView = computed(() => {
  if (selectedCourse.value) return 'content'
  if (selectedProgram.value) return 'courses'
  if (selectedSubject.value) return 'programs'
  return 'subjects'
})

onMounted(async () => {
  await Promise.all([
    studentsStore.fetchClasses(),
    programsStore.fetchSubjects()
  ])
})

function handleFilterChange() {
  programsStore.setFilters({
    class_id: filters.value.selectedClass || null,
    subject_id: filters.value.selectedSubject || null,
    academic_year: filters.value.academicYear || null
  })
}

function clearFilters() {
  filters.value = {
    selectedClass: '',
    selectedSubject: '',
    academicYear: ''
  }
  programsStore.clearFilters()
}

function handleSelectSubject(subject) {
  selectedSubject.value = subject
  selectedProgram.value = null
  selectedCourse.value = null
}

function handleSelectProgram(program) {
  selectedProgram.value = program
  selectedCourse.value = null
}

function handleSelectCourse(course) {
  selectedCourse.value = course
}

function navigateTo(view) {
  switch (view) {
    case 'subjects':
      selectedSubject.value = null
      selectedProgram.value = null
      selectedCourse.value = null
      break
    case 'programs':
      selectedProgram.value = null
      selectedCourse.value = null
      break
    case 'courses':
      selectedCourse.value = null
      break
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
