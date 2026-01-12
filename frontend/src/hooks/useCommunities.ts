import { useState, useEffect } from 'react';
import type { Community } from '../types/types';
import { getCommunities, getRecommendedCommunities } from '../services/communityService';

export const useCommunities = (params?: {
    page?: number;
    limit?: number;
    search?: string;
    subject?: string;
}) => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                setLoading(true);
                const response = await getCommunities(params);
                setCommunities(response.data);
                setTotalPages(response.total_pages);
                setError(null);
            } catch (err) {
                setError('Failed to fetch communities');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunities();
    }, [params?.page, params?.limit, params?.search, params?.subject]);

    return { communities, loading, error, totalPages, setCommunities };
};

export const useRecommendedCommunities = () => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCommunities = async () => {
            try {
                setLoading(true);
                const data = await getRecommendedCommunities();
                setCommunities(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch recommended communities');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCommunities();
    }, []);

    return { communities, loading, error };
};
