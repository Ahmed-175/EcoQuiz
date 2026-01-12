import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiGlobe, FiLock, FiUsers, FiEdit } from 'react-icons/fi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import type { CreateCommunityForm } from '../../types/types';
import { createCommunity } from '../../services/communityService';

const SUBJECT_OPTIONS = [
  { value: 'programming', label: 'Programming' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
  { value: 'languages', label: 'Languages' },
  { value: 'history', label: 'History' },
  { value: 'geography', label: 'Geography' },
  { value: 'arts', label: 'Arts & Music' },
  { value: 'business', label: 'Business' },
  { value: 'health', label: 'Health & Fitness' },
  { value: 'other', label: 'Other' },
];

const CreateCommunity = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateCommunityForm>({
    name: '',
    description: '',
    subject: '',
    is_public: true,
    allow_public_quiz_submission: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter a community name');
      return;
    }
    if (!formData.subject) {
      setError('Please select a subject');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const community = await createCommunity(formData);
      navigate(`/community/${community.id}`);
    } catch (err) {
      setError('Failed to create community. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8 max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FiArrowLeft /> Back
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Community</h1>
          <p className="text-gray-600">Build a space for learners to share and grow together</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <div className="space-y-6">
              <Input
                label="Community Name *"
                placeholder="e.g., JavaScript Developers"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                icon={<FiUsers />}
              />

              <Textarea
                label="Description"
                placeholder="What is this community about?"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />

              <Select
                label="Subject *"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                options={SUBJECT_OPTIONS}
                placeholder="Choose a subject area"
              />
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Privacy Settings</h3>
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_public: true }))}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${formData.is_public
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <FiGlobe className={`w-6 h-6 mt-0.5 ${formData.is_public ? 'text-blue-500' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium text-gray-900">Public</p>
                    <p className="text-sm text-gray-500">Anyone can find and join this community</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_public: false }))}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${!formData.is_public
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <FiLock className={`w-6 h-6 mt-0.5 ${!formData.is_public ? 'text-blue-500' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium text-gray-900">Private</p>
                    <p className="text-sm text-gray-500">Only invited members can join</p>
                  </div>
                </div>
              </button>
            </div>
          </Card>

          {/* Quiz Permissions */}
          <Card className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quiz Creation</h3>
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, allow_public_quiz_submission: false }))}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${!formData.allow_public_quiz_submission
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <FiLock className={`w-6 h-6 mt-0.5 ${!formData.allow_public_quiz_submission ? 'text-violet-500' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium text-gray-900">Admins Only</p>
                    <p className="text-sm text-gray-500">Only admins can create quizzes</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, allow_public_quiz_submission: true }))}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${formData.allow_public_quiz_submission
                    ? 'border-violet-500 bg-violet-50'
                    : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <FiEdit className={`w-6 h-6 mt-0.5 ${formData.allow_public_quiz_submission ? 'text-violet-500' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium text-gray-900">All Members</p>
                    <p className="text-sm text-gray-500">Any member can create quizzes</p>
                  </div>
                </div>
              </button>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="secondary" icon={<FiSave />} loading={loading}>
              Create Community
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCommunity;