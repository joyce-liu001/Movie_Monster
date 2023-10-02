// import { Box, Typography } from '@mui/material';
// import UserProfileTab from '../components/UserProfileTab';
import MovieDetailCard from '../components/MovieDetailTab';
import { Box } from '@mui/material';
import MovieReviewTab from '../components/MovieReviewTab';
import MovieRecommendationTab from '../components/MovieRecommendationTab';
import { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { getMovie } from '../slices/MovieSlice';
import { useParams } from 'react-router-dom';

const MoviePage = () => {
  const { movieId } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function fetchData() {
      await dispatch(getMovie({ movieId }));
    }
    fetchData().then();
  }, []);
  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center' p={1} mb={2}>
      <MovieDetailCard/>
      <MovieRecommendationTab/>
      <MovieReviewTab/>
    </Box>
  );
};

export default MoviePage;
