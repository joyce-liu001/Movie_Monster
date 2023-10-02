import { MoviesType } from './MoviesTypes';

export enum Status {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

export enum UserStatus {
  PUBLIC = 'public',
  PRIVATE = 'private',
  FRIEND = 'friend',
}

export interface UserType {
  uId: string;
  username: string;
  email: string;
  age: number;
  gender: string;
  isAdmin: boolean;
  image: string;
  wishList: MoviesType[];
  watchList: MoviesType[];
  favouriteList: MoviesType[];
  userStatus: UserStatus;
  isBlocked: boolean;
  status: Status;
}
