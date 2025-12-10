/**
 * Service API pour les paramètres et configurations.
 */

import api from './index'

// Settings
export const getSettings = () => api.get('/settings/my_settings/')
export const updateSettings = (data) => api.put('/settings/my_settings/', data)
export const patchSettings = (data) => api.patch('/settings/my_settings/', data)

// Roles
export const getRoles = () => api.get('/accounts/roles/')
export const getRole = (id) => api.get(`/accounts/roles/${id}/`)
export const createRole = (data) => api.post('/accounts/roles/', data)
export const updateRole = (id, data) => api.put(`/accounts/roles/${id}/`, data)
export const patchRole = (id, data) => api.patch(`/accounts/roles/${id}/`, data)
export const deleteRole = (id) => api.delete(`/accounts/roles/${id}/`)
export const getRoleUsers = (id) => api.get(`/accounts/roles/${id}/users/`)

// Permissions
export const getPermissions = () => api.get('/accounts/permissions/')
export const getPermissionsByCategory = () => api.get('/accounts/permissions/by_category/')

// User Roles
export const getUserRoles = () => api.get('/accounts/user-roles/')
export const assignUserRole = (data) => api.post('/accounts/user-roles/', data)
export const removeUserRole = (id) => api.delete(`/accounts/user-roles/${id}/`)

// Users
export const getUsers = (params) => api.get('/accounts/users/', { params })
export const getUser = (id) => api.get(`/accounts/users/${id}/`)
export const createUser = (data) => api.post('/accounts/users/', data)
export const updateUser = (id, data) => api.put(`/accounts/users/${id}/`, data)
export const patchUser = (id, data) => api.patch(`/accounts/users/${id}/`, data)
export const deleteUser = (id) => api.delete(`/accounts/users/${id}/`)
export const resetUserPassword = (id) => api.post(`/accounts/users/${id}/reset_password/`)
export const toggleUserActive = (id) => api.post(`/accounts/users/${id}/toggle_active/`)

// School
export const getMySchool = () => api.get('/schools/my_school/')
export const updateSchoolLogo = (logoFile) => {
  const formData = new FormData()
  formData.append('logo', logoFile)
  return api.patch('/schools/my_school/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

