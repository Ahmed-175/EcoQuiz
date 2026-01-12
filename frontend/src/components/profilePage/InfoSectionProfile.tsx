import React from "react";
import { useAuth } from "../../hooks/useAuth";
import { getBanner } from "../../utils/getBanner";
import { LuImageDown } from "react-icons/lu";
import { uploadBanner } from "../../services/userService";
import UsernameAndAvatarSection from "./UsernameAndAvatarSection";

const InfoSectionProfile = () => {
  const { user, setUser, setLoading } = useAuth();

  const handleUploadBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const bannerURL = await uploadBanner(file);
      setUser((prev) => (prev ? { ...prev, banner: bannerURL } : prev));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full md:w-[80%] mx-auto h-75 rounded-b-lg">
      <img
        src={getBanner(user?.banner)}
        alt="banner"
        className="w-full h-full object-cover rounded-b-lg"
      />

      <input
        type="file"
        className="hidden"
        id="uploadBanner"
        accept="image/*"
        onChange={handleUploadBanner}
      />

      <label
        htmlFor="uploadBanner"
        className="absolute right-3 bottom-3 bg-gray-950
       text-white text-2xl p-3 rounded-full hover:bg-gray-800 
       hover:scale-[1.09] duration-200 cursor-pointer"
      >
        <LuImageDown />
      </label>
      <UsernameAndAvatarSection />
    </div>
  );
};

export default InfoSectionProfile;
