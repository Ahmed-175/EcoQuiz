import React from "react";
import { AiOutlineLoading } from "react-icons/ai";

interface IsJoinProps {
  roleMember: string;
  onJoin?: () => void;
  loading?: boolean;
}

const IsJoin = ({ roleMember, onJoin, loading = false }: IsJoinProps) => {
  if (roleMember === "CREATOR") return null;

  if (roleMember === "MEMBER" || roleMember === "ADMIN")
    return (
      <button
        onClick={onJoin}
        disabled={loading}
        className="bg-linear-to-r from-pink-500 to-rose-600 text-white
         font-medium py-2 px-5 rounded-full hover:opacity-90 active:scale-[0.98] 
         transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed
         text-sm w-full max-w-[180px] cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <AiOutlineLoading className="animate-spin h-3.5 w-3.5" />
            <span className="text-xs">Leaving...</span>
          </span>
        ) : (
          <span className="text-xs font-semibold tracking-wide">
            LEAVE COMMUNITY
          </span>
        )}
      </button>
    );

  if (roleMember === "NON_MEMBER")
    return (
      <button
        onClick={onJoin}
        disabled={loading}
        className="bg-linear-to-r cursor-pointer from-blue-500 to-purple-600
         text-white font-medium py-2 px-5 rounded-full hover:opacity-90 
         active:scale-[0.98] transition-all duration-200 disabled:opacity-70 
         disabled:cursor-not-allowed text-sm w-full max-w-[180px]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <AiOutlineLoading className="animate-spin h-3.5 w-3.5" />
            <span className="text-xs">Joining...</span>
          </span>
        ) : (
          <span className="text-xs font-semibold tracking-wide">
            JOIN COMMUNITY
          </span>
        )}
      </button>
    );

  return null;
};

export default IsJoin;
