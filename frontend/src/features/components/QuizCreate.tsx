import { AppBar, Box, Button, DialogActions, DialogContent, Divider, Tab, Tabs, Tooltip, Typography } from '@mui/material';
import { InputField } from './FormComponents';
import QuestionItem from './QuestionItem';
import SwipeableViews from 'react-swipeable-views';
import React from 'react';
import { QuestionType, QuizType } from '../types/QuizTypes';
import { Add, Delete } from '@mui/icons-material';
import { apiCall, createDefaultQuestion } from '../../utils/Helper';
import { useDispatch, useSelector } from 'react-redux';
import { selectMovieId } from '../slices/MovieSlice';

interface QuizCreateProps {
  quiz: QuizType;
  handleClose: () => void;
  handleSuccess: (quizObject: QuizType) => void;
}

const QuizCreate = ({ quiz: inputQuiz, handleClose, handleSuccess }: QuizCreateProps) => {
  const [quiz, setQuiz] = React.useState(inputQuiz);
  const [questionView, setQuestionView] = React.useState(0);

  const handleModifyQuestion = (i: number) => (newQuestion: QuestionType) => {
    const newQuiz = { ...quiz };
    quiz.questions[i] = newQuestion;
    setQuiz({ ...newQuiz });
  };

  const handleAddQuestion = () => {
    setQuiz({ ...quiz, questions: [...quiz.questions, createDefaultQuestion()] });
    setQuestionView(quiz.questions.length);
  };

  const handleRemoveQuestion = () => {
    setQuestionView(quiz.questions.length - 2);
    setQuiz({ ...quiz, questions: quiz.questions.slice(0, -1) });
  };

  return (
    <>
      <DialogContent>
        <Box display='flex' flexDirection='column'>
          <InputField name='Title' onChange={(e: any) => setQuiz({ ...quiz, quizTitle: e.target.value })}/>
          <InputField name='Sypnosis' onChange={(e: any) => setQuiz({ ...quiz, quizSynopsis: e.target.value })}/>
          <Box display='flex'>
            <Typography mt={2} mr={1} variant='h5'>Questions</Typography>
            <Tooltip title='Add a new question'>
              <span>
                <Button disabled={quiz.questions.length >= 10} variant='outlined' onClick={handleAddQuestion} sx={{ mt: 1.2, mr: 1 }}>
                  <Add color='primary'/>
                </Button>
              </span>
            </Tooltip>
            <Tooltip title='Remove a question'>
              <span>
                <Button disabled={quiz.questions.length <= 1} variant='outlined' onClick={handleRemoveQuestion} sx={{ mt: 1.2 }}>
                  <Delete color='primary'/>
                </Button>
              </span>
            </Tooltip>
          </Box>
          <Box
            display='flex'
            flexDirection='column'
            width='100%'
            mb={1}
            overflow='auto'
          >
            <AppBar position="static" sx={{ mt: 1 }}>
              <Tabs
                value={questionView}
                onChange={(event: React.SyntheticEvent, newValue: number) => setQuestionView(newValue)}
                indicatorColor="secondary"
                textColor="inherit"
                aria-label="full width tabs example"
                variant="scrollable"
                scrollButtons="auto"
              >
                {
                  quiz.questions.map((question: QuestionType, i: number) => {
                    return (
                      <Tab key={i} label={`Question ${i + 1}`} />
                    );
                  })
                }
              </Tabs>
            </AppBar>
            <SwipeableViews
              index={questionView}
              onChangeIndex={setQuestionView}
            >
              {
                quiz.questions.map((question: QuestionType, i: number) => {
                  return (
                    <Box pl={1} mt={1} key={i} display='flex' flexDirection='column'>
                      <Divider sx={{ borderBottomWidth: 3, my: 2, borderColor: 'black' }} flexItem />
                      <QuestionItem question={question} modifyQuestion={handleModifyQuestion(i)}/>
                    </Box>
                  );
                })
              }
            </SwipeableViews>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
        <Button onClick={() => handleSuccess(quiz)} autoFocus>
          Confirm
        </Button>
      </DialogActions>
    </>
  );
};

export default QuizCreate;
