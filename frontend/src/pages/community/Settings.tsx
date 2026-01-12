import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSave, FiTrash2, FiGlobe, FiLock, FiEdit } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/Loading';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import Modal from '../../components/ui/Modal';
import type { Community, CreateCommunityForm } from '../../types/types';
import { getCommunity, updateCommunity, deleteCommunity } from '../../services/communityService';

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

const Settings = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState<CreateCommunityForm>({
    name: '',
    description: '',
    subject: '',
    is_public: true,
    allow_public_quiz_submission: false,
  });

  useEffect(() => {
    const fetchCommunity = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getCommunity(id);
        setCommunity(data);
        setFormData({
          name: data.name,
          description: data.description,
          subject: data.subject,
          is_public: data.is_public,
          allow_public_quiz_submission: data.allow_public_quiz_submission,
        });
      } catch (error) {
        console.error('Failed to fetch community:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      setSaving(true);
      setError(null);
      await updateCommunity(id, formData);
      navigate(`/community/${id}`);
    } catch (err) {
      setError('Failed to update community');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      setDeleting(true);
      await deleteCommunity(id);
      navigate('/home');
    } catch (err) {
      setError('Failed to delete community');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <Loading />;
  if (!community) return <div className="text-center py-20">Community not found</div>;
  if (user?.id !== community.creator_id) {
    navigate(`/community/${id}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8 max-w-2xl">
        <button
          onClick={() => navigate(`/community/${id}`)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <FiArrowLeft /> Back to Community
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Settings</h1>
          <p className="text-gray-600">Manage your community settings</p>
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
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />

              <Textarea
                label="Description"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />

              <Select
                label="Subject *"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                options={SUBJECT_OPTIONS}
              />
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Privacy</h3>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_public: true }))}
                className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${formData.is_public ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
              >
                <FiGlobe className={`w-6 h-6 mx-auto mb-2 ${formData.is_public ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="font-medium">Public</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, is_public: false }))}
                className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${!formData.is_public ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
              >
                <FiLock className={`w-6 h-6 mx-auto mb-2 ${!formData.is_public ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="font-medium">Private</p>
              </button>
            </div>
          </Card>

          {/* Quiz Permissions */}
          <Card className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Who can create quizzes?</h3>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, allow_public_quiz_submission: false }))}
                className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${!formData.allow_public_quiz_submission ? 'border-violet-500 bg-violet-50' : 'border-gray-200'
                  }`}
              >
                <FiLock className={`w-6 h-6 mx-auto mb-2 ${!formData.allow_public_quiz_submission ? 'text-violet-500' : 'text-gray-400'}`} />
                <p className="font-medium">Admins Only</p>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, allow_public_quiz_submission: true }))}
                className={`flex-1 p-4 rounded-xl border-2 text-center transition-all ${formData.allow_public_quiz_submission ? 'border-violet-500 bg-violet-50' : 'border-gray-200'
                  }`}
              >
                <FiEdit className={`w-6 h-6 mx-auto mb-2 ${formData.allow_public_quiz_submission ? 'text-violet-500' : 'text-gray-400'}`} />
                <p className="font-medium">All Members</p>
              </button>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="danger"
              icon={<FiTrash2 />}
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Community
            </Button>
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(`/community/${id}`)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" icon={<FiSave />} loading={saving}>
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Community"
        size="sm"
      >
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete <strong>{community.name}</strong>? This action cannot be undone.
            All quizzes and data will be permanently removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;