import { FaRegNewspaper, FaUsers } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

const sections = [
  {
    name: "Quizzes",
    icon: FaRegNewspaper,
    id: "quizzes",
    color: "text-blue-600",
    activeColor: "bg-blue-600",
  },
  {
    name: "Communities",
    icon: FaUsers,
    id: "communities",
    color: "text-emerald-600",
    activeColor: "bg-emerald-600",
  },
];

const StateSectionProfile = ({
  stateSection,
  setStateSection,
}: {
  stateSection: string;
  setStateSection: any;
}) => {
  return (
    <div className="fixed top-1/2  right-8 py-4 px-2 ">
      <div className="flex flex-col items-center gap-3">
        {sections.map((sec) => {
          const isActive = stateSection === sec.id;
          return (
            <button
              key={sec.id}
              onClick={() => setStateSection(sec.id)}
              className={`relative flex flex-col items-center gap-1 p-3 transition-all duration-200 
                ${
                  isActive
                    ? `${sec.color} bg-white `
                    : "text-gray-500 hover:text-indigo-500 hover:bg-indigo-50"
                }`}
            >
              <sec.icon
                className={`w-5 h-5 transition-transform duration-200 ${
                  isActive ? "scale-110" : ""
                }`}
              />

              <div className="text-xs font-medium transition-all duration-200">
                {sec.name}
              </div>

              {/* Active indicator */}
              {isActive && (
                <div
                  className={`absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-10 ${sec.activeColor} rounded-full`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StateSectionProfile;
