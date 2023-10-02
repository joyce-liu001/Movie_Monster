import { apiCall } from '../../utils/Helper';
import { createAsyncThunk, createDraftSafeSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { AuthUserType, AuthUserStatus, AuthType } from '../types/AuthUserTypes';
import { showNotification } from './NotificationSlice';
import { NotificationStatus } from '../types/NotificationType';

const initialState: AuthUserType = {
  username: '',
  uId: '',
  email: '',
  token: '',
  role: null,
  image: '',
  status: AuthUserStatus.LOGOUT
};

const authUserSlice = createSlice({
  name: 'authUser',
  initialState: initialState,
  reducers: {
    clearAuthUser: (state) => {
      state.username = '';
      state.uId = '';
      state.email = '';
      state.token = '';
      state.image = '';
      state.role = null;
      state.status = AuthUserStatus.LOGOUT;
    },
  },
  extraReducers (builder) {
    builder
      .addCase(checkAuthToken.pending, (state, _) => {
        state.status = AuthUserStatus.LOADING;
      })
      .addCase(checkAuthToken.fulfilled, (state, action) => {
        if (action.payload.isLoggedIn === false) {
          state.status = AuthUserStatus.LOGOUT;
          state.token = '';
          state.uId = '';
          state.role = null;
          state.email = '';
          state.username = '';
        } else {
          state.status = AuthUserStatus.LOGIN;
        }
      })
      .addCase(checkAuthToken.rejected, (state, _) => {
        state.status = AuthUserStatus.LOGOUT;
        state.token = '';
        state.uId = '';
        state.role = null;
        state.email = '';
        state.username = '';
      })
      .addCase(getLoginAuthUser.pending, (state, _) => {
        state.status = AuthUserStatus.LOADING;
      })
      .addCase(getLoginAuthUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.uId = action.payload.uId;
        state.status = AuthUserStatus.LOGIN;
      })
      .addCase(getLoginAuthUser.rejected, (state, _) => {
        state.status = AuthUserStatus.LOGOUT;
      })
      .addCase(getRegisterAuthUser.pending, () => {
        // Empty
      })
      .addCase(getRegisterAuthUser.fulfilled, () => {
        // Empty
      })
      .addCase(getRegisterAuthUser.rejected, (state, _) => {
        state.status = AuthUserStatus.LOGOUT;
      })
      .addCase(getLogoutAuthUser.pending, (state, _) => {
        state.status = AuthUserStatus.LOADING;
      })
      .addCase(getLogoutAuthUser.fulfilled, (state, _) => {
        state.username = '';
        state.email = '';
        state.token = '';
        state.uId = '';
        state.role = AuthType.USER;
        state.status = AuthUserStatus.LOGOUT;
      })
      .addCase(getLogoutAuthUser.rejected, (state, _) => {
        state.username = '';
        state.email = '';
        state.token = '';
        state.uId = '';
        state.role = AuthType.USER;
        state.status = AuthUserStatus.LOGOUT;
      })
      .addCase(getLogoutAllAuthUser.pending, (state, _) => {
        state.status = AuthUserStatus.LOADING;
      })
      .addCase(getLogoutAllAuthUser.fulfilled, (state, _) => {
        state.username = '';
        state.email = '';
        state.token = '';
        state.uId = '';
        state.role = AuthType.USER;
        state.status = AuthUserStatus.LOGOUT;
      })
      .addCase(getLogoutAllAuthUser.rejected, (state, _) => {
        state.status = AuthUserStatus.LOGOUT;
      })
      .addCase(getAuthUserValidate.pending, (state, _) => {
        state.status = AuthUserStatus.LOADING;
      })
      .addCase(getAuthUserValidate.fulfilled, (state, action) => {
        state.status = AuthUserStatus.LOGIN;
        state.token = action.payload.token;
        state.uId = action.payload.uId;
        state.role = action.payload.role;
      })
      .addCase(getAuthUserValidate.rejected, (state, _) => {
        state.status = AuthUserStatus.LOGOUT;
        state.token = '';
        state.uId = '';
        state.role = null;
      })
      .addCase(getAuthUserInfo.pending, (state, _) => {
        // Empty
      })
      .addCase(getAuthUserInfo.fulfilled, (state, action) => {
        if (action.payload.user.isAdmin) state.role = AuthType.ADMIN;
        else state.role = AuthType.USER;
        state.username = action.payload.user.username;
        state.email = action.payload.user.email;
        state.image = action.payload.user.image;
      })
      .addCase(getAuthUserInfo.rejected, (state, _) => {
        // Empty
      });
  }
});

export const { clearAuthUser } = authUserSlice.actions;

const authUserReducer = authUserSlice.reducer;
export default authUserReducer;

export const checkAuthToken = createAsyncThunk(
  'authUser/checkAuthToken',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('GET', '/auth/checktoken', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  });

export const getLoginAuthUser = createAsyncThunk(
  'auth/user/login',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/auth/login', arg, false, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  });

export const getRegisterAuthUser = createAsyncThunk(
  'auth/user/register',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/auth/register', arg, false, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAuthUserValidate = createAsyncThunk(
  'auth/validate',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/auth/validate', arg, false, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAuthUserInfo = createAsyncThunk(
  'auth/user/info',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('GET', '/user/profile', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getLogoutAuthUser = createAsyncThunk(
  'auth/user/logout',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/auth/logout', arg, true, dispatch, getState);
      return { ...rspData };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getLogoutAllAuthUser = createAsyncThunk(
  'auth/user/logout/all',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/auth/logout/all', arg, true, dispatch, getState);
      return { ...rspData };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const passwordResetRequest = createAsyncThunk(
  '/auth/passwordreset/request',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/auth/passwordreset/request', arg, false, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const passwordReset = createAsyncThunk(
  '/auth/passwordreset/reset',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/auth/passwordreset/reset', arg, false, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      throw rejectWithValue(err);
    }
  }
);

export const addWatchListToAuthUser = createAsyncThunk(
  'auth/user/watchlist/add',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/user/watchedlist/add', arg, true, dispatch, getState);
      dispatch(showNotification({ message: 'Add to watch list successfully!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
      return { ...rspData };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addWishListToAuthUser = createAsyncThunk(
  '/user/wishlist/add',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/user/wishlist/add', arg, true, dispatch, getState);
      dispatch(showNotification({ message: 'Add to wish list successfully!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
      return { ...rspData };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const addFavouriteListToAuthUser = createAsyncThunk(
  '/user/favourite/add',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/user/favouritelist/add', arg, true, dispatch, getState);
      dispatch(showNotification({ message: 'Add to favourite list successfully!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
      return { ...rspData };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const removeWatchListFromAuthUser = createAsyncThunk(
  '/user/watchlist/remove',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('DELETE', '/user/watchedlist/remove', arg, true, dispatch, getState);
      dispatch(showNotification({ message: 'Remove from watch list successfully!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
      return { ...rspData };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const removeWishListFromAuthUser = createAsyncThunk(
  '/user/wishlist/remove',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('DELETE', '/user/wishlist/remove', arg, true, dispatch, getState);
      dispatch(showNotification({ message: 'Remove from wish list successfully!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
      return { ...rspData };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const removeFavouriteListFromAuthUser = createAsyncThunk(
  '/user/favouritelist/remove',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('DELETE', '/user/favouritelist/remove', arg, true, dispatch, getState);
      dispatch(showNotification({ message: 'Remove from favourite list successfully!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
      return { ...rspData };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getUserRecommendations = createAsyncThunk(
  '/user/recommendations',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('GET', '/user/recommendations', arg, true, dispatch, getState);
      return { ...rspData };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const getAuthUserNotifications = createAsyncThunk(
  '/user/notifications',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('GET', '/user/notifications', arg, true, dispatch, getState);
      return { ...rspData };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const createQuiz = createAsyncThunk(
  '/quiz/create',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/quiz/create', arg, true, dispatch, getState);
      return { ...rspData };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAuthUserToken = createDraftSafeSelector((state: RootState) => state, (state: RootState) => state.authUser.token);
export const getAuthUser = createDraftSafeSelector((state: RootState) => state, (state: RootState) => state.authUser);
export const getAuthUserUId = createDraftSafeSelector((state: RootState) => state, (state) => state.authUser.uId);
export const getAuthUserRole = createDraftSafeSelector((state: RootState) => state, (state) => state.authUser.role);
export const getAuthUserStatus = createDraftSafeSelector((state: RootState) => state, (state) => state.authUser.status);
export const getAuthUserUsername = createDraftSafeSelector((state: RootState) => state, (state) => state.authUser.username);
export const getAuthUserImage = createDraftSafeSelector((state: RootState) => state, (state) => state.authUser.image);
