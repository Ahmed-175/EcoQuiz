interface Creator {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: string;
}
export interface Member {
  id: string;
  username: string;
  avatar: string;
  email: string;
  role: string;
}

export interface CommunityCard {
  id: string;
  name: string;
  description: string;
  banner: string;
  creator?: Creator;
  is_public: boolean;
  allow_public_quiz_submission: boolean;
  number_of_members?: number;
  number_of_quizzes: number;
  created_at: string;
  member_role: string;
  members: Member[];
}

export interface CommunityDetails {
  id: string;
  name: string;
  description: string;
  subject: string;
  creator_id: string;
  banner: string;
  member_role: string;
  creator: Creator;
  members: Member[];
  allow_public_quiz_submission: boolean;
  created_at: string;

  quizzes: Quizzes[];
}

export interface Quizzes {
  id: string;
  creator: Creator;
  title: string;
  description: string;
  duration_minutes: number;
  likes_count: number;
  is_new: boolean;
  number_of_questions: number;
  is_like : boolean;
  average_score: 0;
  students_count: number;
  created_at: string;
}
