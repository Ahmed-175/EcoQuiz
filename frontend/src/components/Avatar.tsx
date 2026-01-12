import React from "react";
import type { User } from "../types/types";

interface AvatarProps {
  user: User;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showTooltip?: boolean;
  onClick?: () => void;
  border?: boolean;
  status?: "online" | "offline" | "idle" | "busy";
}

const Avatar: React.FC<AvatarProps> = ({
  user,
  size = "md",
  className = "",
  showTooltip = false,
  onClick,
  border = false,
  status,
}) => {
  const sizeConfig = {
    xs: { container: "w-6 h-6", text: "text-xs", status: "w-1.5 h-1.5" },
    sm: { container: "w-8 h-8", text: "text-sm", status: "w-2 h-2" },
    md: { container: "w-10 h-10", text: "text-base", status: "w-2.5 h-2.5" },
    lg: { container: "w-12 h-12", text: "text-lg", status: "w-3 h-3" },
    xl: { container: "w-14 h-14", text: "text-xl", status: "w-3.5 h-3.5" },
    "2xl": { container: "w-16 h-16", text: "text-2xl", status: "w-4 h-4" },
  };

  const getGradient = (name?: string) => {
    if (!name) return "from-cyan-500 to-blue-500";

    const colors = [
      "from-cyan-500 to-blue-500",
      "from-purple-500 to-pink-500",
      "from-green-500 to-emerald-500",
      "from-orange-500 to-red-500",
      "from-violet-500 to-fuchsia-500",
      "from-amber-500 to-yellow-500",
    ];

    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = () => {
    if (user.username) {
      return user.username.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getDisplayName = () => {
    return user.username || user.email?.split("@")[0] || "User";
  };

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "offline":
        return "bg-gray-400";
      case "idle":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      default:
        return "";
    }
  };

  const config = sizeConfig[size];
  const gradient = getGradient(user.username || user.email);

  return (
    <div className="relative inline-block">
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
          {getDisplayName()}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </div>
      )}

      <div
        className={`relative ${config.container
          } rounded-full flex items-center justify-center cursor-pointer 
          ${border ? "ring-2 ring-white dark:ring-gray-800" : ""}
          ${onClick ? "hover:shadow-lg hover:scale-105" : ""}
          transition-all duration-200 ${className} group`}
        onClick={onClick}
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={getDisplayName()}
            className="w-full h-full rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className={`w-full h-full rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center text-white font-semibold ${config.text}`}
          >
            {getInitials()}
          </div>
        )}

        {status && (
          <div
            className={`absolute bottom-0 right-0 ${config.status
              } rounded-full ${getStatusColor()} ring-2 ring-white dark:ring-gray-800`}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
