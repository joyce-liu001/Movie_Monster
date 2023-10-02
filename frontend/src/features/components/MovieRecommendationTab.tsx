import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect } from 'react';
import { MoviesType } from '../types/MoviesTypes';
import { MovieList } from './MovieList';
import { useAppDispatch } from '../../app/hooks';
import { useSelector } from 'react-redux';
import { getMovieRecommendations, selectMovieId } from '../slices/MovieSlice';

const testMovies: MoviesType[] = [
  {
    movieId: '1',
    fullTitle: 'The Shawshank Redemption',
    image: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg',
    rating: 9.3,
  },
  {
    movieId: '2',
    fullTitle: 'The Godfather',
    image: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    rating: 9.2,
  },
  {
    movieId: '3',
    fullTitle: 'The Godfather: Part II',
    image: 'https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
    rating: 9.0,
  },
  {
    movieId: '4',
    fullTitle: 'The Dark Knight',
    image: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
    rating: 9.0,
  },
  {
    movieId: '5',
    fullTitle: '12 Angry',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsrnuiAPgRvrzW61WlRXbRtFaj_rCVop4osA&usqp=CAU',
    rating: 8.9,
  },
  {
    movieId: '6',
    fullTitle: 'The Dark Knight Rises',
    image: 'https://m.media-amazon.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_FMjpg_UX1000_.jpg',
    rating: 9.8,
  },
  {
    movieId: '7',
    fullTitle: 'The Lord of the Rings: The Return of the King',
    image: 'https://m.media-amazon.com/images/M/MV5BZGMxZTdjZmYtMmE2Ni00ZTdkLWI5NTgtNjlmMjBiNzU2MmI5XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
    rating: 8.9,
  },
  {
    movieId: '8',
    fullTitle: 'Beginning of the Great Revival',
    image: 'https://thealephmagdotcom.files.wordpress.com/2011/07/beginning-of-the-great-revival-poster.jpg',
    rating: 3.0,
  },
  {
    movieId: '9',
    fullTitle: 'Tam Is Awesome',
    image: 'https://i.picsum.photos/id/670/200/300.jpg?hmac=Ib58hZuwIQfcFZjEvKKi0p-j4GN1BGIkE7wLsa95Xk4',
    rating: 3.0,
  },
  {
    movieId: '10',
    fullTitle: 'Owen was here',
    image: 'https://i.picsum.photos/id/400/200/300.jpg?hmac=FD74WIE42b0qUFf-QggfWsoHPJqcGgjSatRvUM9dAws',
    rating: 3.0,
  },
  {
    movieId: '11',
    fullTitle: 'Joyce of Joy',
    image: 'https://i.picsum.photos/id/796/200/300.jpg?hmac=tubV2vVJFyJ_KIav5eG2iKDmpKoctbrojgEFaflH_l4',
    rating: 3.0,
  },
  {
    movieId: '12',
    fullTitle: 'Matt Damon',
    image: 'https://i.picsum.photos/id/257/200/300.jpg?hmac=j0NVivHS9qSXBGkBOUjchG0Ckt6pje1KSfHsnwtr_8M',
    rating: 3.0,
  },
];

const MovieRecommendationTab = () => {
  const dispatch = useAppDispatch();
  const currMovieId = useSelector(selectMovieId);
  const [formats, setFormats] = React.useState(() => ['']);
  const [recMovies, setRecMovies] = React.useState([]);

  useEffect(() => {
    dispatch(getMovieRecommendations({ movieId: currMovieId, isGenre: formats.includes('genre'), isDirector: formats.includes('director') })).unwrap().then(
      (response) => {
        console.log(response.movies);
        setRecMovies(response.movies);
      }
    );
  }, [formats]);

  const handleChange = (
    event: React.MouseEvent,
    newFormats: string[]
  ) => {
    setFormats(newFormats);
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
        <Typography variant="h5" component="div">Recommendations</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography component='p' sx={{ mb: 1 }}>
          Recommend by:
        </Typography>
        <ToggleButtonGroup
          color="primary"
          value={formats}
          onChange={handleChange}
          sx={{ mb: 2 }}
        >
          <ToggleButton value='genre'>Genre</ToggleButton>
          <ToggleButton value='director'>Director</ToggleButton>
        </ToggleButtonGroup>
        <MovieList movieList={recMovies} />
      </AccordionDetails>
    </Accordion>
  );
};

export default MovieRecommendationTab;
