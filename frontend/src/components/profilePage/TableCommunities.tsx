import React from "react";
import {
  MdOutlineGroups,
  MdOutlineQuiz,
  MdOutlinePerson,
  MdOutlineCalendarToday,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi";
import { LiaUserShieldSolid } from "react-icons/lia";
import { Link } from "react-router-dom";

interface Community {
  id: string;
  joinI: string;
  numberOfQuizzes: string;
  role: string;
  memberCount: string;
  creator: {
    email: string;
    id: string;
  };
  name?: string;
}

const TableCommunities = ({ communities }: { communities: Community[] }) => {
  if (!communities || communities.length === 0) {
    return (
      <div className="p-10 pt-32">
        <div className="flex justify-center items-center gap-2 mb-10 text-3xl font-bold">
          <HiOutlineUserGroup className="text-6xl" />
          My Communities
        </div>
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
            <MdOutlineGroups className="text-3xl text-gray-400" />
          </div>
          <p className="text-gray-600 text-lg">
            You haven't joined any communities yet
          </p>
          <p className="text-gray-500 mt-2">
            Join communities to see them here!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 pt-32">
      <div className="flex justify-center items-center gap-2 mb-10 text-3xl font-bold">
        <HiOutlineUserGroup className="text-6xl" />
        My Communities
      </div>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <HiOutlineUserGroup className="text-xl" />
                  <span>Community</span>
                </div>
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <MdOutlinePerson className="text-xl" />
                  <span>Role</span>
                </div>
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <MdOutlineGroups className="text-xl" />
                  <span>Members</span>
                </div>
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <MdOutlineQuiz className="text-xl" />
                  <span>Quizzes</span>
                </div>
              </th>
              <th className="py-4 px-6 text-left text-gray-600 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <MdOutlineCalendarToday className="text-xl" />
                  <span>Joined Date</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {communities.map((community, index) => (
              <React.Fragment key={community.id}>
                <tr
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-gray-50/50" : ""
                  }`}
                >
                  {/* Community Name/Info */}
                  <td className="py-4 px-6">
                    <div>
                      <Link
                        to={`/community/${community.id}`}
                        className="font-medium text-blue-700 underline "
                      >
                        {community.name}
                      </Link>
                      <div className="text-xs text-gray-500 underline mt-1.5">
                        {community.creator.email}
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-semibold px-3 py-1 rounded-full text-sm flex items-center gap-1
                        ${
                          community.role === "Admin" ||
                          community.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : community.role === "Moderator" ||
                                community.role === "moderator"
                              ? "bg-blue-100 text-blue-800"
                              : community.role === "Member" ||
                                  community.role === "member"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {community.role === "Admin" ||
                        community.role === "admin" ? (
                          <LiaUserShieldSolid className="text-base" />
                        ) : community.role === "Moderator" ||
                          community.role === "moderator" ? (
                          <MdOutlineAdminPanelSettings className="text-base" />
                        ) : null}
                        {community.role}
                      </span>
                    </div>
                  </td>

                  {/* Members Count */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {community.memberCount}
                      </span>
                      <span className="text-gray-500 text-sm">members</span>
                    </div>
                  </td>

                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-semibold
                        ${
                          parseInt(community.numberOfQuizzes) > 50
                            ? "bg-green-100 text-green-800"
                            : parseInt(community.numberOfQuizzes) > 20
                              ? "bg-blue-100 text-blue-800"
                              : parseInt(community.numberOfQuizzes) > 5
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {community.numberOfQuizzes}
                      </span>
                      <span className="text-gray-500 text-sm">quizzes</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-gray-600 text-sm ">
                      {community.joinI}
                    </div>
                  </td>
                </tr>

                {index < communities.length - 1 && (
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
    </div>
  );
};

export default TableCommunities;
