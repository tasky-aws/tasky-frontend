import { GetterTree } from 'vuex'
import { StoreInterface } from '../index'
import { Roles } from 'src/store/roles/state'

const getters: GetterTree<Roles, StoreInterface> = {
  getActiveRole (context) {
    return context.activeRole
  },
  getRoles (context) {
    return context.roles
  }
}

export default getters
