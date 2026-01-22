import api from "../api/api";
import type {
  Quiz,
  Question,
  QuizAttempt,
  CreateQuizForm,
  LeaderboardEntry,
  ApiResponse,
} from "../types/types";

// Get all quizzes with optional filters
export const getQuizzes = async (): Promise<any> => {
  const response = await api.get("/quizzes/get");
  return response.data;
};

// Get a single quiz by ID
export const getQuiz = async (id: string): Promise<any> => {
  const response = await api.get(`/quizzes/${id}`);
  return response.data;
};

// Get quiz with questions (for taking)
export const getQuizForTaking = async (id: string): Promise<any> => {
  const response = await api.get(`/quizzes/${id}/take`);
  return response.data;
};

// Create a new quiz
export const createQuiz = async (data: CreateQuizForm): Promise<Quiz> => {
  const response = await api.post("/quizzes", data);
  return response.data.data;
};

// Update a quiz
export const updateQuiz = async (
  id: string,
  data: Partial<CreateQuizForm>,
): Promise<Quiz> => {
  const response = await api.put(`/quizzes/${id}`, data);
  return response.data.data;
};

// Delete a quiz
export const deleteQuiz = async (id: string): Promise<ApiResponse<null>> => {
  const response = await api.delete(`/quizzes/${id}`);
  return response.data;
};

// Publish/Unpublish a quiz
export const togglePublishQuiz = async (
  id: string,
  publish: boolean,
): Promise<Quiz> => {
  const response = await api.patch(`/quizzes/${id}/publish`, {
    is_published: publish,
  });
  return response.data.data;
};

// Like a quiz
export const likeQuiz = async (id: string): Promise<any> => {
  const response = await api.post(`/quizzes/${id}/like`);
  return response.data;
};

// Unlike a quiz
export const unlikeQuiz = async (
  id: string,
): Promise<ApiResponse<{ likes_count: number }>> => {
  const response = await api.delete(`/quizzes/${id}/like`);
  return response.data;
};

// Check if user liked quiz
export const checkQuizLike = async (
  id: string,
): Promise<{ liked: boolean }> => {
  const response = await api.get(`/quizzes/${id}/like`);
  return response.data.data;
};

// Get quiz questions
export const getQuizQuestions = async (id: string): Promise<Question[]> => {
  const response = await api.get(`/quizzes/${id}/questions`);
  return response.data.data;
};

// Start quiz attempt
export const startQuizAttempt = async (
  quizId: string,
): Promise<{ attempt_id: string; started_at: string }> => {
  const response = await api.post(`/quizzes/${quizId}/start`);
  return response.data.data;
};

// Submit quiz answers
export const submitQuizAttempt = async (
  quiz_id: string,
  data: any,
): Promise<any> => {
  const response = await api.post(`/quizzes/${quiz_id}/submit`, data);
  return response.data;
};

// Get quiz attempts for a user
export const getUserQuizAttempts = async (
  quizId: string,
): Promise<QuizAttempt[]> => {
  const response = await api.get(`/quizzes/${quizId}/attempts`);
  return response.data.data;
};

// Get quiz leaderboard
export const getQuizLeaderboard = async (
  quizId: string,
  limit?: number,
): Promise<LeaderboardEntry[]> => {
  const response = await api.get(`/quizzes/${quizId}/leaderboard`, {
    params: { limit },
  });
  return response.data.data;
};

// Get recommended quizzes
export const getRecommendedQuizzes = async (): Promise<Quiz[]> => {
  const response = await api.get("/quizzes/recommended");
  return response.data.data;
};

// Get trending quizzes
export const getTrendingQuizzes = async (): Promise<Quiz[]> => {
  const response = await api.get("/quizzes/trending");
  return response.data.data;
};

// Get user's created quizzes
export const getUserCreatedQuizzes = async (
  userId: string,
): Promise<Quiz[]> => {
  const response = await api.get(`/users/${userId}/quizzes`);
  return response.data.data;
};

// Get community quizzes
export const getCommunityQuizzes = async (
  communityId: string,
): Promise<Quiz[]> => {
  const response = await api.get(`/communities/${communityId}/quizzes`);
  return response.data.data;
};

// Get quiz result (detailed breakdown)
export const getQuizResult = async (attemptId: string): Promise<any> => {
  const response = await api.get(`/quizzes/attempts/${attemptId}/results`);
  return response.data;
};
