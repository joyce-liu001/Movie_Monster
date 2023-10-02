export enum MovieStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  ERROR = 'ERROR'
}

export interface DirectorType {
  name: string;
  id: string;
}

export interface ActorType {
  id: string;
  image: string;
  name: string;
  asCharacter: string;
}

export interface ReviewType {
  reviewId: string;
  reviewerId: string;
  reviewerUsername: string;
  reviewString: string;
  rating: number;
  numThumbsUp: number;
  numThumbsDown: number;
  isThisUserThumbsUp: boolean;
  isThisUserThumbsDown: boolean;
  timeSent: number;
}

export interface MovieType {
  movieId: string;
  fullTitle: string;
  description: string;
  isWish: boolean;
  isWatch: boolean;
  isFavourite: boolean;
  image: string;
  releaseDate: string;
  rating: number;
  imdbRating: number;
  directorList: DirectorType[];
  actorList: ActorType[];
  genreList: string[];
  reviews: ReviewType[];
  hasReviewed: boolean;
  contentRating: number;
  status: MovieStatus
}
