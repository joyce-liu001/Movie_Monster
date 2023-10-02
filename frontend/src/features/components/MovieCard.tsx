import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { MoviesType } from '../types/MoviesTypes';
import { CardActionArea, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageRoutes from '../../utils/PageRoutes';

const MovieCard = ({ movie }: { movie: MoviesType }) => {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(PageRoutes.MOVIES + `/${movie.movieId}`)}
      sx={{ width: '100%', height: '100%' }}
      variant="outlined"
    >
      <CardActionArea sx={{ width: '100%', height: '100%' }}>
        <CardMedia
          component="img"
          width="100%"
          height={300}
          image={movie.image}
          alt={movie.fullTitle}
        />
        <CardContent>
          <Rating name="read-only" precision={0.1} value={ movie.rating } readOnly />
          <Typography noWrap gutterBottom variant="h6" component="div">
            {movie.fullTitle}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default MovieCard;
