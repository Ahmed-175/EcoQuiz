export interface quizHome {
  id: string;
  community: Community;
  creator: Creator;
  title: string;
  description: string;
  duration_minutes: number;
  likes_count: number;
  is_new: string;
  is_liked: boolean;
  average_score: number;
  number_of_questions: number;
  students_count: number;
  created_at: string;
}

interface Community {
  id: string;
  name: string;
  banner: string;
  is_joined: string;
}

interface Creator {
  id: string;
  email: string;
  username: string;
  avatar: string;
  role: string;
}
