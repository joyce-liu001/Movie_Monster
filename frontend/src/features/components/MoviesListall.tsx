import React from 'react';
import {
  Box,
  Tooltip,
  Typography
} from '@mui/material';
import MovieCard from '../components/MovieCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MoviesType } from '../types/MoviesTypes';

interface MoviesListallProps {
  movies: MoviesType[];
  hasMore: boolean;
  fetchMore: () => void;
}

const MoviesListall = ({ movies, hasMore, fetchMore }: MoviesListallProps) => {
  return (
    <InfiniteScroll
      dataLength={movies.length}
      scrollThreshold={1}
      next={fetchMore}
      hasMore={hasMore}
      endMessage={
        <Typography textAlign='center' mt={3}>
          <b>Yay! You have seen it all</b>
        </Typography>
      }
      loader={
        <Typography textAlign='center' mt={2}>
          <b>Loading ...</b>
        </Typography>
      }>
      {
        <Box
          mt={3}
          columnGap={1}
          rowGap={1}
          display='flex'
          justifyContent='center'
          alignItems='center'
          flexWrap='wrap'
        >
          {
            movies.map(m => {
              return (
                <Tooltip key={m.movieId} title={m.fullTitle} followCursor>
                  <Box height={400} width={200}>
                    <MovieCard movie={m} />
                  </Box>
                </Tooltip>
              );
            })
          }
        </Box>
      }
    </InfiniteScroll>
  );
};

export default MoviesListall;
