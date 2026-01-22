import { FaTrophy } from "react-icons/fa";

interface CompletionMessageProps {
  percentage: number;
  onReturn: () => void;
}

export const CompletionMessage = ({ percentage, onReturn }: CompletionMessageProps) => {
  return (
    <div className="mt-10 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
        <FaTrophy className="text-3xl text-emerald-600" />
      </div>
      <h3 className="text-2xl font-bold text-emerald-800 mb-3">
        Quiz Completed!
      </h3>
      <p className="text-emerald-700 mb-6 max-w-md mx-auto">
        You've reviewed all questions. Your final score is{" "}
        {Math.round(percentage)}%.
      </p>
      <button
        onClick={onReturn}
        className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md"
      >
        Return to Quiz Overview
      </button>
    </div>
  );
};