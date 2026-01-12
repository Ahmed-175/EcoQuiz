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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="text-blue-600">{user?.username || 'Learner'}</span>! 👋
          </h1>
          <p className="text-gray-600">Ready to learn something new today?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Link
            to="/quiz/create"
            className="group p-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl text-white hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 hover:-translate-y-1"
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

          <Link
            to="/search"
            className="group p-6 bg-gradient-to-r from-orange-400 bg-red-500 to-pink-500 rounded-2xl text-white hover:shadow-xl hover:shadow-orange-200 transition-all duration-300 hover:-translate-y-1"
          >
            <FiTrendingUp className="w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold mb-1">Explore</h3>
            <p className="text-sm opacity-90">Discover quizzes and communities</p>
          </Link>
        </div>

        {/* Recommended Quizzes */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended For You</h2>
            <Link to="/search?type=quizzes" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedQuizzes.slice(0, 6).map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
            {recommendedQuizzes.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-200">
                <p className="text-gray-500">No quizzes available yet. Be the first to create one!</p>
                <Link to="/quiz/create" className="mt-4 inline-block">
                  <Button variant="primary" icon={<FiPlus />}>Create Quiz</Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Trending Quizzes */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              <FiTrendingUp className="inline-block mr-2 text-orange-500" />
              Trending Now
            </h2>
            <Link to="/search?type=quizzes&sort=trending" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingQuizzes.slice(0, 3).map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        </section>

        {/* Communities */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Communities</h2>
            <Link to="/search?type=communities" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <FiArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities.slice(0, 6).map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
            {communities.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-200">
                <p className="text-gray-500">No communities available yet. Start your own!</p>
                <Link to="/community/create" className="mt-4 inline-block">
                  <Button variant="secondary" icon={<FiPlus />}>Create Community</Button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;