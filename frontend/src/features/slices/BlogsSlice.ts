import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { apiCall } from '../../utils/Helper';
import { RootState } from '../../app/store';
import { BlogStatus, BlogsType } from '../types/BlogType';

export const blogsAdapter = createEntityAdapter<BlogsType>({
  selectId: (blog: BlogsType) => blog.blogId,
});

const initialState = blogsAdapter.getInitialState({
  status: BlogStatus.IDLE,
});

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getUserBlogs.pending, (state, _) => {
        state.status = BlogStatus.LOADING;
      })
      .addCase(getUserBlogs.fulfilled, (state, action) => {
        blogsAdapter.setMany(state, action.payload.blogs);
        state.status = BlogStatus.IDLE;
      })
      .addCase(getUserBlogs.rejected, (state, _) => {
        state.status = BlogStatus.ERROR;
      })
      .addCase(getAllBlogs.pending, (state, action) => {
        state.status = BlogStatus.LOADING;
      })
      .addCase(getAllBlogs.fulfilled, (state, action) => {
        blogsAdapter.setAll(state, action.payload.blogs);
        state.status = BlogStatus.IDLE;
      })
      .addCase(getAllBlogs.rejected, (state, _) => {
        state.status = BlogStatus.ERROR;
      });
  },
});

const blogsReducer = blogsSlice.reducer;
export default blogsReducer;

export const getUserBlogs = createAsyncThunk(
  'blogs/getBlogs',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('GET', '/blog/list', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllBlogs = createAsyncThunk(
  'blogs/getAllBlogs',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('GET', '/blog/listall', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const {
  selectById: selectBlogById,
  selectIds: selectBlogIds,
  selectEntities: selectBlogEntities,
  selectTotal: selectBlogTotal,
  selectAll: selectBlogs,
} = blogsAdapter.getSelectors<RootState>((state: RootState) => state.blogs);
