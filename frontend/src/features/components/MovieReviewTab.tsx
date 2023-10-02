import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Rating,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MovieReview from './MovieReview';
import { InputField } from './FormComponents';
import React from 'react';
import { useSelector } from 'react-redux';
import {
  addMovieReview,
  getMovie,
  selectMovieHasReviewed,
  selectMovieId,
  selectMovieReviews
} from '../slices/MovieSlice';
import { showNotification } from '../slices/NotificationSlice';
import { NotificationStatus } from '../types/NotificationType';
import { getAuthUserStatus } from '../slices/AuthUserSlice';
import { AuthUserStatus } from '../types/AuthUserTypes';
import { useAppDispatch } from '../../app/hooks';

// const reviews: ReviewType[] = [
//   {
//     reviewId: '0',
//     reviewerId: '0',
//     reviewerUsername: 'nktnet',
//     reviewString: 'This movie is awful!',
//     numThumbsUp: 5,
//     numThumbsDown: 2,
//     isThisUserThumbsUp: true,
//     isThisUserThumbsDown: false,
//     rating: 4.5,
//   }
// ];

const MovieReviewTab = () => {
  const dispatch = useAppDispatch();
  const movieId = useSelector(selectMovieId);
  const reviews = useSelector(selectMovieReviews);
  const hasReviewed = useSelector(selectMovieHasReviewed);
  const currUserStatus = useSelector(getAuthUserStatus);
  const [reviewString, setReviewString] = React.useState('');
  const [rating, setRating] = React.useState(0);

  const handleMovieReview = async () => {
    try {
      await dispatch(addMovieReview({ movieId, reviewString, rating })).unwrap();
      setReviewString('');
      setRating(0);
      dispatch(showNotification({ message: 'Review added successfully!', httpStatus: 0, type: 'success', status: NotificationStatus.SHOWING }));
      dispatch(getMovie({ movieId }));
    } catch {
    }
  };

  return (
    <Accordion
      defaultExpanded
      disableGutters
      elevation={0}
      sx={{ boxShadow: 'none', width: '100%', maxWidth: 'lg', '&:before': { Display: 'none' } }} >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Typography variant="h5" component="div">Reviews</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Divider sx={{ mb: 3 }} />
        {
          (hasReviewed === false && currUserStatus === AuthUserStatus.LOGIN) && (
            <React.Fragment>
              <Box display='flex' flexDirection='column' mx={1} mb={2}>
                <InputField
                  name='Write a review!'
                  value={reviewString}
                  onChange={(e: any) => setReviewString(e.target.value)}
                  multiline={true}
                  minRows={3}
                />
                <Box display='flex' alignSelf='flex-end'>
                  <Box mr={2} pt={1.5}>
                    <Rating precision={0.5} value={rating} onChange={(e: any, newValue: any) => setRating(newValue)}/>
                  </Box>
                  <Button variant='contained' onClick={handleMovieReview}>Submit</Button>
                </Box>
              </Box>
              <Divider sx={{ my: 3 }} />
            </React.Fragment>)
        }

        {
          reviews.map((review) => <MovieReview key={review.reviewerId} review={review} />)
        }
      </AccordionDetails>
    </Accordion>
  );
};
export default MovieReviewTab;
