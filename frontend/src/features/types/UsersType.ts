import { MoviesType } from './MoviesTypes';

export enum UsersStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error',
}

// Object containing keys {uId, username, email, isAdmin, image, wishList, watchList, favouriteList}
export interface UsersType {
  uId: string;
  username: string;
  email: string;
  isAdmin: boolean;
  image: string;
  wishList: MoviesType[];
  watchedList: MoviesType[];
  favouriteList: MoviesType[];
}
