import { SvgIconComponent } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import Image from 'mui-image';
import React from 'react';
import Carousel from 'react-multi-carousel';
import { useNavigate } from 'react-router-dom';
import PageRoutes from '../../utils/PageRoutes';
import { MoviesType } from '../types/MoviesTypes';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 15
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 8
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 5
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2
  }
};

const MovieItem = ({ movie }: { movie: MoviesType }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = React.useState(false);

  return <Box
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    onClick={() => navigate(PageRoutes.MOVIES + `/${movie.movieId}`)}
    sx={{ cursor: 'pointer', opacity: hovered ? '50%' : '100%' }}
    key={movie.movieId}
    height={250}
    width='100%'
    minWidth={150}
    pr={{ xs: 0.5, mg: 1 }}
  >
    {/* { hovered && */}
    {/*   <IconButton */}
    {/*     sx={{ position: 'fixed', top: 0, right: 0, zIndex: 2000 }} */}
    {/*   > */}
    {/*     <Delete color='error' /> */}
    {/*   </IconButton> */}
    {/* } */}
    <Image
      className='pe-none user-select-none'
      width='100%'
      height='100%'
      duration={1}
      src={movie.image}
      alt='DP'
    />
  </Box>;
};

export const MovieList = ({ movieList }: { movieList: MoviesType[] }) => {
  return (
    <Carousel
      className='w-100'
      slidesToSlide={3}
      responsive={responsive}
      swipeable={true}
      draggable={true}
      showDots={false}
      infinite={false}
      rewindWithAnimation={true}
      keyBoardControl={true}
      transitionDuration={500}
      removeArrowOnDeviceType={['tablet', 'mobile']}
    >
      {movieList.map((movie) => <MovieItem key={movie.movieId} movie={movie} />)}
    </Carousel>
  );
};

export const ListDisplay = ({ Icon, title }: { Icon: SvgIconComponent, title: string }) => {
  return (
    <Box mt={3} mb={1} display='flex'>
      <Icon sx={{ mt: 0.1 }} />
      <Typography ml={1} variant='h5'>
        {title}
      </Typography>
    </Box>
  );
};
