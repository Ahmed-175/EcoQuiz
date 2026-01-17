// User types
export interface User {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  avatar: string;
  banner: string;
  google_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Community types
export interface Community {
  id: string;
  name: string;
  description: string;
  subject: string;
  creator_id: string;
  creator?: User;
  is_public: boolean;
  allow_public_quiz_submission: boolean;
  member_count?: number;
  quiz_count?: number;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  user?: User;
  role: "creator" | "admin" | "member";
  joined_at: string;
}

// Quiz types
export interface Quiz {
  id: string;
  community_id: string;
  community?: Community;
  creator_id: string;
  creator?: User;
  title: string;
  description: string;
  duration_minutes: number;
  likes_count: number;
  is_published: boolean;
  question_count?: number;
  avg_score?: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer?: "a" | "b" | "c" | "d";
  explanation?: string;
  order_index: number;
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  quiz?: Quiz;
  user_id: string;
  user?: User;
  score: number;
  total_questions: number;
  percentage: number;
  time_taken_seconds: number;
  completed_at: string;
}

export interface QuestionComment {
  id: string;
  question_id: string;
  user_id: string;
  user?: User;
  comment_text: string;
  created_at: string;
  updated_at: string;
}

// User Stats
export interface UserQuizStats {
  user_id: string;
  total_quizzes_taken: number;
  average_score: number;
  best_score: number;
  updated_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// Form types
export interface CreateCommunityForm {
  name: string;
  description: string;
  banner: string;
  allow_public_quiz_submission: boolean;
}

export interface CreateQuizForm {
  community_id: string;
  title: string;
  description: string;
  duration_minutes: number;
  questions: CreateQuestionForm[];
}

export interface CreateQuestionForm {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "a" | "b" | "c" | "d";
  explanation?: string;
}

export interface SubmitQuizForm {
  quiz_id: string;
  answers: {
    question_id: string;
    selected_option: "a" | "b" | "c" | "d";
  }[];
  time_taken_seconds: number;
}

// Leaderboard
export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  percentage: number;
  time_taken_seconds: number;
  completed_at: string;
}
