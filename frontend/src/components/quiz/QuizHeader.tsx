import { IoCalendarOutline } from "react-icons/io5";

// Displays quiz title and creation date
const QuizHeader = ({ title, createdAt, isNew }: any) => {
  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{title}</h2>
        {isNew && (
          <span className="bg-red-500 px-4 py-1 text-white rounded-full">
            New
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-gray-600 mt-2">
        <IoCalendarOutline />
        <span>{createdAt}</span>
      </div>
    </div>
  );
};

export default QuizHeader;
