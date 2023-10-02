import React, { useEffect } from 'react';
import { Box, Typography, Tab, Tabs, IconButton, Slide, Tooltip, useTheme } from '@mui/material';
import UserProfileTab from '../components/UserProfileTab';
import { DoubleArrow, Person, Movie, SvgIconComponent, PeopleAlt, Book, AdminPanelSettings } from '@mui/icons-material';
import UserAdminTab from '../components/UserAdminTab';
import UserMoviesTab from '../components/UserMoviesTab';
import { useSelector } from 'react-redux';
import { getUser, selectUser } from '../slices/UserSlice';
import { useAppDispatch } from '../../app/hooks';
import { useLocation, useParams } from 'react-router-dom';
import { getAuthUserInfo, getAuthUserRole, getAuthUserUId } from '../slices/AuthUserSlice';
import { AuthType } from '../types/AuthUserTypes';
import UserBlogsTab from '../components/UserBlogsTab';

// const user: User = {
//   uId: 1,
//   username: 'Tam',
//   email: 'tam.nguyen@email.com',
//   description: 'Once upon a time there was a turtle called Mr Turtle, who fought against an army of polar bears lead by skinny polar bear and fat polar bear',
//   isAdmin: true,
//   isFriend: true,
//   image: 'https://ca.slack-edge.com/T03HA0HQ285-U03J4RYMG66-3829ffb7293d-512',
// };

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      width='100%'
      {...other}
    >
      {value === index && (
        <Box sx={{ pl: 3 }}>
          {children}
        </Box>
      )}
    </Box>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
};

const isDesktop = (width: number) => width >= 768;

const Label = ({ Icon, text }: { Icon: SvgIconComponent, text: string }) => {
  return <Box display='flex'>
    <Tooltip title={text}>
      <Icon />
    </Tooltip>
    <Typography className={isDesktop(window.innerWidth) ? 'd-inline' : 'd-none'} ml={1} mt={0.4}>
      {text}
    </Typography>
  </Box>;
};

const UserPage = () => {
  const { state } = useLocation();
  const authUserRole = useSelector(getAuthUserRole);
  const authUserId = useSelector(getAuthUserUId);
  const { uId } = useParams();
  const user = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const [value, setValue] = React.useState(state as number || 0);
  const [openDraw, setOpenDraw] = React.useState(isDesktop(window.innerWidth));

  useEffect(() => {
    async function fetchData() {
      await dispatch(getAuthUserInfo({ uId: authUserId }));
      await dispatch(getUser({ uId }));
    }
    fetchData().then();
  }, []);

  const handleWindowSizeChange = () => {
    setOpenDraw(isDesktop(window.innerWidth));
  };

  React.useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const profileTabs = [
    { label: 'Profile', Icon: Person, tab: <UserProfileTab user={user} /> },
    { label: 'Movies', Icon: Movie, tab: <UserMoviesTab user={user} /> },
    // { label: 'Friends', Icon: PeopleAlt, tab: 'Friends' },
    { label: 'Blogs', Icon: Book, tab: <UserBlogsTab user={user} /> },
    ...(authUserRole === AuthType.ADMIN ? [{ label: 'Admin', Icon: AdminPanelSettings, tab: <UserAdminTab user={user} /> }] : [])
  ];

  const theme = useTheme();

  return (
    <Box
      display='flex'
      width='100%'
    >
      <Slide
        direction="right"
        in={openDraw}
        mountOnEnter
        unmountOnExit
        easing={{
          enter: theme.transitions.easing.easeOut,
          exit: theme.transitions.easing.easeIn
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="user profile vertical tabs"
          sx={{ borderRight: 1, borderColor: 'divider', overflow: 'visible' }}
        >
          {
            profileTabs.map((tab, i) => (
              <Tab
                key={`${tab.label}${i}`}
                label={<Label Icon={tab.Icon} text={tab.label} />}
                {...a11yProps(i)}
                sx={{ display: { xl: 'inline', xs: 'hidden' }, minWidth: '50%' }}
              />
            ))
          }
        </Tabs>
      </Slide>
      {
        profileTabs.map((tab, i) => (
          <TabPanel value={value} index={i} key={`${tab.label}${i}`}>
            <Box display='flex' flexWrap='wrap' alignItems='center'>
              <Tooltip title='Toggle tabs'>
                <IconButton onClick={() => setOpenDraw(!openDraw)}>
                  <DoubleArrow sx={{ fontSize: '30px' }} />
                </IconButton>
              </Tooltip>
              <Typography mt={1} variant='h4'>{tab.label}</Typography>
            </Box>
            {tab.tab}
          </TabPanel>
        ))
      }
    </Box>
  );
};

export default UserPage;
