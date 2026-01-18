import React from "react";
import { TiChartLine, TiGroup, TiMessages, TiTime } from "react-icons/ti";
import type { IQuiz, StatItem } from "../../types/types";

const stats: StatItem[] = [
  { label: "Questions", icon: TiMessages, color: "bg-blue-100", iconColor: "text-blue-500", description: "Total questions asked", valueKey: "number_of_questions" },
  { label: "Minutes", icon: TiTime, color: "bg-emerald-100", iconColor: "text-emerald-500", description: "Total learning time", valueKey: "duration_minutes" },
  { label: "Average Score", icon: TiChartLine, color: "bg-amber-100", iconColor: "text-amber-500", description: "Overall performance", valueKey: "average_score" },
  { label: "Students", icon: TiGroup, color: "bg-violet-100", iconColor: "text-violet-500", description: "Number of learners", valueKey: "students_count" },
];

type QuizStatsProps = {
  quiz: IQuiz;
};

const QuizStatsDetail = ({ quiz }: QuizStatsProps) => (
  <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
    {stats.map((item) => (
      <div key={item.label} className="rounded-2xl bg-white border p-6 hover:shadow-xl transition">
        <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${item.color}`}>
          <item.icon className={`text-2xl ${item.iconColor}`} />
        </div>
        <div className="text-3xl font-extrabold mt-3">{quiz[item.valueKey]}</div>
        <div className="text-sm font-semibold text-gray-700">{item.label}</div>
        <div className="text-xs text-gray-500">{item.description}</div>
      </div>
    ))}
  </div>
);

export default QuizStatsDetail;
