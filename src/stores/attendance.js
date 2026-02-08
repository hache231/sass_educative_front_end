import { defineStore } from 'pinia'
import api from '@/api/axios'

export const useAttendanceStore = defineStore('attendance', {
    state: () => ({
        attendances: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchAttendances(params = {}) {
            this.loading = true
            this.error = null
            try {
                const response = await api.get('/attendance/attendances/', { params })
                this.attendances = response.data
                return response.data
            } catch (error) {
                this.error = 'Erreur lors du chargement des présences'
                console.error('Error fetching attendances:', error)
                throw error
            } finally {
                this.loading = false
            }
        },

        async submitAttendance(data) {
            this.loading = true;
            this.error = null;
            try {
                // Utiliser l'endpoint bulk_create pour soumettre une liste
                const response = await api.post('/attendance/attendances/bulk_create/', data);
                return response.data;
            } catch (error) {
                this.error = "Erreur lors de l'enregistrement des présences";
                console.error('Error submitting attendance:', error);
                throw error;
            } finally {
                this.loading = false
            }
        },

        async updateAttendance(id, data) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.patch(`/attendance/attendances/${id}/`, data);
                // Mettre à jour l'élément dans la liste locale
                const index = this.attendances.findIndex(a => a.id === id);
                if (index !== -1) {
                    this.attendances[index] = response.data;
                }
                return response.data;
            } catch (error) {
                this.error = "Erreur lors de la mise à jour de la présence";
                console.error('Error updating attendance:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
})
