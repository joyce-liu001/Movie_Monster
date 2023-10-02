import { Autocomplete, Box } from '@mui/material';
import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { MovieType } from '../types/MovieTypes';
import CustomModal from './CustomModal';
import { InputField } from './FormComponents';
import { getMovie, updateMovie } from '../slices/MovieSlice';

interface Props {
  open: boolean;
  handleClose: () => void;
  movie: MovieType;
}

const genreOptions = [
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

const EditMovieModal = ({ open, handleClose, movie }: Props) => {
  const dispatch = useAppDispatch();
  const [fullTitle, setFullTitle] = React.useState(movie.fullTitle);
  const [description, setDescription] = React.useState(movie.description);
  const [genreList, setGenreList] = React.useState(movie.genreList);

  const handleSuccess = async () => {
    try {
      await dispatch(updateMovie({ movieId: movie.movieId, fullTitle, description, genreList }));
      await dispatch(getMovie({ movieId: movie.movieId }));
      handleClose();
    } catch (e) {
      console.log(e);
    }
  };

  const body = <Box>
    <InputField name='Title' value={fullTitle} onChange={(e: any) => setFullTitle(e.target.value)} />
    <Autocomplete
      multiple
      autoHighlight
      disablePortal
      value={genreList}
      onChange={(e: any, value: any) => setGenreList(value)}
      fullWidth
      options={genreOptions}
      renderInput={(params) => <InputField {...params} name="Genre" />}
    />
    <InputField
      name='Description'
      value={description}
      onChange={(e: any) => setDescription(e.target.value)}
      multiline={true}
      minRows={3}
    />
  </Box>;

  return (
      <CustomModal
        open={open}
        handleClose={handleClose}
        handleSuccess={handleSuccess}
        title='Edit Movie'
        body={body}
      />
  );
};

export default EditMovieModal;
