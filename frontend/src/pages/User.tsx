import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiBook, FiBarChart2, FiAward, FiUsers } from 'react-icons/fi';
import Loading from '../components/Loading';
import Card from '../components/ui/Card';
import QuizCard from '../components/quiz/QuizCard';
import { getBanner } from '../utils/getBanner';
import type { User, UserQuizStats, Quiz } from '../types/types';
import { getUserById, getUserStats } from '../services/userService';
import { getUserCreatedQuizzes } from '../services/quizService';

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<UserQuizStats | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [userData, statsData, quizzesData] = await Promise.all([
          getUserById(id),
          getUserStats(id),
          getUserCreatedQuizzes(id)
        ]);
        setUser(userData);
        setStats(statsData);
        setQuizzes(quizzesData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) return <Loading />;
  if (!user) return <div className="text-center py-20">User not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Banner */}
      <div className="relative h-48 md:h-64">
        <img
          src={getBanner(user.banner)}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-16 relative z-10 pb-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Avatar */}
            <div className="-mt-20 md:-mt-16">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                {user.username}
              </h1>
              {user.full_name && (
                <p className="text-gray-500">{user.full_name}</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
                <FiBook className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.total_quizzes_taken}</p>
              <p className="text-sm text-gray-500">Quizzes Taken</p>
            </Card>

            <Card className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
                <FiBarChart2 className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.average_score.toFixed(0)}%</p>
              <p className="text-sm text-gray-500">Average Score</p>
            </Card>

            <Card className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-3">
                <FiAward className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.best_score}%</p>
              <p className="text-sm text-gray-500">Best Score</p>
            </Card>

            <Card className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-100 rounded-xl mb-3">
                <FiUsers className="w-6 h-6 text-violet-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{quizzes.length}</p>
              <p className="text-sm text-gray-500">Quizzes Created</p>
            </Card>
          </div>
        )}

        {/* Created Quizzes */}
        {quizzes.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Created Quizzes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} showCreator={false} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;