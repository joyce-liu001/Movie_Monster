import { SvgIconComponent } from '@mui/icons-material';
import { Box, Stack, Typography } from '@mui/material';
import Image from 'mui-image';
import React from 'react';
import Carousel from 'react-multi-carousel';
import { ActorType } from '../types/MovieTypes';

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 10
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5
  },
  tablet: {
    breakpoint: { max: 1200, min: 464 },
    items: 3
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 2
  }
};

const ActorItem = ({ actor }: { actor: ActorType }) => {
  const [hovered, setHovered] = React.useState(false);

  return <Box
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
    sx={{ cursor: 'pointer', opacity: hovered ? '50%' : '100%' }}
    key={actor.id}
    height={200}
    width='100%'
    minWidth='50px'
    mb={5}
    pr={{ xs: 0.5, mg: 1 }}
  >
  <Stack>
    <Image
      className='pe-none user-select-none'
      width='100%'
      height={150}
      duration={1}
      src={actor.image}
      style={{ margin: 1, borderRadius: 8 }}
      alt='DP'
    />
    <Typography variant='body1' style={{ textAlign: 'center' }} text-align='center'>
      {actor.name}
    </Typography>
    <Typography variant='caption' style={{ textAlign: 'center' }} text-align='center'>
      {actor.asCharacter}
    </Typography>

  </Stack>
  </Box>;
};

export const ActorList = ({ actorList }: { actorList: ActorType[] }) => {
  return (
    <Carousel
      className='w-100 mb-3'
      slidesToSlide={3}
      responsive={responsive}
      swipeable={true}
      draggable={true}
      showDots={true}
      infinite={false}
      rewindWithAnimation={true}
      keyBoardControl={true}
      transitionDuration={500}
      removeArrowOnDeviceType={['tablet', 'mobile']}
    >
      {actorList.map((actor: ActorType) => {
        return (
          <ActorItem key={actor.id} actor={actor}/>
        );
      })}
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
