import { FaChartBar } from "react-icons/fa";
import { IOptionWithStats } from "../../types/result.types";

interface OptionsStatisticsProps {
  options: IOptionWithStats[];
  userAnswer: string | null;
  title?: string;
}

export const OptionsStatistics = ({
  options,
  userAnswer,
  title = "Answer Statistics",
}: OptionsStatisticsProps) => {
  return (
    <div className="space-y-4 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-4">
        <FaChartBar className="text-blue-500 text-4xl" />
        {title}
      </h3>

      {options.map((opt) => {
        const isUserAnswer = userAnswer === opt.option_id;
        const isCorrectAnswer = opt.is_correct;

        return (
          <OptionItem
            key={opt.option_id}
            option={opt}
            isUserAnswer={isUserAnswer}
            isCorrectAnswer={isCorrectAnswer}
          />
        );
      })}
    </div>
  );
};

interface OptionItemProps {
  option: IOptionWithStats;
  isUserAnswer: boolean;
  isCorrectAnswer: boolean;
}

const OptionItem = ({
  option,
  isUserAnswer,
  isCorrectAnswer,
}: OptionItemProps) => {
  return (
    <div
      className={`p-5 rounded-xl border-2 transition-all duration-300 ${
        isCorrectAnswer
          ? "border-emerald-200 bg-gradient-to-r from-emerald-50/50 to-emerald-50/30"
          : isUserAnswer && !isCorrectAnswer
            ? "border-rose-200 bg-gradient-to-r from-rose-50/50 to-rose-50/30"
            : "border-gray-100 bg-gray-50/50"
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <span
            className={`text-sm font-semibold ${
              isCorrectAnswer ? "text-emerald-700" : "text-gray-700"
            }`}
          >
            {option.text}
          </span>
          {isUserAnswer && (
            <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
              Your Answer
            </span>
          )}
          {isCorrectAnswer && (
            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">
              Correct Answer
            </span>
          )}
        </div>
        <span className="text-sm font-bold text-gray-600">
          {Math.round(option.percentage)}% chose this
        </span>
      </div>

      <ProgressBar
        percentage={option.percentage}
        isCorrect={isCorrectAnswer}
        isUserWrongAnswer={isUserAnswer && !isCorrectAnswer}
      />

      <div className="mt-2 text-xs text-gray-500 flex justify-between">
        <span>{option.selection_count} people</span>
        <span>{option.percentage.toFixed(1)}%</span>
      </div>
    </div>
  );
};

interface ProgressBarProps {
  percentage: number;
  isCorrect: boolean;
  isUserWrongAnswer: boolean;
}

const ProgressBar = ({
  percentage,
  isCorrect,
  isUserWrongAnswer,
}: ProgressBarProps) => (
  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full ${
        isCorrect
          ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
          : isUserWrongAnswer
            ? "bg-gradient-to-r from-rose-400 to-rose-500"
            : "bg-gradient-to-r from-gray-400 to-gray-500"
      }`}
      style={{ width: `${percentage}%` }}
    ></div>
  </div>
);
