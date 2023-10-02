import React from 'react';
import { Box, Dialog, DialogTitle, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { MovieType } from '../types/MovieTypes';
import QuizCreate from './QuizCreate';
import { Settings } from '@mui/icons-material';
import QuizPlay from './QuizPlay';
import { apiCall, createDefaultQuiz } from '../../utils/Helper';
import { QuizType } from '../types/QuizTypes';
import { useSelector } from 'react-redux';
import { getAuthUserRole, getAuthUserToken } from '../slices/AuthUserSlice';
import { useAppDispatch } from '../../app/hooks';

interface ModalProps {
  open: boolean;
  handleClose: () => void;
  movie: MovieType;
}

enum QuizState {
  CREATE = 'Create',
  EDIT = 'Edit',
  PLAY = 'Play',
}

const QuizPopup = ({ open, handleClose, movie }: ModalProps) => {
  const authUserRole = useSelector(getAuthUserRole);
  const token = useSelector(getAuthUserToken);
  const movieId = movie.movieId;
  const dispatch = useAppDispatch();
  const [quizState, setQuizState] = React.useState(QuizState.PLAY);
  const [quiz, setQuiz] = React.useState(createDefaultQuiz());

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const handleOpenNavMenu = (event: any) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleChangeState = (state: QuizState) => {
    setQuizState(state);
    handleCloseNavMenu();
  };

  const reloadQuiz = async () => {
    const res = await apiCall('GET', '/quiz/details', { movieId: movie.movieId }, false, null, null);
    setQuiz(JSON.parse(res.quiz.quizContent));
  };

  const fakeGetState = () => ({ authUser: { token } });

  const createQuiz = async (quizObject: QuizType) => {
    await apiCall(
      'POST',
      '/quiz/create',
      {
        movieId: movie.movieId,
        quizTitle: quizObject.quizTitle,
        quizSynopsis: quizObject.quizSynopsis,
        quizContent: JSON.stringify(quizObject),
      },
      true, dispatch, fakeGetState
    );
    reloadQuiz();
  };

  const editQuiz = async (quizObject: QuizType) => {
    await apiCall(
      'PUT',
      '/quiz/edit',
      {
        movieId,
        quizTitle: quizObject.quizTitle,
        quizSynopsis: quizObject.quizSynopsis,
        quizContent: JSON.stringify(quizObject)
      },
      true, dispatch, fakeGetState
    );
    reloadQuiz();
  };

  React.useEffect(() => {
    reloadQuiz();
  }, []);

  let body;
  if (quizState === QuizState.PLAY) {
    body = <QuizPlay quiz={quiz} />;
  } else if (quizState === QuizState.EDIT) {
    body = <QuizCreate quiz={quiz} handleClose={handleClose} handleSuccess={editQuiz}/>;
  } else {
    body = <QuizCreate quiz={createDefaultQuiz()} handleClose={handleClose} handleSuccess={createQuiz}/>;
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      sx={{
        '& .MuiDialog-container': {
          '& .MuiPaper-root': {
            width: '100%',
            maxWidth: 1000,
          },
        },
      }}
    >
      <DialogTitle>
        <Box display='flex' justifyContent='space-between'>
          <Typography variant='h5'>
            {quizState} Quiz
          </Typography>
          <Box>
            {
            // <Select
            //   sx={{ ml: 0.5, padding: '5px' }}
            //   value={quizState}
            //   onChange={(event: SelectChangeEvent) => setQuizState(event.target.value as QuizState)}
            //   variant='standard'
            //   disableUnderline
            // >
            }
            <IconButton
              aria-label="account of current user"
              aria-controls="quiz-settings"
              aria-haspopup="true"
              sx={{ mb: 1 }}
              onClick={handleOpenNavMenu}
            >
              <Settings />
            </IconButton>
            {
              authUserRole === 'admin' && (
                <Menu
                  id="quiz-settings"
                  anchorEl={anchorElNav}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  keepMounted
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => handleChangeState(QuizState.CREATE)}>{QuizState.CREATE}</MenuItem>
                  <MenuItem onClick={() => handleChangeState(QuizState.EDIT)}>{QuizState.EDIT}</MenuItem>
                  <MenuItem onClick={() => handleChangeState(QuizState.PLAY)}>{QuizState.PLAY}</MenuItem>
                </Menu>
              )
            }
          </Box>
        </Box>
      </DialogTitle>
      {body}
    </Dialog>
  );
};

export default QuizPopup;
