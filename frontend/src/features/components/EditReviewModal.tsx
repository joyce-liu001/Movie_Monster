import React from 'react';
import { Box, Rating } from '@mui/material';
import { ReviewType } from '../types/MovieTypes';
import CustomModal from './CustomModal';
import { InputField } from './FormComponents';
import { useDispatch, useSelector } from 'react-redux';
import { getMovie, movieReviewEdit, selectMovieId } from '../slices/MovieSlice';

interface Props {
  open: boolean;
  handleClose: () => void;
  review: ReviewType;
}

const EditReviewModal = ({ open, handleClose, review }: Props) => {
  const movieId = useSelector(selectMovieId);
  const dispatch = useDispatch();
  const [reviewString, setReviewString] = React.useState(review.reviewString);
  const [rating, setRating] = React.useState(review.rating);

  const handleSuccess = async () => {
    try {
      await dispatch(movieReviewEdit({ reviewId: review.reviewId, reviewString, rating }));
      await dispatch(getMovie({ movieId }));
      handleClose();
    } catch {}
  };

  const body = <Box display='flex' flexDirection='column'>
    <InputField multiline minRows={3} name='Review' value={reviewString} onChange={(e: any) => setReviewString(e.target.value)} />
    <Rating sx={{ alignSelf: 'flex-end', mt: 1 }} precision={0.5} value={rating} onChange={(e: any, newValue: any) => setRating(newValue)}/>
  </Box>;

  return (
      <CustomModal
        open={open}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
        title='Edit Review'
        body={body}
      />
  );
};

export default EditReviewModal;
