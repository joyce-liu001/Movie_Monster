import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Image } from 'mui-image';
import { Box, Button, Grid, Typography } from '@mui/material';
import PageRoutes from '../../utils/PageRoutes';
import DetectivePikachu from '../../assets/detective-pikachu.png';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <Box display='flex' flexDirection='column' alignItems='center' p={2}>
      <Typography variant='h3'>404: Page not found!</Typography>
      <Typography align='center' className='mt-2 mb-3'>
        Our movie monster was unable to find the page you were looking for :(
      </Typography>
      <Box maxWidth='sm'>
        <Image
          src={DetectivePikachu}
          duration={ 500 }
          alt='DP'
        />
      </Box>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        maxWidth='500px'
        mt={1}
        spacing={1}
      >
        <Grid item xs={12} md={6}>
          <Button onClick={goBack} className='w-100' variant='outlined'>
            Go back
          </Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <Button component={Link} to={PageRoutes.HOME} className='w-100' variant='outlined'>
            Go home
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotFoundPage;
