import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { apiCall } from '../../utils/Helper';
import { MoviesStatus, MoviesType } from '../types/MoviesTypes';

export const moviesAdapter = createEntityAdapter<MoviesType>({
  selectId: (movie: MoviesType) => movie.movieId,
});

const initialState = moviesAdapter.getInitialState({
  status: MoviesStatus.IDLE,
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState: initialState,
  reducers: {
    clearMovies: (state) => moviesAdapter.removeAll(state),
  },
  extraReducers(builder) {
    builder
      .addCase(getMovies.pending, (state, _) => {
        state.status = MoviesStatus.LOADING;
      })
      .addCase(getMovies.fulfilled, (state, action) => {
        state.status = MoviesStatus.LOADED;
        moviesAdapter.addMany(state, action.payload.movies);
      })
      .addCase(getMovies.rejected, (state, _) => {
        state.status = MoviesStatus.ERROR;
      });
  },
});

const moviesReducer = moviesSlice.reducer;
export default moviesReducer;

export const { clearMovies } = moviesSlice.actions;

export const getMovies = createAsyncThunk(
  'movies/getMovies',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('GET', '/movie/list', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const {
  selectAll: selectMovies,
  selectTotal: selectMoviesTotal,
  selectById: selectMovieById,
  selectIds: selectMoviesIds,
} = moviesAdapter.getSelectors<RootState>((state: RootState) => state.movies);
