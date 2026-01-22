export interface IOptionWithStats {
  option_id: string;
  text: string;
  is_correct: boolean;
  selection_count: number;
  percentage: number;
}

export interface ICommentRes {
  id: string;
  user_id: string;
  username: string;
  avatar: string | null;
  comment_text: string;
  created_at: string;
}

export interface IQuestionResult {
  question_id: string;
  question_text: string;
  explanation: string;
  correct_answer: string;
  user_answer: string | null;
  is_correct: boolean;
  options: IOptionWithStats[];
  comments: ICommentRes[];
}

export interface IQuizResult {
  attempt_id: string;
  quiz_id: string;
  quiz_title: string;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken_minutes: number;
  completed_at: string;
  questions: IQuestionResult[];
}