import React from 'react';
import type { CommunityMember } from '../../types/types';
import Avatar from '../Avatar';
import { FiStar, FiShield } from 'react-icons/fi';

interface MemberListProps {
    members: CommunityMember[];
    onRoleChange?: (userId: string, newRole: 'admin' | 'member') => void;
    onRemove?: (userId: string) => void;
    isAdmin?: boolean;
}

const MemberList: React.FC<MemberListProps> = ({
    members,
    onRoleChange,
    onRemove,
    isAdmin = false
}) => {
    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'creator':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                        <FiStar className="w-3 h-3" /> Creator
                    </span>
                );
            case 'admin':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        <FiShield className="w-3 h-3" /> Admin
                    </span>
                );
            default:
                return (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        Member
                    </span>
                );
        }
    };

    return (
        <div className="space-y-3">
            {members.map((member) => (
                <div
                    key={member.id}
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        {member.user && <Avatar user={member.user} size="md" />}
                        <div>
                            <p className="font-medium text-gray-900">
                                {member.user?.username || member.user?.email}
                            </p>
                            <p className="text-sm text-gray-500">
                                Joined {new Date(member.joined_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {getRoleBadge(member.role)}

                        {isAdmin && member.role !== 'creator' && (
                            <div className="flex items-center gap-2">
                                <select
                                    value={member.role}
                                    onChange={(e) => onRoleChange?.(member.user_id, e.target.value as 'admin' | 'member')}
                                    className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                >
                                    <option value="member">Member</option>
                                    <option value="admin">Admin</option>
                                </select>
                                <button
                                    onClick={() => onRemove?.(member.user_id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MemberList;
