import React from "react";
import { MdOutlineLibraryBooks } from "react-icons/md";
import type { IQuiz } from "../../types/types";

type QuizHeaderProps = {
  quiz: IQuiz;
};

const QuizHeaderDetails = ({ quiz }: QuizHeaderProps) => (
  <div className="p-5 flex items-center gap-3">
    <MdOutlineLibraryBooks className="text-5xl" />
    <h2 className="text-2xl font-bold">{quiz.title}</h2>
    {quiz.is_new && (
      <span className="bg-red-500 text-white px-4 py-0.5 rounded-full">New</span>
    )}
  </div>
);

export default QuizHeaderDetails;
