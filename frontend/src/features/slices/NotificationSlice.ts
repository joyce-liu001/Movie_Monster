import { InformationType, NotificationStatus, NotificationType } from '../types/NotificationType';
import { createDraftSafeSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

const initialState: NotificationType = {
  message: '',
  httpStatus: 200,
  type: InformationType.SUCCESS,
  status: NotificationStatus.HIDDEN
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState: initialState,
  reducers: {
    showNotification: (state, action) => {
      state.message = action.payload.message;
      state.httpStatus = action.payload.httpStatus;
      state.type = action.payload.type;
      state.status = NotificationStatus.SHOWING;
    },
    hideNotification: (state) => {
      state.status = NotificationStatus.HIDDEN;
    }
  }
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export const getNotification = createDraftSafeSelector(
  (state: RootState) => state,
  (state: RootState) => state.notification
);

const notificationReducer = notificationSlice.reducer;
export default notificationReducer;
