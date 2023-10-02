import Blogs from '../components/Blogs';
import { Box } from '@mui/material';

const BlogsPage = () => {
  return (
    <Box display='flex' alignItems='center' justifyContent='center'>
      <Blogs isUser={false} />
    </Box>
  );
};

export default BlogsPage;
