export enum MoviesStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR'
}

export interface MoviesType {
  movieId: string;
  fullTitle: string;
  image: string;
  rating: number;
}
