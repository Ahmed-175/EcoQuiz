import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiSettings, FiUsers, FiBook, FiPlus, FiLogOut, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import Loading from '../../components/Loading';
import Button from '../../components/ui/Button';
import QuizCard from '../../components/quiz/QuizCard';
import MemberList from '../../components/community/MemberList';
import type { Community, CommunityMember, Quiz } from '../../types/types';
import { getCommunity, getCommunityMembers, joinCommunity, leaveCommunity, checkMembership } from '../../services/communityService';
import { getCommunityQuizzes } from '../../services/quizService';

const CommunityPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [membership, setMembership] = useState<{ isMember: boolean; role?: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'quizzes' | 'members'>('quizzes');
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const [communityData, membersData, quizzesData, membershipData] = await Promise.all([
          getCommunity(id),
          getCommunityMembers(id),
          getCommunityQuizzes(id),
          user ? checkMembership(id) : Promise.resolve({ isMember: false })
        ]);
        setCommunity(communityData);
        setMembers(membersData);
        setQuizzes(quizzesData);
        setMembership(membershipData);
      } catch (error) {
        console.error('Failed to fetch community:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleJoinLeave = async () => {
    if (!id || !user) return;
    try {
      setJoining(true);
      if (membership?.isMember) {
        await leaveCommunity(id);
        setMembership({ isMember: false });
        setMembers(prev => prev.filter(m => m.user_id !== user.id));
      } else {
        await joinCommunity(id);
        setMembership({ isMember: true, role: 'member' });
        // Refresh members
        const membersData = await getCommunityMembers(id);
        setMembers(membersData);
      }
    } catch (error) {
      console.error('Failed to join/leave:', error);
    } finally {
      setJoining(false);
    }
  };

  if (loading) return <Loading />;
  if (!community) return <div className="text-center py-20">Community not found</div>;

  const isCreator = user?.id === community.creator_id;
  const isAdmin = membership?.role === 'admin' || membership?.role === 'creator';
  const canCreateQuiz = membership?.isMember && (community.allow_public_quiz_submission || isAdmin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              {/* Subject badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 text-violet-600 rounded-full text-sm font-medium mb-4">
                {community.subject}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {community.name}
              </h1>

              <p className="text-gray-600 text-lg mb-4">
                {community.description}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <FiUsers className="w-5 h-5" />
                  <span>{members.length} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiBook className="w-5 h-5" />
                  <span>{quizzes.length} quizzes</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {user && membership?.isMember ? (
                <>
                  {canCreateQuiz && (
                    <Link to={`/quiz/create?community=${id}`}>
                      <Button variant="primary" icon={<FiPlus />}>Create Quiz</Button>
                    </Link>
                  )}
                  {isCreator && (
                    <Link to={`/community/${id}/settings`}>
                      <Button variant="outline" icon={<FiSettings />}>Settings</Button>
                    </Link>
                  )}
                  {!isCreator && (
                    <Button
                      variant="outline"
                      icon={<FiLogOut />}
                      onClick={handleJoinLeave}
                      loading={joining}
                    >
                      Leave
                    </Button>
                  )}
                </>
              ) : user ? (
                <Button
                  variant="primary"
                  icon={<FiUserPlus />}
                  onClick={handleJoinLeave}
                  loading={joining}
                >
                  Join Community
                </Button>
              ) : (
                <Link to="/">
                  <Button variant="primary">Sign In to Join</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-8 border-b border-gray-200 -mb-px">
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${activeTab === 'quizzes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <FiBook className="inline-block mr-2" />
              Quizzes ({quizzes.length})
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${activeTab === 'members'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
            >
              <FiUsers className="inline-block mr-2" />
              Members ({members.length})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        {activeTab === 'quizzes' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} showCommunity={false} />
            ))}
            {quizzes.length === 0 && (
              <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-200">
                <FiBook className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No quizzes in this community yet.</p>
                {canCreateQuiz && (
                  <Link to={`/quiz/create?community=${id}`}>
                    <Button variant="primary" icon={<FiPlus />}>Create First Quiz</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-3xl">
            <MemberList
              members={members}
              isAdmin={isAdmin}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;