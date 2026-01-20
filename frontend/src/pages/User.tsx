import React, { useEffect, useState } from "react";
import { getUserById } from "../services/userService";
import { useParams } from "react-router-dom";
import type { User } from "../types/types";
import { getBanner } from "../utils/getBanner";
import { getAvatar } from "../utils/getAvatar";
import StateSectionProfile from "../components/profilePage/StateSectionProfile";
import TableQuizzes from "../components/profilePage/TableQuizzes";
import TableCommunities from "../components/profilePage/TableCommunities";

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [state, setState] = useState("quizzes");
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      const res = await getUserById(id);
      setUser(res.res);
    };

    fetchUser();
  }, [id]);

  return (
    <div className="relative w-full md:w-[80%] mx-auto min-h-screen pt-20">
      <div className="relative w-full mx-auto h-75 rounded-b-lg">
        <img
          src={getBanner(user?.banner)}
          alt="banner"
          className="w-full h-full object-cover rounded-b-lg"
        />

        <div className="absolute left-24 -bottom-24 flex items-center gap-3">
          <img
            src={getAvatar(user?.avatar)}
            alt="avatar"
            className="w-35 h-35 object-cover rounded-full border-4 bg-white border-white"
          />

          <div className="mt-4">
            <h1 className="font-bold text-xl">{user?.username}</h1>
            <h1 className="text-sm text-gray-800">{user?.email}</h1>
          </div>
        </div>
      </div>

      <StateSectionProfile stateSection={state} setStateSection={setState} />
      {state == "quizzes" && <TableQuizzes quizzes={user?.attempts as any} />}
      {state == "communities" && (
        <TableCommunities communities={user?.communities as any} />
      )}
    </div>
  );
};

export default UserProfile;
