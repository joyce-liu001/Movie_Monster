import { Box, Button, Chip, Grid, IconButton, Rating, Stack, ToggleButton, ToggleButtonGroup, Tooltip, Typography } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import ShareIcon from '@mui/icons-material/Share';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Image from 'mui-image';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getMovie, selectMovie } from '../slices/MovieSlice';
import {
  addWishListToAuthUser,
  removeWishListFromAuthUser,
  addWatchListToAuthUser,
  removeWatchListFromAuthUser,
  addFavouriteListToAuthUser,
  removeFavouriteListFromAuthUser,
  getAuthUserStatus,
  getAuthUserInfo,
  getAuthUserUId, getAuthUserRole,
} from '../slices/AuthUserSlice';
import { AuthType, AuthUserStatus } from '../types/AuthUserTypes';
import { ActorList } from './ActorList';
import { useAppDispatch } from '../../app/hooks';
import { Edit } from '@mui/icons-material';
import EditMovieModal from './EditMovieModal';
import ImdbLogo from '../../assets/imdb-logo.png';
import MonsterLogo from '../../assets/movie-monster-logo-transparent.png';
import QuizPopup from './QuizPopup';

const MovieDetailCard = () => {
  const [openEdit, setOpenEdit] = React.useState(false);
  const currUserRole = useSelector(getAuthUserRole);
  const currUserUId = useSelector(getAuthUserUId);
  const dispatch = useAppDispatch();
  const currAuthStatus = useSelector(getAuthUserStatus);
  const movie = useSelector(selectMovie, shallowEqual);
  const [alignment, setAlignment] = React.useState<string | null>(null);
  const [isFavourite, setIsFavourite] = React.useState<boolean>(false);
  const [openQuiz, setOpenQuiz] = React.useState(false);
  useEffect(() => {
    console.log('movie', movie);
    if (movie.isWatch) setAlignment('watchlist');
    else if (movie.isWish) setAlignment('wishlist');
    else setAlignment(null);
    if (movie.isFavourite) setIsFavourite(true);
    else setIsFavourite(false);
  }, [movie]);

  const wishListClick = async () => {
    if (alignment === 'wishlist') {
      try {
        await dispatch(removeWishListFromAuthUser({ movieId: movie.movieId })).unwrap();
      } catch (e) {}
    } else {
      if (alignment === 'watchlist') {
        await dispatch(removeWatchListFromAuthUser({ movieId: movie.movieId })).unwrap();
      }
      try {
        await dispatch(addWishListToAuthUser({ movieId: movie.movieId })).unwrap();
      } catch (e) {}
    }
    await dispatch(getMovie({ movieId: movie.movieId }));
    await dispatch(getAuthUserInfo({ uId: currUserUId }));
  };

  const watchListClick = async () => {
    if (alignment === 'watchlist') {
      try {
        await dispatch(removeWatchListFromAuthUser({ movieId: movie.movieId })).unwrap();
      } catch (e) {}
    } else {
      if (alignment === 'wishlist') {
        await dispatch(removeWishListFromAuthUser({ movieId: movie.movieId })).unwrap();
      }
      try {
        await dispatch(addWatchListToAuthUser({ movieId: movie.movieId })).unwrap();
      } catch (e) {}
    }
    await dispatch(getMovie({ movieId: movie.movieId }));
    await dispatch(getAuthUserInfo({ uId: currUserUId }));
  };
  const handleFavouriteClick = async () => {
    if (isFavourite) {
      try {
        await dispatch(removeFavouriteListFromAuthUser({ movieId: movie.movieId })).unwrap();
        setIsFavourite(false);
      } catch (e) {}
    } else {
      try {
        await dispatch(addFavouriteListToAuthUser({ movieId: movie.movieId })).unwrap();
        setIsFavourite(true);
      } catch (e) {}
    }
    await dispatch(getMovie({ movieId: movie.movieId }));
    await dispatch(getAuthUserInfo({ uId: currUserUId }));
  };

  const handleAlignment = (
    event: React.MouseEvent,
    newAlignment: string | null
  ) => {
    setAlignment(newAlignment);
  };
  return (
    <Box display='flex' flexDirection='column' alignItems='center' mb={2} width='100%'>
      <EditMovieModal open={openEdit} handleClose={() => setOpenEdit(false)} movie={movie} />
      <QuizPopup open={openQuiz} handleClose={() => setOpenQuiz(false)} movie={movie}/>
      <Grid container rowSpacing={2} columnSpacing={2} display='flex' justifyContent='center'>
        <Grid item maxWidth={400} >
          <Stack direction="column" justifyContent='center' spacing={1}>
            <Box display='flex' flexDirection='column'>
              <Tooltip title={movie.isFavourite ? 'Remove from favourite' : 'Add to favourite'}>
                <IconButton
                  onClick={handleFavouriteClick}
                  sx={{ position: 'absolute', zIndex: 1000, alignSelf: 'flex-end' }}
                >
                  {isFavourite ? <FavoriteIcon color='error' sx={{ fontSize: 35 }}/> : <FavoriteBorderIcon color='secondary' sx={{ fontSize: 35 }}/>}
                </IconButton>
              </Tooltip>
              <Image
                src={movie.image}
                showLoading
                style={{ borderRadius: 16 }}
                width={'100%'}
                height={'100%'}
              />
            </Box>
              {
                currAuthStatus === AuthUserStatus.LOGIN &&
                (<ToggleButtonGroup
                  color="primary"
                  fullWidth
                  value={alignment}
                  exclusive
                  onChange={handleAlignment}
                  aria-label="text alignment"
                  >
                    <ToggleButton
                      value='wishlist'
                      aria-label="left aligned"
                      onClick={wishListClick}>
                      Wish List
                    </ToggleButton>
                    <ToggleButton
                      value='watchlist'
                      aria-label="right aligned"
                      onClick={watchListClick}>
                      Watched List
                    </ToggleButton>
                  </ToggleButtonGroup>
                )
              }

          </Stack>
          { currAuthStatus === AuthUserStatus.LOGIN &&
            <Grid container width='100%' alignItems='center' justifyContent='space-between' mt={1}>
              <Grid item xs={12} sm={6}>
                <Button fullWidth startIcon={<QuizIcon/>} onClick={() => setOpenQuiz(true)}>Quiz</Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button fullWidth startIcon={<ShareIcon/>}>Share</Button>
              </Grid>
            </Grid>
          }
        </Grid>
        <Grid item maxWidth={750} width={'100%'}>
          {
            movie.genreList.map(genre => <Chip key={genre} label={genre} variant="outlined" sx={{ mr: 1, mb: 1 }} />)
          }
          <br/>
          <Box mt={1} display='flex' alignItems='center' justifyContent='space-between'>
            <Box display='flex' flexDirection='column' justifyContent='center'>
              <Box display='flex'>
                <Box display='flex' mb={0.2}>
                  <Image src={MonsterLogo} fit='cover' height={25} width={25} duration={0} />
                </Box>
                <Typography ml={0.9} mt={0.4}>Monster Rating</Typography>
              </Box>
              <Box display='flex' flexDirection='column'>
                <Box display='flex'>
                  <Rating value={movie.rating} precision={0.1} readOnly />
                  <Typography mt={0.45} ml={0.6}>{movie.rating.toFixed(1)}</Typography>
                </Box>
                <Typography mt={0.45} ml={0.6}>{movie.reviews.length} vote{movie.reviews.length !== 1 && 's'}</Typography>
              </Box>
            </Box>

            <Box display='flex' flexDirection='column'>
              <Box display='flex'>
                <Box mt={0.1} mr={0.5}>
                  <Image src={ImdbLogo} height={20} width='100%' duration={0} />
                </Box>
                <Typography>Rating</Typography>
              </Box>
              <Box display='flex' alignItems='center' justifyContent='flex-end'>
                <Rating name="read-only" value={1} max={1} readOnly />
                  <Typography ml={1} mt={0.6}>{(movie.imdbRating / 2).toFixed(1)}/5</Typography>
              </Box>
            </Box>
          </Box>
          <Box display='flex' flexDirection='column' mb={2}>
            <Box display='flex' justifyContent='space-between'>
              <Typography mt={3} display='inline' variant='h3'>
                {movie.fullTitle}
              </Typography>
              {
                currUserRole === AuthType.ADMIN && (
                  <Tooltip title='Edit movie'>
                    <IconButton onClick={() => setOpenEdit(true)} color='primary' sx={{ borderRadius: 0 }}>
                      <Edit sx={{ fontSize: 40 }} />
                    </IconButton>
                  </Tooltip>
                )
              }
            </Box>
          </Box>

          <Typography mt={1} variant='body1'>
            <b>Content Rating:</b> {movie.contentRating}
          </Typography>

          <Typography mt={1} variant='body1'>
            <b>Release Date:</b> {movie.releaseDate.split('-').reverse().join('/')}
          </Typography>

          <Typography mt={1} variant='body1'>
            <b>Director:</b> {movie.directorList.map(director => director.name).join(', ')}
          </Typography>

          <Typography mt={1} variant='body1'>
            <b>Actors</b>:
          </Typography>
          <ActorList actorList={movie.actorList} />
          <Typography variant='body2'>
            {movie.description}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
export default MovieDetailCard;
