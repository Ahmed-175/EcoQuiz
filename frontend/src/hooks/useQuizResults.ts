// Results/hooks/useQuizResults.ts
import { useEffect, useState } from "react";
import { IQuizResult } from "../types/result.types";
import { getQuizResult } from "../services/quizService";


export const useQuizResults = (quizId: string) => {
  const [result, setResult] = useState<IQuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getQuizResult(quizId);
        setResult(res);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [quizId]);

  return {
    result,
    loading,
    currentQuestionIndex,
    setCurrentQuestionIndex,
  };
};
