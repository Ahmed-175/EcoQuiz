import React from 'react';
import type { Question } from '../../types/types';

interface QuestionCardProps {
    question: Question;
    questionNumber: number;
    totalQuestions: number;
    selectedAnswer?: 'a' | 'b' | 'c' | 'd';
    onSelectAnswer: (option: 'a' | 'b' | 'c' | 'd') => void;
    showResult?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    questionNumber,
    totalQuestions,
    selectedAnswer,
    onSelectAnswer,
    showResult = false
}) => {
    const options = [
        { key: 'a' as const, text: question.option_a },
        { key: 'b' as const, text: question.option_b },
        { key: 'c' as const, text: question.option_c },
        { key: 'd' as const, text: question.option_d }
    ];

    const getOptionStyles = (optionKey: 'a' | 'b' | 'c' | 'd') => {
        const baseStyles = 'w-full p-4 rounded-xl border-2 text-left transition-all duration-200';

        if (showResult) {
            if (optionKey === question.correct_answer) {
                return `${baseStyles} border-green-500 bg-green-50 text-green-700`;
            }
            if (optionKey === selectedAnswer && optionKey !== question.correct_answer) {
                return `${baseStyles} border-red-500 bg-red-50 text-red-700`;
            }
            return `${baseStyles} border-gray-200 bg-gray-50 text-gray-500`;
        }

        if (selectedAnswer === optionKey) {
            return `${baseStyles} border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200`;
        }

        return `${baseStyles} border-gray-200 hover:border-blue-300 hover:bg-blue-50/50`;
    };

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg">
            {/* Question header */}
            <div className="flex items-center justify-between mb-6">
                <span className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full text-sm font-medium">
                    Question {questionNumber} of {totalQuestions}
                </span>
            </div>

            {/* Question text */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">
                {question.question_text}
            </h2>

            {/* Options */}
            <div className="space-y-4">
                {options.map((option) => (
                    <button
                        key={option.key}
                        onClick={() => !showResult && onSelectAnswer(option.key)}
                        disabled={showResult}
                        className={getOptionStyles(option.key)}
                    >
                        <div className="flex items-center gap-4">
                            <span className={`
                w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                ${selectedAnswer === option.key
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }
                ${showResult && option.key === question.correct_answer ? 'bg-green-500 text-white' : ''}
                ${showResult && option.key === selectedAnswer && option.key !== question.correct_answer ? 'bg-red-500 text-white' : ''}
              `}>
                                {option.key.toUpperCase()}
                            </span>
                            <span className="flex-1 text-base md:text-lg">
                                {option.text}
                            </span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Explanation (shown after result) */}
            {showResult && question.explanation && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-sm font-medium text-blue-700 mb-1">Explanation</p>
                    <p className="text-blue-600">{question.explanation}</p>
                </div>
            )}
        </div>
    );
};

export default QuestionCard;
