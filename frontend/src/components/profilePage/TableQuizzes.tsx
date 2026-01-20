import React from "react";
import { LiaNewspaperSolid } from "react-icons/lia";
import {
  MdOutlineTimer,
  MdOutlineScore,
  MdOutlineCalendarToday,
  MdOutlineNumbers,
} from "react-icons/md";
import { PiStudentDuotone } from "react-icons/pi";
import { Link } from "react-router-dom";

interface Quiz {
  quiz: {
    id: string;
    title: string;
    questionsCount: number;
  };
  score: number;
  timeTakenMinutes: number;
  attemptNumber: number;
  percentage: number;
  completedAt: string;
}

const TableQuizzes = ({ quizzes }: { quizzes: Quiz[] }) => {
    console.log(quizzes)
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="p-10 pt-32">
        <div className="flex justify-center items-center gap-2 mb-10 text-3xl font-bold">
          <LiaNewspaperSolid className="text-6xl" />
          Quizzes
        </div>
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
            <LiaNewspaperSolid className="text-3xl text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg">
            No quizzes have been taken yet
          </p>
          <p className="text-gray-500 mt-2">
            Take your first quiz to see results here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 pt-32">
      <div className="flex justify-center items-center gap-2 mb-10 text-3xl font-bold">
        <LiaNewspaperSolid className="text-6xl" />
        Quizzes History
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <LiaNewspaperSolid className="text-xl" />
                  <span>Quiz Title</span>
                </div>
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <MdOutlineScore className="text-xl" />
                  <span>Score</span>
                </div>
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <MdOutlineTimer className="text-xl" />
                  <span>Time Taken</span>
                </div>
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <MdOutlineNumbers className="text-xl" />
                  <span>Attempt</span>
                </div>
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <PiStudentDuotone className="text-xl" />
                  <span>Percentage</span>
                </div>
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <MdOutlineCalendarToday className="text-xl" />
                  <span>Completed At</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((item, index) => (
              <React.Fragment key={item.quiz.id + item.attemptNumber}>
                <tr
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-gray-50/50" : ""
                  }`}
                >
                  {/* Quiz Title */}
                  <td className="py-4 px-6">
                    <div>
                      <Link to={`/quiz/${item.quiz.id}`} className="font-medium text-blue-600 underline">
                        {item.quiz.title}
                      </Link>
                      <div className="text-xs text-gray-500">
                        {item.quiz.questionsCount} questions
                      </div>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold px-3 py-1 rounded-full text-sm
                        ${
                          item.score >= 90
                            ? "bg-green-100 text-green-800"
                            : item.score >= 70
                              ? "bg-blue-100 text-blue-800"
                              : item.score >= 50
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.score}
                      </span>
                    </div>
                  </td>

                  {/* Time Taken */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {item.timeTakenMinutes}
                      </span>
                      <span className="text-gray-500 text-sm">min</span>
                    </div>
                  </td>

                  {/* Attempt Number */}
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold
                        ${
                          item.attemptNumber === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : item.attemptNumber === 2
                              ? "bg-gray-100 text-gray-800"
                              : item.attemptNumber === 3
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-50 text-gray-700"
                        }`}
                      >
                        {item.attemptNumber}
                      </span>
                    </div>
                  </td>

                  {/* Percentage */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{item.percentage}%</span>
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.percentage >= 90
                              ? "bg-green-500"
                              : item.percentage >= 70
                                ? "bg-blue-500"
                                : item.percentage >= 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Completed At */}
                  <td className="py-4 px-6">
                    <div className="text-blue-600 text-sm underline">
                      {item.completedAt}
                    </div>
                  </td>
                </tr>

                {/* Separator line between rows */}
                {index < quizzes.length - 1 && (
                  <tr>
                    <td colSpan={6} className="py-2">
                      <div className="border-t border-gray-100"></div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableQuizzes;
