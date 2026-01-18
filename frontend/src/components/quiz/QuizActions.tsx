import { FaHeart } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { Link } from "react-router-dom";

// Displays quiz action buttons
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
          className="flex items-center gap-2 bg-gray-400 text-white px-4 py-1 rounded-full"
        >
          <FaHeart className={`${isLike ? "text-blue-500" : ""}`} />
          {likesCount} Likes
        </button>

        <div className="flex items-center gap-2 bg-blue-500 text-white px-4 py-1 rounded-full">
          <LuUsers />
          {studentsCount} Students
        </div>
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
