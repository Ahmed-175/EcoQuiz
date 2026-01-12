import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import QuizCard from '../components/quiz/QuizCard';
import CommunityCard from '../components/community/CommunityCard';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import type { Quiz, Community } from '../types/types';
import { getQuizzes } from '../services/quizService';
import { getCommunities } from '../services/communityService';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState<'quizzes' | 'communities'>(
    (searchParams.get('type') as 'quizzes' | 'communities') || 'quizzes'
  );
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const SUBJECT_OPTIONS = [
    { value: '', label: 'All Subjects' },
    { value: 'programming', label: 'Programming' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'science', label: 'Science' },
    { value: 'languages', label: 'Languages' },
    { value: 'history', label: 'History' },
    { value: 'other', label: 'Other' },
  ];

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        if (type === 'quizzes') {
          const response = await getQuizzes({ search: query, limit: 20 });
          setQuizzes(response.data);
        } else {
          const response = await getCommunities({ search: query, subject, limit: 20 });
          setCommunities(response.data);
        }
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    // Update URL params
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    params.set('type', type);
    if (subject) params.set('subject', subject);
    setSearchParams(params, { replace: true });
  }, [query, type, subject]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by useEffect
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Explore</h1>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search quizzes, communities..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-lg"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              icon={<FiFilter />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </form>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-6 bg-white rounded-xl border border-gray-200 animate-in fade-in slide-in-from-top-2">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  options={SUBJECT_OPTIONS}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setType('quizzes')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${type === 'quizzes'
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-200'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
          >
            Quizzes
          </button>
          <button
            onClick={() => setType('communities')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${type === 'communities'
              ? 'bg-violet-500 text-white shadow-lg shadow-violet-200'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
          >
            Communities
          </button>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {type === 'quizzes' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((quiz) => (
                  <QuizCard key={quiz.id} quiz={quiz} />
                ))}
                {quizzes.length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {communities.map((community) => (
                  <CommunityCard key={community.id} community={community} />
                ))}
                {communities.length === 0 && (
                  <div className="col-span-full text-center py-16">
                    <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No communities found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;