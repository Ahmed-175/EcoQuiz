import { Link } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi";
import { TiMessages } from "react-icons/ti";
import { FiUsers } from "react-icons/fi";
import Avatar from "../Avatar";
import { baseUrl } from "../../utils/baseUrl";
import type { CommunityCard } from "../../types/community.type";

interface RecommendedCommunitiesProps {
    communities: CommunityCard[];
}

const RecommendedCommunities = ({ communities }: RecommendedCommunitiesProps) => {
    if (!communities || communities.length === 0) return null;

    return (
        <div className="mb-8">
            {/* Section Header */}
            <div className="flex items-center gap-2 mb-4">
                <HiOutlineUserGroup className="text-2xl text-gray-600" />
                <h2 className="text-lg font-bold text-gray-900">Recommend Communities</h2>
            </div>

            {/* Communities Carousel */}
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {communities.slice(0, 6).map((community) => (
                    <Link
                        key={community.id}
                        to={`/community/${community.id}`}
                        className="flex-shrink-0 w-[220px] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1"
                    >
                        {/* Banner */}
                        <div className="relative h-28 bg-gradient-to-br from-blue-500 to-purple-600">
                            {community.banner && (
                                <img
                                    src={`${baseUrl}${community.banner}`}
                                    alt={community.name}
                                    className="w-full h-full object-cover"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                            {/* Creator Avatar */}
                            {community.creator && (
                                <div className="absolute bottom-2 left-3 flex items-center gap-2">
                                    <Avatar user={community.creator as any} size="sm" />
                                    <span className="text-white text-xs font-medium truncate max-w-[120px]">
                                        {community.creator.username}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="p-3">
                            <h3 className="font-bold text-gray-900 text-sm mb-1 truncate">
                                {community.name}
                            </h3>
                            <p className="text-xs text-gray-500 mb-3">
                                {new Date(community.created_at).toLocaleDateString()}
                            </p>

                            {/* Stats */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <TiMessages className="text-cyan-500" />
                                    <span>{community.number_of_quizzes} Quizzes</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <FiUsers className="text-purple-500" />
                                    <span>{community.number_of_members || 0} Users</span>
                                </div>
                            </div>

                            {/* Member Avatars */}
                            {community.members && community.members.length > 0 && (
                                <div className="flex items-center mt-3 -space-x-2">
                                    {community.members.slice(0, 3).map((member, idx) => (
                                        <Avatar
                                            key={idx}
                                            user={member as any}
                                            size="xs"
                                            className="ring-2 ring-white"
                                        />
                                    ))}
                                    {community.members.length > 3 && (
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 ring-2 ring-white">
                                            +{community.members.length - 3}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default RecommendedCommunities;
