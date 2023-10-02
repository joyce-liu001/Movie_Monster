import { Box } from '@mui/material';
import 'react-multi-carousel/lib/styles.css';
import { FavoriteBorder, HistoryOutlined, StarOutline } from '@mui/icons-material';
import { ListDisplay, MovieList } from './MovieList';
import { UserType } from '../types/UserTypes';

// const testMovies: MoviesType[] = [
//   {
//     movieId: '1',
//     fullTitle: 'The Shawshank Redemption',
//     image: 'https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg',
//     rating: 9.3
//   },
//   {
//     movieId: '2',
//     fullTitle: 'The Godfather',
//     image: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
//     rating: 9.2
//   },
//   {
//     movieId: '3',
//     fullTitle: 'The Godfather: Part II',
//     image: 'https://m.media-amazon.com/images/M/MV5BMWMwMGQzZTItY2JlNC00OWZiLWIyMDctNDk2ZDQ2YjRjMWQ0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
//     rating: 9.0
//   },
//   {
//     movieId: '4',
//     fullTitle: 'The Dark Knight',
//     image: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
//     rating: 9.0
//   },
//   {
//     movieId: '5',
//     fullTitle: '12 Angry',
//     image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsrnuiAPgRvrzW61WlRXbRtFaj_rCVop4osA&usqp=CAU',
//     rating: 8.9
//   },
//   {
//     movieId: '6',
//     fullTitle: 'The Dark Knight Rises',
//     image: 'https://m.media-amazon.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_FMjpg_UX1000_.jpg',
//     rating: 9.8
//   },
//   {
//     movieId: '7',
//     fullTitle: 'The Lord of the Rings: The Return of the King',
//     image: 'https://m.media-amazon.com/images/M/MV5BZGMxZTdjZmYtMmE2Ni00ZTdkLWI5NTgtNjlmMjBiNzU2MmI5XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
//     rating: 8.9
//   },
//   {
//     movieId: '8',
//     fullTitle: 'Beginning of the Great Revival',
//     image: 'https://thealephmagdotcom.files.wordpress.com/2011/07/beginning-of-the-great-revival-poster.jpg',
//     rating: 3.0
//   },
//   {
//     movieId: '9',
//     fullTitle: 'Tam Is Awesome',
//     image: 'https://i.picsum.photos/id/670/200/300.jpg?hmac=Ib58hZuwIQfcFZjEvKKi0p-j4GN1BGIkE7wLsa95Xk4',
//     rating: 3.0
//   },
//   {
//     movieId: '10',
//     fullTitle: 'Owen was here',
//     image: 'https://i.picsum.photos/id/400/200/300.jpg?hmac=FD74WIE42b0qUFf-QggfWsoHPJqcGgjSatRvUM9dAws',
//     rating: 3.0
//   },
//   {
//     movieId: '11',
//     fullTitle: 'Joyce of Joy',
//     image: 'https://i.picsum.photos/id/796/200/300.jpg?hmac=tubV2vVJFyJ_KIav5eG2iKDmpKoctbrojgEFaflH_l4',
//     rating: 3.0
//   },
//   {
//     movieId: '12',
//     fullTitle: 'Matt Damon',
//     image: 'https://i.picsum.photos/id/257/200/300.jpg?hmac=j0NVivHS9qSXBGkBOUjchG0Ckt6pje1KSfHsnwtr_8M',
//     rating: 3.0
//   },
// ];

const UserMoviesTab = ({ user }: { user: UserType }) => {
  const wishList = user.wishList.slice().sort(() => 0.5 - Math.random());
  const favouriteList = user.favouriteList.slice().sort(() => 0.5 - Math.random());
  const watchedList = user.watchList.slice().sort(() => 0.5 - Math.random());

  return (
    <Box display='flex' flexDirection='column' width='100%' pr={{ xs: 0, md: 15 }}>
      <ListDisplay Icon={StarOutline} title='Wish List' />
      <MovieList movieList={wishList} />

      <ListDisplay Icon={HistoryOutlined} title='Watched List' />
      <MovieList movieList={watchedList} />

      <ListDisplay Icon={FavoriteBorder} title='Favourite List' />
      <MovieList movieList={favouriteList} />
    </Box>
  );
};

export default UserMoviesTab;
