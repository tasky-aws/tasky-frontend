import { Cluster, LogEvent, Notification } from 'components/models'

export interface Central {
  logLimit: number;
  filterPattern: string;
  timeSeriesStart: number;
  timeSeriesEnd: number;
  clusters: Cluster[];
  logs: LogEvent[];
  notifications: Notification[];
}

const state: Central = {
  logLimit: 100,
  filterPattern: '',
  timeSeriesStart: 0,
  timeSeriesEnd: 0,
  clusters: [],
  logs: [],
  notifications: []
}

export default state
