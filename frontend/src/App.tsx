import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, createTheme, CssBaseline, debounce, ThemeProvider } from '@mui/material';
import { generateTheme } from './utils/Helper';
import NavBar from './features/components/NavBar';
import HomePage from './features/pages/HomePage';
import LoginPage from './features/pages/LoginPage';
import NotFoundPage from './features/pages/NotFoundPage';
import PasswordResetPage from './features/pages/PasswordResetPage';
import RegisterPage from './features/pages/RegisterPage';
import UserPage from './features/pages/UserPage';
import UsersPage from './features/pages/UsersPage';
import MoviesPage from './features/pages/MoviesPage';
import MoviePage from './features/pages/MoviePage';
import BlogsPage from './features/pages/BlogsPage';
import NotificationBar from './features/components/NotificationBar';
import PageRoutes from './utils/PageRoutes';
import { saveState } from './app/broswser-storage';
import store from './app/store';
import LoggedInWrapper from './features/pages/wrappers/LoggedInWrapper';
import LoggedOutWrapper from './features/pages/wrappers/LoggedOutWrapper';
import ValidateEmailPage from './features/pages/ValidateEmailPage';
import { useAppDispatch } from './app/hooks';
import { checkAuthToken, getAuthUserStatus } from './features/slices/AuthUserSlice';
import BlogPage from './features/pages/BlogPage';
import { AuthUserStatus } from './features/types/AuthUserTypes';
import { useSelector } from 'react-redux';
import AboutPage from './features/pages/AboutPage';

// here we subscribe to the store changes
store.subscribe(
  // we use debounce to save the state once each 800ms
  // for better performances in case multiple changes occur in a short time
  debounce(() => {
    saveState(store.getState()).then();
  }, 800)
);

const App = () => {
  const authUserStatus = useSelector(getAuthUserStatus);
  const dispatch = useAppDispatch();
  const [mode, setMode] = React.useState('dark');
  const theme = React.useMemo(() => createTheme(generateTheme(mode)), [mode]);
  const toggleMode = () => setMode(mode === 'light' ? 'dark' : 'light');

  React.useEffect(() => {
    if (authUserStatus !== AuthUserStatus.LOGIN) {
      dispatch(checkAuthToken({})).unwrap().then();
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box mb={10}>
        <NavBar mode={mode} toggleMode={toggleMode}/>
      </Box>
      <NotificationBar/>
      <Box>
        <Routes>
          <Route element={<LoggedInWrapper />} >
            <Route path={PageRoutes.USERS} element={<UsersPage />} />
            <Route path={PageRoutes.USERS + '/:uId'} element={<UserPage />} />
            <Route path={PageRoutes.BLOGS} element={<BlogsPage />} />
            <Route path={PageRoutes.BLOGS + '/:blogId'} element={<BlogPage />} />
          </Route>

          <Route element={<LoggedOutWrapper />}>
            <Route path={PageRoutes.REGISTER} element={<RegisterPage />} />
            <Route path={PageRoutes.LOGIN} element={<LoginPage />} />
            <Route path={PageRoutes.PASSWORD_RESET} element={<PasswordResetPage />} />
          </Route>

          {/* Visible to public */}
          <Route path='*' element={<NotFoundPage />} />
          <Route path='/' element={<Navigate to={PageRoutes.HOME} />} />
          <Route path={PageRoutes.VALIDATE_EMAIL + '/:validationCode'} element={<ValidateEmailPage />} />
          <Route path={PageRoutes.ABOUT} element={<AboutPage />} />
          <Route path={PageRoutes.HOME} element={<HomePage />} />
          <Route path={PageRoutes.MOVIES} element={<MoviesPage />} />
          <Route path={PageRoutes.MOVIES + '/:movieId'} element={<MoviePage />}/>

        </Routes>
      </Box>
    </ThemeProvider>
  );
};

export default App;
