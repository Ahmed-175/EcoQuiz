import { TiMessages } from "react-icons/ti";
import { IoTimeOutline } from "react-icons/io5";
import { FaChartSimple } from "react-icons/fa6";

// Displays quiz statistics
const QuizStats = ({ questions, duration, average }: any) => {
  return (
    <div className="mt-5 grid grid-cols-3 gap-4">
      <Stat icon={<TiMessages />} value={questions} label="Questions" />
      <Stat icon={<IoTimeOutline />} value={duration} label="Minutes" />
      <Stat icon={<FaChartSimple />} value={`${average}%`} label="Average Score" />
    </div>
  );
};

const Stat = ({ icon, value, label }: any) => (
  <div className="text-center">
    <div className="text-2xl font-bold flex justify-center items-center gap-2">
      {icon}
      {value}
    </div>
    <div className="text-gray-600">{label}</div>
  </div>
);

export default QuizStats;
