import { useLocation, useParams, Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import type { QuizAttempt, Quiz } from '../../types/types';
import ResultCard from '../../components/quiz/ResultCard';
import Button from '../../components/ui/Button';
import { useState, useEffect } from 'react';
import { getQuiz, getUserQuizAttempts } from '../../services/quizService';
import Loading from '../../components/Loading';

const Results = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const passedAttempt = location.state?.attempt as QuizAttempt | undefined;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(passedAttempt || null);
  const [loading, setLoading] = useState(!passedAttempt);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const quizData = await getQuiz(id);
        setQuiz(quizData);

        if (!passedAttempt) {
          const attempts = await getUserQuizAttempts(id);
          if (attempts.length > 0) {
            setAttempt(attempts[0]); // Get the most recent attempt
          }
        }
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, passedAttempt]);

  if (loading) return <Loading />;
  if (!quiz || !attempt) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Results Found</h2>
          <p className="text-gray-600 mb-6">You haven't taken this quiz yet.</p>
          <Link to={`/quiz/${id}`}>
            <Button variant="primary">View Quiz</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8 max-w-2xl">
        {/* Confetti effect for high scores */}
        {attempt.percentage >= 80 && (
          <div className="fixed inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)],
                  width: '10px',
                  height: '10px',
                  borderRadius: Math.random() > 0.5 ? '50%' : '0'
                }}
              />
            ))}
          </div>
        )}

        <ResultCard attempt={attempt} quiz={quiz} />

        <div className="mt-8 text-center">
          <Link to="/home">
            <Button variant="ghost" icon={<FiHome />}>
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Results;