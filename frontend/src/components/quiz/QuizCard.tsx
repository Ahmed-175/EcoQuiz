import { Link } from 'react-router-dom';
import { FiHeart, FiClock, FiHelpCircle } from 'react-icons/fi';
import type { Quiz } from '../../types/types';
import Avatar from '../Avatar';

interface QuizCardProps {
    quiz: Quiz;
    showCreator?: boolean;
    showCommunity?: boolean;
}

const QuizCard: React.FC<QuizCardProps> = ({
    quiz,
    showCreator = true,
    showCommunity = true
}) => {
    return (
        <Link
            to={`/quiz/${quiz.id}`}
            className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            {/* Header gradient */}
            <div className="h-2 bg-gradient-to-r from-cyan-500 to-blue-500" />

            <div className="p-6">
                {/* Community badge */}
                {showCommunity && quiz.community && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium mb-3">
                        {quiz.community.name}
                    </div>
                )}

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {quiz.title}
                </h3>

                {/* Description */}
                {quiz.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {quiz.description}
                    </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                        <FiHelpCircle className="w-4 h-4" />
                        <span>{quiz.question_count || 0} questions</span>
                    </div>
                    {quiz.duration_minutes && (
                        <div className="flex items-center gap-1">
                            <FiClock className="w-4 h-4" />
                            <span>{quiz.duration_minutes} min</span>
                        </div>
                    )}
                    <div className="flex items-center gap-1">
                        <FiHeart className="w-4 h-4 text-red-400" />
                        <span>{quiz.likes_count}</span>
                    </div>
                </div>

                {/* Creator */}
                {showCreator && quiz.creator && (
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                        <Avatar user={quiz.creator} size="sm" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">
                                {quiz.creator.username}
                            </p>
                            <p className="text-xs text-gray-400">Creator</p>
                        </div>
                    </div>
                )}

                {/* Average score badge */}
                {quiz.avg_score !== undefined && (
                    <div className="absolute top-4 right-4 px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">
                        Avg: {quiz.avg_score.toFixed(0)}%
                    </div>
                )}
            </div>
        </Link>
    );
};

export default QuizCard;
