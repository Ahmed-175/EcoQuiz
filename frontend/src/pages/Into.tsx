import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { baseUrl } from "../utils/baseUrl";
import {
  FiArrowRight,
  FiBarChart2,
  FiUsers,
  FiAward,
  FiBookOpen,
} from "react-icons/fi";
import Loading from "../components/Loading";

const Intro = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }
  const features = [
    {
      icon: <FiBarChart2 />,
      title: "Track Progress",
      desc: "Monitor your learning journey with detailed analytics",
    },
    {
      icon: <FiUsers />,
      title: "Community",
      desc: "Join thousands of learners worldwide",
    },
    {
      icon: <FiAward />,
      title: "Achievements",
      desc: "Earn badges and certificates",
    },
    {
      icon: <FiBookOpen />,
      title: "Diverse Topics",
      desc: "From science to arts and everything between",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Users" },
    { value: "500+", label: "Quizzes" },
    { value: "50+", label: "Categories" },
    { value: "98%", label: "Satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 overflow-hidden">
      <div className="container mx-auto px-4  pb-16 md:pt-32 md:pb-24">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-left space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Interactive Learning Platform
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-cyan-600 to-blue-600  bg-clip-text text-transparent">
                  Learn, Compete,
                </span>
                <br />
                <span className="text-gray-800">and Grow Together</span>
              </h1>

              <p className="text-xl text-gray-600 max-w-2xl">
                Join our community of passionate learners. Test your knowledge,
                challenge friends, and track your progress with our interactive
                quiz platform.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-4">
              {stats.map((stat, index) => (
                <div key={index} className="text-center md:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-200 hover:scale-[1.02] transition-all duration-300"
                  >
                    <span>Get Started</span>
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl border-2 border-zinc-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
                  >
                    <span className="text-emerald-600">Register Now</span>
                    <FiArrowRight className="text-emerald-600" />
                  </Link>
                </>
              ) : (
                <Link
                  to="/home"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-green-200 hover:scale-[1.02] transition-all duration-300"
                >
                  <span>Go to Home</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}

              <Link
                to="/explore"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-800 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
              >
                <span>Explore Quizzes</span>
                <FiArrowRight />
              </Link>
            </div>
          </div>

          <div className="lg:w-1/2 relative">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-3xl blur-xl opacity-20"></div>
              <img
                src="./college entrance exam-rafiki.png"
                alt="Learning Illustration"
                className="relative w-full max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-r from-violet-400 to-purple-400 rounded-2xl rotate-12 opacity-10"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-3xl -rotate-12 opacity-10"></div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20 md:pb-32">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-blue-600">EcoQuiz</span>?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover features designed to enhance your learning experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-6 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <div className="text-2xl text-blue-600">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="container mx-auto px-4 pb-16">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already improving their knowledge
            with EcoQuiz
          </p>
          {!user && (
            <Link
              to={`${baseUrl}/auth/google`}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <img
                src="./google-icon-logo-png-transparent.png"
                alt="google"
                className="w-6 h-6"
              />
              <span>Start Learning for Free</span>
              <FiArrowRight />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Intro;
