import { Box, Container, Divider, IconButton, Rating, Tooltip, Typography } from '@mui/material';
import { Shuffle } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import PageRoutes from '../../utils/PageRoutes';
import { apiCall } from '../../utils/Helper';
import { useAppDispatch } from '../../app/hooks';
import React from 'react';
import { getUserRecommendations } from '../slices/AuthUserSlice';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { MoviesType } from '../types/MoviesTypes';
import MovieMonsterLogo from '../../assets/movie-monster-logo-transparent.png';
import Image from 'mui-image';

const renderItem = (item: ReactImageGalleryItem) => {
  const movie: MoviesType = JSON.parse(item.description as string);
  const title = `Our recommendation to you based on your watched list:\n "${item.originalTitle}"`;
  return (
    <Box
      display='flex'
      alignItems='center'
      justifyContent='center'
      component={Link}
      to={`${PageRoutes.MOVIES}/${movie.movieId}`}
      className={'image-gallery-image'}
    >
      <Tooltip title={title} followCursor>
        <Box
          maxHeight='70vh'
          maxWidth='47.25vh'
        >
          <Image
            src={item.original}
          />
        </Box>
      </Tooltip>
      <Rating
        precision={0.5}
        readOnly
        value={movie.rating}
        sx={{
          position: 'absolute',
          zIndex: 1000,
          alignSelf: 'flex-end',
          fontSize: 50,
          bottom: 2,
        }}/>
    </Box>
  );
};

const HomePage = () => {
  // const userId = useSelector(getAuthUserUId);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [recMovies, setRecMovies] = React.useState([]);
  const handleRandomMovie = async () => {
    // navigate(PageRoutes.USERS + '/' + userId, { state: 2 });
    const retData = await apiCall('GET', '/movie/random', {}, false, null, null);
    navigate(PageRoutes.MOVIES + '/' + retData.movieId);
  };

  React.useEffect(() => {
    dispatch(getUserRecommendations({})).unwrap().then((data) => {
      console.log(data);
      if (Array.isArray(data.movies)) {
        setRecMovies(data.movies);
      }
    });
  }, []);

  const items = recMovies.map((movie: MoviesType) => ({
    original: movie.image,
    thumbnail: movie.image,
    originalTitle: movie.fullTitle,
    loading: 'lazy',
    thumbnailLoading: 'lazy',
    description: JSON.stringify(movie),
  }));

  return (
    <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
      <Box>
        { items.length > 0
          ? <ImageGallery
            thumbnailPosition='bottom'
            showBullets={false}
            showIndex={true}
            items={items}
            autoPlay={true}
            slideDuration={500}
            slideInterval={5000}
            renderItem={(item: ReactImageGalleryItem) => renderItem(item)}
          />
          : <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
            <Container>
              <Image
                src={MovieMonsterLogo}
              />
            </Container>
            <Box mt={3}>
              <Typography variant='h5' align='center'>
                There are no movie recommendations available at this time.
              </Typography>
              <Typography variant='h5' align='center'>
                Please either register/login and add more items to your watched list!
              </Typography>
            </Box>
          </Box>
        }
      </Box>

      <Divider flexItem sx={{ borderBottomWidth: 5, borderColor: 'gray', width: 400, alignSelf: 'center', mt: 3 }} />

      <Box
        maxWidth='sm'
        mt={3}
        display='flex'
        flexDirection='column'
        alignItems='center'
        justifyContent='center'
      >
        <Typography align='center' variant='h5'>Try something new?</Typography>
        <Tooltip title='Click to view a random movie'>
          <IconButton onClick={handleRandomMovie}>
            <Shuffle sx={{ fontSize: 100 }}/>
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default HomePage;
