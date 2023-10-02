import { createAsyncThunk, createDraftSafeSelector, createSlice } from '@reduxjs/toolkit';
import { apiCall } from '../../utils/Helper';
import { MovieStatus, MovieType } from '../types/MovieTypes';
import { RootState } from '../../app/store';
import { showNotification } from './NotificationSlice';
import { NotificationStatus } from '../types/NotificationType';

// const testState: MovieType = {
//   movieId: '1',
//   fullTitle: 'The Shawshank Redemption',
//   description: 'Two imprisoned',
//   isWish: false,
//   isWatch: false,
//   isFavourite: false,
//   image: 'https://m.media-amazon.com/images/M/MV5BODQwMTc3NTAxOV5BMl5BanBnXkFtZTgwNDUyNjQ0NzM@._V1_SY1000_CR0,0,674,1000_AL_.jpg',
//   rating: 9.3,
//   releaseDate: '1994-09-10',
//   imdbRating: 9.3,
//   directorList: [{ id: '1', name: 'Frank Darabont' }],
//   genreList: ['Drama'],
//   actorList: [],
//   reviews: [
//   ],
//   status: MovieStatus.IDLE,
// };

const initialState: MovieType = {
  movieId: '',
  fullTitle: '',
  description: '',
  isWish: false,
  isWatch: false,
  isFavourite: false,
  image: '',
  releaseDate: '',
  rating: 0.0,
  imdbRating: 0.0,
  directorList: [],
  actorList: [],
  genreList: [],
  reviews: [],
  hasReviewed: false,
  contentRating: 0,
  status: MovieStatus.IDLE
};

const movieSlice = createSlice({
  name: 'movie',
  initialState: initialState,
  reducers: {
    setMovieWish: (state, action) => {
      state.isWish = action.payload;
    },
    setMovieWatch: (state, action) => {
      state.isWatch = action.payload;
    },
    setMovieFavourite: (state, action) => {
      state.isFavourite = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMovie.pending, (state, _) => {
        state.status = MovieStatus.LOADING;
      })
      .addCase(getMovie.fulfilled, (state, action) => {
        state.status = MovieStatus.IDLE;
        state.movieId = action.payload.movie.movieId;
        state.fullTitle = action.payload.movie.fullTitle;
        state.description = action.payload.movie.description;
        // TODO: change some field
        // state.isWish = action.payload.movie.isWish;
        // state.isWatch = action.payload.movie.isWatch;
        // state.isFavourite = action.payload.movie.isFavourite;
        state.isWatch = action.payload.movie.watched;
        state.isWish = action.payload.movie.wish;
        state.isFavourite = action.payload.movie.favourite;
        state.image = action.payload.movie.image;
        state.releaseDate = action.payload.movie.releaseDate;
        state.rating = action.payload.movie.rating;
        state.imdbRating = action.payload.movie.imdbRating;
        state.directorList = action.payload.movie.directorList;
        state.actorList = action.payload.movie.actorList;
        state.genreList = action.payload.movie.genreList;
        state.reviews = action.payload.movie.reviews;
        state.hasReviewed = action.payload.movie.hasReviewed;
        state.contentRating = action.payload.movie.contentRating;
      })
      .addCase(getMovie.rejected, (state, action) => {
        state = initialState;
        state.status = MovieStatus.ERROR;
      });
  }
});

export const { setMovieWish, setMovieWatch, setMovieFavourite } = movieSlice.actions;

const movieReducer = movieSlice.reducer;
export default movieReducer;

export const getMovie = createAsyncThunk(
  'movie/getMovie',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('GET', '/movie/details', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addMovie = createAsyncThunk(
  'movie/addMovie',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/admin/movie/add', arg, true, dispatch, getState);
      dispatch(showNotification({ message: 'Movie added!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
      return { ...rspData, ...arg };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateMovie = createAsyncThunk(
  'movie/updateMovie',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('PUT', '/admin/movie/update', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addMovieReview = createAsyncThunk(
  'movie/review',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/movie/review', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const movieReviewThumbUp = createAsyncThunk(
  'review/thumbsup',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/review/thumbsup', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const movieReviewThumbDown = createAsyncThunk(
  'review/thumbsdown',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/review/thumbsdown', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const movieReviewEdit = createAsyncThunk(
  'review/edit',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('PUT', '/review/edit', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteMovieReview = createAsyncThunk(
  'review/remove',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('DELETE', '/review/remove', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getMovieRecommendations = createAsyncThunk(
  'movie/recommendations',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('GET', '/movie/recommendations', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const shareMovie = createAsyncThunk(
  'movie/share',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/user/sharemovie', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const selectMovie = createDraftSafeSelector(
  (state: RootState) => state,
  (state) => state.movie
);

export const selectMovieId = createDraftSafeSelector(
  (state: RootState) => state,
  (state) => state.movie.movieId
);

export const selectMovieReviews = createDraftSafeSelector(
  (state: RootState) => state,
  (state) => state.movie.reviews
);

export const selectMovieHasReviewed = createDraftSafeSelector(
  (state: RootState) => state,
  (state) => state.movie.hasReviewed
);
