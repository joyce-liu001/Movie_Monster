import { Box } from '@mui/material';
import React from 'react';
import Quiz from 'react-quiz-component-3900';
import { QuizType } from '../types/QuizTypes';

export const colours = [
  '#785270',
  '#486814',
  '#18619c',
  '#845130',
  '#596164',
  '#685e0c',
  '#346380',
  '#562a88',
];

export const getRandomColour = () => colours[Math.floor(Math.random() * colours.length)];

const QuizPlay = ({ quiz }: { quiz: QuizType }) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      bgcolor={getRandomColour()}
    >
       <Quiz quiz={quiz} />
    </Box>
  );
};

export default QuizPlay;
