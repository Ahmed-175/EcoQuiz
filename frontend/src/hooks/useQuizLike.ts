import { useState } from "react";
import { likeQuiz } from "../services/quizService";

// Custom hook to handle quiz likes logic
export const useQuizLike = (quizId: string, initialLikes: number , isLike : boolean) => {
  const [isLiked, setIsLiked] = useState(isLike);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [isLiking, setIsLiking] = useState(false);

  const toggleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);

      const response = await likeQuiz(quizId);

      if (response.status == "liked") {
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      } else if (response.status == "unliked") {
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      }
    } catch (error) {
      console.error("Failed to like quiz:", error);
    } finally {
      setIsLiking(false);
    }
  };

  return {
    isLiked,
    likesCount,
    toggleLike,
    isLiking,
  };
};
