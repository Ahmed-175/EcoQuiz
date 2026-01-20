import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import QuickActions from "../components/home/QuickActions";
import HomeQuizCard from "../components/home/HomeQuizCard";
import RecommendedCommunities from "../components/home/RecommendedCommunities";
import { getQuizzes } from "../services/quizService";
import { getCommunities } from "../services/communityService";
import type { quizHome } from "../types/home.type";
import type { CommunityCard } from "../types/community.type";

const Home = () => {
  const [quizzes, setQuizzes] = useState<quizHome[]>([]);
  const [communities, setCommunities] = useState<CommunityCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resQuizzes, resCommunities] = await Promise.all([
          getQuizzes(),
          getCommunities(),
        ]);
        setQuizzes(resQuizzes.quizzes || []);
        setCommunities(resCommunities.communities || []);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen w-full bg-linear-to-br from-gray-50 via-white to-blue-50 pt-24 pb-12">
      <div className="w-full md:w-[70%]  mx-auto px-4">
        {/* Quick Actions */}
        <QuickActions />

        <div className="space-y-6">
          {quizzes.map((quiz) => (
            <HomeQuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>

        {/* Empty state */}
        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No quizzes available yet.</p>
            <p className="text-gray-400 text-sm mt-2">
              Create a quiz or join a community to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
