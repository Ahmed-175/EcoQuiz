import { useState } from "react";
import {
  FaExclamationCircle,
  FaTimes,
  FaPlus,
  FaQuestionCircle,
} from "react-icons/fa";
import { createQuiz } from "../../services/quizService";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { CreateQuizForm, CreateQuestionForm } from "../../types/types";

// Extracted Components
import QuizHeaderCreation from "../../components/quiz/create/QuizHeaderCreation";
import QuizMetadataInputs from "../../components/quiz/create/QuizMetadataInputs";
import QuestionCard from "../../components/quiz/create/QuestionCard";
import CreateQuizActions from "../../components/quiz/create/CreateQuizActions";

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCommunity = searchParams.get("community") || "";

  const [communityId] = useState(preselectedCommunity);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState<number>(15);
  const [isPublished, setIsPublished] = useState(true);
  const [questions, setQuestions] = useState<CreateQuestionForm[]>([
    {
      question_text: "",
      explanation: "",
      correct_answer: "",
      order_index: 1,
      options: [
        { text: "", is_correct: true },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
        { text: "", is_correct: false },
      ],
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        explanation: "",
        correct_answer: "",
        order_index: questions.length + 1,
        options: [
          { text: "", is_correct: true },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      setError("Quiz must have at least one question");
      return;
    }
    const updated = questions.filter((_, i) => i !== index);
    const reordered = updated.map((q, i) => ({ ...q, order_index: i + 1 }));
    setQuestions(reordered);
  };

  const updateQuestion = (
    index: number,
    field: keyof CreateQuestionForm,
    value: string,
  ) => {
    const updated = [...questions];
    (updated[index] as any)[field] = value;
    setQuestions(updated);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    text: string,
  ) => {
    const updated = [...questions];
    updated[questionIndex].options[optionIndex].text = text;
    if (updated[questionIndex].options[optionIndex].is_correct) {
      updated[questionIndex].correct_answer = text;
    }
    setQuestions(updated);
  };

  const setCorrectOption = (questionIndex: number, optionIndex: number) => {
    const updated = [...questions];
    updated[questionIndex].options = updated[questionIndex].options.map(
      (o) => ({ ...o, is_correct: false }),
    );
    updated[questionIndex].options[optionIndex].is_correct = true;
    updated[questionIndex].correct_answer =
      updated[questionIndex].options[optionIndex].text;
    setQuestions(updated);
  };

  const validateForm = (): boolean => {
    if (!communityId) {
      setError("Please select a community");
      return false;
    }
    if (!title.trim()) {
      setError("Please enter a quiz title");
      return false;
    }
    if (durationMinutes < 1) {
      setError("Duration must be at least 1 minute");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text.trim()) {
        setError(`Question ${i + 1} is empty`);
        return false;
      }
      if (q.options.length !== 4) {
        setError(`Question ${i + 1} must have exactly 4 options`);
        return false;
      }
      const emptyOptions = q.options.filter((o) => !o.text.trim());
      if (emptyOptions.length > 0) {
        setError(`Question ${i + 1} has empty options`);
        return false;
      }
      const correctOptions = q.options.filter((o) => o.is_correct);
      if (correctOptions.length !== 1) {
        setError(`Question ${i + 1} must have exactly one correct answer`);
        return false;
      }
    }
    return true;
  };

  const handleCreateQuiz = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setError(null);
    try {
      const preparedQuestions = questions.map((q) => {
        const correctOption = q.options.find((o) => o.is_correct);
        return {
          ...q,
          correct_answer: correctOption?.text || q.correct_answer,
        };
      });

      const quizData: CreateQuizForm = {
        community_id: communityId,
        title: title.trim(),
        description: description.trim(),
        duration_minutes: durationMinutes,
        is_published: isPublished,
        questions: preparedQuestions,
      };

      await createQuiz(quizData);
      navigate(`/community/${communityId}`);
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message?.includes("Network Error")) {
        setError("Failed to connect to the server. Please check your connection.");
      } else {
        setError("An error occurred while creating the quiz");
      }
    } finally {
      setIsLoading(false);
    }
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
                onClick={() => setError(null)}
                className="ml-4 text-red-400 hover:text-red-600"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>
      )}

      <QuizHeaderCreation />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
        <QuizMetadataInputs
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          durationMinutes={durationMinutes}
          setDurationMinutes={setDurationMinutes}
        />

        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-6">
            {questions.map((question, qIndex) => (
              <QuestionCard
                key={qIndex}
                question={question}
                qIndex={qIndex}
                totalQuestions={questions.length}
                removeQuestion={removeQuestion}
                updateQuestion={updateQuestion}
                updateOption={updateOption}
                setCorrectOption={setCorrectOption}
              />
            ))}
          </div>

          <div className="flex items-center justify-between mt-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <FaQuestionCircle className="text-indigo-600" />
              Questions
            </h2>
            <button
              type="button"
              onClick={addQuestion}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl hover:from-blue-600 hover:to-indigo-600 transition"
            >
              <FaPlus className="text-sm" />
              Add Question
            </button>
          </div>
        </div>

        <CreateQuizActions
          isPublished={isPublished}
          setIsPublished={setIsPublished}
          handleCreateQuiz={handleCreateQuiz}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CreateQuiz;
