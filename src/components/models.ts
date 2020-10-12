export interface Service {
  createdAt: number;
  createdBy: string;
  desiredCount: number;
  healthCheckGracePeriodSeconds: number;
  pendingCount: number;
  runningCount: number;
  serviceArn: string;
  serviceName: string;
  taskDefinition: string;
  tasks: string[];
}

export interface Cluster {
  activeServicesCount: number;
  clusterArn: string;
  clusterName: string;
  pendingTasksCount: number;
  runningTasksCount: number;
  services: Service[];
}

export interface Ecs {
  clusters: Cluster[];
}

export interface Button {
  id: number;
  colour: string;
  icon: string;
  label: string;
  labelAlignment?: string;
  labelPositon?: string;
  link?: string;
}

export enum EventType {
  TOKEN = 'TOKEN', LOG = 'LOG'
}
export interface LogEvent {
  eventType: EventType;
  token?: string;
  eventId: string;
  ingestionTime?: number;
  logStreamName: string;
  message: string;
  level?: string;
  tracingInfo?: string;
  timestamp?: number;
}

export enum OptionType {
  LIMIT, FILTER, TIME_SERIES
}
export interface ButtonOption {
  id: string;
  type: OptionType;
  label: string;
}

export enum NotificationType {
  TRACE, DEBUG, INFO, WARN, ERROR, TASK_STOPPAGE
}
export interface Notification {
  type: NotificationType;
  id?: string; // TODO set and use these
  date: Date;
  message: string;
  service?: string;
}
