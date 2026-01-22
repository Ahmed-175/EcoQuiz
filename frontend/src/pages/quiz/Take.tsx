import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getQuizForTaking,
  submitQuizAttempt,
} from "../../services/quizService";
import { FaClock, FaListOl, FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";

interface IQuizQ {
  quiz_id: string;
  title: string;
  duration: number;
  questions: Question[];
}

interface Question {
  question_id: string;
  question_text: string;
  options: Option[];
}

interface Option {
  option_id: string;
  text: string;
}

interface Answer {
  question_id: string;
  option_id: string;
  answer_text: string;
}

interface ISubmitQuizForm {
  duration_minutes: number;
  answers: Answer[];
}

const Take = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quizQ, setQuizQ] = useState<IQuizQ | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // جلب بيانات الاختبار
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await getQuizForTaking(id as string);
        setQuizQ(res.quiz);
        setTimeLeft(res.quiz.duration * 60);
      } catch (error) {
        console.error(error);
      }
    };
    fetchQuiz();
  }, [id]);

  // المؤقت
  useEffect(() => {
    if (!quizQ || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizQ, timeLeft]);

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const goToQuestion = (index: number) => {
    setCurrentIndex(index);
  };

  const nextQuestion = () => {
    if (quizQ && currentIndex < quizQ.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quizQ || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formattedAnswers: Answer[] = Object.entries(answers).map(
        ([questionId, optionId]) => {
          const question = quizQ.questions.find(
            (q) => q.question_id === questionId,
          );
          const selectedOption = question?.options.find(
            (o) => o.option_id === optionId,
          );
          return {
            question_id: questionId,
            option_id: optionId,
            answer_text: selectedOption?.text || "",
          };
        },
      );

      const submitData: ISubmitQuizForm = {
        duration_minutes: Math.ceil((quizQ.duration * 60 - timeLeft) / 60),
        answers: formattedAnswers,
      };

      const result = await submitQuizAttempt(quizQ.quiz_id, submitData);
      navigate(`/quiz/${result.result}/results`);
    } catch (error) {
      console.error("Failed to submit quiz:", error);
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!quizQ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = quizQ.questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quizQ.questions.length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4"
              >
                <IoMdArrowRoundBack />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">
                {quizQ.title}
              </h1>
              <p className="text-gray-600 mt-1">
                Answer all questions before time runs out
              </p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}
              >
                <FaClock className={timeLeft < 300 ? "animate-pulse" : ""} />
                <span className="font-mono font-bold text-xl">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <FaListOl />
                <span className="font-semibold">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow p-6 sticky top-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaListOl />
                Questions
              </h3>

              <div className="grid grid-cols-5 gap-2 mb-6">
                {quizQ.questions.map((question, index) => (
                  <button
                    key={question.question_id}
                    onClick={() => goToQuestion(index)}
                    className={`h-10 rounded-lg flex items-center justify-center font-semibold ${currentIndex === index
                      ? "bg-blue-600 text-white"
                      : answers[question.question_id]
                        ? "bg-green-100 text-green-700 border border-green-300"
                        : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">
                    Answered: {answeredCount}
                  </span>
                  <span className="font-semibold">
                    {answeredCount}/{totalQuestions}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${(answeredCount / totalQuestions) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => setShowConfirm(true)}
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 mt-4"
              >
                <FaCheckCircle />
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 text-blue-600 mb-2">
                  <span className="bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold">
                    Question {currentIndex + 1}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  {currentQuestion?.question_text}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQuestion?.options.map((option, index) => (
                  <div
                    key={option.option_id}
                    onClick={() =>
                      handleAnswer(
                        currentQuestion.question_id,
                        option.option_id,
                      )
                    }
                    className={`p-4 rounded-lg border cursor-pointer ${answers[currentQuestion.question_id] === option.option_id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${answers[currentQuestion.question_id] ===
                          option.option_id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800">{option.text}</p>
                      </div>
                      {answers[currentQuestion.question_id] ===
                        option.option_id && (
                          <FaCheckCircle className="text-blue-500" />
                        )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-8 pt-6 border-t">
                <button
                  onClick={prevQuestion}
                  disabled={currentIndex === 0}
                  className="px-5 py-2 rounded-lg border text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={nextQuestion}
                  disabled={currentIndex === totalQuestions - 1}
                  className="px-5 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
                >
                  Next <FaArrowRight />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaCheckCircle className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Submit Quiz?
              </h3>
              <p className="text-gray-600">
                You have answered {answeredCount} of {totalQuestions} questions.
                {answeredCount < totalQuestions &&
                  " Are you sure you want to submit?"}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
              >
                Continue
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Take;
