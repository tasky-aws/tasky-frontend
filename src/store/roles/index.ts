import { Module } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state, { Roles } from 'src/store/roles/state'
import { StoreInterface } from 'src/store'

const module: Module<Roles, StoreInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default module
