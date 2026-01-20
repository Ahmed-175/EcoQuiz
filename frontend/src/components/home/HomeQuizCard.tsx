import type { quizHome } from "../../types/home.type";
import CommunityAndCreatorInfo from "./CommunityAndCreatorInfo";
import QuizHeader from "../quiz/QuizHeader";
import QuizStats from "../quiz/QuizStats";
import QuizActions from "../quiz/QuizActions";
import { useQuizLike } from "../../hooks/useQuizLike";

const HomeQuizCard = ({ quiz }: { quiz: quizHome }) => {
  const { isLiked , likesCount , toggleLike} = useQuizLike(quiz.id , quiz.likes_count , quiz.is_liked)
  return (
    <div className=" w-full bg-slate-100 rounded-2xl p-6 space-y-10 my-4 h-fit">
      <CommunityAndCreatorInfo quiz={quiz} />
      <QuizHeader
        title={quiz.title}
        createdAt={quiz.created_at}
        isNew={quiz.is_new}
      />

      <QuizStats
        questions={quiz.number_of_questions}
        duration={quiz.duration_minutes}
        average={quiz.average_score}
      />

      <p className="mt-5 text-gray-700">{quiz.description}</p>

      <QuizActions
        isLike={isLiked}
        quizId={quiz.id}
        likesCount={likesCount}
        studentsCount={quiz.students_count}
        onLike={toggleLike}
      />
    </div>
  );
};

export default HomeQuizCard;
