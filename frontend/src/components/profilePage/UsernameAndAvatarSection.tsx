import { LuImageDown } from "react-icons/lu";
import { useAuth } from "../../hooks/useAuth";
import { getAvatar } from "../../utils/getAvatar";
import { uploadAvatar } from "../../services/userService";
import { useEffect, useState } from "react";
import { baseUrl } from "../../utils/baseUrl";

const UsernameAndAvatarSection = () => {
  const { user, setUser, setLoading } = useAuth();
  const [avatar, setAvatar] = useState(user?.avatar);

  useEffect(() => {
    const newAvatar = getAvatar(user?.avatar);
    setAvatar(newAvatar);
  }, [user]);

  const handlerAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const avatarURL = await uploadAvatar(file);
      console.log(avatarURL);
      setUser((prev) => (prev ? { ...prev, avatar: avatarURL } : prev));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute left-24 -bottom-24 flex justify-center items-center gap-3">
      <div className="relative">
        <img
          src={`${baseUrl}${user?.avatar}`}
          alt="avatar"
          className="w-35 h-35 object-cover rounded-full border-4 border-white"
        />
        <input
          type="file"
          className="hidden"
          id="uploadAvatar"
          accept="image/*"
          onChange={handlerAvatar}
        />
        <label
          htmlFor="uploadAvatar"
          className="w-full opacity-0 hover:opacity-40 h-full absolute right-0 bottom-0 bg-gray-800
               text-white text-4xl p-3 rounded-full flex justify-center items-center
                hover:bg-gray-800 
                duration-200 cursor-pointer"
        >
          <LuImageDown />
        </label>
      </div>
      <div className=" mt-4">
        <h1 className=" font-bold text-xl">{user?.username}</h1>
        <h1 className="text-sm text-gray-800">{user?.email}</h1>
      </div>
    </div>
  );
};

export default UsernameAndAvatarSection;
