import { useState, useRef } from 'react';
import { FiEdit2, FiCamera, FiBarChart2, FiAward, FiBook, FiUsers, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { getBanner } from '../utils/getBanner';
import { updateProfile, uploadAvatar, uploadBanner, logout } from '../services/userService';
import type { UserQuizStats } from '../types/types';

const Profile = () => {
  const { user, setUser, loading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  // Mock stats - in real app, fetch from API
  const [stats] = useState<UserQuizStats>({
    user_id: user?.id || '',
    total_quizzes_taken: 15,
    average_score: 78.5,
    best_score: 98,
    updated_at: new Date().toISOString()
  });

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    navigate('/');
    return null;
  }

  const handleSave = async () => {
    if (!username.trim() || username === user.username) {
      setIsEditing(false);
      return;
    }

    try {
      setSaving(true);
      await updateProfile(username, user.avatar, user.banner);
      setUser(prev => prev ? { ...prev, username } : prev);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { url } = await uploadAvatar(file);
      setUser(prev => prev ? { ...prev, avatar: url } : prev);
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { url } = await uploadBanner(file);
      setUser(prev => prev ? { ...prev, banner: url } : prev);
    } catch (error) {
      console.error('Failed to upload banner:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Banner */}
      <div className="relative h-48 md:h-64">
        <img
          src={getBanner(user.banner)}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <button
          onClick={() => bannerInputRef.current?.click()}
          className="absolute bottom-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <FiCamera className="w-5 h-5 text-gray-700" />
        </button>
        <input
          ref={bannerInputRef}
          type="file"
          accept="image/*"
          onChange={handleBannerChange}
          className="hidden"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 -mt-16 relative z-10 pb-12">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {/* Avatar */}
            <div className="relative -mt-20 md:-mt-16">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                    {user.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-gray-800 rounded-full text-white hover:bg-gray-700 transition-colors"
              >
                <FiCamera className="w-4 h-4" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="flex items-center gap-3 mb-2">
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="max-w-xs"
                  />
                  <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
                    Save
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    setIsEditing(false);
                    setUsername(user.username);
                  }}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {user.username}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FiEdit2 className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              )}
              <p className="text-gray-500 mb-4">{user.email}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button variant="outline" icon={<FiLogOut />} onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-3">
              <FiBook className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total_quizzes_taken}</p>
            <p className="text-sm text-gray-500">Quizzes Taken</p>
          </Card>

          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-3">
              <FiBarChart2 className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.average_score.toFixed(0)}%</p>
            <p className="text-sm text-gray-500">Average Score</p>
          </Card>

          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-3">
              <FiAward className="w-6 h-6 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.best_score}%</p>
            <p className="text-sm text-gray-500">Best Score</p>
          </Card>

          <Card className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-100 rounded-xl mb-3">
              <FiUsers className="w-6 h-6 text-violet-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-sm text-gray-500">Communities</p>
          </Card>
        </div>

        {/* Recent Activity - placeholder */}
        <Card>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          <div className="text-center py-12 text-gray-500">
            <FiBook className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Your quiz activity will appear here</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
