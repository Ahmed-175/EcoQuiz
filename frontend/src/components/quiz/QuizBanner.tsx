import React from "react";
import { IoCalendarOutline } from "react-icons/io5";
import { baseUrl } from "../../utils/baseUrl";
import type { IQuiz } from "../../types/types";
import IsJoin from "../../components/community/IsJoin";

type QuizBannerProps = {
  quiz: IQuiz;
  roleMember: IQuiz["community"]["is_joined"];
  onJoin: () => void;
};

const QuizBanner = ({ quiz, roleMember, onJoin }: QuizBannerProps) => {
  return (
    <div className="relative h-72 overflow-hidden">
      <img
        src={`${baseUrl}${quiz.community.banner}`}
        alt={quiz.community.name}
        className="w-full h-full object-cover rounded-b-2xl"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black to-transparent" />
      <div className="absolute bottom-3 w-full px-7 flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-white font-bold">{quiz.community.name}</h1>
          <div className="flex items-center gap-2 text-gray-200">
            <IoCalendarOutline /> {quiz.community.created_at}
          </div>
        </div>
        <IsJoin roleMember={roleMember} onJoin={onJoin} />
      </div>
    </div>
  );
};

export default QuizBanner;
