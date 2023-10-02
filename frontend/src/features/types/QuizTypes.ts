export interface QuestionBase {
  question: string;
  questionType: 'text';
  answers: string[];
  messageForCorrectAnswer: string;
  messageForIncorrectAnswer: string;
  point: string;
}

export interface QuestionSingle extends QuestionBase {
  answerSelectionType: 'single';
  correctAnswer: string,
}

export interface QuestionMultiple extends QuestionBase {
  answerSelectionType: 'multiple';
  correctAnswer: number[],
}

export type QuestionType = QuestionSingle | QuestionMultiple;

export interface QuizType {
  quizTitle: string;
  showInstantFeedback: true,
  quizSynopsis: string;
  questions: QuestionType[];
}
