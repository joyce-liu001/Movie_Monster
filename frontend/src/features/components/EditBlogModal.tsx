import React from 'react';
import { Box, Typography } from '@mui/material';
import MUIRichTextEditor from 'mui-rte';
import { EditorState } from 'draft-js';
import CustomModal from './CustomModal';
import { Delete, Save } from '@mui/icons-material';
import { InputField } from './FormComponents';
import { useAppDispatch } from '../../app/hooks';
import { getAllBlogs } from '../slices/BlogsSlice';
import { editBlog, getBlog } from '../slices/BlogSlice';

interface Props {
  open: boolean;
  handleClose: () => void;
  title?: string;
  content?: string;
  blogId: string;
}

const controls = [
  'title',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  'highlight',
  'undo',
  'redo',
  'link',
  'media',
  'numberList',
  'bulletList',
  'quote',
  'code',
  'clear',
  'save',
];

const EditBlogModal = ({ open, handleClose, title: defaultTitle, content: defaultContent, blogId }: Props) => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');

  React.useEffect(() => {
    setTitle(defaultTitle as string);
  }, [defaultTitle]);

  React.useEffect(() => {
    setContent(defaultContent as string);
  }, [defaultContent]);

  const handleSuccess = async () => {
    try {
      // eslint-disable-next-line no-undef
      await dispatch(editBlog({ blogId, title, content })).unwrap();
      await dispatch(getBlog({ blogId })).unwrap();
    } catch {}
    handleClose();
  };

  const body = (
    <Box display='flex' width='100%' minHeight='300px' flexDirection='column'>
  <Typography variant='h6'>
    Title
    </Typography>
    <InputField name=' ' value={title} onChange={(e: any) => setTitle(e.target.value)} />
  <Typography mt={2} variant='h6'>
    Content
    </Typography>
    <Box mt={1} border='1px solid gray' p={1}>
  <MUIRichTextEditor
    label="Write your blog..."
  defaultValue={content}
  onSave={setContent}
  controls={[...controls, 'delete']}
  customControls={[
    {
      name: 'delete',
      icon: <Delete />,
      type: 'callback',
      onClick: (editorState, name, anchor) => {
        console.log(`Clicked ${name} control`);
        return EditorState.createEmpty();
      }
    }
  ]}
  />
  </Box>
  <Typography mt={2} variant='body2' alignSelf='flex-end'>
    <i><b>Note:</b> Please click the <Save sx={{ fontSize: 20, mb: 0.5, transform: 'rotate(15deg)' }} /> icon to save the content</i>
  </Typography>
  </Box>
  );

  return (
    <CustomModal
      open={open}
  handleClose={handleClose}
  handleSuccess={handleSuccess}
  title=''
  body={body}
  />
  );
};

EditBlogModal.defaultProps = {
  title: '',
  content: '',
};

export default EditBlogModal;
