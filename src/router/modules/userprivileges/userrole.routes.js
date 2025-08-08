import AddUserRole from '../../../page/UserPrivileges/UserRole/AddUserRole.vue'
import EditUserRole from '../../../page/UserPrivileges/UserRole/EditUserRole.vue'
import ListUserRole from '../../../page/UserPrivileges/UserRole/ListUserRole.vue'
import ViewUserRole from '../../../page/UserPrivileges/UserRole/ViewUserRole.vue'

export default [
  {
   path: 'userprivileges/userroles',
    name: 'user-role-list',
    component: ListUserRole
  },
  {
   path: 'userprivileges/userroles/add',
    name: 'add-user-role',
    component: AddUserRole
  },
  {
   path: 'userprivileges/userroles/edit/:id',
    name: 'edit-user-role',
    component: EditUserRole,
    props: true
  },
  {
   path: 'userprivileges/userroles/view/:id',
    name: 'view-user-role',
    component: ViewUserRole,
    props: true
  }
]
