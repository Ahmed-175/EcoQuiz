import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiBook, FiLock, FiGlobe } from 'react-icons/fi';
import type { Community } from '../../types/types';

interface CommunityCardProps {
    community: Community;
}

const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
    return (
        <Link
            to={`/community/${community.id}`}
            className="group block bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-violet-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
        >
            {/* Header gradient */}
            <div className="h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500" />

            <div className="p-6">
                {/* Subject badge */}
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-violet-50 text-violet-600 rounded-full text-xs font-medium mb-3">
                    {community.subject}
                </div>

                {/* Privacy badge */}
                <div className="float-right">
                    {community.is_public ? (
                        <FiGlobe className="w-4 h-4 text-green-500" title="Public" />
                    ) : (
                        <FiLock className="w-4 h-4 text-gray-400" title="Private" />
                    )}
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">
                    {community.name}
                </h3>

                {/* Description */}
                {community.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {community.description}
                    </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                        <FiUsers className="w-4 h-4" />
                        <span>{community.member_count || 0} members</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FiBook className="w-4 h-4" />
                        <span>{community.quiz_count || 0} quizzes</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CommunityCard;
