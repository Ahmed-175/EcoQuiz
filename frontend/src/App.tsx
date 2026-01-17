import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import User from "./pages/User";
import Profile from "./pages/Profile";
import Results from "./pages/quiz/Results";
import Take from "./pages/quiz/Take";
import Quiz from "./pages/quiz/Quiz";
import CreateCommunity from "./pages/community/CreateCommunity";
import Settings from "./pages/community/Settings";
import Community from "./pages/community/Community";
import Header from "./components/header/Header";
import Into from "./pages/Into";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import { useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { getUserProfile } from "./services/userService";
import CreateQuiz from "./pages/quiz/CreateQuiz";
import AllCommunities from "./pages/community/AllCommunities";

const App = () => {
  const { setUser, setLoading } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const user = await getUserProfile();
        setUser(user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setUser, setLoading]);

  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Into />
            </PublicRoute>
          }
        />
        <Route path="/search" element={<Search />} />
        <Route path="/community/:id" element={<Community />} />
        <Route path="/quiz/:id" element={<Quiz />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/commuinties"
          element={
            <ProtectedRoute>
              <AllCommunities />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/create"
          element={
            <ProtectedRoute>
              <CreateCommunity />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community/:id/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/create"
          element={
            <ProtectedRoute>
              <CreateQuiz />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:id/take"
          element={
            <ProtectedRoute>
              <Take />
            </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/:id/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <User />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
