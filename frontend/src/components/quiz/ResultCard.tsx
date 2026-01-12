
import { Link } from 'react-router-dom';
import { FiAward, FiClock, FiCheckCircle, FiXCircle, FiArrowRight, FiRefreshCw } from 'react-icons/fi';
import type { QuizAttempt, Quiz } from '../../types/types';
import Button from '../ui/Button';

interface ResultCardProps {
    attempt: QuizAttempt;
    quiz: Quiz;
    showDetails?: boolean;
}

const ResultCard: React.FC<ResultCardProps> = ({ attempt, quiz }) => {
    const getGrade = (percentage: number) => {
        if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', bg: 'bg-green-100' };
        if (percentage >= 80) return { grade: 'A', color: 'text-green-500', bg: 'bg-green-50' };
        if (percentage >= 70) return { grade: 'B', color: 'text-blue-500', bg: 'bg-blue-50' };
        if (percentage >= 60) return { grade: 'C', color: 'text-yellow-500', bg: 'bg-yellow-50' };
        if (percentage >= 50) return { grade: 'D', color: 'text-orange-500', bg: 'bg-orange-50' };
        return { grade: 'F', color: 'text-red-500', bg: 'bg-red-50' };
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const gradeInfo = getGrade(attempt.percentage);
    const correctAnswers = attempt.score;
    const incorrectAnswers = attempt.total_questions - attempt.score;

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header with gradient */}
            <div className={`p-8 bg-gradient-to-r ${attempt.percentage >= 70
                ? 'from-green-400 to-emerald-500'
                : attempt.percentage >= 50
                    ? 'from-yellow-400 to-orange-500'
                    : 'from-red-400 to-rose-500'
                } text-white text-center`}>
                <div className="flex justify-center mb-4">
                    <div className={`w-24 h-24 rounded-full ${gradeInfo.bg} flex items-center justify-center`}>
                        <span className={`text-4xl font-bold ${gradeInfo.color}`}>
                            {gradeInfo.grade}
                        </span>
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                    {attempt.percentage >= 70 ? 'Great Job!' : attempt.percentage >= 50 ? 'Good Effort!' : 'Keep Practicing!'}
                </h2>
                <p className="opacity-90">You completed {quiz.title}</p>
            </div>

            {/* Stats */}
            <div className="p-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <FiAward className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                        <p className="text-2xl font-bold text-gray-900">{attempt.percentage.toFixed(0)}%</p>
                        <p className="text-sm text-gray-500">Score</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <FiCheckCircle className="w-6 h-6 mx-auto mb-2 text-green-500" />
                        <p className="text-2xl font-bold text-gray-900">{correctAnswers}</p>
                        <p className="text-sm text-gray-500">Correct</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <FiXCircle className="w-6 h-6 mx-auto mb-2 text-red-500" />
                        <p className="text-2xl font-bold text-gray-900">{incorrectAnswers}</p>
                        <p className="text-sm text-gray-500">Incorrect</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-xl">
                        <FiClock className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                        <p className="text-2xl font-bold text-gray-900">{formatTime(attempt.time_taken_seconds)}</p>
                        <p className="text-sm text-gray-500">Time</p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-gray-700">
                            {attempt.score} / {attempt.total_questions} correct
                        </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                            style={{ width: `${attempt.percentage}%` }}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to={`/quiz/${quiz.id}/take`} className="flex-1">
                        <Button variant="outline" fullWidth icon={<FiRefreshCw />}>
                            Try Again
                        </Button>
                    </Link>
                    <Link to={`/quiz/${quiz.id}/leaderboard`} className="flex-1">
                        <Button variant="primary" fullWidth icon={<FiArrowRight />}>
                            View Leaderboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ResultCard;
