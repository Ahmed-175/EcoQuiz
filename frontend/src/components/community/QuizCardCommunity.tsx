import type { Quizzes } from "../../types/community.type";

import { useQuizLike } from "../../hooks/useQuizLike";
import QuizCreatorInfo from "../quiz/QuizCreatorInfo";
import QuizHeader from "../quiz/QuizHeader";
import QuizStats from "../quiz/QuizStats";
import QuizActions from "../quiz/QuizActions";

// Community quiz card component
const QuizCardCommunity = ({ quiz }: { quiz: Quizzes }) => {
  const { likesCount, toggleLike , isLiked } = useQuizLike(quiz.id, quiz.likes_count , quiz.is_like);


  return (
    <div className="w-[80%] mx-auto mt-7 bg-slate-100 rounded-xl p-5">
      <QuizCreatorInfo creator={quiz.creator} />

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

export default QuizCardCommunity;
