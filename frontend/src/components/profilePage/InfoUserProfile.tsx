import { useState, useRef } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoCameraOutline } from "react-icons/io5";
import { useAuth } from "../../hooks/useAuth";
import { updateProfile } from "../../services/updateProfile";

const InfoUserProfile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (username.trim() && username !== user?.username) {
      updateProfile(username, user?.avatar, user?.banner);
      setUser((prev) => (prev ? { ...prev, username } : prev));
      console.log("Updating username to:", username);
    }

    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload new avatar
      console.log("Uploading new avatar:", file);
    }
  };

  return (
    <div className="absolute left-6 -bottom-16 flex items-start gap-4">
      {/* Avatar Section */}
      <div className="relative">
        <div className="w-24 h-24 rounded-full border-3 border-white bg-gray-200 overflow-hidden shadow-md">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border-2 border-white"
        >
          <IoCameraOutline className="text-white text-sm" />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleAvatarChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Info Section */}
      <div className="pt-8">
        {isEditing ? (
          <div className="flex items-center gap-2 mb-1">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-lg font-semibold"
              autoFocus
            />
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setUsername(user?.username || "");
              }}
              className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-gray-900">{username}</h2>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <FiEdit2 className="text-gray-500" />
            </button>
          </div>
        )}

        <p className="text-gray-600 text-sm">{user?.email}</p>
      </div>
    </div>
  );
};

export default InfoUserProfile;
