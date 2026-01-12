import api from '../api/api';
import type { QuestionComment, ApiResponse } from '../types/types';

// Get comments for a question
export const getQuestionComments = async (questionId: string): Promise<QuestionComment[]> => {
    const response = await api.get(`/questions/${questionId}/comments`);
    return response.data.data;
};

// Add comment to a question
export const addComment = async (questionId: string, commentText: string): Promise<QuestionComment> => {
    const response = await api.post(`/questions/${questionId}/comments`, { comment_text: commentText });
    return response.data.data;
};

// Update a comment
export const updateComment = async (commentId: string, commentText: string): Promise<QuestionComment> => {
    const response = await api.put(`/comments/${commentId}`, { comment_text: commentText });
    return response.data.data;
};

// Delete a comment
export const deleteComment = async (commentId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
};
