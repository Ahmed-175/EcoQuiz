import { useState } from "react";
import InfoSectionProfile from "../components/profilePage/InfoSectionProfile";
import StateSectionProfile from "../components/profilePage/StateSectionProfile";
import TableQuizzes from "../components/profilePage/TableQuizzes";
import { useAuth } from "../hooks/useAuth";
import TableCommunities from "../components/profilePage/TableCommunities";

const Profile = () => {
  const { user, loading } = useAuth();
  const [state, setState] = useState("quizzes");
  return (
    <div className=" relative  w-full md:w-[80%] mx-auto min-h-screen pt-20 ">
      <InfoSectionProfile />
      <StateSectionProfile stateSection={state} setStateSection={setState} />
      {state == "quizzes" && <TableQuizzes quizzes={user?.attempts as any} />}
      {state == "communities" && (
        <TableCommunities communities={user?.communities as any} />
      )}
    </div>
  );
};

export default Profile;
