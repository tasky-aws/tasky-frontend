import { ActionTree } from 'vuex'
import { StoreInterface } from '../index'
import { Central } from 'src/store/central/state'
import { Cluster, LogEvent, NotificationType, Service } from 'components/models'

// eslint-disable-next-line no-unused-vars
const actions: ActionTree<Central, StoreInterface> = {
  updateLimitAction (context, logLimit: number) {
    context.commit('updateLimit', logLimit)
  },
  updateFilterPatternAction (context, pattern: string) {
    context.commit('updateFilterPattern', pattern)
  },
  updateTimeSeriesStart (context, start: number) {
    context.commit('updateTimeSeriesStart', start)
  },
  updateTimeSeriesEnd (context, end: number) {
    context.commit('updateTimeSeriesEnd', end)
  },
  addNotification (context, notification) {
    context.commit('addNotification', notification)
  },
  clearNotification (context, dateMillis) {
    context.commit('clearNotification', dateMillis)
  },
  updateClusters (context, updatedClusters) {
    const stateClusters = context.rootGetters['central/getClusters'].clusters

    if (stateClusters !== undefined) {
      const serviceTaskMapping: Record<string, string> = {}
      // @ts-ignore
      stateClusters.forEach((cluster: Cluster) => cluster.services.forEach((service: Service) => {
        // eslint-disable-next-line no-return-assign
        if (service.serviceName !== undefined) {
          service.tasks.forEach((task) => {
            serviceTaskMapping[task] = service.serviceName
          })
        }
      }))
      const stateTasks: string[] = Object.keys(serviceTaskMapping)
      // @ts-ignore
      const tasksToUpdate: string[] = updatedClusters.clusters.flatMap((cluster: Cluster) => cluster.services.flatMap((service: Service) => service.tasks))
      const removedTasks = stateTasks.filter(state => !tasksToUpdate.find(update => state === update))
      console.log(removedTasks)
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      if (removedTasks.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        removedTasks.forEach(taskToNotify => {
          if (taskToNotify !== undefined) {
            context.dispatch('addNotification', {
              type: NotificationType.TASK_STOPPAGE,
              date: new Date(),
              service: serviceTaskMapping[taskToNotify],
              message: 'Task was removed, arn: ' + taskToNotify
            })
          }
        })
      }
    }

    context.commit('updateClusters', updatedClusters)
  },
  updateLogs (context, logs: LogEvent[]) {
    context.commit('updateLogs', logs)
  }
}

export default actions
