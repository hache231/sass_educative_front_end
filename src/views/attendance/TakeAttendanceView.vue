<template>
  <div class="space-y-6">
    <!-- En-tête -->
    <div class="md:flex md:items-center md:justify-between">
      <div class="min-w-0 flex-1">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Faire l'appel
        </h2>
      </div>
      <div class="mt-4 flex md:ml-4 md:mt-0">
        <button
          type="button"
          @click="$router.back()"
          class="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          Retour
        </button>
        <button
          type="button"
          @click="submitAttendance"
          :disabled="submitting || students.length === 0"
          class="ml-3 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
        >
          <span v-if="submitting">Enregistrement...</span>
          <span v-else>Enregistrer l'appel</span>
        </button>
      </div>
    </div>

    <!-- Sélection de la classe et date -->
    <div class="bg-white shadow sm:rounded-lg p-6">
      <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div class="sm:col-span-3">
          <label for="date" class="block text-sm font-medium leading-6 text-gray-900">Date</label>
          <div class="mt-2">
            <input
              type="date"
              id="date"
              v-model="form.date"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
          </div>
        </div>

        <div class="sm:col-span-3">
          <label for="class" class="block text-sm font-medium leading-6 text-gray-900">Classe</label>
          <div class="mt-2">
            <select
              id="class"
              v-model="form.classId"
              @change="loadStudents"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="" disabled>Sélectionner une classe</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.name }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Liste des élèves à cocher -->
    <div v-if="students.length > 0" class="bg-white shadow sm:rounded-lg overflow-hidden">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center bg-gray-50">
             <h3 class="text-base font-semibold leading-6 text-gray-900">Liste des élèves ({{ students.length }})</h3>
             <div class="text-sm">
                 <button @click="markAll('present')" class="text-indigo-600 hover:text-indigo-900 font-medium mr-4">Tout Présent</button>
                 <button @click="markAll('absent')" class="text-red-600 hover:text-red-900 font-medium">Tout Absent</button>
             </div>
        </div>
        <ul role="list" class="divide-y divide-gray-100">
            <li v-for="student in students" :key="student.id" class="flex items-center justify-between gap-x-6 py-5 px-6 hover:bg-gray-50">
                <div class="min-w-0">
                    <div class="flex items-start gap-x-3">
                        <p class="text-sm font-semibold leading-6 text-gray-900">{{ student.first_name }} {{ student.last_name }}</p>
                    </div>
                </div>
                <div class="flex flex-none items-center gap-x-4">
                    <!-- Statut (Radio buttons styled as pills) -->
                    <div class="isolate inline-flex rounded-md shadow-sm">
                        <button 
                            type="button" 
                            @click="student.status = 'present'"
                            :class="[student.status === 'present' ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50', 'relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-semibold focus:z-10']"
                        >
                            P
                        </button>
                        <button 
                            type="button" 
                            @click="student.status = 'absent'"
                            :class="[student.status === 'absent' ? 'bg-red-600 text-white hover:bg-red-500' : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50', 'relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold focus:z-10']"
                        >
                            A
                        </button>
                        <button 
                            type="button" 
                            @click="student.status = 'late'"
                            :class="[student.status === 'late' ? 'bg-yellow-500 text-white hover:bg-yellow-400' : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50', 'relative -ml-px inline-flex items-center px-3 py-2 text-sm font-semibold focus:z-10']"
                        >
                            R
                        </button>
                        <button 
                            type="button" 
                            @click="student.status = 'excused'"
                            :class="[student.status === 'excused' ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50', 'relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-semibold focus:z-10']"
                        >
                            E
                        </button>
                    </div>
                    
                    <!-- Motif (si absent ou retard ou excusé) -->
                    <input 
                        v-if="student.status !== 'present'"
                        type="text" 
                        v-model="student.reason"
                        placeholder="Justification..."
                        class="block w-48 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    >
                </div>
            </li>
        </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAttendanceStore } from '@/stores/attendance'
import { useStudentsStore } from '@/stores/students'
import { useAuthStore } from '@/stores/auth' 

// Mock des classes en attendant le store Academics/Classes
const classes = ref([
    { id: 1, name: '6ème A' },
    { id: 2, name: '5ème B' },
    { id: 3, name: '4ème C' }
])

const router = useRouter()
const attendanceStore = useAttendanceStore()
const studentsStore = useStudentsStore()
const authStore = useAuthStore()

// Fonction pour récupérer l'ID de l'école
function getSchoolId() {
  // Essayer de récupérer depuis l'utilisateur
  if (authStore.currentUser?.school_id) {
    return authStore.currentUser.school_id
  }
  if (authStore.currentUser?.school?.id) {
    return authStore.currentUser.school.id
  }
  // Essayer depuis les données de l'école dans le store
  // Si aucune école n'est trouvée, retourner null (le backend gérera l'erreur)
  return null
}

const form = ref({
    date: new Date().toISOString().substr(0, 10),
    classId: ''
})

const students = ref([])
const submitting = ref(false)

const loadStudents = async () => {
    if (!form.value.classId) return
    
    // Simuler le chargement des élèves pour la classe sélectionnée
    // Dans la réalité: studentsStore.fetchStudentsByClass(form.value.classId)
    // Pour l'instant on fait un fetchAll et on simule
    
    try {
        await studentsStore.fetchStudents()
        // On mappe les étudiants pour ajouter l'état local du formulaire de présence
        students.value = studentsStore.students.map(s => ({
            id: s.id,
            first_name: s.first_name,
            last_name: s.last_name,
            status: 'present', // Par défaut tout le monde est présent
            reason: ''
        }))
    } catch (e) {
        console.error("Erreur chargement élèves", e)
    }
}

const markAll = (status) => {
    students.value.forEach(s => s.status = status)
}

const submitAttendance = async () => {
    submitting.value = true
    try {
        // Préparer le payload pour le backend
        // On envoie une liste d'objets Attendance
        const payload = students.value.map(s => ({
            student: s.id,
            status: s.status,
            reason: s.reason,
            date: form.value.date,
            school: getSchoolId()
        }))
        
        await attendanceStore.submitAttendance(payload)
        
        // Rediriger vers la liste avec un succès
        router.push({ name: 'Attendance' })
    } catch (e) {
        alert("Erreur lors de l'enregistrement.")
    } finally {
        submitting.value = false
    }
}
</script>
