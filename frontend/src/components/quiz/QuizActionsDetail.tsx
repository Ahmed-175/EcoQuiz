import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaRegArrowAltCircleRight } from "react-icons/fa";
import { useQuizLike } from "../../hooks/useQuizLike";
import type { IQuiz } from "../../types/types";

type QuizActionsProps = {
  quiz: IQuiz;
};

const QuizActionsDetail = ({ quiz }: QuizActionsProps) => {
  const { likesCount, toggleLike, isLiked } = useQuizLike(
    quiz.id,
    quiz.likes_count,
    quiz.is_like,
  );

  return (
    <div className="w-full h-auto z-50 flex items-center justify-between p-4 rounded-2xl">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLike}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
            isLiked
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100"
          }`}
        >
          <FaHeart
            className={`text-lg ${
              isLiked ? "text-red-500 " : "text-gray-500"
            }`}
          />
          <span className="font-semibold">{likesCount}</span>
          <span className="hidden sm:inline text-sm ml-1">Likes</span>
        </button>
      </div>

      <Link
        to={`/quiz/${quiz.id}/take`}
        className="group relative bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 md:px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
      >
        <span className="flex items-center gap-2">
          Start Quiz
          <FaRegArrowAltCircleRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </span>
      </Link>
    </div>
  );
};

export default QuizActionsDetail;
