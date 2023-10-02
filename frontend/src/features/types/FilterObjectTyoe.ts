export enum SortType {
  BY_NAME = 'name',
  BY_RATING = 'rating',
}

export interface FilterObjectType {
  query: string;
  genre: string;
  director: string;
  sort: SortType;
  ignoreWish: boolean;
  ignoreWatch: boolean;
  ignoreFavourite: boolean;
}
