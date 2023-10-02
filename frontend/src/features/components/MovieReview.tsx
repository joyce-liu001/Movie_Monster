import {
  Avatar,
  Box, Grid, IconButton,
  Paper,
  Rating,
  Tooltip,
  Typography
} from '@mui/material';
import MovieMonsterLogo from '../../assets/movie-monster-logo.png';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { ReviewType } from '../types/MovieTypes';
import { Delete, Edit, ThumbDownAltOutlined, ThumbUpAltOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { getAuthUserRole, getAuthUserUId } from '../slices/AuthUserSlice';
import { AuthType } from '../types/AuthUserTypes';
import EditReviewModal from './EditReviewModal';
import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import {
  deleteMovieReview,
  getMovie,
  movieReviewThumbDown,
  movieReviewThumbUp,
  selectMovieId
} from '../slices/MovieSlice';

const MovieReview = ({ review }: { review: ReviewType }) => {
  const dispatch = useAppDispatch();
  const movieId = useSelector(selectMovieId);
  const authUserRole = useSelector(getAuthUserRole);
  const authUserId = useSelector(getAuthUserUId);
  const [openModal, setOpenModal] = React.useState(false);
  const handleThumbsUp = async () => {
    try {
      await dispatch(movieReviewThumbUp({ reviewId: review.reviewId }));
      await dispatch(getMovie({ movieId }));
    } catch {}
  };

  const handleThumbsDown = async () => {
    try {
      await dispatch(movieReviewThumbDown({ reviewId: review.reviewId }));
      await dispatch(getMovie({ movieId }));
    } catch {}
  };

  const handleRemove = async () => {
    try {
      await dispatch(deleteMovieReview({ reviewId: review.reviewId }));
      await dispatch(getMovie({ movieId }));
    } catch {}
  };

  return (
    <Paper sx={{ p: 2, mb: 1.5 }}>
      <EditReviewModal open={openModal} handleClose={() => setOpenModal(false)} review={review} />
      <Box>
        <Grid container alignItems='center' justifyContent='space-between'>
          <Grid item display='flex' flexDirection='row'>
            <Avatar src={MovieMonsterLogo} sx={{ mr: 1, mt: 0.7 }} />
            <Box display='flex' flexDirection='column'>
              <Typography variant='h6'>
                {review.reviewerUsername}
              </Typography>
              <Typography variant='caption'>
                 {new Date(review.timeSent).toLocaleString('en-AU')}
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Rating name="read-only" precision={0.1} value={ review.rating } readOnly />
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography variant='body1'>
            {review.reviewString}
          </Typography>
        </Box>
        <Box display='flex' justifyContent='space-between' mt={1}>
          <Box display='flex'>
            <Box display='flex' alignItems='center' justifyContent='center'>
              <Tooltip title='Like this review!'>
                <IconButton onClick={handleThumbsUp}>
                  {review.isThisUserThumbsUp ? <ThumbUpIcon /> : <ThumbUpAltOutlined />}
                </IconButton>
              </Tooltip>
              <Typography mt={0.5}>
                {review.numThumbsUp}
              </Typography>
            </Box>
            <Box display='flex' alignItems='center' justifyContent='center' ml={1}>
              <Tooltip title='Dislike this review!'>
                <IconButton onClick={handleThumbsDown}>
                  {review.isThisUserThumbsDown ? <ThumbDownIcon /> : <ThumbDownAltOutlined />}
                </IconButton>
              </Tooltip>
              <Typography mt={0.5}>
                {review.numThumbsDown}
              </Typography>
            </Box>
          </Box>
          {(authUserRole === AuthType.ADMIN || authUserId === review.reviewerId) &&
            <Box display='flex'>
              <Box display='flex' alignItems='center' justifyContent='center' ml={1}>
                <Tooltip title='Edit this review'>
                  <IconButton onClick={() => setOpenModal(true)}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box display='flex' alignItems='center' justifyContent='center'>
                <Tooltip title='Remove this review'>
                  <IconButton onClick={handleRemove}>
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          }
        </Box>
      </Box>
    </Paper>
  );
};

export default MovieReview;
