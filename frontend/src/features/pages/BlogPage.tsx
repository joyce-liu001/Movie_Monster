import React from 'react';
import { Box, Divider, IconButton, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { getBlog, removeBlog, selectCurrBlog } from '../slices/BlogSlice';
import EditBlogModal from '../components/EditBlogModal';
import { useSelector } from 'react-redux';
import { showNotification } from '../slices/NotificationSlice';
import { NotificationStatus } from '../types/NotificationType';
import { getAllBlogs } from '../slices/BlogsSlice';
import PageRoutes from '../../utils/PageRoutes';
import MUIRichTextEditor from 'mui-rte';

// const testBlog: BlogType = {
//   blogId: '0',
//   title: 'Blog 0',
//   senderUsername: 'User 1',
//   content: getRandomEditorText(),
//   timeCreated: Date.now(),
// };

const BlogPage = () => {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const dispatch = useAppDispatch();
  const blog = useSelector(selectCurrBlog);
  const [openEditBlog, setOpenEditBlog] = React.useState(false);

  React.useEffect(() => {
    // console.log('blog', blog);
    dispatch(getBlog({ blogId })).unwrap().then();
  }, []);

  const hadleRemoveBlog = async () => {
    try {
      await dispatch(removeBlog({ blogId })).unwrap();
      await dispatch(getAllBlogs({})).unwrap();
      navigate(PageRoutes.BLOGS);
      dispatch(showNotification({ message: 'Blog removed successfully', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
    } catch {}
  };

  return (
    <Box display='flex' flexDirection='column' alignItems='center' maxWidth='lg' p={2}>
      {/* <CreateBlogModal open={openEditBlog} handleClose={() => setOpenEditBlog(false)} title={blog.title} content={blog.content} /> */}
      <EditBlogModal open={openEditBlog} handleClose={() => setOpenEditBlog(false)} title={blog.title} content={blog.content} blogId={blog.blogId} />
      <Box display='flex' justifyContent='space-between' width='100%'>
        <Box>
          <Typography variant='h3'>{blog.title}</Typography>
          <Typography variant='h6'>{blog.senderUsername}, {new Date(blog.timeCreated).toLocaleDateString('en-AU')}</Typography>
        </Box>
        <Box>
          <IconButton onClick={() => setOpenEditBlog(true)} color='primary' sx={{ borderRadius: 0 }}>
            <Edit sx={{ fontSize: 40 }} />
          </IconButton>
          <IconButton onClick={hadleRemoveBlog} color='primary' sx={{ borderRadius: 0 }}>
            <DeleteForeverIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>
      </Box>
      <Divider orientation="horizontal" sx={{ borderBottomWidth: 5, mt: 2, mb: 3, borderColor: 'gray' }} flexItem />
      <Box width='100%' display='flex' flexDirection='column'>
        <MUIRichTextEditor
          defaultValue={blog.content}
          controls={[]}
          readOnly
        />
      </Box>
    </Box>
  );
};

export default BlogPage;
