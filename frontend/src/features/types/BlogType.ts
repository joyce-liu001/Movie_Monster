export enum BlogStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR'
}

export interface BlogType {
  blogId: string;
  title: string;
  content: string;
  timeCreated: number;
  senderUsername: string;
  status: BlogStatus;
}

export interface BlogsType {
  blogId: string;
  title: string;
  content: string;
  timeCreated: number;
  senderUsername: string;
}
