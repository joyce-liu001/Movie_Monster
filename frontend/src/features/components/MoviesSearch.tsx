import { Search } from '@mui/icons-material';
import { Autocomplete, IconButton, Stack, TextField } from '@mui/material';
import React from 'react';
import { apiCall, filterOptions } from '../../utils/Helper';

interface MoviesSearchProps {
  doSearch: (searchString: string) => void;
}

const MoviesSearch = ({ doSearch }: MoviesSearchProps) => {
  const [searchString, setSearchString] = React.useState('');
  const [suggestions, setSuggestions] = React.useState([]);

  const handleKeyUp = (e: any) => {
    if (e.key === 'Enter') {
      doSearch(searchString);
    }
  };

  React.useEffect(() => {
    apiCall('GET', '/movie/search/suggestion', { searchString }, false, null, null)
      .then((result) => setSuggestions(result.titles));
  }, [searchString]);

  return (
    <Autocomplete
      freeSolo
      disablePortal
      fullWidth
      onInputChange={(_: any, key: any) => setSearchString(key)}
      onChange={(_, value: any) => doSearch(value || '')}
      value={searchString}
      renderInput={(params) =>
        <Stack direction='row' spacing={1}>
          <TextField
            {...params}
            value={searchString}
            label="Search movies"
            onKeyUp={handleKeyUp}
          />
          <IconButton onClick={() => doSearch(searchString)} size="large">
            <Search />
          </IconButton>
        </Stack>
      }
      options={suggestions.map(suggestion => suggestion)}
      filterOptions={filterOptions}
    />
  );
};

export default MoviesSearch;
