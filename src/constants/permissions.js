/**
 * Constantes pour les permissions et mappings de routes.
 * 
 * Centralise tous les mappings de permissions pour éviter la duplication
 * entre les différents fichiers (router, composables, layouts).
 */

/**
 * Mapping des routes vers les permissions requises
 */
export const ROUTE_PERMISSIONS = {
  'Dashboard': null, // Accessible à tous les utilisateurs authentifiés
  'Students': 'view_students',
  'Teachers': 'view_teachers',
  'Academics': 'view_programs',
  'Assessments': 'view_assessments',
  'Schedules': 'view_schedules',
  'Finance': 'view_finance',
  'Communications': ['view_notifications', 'view_messages', 'view_announcements'], // Au moins une de ces permissions
  'Reports': 'view_reports',
  'Documents': 'view_documents',
  'Settings': ['change_settings', 'manage_roles', 'manage_users'], // Au moins une de ces permissions
}

/**
 * Mapping des actions vers les permissions
 */
export const ACTION_PERMISSIONS = {
  // Students
  'add_student': 'add_students',
  'edit_student': 'change_students',
  'delete_student': 'delete_students',
  'view_student': 'view_students',
  
  // Teachers
  'add_teacher': 'add_teachers',
  'edit_teacher': 'change_teachers',
  'delete_teacher': 'delete_teachers',
  'view_teacher': 'view_teachers',
  
  // Academics
  'add_program': 'add_programs',
  'edit_program': 'change_programs',
  'delete_program': 'delete_programs',
  'view_program': 'view_programs',
  
  // Assessments
  'add_assessment': 'add_assessments',
  'edit_assessment': 'change_assessments',
  'delete_assessment': 'delete_assessments',
  'view_assessment': 'view_assessments',
  
  // Schedules
  'add_schedule': 'add_schedules',
  'edit_schedule': 'change_schedules',
  'delete_schedule': 'delete_schedules',
  'view_schedule': 'view_schedules',
  
  // Finance
  'add_payment': 'add_payments',
  'edit_payment': 'change_payments',
  'delete_payment': 'delete_payments',
  'view_payment': 'view_payments',
  
  // Communications
  'add_communication': 'add_communications',
  'edit_communication': 'change_communications',
  'delete_communication': 'delete_communications',
  'view_communication': 'view_communications',
  
  // Reports
  'generate_report': 'generate_reports',
  'view_report': 'view_reports',
  
  // Documents
  'add_document': 'add_documents',
  'edit_document': 'change_documents',
  'delete_document': 'delete_documents',
  'view_document': 'view_documents',
  
  // Settings
  'manage_users': 'manage_users',
  'manage_roles': 'manage_roles',
  'manage_settings': 'manage_settings',
}

/**
 * Configuration des éléments de menu avec leurs permissions
 */
export const MENU_ITEMS = [
  { name: 'Dashboard', label: 'Tableau de bord', icon: 'home', permission: null },
  { name: 'Students', label: 'Élèves', icon: 'user-graduate', permission: 'view_students' },
  { name: 'Teachers', label: 'Enseignants', icon: 'chalkboard-teacher', permission: 'view_teachers' },
  { name: 'Academics', label: 'Programmes', icon: 'book-open', permission: 'view_programs' },
  { name: 'Assessments', label: 'Évaluations', icon: 'clipboard-check', permission: 'view_assessments' },
  { name: 'Schedules', label: 'Emploi du temps', icon: 'calendar-alt', permission: 'view_schedules' },
  { name: 'Finance', label: 'Finances', icon: 'wallet', permission: 'view_finance' },
  { name: 'Communications', label: 'Communications', icon: 'comments', permission: ['view_notifications', 'view_messages', 'view_announcements'] },
  { name: 'Reports', label: 'Rapports', icon: 'chart-pie', permission: 'view_reports' },
  { name: 'Documents', label: 'Documents', icon: 'folder-open', permission: 'view_documents' },
  { name: 'Settings', label: 'Paramètres', icon: 'sliders-h', permission: ['change_settings', 'manage_roles', 'manage_users'] },
]

