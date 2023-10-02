import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { apiCall } from '../../utils/Helper';
import { UsersStatus, UsersType } from '../types/UsersType';

export const usersAdapter = createEntityAdapter<UsersType>({
  selectId: (user) => user.uId,
  sortComparer: (a: UsersType, b: UsersType) => a.uId.localeCompare(b.uId),
});

const initialState = usersAdapter.getInitialState({
  status: UsersStatus.IDLE
});

const usersSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUsers.pending, (state, _) => {
        state.status = UsersStatus.LOADING;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = UsersStatus.LOADED;
        usersAdapter.setAll(state, action.payload.users);
      })
      .addCase(getUsers.rejected, (state, _) => {
        state.status = UsersStatus.ERROR;
      });
  }
});

const usersReducer = usersSlice.reducer;
export default usersReducer;

export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('GET', '/users/all', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const {
  selectAll: selectUsers,
  selectTotal: getTotalUsers,
  selectById: selectUserById,
  selectIds: selectUserIds,
} = usersAdapter.getSelectors<RootState>((state: RootState) => state.users);
