
import { GetterTree } from 'vuex'
import { StoreInterface } from '../index'
import { Central } from 'src/store/central/state'

const getters: GetterTree<Central, StoreInterface> = {
  getLimit (context) {
    return context.logLimit
  },
  getFilterPattern (context) {
    return context.filterPattern
  },
  getTimeSeriesStart (context) {
    return context.timeSeriesStart
  },
  getTimeSeriesEnd (context) {
    return context.timeSeriesEnd
  },
  getClusters (context) {
    return context.clusters
  },
  getLogs (context) {
    return context.logs
  },
  getNotifications (context) {
    return context.notifications
  }
}

export default getters
