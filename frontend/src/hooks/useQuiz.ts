import { useState, useEffect, useCallback } from 'react';
import type { Quiz, Question, QuizAttempt } from '../types/types';
import {
    getQuiz,
    getQuizForTaking,
    getRecommendedQuizzes,
    getTrendingQuizzes,
    submitQuizAttempt
} from '../services/quizService';

export const useQuiz = (quizId: string) => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                const data = await getQuiz(quizId);
                setQuiz(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch quiz');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);

    return { quiz, loading, error, setQuiz };
};

export const useQuizTaking = (quizId: string) => {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Map<string, 'a' | 'b' | 'c' | 'd'>>(new Map());
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<QuizAttempt | null>(null);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                setLoading(true);
                const data = await getQuizForTaking(quizId);
                setQuiz(data.quiz);
                setQuestions(data.questions);
                setError(null);
            } catch (err) {
                setError('Failed to load quiz');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (quizId) {
            fetchQuizData();
        }
    }, [quizId]);

    const selectAnswer = useCallback((questionId: string, option: 'a' | 'b' | 'c' | 'd') => {
        setAnswers(prev => new Map(prev).set(questionId, option));
    }, []);

    const goToNext = useCallback(() => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    }, [currentIndex, questions.length]);

    const goToPrevious = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    const goToQuestion = useCallback((index: number) => {
        if (index >= 0 && index < questions.length) {
            setCurrentIndex(index);
        }
    }, [questions.length]);

    const submitQuiz = useCallback(async () => {
        try {
            setSubmitting(true);
            const timeTaken = Math.floor((Date.now() - startTime) / 1000);
            const answersArray = Array.from(answers.entries()).map(([question_id, selected_option]) => ({
                question_id,
                selected_option
            }));

            const attemptResult = await submitQuizAttempt({
                quiz_id: quizId,
                answers: answersArray,
                time_taken_seconds: timeTaken
            });

            setResult(attemptResult);
            return attemptResult;
        } catch (err) {
            setError('Failed to submit quiz');
            console.error(err);
            throw err;
        } finally {
            setSubmitting(false);
        }
    }, [answers, quizId, startTime]);

    const currentQuestion = questions[currentIndex] || null;
    const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
    const isComplete = answers.size === questions.length;

    return {
        quiz,
        questions,
        currentQuestion,
        currentIndex,
        answers,
        loading,
        submitting,
        error,
        result,
        progress,
        isComplete,
        selectAnswer,
        goToNext,
        goToPrevious,
        goToQuestion,
        submitQuiz
    };
};

export const useRecommendedQuizzes = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const data = await getRecommendedQuizzes();
                setQuizzes(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch recommended quizzes');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    return { quizzes, loading, error };
};

export const useTrendingQuizzes = () => {
    const [quizzes, setQuizzes] = useState<Quiz[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                const data = await getTrendingQuizzes();
                setQuizzes(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch trending quizzes');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, []);

    return { quizzes, loading, error };
};
