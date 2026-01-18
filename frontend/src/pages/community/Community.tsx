import React, { useEffect, useState, useCallback } from "react";
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
  const { id } = useParams();

  const [community, setCommunity] = useState<CommunityDetails | null>(null);
  const [activeSection, setActiveSection] = useState<"Quizzes" | "Members">(
    "Quizzes",
  );
  const [quizzes, setQuizzes] = useState<Quizzes[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [roleMember, setRoleMember] = useState<string>("NON_MEMBER");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch community data
  const fetchCommunity = useCallback(async () => {
    if (!id) return;

    try {
      setIsLoading(true);
      const res = await getCommunity(id);

      setCommunity(res.community);
      setQuizzes(res.quizzes || []);
      setMembers(res.community.members || []);
      setRoleMember(res.community.member_role);
    } catch (error) {
      console.error("Failed to fetch community:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCommunity();
  }, [fetchCommunity]);

  // Join or leave community
  const handleJoinAndLeaveCommunity = async () => {
    if (!id) return;

    try {
      const res = await joinCommunity(id);

      if (res.status === "joined") {
        setRoleMember("MEMBER");
      }

      if (res.status === "left") {
        setRoleMember("NON_MEMBER");
      }
    } catch (error) {
      console.error("Join/Leave failed:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!community) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        Community not found
      </div>
    );
  }

  return (
    <div className="relative md:w-[80%] w-full mx-auto min-h-screen pt-20">
      {/* Banner */}
      <div className="relative w-full h-75 overflow-hidden">
        <img
          src={`${baseUrl}${community.banner}`}
          alt={community.name}
          className="w-full h-full object-cover rounded-b-2xl"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black to-transparent rounded-b-2xl" />

        <div className="absolute w-full left-0 bottom-3 p-3 px-7 flex justify-between items-center">
          <div>
            <h1 className="text-2xl text-white font-bold">{community.name}</h1>

            <div className="text-gray-200 flex items-center gap-3">
              {community.created_at}
              <IoCalendarOutline className="text-xl" />
            </div>
          </div>

          <IsJoin
            roleMember={roleMember}
            onJoin={handleJoinAndLeaveCommunity}
          />
        </div>
      </div>

      {/* Sections */}
      <StateSection
        setStateSection={setActiveSection}
        stateSection={activeSection}
      />

      {activeSection === "Quizzes" && <QuizzesSection quizzes={quizzes} />}

      {activeSection === "Members" && <MembersSection members={members} />}
    </div>
  );
};

export default Community;
