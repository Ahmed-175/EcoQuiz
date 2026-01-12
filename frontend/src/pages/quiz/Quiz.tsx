import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiClock, FiHelpCircle, FiPlay, FiEdit, FiTrash2, FiShare2 } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/Loading';
import Button from '../../components/ui/Button';
import Avatar from '../../components/Avatar';
import type { Quiz, LeaderboardEntry } from '../../types/types';
import { getQuiz, likeQuiz, unlikeQuiz, checkQuizLike, getQuizLeaderboard, deleteQuiz } from '../../services/quizService';

const QuizPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [quizData, likeData, leaders] = await Promise.all([
          getQuiz(id),
          checkQuizLike(id),
          getQuizLeaderboard(id, 5)
        ]);
        setQuiz(quizData);
        setIsLiked(likeData.liked);
        setLeaderboard(leaders);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleLike = async () => {
    if (!id || liking) return;
    try {
      setLiking(true);
      if (isLiked) {
        const result = await unlikeQuiz(id);
        setQuiz(prev => prev ? { ...prev, likes_count: result.data?.likes_count || prev.likes_count - 1 } : prev);
        setIsLiked(false);
      } else {
        const result = await likeQuiz(id);
        setQuiz(prev => prev ? { ...prev, likes_count: result.data?.likes_count || prev.likes_count + 1 } : prev);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await deleteQuiz(id);
      navigate('/home');
    } catch (error) {
      console.error('Failed to delete quiz:', error);
    }
  };

  if (loading) return <Loading />;
  if (!quiz) return <div className="text-center py-20">Quiz not found</div>;

  const isCreator = user?.id === quiz.creator_id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">
          <div className="h-3 bg-gradient-to-r from-cyan-500 to-blue-500" />
          <div className="p-8">
            {/* Community badge */}
            {quiz.community && (
              <Link
                to={`/community/${quiz.community.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4 hover:bg-blue-100 transition-colors"
              >
                {quiz.community.name}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {quiz.title}
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-lg mb-6">
              {quiz.description}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <FiHelpCircle className="w-5 h-5" />
                <span>{quiz.question_count || 0} Questions</span>
              </div>
              {quiz.duration_minutes && (
                <div className="flex items-center gap-2">
                  <FiClock className="w-5 h-5" />
                  <span>{quiz.duration_minutes} Minutes</span>
                </div>
              )}
              <button
                onClick={handleLike}
                disabled={liking}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isLiked
                  ? 'bg-red-100 text-red-500'
                  : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-400'
                  }`}
              >
                <FiHeart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{quiz.likes_count}</span>
              </button>
            </div>

            {/* Creator */}
            {quiz.creator && (
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-8">
                <Avatar user={quiz.creator} size="lg" />
                <div>
                  <p className="font-medium text-gray-900">{quiz.creator.username}</p>
                  <p className="text-sm text-gray-500">Quiz Creator</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Link to={`/quiz/${id}/take`}>
                <Button variant="primary" size="lg" icon={<FiPlay />}>
                  Start Quiz
                </Button>
              </Link>
              <Button variant="outline" icon={<FiShare2 />} onClick={() => navigator.clipboard.writeText(window.location.href)}>
                Share
              </Button>
              {isCreator && (
                <>
                  <Link to={`/quiz/${id}/edit`}>
                    <Button variant="outline" icon={<FiEdit />}>Edit</Button>
                  </Link>
                  <Button variant="danger" icon={<FiTrash2 />} onClick={handleDelete}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Top Performers</h2>
            <div className="space-y-4">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.user.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-400' :
                    index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                    }`}>
                    {index + 1}
                  </div>
                  <Avatar user={entry.user} size="md" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{entry.user.username}</p>
                    <p className="text-sm text-gray-500">
                      {entry.score}/{quiz.question_count} correct
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">{entry.percentage.toFixed(0)}%</p>
                    <p className="text-xs text-gray-500">
                      {Math.floor(entry.time_taken_seconds / 60)}m {entry.time_taken_seconds % 60}s
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link to={`/quiz/${id}/leaderboard`} className="block mt-4">
              <Button variant="ghost" fullWidth>View Full Leaderboard</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;