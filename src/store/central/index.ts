import { Module } from 'vuex'
import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state, { Central } from 'src/store/central/state'
import { StoreInterface } from 'src/store'

const module: Module<Central, StoreInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state
}

export default module
