import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const QuizActions = ({
  isLike,
  quizId,
  likesCount,
  studentsCount,
  onLike,
}: any) => {
  return (
    <div className="mt-5 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <button
          onClick={onLike}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
            isLike
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
          }`}
        >
          <FaHeart
            className={`text-lg ${isLike ? "text-red-500 " : "text-gray-500"}`}
          />
          <span className="font-semibold">{likesCount}</span>
          <span className="hidden sm:inline text-sm ml-1">Likes</span>
        </button>
      </div>

      <Link
        to={`/quiz/${quizId}`}
        className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-6 py-2 rounded-full"
      >
        Get Started The Quiz
      </Link>
    </div>
  );
};

export default QuizActions;
