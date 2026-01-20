import { FaTrash } from "react-icons/fa";
import type { CreateQuestionForm } from "../../../types/types";

interface QuestionCardProps {
    question: CreateQuestionForm;
    qIndex: number;
    totalQuestions: number;
    removeQuestion: (index: number) => void;
    updateQuestion: (index: number, field: keyof CreateQuestionForm, value: string) => void;
    updateOption: (questionIndex: number, optionIndex: number, text: string) => void;
    setCorrectOption: (questionIndex: number, optionIndex: number) => void;
}

const QuestionCard = ({
    question,
    qIndex,
    totalQuestions,
    removeQuestion,
    updateQuestion,
    updateOption,
    setCorrectOption,
}: QuestionCardProps) => {
    return (
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-start justify-between mb-4">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                    {qIndex + 1}
                </span>
                {totalQuestions > 1 && (
                    <button
                        type="button"
                        onClick={() => removeQuestion(qIndex)}
                        className="text-red-400 hover:text-red-600 transition"
                    >
                        <FaTrash />
                    </button>
                )}
            </div>

            {/* Question Text */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question
                </label>
                <input
                    type="text"
                    placeholder="Enter your question..."
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                    value={question.question_text}
                    onChange={(e) => updateQuestion(qIndex, "question_text", e.target.value)}
                />
            </div>

            {/* Options */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Options (select the correct answer)
                    </label>
                </div>
                <div className="space-y-2">
                    {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center gap-3">
                            <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={option.is_correct}
                                onChange={() => setCorrectOption(qIndex, oIndex)}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder={`Option ${oIndex + 1}`}
                                className={`flex-1 p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 bg-white ${option.is_correct
                                        ? "border-green-400 bg-green-50"
                                        : "border-gray-300"
                                    }`}
                                value={option.text}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Explanation */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Explanation (optional)
                </label>
                <textarea
                    placeholder="Explain why the correct answer is right..."
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
                    value={question.explanation || ""}
                    onChange={(e) => updateQuestion(qIndex, "explanation", e.target.value)}
                />
            </div>
        </div>
    );
};

export default QuestionCard;
