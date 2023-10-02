import { Cake, Edit, Mail, PersonAdd, PersonOff, Wc } from '@mui/icons-material';
import { Box, Divider, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import Image from 'mui-image';
import React from 'react';
import { useSelector } from 'react-redux';
import { clearAuthUser, getAuthUserInfo, getAuthUserToken, getAuthUserUId } from '../slices/AuthUserSlice';
import { UserType } from '../types/UserTypes';
import EditProfileModal from './EditProfileModal';
import { OptionPicker } from './FormComponents';
import {
  blockUser,
  getUser, selectCurrentUserImage,
  selectCurrentUserUid,
  sendFriendRequest,
  unblockUser,
  updateUserStatus
} from '../slices/UserSlice';
import { useAppDispatch } from '../../app/hooks';
import { showNotification } from '../slices/NotificationSlice';
import { NotificationStatus } from '../types/NotificationType';
import axios from 'axios';
import { BACKEND_URL } from '../../utils/Config';

const UserProfileTab = ({ user }: { user: UserType }) => {
  const token = useSelector(getAuthUserToken) as string;
  // const authUId = useSelector(getAuthUserUId) as string;
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = React.useState(false);
  const uId = useSelector(selectCurrentUserUid) as string;
  const authUserId = useSelector(getAuthUserUId);
  const [userStatus, setUserStatus] = React.useState('public');
  const userImage = useSelector(selectCurrentUserImage);

  const handleAddFriend = async () => {
    try {
      await dispatch(sendFriendRequest({ toUId: user.uId })).unwrap();
      dispatch(showNotification({ message: 'Friend request sent', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
    } catch {}
  };

  const handleBlockUser = async () => {
    try {
      await dispatch(blockUser({ uId: user.uId })).unwrap();
      dispatch(showNotification({ message: 'User blocked', type: 'success', httpStatus: 0, status: NotificationStatus.SHOWING }));
      await dispatch(getUser({ uId })).unwrap();
    } catch {}
  };

  const handleUnblockUser = async () => {
    try {
      await dispatch(unblockUser({ uId: user.uId, unblock: true })).unwrap();
      dispatch(showNotification({ message: 'User unblocked', type: 'success', httpStatus: 0, status: NotificationStatus.SHOWING }));
      await dispatch(getUser({ uId })).unwrap();
    } catch {}
  };

  const handleUpdateStatus = async (e: any) => {
    try {
      await dispatch(updateUserStatus({ userStatus: e.target.value })).unwrap();
      dispatch(showNotification({ message: 'Status updated!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
      setUserStatus(e.target.value);
    } catch {}
  };

  const handleUploadPhoto = async (event: any) => {
    const imageFile = event.target.files[0];

    const fileReader = new window.FileReader();
    fileReader.readAsDataURL(imageFile);
    const formData = new window.FormData();
    formData.append('imageFile', imageFile);
    const url = BACKEND_URL + '/user/profile/uploadphoto';
    fileReader.onload = async (e: any) => {
      try {
        const retData = await axios.post(url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: token,
          }
        });
        dispatch(showNotification({ message: 'Photo uploaded!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
        await dispatch(getUser({ uId })).unwrap();
        await dispatch(getAuthUserInfo({ uId: authUserId })).unwrap();
      } catch (e: any) {
        if (e.message === 'Network Error') {
          dispatch(showNotification({ message: 'Error: Network Error', httpStatus: 0, type: 'error', status: NotificationStatus.SHOWING }));
        }
        if (e.response.status === 401) {
          dispatch(clearAuthUser());
        }
        dispatch(showNotification({ message: e.response.data.message, httpStatus: e.response.status, type: 'error', status: NotificationStatus.SHOWING }));
      }
    };
  };

  return (
    <Grid columnSpacing={5} container pr={2}>
      <EditProfileModal open={openModal} handleClose={() => setOpenModal(false)} />
      <Grid item mt={3} display='flex'>
        <Box maxWidth={300} maxHeight={300} display='flex' flexDirection='column'>
          <Tooltip title={'Edit your profile image'}>
            {
              uId === authUserId
                ? <IconButton
                component="label"
                sx={{
                  m: 0.5,
                  position: 'absolute',
                  zIndex: 2000,
                  alignSelf: 'flex-end',
                  backgroundColor: '#121212',
                  '&:hover': {
                    backgroundColor: '#515151',
                  },
                }}
              >
                <input
                  accept="image/*"
                  id="icon-button-file"
                  type="file"
                  className='d-none'
                  onChange={handleUploadPhoto}
                />
                <Edit color='primary' sx={{ fontSize: 30 }}/>
              </IconButton>
                : <Box></Box>
            }
          </Tooltip>
          <Box
            width='100%'
            height='auto'
            maxHeight={300}
            maxWidth={300}
          >
            <Image
              src={`data:image/jpeg;base64, ${userImage}`}
              duration={500}
              alt='DP'
            />
          </Box>
        </Box>
      </Grid>
      <Grid item mt={3} display='flex' justifyContent='space-between'>
        <Box display='flex' flexDirection='column'>
          <Box display='flex' alignItems='center'>
            <Typography width='100%' sx={{ wordBreak: 'break-word' }} mt={1} mr={1} variant='h4'>{user.username}</Typography>
            { uId === authUserId
              ? <Box display='flex' justifyContent='flex-end'>
                <Tooltip title='Edit profile'>
                  <IconButton color='primary' onClick={() => setOpenModal(true)}>
                    <Edit sx={{ fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
              </Box>
              : <Box display='flex' justifyContent='flex-end'>
                <Tooltip title='Add Friend'>
                  <IconButton onClick={handleAddFriend}>
                    <PersonAdd color='primary' sx={{ fontSize: 30 }} />
                  </IconButton>
                </Tooltip>
                {
                  user.isBlocked
                    ? <Tooltip title='Unblock User'>
                        <IconButton onClick={handleUnblockUser}>
                          <ReplayIcon color='primary' sx={{ fontSize: 30 }} />
                        </IconButton>
                      </Tooltip>
                    : <Tooltip title='Block User'>
                        <IconButton onClick={handleBlockUser}>
                          <PersonOff color='primary' sx={{ fontSize: 30 }} />
                        </IconButton>
                      </Tooltip>
                }
              </Box>
            }
          </Box>
          {
            user.uId === authUserId && (<OptionPicker
                name='Audience'
                value={userStatus}
                setValue={handleUpdateStatus}
                options={['public', 'friends', 'private']}
              />
            )
          }
          <Divider sx={{ my: 2 }} />

          <Grid container mt={2} rowGap={2}>
            <Grid item xs={6}>
              <Box display='flex'>
                <Mail />
                <Typography ml={1} mt={0.3}>Email:</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography mt={0.3}>{user.email}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Box display='flex'>
                <Cake />
                <Typography ml={1} mt={0.8}>Age:</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography mt={0.9}>{user.age}</Typography>
            </Grid>

            <Grid item xs={6}>
              <Box display='flex'>
                <Wc />
                <Typography ml={1} mt={0.5}>Gender:</Typography>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography mt={0.5}>{user.gender}</Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default UserProfileTab;
