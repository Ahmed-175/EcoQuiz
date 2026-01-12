import api from '../api/api';
import type {
    Community,
    CommunityMember,
    CreateCommunityForm,
    ApiResponse,
    PaginatedResponse
} from '../types/types';

// Get all communities with optional filters
export const getCommunities = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    subject?: string;
}): Promise<PaginatedResponse<Community>> => {
    const response = await api.get('/communities', { params });
    return response.data;
};

// Get a single community by ID
export const getCommunity = async (id: string): Promise<Community> => {
    const response = await api.get(`/communities/${id}`);
    return response.data.data;
};

// Create a new community
export const createCommunity = async (data: CreateCommunityForm): Promise<Community> => {
    const response = await api.post('/communities', data);
    return response.data.data;
};

// Update a community
export const updateCommunity = async (id: string, data: Partial<CreateCommunityForm>): Promise<Community> => {
    const response = await api.put(`/communities/${id}`, data);
    return response.data.data;
};

// Delete a community
export const deleteCommunity = async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/communities/${id}`);
    return response.data;
};

// Join a community
export const joinCommunity = async (id: string): Promise<ApiResponse<CommunityMember>> => {
    const response = await api.post(`/communities/${id}/join`);
    return response.data;
};

// Leave a community
export const leaveCommunity = async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.post(`/communities/${id}/leave`);
    return response.data;
};

// Get community members
export const getCommunityMembers = async (id: string): Promise<CommunityMember[]> => {
    const response = await api.get(`/communities/${id}/members`);
    return response.data.data;
};

// Update member role
export const updateMemberRole = async (
    communityId: string,
    userId: string,
    role: 'admin' | 'member'
): Promise<ApiResponse<CommunityMember>> => {
    const response = await api.post(`/communities/${communityId}/members/${userId}/role`, { role });
    return response.data;
};

// Remove member from community
export const removeMember = async (communityId: string, userId: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/communities/${communityId}/members/${userId}`);
    return response.data;
};

// Get recommended communities
export const getRecommendedCommunities = async (): Promise<Community[]> => {
    const response = await api.get('/communities/recommended');
    return response.data.data;
};

// Get user's communities
export const getUserCommunities = async (userId: string): Promise<Community[]> => {
    const response = await api.get(`/users/${userId}/communities`);
    return response.data.data;
};

// Check if user is member
export const checkMembership = async (communityId: string): Promise<{ isMember: boolean; role?: string }> => {
    const response = await api.get(`/communities/${communityId}/membership`);
    return response.data.data;
};
