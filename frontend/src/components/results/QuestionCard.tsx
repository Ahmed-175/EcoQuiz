import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { OptionsStatistics } from "./OptionsStatistics";
import { CommentsSection } from "./CommentsSection";
import { IQuestionResult } from "../../types/result.types";
import { LuNotebookPen } from "react-icons/lu";

interface QuestionCardProps {
  question: IQuestionResult;
  questionNumber: number;
  onAddComment: (questionId: string, text: string) => Promise<void>;
}

export const QuestionCard = ({
  question,
  questionNumber,
  onAddComment,
}: QuestionCardProps) => {
  return (
    <div className="bg-white   overflow-hidden mb-8">
      <div className="p-6 md:p-8">
        <QuestionHeader
          questionNumber={questionNumber}
          isCorrect={question.is_correct}
          questionText={question.question_text}
        />

        <OptionsStatistics
          options={question.options}
          userAnswer={question.user_answer}
        />

        {question.explanation && (
          <ExplanationSection explanation={question.explanation} />
        )}

        <CommentsSection
          comments={question.comments}
          questionId={question.question_id}
          onAddComment={onAddComment}
        />
      </div>
    </div>
  );
};

interface QuestionHeaderProps {
  questionNumber: number;
  isCorrect: boolean;
  questionText: string;
}

const QuestionHeader = ({
  questionNumber,
  isCorrect,
  questionText,
}: QuestionHeaderProps) => (
  <div className="flex justify-between items-start gap-4 mb-6">
    <div className="flex-1">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1.5 rounded-full">
          Question {questionNumber}
        </span>
        <span
          className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${
            isCorrect
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {isCorrect ? "Correct" : "Incorrect"}
        </span>
      </div>

      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 leading-relaxed">
        {questionText}
      </h2>
    </div>

    <div className="flex-shrink-0">
      {isCorrect ? (
        <div className="bg-emerald-50 p-3 rounded-full">
          <FaCheckCircle className="text-emerald-500 text-2xl" />
        </div>
      ) : (
        <div className="bg-rose-50 p-3 rounded-full">
          <FaTimesCircle className="text-rose-500 text-2xl" />
        </div>
      )}
    </div>
  </div>
);

interface ExplanationSectionProps {
  explanation: string;
}

const ExplanationSection = ({ explanation }: ExplanationSectionProps) => (
  <div className="bg-slate-100  rounded-xl p-5 mb-8  ">
    <div className="flex items-center gap-2 mb-2">
    <LuNotebookPen className="text-2xl" />
      <h4 className="text-lg font-bold">Explanation</h4>
    </div>
    <p className="text-gray-700 ">{explanation}</p>
  </div>
);
