import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiSave, FiArrowLeft } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import type { CreateQuizForm, CreateQuestionForm } from '../../types/types';
import { createQuiz } from '../../services/quizService';
import { useCommunities } from '../../hooks/useCommunities';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { communities } = useCommunities();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateQuizForm>({
    community_id: '',
    title: '',
    description: '',
    duration_minutes: 30,
    questions: [createEmptyQuestion()]
  });

  function createEmptyQuestion(): CreateQuestionForm {
    return {
      question_text: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: 'a',
      explanation: ''
    };
  }

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [...prev.questions, createEmptyQuestion()]
    }));
  };

  const removeQuestion = (index: number) => {
    if (formData.questions.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updateQuestion = (index: number, field: keyof CreateQuestionForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) =>
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.community_id) {
      setError('Please select a community');
      return;
    }
    if (!formData.title.trim()) {
      setError('Please enter a quiz title');
      return;
    }
    if (formData.questions.some(q => !q.question_text.trim() || !q.option_a.trim() || !q.option_b.trim() || !q.option_c.trim() || !q.option_d.trim())) {
      setError('Please fill in all question fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const quiz = await createQuiz(formData);
      navigate(`/quiz/${quiz.id}`);
    } catch (err) {
      setError('Failed to create quiz. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Quiz</h1>
          <p className="text-gray-600">Create an engaging quiz to test knowledge</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Quiz Details */}
          <Card className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quiz Details</h2>

            <div className="space-y-6">
              <Select
                label="Community *"
                value={formData.community_id}
                onChange={(e) => setFormData(prev => ({ ...prev, community_id: e.target.value }))}
                options={communities.map(c => ({ value: c.id, label: c.name }))}
                placeholder="Select a community"
              />

              <Input
                label="Quiz Title *"
                placeholder="e.g., JavaScript Fundamentals"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />

              <Textarea
                label="Description"
                placeholder="What will learners gain from this quiz?"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />

              <Input
                label="Duration (minutes)"
                type="number"
                min={5}
                max={180}
                value={formData.duration_minutes}
                onChange={(e) => setFormData(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 30 }))}
              />
            </div>
          </Card>

          {/* Questions */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Questions ({formData.questions.length})</h2>
              <Button type="button" variant="outline" icon={<FiPlus />} onClick={addQuestion}>
                Add Question
              </Button>
            </div>

            {formData.questions.map((question, qIndex) => (
              <Card key={qIndex} className="relative">
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    Q{qIndex + 1}
                  </span>
                  {formData.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 />
                    </button>
                  )}
                </div>

                <div className="space-y-4 pt-8">
                  <Textarea
                    label="Question *"
                    placeholder="Enter your question..."
                    value={question.question_text}
                    onChange={(e) => updateQuestion(qIndex, 'question_text', e.target.value)}
                    rows={2}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['a', 'b', 'c', 'd'] as const).map((option) => (
                      <div key={option} className="flex items-start gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold ${question.correct_answer === option
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                          }`}>
                          {option.toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <Input
                            placeholder={`Option ${option.toUpperCase()}`}
                            value={question[`option_${option}`]}
                            onChange={(e) => updateQuestion(qIndex, `option_${option}`, e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Select
                    label="Correct Answer *"
                    value={question.correct_answer}
                    onChange={(e) => updateQuestion(qIndex, 'correct_answer', e.target.value)}
                    options={[
                      { value: 'a', label: 'Option A' },
                      { value: 'b', label: 'Option B' },
                      { value: 'c', label: 'Option C' },
                      { value: 'd', label: 'Option D' }
                    ]}
                  />

                  <Textarea
                    label="Explanation (optional)"
                    placeholder="Explain why this is the correct answer..."
                    value={question.explanation || ''}
                    onChange={(e) => updateQuestion(qIndex, 'explanation', e.target.value)}
                    rows={2}
                  />
                </div>
              </Card>
            ))}
          </div>

          {/* Submit */}
          <div className="mt-8 flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={<FiSave />} loading={loading}>
              Create Quiz
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;