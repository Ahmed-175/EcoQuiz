import React, { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaBook, FaUsers, FaExclamationCircle, FaTimes } from "react-icons/fa";
import {
  createCommunity,
  uploadBannerCommunity,
} from "../../services/communityService";
import { baseUrl } from "../../utils/baseUrl";
import { useNavigate } from "react-router-dom";

const CreateCommunity = () => {
  const navigate = useNavigate();
  const [communityName, setCommunityName] = useState("");
  const [description, setDescription] = useState("");
  const [banner, setBanner] = useState("");
  const [allowPublicQuizSubmission, setAllowPublicQuizSubmission] =
    useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadBannerForCommunity = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload an image in JPEG, PNG, GIF, or WebP format");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5MB");
      return;
    }

    setIsLoading(true);
    try {
      const url = await uploadBannerCommunity(file);
      if (!url) {
        setBanner("");
        setError("Failed to upload image. Please try again");
      } else {
        setBanner(url);
        setError(null);
      }
    } catch (error) {
      console.log("Failed to upload banner", error);
      setError("An error occurred while uploading the image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCommunity = async () => {
    if (!communityName.trim()) {
      setError("Please enter a community name");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a community description");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res: any = await createCommunity({
        name: communityName,
        banner: banner,
        description: description,
        allow_public_quiz_submission: allowPublicQuizSubmission,
      });

      navigate(`/community/${res.community_id}`);
    } catch (error: any) {
      console.error(error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message?.includes("Network Error")) {
        setError(
          "Failed to connect to the server. Please check your internet connection"
        );
      } else {
        setError("An error occurred while creating the community");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeError = () => {
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-24 min-h-screen">
      {error && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slideIn">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
            <div className="flex items-start">
              <FaExclamationCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3 flex-1">
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={closeError}
                className="ml-4 text-red-400 hover:text-red-600"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full mb-4">
          <FaUsers className="text-2xl text-blue-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Create Educational Community
        </h1>
        <p className="text-gray-600">
          Build a space where members learn and grow together
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Community Name
          </label>
          <input
            type="text"
            placeholder="e.g. JavaScript Enthusiasts"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            placeholder="Describe your community goals..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Image
          </label>

          {banner ? (
            <div className="relative w-full h-64 rounded-xl overflow-hidden group">
              <img
                src={`${baseUrl}${banner}`}
                className="w-full h-full object-cover"
                alt="Community banner"
              />
              <label
                htmlFor="uploadBannerForCommunity"
                className="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
              >
                <IoCloudUploadOutline className="text-white text-3xl" />
              </label>
              <input
                type="file"
                id="uploadBannerForCommunity"
                className="hidden"
                onChange={handleUploadBannerForCommunity}
                disabled={isLoading}
              />
            </div>
          ) : (
            <label
              htmlFor="uploadBannerForCommunity"
              className="w-full h-64 border-2 border-dashed border-blue-200 rounded-xl flex flex-col items-center justify-center cursor-pointer"
            >
              <IoCloudUploadOutline className="text-3xl text-blue-600 mb-2" />
              <span className="text-gray-600">
                {isLoading ? "Uploading..." : "Upload Banner Image"}
              </span>
              <input
                type="file"
                id="uploadBannerForCommunity"
                className="hidden"
                onChange={handleUploadBannerForCommunity}
                disabled={isLoading}
              />
            </label>
          )}
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <FaBook className="text-indigo-600" />
            <div>
              <h3 className="font-medium">Allow Quiz Submission</h3>
              <p className="text-sm text-gray-600">
                Members can create and share quizzes
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              setAllowPublicQuizSubmission(!allowPublicQuizSubmission)
            }
            className={`w-11 h-6 rounded-full transition ${
              allowPublicQuizSubmission ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`block w-4 h-4 bg-white rounded-full transform transition ${
                allowPublicQuizSubmission ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleCreateCommunity}
          disabled={isLoading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl"
        >
          {isLoading ? "Creating..." : "Create Community"}
        </button>
      </div>
    </div>
  );
};

export default CreateCommunity;
