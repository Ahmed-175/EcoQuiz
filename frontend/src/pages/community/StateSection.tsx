import { FaRegNewspaper, FaUsers } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

const sections = [
  {
    name: "Quizzes",
    icon: FaRegNewspaper,
    id: "Quizzes",
    color: "text-blue-600",
    activeColor: "bg-blue-600",
  },
  {
    name: "Members",
    icon: FaUsers,
    id: "Members",
    color: "text-emerald-600",
    activeColor: "bg-emerald-600",
  },
  // {
  //   name: "Settings",
  //   icon: IoSettingsOutline,
  //   id: "notifications",
  //   color: "text-purple-600",
  //   activeColor: "bg-purple-600",
  // },
];

const StateSection = ({
  stateSection,
  setStateSection,
}: {
  stateSection: string;
  setStateSection: any;
}) => {
  return (
    <div className=" fixed top-[50%] right-12 mt-10 w-fit mx-auto px-6 rounded-xl mb-10">
      {sections.map((sec) => (
        <button
          key={sec.id}
          onClick={() => setStateSection(sec.id)}
          className={`flex flex-col mb-3 items-center gap-2 p-3 cursor-pointer 
              transition-all duration-200 ease-in-out  
              ${
                stateSection === sec.id
                  ? `${sec.color} border-b-2 rounded-none border-gray-400  `
                  : "text-gray-500 hover:text-indigo-500 rounded-xl hover:bg-indigo-100"
              }`}
        >
          <div className="relative">
            <sec.icon
              className={`w-5 h-5 transition-all duration-200 ${
                stateSection === sec.id ? "scale-110" : ""
              }`}
            />
          </div>
          <div className="text-xs font-medium transition-all duration-200">
            {sec.name}
          </div>
        </button>
      ))}
    </div>
  );
};

export default StateSection;
