import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authUserReducer from '../features/slices/AuthUserSlice';
import moviesReducer from '../features/slices/MoviesSlice';
// import logger from 'redux-logger';
import userReducer from '../features/slices/UserSlice';
import usersReducer from '../features/slices/UsersSlice';
import movieReducer from '../features/slices/MovieSlice';
import notificationReducer from '../features/slices/NotificationSlice';
import { loadState } from './broswser-storage';
import blogsReducer from '../features/slices/BlogsSlice';
import blogReducer from '../features/slices/BlogSlice';

const reducers = combineReducers({
  authUser: authUserReducer,
  user: userReducer,
  users: usersReducer,
  movie: movieReducer,
  movies: moviesReducer,
  blogs: blogsReducer,
  blog: blogReducer,
  notification: notificationReducer
});

const store = configureStore({
  reducer: reducers,
  preloadedState: loadState(),
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
