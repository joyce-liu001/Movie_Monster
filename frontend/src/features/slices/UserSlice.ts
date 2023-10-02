import { apiCall } from '../../utils/Helper';
import { createAsyncThunk, createDraftSafeSelector, createSlice } from '@reduxjs/toolkit';
import { Status, UserStatus, UserType } from '../types/UserTypes';

const initialState: UserType = {
  uId: '',
  username: '',
  email: '',
  age: 0,
  gender: '',
  isAdmin: false,
  image: '',
  wishList: [],
  watchList: [],
  favouriteList: [],
  userStatus: UserStatus.PUBLIC,
  isBlocked: false,
  status: Status.IDLE,
};

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  extraReducers (builder) {
    builder
      .addCase(getUser.pending, (state, _) => {
        state.status = Status.LOADING;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.uId = action.payload.user.uId;
        state.username = action.payload.user.username;
        state.email = action.payload.user.email;
        state.age = action.payload.user.age;
        state.gender = action.payload.user.gender;
        state.isAdmin = action.payload.user.isAdmin;
        state.image = action.payload.user.image;
        state.wishList = action.payload.user.wishList;
        state.watchList = action.payload.user.watchList;
        state.favouriteList = action.payload.user.favouriteList;
        state.userStatus = action.payload.user.userStatus;
        state.isBlocked = action.payload.user.isBlocked;
        state.status = Status.LOADED;
      })
      .addCase(getUser.rejected, (state, _) => {
        state.status = Status.ERROR;
      });
  }
});

const userReducer = userSlice.reducer;
export default userReducer;

export const getUser = createAsyncThunk(
  'user/get',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('GET', '/user/profile', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const blockUser = createAsyncThunk(
  'user/block',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/user/block', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const unblockUser = createAsyncThunk(
  'user/unblock',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/user/unblock', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  'user/updateStatus',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('PUT', '/user/profile/status', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const userProfileUpdate = createAsyncThunk(
  'user/profile/update',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('PUT', '/user/profile/update', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const sendFriendRequest = createAsyncThunk(
  'user/friend/request',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/user/friendrequest', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewFriendRequest = createAsyncThunk(
  'user/friend/view',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('GET', '/user/viewfriendrequests', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const confirmFriendRequest = createAsyncThunk(
  'user/friend/confirm',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/user/confirmrequest', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
export const denyFriendRequest = createAsyncThunk(
  'user/friend/deny',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/user/denyrequest', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const selectUser = createDraftSafeSelector(
  (state: any) => state,
  (state: any) => state.user
);

export const selectCurrentUserUid = createDraftSafeSelector(
  (state: any) => state,
  (state: any) => state.user.uId
);

export const selectCurrentUserImage = createDraftSafeSelector(
  (state: any) => state,
  (state: any) => state.user.image
);
