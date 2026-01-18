import { useState } from "react";
import type { CommunityCard } from "../../types/community.type";
import { baseUrl } from "../../utils/baseUrl";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";
import { CiCalendar } from "react-icons/ci";
import IsJoin from "./IsJoin";
import { joinCommunity } from "../../services/communityService";
import { LuNewspaper } from "react-icons/lu";

type CommunityCardProp = {
  community: CommunityCard;
};

const CommunityCard = ({ community }: CommunityCardProp) => {
  const [roleMember, setRoleMember] = useState(community.member_role);
  const handleJoinAndLeaveCommunity = async () => {
    try {
      const res = await joinCommunity(community.id);
      if (res.status == "joined") return setRoleMember("MEMBER");
      if (res.status == "left") return setRoleMember("NON_MEMBER");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="w-full bg-slate-200 h-fit rounded-2xl overflow-hidden">
      <div className=" relative w-full h-60 ">
        <div className=" absolute top-6 right-6 z-10"></div>
        <img
          src={`${baseUrl}${community.banner}`}
          alt="banner_community"
          className=" object-cover w-full h-full"
        />
        <div
          className=" absolute w-full h-full left-0 bottom-0 bg-linear-to-t
         from-black to-transparent"
        ></div>

        <Link
          to={`/user/${community.creator?.id}`}
          className=" absolute bottom-3 left-3  w-full flex justify-between pr-8 items-center"
        >
          <div className="flex justify-center items-center gap-2.5">
            <Avatar user={community.creator as any} size="xl" />
            <div>
              <div className="text-white font-bold">
                {" "}
                {community.creator?.username}
              </div>
              <div className="text-xs text-gray-300">
                {community.creator?.email}
              </div>
            </div>
          </div>
          <div className=" bg-blue-100 px-3.5 py-0.5 rounded-full flex justify-center items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-800 "></span>
            <div className="text-blue-600">Creator</div>
          </div>
        </Link>
      </div>
      <div className="flex justify-between items-center px-7 py-3 ">
        <div className="">
          <div className="text-2xl font-bold">{community.name}</div>
          <div className="text-gray-700 flex justify-center items-center gap-1.5 w-fit">
            {community.created_at}
            <CiCalendar className="text-2xl" />
          </div>
        </div>
        <IsJoin roleMember={roleMember} onJoin={handleJoinAndLeaveCommunity} />
      </div>

      <div className=" flex justify-between items-center  px-7 py-3 ">
        <div className="flex justify-between items-center gap-2 text-xl">
          <LuNewspaper />
          {community.number_of_quizzes} Quizzes
        </div>
        <div className="flex justify-center items-center -space-x-3">
          {community.members.slice(0, 3).map((m, i) => (
            <Avatar
              user={m as any}
              key={i}
              className={`relative z-${(3 - i) * 10} border border-white`}
            />
          ))}
          {community.members.length > 3 && (
            <div className="relative z-0 flex items-center justify-center w-10 h-10 text-xs font-medium text-gray-700 bg-white border-2 border-white rounded-full">
              +{community.members.length - 3}
            </div>
          )}
        </div>
      </div>
      <div className=" m-4 ">
        <Link
          to={`/community/${community.id}`}
          className="flex items-center justify-center gap-2 w-full
         px-6 py-3 text-sm font-medium rounded-lg
         text-white bg-linear-to-r from-blue-500 to-purple-600 
          hover:from-blue-600 hover:to-purple-700 active:scale-[0.98] transition-all 
          duration-200 shadow hover:shadow-lg hover:shadow-purple-500/20"
        >
          <span>Visit Community</span>
        </Link>
      </div>
    </div>
  );
};

export default CommunityCard;
