<template>
  <BaseFormModal
    :title="'Enregistrer un paiement'"
    :subtitle="'Enregistrez un paiement de frais pour un élève'"
    icon="wallet"
    icon-bg-class="bg-emerald-500"
    size="lg"
    :loading="loading"
    :error="error"
    :field-errors="fieldErrors"
    :is-valid="isFormValid"
    submit-label="Enregistrer le paiement"
    submit-icon="save"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template #default="{ form: modalForm, errors, isValid }">
      <div class="space-y-6">
        <!-- Sélection du frais -->
        <div>
          <label class="label">Frais *</label>
          <select
            v-model="form.fee_id"
            class="input"
            :class="{ 'input-error': errors.fee_id }"
            required
            @change="onFeeChange"
          >
            <option value="">Sélectionner un frais</option>
            <option
              v-for="fee in fees"
              :key="fee.id"
              :value="fee.id"
            >
              {{ fee.name }} - {{ formatAmount(fee.amount) }} FCFA
            </option>
          </select>
          <p v-if="errors.fee_id" class="text-sm text-rose-600 mt-1">{{ errors.fee_id }}</p>
        </div>

        <!-- Sélection de l'élève -->
        <div>
          <label class="label">Élève *</label>
          <select
            v-model="form.student_id"
            class="input"
            :class="{ 'input-error': errors.student_id }"
            required
            @change="onStudentChange"
          >
            <option value="">Sélectionner un élève</option>
            <option
              v-for="student in students"
              :key="student.id"
              :value="student.id"
            >
              {{ student.full_name || `${student.first_name} ${student.last_name}` }} ({{ student.student_id }})
            </option>
          </select>
          <p v-if="errors.student_id" class="text-sm text-rose-600 mt-1">{{ errors.student_id }}</p>
        </div>

        <!-- Informations du frais sélectionné -->
        <div v-if="selectedFee" class="bg-slate-50 rounded-lg p-4 space-y-2">
          <h4 class="font-semibold text-slate-800">Informations du frais</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-slate-500">Montant total:</span>
              <span class="font-medium text-slate-800 ml-2">{{ formatAmount(selectedFee.amount) }} FCFA</span>
            </div>
            <div>
              <span class="text-slate-500">Montant déjà payé:</span>
              <span class="font-medium text-slate-800 ml-2">{{ formatAmount(paidAmount) }} FCFA</span>
            </div>
            <div>
              <span class="text-slate-500">Solde restant:</span>
              <span class="font-medium text-emerald-600 ml-2">{{ formatAmount(remainingAmount) }} FCFA</span>
            </div>
            <div>
              <span class="text-slate-500">Date d'échéance:</span>
              <span class="font-medium text-slate-800 ml-2">{{ formatDate(selectedFee.due_date) }}</span>
            </div>
          </div>
        </div>

        <!-- Montant payé -->
        <div>
          <label class="label">Montant payé (FCFA) *</label>
          <input
            v-model.number="form.amount"
            type="number"
            step="0.01"
            min="0"
            :max="remainingAmount"
            class="input"
            :class="{ 'input-error': errors.amount }"
            placeholder="0.00"
            required
          />
          <p v-if="errors.amount" class="text-sm text-rose-600 mt-1">{{ errors.amount }}</p>
          <p v-if="remainingAmount > 0" class="text-sm text-slate-500 mt-1">
            Solde restant: {{ formatAmount(remainingAmount) }} FCFA
          </p>
        </div>

        <!-- Méthode de paiement -->
        <div>
          <label class="label">Méthode de paiement *</label>
          <select
            v-model="form.payment_method"
            class="input"
            :class="{ 'input-error': errors.payment_method }"
            required
          >
            <option value="cash">Espèces</option>
            <option value="bank_transfer">Virement bancaire</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="check">Chèque</option>
            <option value="other">Autre</option>
          </select>
          <p v-if="errors.payment_method" class="text-sm text-rose-600 mt-1">{{ errors.payment_method }}</p>
        </div>

        <!-- Date de paiement -->
        <div>
          <label class="label">Date de paiement *</label>
          <input
            v-model="form.payment_date"
            type="date"
            class="input"
            :class="{ 'input-error': errors.payment_date }"
            required
          />
          <p v-if="errors.payment_date" class="text-sm text-rose-600 mt-1">{{ errors.payment_date }}</p>
        </div>

        <!-- Notes -->
        <div>
          <label class="label">Notes (optionnel)</label>
          <textarea
            v-model="form.notes"
            rows="3"
            class="input"
            placeholder="Notes additionnelles sur ce paiement..."
          />
        </div>

        <!-- Récapitulatif -->
        <div v-if="form.amount > 0" class="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <h4 class="font-semibold text-emerald-800 mb-3">Récapitulatif</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-emerald-700">Montant payé:</span>
              <span class="font-semibold text-emerald-800">{{ formatAmount(form.amount) }} FCFA</span>
            </div>
            <div class="flex justify-between">
              <span class="text-emerald-700">Méthode:</span>
              <span class="font-semibold text-emerald-800">{{ getPaymentMethodLabel(form.payment_method) }}</span>
            </div>
            <div v-if="form.amount < remainingAmount" class="flex justify-between pt-2 border-t border-emerald-200">
              <span class="text-emerald-700">Nouveau solde:</span>
              <span class="font-semibold text-emerald-800">{{ formatAmount(remainingAmount - form.amount) }} FCFA</span>
            </div>
            <div v-else class="flex justify-between pt-2 border-t border-emerald-200">
              <span class="text-emerald-700">Statut:</span>
              <span class="font-semibold text-emerald-600">Paiement complet</span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseFormModal>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import BaseFormModal from '@/components/common/BaseFormModal.vue'
import { useLoadingState } from '@/composables/useLoadingState'
import { useErrorHandler } from '@/composables/useErrorHandler'
import { useNotifications } from '@/composables/useNotifications'
import api from '@/api'
import { useStudentsStore } from '@/stores/students'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'saved'])

const studentsStore = useStudentsStore()
const { loading, withLoading } = useLoadingState()
const { error, fieldErrors, handleApiError, clearErrors, showSuccessMessage } = useErrorHandler()
const { showSuccess } = useNotifications()

// Données du formulaire
const form = ref({
  fee_id: '',
  student_id: '',
  amount: 0,
  payment_method: 'cash',
  payment_date: new Date().toISOString().split('T')[0],
  notes: ''
})

// Données chargées
const fees = ref([])
const students = ref([])
const selectedFee = ref(null)
const paidAmount = ref(0)

// Computed
const remainingAmount = computed(() => {
  if (!selectedFee.value) return 0
  return selectedFee.value.amount - paidAmount.value
})

const isFormValid = computed(() => {
  return form.value.fee_id &&
    form.value.student_id &&
    form.value.amount > 0 &&
    form.value.amount <= remainingAmount.value &&
    form.value.payment_method &&
    form.value.payment_date
})

// Charger les données
async function loadData() {
  try {
    await withLoading(async () => {
      // Charger les frais
      const feesResponse = await api.get('/finance/fees/')
      fees.value = feesResponse.data.results || feesResponse.data || []

      // Charger les élèves
      await studentsStore.fetchStudents()
      students.value = studentsStore.students
    })
  } catch (err) {
    handleApiError(err)
  }
}

// Gestionnaires d'événements
function onFeeChange() {
  const fee = fees.value.find(f => f.id === parseInt(form.value.fee_id))
  selectedFee.value = fee
  loadPaidAmount()
}

function onStudentChange() {
  loadPaidAmount()
}

async function loadPaidAmount() {
  if (!form.value.fee_id || !form.value.student_id) {
    paidAmount.value = 0
    return
  }

  try {
    const response = await api.get(`/finance/payments/by-student/${form.value.student_id}/`)
    const payments = response.data || []
    paidAmount.value = payments
      .filter(p => p.fee === parseInt(form.value.fee_id) && p.payment_status === 'completed')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
  } catch (err) {
    // Ignorer les erreurs silencieusement
    paidAmount.value = 0
  }
}

function handleClose() {
  clearErrors()
  form.value = {
    fee_id: '',
    student_id: '',
    amount: 0,
    payment_method: 'cash',
    payment_date: new Date().toISOString().split('T')[0],
    notes: ''
  }
  selectedFee.value = null
  paidAmount.value = 0
  emit('close')
}

async function handleSubmit() {
  if (!isFormValid.value) {
    return
  }

  // Validation supplémentaire
  if (form.value.amount > remainingAmount.value) {
    handleApiError({ response: { data: { amount: ['Le montant payé ne peut pas dépasser le solde restant.'] } } }, false)
    return
  }

  try {
    await withLoading(async () => {
      const response = await api.post('/finance/payments/register-payment/', form.value)
      showSuccess('Paiement enregistré avec succès !')
      emit('saved', response.data)
      handleClose()
    })
  } catch (err) {
    handleApiError(err)
  }
}

// Utilitaires
function formatAmount(amount) {
  if (!amount) return '0.00'
  return parseFloat(amount).toFixed(2)
}

function formatDate(dateString) {
  if (!dateString) return 'Non spécifiée'
  return new Date(dateString).toLocaleDateString('fr-FR')
}

function getPaymentMethodLabel(method) {
  const labels = {
    cash: 'Espèces',
    bank_transfer: 'Virement bancaire',
    mobile_money: 'Mobile Money',
    check: 'Chèque',
    other: 'Autre'
  }
  return labels[method] || method
}

// Watchers
watch(() => form.value.amount, (newAmount) => {
  if (newAmount > remainingAmount.value) {
    form.value.amount = remainingAmount.value
  }
})

onMounted(() => {
  loadData()
})
</script>

