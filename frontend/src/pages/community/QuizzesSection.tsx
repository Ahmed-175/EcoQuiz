import QuizCardCommunity from "../../components/community/QuizCardCommunity";
import type { Quizzes } from "../../types/community.type";
import { LuNewspaper } from "react-icons/lu";

const QuizzesSection = ({ quizzes }: { quizzes: Quizzes[] }) => {

  if (quizzes.length == 0)
    return (
      <div className="w-full h-70   flex justify-center items-center">
        <div>
          <LuNewspaper className="text-5xl mx-auto" />
          <div className=" mt-3">this community has no quizzes yet</div>
        </div>
      </div>
    );

  return (
    <div className="w-full my-10">
      {quizzes.map((q, i) => (
        <QuizCardCommunity quiz={q} key={i}/>
      ))}
    </div>
  );
};

export default QuizzesSection;
