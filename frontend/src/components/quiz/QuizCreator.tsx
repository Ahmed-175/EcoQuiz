import React from "react";
import { Link } from "react-router-dom";
import { FaUserGraduate } from "react-icons/fa";
import Avatar from "../../components/Avatar";

type QuizCreatorProps = {
  creator: any;
};

const QuizCreator = ({ creator }: QuizCreatorProps) => (
  <Link to={`/user/${creator.id}`} className="flex items-center gap-3 p-5">
    <Avatar user={creator} size="2xl" />
    <div>
      <div className="font-bold">{creator.username}</div>
      <div className="text-gray-600">{creator.email}</div>
    </div>
    <span className="ml-auto flex items-center gap-2 bg-blue-500 text-white px-4 py-1 rounded-full uppercase">
      <FaUserGraduate />
      {creator.role}
    </span>
  </Link>
);

export default QuizCreator;
