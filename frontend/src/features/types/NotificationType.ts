export enum NotificationStatus {
  HIDDEN = 'HIDDEN',
  SHOWING = 'SHOWING',
}

export enum InformationType {
  INFO = 'info',
  SUCCESS = 'success',
  ERROR = 'error',
}

export interface NotificationType {
  message: string;
  httpStatus: number;
  type: InformationType;
  status: NotificationStatus;
}
