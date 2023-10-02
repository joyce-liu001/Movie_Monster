import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  List,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { SortType } from '../types/FilterObjectTyoe';
import { MoviesType } from '../types/MoviesTypes';
import { useSelector } from 'react-redux';
import { clearMovies, getMovies, selectMovies, selectMoviesTotal } from '../slices/MoviesSlice';
import { useAppDispatch } from '../../app/hooks';
import MoviesListall from '../components/MoviesListall';
import MoviesSearch from '../components/MoviesSearch';

const genreOptions = [
  'None',
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'History',
  'Horror',
  'Music',
  'Musical',
  'Mystery',
  'News',
  'Romance',
  'Sci-Fi',
  'Sport',
  'Superhero',
  'Thriller',
  'War',
  'Western',
];

const MoviesPage = () => {
  const dispatch = useAppDispatch();
  const [keyword, setKeyword] = React.useState('');
  const [sortBy, setSortBy] = React.useState<SortType>(SortType.BY_NAME);
  const [genre, setGenre] = React.useState<string>('');
  const [director, setDirector] = React.useState<string>('');
  const [ignoreWish, setIgnoreWish] = React.useState(false);
  const [ignoreWatch, setIgnoreWatch] = React.useState(false);
  const [ignoreFavourite, setIgnoreFavourite] = React.useState(false);
  const movies: MoviesType[] = useSelector((state: any) => selectMovies(state));
  const [hasMore, setHasMore] = React.useState(true);
  const start = useSelector(selectMoviesTotal);

  const fetchMore = async (newKeyword = keyword, newStart = start) => {
    const result = await dispatch(getMovies({ keyword: newKeyword, start: newStart, sortBy, genre, director, ignoreWish, ignoreWatch, ignoreFavourite })).unwrap();
    setHasMore(result.end !== -1);
  };

  const doSearch = async (newKeyword: string) => {
    dispatch(clearMovies());
    await fetchMore(newKeyword, 0);
    console.log('Completed search with', newKeyword);
    setKeyword(newKeyword);
  };

  React.useEffect(() => {
    doSearch(keyword).then();
  }, [genre, sortBy, ignoreWish, ignoreWatch, ignoreFavourite]);

  return (
    <Box p={{ xs: 1, md: 2 }}>
      <Box display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
        <MoviesSearch doSearch={doSearch} />
        <List sx={{ width: '100%', my: 2 }}>
          <Grid container spacing={2} sx={{ mb: 1 }}>
            <Grid item xs={12} sm={4}>
              <Accordion >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                >
                  <Typography variant="h6" component="div">Filter By</Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Grid container spacing={1} sx={{ mb: 1 }}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Director"
                        value={director}
                        onChange={e => setDirector(e.target.value)}
                        variant="standard"/>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl variant="standard" fullWidth>
                        <InputLabel>Genre</InputLabel>
                        <Select
                          defaultValue=""
                          value={genre}
                          onChange={(e) => e.target.value === 'None' ? setGenre('') : setGenre(e.target.value)}
                        >
                          {
                            genreOptions.map((option, index) => (
                              <MenuItem key={index} value={option}>{option}</MenuItem>
                            ))
                          }
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                </AccordionDetails>
              </Accordion>
            </Grid>

            <Grid item xs={12} sm={2} width='100%'>
              <FormControl fullWidth variant="standard">
                <TextField
                  fullWidth
                  select
                  label='Sort By'
                  key="sort"
                  defaultValue={SortType.BY_NAME}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                >
                  <MenuItem value={SortType.BY_RATING}>Rating</MenuItem>
                  <MenuItem value={SortType.BY_NAME}>Name</MenuItem>
                </TextField>
              </FormControl>
            </Grid>

            <Grid ml={{ xs: 0, sm: 2 }} mt={1} item xs={12} sm={1.5}>
              <FormControlLabel
                label="Ignore Wish"
                control={<Checkbox checked={ignoreWish} onChange={(e: any) => setIgnoreWish(e.target.checked)} />}
              />
            </Grid>
            <Grid item mt={1} xs={12} sm={1.7}>
              <FormControlLabel
                label="Ignore Watched"
                control={<Checkbox checked={ignoreWatch} onChange={(e: any) => setIgnoreWatch(e.target.checked)} />}
              />
            </Grid>
            <Grid item mt={1} xs={12} sm={1.5}>
              <FormControlLabel
                label="Ignore Favourite"
                control={<Checkbox checked={ignoreFavourite} onChange={(e: any) => setIgnoreFavourite(e.target.checked)} />}
              />
            </Grid>
          </Grid>
          <MoviesListall movies={movies} hasMore={hasMore} fetchMore={fetchMore} />
        </List>
      </Box>
    </Box>
  );
};

export default MoviesPage;
