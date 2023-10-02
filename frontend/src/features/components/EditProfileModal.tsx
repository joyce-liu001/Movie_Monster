import { Box, Switch, Typography } from '@mui/material';
import React from 'react';
import CustomModal from './CustomModal';
import { InputField, OptionPicker, PasswordField } from './FormComponents';
import { getUser, selectCurrentUserUid, selectUser, userProfileUpdate } from '../slices/UserSlice';
import { useAppDispatch } from '../../app/hooks';
import { useSelector } from 'react-redux';
import { showNotification } from '../slices/NotificationSlice';
import { NotificationStatus } from '../types/NotificationType';
import { getAuthUserInfo, getAuthUserUId } from '../slices/AuthUserSlice';

interface Props {
  open: boolean;
  handleClose: () => void;
}

const genderOptions = [
  '',
  'male',
  'female',
  'other',
];

const EditProfileModal = ({ open, handleClose }: Props) => {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const uId = useSelector(selectCurrentUserUid);
  const authUserId = useSelector(getAuthUserUId);
  const [username, setUsername] = React.useState(user.username);
  const [email, setEmail] = React.useState(user.email);
  const [age, setAge] = React.useState(20);
  const [gender, setGender] = React.useState('');

  const [editPassword, setEditPassword] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

  React.useEffect(() => {
    setUsername(user.username);
    setEmail(user.email);
    setAge(user.age);
    setGender(user.gender);
  }, [user]);

  const handleSuccess = async () => {
    if (confirmNewPassword !== newPassword) {
      dispatch(showNotification({ message: 'Error: New password mismatch confirm password!', httpStatus: 0, type: 'error', status: NotificationStatus.SHOWING }));
    } else {
      try {
        await dispatch(userProfileUpdate({ username, age, gender, oldPassword, newPassword })).unwrap();
        await dispatch(getAuthUserInfo({ uId: authUserId }));
        await dispatch(getUser({ uId }));
        dispatch(showNotification({ message: 'Update profile success!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
        handleClose();
      } catch (e) {
        console.log(e);
      }
    }
  };

  const handleToggleEditPassword = (e: any) => {
    setEditPassword(e.target.checked);
    if (!e.target.checked) {
      setOldPassword('');
      setNewPassword('');
    }
  };

  const handleKeyDown = async (e: any) => {
    if (e.key === 'Enter') await handleSuccess();
  };

  const body = <Box>
    <InputField name='Username' value={username} onChange={(e: any) => setUsername(e.target.value)} />
    <InputField type='email' disabled name='Email' value={email} onChange={(e: any) => setEmail(e.target.value)} />
    <Box display='flex' flexDirection='row' alignItems='space-between' width='100%'>
      <OptionPicker name='age' value={age} options={[...Array(120).keys()]} setValue={(e: any) => setAge(e.target.value)} />
      <OptionPicker name='gender' value={gender} options={genderOptions} setValue={(e: any) => setGender(e.target.value)} />
    </Box>
    <Box display='flex' justifyContent='space-between'>
      <Typography mt={1.1}>
        Edit password
      </Typography>
      <Switch onChange={handleToggleEditPassword}/>
    </Box>
    {
      <Box>
        <PasswordField
          name="old password"
          value={oldPassword}
          disabled={!editPassword}
          onChange={(e: any) => setOldPassword(e.target.value)}
        />
        <PasswordField
          name="new password"
          value={newPassword}
          disabled={!editPassword}
          onChange={(e: any) => setNewPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <PasswordField
          name="confirm new password"
          value={confirmNewPassword}
          disabled={!editPassword}
          error={confirmNewPassword !== newPassword}
          onChange={(e: any) => setConfirmNewPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </Box>
    }
  </Box>;

  return (
      <CustomModal
        open={open}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
        title='Edit Profile'
        body={body}
      />
  );
};

export default EditProfileModal;
