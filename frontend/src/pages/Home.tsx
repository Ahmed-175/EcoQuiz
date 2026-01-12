import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiUsers, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import Loading from '../components/Loading';
import Button from '../components/ui/Button';
import QuizCard from '../components/quiz/QuizCard';
import CommunityCard from '../components/community/CommunityCard';
import type { Quiz, Community } from '../types/types';
import { getRecommendedQuizzes, getTrendingQuizzes } from '../services/quizService';
import { getRecommendedCommunities } from '../services/communityService';

const Home = () => {
  const { user, loading: authLoading } = useAuth();
  const [recommendedQuizzes, setRecommendedQuizzes] = useState<Quiz[]>([]);
  const [trendingQuizzes, setTrendingQuizzes] = useState<Quiz[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [recommended, trending, comms] = await Promise.all([
          getRecommendedQuizzes(),
          getTrendingQuizzes(),
          getRecommendedCommunities()
        ]);
        setRecommendedQuizzes(recommended);
        setTrendingQuizzes(trending);
        setCommunities(comms);
      } catch (error) {
        console.error('Failed to fetch home data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (authLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        {/* Quick Actions */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <Link
            to="/quiz/create"
            className="group  p-6 bg-linear-to-r from-cyan-500 to-blue-500 rounded-2xl text-white hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 hover:-translate-y-1"
          >
            <FiPlus className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold mb-1">Create Quiz</h3>
            <p className="text-sm opacity-90">Share your knowledge with others</p>
          </Link>

          <Link
            to="/community/create"
            className="group p-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-2xl text-white hover:shadow-xl hover:shadow-violet-200 transition-all duration-300 hover:-translate-y-1"
          >
            <FiUsers className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold mb-1">Create Community</h3>
            <p className="text-sm opacity-90">Build a learning community</p>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Home;