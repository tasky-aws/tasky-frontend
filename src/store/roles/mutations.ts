import { MutationTree } from 'vuex'
import { Role, Roles } from 'src/store/roles/state'

const mutation: MutationTree<Roles> = {
  updateActiveRole (state, role: string) {
    state.activeRole = role
  },
  updateRoles (state, roles: Role[]) {
    state.roles = roles
  },
  deleteRole (state, roleName: string) {
    state.roles = state.roles.filter((element) => element.name !== roleName)
  },
  addRole (state, role: Role) {
    const roles: Roles = state
    roles.roles.push(role)
    state = roles
  }
}

export default mutation
