import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi';
import { useQuizTaking } from '../../hooks/useQuiz';
import Loading from '../../components/Loading';
import Button from '../../components/ui/Button';
import QuestionCard from '../../components/quiz/QuestionCard';
import QuizTimer from '../../components/quiz/QuizTimer';
import Modal from '../../components/ui/Modal';

const Take = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const {
    quiz,
    questions,
    currentQuestion,
    currentIndex,
    answers,
    loading,
    submitting,
    error,
    progress,
    isComplete,
    selectAnswer,
    goToNext,
    goToPrevious,
    goToQuestion,
    submitQuiz
  } = useQuizTaking(id || '');

  const handleSubmit = useCallback(async () => {
    try {
      const result = await submitQuiz();
      navigate(`/quiz/${id}/results`, { state: { attempt: result } });
    } catch (err) {
      console.error('Failed to submit:', err);
    }
  }, [submitQuiz, navigate, id]);

  const handleTimeUp = useCallback(() => {
    handleSubmit();
  }, [handleSubmit]);

  if (loading) return <Loading />;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!quiz || !currentQuestion) return <div className="text-center py-20">Quiz not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header with timer and progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900 truncate">{quiz.title}</h1>
            {quiz.duration_minutes && (
              <QuizTimer
                durationMinutes={quiz.duration_minutes}
                onTimeUp={handleTimeUp}
              />
            )}
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question navigation dots */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => goToQuestion(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${index === currentIndex
                  ? 'bg-blue-500 text-white scale-110'
                  : answers.has(q.id)
                    ? 'bg-green-100 text-green-700 border-2 border-green-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {/* Current Question */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={answers.get(currentQuestion.id)}
          onSelectAnswer={(option) => selectAnswer(currentQuestion.id, option)}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            icon={<FiChevronLeft />}
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>

          <div className="text-gray-500">
            {answers.size} of {questions.length} answered
          </div>

          {currentIndex === questions.length - 1 ? (
            <Button
              variant="primary"
              icon={<FiCheck />}
              onClick={() => setShowConfirmModal(true)}
              disabled={!isComplete}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={goToNext}
            >
              Next <FiChevronRight className="ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Confirm Submit Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Submit Quiz?"
        size="sm"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            You have answered {answers.size} out of {questions.length} questions.
            {!isComplete && (
              <span className="block text-orange-500 mt-2">
                Some questions are unanswered!
              </span>
            )}
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={submitting}
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Take;