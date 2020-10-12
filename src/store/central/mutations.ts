import { MutationTree } from 'vuex'
import { Central } from 'src/store/central/state'
import { Cluster, EventType, LogEvent, Notification } from 'components/models'

const dateRgx = new RegExp('(\\d{4}-[0-1]\\d-[0-3]\\d)')
const oldTimeRgx = new RegExp('(?<oldTimestamp>[0-2]\\d:[0-5]\\d:[0-6]\\d.\\d{3})')
const timeRgx = new RegExp('(?<timestamp>[0-2]\\d:[0-5]\\d:[0-6]\\d)')
const levelRgx = new RegExp('(?<level>INFO|ERROR|WARN|TRACE|DEBUG|FATAL)')
const sampledRgx = new RegExp('(?<sampled>sampled=(true|false|))')
const tracingRegex = new RegExp('(?<traceId>(traceId=.{16}|traceId=), )(?<spanId>(spanId=.{16}|spanId=), )')

export function replaceData (message: string): string {
  // eslint-disable-next-line no-unused-vars
  const classRgx = new RegExp('\\[(?<class>[^\\]]+)]')
  // eslint-disable-next-line no-unused-vars
  const threadRgx = new RegExp('\\[(?<thread>[^\\]]+)]')
  return message
    .replace(dateRgx, '')
    .replace(oldTimeRgx, '')
    .replace(timeRgx, '')
    .replace(sampledRgx, '')
    .replace(tracingRegex, '')
    .replace(levelRgx, '')
}

const mutation: MutationTree<Central> = {
  updateLimit (state, logLimit: number) {
    state.logLimit = logLimit
  },
  updateFilterPattern (state, filterPattern: string) {
    state.filterPattern = filterPattern
  },
  updateTimeSeriesStart (state, start: number) {
    state.timeSeriesStart = start
  },
  updateTimeSeriesEnd (state, end: number) {
    state.timeSeriesEnd = end
  },
  updateClusters (state, clusters: Cluster[]) {
    state.clusters = clusters
  },
  addNotification (state, notification: Notification) {
    state.notifications = state.notifications.filter(element => {
      const eventDate = element.date
      const now = new Date()
      now.setMinutes(now.getMinutes() - 30)
      return eventDate.getUTCMilliseconds() > now.getUTCMilliseconds()
    })
    state.notifications.push(notification)
  },
  clearNotification (state, dateMillis: number) {
    state.notifications = state.notifications.filter(element => element.date.getUTCMilliseconds() !== dateMillis)
  },
  updateLogs (state, logs: LogEvent[]) {
    const stateLogs: LogEvent[] = state.logs
    const elementsById = stateLogs.map(element => element.eventId)

    if (logs.length === 0) {
      state.logs = []
    } else {
      logs
        .filter(element => element.eventType === EventType.LOG)
        .filter(element => stateLogs.filter(innerItem => element.eventId !== innerItem.eventId))
        .forEach(element => {
          const log: LogEvent = {
            eventId: element.eventId,
            eventType: element.eventType,
            timestamp: element.timestamp,
            ingestionTime: element.ingestionTime,
            level: levelRgx.exec(element.message)?.toString().split(',')[0],
            logStreamName: element.logStreamName,
            message: replaceData(element.message),
            tracingInfo: tracingRegex.exec(element.message)?.toString().split(',')[0]
          }
          if (!elementsById.includes(element.eventId)) {
            stateLogs.splice(logs.length, 0, log)
          }
        })

      stateLogs.sort((a: LogEvent, b: LogEvent) => {
        if (a.timestamp !== undefined && b.timestamp !== undefined) {
          return b?.timestamp - a?.timestamp
        } else {
          return 0
        }
      }).reverse()

      state.logs = stateLogs
    }
  }
}

export default mutation
