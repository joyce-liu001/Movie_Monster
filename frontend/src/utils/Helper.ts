import axios, { Method } from 'axios';
import { clearAuthUser } from '../features/slices/AuthUserSlice';
import { showNotification } from '../features/slices/NotificationSlice';
import { NotificationStatus } from '../features/types/NotificationType';
import { createFilterOptions, PaletteMode } from '@mui/material';
import { BACKEND_URL } from './Config';
import { ContentState, convertToRaw } from 'draft-js';
import { QuestionType, QuizType } from '../features/types/QuizTypes';

export const apiCall = async (method: Method, path: string, payload: any, hasToken = false, dispatch: any, getState: any) => {
  const url = BACKEND_URL + path;
  const info = {
    method,
    url,
    headers: {},
    data: {},
    params: {},
  };

  if (['GET', 'DELETE'].includes(method.toUpperCase())) {
    info.params = payload;
  } else {
    info.data = payload;
  }

  if (hasToken) {
    const token = getState().authUser.token;
    info.headers = { Authorization: token };
  }

  try {
    const retData = await axios(info);
    // console.log('retData', retData);
    return retData.data;
  } catch (e:any) {
    // console.log(e.response);
    if (e.message === 'Network Error') {
      // console.log('hello');
      dispatch(showNotification({ message: 'Error: Network Error', httpStatus: 0, type: 'error', status: NotificationStatus.SHOWING }));
    }
    if (!dispatch) {
      return;
    }
    if (e.response.status === 401) {
      dispatch(clearAuthUser());
    }
    dispatch(showNotification({ message: e.response.data.message, httpStatus: e.response.status, type: 'error', status: NotificationStatus.SHOWING }));
    return Promise.reject(e);
  }
};

export const generateTheme = (mode: string) => {
  const asteriskColour = '#db3131';
  return {
    palette: {
      mode: mode as PaletteMode,
    },
    components: {
      MuiFormLabel: {
        styleOverrides: {
          asterisk: {
            color: asteriskColour,
            '&$error': {
              color: asteriskColour,
            },
          },
          root: {
            color: 'grey'
          }
        },
      },
    },
    overrides: {
      MUIRichTextEditor: {
        editor: {
          minHeight: 200,
          maxWidth: 700
        }
      }
    }
  };
};

const OPTIONS_LIMIT = 5;
const defaultFilterOptions = createFilterOptions();
export const filterOptions = (options: any, state: any) => {
  return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
};

export const getRandomEditorText = () => {
  const randomText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum";
  return JSON.stringify(convertToRaw(ContentState.createFromText(randomText)));
};

export const createDefaultQuestion = (): QuestionType => {
  const defaultQuestion: QuestionType = {
    question: 'Enter question?',
    questionType: 'text',
    answerSelectionType: 'single',
    answers: [
      'answer 1',
      'answer 2',
    ],
    correctAnswer: '1',
    messageForCorrectAnswer: 'Correct! :D',
    messageForIncorrectAnswer: 'Incorrect! :C',
    point: '10'
  };
  return defaultQuestion;
};

export const createDefaultQuiz = (): QuizType => {
  const defaultQuiz: QuizType = {
    quizTitle: 'There is no quiz available for this movie. Here is a default one :D',
    showInstantFeedback: true,
    quizSynopsis: 'Template for default quiz',
    questions: [
      createDefaultQuestion(),
    ]
  };
  return defaultQuiz;
};
