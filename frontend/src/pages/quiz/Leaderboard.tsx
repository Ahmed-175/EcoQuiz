import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiAward, FiClock } from 'react-icons/fi';
import Loading from '../../components/Loading';
import Avatar from '../../components/Avatar';
import Button from '../../components/ui/Button';
import type { Quiz, LeaderboardEntry } from '../../types/types';
import { getQuiz, getQuizLeaderboard } from '../../services/quizService';

const Leaderboard = () => {
    const { id } = useParams<{ id: string }>();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const [quizData, leaderboardData] = await Promise.all([
                    getQuiz(id),
                    getQuizLeaderboard(id, 50)
                ]);
                setQuiz(quizData);
                setLeaderboard(leaderboardData);
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const getRankStyles = (rank: number) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-lg shadow-yellow-200';
            case 2:
                return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white shadow-lg shadow-gray-200';
            case 3:
                return 'bg-gradient-to-r from-orange-400 to-amber-600 text-white shadow-lg shadow-orange-200';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) return <Loading />;
    if (!quiz) return <div className="text-center py-20">Quiz not found</div>;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
            <div className="container mx-auto px-4 md:px-8 max-w-3xl">
                <Link
                    to={`/quiz/${id}`}
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <FiArrowLeft /> Back to Quiz
                </Link>

                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl">
                            <FiAward className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{quiz.title}</h1>
                            <p className="text-gray-500">Leaderboard</p>
                        </div>
                    </div>
                </div>

                {/* Top 3 Podium */}
                {leaderboard.length >= 3 && (
                    <div className="flex items-end justify-center gap-4 mb-8">
                        {/* 2nd Place */}
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-2">
                                <Avatar user={leaderboard[1].user} size="2xl" />
                            </div>
                            <p className="font-medium text-gray-900 truncate max-w-20">
                                {leaderboard[1].user.username}
                            </p>
                            <div className="mt-2 px-4 py-8 bg-gray-300 rounded-t-xl">
                                <span className="text-2xl font-bold text-white">2</span>
                            </div>
                            <p className="mt-2 text-lg font-bold text-gray-700">{leaderboard[1].percentage.toFixed(0)}%</p>
                        </div>

                        {/* 1st Place */}
                        <div className="text-center -mb-4">
                            <div className="relative">
                                <FiAward className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-6 h-6 text-yellow-500" />
                                <div className="w-24 h-24 mx-auto mb-2">
                                    <Avatar user={leaderboard[0].user} size="2xl" />
                                </div>
                            </div>
                            <p className="font-medium text-gray-900 truncate max-w-24">
                                {leaderboard[0].user.username}
                            </p>
                            <div className="mt-2 px-4 py-12 bg-gradient-to-t from-yellow-400 to-amber-500 rounded-t-xl">
                                <span className="text-3xl font-bold text-white">1</span>
                            </div>
                            <p className="mt-2 text-xl font-bold text-yellow-600">{leaderboard[0].percentage.toFixed(0)}%</p>
                        </div>

                        {/* 3rd Place */}
                        <div className="text-center">
                            <div className="w-20 h-20 mx-auto mb-2">
                                <Avatar user={leaderboard[2].user} size="2xl" />
                            </div>
                            <p className="font-medium text-gray-900 truncate max-w-20">
                                {leaderboard[2].user.username}
                            </p>
                            <div className="mt-2 px-4 py-6 bg-orange-400 rounded-t-xl">
                                <span className="text-2xl font-bold text-white">3</span>
                            </div>
                            <p className="mt-2 text-lg font-bold text-orange-600">{leaderboard[2].percentage.toFixed(0)}%</p>
                        </div>
                    </div>
                )}

                {/* Full Leaderboard */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                            <div className="col-span-1">Rank</div>
                            <div className="col-span-5">Player</div>
                            <div className="col-span-2 text-center">Score</div>
                            <div className="col-span-2 text-center">Percentage</div>
                            <div className="col-span-2 text-right">Time</div>
                        </div>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {leaderboard.map((entry, index) => (
                            <div
                                key={entry.user.id}
                                className="p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    <div className="col-span-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${getRankStyles(index + 1)}`}>
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className="col-span-5 flex items-center gap-3">
                                        <Avatar user={entry.user} size="sm" />
                                        <Link
                                            to={`/profile/${entry.user.id}`}
                                            className="font-medium text-gray-900 hover:text-blue-600 truncate"
                                        >
                                            {entry.user.username}
                                        </Link>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className="font-medium text-gray-900">
                                            {entry.score}/{quiz.question_count}
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-center">
                                        <span className={`font-bold ${entry.percentage >= 80 ? 'text-green-600' :
                                            entry.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {entry.percentage.toFixed(0)}%
                                        </span>
                                    </div>
                                    <div className="col-span-2 text-right">
                                        <span className="flex items-center justify-end gap-1 text-gray-500">
                                            <FiClock className="w-4 h-4" />
                                            {formatTime(entry.time_taken_seconds)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {leaderboard.length === 0 && (
                            <div className="p-12 text-center text-gray-500">
                                <FiAward className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                <p>No attempts yet. Be the first to take this quiz!</p>
                                <Link to={`/quiz/${id}/take`} className="mt-4 inline-block">
                                    <Button variant="primary">Take Quiz</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
