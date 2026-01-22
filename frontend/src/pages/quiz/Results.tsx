import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizResult } from "../../services/quizService";
import { FaTrophy } from "react-icons/fa";
import Loading from "../../components/Loading";
import api from "../../api/api";
import { ResultsHeader } from "../../components/results/ResultsHeader";
import { ProgressIndicator } from "../../components/results/ProgressIndicator";
import { NavigationControls } from "../../components/results/NavigationControls";
import { QuestionCard } from "../../components/results/QuestionCard";
import { IQuizResult } from "../../types/result.types";
import { CompletionMessage } from "../../components/results/CompletionMessage";

const Results = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<IQuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await getQuizResult(id as string);
        setResult(res);
      } catch (error) {
        console.error("Failed to fetch results:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  const handleAddComment = async (questionId: string, text: string) => {
    try {
      await api.post(`questions/${questionId}/comments`, {
        text: text,
      });
      const res = await getQuizResult(id as string);
      setResult(res);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const goToNextQuestion = () => {
    if (result && currentQuestionIndex < result.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleQuestionClick = (index: number) => {
    setCurrentQuestionIndex(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) return <Loading />;
  if (!result) return <div className="text-center p-10">Result not found</div>;

  const currentQuestion = result.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === result.questions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  return (
    <div
      className="min-h-screen w-full md:w-[80%] mx-auto 
     pt-20 pb-10 px-4"
    >
      <div className="">
        <ResultsHeader
          quizTitle={result.quiz_title}
          completedAt={result.completed_at}
          score={result.score}
          totalQuestions={result.total_questions}
          percentage={result.percentage}
          timeTakenMinutes={result.time_taken_minutes}
          quizId={result.quiz_id}
          onBack={() => navigate(`/quiz/${result.quiz_id}`)}
        />

        <ProgressIndicator
          currentIndex={currentQuestionIndex}
          totalQuestions={result.questions.length}
        />

        <NavigationControls
          currentIndex={currentQuestionIndex}
          totalQuestions={result.questions.length}
          onPrevious={goToPrevQuestion}
          onNext={goToNextQuestion}
          onQuestionClick={handleQuestionClick}
          className="mb-6"
        />

        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          onAddComment={handleAddComment}
        />

        <NavigationControls
          currentIndex={currentQuestionIndex}
          totalQuestions={result.questions.length}
          onPrevious={goToPrevQuestion}
          onNext={goToNextQuestion}
          onQuestionClick={handleQuestionClick}
          showDots={false}
        />

        {isLastQuestion && (
          <CompletionMessage
            percentage={result.percentage}
            onReturn={() => navigate(`/quiz/${result.quiz_id}`)}
          />
        )}
      </div>
    </div>
  );
};

export default Results;
