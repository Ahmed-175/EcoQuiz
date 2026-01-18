import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCommunity, joinCommunity } from "../../services/communityService";
import type {
  CommunityDetails,
  Member,
  Quizzes,
} from "../../types/community.type";
import { baseUrl } from "../../utils/baseUrl";
import { IoCalendarOutline } from "react-icons/io5";
import IsJoin from "../../components/community/IsJoin";
import StateSection from "./StateSection";
import QuizzesSection from "./QuizzesSection";
import MembersSection from "../../components/community/MembersSection";

const Community = () => {
  const [community, setCommunity] = useState<CommunityDetails>();
  const [stateSection, setStateSection] = useState("Quizzes");
  const [quizzes, setQuizzes] = useState<Quizzes[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [roleMember, setRoleMember] = useState<string>("NON_MEMBER");
  const { id } = useParams();

  console.log(members);
  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const res = await getCommunity(id as any);
        console.log(res);
        setCommunity(res.community);
        !quizzes ? setQuizzes([]) : setQuizzes(res.quizzes);
        setMembers(res.community.members);
        setRoleMember(res.community.member_role);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCommunity();
  }, []);

  const handleJoinAndLeaveCommunity = async () => {
    try {
      const res = await joinCommunity(id as any);
      if (res.status == "joined") return setRoleMember("MEMBER");
      if (res.status == "left") return setRoleMember("NON_MEMBER");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className=" md:w-[80%] w-full  mx-auto min-h-screen pt-20 ">
      <div className=" relative w-full h-75 overflow-hidden">
        <img
          src={`${baseUrl}${community?.banner}`}
          alt=""
          className="w-full h-full 
        object-cover rounded-b-2xl"
        />
        <div
          className=" absolute w-full h-full left-0 bottom-0 bg-linear-to-t 
        from-black to-transparent rounded-b-2xl"
        ></div>
        <div className=" absolute w-full left-0 bottom-3 p-3 px-7 flex justify-between items-center ">
          <div>
            <div className="text-2xl text-white font-bold ">
              {community?.name}
            </div>
            <div className="text-gray-200 flex justify-center items-center gap-3 w-fit">
              {community?.created_at}
              <IoCalendarOutline className="text-2xl" />
            </div>
          </div>

          <div>
            <IsJoin
              roleMember={roleMember || "NON_MEMBER"}
              onJoin={handleJoinAndLeaveCommunity}
            />
          </div>
        </div>
      </div>

      <StateSection
        setStateSection={setStateSection}
        stateSection={stateSection}
      />
      {stateSection == "Quizzes" && <QuizzesSection quizzes={quizzes} />}
      {stateSection == "Members" && <MembersSection members={members} />}
    </div>
  );
};

export default Community;
