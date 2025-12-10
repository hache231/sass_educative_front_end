# Système de Permissions

Ce document explique comment utiliser le système de permissions dans l'application frontend.

## Vue d'ensemble

Le système de permissions contrôle l'accès aux fonctionnalités de l'application en fonction des rôles et permissions de l'utilisateur connecté. Les permissions sont récupérées depuis le backend lors de la connexion et stockées dans le store d'authentification.

## Composable `usePermissions`

Le composable `usePermissions` fournit des fonctions utilitaires pour vérifier les permissions :

```javascript
import { usePermissions } from '@/composables/usePermissions'

const { 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  canAccessRoute,
  canPerformAction 
} = usePermissions()

// Vérifier une permission unique
if (hasPermission('add_students')) {
  // L'utilisateur peut créer des élèves
}

// Vérifier au moins une permission parmi plusieurs
if (hasAnyPermission(['view_notifications', 'view_messages'])) {
  // L'utilisateur peut voir au moins un type de communication
}

// Vérifier toutes les permissions
if (hasAllPermissions(['add_students', 'change_students'])) {
  // L'utilisateur peut créer ET modifier des élèves
}

// Vérifier l'accès à une route
if (canAccessRoute('Students')) {
  // L'utilisateur peut accéder à la page Students
}

// Vérifier une action
if (canPerformAction('add_student')) {
  // L'utilisateur peut effectuer l'action "add_student"
}
```

## Composant `PermissionGuard`

Le composant `PermissionGuard` permet de masquer/afficher du contenu selon les permissions :

```vue
<template>
  <!-- Masquer/afficher un bouton -->
  <PermissionGuard permission="add_students">
    <button @click="createStudent">Nouvel élève</button>
  </PermissionGuard>

  <!-- Avec plusieurs permissions (OR) -->
  <PermissionGuard :permission="['view_notifications', 'view_messages']">
    <div>Contenu visible si l'utilisateur a au moins une de ces permissions</div>
  </PermissionGuard>

  <!-- Avec plusieurs permissions (AND) -->
  <PermissionGuard 
    :permission="['add_students', 'change_students']" 
    :require-all="true"
  >
    <div>Contenu visible uniquement si l'utilisateur a TOUTES les permissions</div>
  </PermissionGuard>

  <!-- Masquer une section complète -->
  <PermissionGuard permission="delete_students">
    <div class="danger-zone">
      <h3>Zone de suppression</h3>
      <button @click="deleteAll">Supprimer tout</button>
    </div>
  </PermissionGuard>
</template>

<script setup>
import PermissionGuard from '@/components/common/PermissionGuard.vue'
</script>
```

## Guards de Route

Les routes sont automatiquement protégées par des guards de permissions. Les permissions requises sont définies dans la configuration des routes :

```javascript
{
  path: 'students',
  name: 'Students',
  component: () => import('@/views/students/StudentsView.vue'),
  meta: { permission: 'view_students' }
}
```

Pour plusieurs permissions (au moins une requise) :

```javascript
{
  path: 'communications',
  name: 'Communications',
  component: () => import('@/views/communications/CommunicationsView.vue'),
  meta: { permission: ['view_notifications', 'view_messages', 'view_announcements'] }
}
```

Si un utilisateur tente d'accéder à une route sans la permission requise, il sera automatiquement redirigé vers le Dashboard.

## Menu Sidebar

Le menu sidebar filtre automatiquement les éléments selon les permissions de l'utilisateur. Seuls les éléments de menu pour lesquels l'utilisateur a la permission sont affichés.

## Mapping des Permissions

### Routes
- `Dashboard`: Aucune permission requise (accessible à tous)
- `Students`: `view_students`
- `Teachers`: `view_teachers`
- `Academics`: `view_programs`
- `Assessments`: `view_assessments`
- `Schedules`: `view_schedules`
- `Finance`: `view_finance`
- `Communications`: `['view_notifications', 'view_messages', 'view_announcements']` (au moins une)
- `Reports`: `view_reports`
- `Documents`: `view_documents`
- `Settings`: `['change_settings', 'manage_roles', 'manage_users']` (au moins une)

### Actions courantes
- `add_student`: `add_students`
- `edit_student`: `change_students`
- `delete_student`: `delete_students`
- `view_student`: `view_students`

## Exemples d'utilisation dans les vues

### Exemple 1: Masquer un bouton de création

```vue
<template>
  <div class="header-actions">
    <PermissionGuard permission="add_students">
      <button @click="createNew" class="btn btn-primary">
        Nouvel élève
      </button>
    </PermissionGuard>
  </div>
</template>
```

### Exemple 2: Masquer des actions dans un tableau

```vue
<template>
  <td>
    <div class="flex gap-2">
      <PermissionGuard permission="view_students">
        <button @click="view(item)" class="btn-icon">
          <font-awesome-icon icon="eye" />
        </button>
      </PermissionGuard>
      
      <PermissionGuard permission="change_students">
        <button @click="edit(item)" class="btn-icon">
          <font-awesome-icon icon="edit" />
        </button>
      </PermissionGuard>
      
      <PermissionGuard permission="delete_students">
        <button @click="delete(item)" class="btn-icon">
          <font-awesome-icon icon="trash" />
        </button>
      </PermissionGuard>
    </div>
  </td>
</template>
```

### Exemple 3: Utilisation directe dans le script

```vue
<script setup>
import { usePermissions } from '@/composables/usePermissions'

const { hasPermission } = usePermissions()

function handleCreate() {
  if (!hasPermission('add_students')) {
    alert('Vous n\'avez pas la permission de créer des élèves')
    return
  }
  // Logique de création...
}
</script>
```

## Notes importantes

1. **Superadmins**: Les superadmins ont automatiquement toutes les permissions
2. **Admins d'école**: Les admins d'école ont automatiquement toutes les permissions pour leur école
3. **Permissions multiples**: Utilisez un tableau pour vérifier plusieurs permissions (OR par défaut, AND avec `requireAll: true`)
4. **Performance**: Les permissions sont chargées une fois lors de la connexion et mises en cache dans le store

## Ajout de nouvelles permissions

Pour ajouter une nouvelle permission :

1. Créer la permission dans le backend (via la commande `create_permissions` ou l'admin Django)
2. Ajouter le mapping dans `frontend/src/composables/usePermissions.js` si nécessaire
3. Utiliser la permission dans les composants avec `PermissionGuard` ou `usePermissions()`

