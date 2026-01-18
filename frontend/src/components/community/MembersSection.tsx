import type { Member } from "../../types/community.type";
import Avatar from "../Avatar";
import { Link } from "react-router-dom";
import { FaUser, FaCrown, FaShieldAlt, FaUserFriends } from "react-icons/fa";

const MembersSection = ({ members }: { members: Member[] }) => {
  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return <FaCrown className="text-amber-500" />;
      case "admin":
        return <FaShieldAlt className="text-blue-500" />;
      case "member":
        return <FaUserFriends className="text-green-500" />;
      default:
        return <FaUser className="text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      creator: "creator",
      admin: "admin",
      member: "member",
    };
    return roleMap[role.toUpperCase()] || role;
  };

  return (
    <div className="w-full mx-auto md:w-[70%] p-4">
      {members.map((member, index) => (
        <Link
          to={`/user/${member.id}`}
          className="flex justify-between items-center my-3 
            bg-white p-3 rounded-xl hover:bg-slate-50 duration-300 
            shadow-sm hover:shadow-md transition-all border border-slate-100"
          key={member.id || index}
        >
          <div className="flex items-center gap-4">
            <Avatar user={member as any} size="xl" />
            <div>
              <div className="font-bold text-slate-800">{member.username}</div>
              <div className="text-sm text-slate-500">{member.email}</div>
            </div>
          </div>

          <div
            className="flex items-center gap-2 px-3 py-1.5 
            bg-slate-50 rounded-lg text-sm uppercase font-medium text-slate-700"
          >
            <span className="text-lg">{getRoleIcon(member.role)}</span>
            <span>{getRoleLabel(member.role)}</span>
          </div>
        </Link>
      ))}
      
    </div>
  );
};

export default MembersSection;
