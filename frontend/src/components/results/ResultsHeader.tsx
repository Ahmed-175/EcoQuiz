import { IoMdArrowRoundBack } from "react-icons/io";
import { FaClock, FaTrophy } from "react-icons/fa";

interface ResultsHeaderProps {
  quizTitle: string;
  completedAt: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTakenMinutes: number;
  quizId: string;
  onBack: () => void;
}

export const ResultsHeader = ({
  quizTitle,
  completedAt,
  score,
  totalQuestions,
  percentage,
  timeTakenMinutes,
  quizId,
  onBack,
}: ResultsHeaderProps) => {
  return (
    <div
      className=" w-full  p-6 mb-8 relative 
    overflow-hidden "
    >
      <div className="absolute top-0 right-0 p-6 opacity-5">
        <FaTrophy className="text-9xl text-yellow-500" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-4">
        <div className="">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500
             hover:text-blue-600 transition-colors p-2 rounded-lg
              hover:bg-blue-50 mb-5"
          >
            <IoMdArrowRoundBack className="text-lg" />
            <span className="hidden sm:inline">Back to Quiz</span>
          </button>


          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 line-clamp-1">
              {quizTitle}
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <FaClock className="text-gray-400" />
              Completed on{" "}
                {completedAt}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <ScoreCard
            label="Score"
            value={`${Math.round(percentage)}%`}
            subValue={`${score}/${totalQuestions} Correct`}
            gradient="from-blue-500 to-blue-600"
          />
          <ScoreCard
            label="Time Taken"
            value={timeTakenMinutes.toString()}
            subValue="Minutes"
            gradient="from-emerald-500 to-emerald-600"
          />
        </div>
      </div>
    </div>
  );
};

interface ScoreCardProps {
  label: string;
  value: string;
  subValue: string;
  gradient: string;
}

const ScoreCard = ({ label, value, subValue, gradient }: ScoreCardProps) => (
  <div
    className={`bg-gradient-to-r ${gradient} text-white p-5 rounded-xl text-center min-w-[140px] shadow-sm`}
  >
    <div className="text-xs font-semibold uppercase tracking-wider opacity-90 mb-1">
      {label}
    </div>
    <div className="text-3xl font-black">{value}</div>
    <div className="text-xs mt-1 opacity-90">{subValue}</div>
  </div>
);
