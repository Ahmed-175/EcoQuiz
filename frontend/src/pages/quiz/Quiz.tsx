// Quiz.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuiz } from "../../services/quizService";
import { joinCommunity } from "../../services/communityService";
import type { IQuiz } from "../../types/types";
import QuizBanner from "../../components/quiz/QuizBanner";
import QuizHeaderDetails from "../../components/quiz/QuizHeaderDetails";
import QuizCreator from "../../components/quiz/QuizCreator";
import QuizStatsDetail from "../../components/quiz/QuizStatsDetail";
import QuizActionsDetail from "../../components/quiz/QuizActionsDetail";
import QuizLeaderBoard from "../../components/quiz/QuizLeaderBoard";

const Quiz = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [roleMember, setRoleMember] =
    useState<IQuiz["community"]["is_joined"]>("NON_MEMBER");

  /* Fetch quiz */
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await getQuiz(id as string);
        setQuiz(res);
        setRoleMember(res.community.is_joined);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuiz();
  }, [id]);

  /* Join / Leave community */
  const handleJoinCommunity = async () => {
    if (!quiz) return;
    try {
      const res = await joinCommunity(quiz.community.id);
      setRoleMember(res.status === "joined" ? "MEMBER" : "NON_MEMBER");
    } catch (err) {
      console.error("Join community failed", err);
    }
  };

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="mx-auto pt-20 w-full md:w-[80%]">
      <QuizBanner
        quiz={quiz}
        roleMember={roleMember}
        onJoin={handleJoinCommunity}
      />
      <QuizHeaderDetails quiz={quiz} />
      <QuizCreator creator={quiz.creator} />
      <p className="p-5">{quiz.description}</p>
      <QuizStatsDetail quiz={quiz} />
      <QuizActionsDetail quiz={quiz} />
      {quiz.leaderboard && quiz.leaderboard.length !== 0 && (
        <QuizLeaderBoard quiz={quiz} />
      )}
    </div>
  );
};

export default Quiz;
