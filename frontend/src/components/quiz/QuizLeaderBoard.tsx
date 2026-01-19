import React from "react";
import type { IQuiz } from "../../types/types";
import { FaChartSimple } from "react-icons/fa6";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";
import { MdOutlineTimer } from "react-icons/md";
import { PiStudentDuotone } from "react-icons/pi";
import { GrScorecard } from "react-icons/gr";

type QuizActionsProps = {
  quiz: IQuiz;
};

const QuizLeaderBoard = ({ quiz }: QuizActionsProps) => {
  return (
    <div className="w-full p-6 md:p-8 bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="flex justify-center items-center gap-3 mb-8">
        <FaChartSimple className="text-3xl text-blue-600" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Leaderboard
        </h1>
      </div>

      {quiz.leaderboard.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
            <FaChartSimple className="text-3xl text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg">
            No one has taken this quiz yet
          </p>
          <p className="text-gray-500 mt-2">Be the first to appear here!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-4 text-left text-gray-600 font-semibold text-sm">
                  #
                </th>
                <th className="py-4 px-4 text-left text-gray-600 font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <PiStudentDuotone className="text-xl" />
                    <span>User</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-gray-600 font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <MdOutlineTimer className="text-xl" />
                    <span>Time taken</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-gray-600 font-semibold text-sm">
                  <div className="flex items-center gap-2">
                    <GrScorecard className="text-xl" />
                    <span>Score</span>
                  </div>
                </th>
                <th className="py-4 px-4 text-left text-gray-600 font-semibold text-sm">
                  Finished at
                </th>
              </tr>
            </thead>
            <tbody>
              {quiz.leaderboard.map((l, i) => (
                <React.Fragment key={i}>
                  <tr
                    className={`hover:bg-gray-50 transition-colors ${i % 2 === 0 ? "bg-gray-50/50" : ""}`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold
                          ${
                            i === 0
                              ? "bg-yellow-100 text-yellow-800"
                              : i === 1
                                ? "bg-gray-100 text-gray-800"
                                : i === 2
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-blue-50 text-gray-700"
                          }`}
                        >
                          {i + 1}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Link
                        to={`/user/${l.user.id}`}
                        className="flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                      >
                        <Avatar user={l.user as any} />
                        <div>
                          <div className="font-medium text-gray-900">
                            {l.user.username}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">
                            {l.user.email}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {l.time_taken_minutes}
                        </span>
                        <span className="text-gray-500 text-sm">min</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold px-3 py-1 rounded-full text-sm
                          ${
                            l.score >= 90
                              ? "bg-green-100 text-green-800"
                              : l.score >= 70
                                ? "bg-blue-100 text-blue-800"
                                : l.score >= 50
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {l.score}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-blue-600 text-sm underline">
                        {l.submitted_at}
                      </div>
                    </td>
                  </tr>
                  {/* Separator line between rows */}
                  {i < quiz.leaderboard.length - 1 && (
                    <tr>
                      <td colSpan={5} className="py-2">
                        <div className="border-t border-gray-100"></div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
    </div>
  );
};

export default QuizLeaderBoard;
