import Avatar from "../Avatar";
import { Link } from "react-router-dom";
import { FaUserGraduate } from "react-icons/fa";

// Displays quiz creator information
const QuizCreatorInfo = ({ creator }: any) => {
  return (
    <div className="flex justify-between items-center">
      <Link
        to={`/user/${creator.id}`}
        className="flex items-center gap-3"
      >
        <Avatar user={creator} size="xl" />
        <div>
          <div className="font-bold">{creator.username}</div>
          <div className="text-gray-600 text-xs">{creator.email}</div>
        </div>
      </Link>

      <div className="uppercase flex items-center bg-blue-500 px-3 py-1 gap-2 rounded-full text-white">
        <FaUserGraduate />
        {creator.role}
      </div>
    </div>
  );
};

export default QuizCreatorInfo;
