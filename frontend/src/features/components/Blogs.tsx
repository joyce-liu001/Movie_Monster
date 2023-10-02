import React from 'react';
import { Box, Divider, Grid, ListItem, Typography, Autocomplete, Stack, TextField, Tooltip, Button } from '@mui/material';
import { filterOptions } from '../../utils/Helper';
import { useNavigate } from 'react-router-dom';
import PageRoutes from '../../utils/PageRoutes';
import Image from 'mui-image';
import { Add } from '@mui/icons-material';
import CreateBlogModal from './CreateBlogModal';
import { convertFromRaw } from 'draft-js';
import { useAppDispatch } from '../../app/hooks';
import { getAllBlogs, getUserBlogs, selectBlogs } from '../slices/BlogsSlice';
import { useSelector } from 'react-redux';
import { selectCurrentUserUid } from '../slices/UserSlice';

const Blogs = ({ isUser }: { isUser: boolean }) => {
  const dispatch = useAppDispatch();
  const uId = useSelector(selectCurrentUserUid);
  React.useEffect(() => {
    if (isUser) {
      dispatch(getUserBlogs({ uId })).unwrap().then();
    } else {
      dispatch(getAllBlogs({})).unwrap().then();
    }
  }, []);
  const blogs = useSelector(selectBlogs);
  const [openCreateBlog, setOpenCreateBlog] = React.useState(false);
  const [searchString, setSearchString] = React.useState('');

  const navigate = useNavigate();
  const handleClick = (blogId: string) => {
    navigate(`${PageRoutes.BLOGS}/${blogId}`);
  };

  return (
    <Box p={2} width='100%' maxWidth='lg' alignSelf='center' display='flex' flexDirection='column' alignItems='center'>
      <CreateBlogModal open={openCreateBlog} handleClose={() => setOpenCreateBlog(false)} />
      <Box display='flex' width='100%' columnGap={0.5}>
        <Autocomplete
          freeSolo
          disablePortal
          autoHighlight
          fullWidth
          onInputChange={(_: any, key: any) => setSearchString(key)}
          value={searchString}
          options={blogs.map(b => b.title)}
          filterOptions={filterOptions}
          renderInput={(params) =>
            <Stack direction='row' spacing={1}>
              <TextField
                {...params}
                value={searchString}
                label="Search Blogs"
              />
            </Stack>
          }
        />
        <Tooltip title='Create a new blog'>
          <Button variant='outlined' onClick={() => setOpenCreateBlog(true)}>
            <Add />
          </Button>
        </Tooltip>
      </Box>
      <Box display='flex' flexDirection='column' width='100%'>
        {
          blogs.map((blog) => {
            const rawText = convertFromRaw(JSON.parse(blog.content)).getPlainText();
            return (
              <Box key={blog.blogId} >
                <Divider sx={{ my: 2 }}/>
                <ListItem button disableGutters onClick={() => handleClick(blog.blogId)}>
                  <Grid container width='100%' columnGap={2} rowGap={2}>
                    <Grid item maxHeight={300} xs={12} sm={'auto'}>
                      <Image
                        src={`https://picsum.photos/300/300?time=${Math.random()}`}
                        duration={0}
                      />
                    </Grid>
                    <Grid item maxHeight={300} xs={12} sm={true}>
                      <Box display='flex' flexDirection='column' rowGap={1}>
                        <Typography noWrap variant='h4'>
                          {blog.title}
                        </Typography>
                        <Typography noWrap variant='h6'>
                          <b>Author: </b>{blog.senderUsername}
                        </Typography>
                        <Typography noWrap variant='body1'>
                          <b>Posted on: </b>{new Date(blog.timeCreated).toLocaleDateString('en-Au')}
                        </Typography>
                        <Typography
                          gutterBottom
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 7,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {rawText}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </ListItem>
              </Box>
            );
          })
        }
      </Box>
    </Box>
  );
};

export default Blogs;
