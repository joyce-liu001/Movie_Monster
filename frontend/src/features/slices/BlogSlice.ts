import { createAsyncThunk, createDraftSafeSelector, createSlice } from '@reduxjs/toolkit';
import { apiCall, getRandomEditorText } from '../../utils/Helper';
import { BlogStatus, BlogType } from '../types/BlogType';
import { RootState } from '../../app/store';

const initialState: BlogType = {
  blogId: '',
  title: '111',
  content: getRandomEditorText(),
  timeCreated: 0,
  senderUsername: '111',
  status: BlogStatus.IDLE,
};

const blogSlice = createSlice({
  name: 'blog',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getBlog.pending, (state, _) => {
        state.status = BlogStatus.LOADING;
      })
      .addCase(getBlog.fulfilled, (state, action) => {
        state.blogId = action.payload.blog.blogId;
        state.title = action.payload.blog.title;
        state.content = action.payload.blog.content;
        state.timeCreated = action.payload.blog.timeCreated;
        state.senderUsername = action.payload.blog.senderUsername;
        state.status = BlogStatus.IDLE;
      })
      .addCase(getBlog.rejected, (state, _) => {
        state.status = BlogStatus.ERROR;
      })
      .addCase(editBlog.pending, (state, _) => {
        // Empty
      })
      .addCase(editBlog.fulfilled, (state, action) => {
        // Abc
      });
  }
});

const blogReducer = blogSlice.reducer;
export default blogReducer;

export const getBlog = createAsyncThunk(
  'blog/getBlog',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('GET', '/blog/view', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('POST', '/blog/create', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const editBlog = createAsyncThunk(
  'blog/editBlog',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('PUT', '/blog/edit', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const removeBlog = createAsyncThunk(
  'blogs/removeBlog',
  async (arg: any, { dispatch, getState, rejectWithValue }) => {
    try {
      const rspData = await apiCall('DELETE', '/blog/remove', arg, true, dispatch, getState);
      return { ...rspData, ...arg };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const selectCurrBlog = createDraftSafeSelector(
  (state: RootState) => state,
  (state) => state.blog
);
