<template>
  <div class="card">
    <div class="card-header">
      <h5 class="mb-0">Nouveau message</h5>
    </div>
    <div class="card-body">
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="message-recipient" class="form-label">Destinataire *</label>
          <select
            class="form-select"
            id="message-recipient"
            v-model="form.recipient"
            required
          >
            <option value="">Sélectionner un destinataire</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.full_name }} ({{ user.email }})
            </option>
          </select>
        </div>
        
        <div class="mb-3">
          <label for="message-subject" class="form-label">Sujet *</label>
          <input
            type="text"
            class="form-control"
            id="message-subject"
            v-model="form.subject"
            required
          />
        </div>
        
        <div class="mb-3">
          <label for="message-content" class="form-label">Contenu *</label>
          <textarea
            class="form-control"
            id="message-content"
            v-model="form.content"
            rows="5"
            required
          ></textarea>
        </div>
        
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-secondary me-2" @click="$emit('cancel')">
            Annuler
          </button>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Envoi...' : 'Envoyer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCommunicationsStore } from '@/stores/communications'
import { useSettingsStore } from '@/stores/settings'

const emit = defineEmits(['sent', 'cancel'])

const communicationsStore = useCommunicationsStore()
const settingsStore = useSettingsStore()

const loading = ref(false)
const users = ref([])
const form = ref({
  recipient: '',
  subject: '',
  content: ''
})

onMounted(async () => {
  try {
    await settingsStore.fetchUsers()
    users.value = settingsStore.users || []
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
  }
})

async function handleSubmit() {
  loading.value = true
  try {
    await communicationsStore.createMessage(form.value)
    emit('sent')
    form.value = { recipient: '', subject: '', content: '' }
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
  } finally {
    loading.value = false
  }
}
</script>

