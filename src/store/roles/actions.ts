import { ActionTree } from 'vuex'
import { StoreInterface } from '../index'
import { Role, Roles } from './state'

// eslint-disable-next-line no-unused-vars
const actions: ActionTree<Roles, StoreInterface> = {
  addRoleAction (context, role: Role) {
    context.commit('updateActiveRole', role.arn)
    context.commit('addRole', role)
  },
  deleteRoleAction (context, role: Role) {
    context.commit('deleteRole', role.name)
  },
  updateActiveRoleAction (context, role: Role) {
    context.commit('updateActiveRole', role.arn)
  }
}

export default actions
