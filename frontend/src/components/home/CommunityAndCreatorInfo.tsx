import React, { useState } from "react";
import type { quizHome } from "../../types/home.type";
import { baseUrl } from "../../utils/baseUrl";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";
import { FaUserGraduate } from "react-icons/fa";
import { joinCommunity } from "../../services/communityService";
import IsJoin from "../community/IsJoin";

const CommunityAndCreatorInfo = ({ quiz }: { quiz: quizHome }) => {
  const [roleMember, setRoleMember] = useState(quiz.community.is_joined);
  const handleJoinAndLeaveCommunity = async () => {
    try {
      const res = await joinCommunity(quiz.community.id);
      console.log(res)
      if (res.status == "joined") return setRoleMember("MEMBER");
      if (res.status == "left") return setRoleMember("NON_MEMBER");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="flex justify-between items-center ">
      <div className="flex justify-center items-center gap-2.5">
        <div className=" relative w-18 h-18 rounded-2xl">
          <img
            src={`${baseUrl}${quiz.community.banner}`}
            alt="img "
            className="object-cover w-full h-full rounded-2xl "
          />
          <Link
            to={`/user/${quiz.creator.id}`}
            className=" absolute  left-10 top-10 flex justify-center
             items-center gap-2 w-fit"
          >
            <Avatar user={quiz.creator as any} size="lg" />
            <div>
              <div className=" text-base w-fit">{quiz.creator.username}</div>
              <div className="text-xs text-gray-600">{quiz.creator.email}</div>
            </div>
            <div className="uppercase flex items-center bg-blue-500 px-3 py-1 gap-2 rounded-full text-white">
              <FaUserGraduate />
              {quiz.creator.role}
            </div>
          </Link>
        </div>
        <Link
          to={`/community/${quiz.community.id}`}
          className=" relative font-bold text-lg -top-3 underline"
        >
          {quiz.community.name}
        </Link>
      </div>

      <div>
        <IsJoin roleMember={roleMember} onJoin={handleJoinAndLeaveCommunity} />
      </div>
    </div>
  );
};

export default CommunityAndCreatorInfo;
