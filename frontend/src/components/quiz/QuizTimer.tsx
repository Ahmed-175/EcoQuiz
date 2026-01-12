import React, { useState, useEffect } from 'react';
import { FiClock } from 'react-icons/fi';

interface QuizTimerProps {
    durationMinutes: number;
    onTimeUp: () => void;
    isPaused?: boolean;
}

const QuizTimer: React.FC<QuizTimerProps> = ({
    durationMinutes,
    onTimeUp,
    isPaused = false
}) => {
    const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);

    useEffect(() => {
        if (isPaused || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isPaused, onTimeUp, timeLeft]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const percentage = (timeLeft / (durationMinutes * 60)) * 100;

    const getColor = () => {
        if (percentage > 50) return 'from-green-500 to-emerald-500';
        if (percentage > 25) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-rose-500';
    };

    return (
        <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <FiClock className={`w-5 h-5 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} />
            <div className="flex-1">
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${getColor()} transition-all duration-1000`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
            <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-gray-700'}`}>
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
        </div>
    );
};

export default QuizTimer;
