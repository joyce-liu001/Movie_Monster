import { Add, Delete, DoneAll } from '@mui/icons-material';
import { Box, Button, Checkbox, Grid, MenuItem, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { InputField } from './FormComponents';
import { QuestionType } from '../types/QuizTypes';

interface QuestionItemProps {
  question: QuestionType;
  modifyQuestion: (newQuestion: QuestionType) => void;
}

const QuestionItem = ({ question, modifyQuestion }: QuestionItemProps) => {
  const handleChangeAnswer = (e: any, i: number) => {
    const newQuestion = { ...question };
    newQuestion.answers[i] = e.target.value;
    modifyQuestion(newQuestion);
  };

  const handleCheckbox = (e: any, i: number) => {
    const newQuestion = { ...question };
    const checked = e.target.checked;
    // console.log(newQuestion);
    if (question.answerSelectionType === 'single') {
      if (checked) {
        newQuestion.correctAnswer = (i + 1).toString();
        modifyQuestion(newQuestion);
      }
    } else {
      const correctAnswers = newQuestion.correctAnswer as number[];
      // console.log(correctAnswers);
      if (checked) {
        correctAnswers.push(i + 1);
      } else {
        if (correctAnswers.length > 1) {
          const index = correctAnswers.indexOf(i + 1);
          if (index > -1) {
            correctAnswers.splice(index, 1);
          }
        }
      }
    }
    modifyQuestion(newQuestion);
  };

  const isCorrect = (i: number) => {
    if (typeof question.correctAnswer === 'string') {
      return i + 1 === parseInt(question.correctAnswer);
    }
    return question.correctAnswer.includes(i + 1);
  };

  const handleQuestionType = (e: any) => {
    const answerSelectionType = e.target.value;
    const newQuestion = { ...question, answerSelectionType };
    if (answerSelectionType === 'single') {
      newQuestion.correctAnswer = question.correctAnswer.length > 0 ? question.correctAnswer[0].toString() : '1';
    } else {
      newQuestion.correctAnswer = [parseInt(question.correctAnswer as string)];
    }
    modifyQuestion(newQuestion);
  };

  const handleRemoveAnswer = () => {
    if (question.answerSelectionType === 'single') {
      let correctAnswer = question.correctAnswer;
      if (parseInt(correctAnswer) === question.answers.length) {
        correctAnswer = (question.answers.length - 1).toString();
      }
      modifyQuestion({ ...question, correctAnswer, answers: question.answers.slice(0, -1) });
      return;
    }
    // multiple
    const newQuestion = { ...question };
    const removedAnswer = question.answers.length;

    const index = newQuestion.correctAnswer.indexOf(removedAnswer);
    if (index > -1) {
      newQuestion.correctAnswer.splice(index, 1);
    }
    if (newQuestion.correctAnswer.length === 0) {
      newQuestion.correctAnswer.push(1);
    }
    newQuestion.answers.pop();
    modifyQuestion(newQuestion);
  };

  // console.log('JSONIFY', JSON.stringify({ ...question }, null, 2));
  return (
    <Box display='flex' flexDirection='column' width='100%'>
      <Grid container columnGap={2}>
        <Grid item xs={12} md={4}>
          <InputField
            name='Question'
            multiline
            minRows={3}
            value={question.question}
            onChange={(e: any) => modifyQuestion({ ...question, question: e.target.value })}
          />
          <InputField
            margin='normal'
            fullWidth
            select
            name='Question Type'
            value={question.answerSelectionType}
            onChange={handleQuestionType}
          >
            <MenuItem value='single'>single</MenuItem>
            <MenuItem value='multiple'>multiple</MenuItem>
          </InputField>
        </Grid>
        <Grid item xs={12} md={7.5}>
          <Box display='flex' justifyContent='space-between'>
            <Typography mt={2} variant='h5'>Answers</Typography>
            <Box mr={1.5} mt={3}>
              <Tooltip title='Select correct answers'>
                <DoneAll color='success' />
              </Tooltip>
            </Box>
          </Box>
          {
            question.answers.map((answer, i) => {
              return <Box key={i} display='flex' alignItems='center'>
                <InputField
                  variant='standard'
                  name={`Answer ${i + 1}`}
                  value={answer}
                  onChange={(e: any) => handleChangeAnswer(e, i)}
                />
                <Checkbox color='success' checked={isCorrect(i)} onChange={(e: any) => handleCheckbox(e, i)}/>
              </Box>;
            })
          }
          <Box display='flex' columnGap={1} mt={1} mb={1}>
            <Button
              disabled={question.answers.length >= 6}
              variant='outlined'
              onClick={() => modifyQuestion({ ...question, answers: [...question.answers, ''] })}
            >
              <Add />
            </Button>
            <Button
              disabled={question.answers.length <= 2}
              variant='outlined'
              onClick={handleRemoveAnswer}
            >
              <Delete />
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QuestionItem;
